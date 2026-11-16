import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductionQueueList from "../ProductionQueueList";

const order = (id = 1) => ({ id, code: `OP-${id}`, status: "released", product_name: "Peça", quantity_ordered: 2 });
const filters = { status: "all", workCenter: "all", search: "" };
const response = (data, status = 200) => ({ ok: status === 200, status, json: async () => data });
const op = (code) => ({ id: code, operation_code: code, status: "pending", work_center_id: 9 });
function mockFetch(operations) {
  const mock = vi.fn((url, init) => url.includes("work-centers")
    ? Promise.resolve(response({ items: [{ id: 9, name: "Impressão" }] })) : operations(url, init));
  vi.stubGlobal("fetch", mock);
  return mock;
}
const view = (orders, extra = {}) => <ProductionQueueList orders={orders} filters={filters} loading={false} onOrderClick={() => {}} {...extra} />;
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("production operations availability", () => {
  it.each([401, 403, 404, 503])("shows HTTP %s as unavailable instead of no operations and retries a read", async (status) => {
    let failed = true;
    const fetch = mockFetch(() => Promise.resolve(failed ? response({ detail: "private material cost" }, status) : response([op("PRINT")])));
    render(view([order()]));
    expect(await screen.findByRole("alert")).not.toHaveTextContent("private material cost");
    const row = screen.getByText("OP-1").closest("tr");
    expect(within(row).queryByText(/nenhuma operação/i)).not.toBeInTheDocument();
    expect(within(row).getAllByText("Não informado")).toHaveLength(2);
    if (status === 403) expect(within(row).getByText("Acesso negado")).toBeInTheDocument();
    failed = false;
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByRole("img", { name: /PRINT/ })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(fetch.mock.calls.every(([, init]) => !init.method || init.method === "GET")).toBe(true);
  });

  it.each([{}, { operations: {} }, [null]])("rejects malformed operations without crashing or inventing an empty set", async (data) => {
    mockFetch(() => Promise.resolve(response(data)));
    render(view([order()]));
    await screen.findByRole("alert");
    expect(screen.getByText("Operações indisponíveis")).toBeInTheDocument();
    expect(screen.queryByText(/nenhuma operação/i)).not.toBeInTheDocument();
  });

  it("keeps a successful empty operations collection distinct from failure", async () => {
    mockFetch(() => Promise.resolve(response([])));
    render(view([order()]));
    expect(await screen.findByText(/nenhuma operação/i)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not call an incomplete work-center filter an empty result", async () => {
    mockFetch(() => Promise.resolve(response({}, 503)));
    render(view([order()], { filters: { ...filters, workCenter: "9" } }));
    await screen.findByRole("alert");
    expect(screen.getByText("Não foi possível concluir a consulta das operações para este filtro.")).toBeInTheDocument();
    expect(screen.queryByText(/nenhuma ordem corresponde/i)).not.toBeInTheDocument();
  });

  it("ignores a late response for the previous set of orders", async () => {
    let finishA;
    const fetch = mockFetch((url) => url.includes("/1/operations")
      ? new Promise((resolve) => { finishA = resolve; }) : Promise.resolve(response([op("CURRENT-B")])));
    const { rerender } = render(view([order(1)]));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    rerender(view([order(2)]));
    expect(await screen.findByRole("img", { name: /CURRENT-B/ })).toBeInTheDocument();
    await act(async () => { finishA(response([op("OLD-A")])); });
    expect(screen.queryByRole("img", { name: /OLD-A/ })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /CURRENT-B/ })).toBeInTheDocument();
  });

  it("opens the exact order by keyboard without starting or dispatching an operation", async () => {
    mockFetch(() => Promise.resolve(response([])));
    const onOrderClick = vi.fn(); const onDispatch = vi.fn();
    const current = order();
    render(view([current], { onOrderClick, onDispatch }));
    await screen.findByText(/nenhuma operação/i);
    screen.getByRole("button", { name: "Abrir ordem OP-1" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(onOrderClick).toHaveBeenCalledExactlyOnceWith(current);
    expect(onDispatch).not.toHaveBeenCalled();
  });

  it("reloads operations after the parent refreshes an order with the same ID", async () => {
    let refreshed = false;
    mockFetch(() => Promise.resolve(response([op(refreshed ? "UPDATED" : "PREVIOUS")])));
    const { rerender } = render(view([order()]));
    expect(await screen.findByRole("img", { name: /PREVIOUS/ })).toBeInTheDocument();
    refreshed = true;
    rerender(view([{ ...order(), status: "in_progress" }]));
    expect(await screen.findByRole("img", { name: /UPDATED/ })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /PREVIOUS/ })).not.toBeInTheDocument();
  });
});
