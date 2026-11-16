import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import AdminCustomers from "../AdminCustomers";
import GaevaTopbar from "../../../components/nav/GaevaTopbar";
import { readFileSync } from "node:fs";
import postcss from "postcss";
const { mocks } = vi.hoisted(() => ({ mocks: { crud: { items: [], loading: false, error: null, refresh: vi.fn(), fetchAll: vi.fn() }, api: { get: vi.fn() } } }));
vi.mock("../../../hooks/useCRUD", () => ({ useCRUD: () => mocks.crud }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => mocks.api }));
vi.mock("../../../components/Toast", () => ({ useToast: () => ({ error: vi.fn(), success: vi.fn() }) }));
vi.mock("../../../hooks/useFormatCurrency", () => ({ useFormatCurrency: () => (v) => String(v) }));
vi.mock("../../../components/customers/CustomerModal", () => ({ default: () => <div role="dialog" aria-label="Cadastro de cliente" /> }));
vi.mock("../../../components/customers/CustomerDetailsModal", () => ({ default: ({ customer }) => <div role="dialog" aria-label={`Contato ${customer.full_name}`} /> }));
vi.mock("../../../components/customers/ImportCSVModal", () => ({ default: () => null }));
const customer = { id: 7, full_name: "Ana Lima", email: "ana@example.test", company_name: "Oficina", status: "active", order_count: 3, total_spent: 80, total_paid: 50, outstanding_balance: 30 };
beforeEach(() => { mocks.crud.items = [customer]; mocks.crud.loading = false; mocks.crud.error = null; mocks.api.get.mockResolvedValue(customer); });
afterEach(cleanup);
const view = () => render(<MemoryRouter><AdminCustomers /></MemoryRouter>);
it("topbar identifies the actual permission-filtered page without renaming its route", () => {
  render(<MemoryRouter initialEntries={["/admin/customers"]}><GaevaTopbar groups={[{ items: [{ path: "/admin/customers", label: "Customers", icon: () => <svg /> }] }]} user={{ first_name: "Ana" }} appearance="light" /></MemoryRouter>);
  expect(screen.getByRole("banner")).toHaveTextContent("Contatos");
});
it("delivers Contacts hierarchy, independent metrics, filter toolbar and keyboard scroll table from existing data", () => {
  view(); expect(screen.getByRole("heading", { level: 1, name: "Contatos" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Clientes e empresas" })).toBeInTheDocument(); expect(screen.getByText("1 de 1 nesta consulta")).toBeInTheDocument();
  expect(screen.getByRole("search", { name: "Filtrar contatos" })).toHaveClass("contacts-toolbar");
  expect(screen.getByRole("region", { name: "Tabela de contatos" })).toHaveAttribute("tabindex", "0");
  expect(screen.getByRole("button", { name: /Adicionar cliente/ })).toHaveClass("contacts-primary");
  expect(screen.getByRole("button", { name: "Importar CSV" })).toHaveClass("contacts-secondary");
  expect(screen.getByText("ana@example.test")).toBeInTheDocument(); expect(screen.getByText("Ana Lima").closest("td")).toHaveClass("contacts-person");
});
it("reuses original widget heading/metric slots for the six real meanings without demo visual data", () => {
  view();
  const cards = screen.getAllByRole("article");
  expect(cards).toHaveLength(6);
  for (const [index, title] of ["Total de clientes", "Ativos", "Com pedidos", "Pedidos registrados", "Valor recebido", "Saldo a receber"].entries()) {
    const card = cards[index];
    expect(card).toHaveAccessibleName(title);
    expect(card).toHaveClass("widget-card", "contact-metric-widget");
    expect(within(card).getByRole("heading", { level: 3, name: title })).toBeInTheDocument();
    expect(card.querySelector(".widget-metric strong")).toHaveTextContent(["1", "1", "1", "80", "50", "30"][index]);
    expect(Boolean(card.querySelector(".widget-currency"))).toBe(index >= 3);
    expect(card.querySelector("svg, .widget-status, .widget-delta, .widget-footer")).toBeNull();
  }
});
it("uses original separate four-column cards and original container wrapping geometry", () => {
  const css = postcss.parse(readFileSync("src/styles/gaeva-contacts.css", "utf8"));
  const rule = (selector) => css.nodes.find((node) => node.selector === selector)?.toString();
  expect(rule(".contacts-metrics")).toContain("repeat(4, minmax(0, 1fr))");
  expect(rule(".contacts-metrics")).toContain("gap: 12px");
  expect(rule(".contact-metric-widget")).toContain("padding: 12px");
  expect(rule(".contact-metric-widget")).toContain("border-radius: 16px");
  expect(css.toString()).toContain("@container (max-width: 935px)");
  expect(css.toString()).toContain("@container (max-width: 607px)");
});
it("retains explicit zero values without adding decorative unavailable claims", () => {
  mocks.crud.items = []; view();
  const cards = screen.getAllByRole("article");
  for (const card of cards) expect(card.querySelector(".widget-metric strong")).toHaveTextContent("0");
  expect(screen.queryByText("Não informado")).not.toBeInTheDocument();
});
it("keeps Contacts in its existing Modal and existing selection contract", async () => {
  view(); await userEvent.click(screen.getByRole("button", { name: "Visualizar" })); await screen.findByRole("dialog", { name: "Contato Ana Lima" });
  expect(mocks.api.get).toHaveBeenCalledWith("/api/v1/admin/customers/7");
  expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
});
it("filters the actual list without retaining a false visible-count or inventing contacts", async () => {
  view(); await userEvent.type(screen.getByRole("textbox", { name: "Buscar clientes" }), "missing"); expect(screen.getByText("0 de 1 nesta consulta")).toBeInTheDocument(); expect(within(screen.getByRole("table")).queryByText("Ana Lima")).not.toBeInTheDocument();
});
it("does not display table/metrics from a failed read in the new layout", () => {
  mocks.crud.error = "offline"; view(); expect(screen.getByRole("alert")).toBeInTheDocument(); expect(screen.queryByRole("table")).not.toBeInTheDocument(); expect(screen.queryByText("Clientes e empresas")).not.toBeInTheDocument();
});
