import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OrderDetail from "../OrderDetail";

const { mocks } = vi.hoisted(() => ({ mocks: {
  api: { get: vi.fn(), post: vi.fn() }, toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
  materialProps: null,
} }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => mocks.api }));
vi.mock("../../../components/Toast", () => ({ useToast: () => mocks.toast }));
vi.mock("../../../hooks/useFormatCurrency", () => ({ useFormatCurrency: () => (value) => String(value) }));
vi.mock("../../../hooks/useFulfillmentStatus", () => ({ useFulfillmentStatus: () => ({ data: null, loading: false, error: null, refetch: vi.fn() }) }));
vi.mock("../../../components/orders/BlockingIssuesPanel", () => ({ default: () => null }));
vi.mock("../../../components/orders/FulfillmentProgress", () => ({ default: () => null }));
vi.mock("../../../components/orders/OrderWorkflowPanel", () => ({ default: () => null }));
vi.mock("../../../components/orders/CapacityRequirementsSection", () => ({ default: () => null }));
vi.mock("../../../components/orders/PaymentsSection", () => ({ default: () => null }));
vi.mock("../../../components/orders/ShippingAddressSection", () => ({ default: () => null }));
vi.mock("../../../components/ActivityTimeline", () => ({ default: () => null }));
vi.mock("../../../components/ShippingTimeline", () => ({ default: () => null }));
vi.mock("../../../components/orders/MaterialRequirementsSection", async (importOriginal) => {
  const { default: Actual } = await importOriginal();
  return { default: (props) => { mocks.materialProps = props; return <Actual {...props} />; } };
});

const order = { id: 1001, order_number: "SO-MATERIAL", order_type: "line_item", status: "draft", payment_status: "pending", grand_total: 50, quantity: 2, lines: [{ id: 101, product_id: 42, product_name: "Peça", quantity: 2, unit_price: 25, total: 50, shipped_quantity: 0 }] };
const material = { product_id: 7, product_sku: "MAT7", product_name: "Material", quantity_required: "5", quantity_available: "5", quantity_short: "0" };
function setup({ primary = { requirements: [material], summary: { has_shortages: false, materials_short: 0, total_materials: 1 } }, mrp, bom } = {}) {
  mocks.api.get.mockImplementation((path) => {
    if (path.includes("material-requirements")) return primary instanceof Error ? Promise.reject(primary) : Promise.resolve(primary);
    if (path.includes("mrp/requirements")) return mrp instanceof Error ? Promise.reject(mrp) : Promise.resolve(mrp || {});
    if (path.includes("mrp/explode-bom")) return Promise.resolve(bom || {});
    if (path === "/api/v1/sales-orders/1001") return Promise.resolve(order);
    if (path.includes("production-orders") || path.includes("invoices") || path.includes("payments")) return Promise.resolve({ items: [] });
    return Promise.resolve({});
  });
  return render(<MemoryRouter initialEntries={["/admin/orders/1001"]}><Routes><Route path="/admin/orders/:orderId" element={<OrderDetail />} /></Routes></MemoryRouter>);
}
const mapped = async () => {
  await waitFor(() => expect(mocks.materialProps?.exploding).toBe(false));
  expect(mocks.materialProps.materialRequirements).toHaveLength(1);
  return mocks.materialProps.materialRequirements[0];
};
beforeEach(() => { vi.clearAllMocks(); mocks.materialProps = null; });
afterEach(cleanup);

