import { useCallback, useId, useState } from "react";
import { record, validId, useOrderTraceRead } from "./useOrderTraceRead";

const quantity = (v) => (typeof v === "number" || typeof v === "string") && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(String(v).trim()) && Number.isFinite(Number(v)) ? String(v) : "Não informado";
const text = (v) => typeof v === "string" && v.trim() ? v : "Não informado";
function BlockerContent({ executionId }) {
  const validate = useCallback((b) => record(b) && b.production_order_id === executionId && record(b.status_summary) && Array.isArray(b.material_issues) && b.material_issues.every((m) => record(m) && validId(m.product_id)) && Array.isArray(b.other_issues) && b.other_issues.every((i) => record(i) && typeof i.type === "string" && ["blocking", "warning", "info"].includes(i.severity) && typeof i.message === "string"), [executionId]);
  const read = useOrderTraceRead(`/api/v1/production-orders/${executionId}/blocking-issues`, validate);
  if (read.loading) return <p role="status">Consultando motivos legados…</p>;
  if (read.error) return <div role="alert">{read.error}<button onClick={read.retry}>Tentar novamente</button></div>;
  const b = read.data;
  if (!b) return null;
  const count = b.status_summary.blocking_count;
  return <><p>Fonte: bloqueios legados da OP #{b.production_order_id} · {text(b.production_order_code)}</p><p>Contagem legada: {Number.isSafeInteger(count) && count >= 0 ? count : "Não informado"}</p><p>can_produce legado: {typeof b.status_summary.can_produce === "boolean" ? String(b.status_summary.can_produce) : "Não informado"}. Informação do serviço legado; não autoriza novos gates, aceite, capacidade ou despacho.</p><h4>Materiais</h4>{b.material_issues.length ? <ul>{b.material_issues.map((m, index) => <li key={`${m.product_id}/${index}`}>Produto #{m.product_id} · {text(m.product_sku)} · {text(m.product_name)} · Status: {text(m.status)} · Necessário: {quantity(m.quantity_required)} · Disponível: {quantity(m.quantity_available)} · Falta: {quantity(m.quantity_short)} · Projetado: {quantity(m.quantity_projected)}{record(m.incoming_supply) && <span> · Fonte de entrada: {text(m.incoming_supply.purchase_order_code)} · Quantidade: {quantity(m.incoming_supply.quantity)} · Data prevista: {text(m.incoming_supply.expected_date)}</span>}</li>)}</ul> : <p>Nenhum material nesta lista retornada.</p>}<h4>Outros motivos operacionais</h4>{b.other_issues.length ? <ul>{b.other_issues.map((i, index) => <li key={index}>Tipo: {i.type} · Severidade: {i.severity} · {i.message}</li>)}</ul> : <p>Nenhum outro motivo nesta lista retornada.</p>}</>;
}
export default function ProductionBlockersRead({ executionId }) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  return <section><button type="button" aria-expanded={open} aria-controls={regionId} onClick={() => setOpen((v) => !v)}>Motivos legados da OP #{executionId}</button>{open && <div role="region" aria-label="Motivos legados" id={regionId} key={executionId}><BlockerContent executionId={executionId} /></div>}</section>;
}
