import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminPayments from "../AdminPayments";

const { mocks } = vi.hoisted(() => ({ mocks: {
  api: { get: vi.fn(), del: vi.fn() }, toast: { error: vi.fn(), success: vi.fn() },
} }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => mocks.api }));
vi.mock("../../../components/Toast", () => ({ useToast: () => mocks.toast }));
vi.mock("../../../components/payments/RecordPaymentModal", () => ({ default: () => null }));
vi.mock("../../../hooks/useFormatCurrency", () => ({ useFormatCurrency: () => (value) => `USD ${value}` }));

const summary = { amount_today: 0, amount_this_week: 0, amount_this_month: 0, total_outstanding: 0, by_method: {} };
const payment = (id) => ({ id, payment_number: id, sales_order_id: 9, order_number: "PED9", amount: "10.25", payment_type: "payment", payment_method: "cash", status: "pending" });
const list = (items = [], page = 1, total = items.length, total_pages = 1) => ({ items, page, total, total_pages });
const historyCalls = () => mocks.api.get.mock.calls.filter(([url]) => url.includes("payments?"));
const view = () => render(<MemoryRouter><AdminPayments /></MemoryRouter>);
beforeEach(() => {
  vi.clearAllMocks();
  mocks.api.get.mockImplementation((url) => Promise.resolve(url.endsWith("dashboard") ? summary : list()));
});
afterEach(cleanup);

describe("payment history reads", () => {
  it("makes one initial history request and sends actual search, method and type filters", async () => {
    view();
    await screen.findByText("No payments yet");
    expect(historyCalls()).toHaveLength(1);
    fireEvent.change(screen.getByRole("textbox", { name: "Buscar pagamentos" }), { target: { value: "PAY-X" } });
    await waitFor(() => expect(historyCalls().at(-1)[0]).toContain("search=PAY-X"));
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Método de pagamento" }), "cash");
    await waitFor(() => expect(historyCalls().at(-1)[0]).toContain("payment_method=cash"));
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Tipo de pagamento" }), "refund");
    await waitFor(() => expect(historyCalls().at(-1)[0]).toContain("payment_type=refund"));
    expect(mocks.api.del).not.toHaveBeenCalled();
  });

  it("resets pagination to page one when a filter changes", async () => {
    mocks.api.get.mockImplementation((url) => Promise.resolve(url.endsWith("dashboard") ? summary : list([payment("PAY1")], new URL(url, "http://local").searchParams.get("page") === "2" ? 2 : 1, 50, 2)));
    view();
    await screen.findByText("PAY1");
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(historyCalls().at(-1)[0]).toContain("page=2"));
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Tipo de pagamento" }), "refund");
    await waitFor(() => expect(historyCalls().at(-1)[0]).toContain("page=1"));
  });

  it("does not let a late history response overwrite the current filter", async () => {
    let finishInitial;
    mocks.api.get.mockImplementation((url) => {
      if (url.endsWith("dashboard")) return Promise.resolve(summary);
      if (url.includes("search=")) return Promise.resolve(list([payment("CURRENT")]));
      return new Promise((resolve) => { finishInitial = resolve; });
    });
    view();
    fireEvent.change(screen.getByRole("textbox", { name: "Buscar pagamentos" }), { target: { value: "CURRENT" } });
    expect(await screen.findByText("CURRENT")).toBeInTheDocument();
    await act(async () => { finishInitial(list([payment("OLD")])); });
    expect(screen.queryByText("OLD")).not.toBeInTheDocument();
    expect(screen.getByText("CURRENT")).toBeInTheDocument();
  });

  it.each([new Error("403 private transaction detail"), new TypeError("Failed to fetch")])("keeps failed history unavailable, with safe read retry", async (error) => {
    let failed = true;
    mocks.api.get.mockImplementation((url) => url.endsWith("dashboard") ? Promise.resolve(summary)
      : failed ? Promise.reject(error) : Promise.resolve(list()));
    view();
    expect(await screen.findByRole("alert")).not.toHaveTextContent("private transaction detail");
    expect(screen.queryByText("No payments yet")).not.toBeInTheDocument();
    failed = false;
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByText("No payments yet")).toBeInTheDocument();
    expect(mocks.api.del).not.toHaveBeenCalled();
  });

  it.each([{}, { items: [], page: -1 }, { items: [null], page: 1, total: 1, total_pages: 1 }])("rejects malformed history rather than showing empty or crashing", async (data) => {
    mocks.api.get.mockImplementation((url) => Promise.resolve(url.endsWith("dashboard") ? summary : data));
    view();
    await screen.findByRole("alert");
    expect(screen.queryByText("No payments yet")).not.toBeInTheDocument();
  });

  it("leaves confirmed history usable when the independent dashboard fails", async () => {
    mocks.api.get.mockImplementation((url) => url.endsWith("dashboard") ? Promise.reject(new Error("denied")) : Promise.resolve(list([payment("PAY-OK")])));
    view();
    expect(await screen.findByText("PAY-OK")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Resumo financeiro indisponível");
    expect(screen.queryByText("Today")).not.toBeInTheDocument();
  });

  it("rejects an array payment item without rendering a phantom transaction row (F4-01)", async () => {
    mocks.api.get.mockImplementation((url) => Promise.resolve(url.endsWith("dashboard") ? summary : list([[]])));
    view();
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível consultar os pagamentos");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText("Sem pedido vinculado")).not.toBeInTheDocument();
  });

  it("does not invent an order link when a payment has no linked order", async () => {
    mocks.api.get.mockImplementation((url) => Promise.resolve(url.endsWith("dashboard") ? summary : list([{ ...payment("PAY-NO-ORDER"), sales_order_id: null }])));
    view();
    await screen.findByText("PAY-NO-ORDER");
    expect(screen.getByText("Sem pedido vinculado")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "PED9" })).not.toBeInTheDocument();
  });
});