describe("cost provenance through the real child", () => {
  it.each(["primary", "bom"])("never invents cost in %s source", async (route) => {
    if (route === "primary") setup();
    else setup({ primary: new Error("missing"), mrp: new Error("missing"), bom: { components: [{ product_id: 7, gross_quantity: "4" }] } });
    expect((await mapped()).unit_cost).toBeNull();
    expect(screen.getByText("Estimativa: Não informado")).toBeInTheDocument();
  });
  it.each([undefined, null, "", "3kg", "0x10", "0b10", Infinity, "1e999", true])("rejects MRP cost %s without partial parsing", async (cost) => {
    setup({ primary: new Error("missing"), mrp: { requirements: [{ product_id: 7, gross_quantity: "4", available_quantity: "3", incoming_quantity: "1", safety_stock: "0", unit_cost: cost }] } });
    expect((await mapped()).unit_cost).toBeNull();
    expect(screen.getByText("Estimativa: Não informado")).toBeInTheDocument();
  });
  it.each([["3", 3, 24], ["0", 0, 0], ["1e2", 100, 800]])("retains known MRP cost %s and existing scaled arithmetic", async (cost, mappedCost, total) => {
    setup({ primary: new Error("missing"), mrp: { requirements: [{ product_id: 7, gross_quantity: "4", available_quantity: "3", incoming_quantity: "1", safety_stock: "0", unit_cost: cost }] } });
    expect((await mapped()).unit_cost).toBe(mappedCost);
    expect(screen.getByText(`Estimativa: ${total}`)).toBeInTheDocument();
    expect(mocks.api.post).not.toHaveBeenCalled();
  });
  it("does not total mixed known and unknown MRP costs", async () => {
    setup({ primary: new Error("missing"), mrp: { requirements: [{ product_id: 7, gross_quantity: 4, unit_cost: 3 }, { product_id: 8, gross_quantity: 2, unit_cost: null }] } });
    await waitFor(() => expect(mocks.materialProps?.materialRequirements).toHaveLength(2));
    expect(await screen.findByText("Estimativa: Não informado")).toBeInTheDocument();
  });
  it.each([0, null])("keeps MRP gross quantity %s distinct in the cost estimate", async (gross) => {
    setup({ primary: new Error("missing"), mrp: { requirements: [{ product_id: 7, gross_quantity: gross, available_quantity: 0, incoming_quantity: 0, safety_stock: 0, unit_cost: 3 }] } });
    await mapped(); expect(screen.getByText(gross === 0 ? "Estimativa: 0" : "Estimativa: Não informado")).toBeInTheDocument();
  });
});

