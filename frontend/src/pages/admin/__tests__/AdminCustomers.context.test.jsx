import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminCustomers from "../AdminCustomers";

const { mocks } = vi.hoisted(() => ({ mocks: {
  api: { get: vi.fn() }, toast: { error: vi.fn(), success: vi.fn() },
  crud: { items: [], loading: false, error: null, fetchAll: vi.fn(), refresh: vi.fn() },
} }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => mocks.api }));
vi.mock("../../../hooks/useCRUD", () => ({ useCRUD: () => mocks.crud }));
vi.mock("../../../components/Toast", () => ({ useToast: () => mocks.toast }));
vi.mock("../../../hooks/useFormatCurrency", () => ({ useFormatCurrency: () => (value) => String(value) }));
vi.mock("../../../components/customers/CustomerDetailsModal", () => ({ default: ({ customer }) => <div role="dialog">Detalhes {customer.full_name}</div> }));
vi.mock("../../../components/customers/CustomerModal", () => ({ default: ({ customer }) => <div role="dialog">Editar {customer?.full_name || "Novo"}</div> }));
vi.mock("../../../components/customers/ImportCSVModal", () => ({ default: () => null }));

const a = { id: 1, full_name: "Cliente A", email: "a@example.test", status: "active" };
const b = { id: 2, full_name: "Cliente B", email: "b@example.test", status: "active" };
const row = (name) => screen.getByText(name).closest("tr");
const view = () => render(<MemoryRouter><AdminCustomers /></MemoryRouter>);
beforeEach(() => {
  vi.clearAllMocks();
  mocks.crud.items = [a, b]; mocks.crud.loading = false; mocks.crud.error = null;
  mocks.crud.refresh.mockResolvedValue([]);
});
afterEach(cleanup);

describe("customer selection and list availability", () => {
  it("honors the latest view selection when responses arrive out of order", async () => {
    let resolveA;
    mocks.api.get.mockImplementation((url) => url.endsWith("/1")
      ? new Promise((resolve) => { resolveA = resolve; }) : Promise.resolve(b));
    view();
    await userEvent.click(within(row("Cliente A")).getByRole("button", { name: "Visualizar" }));
    expect(screen.getByRole("status")).toHaveTextContent("Carregando dados do cliente");
    await userEvent.click(within(row("Cliente B")).getByRole("button", { name: "Visualizar" }));
    expect(await screen.findByRole("dialog")).toHaveTextContent("Detalhes Cliente B");
    await act(async () => { resolveA(a); });
    expect(screen.getByRole("dialog")).toHaveTextContent("Detalhes Cliente B");
  });

  it("shares selection ownership between view and edit", async () => {
    let resolveA;
    mocks.api.get.mockImplementation((url) => url.endsWith("/1")
      ? new Promise((resolve) => { resolveA = resolve; }) : Promise.resolve(b));
    view();
    await userEvent.click(within(row("Cliente A")).getByRole("button", { name: "Visualizar" }));
    await userEvent.click(within(row("Cliente B")).getByRole("button", { name: "Editar" }));
    expect(await screen.findByRole("dialog")).toHaveTextContent("Editar Cliente B");
    await act(async () => { resolveA(a); });
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.getByRole("dialog")).toHaveTextContent("Editar Cliente B");
  });

  it("does not replace a new customer draft with an earlier selection", async () => {
    let resolveA;
    mocks.api.get.mockImplementation(() => new Promise((resolve) => { resolveA = resolve; }));
    view();
    await userEvent.click(within(row("Cliente A")).getByRole("button", { name: "Editar" }));
    await userEvent.click(screen.getByRole("button", { name: /Adicionar cliente/ }));
    await act(async () => { resolveA(a); });
    expect(screen.getByRole("dialog")).toHaveTextContent("Editar Novo");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("rejects a detail payload for a different customer", async () => {
    mocks.api.get.mockResolvedValue(b);
    view();
    await userEvent.click(within(row("Cliente A")).getByRole("button", { name: "Visualizar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mocks.toast.error).toHaveBeenCalledWith("Os dados deste cliente não estão disponíveis. Tente novamente.");
  });

  it("ignores errors from superseded selections and never echoes server detail", async () => {
    let rejectA;
    mocks.api.get.mockImplementation((url) => url.endsWith("/1")
      ? new Promise((_, reject) => { rejectA = reject; }) : Promise.resolve(b));
    view();
    await userEvent.click(within(row("Cliente A")).getByRole("button", { name: "Visualizar" }));
    await userEvent.click(within(row("Cliente B")).getByRole("button", { name: "Visualizar" }));
    await screen.findByRole("dialog");
    await act(async () => { rejectA(new Error("private details")); });
    expect(mocks.toast.error).not.toHaveBeenCalled();
  });

  it("keeps list errors separate from empty data, stale rows and financial totals, with retry", async () => {
    mocks.crud.error = "private server detail";
    view();
    expect(screen.getByRole("alert")).not.toHaveTextContent("private server detail");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText("Total de clientes")).not.toBeInTheDocument();
    expect(screen.queryByText("Nenhum cliente cadastrado")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(mocks.crud.refresh).toHaveBeenCalledTimes(1);
  });

  it("announces loading without displaying zero totals or an empty state", () => {
    mocks.crud.items = []; mocks.crud.loading = true;
    view();
    expect(screen.getByRole("status")).toHaveTextContent("Carregando clientes");
    expect(screen.queryByText("Total de clientes")).not.toBeInTheDocument();
    expect(screen.queryByText("Nenhum cliente cadastrado")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Buscar clientes" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Status dos clientes" })).toBeInTheDocument();
  });
});
