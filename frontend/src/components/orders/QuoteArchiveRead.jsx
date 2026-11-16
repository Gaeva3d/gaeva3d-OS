import { useCallback, useId, useState } from "react";
import { record, validId, useOrderTraceRead } from "./useOrderTraceRead";

const text = (v) => typeof v === "string" && v.trim() ? v : "Não informado";
const number = (v) => (typeof v === "number" || typeof v === "string") && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(String(v).trim()) && Number.isFinite(Number(v)) ? String(v) : "Não informado";
const records = (rows, valid) => Array.isArray(rows) && rows.every((row) => record(row) && valid(row));
function ArchiveContent({ quoteId, orderId }) {
  const validate = useCallback((a) => record(a) && record(a.quote) && a.quote.id === quoteId && (a.quote.sales_order_id == null || a.quote.sales_order_id === orderId) && typeof a.read_only === "boolean" && typeof a.pro_actions_available === "boolean" && records(a.quote.lines, (l) => validId(l.id)) && records(a.files, (f) => validId(f.id) && typeof f.original_filename === "string" && typeof f.file_hash === "string" && typeof f.file_format === "string" && Number.isSafeInteger(f.file_size_bytes) && f.file_size_bytes >= 0 && typeof f.uploaded_at === "string") && records(a.materials, (m) => Number.isSafeInteger(m.slot_number) && m.slot_number >= 0 && typeof m.material_type === "string") && new Set(a.files.map((f) => f.id)).size === a.files.length && new Set(a.quote.lines.map((l) => l.id)).size === a.quote.lines.length && new Set(a.materials.map((m) => m.slot_number)).size === a.materials.length, [quoteId, orderId]);
  const read = useOrderTraceRead(`/api/v1/quotes/${quoteId}/archive`, validate);
  if (read.loading) return <p role="status">Consultando arquivo histórico…</p>;
  if (read.error) return <div role="alert">{read.error}<button onClick={read.retry}>Tentar novamente</button></div>;
  const a = read.data;
  if (!a) return null;
  return <><p>Arquivo Core da proposta #{a.quote.id} · {text(a.quote.quote_number)} · Status legado: {text(a.quote.status)}</p><p>Consulta histórica somente. Não comprova revisão publicada ou aceita, licença PRO ou aprovação 2D/3D.</p><h4>Itens históricos</h4>{a.quote.lines.length ? <ul>{a.quote.lines.map((l) => <li key={l.id}>Item #{l.id} · Linha {number(l.line_number)} · {text(l.product_name)} · Quantidade: {number(l.quantity)} · {text(l.material_type)} · {text(l.color)}</li>)}</ul> : <p>Nenhum item de linha registrado. Item legado: {text(a.quote.product_name)} · Quantidade: {number(a.quote.quantity)}</p>}<h4>Metadados dos arquivos</h4>{a.files.length ? <ul>{a.files.map((f) => <li key={f.id}>Arquivo #{f.id} · {f.original_filename} · Formato: {f.file_format} · Bytes: {f.file_size_bytes} · Hash: {f.file_hash} · Enviado: {f.uploaded_at}</li>)}</ul> : <p>Nenhum arquivo registrado.</p>}<h4>Materiais históricos</h4>{a.materials.length ? <ul>{a.materials.map((m) => <li key={m.slot_number}>Slot {m.slot_number} · {m.material_type} · Cor: {text(m.color_name)} · Gramas: {number(m.material_grams)}</li>)}</ul> : <p>Nenhum material registrado.</p>}</>;
}
export default function QuoteArchiveRead({ quoteId, orderId }) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  return <section><button type="button" aria-expanded={open} aria-controls={regionId} onClick={() => setOpen((v) => !v)}>Arquivo histórico da proposta #{quoteId}</button>{open && <div id={regionId} role="region" aria-label="Arquivo histórico" key={`${quoteId}/${orderId}`}><ArchiveContent quoteId={quoteId} orderId={orderId} /></div>}</section>;
}
