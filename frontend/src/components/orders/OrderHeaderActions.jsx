/**
 * OrderHeaderActions - Header action buttons (Refresh, Print Packing Slip).
 *
 * Extracted from OrderDetail.jsx (DEBT-1 D1-C).
 */
import { API_URL } from "../../config/api";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useConsultContext } from "./OrderConsultNavigation";
import { orderCopy } from "./orderCopy";

export default function OrderHeaderActions({ orderId, refreshing, onRefresh }) {
  const context = useConsultContext(Number(orderId));
  const traceLink = useRef(null);
  const financialLink = useRef(null);
  useEffect(() => {
    if (context.origin === "traceability") traceLink.current?.focus();
    if (context.origin === "financials") financialLink.current?.focus();
  }, [context.origin]);
  return (
        <div className="flex flex-wrap gap-2">
          <Link ref={traceLink} to={`/admin/orders/${orderId}/traceability`} state={{ orderConsult: context }} className="px-4 py-2 border rounded-lg">Rastreabilidade</Link>
          <Link ref={financialLink} to={`/admin/orders/${orderId}/financials`} state={{ orderConsult: context }} className="px-4 py-2 border rounded-lg">Ledger local</Link>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-[var(--paper-sunk)] text-[var(--ink-2)] border border-[var(--rule-hair)] rounded-lg hover:bg-[var(--rule-hair)] disabled:opacity-50"
            title={orderCopy.refreshOrderData}
          >
            {refreshing ? orderCopy.refreshing : orderCopy.refresh}
          </button>
          <button
            onClick={() =>
              window.open(
                `${API_URL}/api/v1/sales-orders/${orderId}/packing-slip/pdf`,
                "_blank"
              )
            }
            className="px-4 py-2 bg-[var(--paper-sunk)] text-[var(--ink-2)] border border-[var(--rule-hair)] rounded-lg hover:bg-[var(--rule-hair)]"
            title={orderCopy.printPackingSlipHelp}
          >
            {orderCopy.printPackingSlip}
          </button>
        </div>
  );
}
