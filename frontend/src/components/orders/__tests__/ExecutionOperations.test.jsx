import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import ExecutionOperations from "../ExecutionOperations";
const { api } = vi.hoisted(() => ({ api: { get: vi.fn() } }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => api }));
const operation = (extra = {}) => ({ id: 2, production_order_id: 1, sequence: 1, operation_name: "Cortar", resource_id: 7, work_center_id: 4, status: "pending", quantity_completed: "0", planned_run_minutes: "1e2", materials: [{ id: 3, component_id: 8, component_sku: "MAT-8", quantity_required: "2.5", quantity_allocated: 0, unit: "g" }], ...extra });
const view = (operations = [operation()], id = 1) => <ExecutionOperations key={id} execution={{ id, operations }} />;
const windowInputs = () => { fireEvent.change(screen.getByLabelText("Início UTC"), { target: { value: "2026-11-16T08:00" } }); fireEvent.change(screen.getByLabelText("Fim UTC"), { target: { value: "2026-11-16T10:00" } }); };
const open = async () => { await userEvent.click(screen.getByRole("button", { name: "Consultar Resource #7" })); windowInputs(); await userEvent.click(screen.getByRole("button", { name: "Consultar janela" })); };
beforeEach(() => { api.get.mockReset(); api.get.mockResolvedValue({ resource_id: 7, operations: [] }); });
afterEach(cleanup);
it.each(["success", "error"])("reconsulting the same window starts fresh until latest %s", async (outcome) => {
  let finish;
  api.get.mockResolvedValueOnce({ resource_id: 7, operations: [{ operation_id: 9, production_order_id: 11, status: "OLD-SCHEDULE" }] })
    .mockImplementationOnce(() => new Promise((resolve, reject) => { finish = outcome === "success" ? resolve : reject; }));
  render(view()); await open(); await screen.findByText(/OLD-SCHEDULE/);
  fireEvent.change(screen.getByLabelText("Fim UTC"), { target: { value: "2026-11-16T11:00" } });
  expect(screen.queryByText(/OLD-SCHEDULE/)).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Fim UTC"), { target: { value: "2026-11-16T10:00" } });
  await userEvent.click(screen.getByRole("button", { name: "Consultar janela" }));
  expect(api.get).toHaveBeenCalledTimes(2);
  expect(api.get.mock.calls[0][0]).toBe(api.get.mock.calls[1][0]);
  expect(api.get.mock.calls[0][1].signal.aborted).toBe(true);
  expect(screen.queryByText(/OLD-SCHEDULE/)).not.toBeInTheDocument();
  expect(screen.getByText("Consultando agenda…")).toBeInTheDocument();
  await act(async () => finish(outcome === "success" ? { resource_id: 7, operations: [{ operation_id: 10, production_order_id: 11, status: "NEW-SCHEDULE" }] } : { status: 403 }));
  if (outcome === "success") await screen.findByText(/NEW-SCHEDULE/);
  else await screen.findByRole("alert");
  expect(screen.queryByText(/OLD-SCHEDULE/)).not.toBeInTheDocument();
});
it("ignores a replaced same-path pending response even when it resolves last", async () => {
  let old;
  api.get.mockImplementationOnce(() => new Promise((resolve) => { old = resolve; }))
    .mockResolvedValueOnce({ resource_id: 7, operations: [] });
  render(view()); await open();
  await userEvent.click(screen.getByRole("button", { name: "Consultar janela" }));
  await screen.findByText(/Nenhuma operação retornada/);
  await act(async () => old({ resource_id: 7, operations: [{ operation_id: 9, production_order_id: 11, status: "OLD-SCHEDULE" }] }));
  expect(api.get.mock.calls[0][1].signal.aborted).toBe(true);
  expect(screen.queryByText(/OLD-SCHEDULE/)).not.toBeInTheDocument();
});
it("shows actual operation/material quantities, units and unknown values without costs", () => {
  render(view()); expect(screen.getByText(/Concluída: 0/)).toBeInTheDocument(); expect(screen.getByText(/Execução planejada: 1e2/)).toBeInTheDocument(); expect(screen.getByText(/MAT-8/)).toHaveTextContent("Necessário: 2.5 · Alocado: 0 · Consumido: Não informado · Unidade: g"); expect(api.get).not.toHaveBeenCalled();
});
it.each([null, [42], [{ ...operation(), production_order_id: 99 }]])("keeps malformed/foreign operations unavailable", (rows) => { render(view(rows)); expect(screen.getByRole("alert")).toBeInTheDocument(); expect(screen.queryByRole("button")).not.toBeInTheDocument(); });
it("distinguishes known empty operations", () => { render(view([])); expect(screen.getByText("Nenhuma operação registrada.")).toBeInTheDocument(); expect(screen.queryByRole("alert")).not.toBeInTheDocument(); });
it("rejects malformed materials while retaining operation", () => { render(view([operation({ materials: [42] })])); expect(screen.getByRole("alert")).toHaveTextContent("materiais"); expect(screen.getByText(/Cortar/)).toBeInTheDocument(); });
it.each(["0x10", "0b10", null])("keeps invalid quantity %s unknown", (v) => { render(view([operation({ quantity_completed: v })])); expect(screen.getByText(/Concluída: Não informado/)).toBeInTheDocument(); });
it("never maps a printer-only ID to Resource", () => { render(view([operation({ resource_id: null, printer_id: 7 })])); expect(screen.getByText(/agenda indisponível/)).toBeInTheDocument(); expect(screen.queryByRole("button")).not.toBeInTheDocument(); expect(api.get).not.toHaveBeenCalled(); });
it("requests only selected Resource and explicit valid UTC window, not capacity", async () => {
  render(view()); await open(); await screen.findByText(/Nenhuma operação retornada/);
  expect(api.get.mock.calls[0][0]).toBe("/api/v1/resources/7/schedule?start_date=2026-11-16T08%3A00%3A00.000Z&end_date=2026-11-16T10%3A00%3A00.000Z"); expect(screen.getByText(/Nenhuma operação retornada/)).toHaveTextContent("Capacidade não confirmada");
});
it.each([401, 403, 404, 503])("safe error/retry on Resource HTTP%s", async (status) => { api.get.mockRejectedValueOnce({ status }); render(view()); await open(); await screen.findByRole("alert"); await userEvent.click(screen.getByText("Tentar novamente")); await screen.findByText(/Nenhuma operação retornada/); });
it.each([{ resource_id: 8, operations: [] }, { resource_id: 7, operations: [42] }])("rejects mismatched or malformed schedule", async (data) => { api.get.mockResolvedValue(data); render(view()); await open(); await screen.findByRole("alert"); expect(screen.queryByText(/Nenhuma operação retornada/)).not.toBeInTheDocument(); });
it("shows scheduled records without inferring availability", async () => { api.get.mockResolvedValue({ resource_id: 7, operations: [{ operation_id: 9, production_order_id: 11, status: "scheduled", scheduled_start: "2026-11-16T08:00:00Z" }] }); render(view()); await open(); expect(await screen.findByText(/Operação #9/)).toHaveTextContent("OP #11"); });
it("clears old window and ignores its late response when dates change", async () => {
  let finish; api.get.mockImplementation(() => new Promise((r) => { finish = r; })); render(view()); await open(); expect(screen.getByText("Consultando agenda…")).toBeInTheDocument(); fireEvent.change(screen.getByLabelText("Fim UTC"), { target: { value: "2026-11-16T11:00" } });
  await act(async () => finish({ resource_id: 7, operations: [{ operation_id: 9, production_order_id: 11, status: "OLD" }] })); expect(screen.queryByText(/OLD/)).not.toBeInTheDocument(); expect(api.get.mock.calls[0][1].signal.aborted).toBe(true);
});
it("unmounts resource data on execution change", async () => { const { rerender } = render(view()); await open(); await screen.findByText(/Nenhuma operação retornada/); rerender(view([], 2)); expect(screen.queryByRole("region", { name: "Janela do recurso" })).not.toBeInTheDocument(); expect(api.get.mock.calls[0][1].signal.aborted).toBe(true); });
it("does not query missing or reversed date window", async () => { render(view()); await userEvent.click(screen.getByText("Consultar Resource #7")); expect(screen.getByText("Consultar janela")).toBeDisabled(); windowInputs(); fireEvent.change(screen.getByLabelText("Fim UTC"), { target: { value: "2026-11-16T07:00" } }); expect(screen.getByText("Consultar janela")).toBeDisabled(); expect(api.get).not.toHaveBeenCalled(); });
