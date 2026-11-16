import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import OrderFinancials from "../OrderFinancials";
import OrderHeaderActions from "../../../components/orders/OrderHeaderActions";
const { api } = vi.hoisted(() => ({ api: { get: vi.fn() } }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => api }));
vi.mock("../../../hooks/useFormatCurrency", () => ({ useFormatCurrency: () => (v) => `FMT:${v}` }));
const summary = { order_total: "100", total_paid: "75", total_refunded: "5", balance_due: "30", payment_count: 3, last_payment_date: "2026-11-16" };
const item = (id = 7) => ({ id, sales_order_id: 1, payment_number: `PAY-${id}`, amount: "1", payment_method: "cash", payment_type: "payment", status: "completed", transaction_id: "TX-1", payment_date: "2026-11-16" });
const history = (items = [item()], page = 1, total = items.length) => ({ items, page, page_size: 20, total, total_pages: Math.ceil(total / 20) });
function Nav() { const go = useNavigate(); return <button onClick={() => go("/admin/orders/2/financials")}>Outro pedido</button>; }
const view = (id = "1") => render(<MemoryRouter initialEntries={[`/admin/orders/${id}/financials`]}><Nav /><Routes><Route path="/admin/orders/:orderId/financials" element={<OrderFinancials />} /></Routes></MemoryRouter>);
beforeEach(() => { api.get.mockReset(); api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1, order_number: "SO-1" } : p.includes("summary") ? summary : history()); });
afterEach(cleanup);
it("shows authoritative local summary independently of paginated amounts and keeps both links", async () => {
  view(); expect(await screen.findByText("FMT:30")).toBeInTheDocument(); await screen.findByText("TX-1");
  expect(api.get.mock.calls.map(([p]) => p)).toEqual(["/api/v1/sales-orders/1", "/api/v1/payments/order/1/summary", "/api/v1/payments?order_id=1&page=1&page_size=20"]);
  expect(screen.queryByRole("button", { name: /Registrar|Reembolsar/ })).not.toBeInTheDocument();
});
it("retains known zero but never formats missing/null/radix values as zero", async () => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1 } : p.includes("summary") ? { order_total: 0, total_paid: null, total_refunded: "0x10" } : history([{ ...item(), amount: null }]));
  view(); await screen.findByText("FMT:0"); const s = screen.getByRole("region", { name: "Resumo local" });
  expect(within(s).getAllByText("Não informado")).toHaveLength(5);
  expect(screen.queryByText("FMT:null")).not.toBeInTheDocument();
});
it("shows confirmed empty history separately from missing summary fields", async () => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1 } : p.includes("summary") ? {} : history([]));
  view(); await screen.findByText("Nenhum registro nesta página."); expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
it.each([401, 403, 404, 503])("keeps summary HTTP%s unavailable while history succeeds and retries GET", async (status) => {
  let fail = true; api.get.mockImplementation(async (p) => { if (p.includes("sales-orders")) return { id: 1 }; if (p.includes("summary")) { if (fail) throw { status }; return summary; } return history(); });
  view(); await screen.findByRole("alert"); await screen.findByText("TX-1"); fail = false;
  await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" })); await screen.findByText("FMT:30");
});
it.each([null, [], 42])("rejects malformed summary %j without losing history", async (data) => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1 } : p.includes("summary") ? data : history());
  view(); await screen.findByRole("alert"); await screen.findByText("TX-1");
});
it.each([history([{ ...item(), sales_order_id: 2 }]), history([42]), { ...history(), page: 2 }])("rejects foreign/malformed history or wrong paging metadata", async (data) => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1 } : p.includes("summary") ? summary : data);
  view(); await screen.findByRole("alert"); await screen.findByText("FMT:30"); expect(screen.queryByText("TX-1")).not.toBeInTheDocument();
});
it("paginates without altering order filter or recomputing summary", async () => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1 } : p.includes("summary") ? summary : p.includes("page=2&") ? history([item(99)], 2, 21) : history(Array.from({ length: 20 }, (_, i) => item(i + 1)), 1, 21));
  view(); await screen.findByText(/PAY-20/); await userEvent.click(screen.getByRole("button", { name: "Próxima página" }));
  await screen.findByText(/PAY-99/); expect(api.get.mock.calls.at(-1)[0]).toBe("/api/v1/payments?order_id=1&page=2&page_size=20"); expect(screen.getByText("FMT:30")).toBeInTheDocument();
});
it("clears and ignores old summary on order change and aborts on unmount", async () => {
  let finish; api.get.mockImplementation((p) => p.includes("sales-orders") ? Promise.resolve({ id: Number(p.split("/").at(-1)) }) : p.includes("/order/1/") ? new Promise((r) => { finish = r; }) : Promise.resolve(p.includes("summary") ? {} : history([])));
  const { unmount } = view(); await screen.findByText("Nenhum registro nesta página."); await userEvent.click(screen.getByText("Outro pedido")); await screen.findByText(/Pedido #2/);
  await act(async () => finish(summary)); expect(screen.queryByText("FMT:30")).not.toBeInTheDocument(); unmount(); expect(api.get.mock.calls.every(([, options]) => options.signal.aborted)).toBe(true);
});
it("refuses wrong order identity before ledger reads", async () => { api.get.mockResolvedValue({ id: 2 }); view(); await screen.findByRole("alert"); expect(api.get).toHaveBeenCalledTimes(1); });
it("invalid route never requests ledger", () => { view("0"); expect(screen.getByRole("alert")).toBeInTheDocument(); expect(api.get).not.toHaveBeenCalled(); });
it("header retains traceability and adds local ledger navigation", () => { render(<MemoryRouter><OrderHeaderActions orderId={3} /></MemoryRouter>); expect(screen.getByRole("link", { name: "Ledger local" })).toHaveAttribute("href", "/admin/orders/3/financials"); expect(screen.getByRole("link", { name: "Rastreabilidade" })).toHaveAttribute("href", "/admin/orders/3/traceability"); });
it("keeps pending page distinct from empty and ignores late page two after returning", async () => {
  let finish;
  api.get.mockImplementation((p) => Promise.resolve(p.includes("sales-orders") ? { id: 1 } : p.includes("summary") ? summary : p.includes("page=2&") ? new Promise((r) => { finish = r; }) : history(Array.from({ length: 20 }, (_, i) => item(i + 1)), 1, 21)));
  view(); await screen.findByText(/PAY-20/); await userEvent.click(screen.getByRole("button", { name: "Próxima página" }));
  expect(screen.queryByText("Nenhum registro nesta página.")).not.toBeInTheDocument();
  // Navigation resets the whole order context, including page and pending request.
  await userEvent.click(screen.getByText("Outro pedido")); await screen.findByRole("alert");
  await act(async () => finish(history([item(99)], 2, 21)));
  expect(screen.queryByText(/PAY-99/)).not.toBeInTheDocument();
});
