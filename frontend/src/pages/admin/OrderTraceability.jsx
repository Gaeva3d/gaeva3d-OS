import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import OrderConsultNavigation, { useConsultContext, useConsultHeading } from "../../components/orders/OrderConsultNavigation";
import { record, validId, useOrderTraceRead } from "../../components/orders/useOrderTraceRead";
import ExecutionOperations from "../../components/orders/ExecutionOperations";
import QuoteArchiveRead from "../../components/orders/QuoteArchiveRead";
import ProductionBlockersRead from "../../components/orders/ProductionBlockersRead";

const shown = (value) => typeof value === "string" || typeof value === "number" ? String(value) : "Não informado";
function ReadState({ read, children }) {
  if (read.loading) return <p role="status">Carregando registros…</p>;
  if (read.error) return <div role="alert">{read.error} <button onClick={read.retry}>Tentar novamente</button></div>;
  return children;
}
function Quote({ id, orderId }) {
  const validate = useCallback((q) => record(q) && q.id === id && (q.sales_order_id == null || q.sales_order_id === orderId), [id, orderId]);
  const read = useOrderTraceRead(`/api/v1/quotes/${id}`, validate);
  return <ReadState read={read}>{read.data && <><p>Proposta #{id}: {shown(read.data.quote_number)} · Status legado: {shown(read.data.status)} · Data: {shown(read.data.created_at)}</p><QuoteArchiveRead key={`${id}/${orderId}`} quoteId={id} orderId={orderId} /></>}</ReadState>;
}
function Inspections({ execution }) {
  const validate = useCallback((q) => record(q) && q.production_order_id === execution.id && Array.isArray(q.inspections) && q.total === q.inspections.length && q.inspections.every((i) => record(i) && validId(i.id) && i.production_order_id === execution.id && typeof i.result === "string"), [execution.id]);
  const read = useOrderTraceRead(`/api/v1/production-orders/${execution.id}/qc-inspections`, validate);
  return <section aria-label="Histórico QC"><h3>QC interno · {execution.code}</h3><ReadState read={read}>{read.data && (read.data.inspections.length ? <ul>{read.data.inspections.map((i) => <li key={i.id}>Inspeção #{i.id} · {i.result} · {shown(i.inspected_at)}</li>)}</ul> : <p>Nenhuma inspeção registrada.</p>)}</ReadState></section>;
}
function ExecutionDetail({ execution, orderId }) {
  const validate = useCallback((r) => record(r) && r.id === execution.id && r.sales_order_id === orderId && typeof r.code === "string", [execution.id, orderId]);
  const read = useOrderTraceRead(`/api/v1/production-orders/${execution.id}`, validate);
  return <ReadState read={read}>{read.data && <><p>Execução #{read.data.id} · Origem: {shown(read.data.source)} · Refação de: {shown(read.data.remake_of_id)} · Início: {shown(read.data.actual_start)} · Fim: {shown(read.data.actual_end)}</p><ExecutionOperations key={read.data.id} execution={read.data} /><Inspections execution={read.data} /><ProductionBlockersRead key={`blockers/${read.data.id}`} executionId={read.data.id} /></>}</ReadState>;
}
function Executions({ orderId }) {
  const context = useConsultContext(orderId);
  const [offset, setOffset] = useState(context.offset);
  const [selection, setSelection] = useState(context.selection);
  const validate = useCallback((rows) => Array.isArray(rows) && rows.every((r) => record(r) && validId(r.id) && r.sales_order_id === orderId && typeof r.code === "string") && new Set(rows.map((r) => r.id)).size === rows.length, [orderId]);
  const read = useOrderTraceRead(`/api/v1/production-orders/?sales_order_id=${orderId}&offset=${offset}&limit=50`, validate);
  const selected = !read.loading && !read.error && read.data?.find((r) => r.id === selection);
  return <section aria-label="Execuções vinculadas"><OrderConsultNavigation orderId={orderId} origin="traceability" offset={offset} selection={selected?.id ?? null} /><h2>Execuções vinculadas · página {offset / 50 + 1}</h2><ReadState read={read}>{read.data && (read.data.length ? <ul>{read.data.map((r) => <li key={r.id}><button aria-pressed={selection === r.id} onClick={() => setSelection(r.id)}>{r.code} · OP #{r.id}</button> · Status legado: {shown(r.status)} · Linha: {shown(r.sales_order_line_id)} · Criada: {shown(r.created_at)}</li>)}</ul> : <p>Nenhuma execução nesta página.</p>)}</ReadState><button disabled={offset === 0 || read.loading} onClick={() => { setSelection(null); setOffset((n) => n - 50); }}>Página anterior</button><button disabled={read.loading || Boolean(read.error) || read.data?.length !== 50} onClick={() => { setSelection(null); setOffset((n) => n + 50); }}>Próxima página</button>{selected && <ExecutionDetail key={selected.id} execution={selected} orderId={orderId} />}</section>;
}
function OrderRecords({ id }) {
  const validate = useCallback((o) => record(o) && o.id === id && (o.quote_id == null || validId(o.quote_id)), [id]);
  const read = useOrderTraceRead(`/api/v1/sales-orders/${id}`, validate);
  return <ReadState read={read}>{read.data && <><h2>Pedido #{id} · {shown(read.data.order_number)}</h2><p>Status legado: {shown(read.data.status)} · Data: {shown(read.data.created_at)}</p><h2>Proposta vinculada</h2>{read.data.quote_id == null ? <p>Sem proposta vinculada.</p> : <Quote id={read.data.quote_id} orderId={id} />}<Executions orderId={id} /></>}</ReadState>;
}
export default function OrderTraceability() {
  const { orderId } = useParams();
  const id = /^\d+$/.test(orderId || "") ? Number(orderId) : NaN;
  const heading = useConsultHeading(id);
  return <main className="p-6 space-y-4"><h1 ref={heading} tabIndex={-1}>Rastreabilidade do pedido</h1><p>Consulta de registros ERP existentes. QC interno não representa aceite do cliente. Revisões aceitas e novos gates não disponíveis nesta consulta.</p>{validId(id) ? <><OrderRecords key={id} id={id} /></> : <p role="alert">Identificador de pedido inválido.</p>}</main>;
}
