import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import MaterialRequirementsSection from "../MaterialRequirementsSection";

vi.mock("../../../hooks/useFormatCurrency", () => ({ useFormatCurrency: () => (value) => String(value) }));
const requirement = { product_id: 7, product_sku: "MAT-7", product_name: "Filamento", gross_quantity: 5, available_quantity: 0, net_shortage: 5, unit_cost: 2 };
const view = (props = {}) => render(<MaterialRequirementsSection
  materialRequirements={[requirement]} materialAvailability={null}
  expandedSections={{ materialRequirements: true }} onToggle={() => {}}
  exploding={false} order={{ id: 42, product_id: 7 }}
  onCreatePurchaseOrder={() => {}} onCreateWorkOrder={() => {}} {...props}
/>);
afterEach(cleanup);

describe("cost estimate provenance without formula changes", () => {
  it.each([undefined, null, "", "invalid", "3kg", "0x10", "0b10", Infinity, "1e999", true])("keeps cost operand %s unknown", (value) => {
    view({ materialRequirements: [{ ...requirement, unit_cost: value }] });
    expect(screen.getByText("Estimativa: Não informado")).toBeInTheDocument();
  });
  it.each([undefined, null, "0x10", Infinity, true])("keeps gross operand %s unknown even when cost is zero", (value) => {
    view({ materialRequirements: [{ ...requirement, gross_quantity: value, unit_cost: 0 }] });
    expect(screen.getByText("Estimativa: Não informado")).toBeInTheDocument();
  });
  it.each([[0, 2, 0], [5, 0, 0], ["2.5", "1e2", 250], ["2.5", "-2", -5]])("preserves known arithmetic %s times %s", (gross, cost, total) => {
    view({ materialRequirements: [{ ...requirement, gross_quantity: gross, unit_cost: cost }] });
    expect(screen.getByText(`Estimativa: ${total}`)).toBeInTheDocument();
  });
  it("never presents a partial sum as complete", () => {
    view({ materialRequirements: [requirement, { ...requirement, product_id: 8, unit_cost: null }] });
    expect(screen.getByText("Estimativa: Não informado")).toBeInTheDocument();
  });
});

describe("material availability projection", () => {
  it("shows known zero stock without claiming all materials are available when summary is missing", () => {
    view();
    const cells = within(screen.getByText("MAT-7 - Filamento").closest("tr")).getAllByRole("cell");
    expect(cells[3]).toHaveTextContent("0,00");
    expect(screen.getByText("Disponibilidade não confirmada")).toBeInTheDocument();
    expect(screen.queryByText("Todos os materiais estão disponíveis")).not.toBeInTheDocument();
  });

  it.each([undefined, null, "", "invalid", NaN])("keeps missing stock %s distinct from zero", (value) => {
    view({ materialRequirements: [{ ...requirement, available_quantity: value, net_shortage: value }] });
    const cells = within(screen.getByText("MAT-7 - Filamento").closest("tr")).getAllByRole("cell");
    expect(cells[3]).toHaveTextContent("Não informado");
    expect(cells[4]).toHaveTextContent("Não informado");
    expect(screen.queryByRole("button", { name: "Criar pedido de compra" })).not.toBeInTheDocument();
  });

  it("accepts decimal strings and only shows confirmed availability from a consistent summary", () => {
    view({ materialRequirements: [{ ...requirement, gross_quantity: "2.50", available_quantity: "8.50", net_shortage: "0" }], materialAvailability: { has_shortages: false } });
    expect(screen.getByText("2,50")).toBeInTheDocument();
    expect(screen.getByText("8,50")).toBeInTheDocument();
    expect(screen.getByText("Todos os materiais estão disponíveis")).toBeInTheDocument();
  });

  it("does not show ready when the summary contradicts an actual shortage", () => {
    view({ materialAvailability: { has_shortages: false } });
    expect(screen.getByText("Disponibilidade não confirmada")).toBeInTheDocument();
    expect(screen.queryByText("Todos os materiais estão disponíveis")).not.toBeInTheDocument();
  });

  it.each([
    { has_shortages: false, materials_short: 1, total_materials: 1 },
    { has_shortages: false, materials_short: 0, total_materials: 0 },
    { has_shortages: false, materials_available: 0 },
    { has_shortages: false, materials_short: null },
  ])("does not confirm stock from contradictory or unknown explicit summary counters (F5-01)", (summary) => {
    view({ materialRequirements: [{ ...requirement, available_quantity: 5, net_shortage: 0 }], materialAvailability: summary });
    expect(screen.getByText("Disponibilidade não confirmada")).toBeInTheDocument();
    expect(screen.queryByText("Todos os materiais estão disponíveis")).not.toBeInTheDocument();
  });

  it("preserves confirmation for consistent explicit summary counters", () => {
    view({ materialRequirements: [{ ...requirement, available_quantity: 5, net_shortage: 0 }], materialAvailability: { has_shortages: false, materials_short: 0, total_materials: 1, materials_available: 1 } });
    expect(screen.getByText("Todos os materiais estão disponíveis")).toBeInTheDocument();
  });

  it("preserves historical reference mode and never offers production/purchase creation there", () => {
    view({ materialAvailability: { historical: true, has_shortages: true } });
    expect(screen.getAllByText("Somente para consulta").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: /Criar/ })).not.toBeInTheDocument();
    expect(screen.queryByText("Todos os materiais estão disponíveis")).not.toBeInTheDocument();
  });

  it("withholds stale readiness and table values while a recalculation is pending", () => {
    view({ exploding: true, materialAvailability: { has_shortages: false } });
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText("Todos os materiais estão disponíveis")).not.toBeInTheDocument();
  });

  it("does not infer that a BOM is absent merely because requirements and summary are unavailable", () => {
    view({ materialRequirements: [] });
    expect(screen.getByText(/Necessidades de materiais não confirmadas/)).toBeInTheDocument();
    expect(screen.queryByText(/não tem ficha técnica/)).not.toBeInTheDocument();
  });

  it("keeps the exact selected material for explicit existing purchase action and names the collapsible section", async () => {
    const onCreatePurchaseOrder = vi.fn(); const onToggle = vi.fn();
    view({ onCreatePurchaseOrder, onToggle });
    const toggle = screen.getByRole("button", { name: /Necessidades de materiais/ });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region")).toHaveAccessibleName(/Necessidades de materiais/);
    await userEvent.click(screen.getByRole("button", { name: "Criar pedido de compra" }));
    expect(onCreatePurchaseOrder).toHaveBeenCalledExactlyOnceWith(requirement);
    await userEvent.click(toggle);
    expect(onToggle).toHaveBeenCalledExactlyOnceWith("materialRequirements");
  });
});
