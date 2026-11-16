import { useCallback, useState } from "react";
import { record, validId, useOrderTraceRead } from "./useOrderTraceRead";

export default function ResourceWindowRead({ resourceId }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [submission, setSubmission] = useState(0);
  const dates = [start, end].map((v) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v) ? Date.parse(`${v}:00Z`) : NaN);
  const valid = validId(resourceId) && dates.every(Number.isFinite) && dates[0] < dates[1];
  const active = valid && submitted === `${start}/${end}`;
  const path = active ? `/api/v1/resources/${resourceId}/schedule?start_date=${encodeURIComponent(new Date(dates[0]).toISOString())}&end_date=${encodeURIComponent(new Date(dates[1]).toISOString())}` : null;
  return <section aria-label="Janela do recurso"><h3>Agenda de Resource #{resourceId}</h3><p>Operações agendadas na janela UTC; capacidade, manutenção completa e autorização de despacho não confirmadas.</p><form onSubmit={(e) => { e.preventDefault(); if (valid) { setSubmitted(`${start}/${end}`); setSubmission((n) => n + 1); } }}><label>Início UTC<input type="datetime-local" value={start} onChange={(e) => { setStart(e.target.value); setSubmitted(null); }} /></label><label>Fim UTC<input type="datetime-local" value={end} onChange={(e) => { setEnd(e.target.value); setSubmitted(null); }} /></label><button disabled={!valid}>Consultar janela</button></form>{!active ? <p role="status">Escolha uma janela válida para consultar.</p> : <><p>Fonte: Resource #{resourceId} · {new Date(dates[0]).toISOString()} até {new Date(dates[1]).toISOString()}</p><ScheduleRead key={submission} resourceId={resourceId} path={path} /></>}</section>;
}

function ScheduleRead({ resourceId, path }) {
  const validate = useCallback((s) => record(s) && s.resource_id === resourceId && Array.isArray(s.operations) && s.operations.every((o) => record(o) && validId(o.operation_id) && validId(o.production_order_id) && typeof o.status === "string") && new Set(s.operations.map((o) => o.operation_id)).size === s.operations.length, [resourceId]);
  const read = useOrderTraceRead(path, validate);
  return <> {read.loading ? <p role="status">Consultando agenda…</p> : read.error ? <div role="alert">{read.error}<button onClick={read.retry}>Tentar novamente</button></div> : read.data && (read.data.operations.length ? <ul>{read.data.operations.map((o) => <li key={o.operation_id}>Operação #{o.operation_id} · OP #{o.production_order_id} · {o.status} · {typeof o.scheduled_start === "string" ? o.scheduled_start : "Não informado"} até {typeof o.scheduled_end === "string" ? o.scheduled_end : "Não informado"}</li>)}</ul> : <p>Nenhuma operação retornada nesta janela. Capacidade não confirmada.</p>)} </>;
}
