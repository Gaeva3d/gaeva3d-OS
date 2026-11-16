import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import OrderConsultNavigation, { useConsultContext, useConsultHeading } from "../../components/orders/OrderConsultNavigation";
import { record, validId, useOrderTraceRead } from "../../components/orders/useOrderTraceRead";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

const text = (v) => typeof v === "string" && v.trim() ? v : "Não informado";
const decimal = (v) => (typeof v === "number" || typeof v === "string") && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(String(v).trim()) && Number.isFinite(Number(v));
const count = (v) => Number.isSafeInteger(v) && v >= 0;
function ReadState({ read, children }) {
  if (read.loading) return <p role="status">Carregando…</p>;
  if (read.error) return <div role="alert">{read.error} <button onClick={read.retry}>Tentar novamente</button></div>;
  return children;
}
const summaryValid = (s) => record(s);
function Summary({ id }) {
  const format = useFormatCurrency();
  const read = useOrderTraceRead(`/api/v1/payments/order/${id}/summary`, summaryValid);
  return <section aria-label="Resumo local"><h2>Resumo autoritativo do ledger local</h2><ReadState read={read}>{read.data && <dl>{[["order_total", "Total do pedido"], ["total_paid", "Pago local"], ["total_refunded", "Reembolsado local"], ["balance_due", "Saldo local"]].map(([field, label]) => <div key={field}><dt>{label}</dt><dd>{decimal(read.data[field]) ? format(read.data[field]) : "Não informado"}</dd></div>)}<dt>Registros concluídos</dt><dd>{count(read.data.payment_count) ? read.data.payment_count : "Não informado"}</dd><dt>Último pagamento local</dt><dd>{text(read.data.last_payment_date)}</dd></dl>}</ReadState></section>;
}
function History({ id }) {
  const context = useConsultContext(id);
  const [page, setPage] = useState(context.page);
  const format = useFormatCurrency();
  const validate = useCallback((s) => record(s) && Array.isArray(s.items) && count(s.total) && s.page === page && s.page_size === 20 && count(s.total_pages) && s.total_pages === Math.ceil(s.total / 20) && s.items.length <= 20 && s.items.length === Math.min(20, Math.max(0, s.total - (page - 1) * 20)) && s.items.every((i) => record(i) && validId(i.id) && i.sales_order_id === id) && new Set(s.items.map((i) => i.id)).size === s.items.length, [id, page]);
  const read = useOrderTraceRead(`/api/v1/payments?order_id=${id}&page=${page}&page_size=20`, validate);
  return <section aria-label="Histórico local"><OrderConsultNavigation orderId={id} origin="financials" page={read.error || (read.data && page > Math.max(1, read.data.total_pages)) ? 1 : page} /><h2>Histórico local · página {page}</h2><ReadState read={read}>{read.data && page > Math.max(1, read.data.total_pages) && <p>Página fora do intervalo atual. <button onClick={() => setPage(1)}>Voltar à primeira página</button></p>}{read.data && (read.data.items.length ? <div role="region" aria-label="Tabela do ledger local" tabIndex={0} className="overflow-x-auto"><table><thead><tr>{["Registro", "Valor", "Status legado", "Método", "Tipo", "Data", "Transação"].map((h) => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{read.data.items.map((i) => <tr key={i.id}><th scope="row">#{i.id} · {text(i.payment_number)}</th><td>{decimal(i.amount) ? format(i.amount) : "Não informado"}</td><td>{text(i.status)}</td><td>{text(i.payment_method)}</td><td>{text(i.payment_type)}</td><td>{text(i.payment_date)}</td><td>{text(i.transaction_id)}</td></tr>)}</tbody></table></div> : <p>Nenhum registro nesta página.</p>)}</ReadState><button disabled={page === 1 || read.loading} onClick={() => setPage((n) => n - 1)}>Página anterior</button><button disabled={read.loading || Boolean(read.error) || !read.data || page >= read.data.total_pages} onClick={() => setPage((n) => n + 1)}>Próxima página</button></section>;
}
function OrderLedger({ id }) {
  const validate = useCallback((o) => record(o) && o.id === id, [id]);
  const read = useOrderTraceRead(`/api/v1/sales-orders/${id}`, validate);
  return <ReadState read={read}>{read.data && <><h2>Pedido #{id} · {text(read.data.order_number)}</h2><Summary id={id} /><History id={id} /></>}</ReadState>;
}
export default function OrderFinancials() {
  const { orderId } = useParams();
  const id = /^\d+$/.test(orderId || "") ? Number(orderId) : NaN;
  const heading = useConsultHeading(id);
  return <main className="p-6 space-y-4"><h1 ref={heading} tabIndex={-1}>Ledger local do pedido</h1><p>Registros do ERP local. Não confirmam PSP, captura externa, elegibilidade financeira ou liberação de produção. Valores usam a formatação configurada; a API não informa moeda ISO por registro. O saldo vem do resumo local, nunca da soma desta página.</p>{validId(id) ? <><OrderLedger key={id} id={id} /></> : <p role="alert">Identificador de pedido inválido.</p>}</main>;
}
