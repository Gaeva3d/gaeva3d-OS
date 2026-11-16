import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminCustomers from "../AdminCustomers";

const { mocks } = vi.hoisted(() => ({ mocks: { api: { get: vi.fn() }, toast: { error: vi.fn(), success: vi.fn() } } }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => mocks.api }));
vi.mock("../../../components/Toast", () => ({ useToast: () => mocks.toast }));
vi.mock("../../../hooks/useFormatCurrency", () => ({ useFormatCurrency: () => (value) => String(value) }));
vi.mock("../../../components/customers/CustomerDetailsModal", () => ({ default: () => null }));
vi.mock("../../../components/customers/CustomerModal", () => ({ default: () => null }));
vi.mock("../../../components/customers/ImportCSVModal", () => ({ default: () => null }));
const active = { id: 1, full_name: "Cliente ativo", email: "active@example.test", status: "active" };
const other = { id: 2, full_name: "Cliente suspenso", email: "other@example.test", status: "suspended" };
const params = (url) => new URL(url, "http://local").searchParams;
const calls = () => mocks.api.get.mock.calls.map(([url]) => params(url));
const view = () => render(<MemoryRouter><AdminCustomers /></MemoryRouter>);
beforeEach(() => { vi.clearAllMocks(); mocks.api.get.mockImplementation((url) => Promise.resolve(params(url).get("status") ? [active] : [active, other])); });
afterEach(cleanup);

describe("customer status list read boundary", () => {
  it("fetches active then all without carrying the prior status and preserves limit200", async () => {
    view(); await screen.findByText("Cliente suspenso");
    expect(calls()).toHaveLength(1);
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Status dos clientes" }), "active");
    await screen.findByText("Cliente ativo");
    expect(calls().at(-1).get("status")).toBe("active");
    expect(screen.queryByText("Cliente suspenso")).not.toBeInTheDocument();
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Status dos clientes" }), "all");
    await screen.findByText("Cliente suspenso");
    expect(calls().at(-1).has("status")).toBe(false);
    expect(calls().every((query) => query.get("limit") === "200")).toBe(true);
  });

  it.each(["resolve", "reject"])("ignores a late old active read %s after the current all read", async (outcome) => {
    let resolveOld, rejectOld;
    mocks.api.get.mockImplementation((url) => params(url).has("status") ? new Promise((resolve, reject) => { resolveOld = resolve; rejectOld = reject; }) : Promise.resolve([active, other]));
    view(); await screen.findByText("Cliente suspenso");
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Status dos clientes" }), "active");
    expect(screen.getByRole("status")).toHaveTextContent("Carregando clientes");
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Status dos clientes" }), "all");
    await screen.findByText("Cliente suspenso");
    await act(async () => { if (outcome === "resolve") resolveOld([active]); else rejectOld(new Error("old denied")); });
    expect(screen.getByText("Cliente suspenso")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps active filter on read retry and never shows failed data as empty", async () => {
    let fail = true;
    mocks.api.get.mockImplementation((url) => params(url).get("status") && fail ? Promise.reject(new Error("private error")) : Promise.resolve([active]));
    view(); await screen.findByText("Cliente ativo");
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Status dos clientes" }), "active");
    expect(await screen.findByRole("alert")).not.toHaveTextContent("private error");
    expect(screen.queryByText("Nenhum cliente cadastrado")).not.toBeInTheDocument();
    fail = false; await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    await screen.findByText("Cliente ativo");
    expect(calls().at(-1).get("status")).toBe("active");
  });

  it("retains local search across active to all and exposes confirmed empty only after a successful read", async () => {
    view(); await screen.findByText("Cliente suspenso");
    fireEvent.change(screen.getByRole("textbox", { name: "Buscar clientes" }), { target: { value: "suspenso" } });
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Status dos clientes" }), "active");
    await screen.findByText("Nenhum cliente corresponde aos filtros");
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Status dos clientes" }), "all");
    await screen.findByText("Cliente suspenso");
    expect(screen.getByRole("textbox", { name: "Buscar clientes" })).toHaveValue("suspenso");
    expect(screen.queryByText("Cliente ativo")).not.toBeInTheDocument();
    await waitFor(() => expect(calls().at(-1).has("status")).toBe(false));
  });
});
