import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import CustomerDetailsModal from "../CustomerDetailsModal";

vi.mock("../../../config/api", () => ({ API_URL: "" }));
vi.mock("../../../hooks/useFeatureFlags", () => ({ useFeatureFlags: () => ({ isPro: false }) }));
vi.mock("../../../hooks/useFormatCurrency", () => ({ useFormatCurrency: () => (value) => String(value) }));

const customer = (id) => ({ id, full_name: `Cliente ${id}` });
const response = (status, data) => ({ ok: status === 200, status, json: async () => data });
const order = (number) => ({ id: number, order_number: number, created_at: "2026-11-16", status: "draft" });
const view = (id) => <CustomerDetailsModal customer={customer(id)} onClose={() => {}} onEdit={() => {}} />;
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("customer order context", () => {
  it("supports arrow, Home and End keys and associates the active tab with its panel", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(200, [])));
    render(view(1));
    const overview = screen.getByRole("tab", { name: "Visão geral" });
    const orders = screen.getByRole("tab", { name: "Pedidos" });
    await waitFor(() => expect(screen.getByRole("button", { name: "Edit" })).toHaveFocus());
    await userEvent.click(overview);
    await userEvent.keyboard("{ArrowRight}");
    expect(orders).toHaveFocus();
    expect(orders).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Pedidos");
    await userEvent.keyboard("{Home}");
    expect(overview).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(orders).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(overview).toHaveFocus();
  });

  it("announces loading and only shows an empty state after successful empty response", async () => {
    let resolve;
    vi.stubGlobal("fetch", vi.fn(() => new Promise((done) => { resolve = done; })));
    render(view(1));
    await userEvent.click(screen.getByRole("tab", { name: "Pedidos" }));
    expect(screen.getByRole("status")).toHaveTextContent("Carregando pedidos");
    expect(screen.queryByText("Nenhum pedido para este cliente.")).not.toBeInTheDocument();
    await act(async () => { resolve(response(200, [])); });
    expect(await screen.findByText("Nenhum pedido para este cliente.")).toBeInTheDocument();
  });

  it.each([401, 403, 404, 503])("keeps HTTP %s distinct from an empty customer history and permits retry", async (status) => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response(status, { detail: "private server information" }))
      .mockResolvedValueOnce(response(200, [order("PED-1")]));
    vi.stubGlobal("fetch", fetchMock);
    render(view(1));
    await userEvent.click(screen.getByRole("tab", { name: "Pedidos" }));
    expect(await screen.findByRole("alert")).not.toHaveTextContent("private server information");
    expect(screen.queryByText("Nenhum pedido para este cliente.")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByText("PED-1")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1].credentials).toBe("include");
  });

  it("clears the prior customer's orders immediately and ignores a late response for them", async () => {
    let resolveA;
    const fetchMock = vi.fn((url) => url.includes("/1/orders")
      ? new Promise((done) => { resolveA = done; })
      : Promise.resolve(response(200, [order("PED-B")])));
    vi.stubGlobal("fetch", fetchMock);
    const { rerender } = render(view(1));
    await userEvent.click(screen.getByRole("tab", { name: "Pedidos" }));
    rerender(view(2));
    expect(await screen.findByText("PED-B")).toBeInTheDocument();
    await act(async () => { resolveA(response(200, [order("PED-A")])); });
    expect(screen.queryByText("PED-A")).not.toBeInTheDocument();
    expect(screen.getByText("PED-B")).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });

  it("does not retain a loaded customer's history while the next customer is loading", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(response(200, [order("PED-A")]))
      .mockImplementation(() => new Promise(() => {})));
    const { rerender } = render(view(1));
    await userEvent.click(screen.getByRole("tab", { name: "Pedidos" }));
    expect(await screen.findByText("PED-A")).toBeInTheDocument();
    rerender(view(2));
    expect(screen.queryByText("PED-A")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Carregando pedidos");
  });

  it.each([
    () => Promise.reject(new TypeError("Failed to fetch")),
    () => Promise.resolve(response(200, {})),
    () => Promise.resolve({ ok: true, json: async () => { throw new SyntaxError("private response fragment"); } }),
  ])(
    "reports unavailable data instead of fabricating an empty history", async (fetch) => {
      vi.stubGlobal("fetch", vi.fn(fetch));
      render(view(1));
      await userEvent.click(screen.getByRole("tab", { name: "Pedidos" }));
      await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
      expect(screen.getByRole("alert")).not.toHaveTextContent("private response fragment");
      expect(screen.queryByText("Nenhum pedido para este cliente.")).not.toBeInTheDocument();
    },
  );
});
