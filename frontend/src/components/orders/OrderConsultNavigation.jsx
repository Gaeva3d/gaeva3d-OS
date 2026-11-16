import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { record, validId } from "./useOrderTraceRead";

export function consultContext(state, orderId) {
  const c = record(state) && record(state.orderConsult) && state.orderConsult.orderId === orderId ? state.orderConsult : {};
  return { orderId, offset: Number.isSafeInteger(c.offset) && c.offset >= 0 && c.offset % 50 === 0 && c.offset <= Number.MAX_SAFE_INTEGER - 50 ? c.offset : 0, selection: validId(c.selection) ? c.selection : null, page: validId(c.page) && c.page <= Math.floor(Number.MAX_SAFE_INTEGER / 20) ? c.page : 1, origin: ["order", "traceability", "financials"].includes(c.origin) ? c.origin : "order" };
}
export function useConsultContext(orderId) {
  return consultContext(useLocation().state, orderId);
}
export function useConsultHeading(orderId) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, [orderId]);
  return ref;
}
export default function OrderConsultNavigation({ orderId, origin, offset, selection, page }) {
  const current = useConsultContext(orderId);
  const state = { orderConsult: consultContext({ orderConsult: { ...current, origin, ...(offset !== undefined ? { offset, selection } : {}), ...(page !== undefined ? { page } : {}) } }, orderId) };
  return <nav aria-label="Consultas do pedido" className="flex flex-wrap gap-3"><Link to={`/admin/orders/${orderId}`} state={state}>Voltar ao pedido</Link><Link to={`/admin/orders/${orderId}/traceability`} state={state}>Rastreabilidade</Link><Link to={`/admin/orders/${orderId}/financials`} state={state}>Ledger local</Link></nav>;
}
