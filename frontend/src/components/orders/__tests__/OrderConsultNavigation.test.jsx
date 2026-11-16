import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { consultContext } from "../OrderConsultNavigation";
import OrderTraceability from "../../../pages/admin/OrderTraceability";
import OrderFinancials from "../../../pages/admin/OrderFinancials";
import OrderHeaderActions from "../OrderHeaderActions";
const { api } = vi.hoisted(() => ({ api: { get: vi.fn() } }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => api }));
vi.mock("../../../hooks/useFormatCurrency", () => ({ useFormatCurrency: () => (v) => String(v) }));
function Order() { const l = useLocation(); return <><h1>Pedido</h1><OrderHeaderActions orderId={1} onRefresh={() => {}} /><output>{l.state?.orderConsult?.origin}</output></>; }
function setup(state, path = "/admin/orders/1/traceability") { return render(<MemoryRouter initialEntries={[{ pathname: path, state }]}><Routes><Route path="/admin/orders/:orderId/traceability" element={<OrderTraceability />} /><Route path="/admin/orders/:orderId/financials" element={<OrderFinancials />} /><Route path="/admin/orders/:orderId" element={<Order />} /></Routes></MemoryRouter>); }
const row = (id = 3) => ({ id, sales_order_id: 1, code: `OP-${id}`, operations: [] });
const payment = (id) => ({ id, sales_order_id: 1, amount: 1, payment_number: `PAY-${id}` });
beforeEach(() => { api.get.mockReset(); api.get.mockImplementation(async (p) => {
  if (p.includes("sales-orders")) return { id: 1 };
  if (p.includes("summary")) return {};
  if (p.includes("payments?")) { const page = Number(new URLSearchParams(p.split("?")[1]).get("page")); return { page, page_size: 20, total: 21, total_pages: 2, items: page === 1 ? Array.from({ length: 20 }, (_, i) => payment(i + 1)) : [payment(21)] }; }
  if (p.includes("qc-inspections")) return { production_order_id: 3, inspections: [], total: 0 };
  if (p.includes("?")) return p.includes("offset=50") ? [row()] : Array.from({ length: 50 }, (_, i) => row(i + 10));
  return row();
}); });
afterEach(cleanup);
it.each([{ orderId: 2, offset: 50, selection: 3, page: 2 }, { orderId: 1, offset: -50, selection: "3", page: Infinity }, { orderId: 1, offset: 3, selection: 0, page: "2", origin: "https://evil.test" }])("rejects foreign/invalid router hints %j", (orderConsult) => {
  expect(consultContext({ orderConsult }, 1)).toMatchObject({ orderId: 1, offset: 0, selection: null, page: 1, origin: "order" });
});
it("restores same-order OP offset/selection only after fresh records, round trips through ledger and order", async () => {
  setup({ orderConsult: { orderId: 1, offset: 50, selection: 3, page: 2 } }); await screen.findByText("Nenhuma inspeção registrada.");
  const count = api.get.mock.calls.filter(([p]) => p === "/api/v1/production-orders/3").length;
  await userEvent.click(within(screen.getByRole("navigation", { name: "Consultas do pedido" })).getByText("Ledger local"));
  await screen.findByText(/PAY-21/); expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
  await userEvent.click(screen.getByRole("link", { name: "Rastreabilidade" })); await screen.findByText("Nenhuma inspeção registrada.");
  expect(api.get.mock.calls.filter(([p]) => p === "/api/v1/production-orders/3")).toHaveLength(count + 1);
  expect(screen.getByText("Execuções vinculadas · página 2")).toBeInTheDocument();
  await userEvent.click(screen.getByText("Voltar ao pedido")); await userEvent.click(screen.getByRole("link", { name: "Ledger local" })); await screen.findByText(/PAY-21/);
});
it("does not reopen a removed OP or choose the first record", async () => { setup({ orderConsult: { orderId: 1, selection: 999 } }); await screen.findByRole("button", { name: /OP-10/ }); expect(api.get.mock.calls.some(([p]) => p.endsWith("/999") || p.endsWith("/10"))).toBe(false); });
it("ignores order A state on order B and never follows arbitrary return URL", async () => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 2 } : []); setup({ returnUrl: "https://evil.test", orderConsult: { orderId: 1, offset: 50, selection: 3, page: 2 } }, "/admin/orders/2/traceability");
  await screen.findByText("Nenhuma execução nesta página."); expect(api.get.mock.calls[1][0]).toContain("sales_order_id=2&offset=0"); expect(screen.getByText("Voltar ao pedido")).toHaveAttribute("href", "/admin/orders/2");
});
it("focus stays on a control during same-page reads and overflow is keyboard reachable", async () => {
  setup(null, "/admin/orders/1/financials"); await screen.findByText(/PAY-20/); const next = screen.getByRole("button", { name: "Próxima página" }); await userEvent.click(next); await screen.findByText(/PAY-21/); expect(screen.getByRole("heading", { level: 1 })).not.toHaveFocus();
  expect(screen.getByRole("region", { name: "Tabela do ledger local" })).toHaveAttribute("tabindex", "0");
});
it("header wrap uses local class and return hints keep only identifiers", () => {
  setup({ orderConsult: { orderId: 1, offset: 50, selection: 3, page: 2, privateData: "PRIVATE" } }, "/admin/orders/1");
  expect(screen.getByRole("link", { name: "Rastreabilidade" }).parentElement).toHaveClass("flex-wrap");
  expect(consultContext({ orderConsult: { orderId: 1, privateData: "PRIVATE" } }, 1)).not.toHaveProperty("privateData");
});
it("marks a restored financial page outside current server bounds and permits reset", async () => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1 } : p.includes("summary") ? {} : { items: [], total: 0, total_pages: 0, page_size: 20, page: p.includes("page=4&") ? 4 : 1 });
  setup({ orderConsult: { orderId: 1, page: 4 } }, "/admin/orders/1/financials");
  await screen.findByText(/Página fora do intervalo atual/); await userEvent.click(screen.getByRole("button", { name: "Voltar à primeira página" })); await screen.findByText("Histórico local · página 1");
  expect(api.get.mock.calls.at(-1)[0]).toContain("page=1&page_size=20");
});
it("returns focus to the originating header link without stealing it on refresh rerender", async () => {
  const { rerender } = render(<MemoryRouter initialEntries={[{ pathname: "/admin/orders/1", state: { orderConsult: { orderId: 1, origin: "financials" } } }]}><OrderHeaderActions orderId={1} refreshing={false} /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Ledger local" })).toHaveFocus();
  const trace = screen.getByRole("link", { name: "Rastreabilidade" }); trace.focus();
  rerender(<MemoryRouter><OrderHeaderActions orderId={1} refreshing /></MemoryRouter>);
  expect(trace).toHaveFocus();
});
it("OP sibling identities do not warn and switching OP discards its detail", async () => {
  const spy = vi.spyOn(console, "error");
  api.get.mockImplementation(async (p) => {
    if (p.includes("sales-orders")) return { id: 1 };
    if (p.includes("?")) return [row(3), row(4)];
    if (p.includes("qc-inspections")) return { production_order_id: Number(p.split("/")[4]), total: 0, inspections: [] };
    return row(Number(p.split("/").at(-1)));
  });
  try {
    setup(null); await userEvent.click(await screen.findByRole("button", { name: /OP-3/ })); await screen.findByRole("button", { name: "Motivos legados da OP #3" });
    await userEvent.click(screen.getByRole("button", { name: /OP-4/ })); await screen.findByRole("button", { name: "Motivos legados da OP #4" });
    expect(screen.queryByRole("button", { name: "Motivos legados da OP #3" })).not.toBeInTheDocument();
    expect(spy.mock.calls.flat().join(" ")).not.toMatch(/same key|unique.*key/i);
  } finally { spy.mockRestore(); }
});
