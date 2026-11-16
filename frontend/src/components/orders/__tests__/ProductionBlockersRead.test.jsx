import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ProductionBlockersRead from "../ProductionBlockersRead";
import OrderTraceability from "../../../pages/admin/OrderTraceability";
const { api } = vi.hoisted(() => ({ api: { get: vi.fn() } }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => api }));
const data = (id = 3) => ({ production_order_id: id, production_order_code: `OP-${id}`, status_summary: { can_produce: false, blocking_count: 1 }, material_issues: [{ product_id: 8, product_sku: "MAT-8", quantity_required: "2.5", quantity_available: 0, quantity_short: "2.5", incoming_supply: { purchase_order_code: "PO-4", quantity: "5" } }], other_issues: [{ type: "quality_hold", severity: "blocking", message: "Controle interno pendente", details: { secret: "PRIVATE" } }], resolution_actions: [{ action: "SECRET-COMMAND" }], cost: "SECRET-COST" });
const view = (id = 3) => <ProductionBlockersRead key={id} executionId={id} />;
const open = () => userEvent.click(screen.getByRole("button", { name: /Motivos legados da OP/ }));
beforeEach(() => { api.get.mockReset(); api.get.mockResolvedValue(data()); });
afterEach(cleanup);
it("opens with keyboard and displays only typed legacy fields with no command/details dump", async () => {
  render(view()); expect(api.get).not.toHaveBeenCalled(); screen.getByRole("button").focus(); await userEvent.keyboard("{Enter}");
  await screen.findByText(/Controle interno pendente/); expect(screen.getByText(/MAT-8/)).toHaveTextContent("Disponível: 0"); expect(screen.getByText(/MAT-8/)).toHaveTextContent("PO-4"); expect(screen.getByText(/can_produce legado/)).toHaveTextContent("false");
  expect(screen.queryByText(/PRIVATE|SECRET/)).not.toBeInTheDocument(); expect(screen.getAllByRole("button")).toHaveLength(1); expect(api.get.mock.calls[0][0]).toBe("/api/v1/production-orders/3/blocking-issues");
});
it.each([0, null, undefined])("keeps count %s distinct from confirmed empty lists", async (count) => {
  api.get.mockResolvedValue({ ...data(), status_summary: { blocking_count: count }, material_issues: [], other_issues: [] }); render(view()); await open();
  expect(await screen.findByText(/Contagem legada/)).toHaveTextContent(count === 0 ? "Contagem legada: 0" : "Não informado"); expect(screen.getByText("Nenhum outro motivo nesta lista retornada.")).toBeInTheDocument();
});
it.each([401, 403, 404, 503])("keeps HTTP%s unavailable and retries only GET", async (status) => { api.get.mockRejectedValueOnce({ status }); render(view()); await open(); await screen.findByRole("alert"); expect(screen.queryByText(/Contagem legada/)).not.toBeInTheDocument(); await userEvent.click(screen.getByText("Tentar novamente")); await screen.findByText(/Controle interno pendente/); });
it.each([{ ...data(), production_order_id: 99 }, { ...data(), material_issues: [42] }, { ...data(), other_issues: [[]] }, { ...data(), status_summary: null }])("rejects malformed or foreign OP projection", async (d) => { api.get.mockResolvedValue(d); render(view()); await open(); await screen.findByRole("alert"); expect(screen.queryByText(/MAT-8/)).not.toBeInTheDocument(); });
it("keeps malformed/null quantities unknown, not zero", async () => { const d = data(); d.material_issues[0].quantity_available = "0x10"; d.material_issues[0].quantity_short = null; api.get.mockResolvedValue(d); render(view()); await open(); expect(await screen.findByText(/MAT-8/)).toHaveTextContent("Disponível: Não informado · Falta: Não informado"); });
it("close aborts and reopening same path cannot restore old projection", async () => {
  let finish; api.get.mockResolvedValueOnce(data()).mockImplementationOnce(() => new Promise((r) => { finish = r; })); render(view()); await open(); await screen.findByText(/MAT-8/); await open(); await open(); expect(screen.queryByText(/MAT-8/)).not.toBeInTheDocument(); expect(screen.getByRole("status")).toHaveTextContent("Consultando"); await open(); await act(async () => finish(data())); expect(screen.queryByText(/MAT-8/)).not.toBeInTheDocument(); expect(api.get.mock.calls[1][1].signal.aborted).toBe(true);
});
it("discards a late response after selected OP changes", async () => {
  let finish; api.get.mockImplementationOnce(() => new Promise((r) => { finish = r; })).mockResolvedValueOnce({ ...data(4), other_issues: [] }); const { rerender } = render(view()); await open(); rerender(view(4)); expect(screen.queryByRole("region")).not.toBeInTheDocument(); await open(); await screen.findByText(/Fonte: bloqueios legados da OP #4/); await act(async () => finish(data())); expect(screen.queryByText(/Controle interno pendente/)).not.toBeInTheDocument();
});
it("blocker failure does not erase valid OP operations or QC", async () => {
  api.get.mockImplementation(async (p) => { if (p.includes("blocking-issues")) throw { status: 403 }; if (p.includes("sales-orders")) return { id: 1 }; if (p.includes("qc-inspections")) return { production_order_id: 3, total: 1, inspections: [{ id: 7, production_order_id: 3, result: "passed" }] }; if (p.includes("?")) return [{ id: 3, sales_order_id: 1, code: "OP-3" }]; return { id: 3, sales_order_id: 1, code: "OP-3", operations: [] }; });
  render(<MemoryRouter initialEntries={["/admin/orders/1/traceability"]}><Routes><Route path="/admin/orders/:orderId/traceability" element={<OrderTraceability />} /></Routes></MemoryRouter>);
  await userEvent.click(await screen.findByRole("button", { name: /OP-3/ })); await screen.findByText(/Inspeção #7/); expect(api.get.mock.calls.some(([p]) => p.includes("blocking-issues"))).toBe(false); await open(); await screen.findByRole("alert"); expect(screen.getByText(/Inspeção #7/)).toBeInTheDocument(); expect(screen.getByText("Nenhuma operação registrada.")).toBeInTheDocument();
});
