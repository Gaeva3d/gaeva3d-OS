import { useState } from "react";
import { record, validId } from "./useOrderTraceRead";
import ResourceWindowRead from "./ResourceWindowRead";

const text = (v) => typeof v === "string" && v.trim() ? v : "Não informado";
const quantity = (v) => (typeof v === "number" || typeof v === "string") && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(String(v).trim()) && Number.isFinite(Number(v)) ? String(v) : "Não informado";
function Materials({ materials }) {
  if (!Array.isArray(materials) || materials.some((m) => !record(m) || !validId(m.id) || !validId(m.component_id)) || new Set(materials.map((m) => m.id)).size !== materials.length) return <p role="alert">Leitura de materiais indisponível.</p>;
  return materials.length ? <ul>{materials.map((m) => <li key={m.id}>Material #{m.component_id} · {text(m.component_sku)} · {text(m.component_name)} · Necessário: {quantity(m.quantity_required)} · Alocado: {quantity(m.quantity_allocated)} · Consumido: {quantity(m.quantity_consumed)} · Unidade: {text(m.unit)} · Status: {text(m.status)}</li>)}</ul> : <p>Nenhum material registrado nesta operação.</p>;
}
export default function ExecutionOperations({ execution }) {
  const [selected, setSelected] = useState(null);
  const rows = execution.operations;
  const valid = Array.isArray(rows) && rows.every((o) => record(o) && validId(o.id) && o.production_order_id === execution.id) && new Set(rows.map((o) => o.id)).size === rows.length;
  if (!valid) return <section aria-label="Operações da execução"><h3>Operações da execução</h3><p role="alert">Leitura de operações indisponível.</p></section>;
  const resource = rows.find((o) => o.id === selected)?.resource_id;
  return <section aria-label="Operações da execução"><h3>Operações da execução #{execution.id}</h3><p>Dados legados da OP, sem conversões ou gates derivados.</p>{!rows.length ? <p>Nenhuma operação registrada.</p> : <div role="region" aria-label="Tabela de operações e materiais" tabIndex={0} className="overflow-x-auto"><table><thead><tr>{["Operação", "Status", "Quantidades", "Tempos (min)", "Datas", "Centro / Resource", "Materiais"].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{rows.map((o) => <tr key={o.id}><th scope="row">#{o.id} · Sequência {quantity(o.sequence)} · {text(o.operation_code)} · {text(o.operation_name)}</th><td>{text(o.status)}</td><td>Concluída: {quantity(o.quantity_completed)} · Refugada: {quantity(o.quantity_scrapped)}</td><td>Setup planejado: {quantity(o.planned_setup_minutes)} · Execução planejada: {quantity(o.planned_run_minutes)} · Setup real: {quantity(o.actual_setup_minutes)} · Execução real: {quantity(o.actual_run_minutes)}</td><td>Agendada: {text(o.scheduled_start)} até {text(o.scheduled_end)} · Real: {text(o.actual_start)} até {text(o.actual_end)}</td><td>Centro #{validId(o.work_center_id) ? o.work_center_id : "Não informado"} · {text(o.work_center_name)} · Resource #{validId(o.resource_id) ? o.resource_id : "Não informado"} · {text(o.resource_name)}{validId(o.resource_id) ? <button aria-pressed={selected === o.id} onClick={() => setSelected(o.id)}>Consultar Resource #{o.resource_id}</button> : <p>Resource não informado; agenda indisponível.</p>}</td><td><Materials materials={o.materials} /></td></tr>)}</tbody></table></div>}{validId(resource) && <ResourceWindowRead key={`${execution.id}/${selected}/${resource}`} resourceId={resource} />}</section>;
}