describe("OrderDetail material quantity provenance to real MaterialRequirementsSection", () => {
  it.each([undefined, null, "", "invalid", "3kg", "0x10", "0b10", Infinity, true])("keeps unknown primary quantity %s unknown at the child boundary", async (value) => {
    setup({ primary: { requirements: [{ ...material, quantity_required: value, quantity_available: value, quantity_short: value }], summary: { has_shortages: false, materials_short: 0, total_materials: 1 } } });
    expect(await mapped()).toMatchObject({ gross_quantity: null, available_quantity: null, on_hand_quantity: null, net_shortage: null, unit_cost: null });
    const cells = within(screen.getByText("MAT7 - Material").closest("tr")).getAllByRole("cell");
    expect(cells[2]).toHaveTextContent("Não informado");
    expect(cells[3]).toHaveTextContent("Não informado");
    expect(cells[4]).toHaveTextContent("Não informado");
    expect(screen.queryByText("Todos os materiais estão disponíveis")).not.toBeInTheDocument();
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it.each([0, "0", "0.00"])("preserves primary confirmed zero %s as zero", async (value) => {
    setup({ primary: { requirements: [{ ...material, quantity_required: value, quantity_available: value, quantity_short: value }], summary: { has_shortages: false, materials_short: 0, total_materials: 1 } } });
    expect(await mapped()).toMatchObject({ gross_quantity: 0, available_quantity: 0, on_hand_quantity: 0, net_shortage: 0 });
    expect(screen.getByText("Todos os materiais estão disponíveis")).toBeInTheDocument();
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it("retains a valid primary Decimal projection with unknown source cost", async () => {
    setup();
    expect(await mapped()).toMatchObject({ product_id: 7, gross_quantity: 5, available_quantity: 5, net_shortage: 0, unit_cost: null });
    expect(screen.getByText("Todos os materiais estão disponíveis")).toBeInTheDocument();
  });

  it("keeps missing fallback MRP inputs unknown rather than deriving zero shortage", async () => {
    setup({ primary: new Error("not available"), mrp: { requirements: [{ product_id: 7, product_sku: "MAT7", product_name: "Material", gross_quantity: null, available_quantity: null, on_hand_quantity: null, incoming_quantity: "0", safety_stock: "0", unit_cost: "3" }] } });
    expect(await mapped()).toMatchObject({ gross_quantity: null, available_quantity: null, on_hand_quantity: null, net_shortage: null, unit_cost: 3 });
    expect(screen.getByText("Disponibilidade não confirmada")).toBeInTheDocument();
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it("preserves the existing MRP arithmetic when all inputs are known", async () => {
    setup({ primary: new Error("not available"), mrp: { requirements: [{ product_id: 7, product_sku: "MAT7", product_name: "Material", gross_quantity: "4", available_quantity: "3", on_hand_quantity: "3", incoming_quantity: "1", safety_stock: "0", unit_cost: "3" }] } });
    expect(await mapped()).toMatchObject({ gross_quantity: 8, available_quantity: 3, on_hand_quantity: 3, net_shortage: 4, unit_cost: 3 });
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it.each(["gross_quantity", "available_quantity", "incoming_quantity", "safety_stock"])("does not derive fallback shortage when %s is missing", async (field) => {
    const req = { product_id: 7, product_sku: "MAT7", product_name: "Material", gross_quantity: "4", available_quantity: "3", on_hand_quantity: "3", incoming_quantity: "1", safety_stock: "0", unit_cost: "3", [field]: undefined };
    setup({ primary: new Error("not available"), mrp: { requirements: [req] } });
    expect((await mapped()).net_shortage).toBeNull();
    expect(screen.getByText("Disponibilidade não confirmada")).toBeInTheDocument();
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it("does not invent zero stock or a stock shortage from the BOM-only response", async () => {
    setup({ primary: new Error("not available"), mrp: new Error("not available"), bom: { components: [{ product_id: 7, product_sku: "MAT7", product_name: "Material", gross_quantity: "4.5" }] } });
    expect(await mapped()).toMatchObject({ gross_quantity: 4.5, available_quantity: null, on_hand_quantity: null, net_shortage: null, unit_cost: null });
    expect(screen.getByText("Disponibilidade não confirmada")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Criar pedido de compra" })).not.toBeInTheDocument();
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it.each(["0x10", "0b10"])("rejects radix %s in fallback MRP quantities (F8-01)", async (value) => {
    setup({ primary: new Error("unavailable"), mrp: { requirements: [{ product_id: 7, product_sku: "MAT7", product_name: "Material", gross_quantity: value, available_quantity: value, on_hand_quantity: value, incoming_quantity: "0", safety_stock: "0", unit_cost: "3" }] } });
    expect(await mapped()).toMatchObject({ gross_quantity: null, available_quantity: null, on_hand_quantity: null, net_shortage: null, unit_cost: 3 });
    expect(screen.queryByText("Todos os materiais estão disponíveis")).not.toBeInTheDocument();
  });

  it.each(["0x10", "0b10"])("rejects radix %s in BOM-only required quantity (F8-01)", async (value) => {
    setup({ primary: new Error("unavailable"), mrp: new Error("unavailable"), bom: { components: [{ product_id: 7, product_sku: "MAT7", product_name: "Material", gross_quantity: value }] } });
    expect(await mapped()).toMatchObject({ gross_quantity: null, available_quantity: null, net_shortage: null });
    expect(screen.queryByText("Todos os materiais estão disponíveis")).not.toBeInTheDocument();
  });

  it.each(["primary", "mrp", "bom"])("retains scientific Decimal1e2 in the %s mapper", async (route) => {
    if (route === "primary") setup({ primary: { requirements: [{ ...material, quantity_required: "1e2", quantity_available: "1e2" }], summary: { has_shortages: false, materials_short: 0, total_materials: 1 } } });
    if (route === "mrp") setup({ primary: new Error("unavailable"), mrp: { requirements: [{ product_id: 7, product_sku: "MAT7", product_name: "Material", gross_quantity: "1e2", available_quantity: "1e2", on_hand_quantity: "1e2", incoming_quantity: "0", safety_stock: "0", unit_cost: "3" }] } });
    if (route === "bom") setup({ primary: new Error("unavailable"), mrp: new Error("unavailable"), bom: { components: [{ product_id: 7, product_sku: "MAT7", product_name: "Material", gross_quantity: "1e2" }] } });
    expect((await mapped()).gross_quantity).toBe(route === "mrp" ? 200 : 100);
    expect(mocks.api.post).not.toHaveBeenCalled();
  });
});
