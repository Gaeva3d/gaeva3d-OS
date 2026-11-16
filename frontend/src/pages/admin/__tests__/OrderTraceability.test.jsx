import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import OrderTraceability from "../OrderTraceability";
import OrderHeaderActions from "../../../components/orders/OrderHeaderActions";
const { api } = vi.hoisted(() => ({ api: { get: vi.fn() } }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => api }));
const op = (id = 3) => ({ id, sales_order_id: 1, code: `OP-${id}`, status: "complete", operations: [] });
function Navigation() { const go = useNavigate(); return <button onClick={() => go("/admin/orders/2/traceability")}>Outro pedido</button>; }
function view(id = "1") { return render(<MemoryRouter initialEntries={[`/admin/orders/${id}/traceability`]}><Navigation /><Routes><Route path="/admin/orders/:orderId/traceability" element={<OrderTraceability />} /></Routes></MemoryRouter>); }
beforeEach(() => { api.get.mockReset(); api.get.mockImplementation(async (path) => {
  if (path.includes("sales-orders")) return { id: 1, quote_id: 2, order_number: "SO-1" };
  if (path.includes("quotes")) return { id: 2, sales_order_id: 1, quote_number: "Q-2" };
  if (path.includes("qc-inspections")) return { production_order_id: 3, total: 1, inspections: [{ id: 7, production_order_id: 3, result: "passed" }] };
  if (path.includes("?")) return [op()];
  return op();
}); });
afterEach(cleanup);
it("consults explicit linked quote, execution and internal QC with accessible selection", async () => {
  view(); await screen.findByText(/Q-2/);
  await userEvent.click(await screen.findByRole("button", { name: /OP-3/ }));
  expect(await screen.findByText(/Inspeção #7/)).toBeInTheDocument();
  expect(api.get.mock.calls.map(([p]) => p)).toEqual(["/api/v1/sales-orders/1", "/api/v1/quotes/2", "/api/v1/production-orders/?sales_order_id=1&offset=0&limit=50", "/api/v1/production-orders/3", "/api/v1/production-orders/3/qc-inspections"]);
});
it("distinguishes absent quote and successful empty execution page", async () => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1, quote_id: null } : []);
  view(); await screen.findByText("Sem proposta vinculada."); await screen.findByText("Nenhuma execução nesta página.");
  expect(api.get.mock.calls.some(([p]) => p.includes("quotes"))).toBe(false);
});
it.each([401, 403, 404, 503])("shows safe error and GET retry for HTTP%s", async (status) => {
  api.get.mockRejectedValueOnce({ status }); view(); await screen.findByRole("alert");
  await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" })); await screen.findByText(/SO-1/);
});
it.each([42, { id: 8 }, { id: 1, quote_id: "2" }])("rejects malformed or wrong order %j", async (data) => {
  api.get.mockResolvedValue(data); view(); await screen.findByRole("alert"); expect(api.get).toHaveBeenCalledTimes(1);
});
it("does not fetch an invalid route id", () => { view("0x10"); expect(screen.getByRole("alert")).toBeInTheDocument(); expect(api.get).not.toHaveBeenCalled(); });
it("rejects cross-order execution before reading QC", async () => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1 } : [{ ...op(), sales_order_id: 2 }]);
  view(); await screen.findByRole("alert"); expect(screen.queryByRole("button", { name: /OP-3/ })).not.toBeInTheDocument();
});
it("discards a late order response when route changes", async () => {
  let finish;
  api.get.mockImplementation((p) => p === "/api/v1/sales-orders/1" ? new Promise((r) => { finish = r; }) : Promise.resolve(p.includes("sales-orders") ? { id: 2, order_number: "SO-2" } : []));
  view(); await userEvent.click(screen.getByText("Outro pedido")); await screen.findByText(/SO-2/);
  await act(async () => finish({ id: 1, order_number: "OLD" })); expect(screen.queryByText(/OLD/)).not.toBeInTheDocument();
  expect(api.get.mock.calls[0][1].signal.aborted).toBe(true);
});
it("adds discoverable read navigation without invoking header commands", () => {
  render(<MemoryRouter><OrderHeaderActions orderId={17} /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Rastreabilidade" })).toHaveAttribute("href", "/admin/orders/17/traceability");
});
it("rejects a quote linked to another order without hiding supported executions", async () => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1, quote_id: 2 } : p.includes("quotes") ? { id: 2, sales_order_id: 9, quote_number: "PRIVATE" } : []);
  view(); await screen.findByRole("alert"); await screen.findByText("Nenhuma execução nesta página.");
  expect(screen.queryByText(/PRIVATE/)).not.toBeInTheDocument();
});
it.each(["detail", "qc"])("rejects cross-record %s identity before displaying history", async (kind) => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1 } : p.includes("?") ? [op()] : p.includes("qc-inspections") ? { production_order_id: 99, total: 0, inspections: [] } : { ...op(), sales_order_id: kind === "detail" ? 99 : 1 });
  view(); await userEvent.click(await screen.findByRole("button", { name: /OP-3/ })); await screen.findByRole("alert");
  expect(screen.queryByText("Nenhuma inspeção registrada.")).not.toBeInTheDocument();
  if (kind === "detail") expect(api.get.mock.calls.some(([p]) => p.includes("qc-inspections"))).toBe(false);
});
it("clears a pending selected QC read when another execution is selected", async () => {
  let finish;
  api.get.mockImplementation((p) => Promise.resolve(p.includes("sales-orders") ? { id: 1 } : p.includes("?") ? [op(3), op(4)] : p.includes("qc-inspections") ? (p.includes("/3/") ? new Promise((r) => { finish = r; }) : { production_order_id: 4, total: 0, inspections: [] }) : op(Number(p.split("/").at(-1)))));
  view(); await userEvent.click(await screen.findByRole("button", { name: /OP-3/ }));
  await screen.findByRole("heading", { name: /QC interno/ });
  await userEvent.click(screen.getByRole("button", { name: /OP-4/ })); await screen.findByText("Nenhuma inspeção registrada.");
  await act(async () => finish({ production_order_id: 3, total: 1, inspections: [{ id: 8, production_order_id: 3, result: "OLD" }] }));
  expect(screen.queryByText(/OLD/)).not.toBeInTheDocument();
});
