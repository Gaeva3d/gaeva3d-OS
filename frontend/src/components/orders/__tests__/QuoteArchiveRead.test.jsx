import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import QuoteArchiveRead from "../QuoteArchiveRead";
import OrderTraceability from "../../../pages/admin/OrderTraceability";
const { api } = vi.hoisted(() => ({ api: { get: vi.fn() } }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => api }));
const archive = () => ({ quote: { id: 2, sales_order_id: 1, quote_number: "Q-2", admin_notes: "PRIVATE", total_price: "SECRET-PRICE", lines: [{ id: 3, line_number: 1, product_name: "Peça", quantity: 0 }] }, files: [{ id: 4, original_filename: "part.stl", file_format: "stl", file_hash: "HASH-4", file_size_bytes: 0, uploaded_at: "2026-11-16" }], materials: [{ slot_number: 1, material_type: "PLA", material_grams: "2.5" }], read_only: true, pro_actions_available: true });
const view = (quoteId = 2, orderId = 1) => <QuoteArchiveRead key={`${quoteId}/${orderId}`} quoteId={quoteId} orderId={orderId} />;
const open = async () => userEvent.click(screen.getByRole("button", { name: /Arquivo histórico da proposta/ }));
beforeEach(() => { api.get.mockReset(); api.get.mockResolvedValue(archive()); });
afterEach(cleanup);
it("opens by keyboard, fetches only then, and shows metadata without commands/private fields", async () => {
  render(view()); expect(api.get).not.toHaveBeenCalled();
  const button = screen.getByRole("button"); button.focus(); await userEvent.keyboard("{Enter}");
  await screen.findByText(/HASH-4/); expect(button).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText(/part.stl/)).toHaveTextContent("Bytes: 0"); expect(screen.getByText(/Peça/)).toHaveTextContent("Quantidade: 0");
  expect(screen.queryByText(/PRIVATE|SECRET-PRICE/)).not.toBeInTheDocument(); expect(screen.queryByRole("link")).not.toBeInTheDocument(); expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(api.get.mock.calls[0][0]).toBe("/api/v1/quotes/2/archive");
});
it("keeps successful empty collections distinct from unavailable archive", async () => {
  const a = archive(); a.quote.lines = []; a.files = []; a.materials = []; api.get.mockResolvedValue(a); render(view()); await open();
  await screen.findByText("Nenhum arquivo registrado."); expect(screen.getByText("Nenhum material registrado.")).toBeInTheDocument(); expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
it.each([401, 403, 404, 503])("keeps HTTP%s unavailable and retries GET", async (status) => { api.get.mockRejectedValueOnce({ status }); render(view()); await open(); await screen.findByRole("alert"); expect(screen.queryByText("Nenhum arquivo registrado.")).not.toBeInTheDocument(); await userEvent.click(screen.getByText("Tentar novamente")); await screen.findByText(/HASH-4/); });
it.each(["quote", "order", "files", "materials", "lines", "root"])("rejects wrong identity/malformed %s without metadata", async (kind) => {
  const a = archive(); if (kind === "quote") a.quote.id = 8; if (kind === "order") a.quote.sales_order_id = 8; if (kind === "files") a.files = [42]; if (kind === "materials") a.materials = [true]; if (kind === "lines") a.quote.lines = [[]];
  api.get.mockResolvedValue(kind === "root" ? 42 : a); render(view()); await open(); await screen.findByRole("alert"); expect(screen.queryByText(/HASH-4/)).not.toBeInTheDocument();
});
it("accepts explicit null sales order linkage while quote id matches", async () => { const a = archive(); a.quote.sales_order_id = null; api.get.mockResolvedValue(a); render(view()); await open(); await screen.findByText(/HASH-4/); });
it("close aborts pending read and reopening same path cannot restore stale result", async () => {
  let finish; api.get.mockImplementationOnce(() => new Promise((r) => { finish = r; })).mockResolvedValueOnce({ ...archive(), files: [] });
  render(view()); await open(); expect(screen.getByRole("status")).toHaveTextContent("Consultando"); await open();
  expect(api.get.mock.calls[0][1].signal.aborted).toBe(true); await open(); await screen.findByText("Nenhum arquivo registrado."); await act(async () => finish(archive())); expect(screen.queryByText(/HASH-4/)).not.toBeInTheDocument();
});
it("ignores late parsed JSON after quote/order context change", async () => {
  let finish; api.get.mockImplementationOnce(() => new Promise((r) => { finish = r; })).mockResolvedValueOnce({ ...archive(), quote: { ...archive().quote, id: 9, sales_order_id: 5 }, files: [] });
  const { rerender } = render(view()); await open(); rerender(view(9, 5)); expect(screen.queryByRole("region")).not.toBeInTheDocument(); await open(); await screen.findByText("Nenhum arquivo registrado."); await act(async () => finish(archive())); expect(screen.queryByText(/HASH-4/)).not.toBeInTheDocument();
});
it("integrates only the order's explicit linked quote and stays lazy", async () => {
  api.get.mockImplementation(async (p) => p.includes("sales-orders") ? { id: 1, quote_id: 2 } : p.endsWith("/archive") ? archive() : p.includes("quotes") ? archive().quote : []);
  render(<MemoryRouter initialEntries={["/admin/orders/1/traceability"]}><Routes><Route path="/admin/orders/:orderId/traceability" element={<OrderTraceability />} /></Routes></MemoryRouter>);
  await screen.findByRole("button", { name: /Arquivo histórico da proposta #2/ }); expect(api.get.mock.calls.some(([p]) => p.endsWith("/archive"))).toBe(false); await open(); await screen.findByText(/HASH-4/);
});
