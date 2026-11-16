/**
 * CancelOrderModal + DeleteOrderModal - Confirmation modals for order actions.
 *
 * Extracted from OrderDetail.jsx (ARCHITECT-002)
 */
import { useState } from "react";

export function CancelOrderModal({ orderNumber, onCancel, onClose }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div
          className="fixed inset-0 bg-black/70"
          onClick={onClose}
        />
        <div className="relative bg-[var(--paper)] border border-[var(--rule-hair)] rounded-xl shadow-[var(--shadow-pop)] max-w-md w-full mx-auto p-6">
          <h3 className="text-lg font-semibold text-[var(--ink)] mb-4">
            Cancelar o pedido {orderNumber}?
          </h3>
          <p className="text-[var(--ink-3)] mb-4">
            O pedido será cancelado. Você ainda poderá excluí-lo depois do
            cancelamento.
          </p>
          <div className="mb-4">
            <label className="block text-sm text-[var(--ink-3)] mb-2">
              Motivo do cancelamento (opcional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg px-4 py-2 text-[var(--ink)]"
              rows={3}
              placeholder="Informe o motivo do cancelamento…"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--paper-sunk)] text-[var(--ink-2)] border border-[var(--rule-hair)] rounded-lg hover:bg-[var(--rule-hair)]"
            >
              Manter pedido
            </button>
            <button
              onClick={() => onCancel(reason)}
              className="px-4 py-2 bg-[var(--status-amber)] text-white rounded-lg hover:opacity-90"
            >
              Cancelar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeleteOrderModal({ orderNumber, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div
          className="fixed inset-0 bg-black/70"
          onClick={onClose}
        />
        <div className="relative bg-[var(--paper)] border border-[var(--rule-hair)] rounded-xl shadow-[var(--shadow-pop)] max-w-md w-full mx-auto p-6">
          <h3 className="text-lg font-semibold text-[var(--ink)] mb-4">
            Excluir o pedido {orderNumber}?
          </h3>
          <p className="text-[var(--ink-3)] mb-4">
            Todos os dados do pedido serão excluídos permanentemente, incluindo
            os itens e os registros de pagamento.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--paper-sunk)] text-[var(--ink-2)] border border-[var(--rule-hair)] rounded-lg hover:bg-[var(--rule-hair)]"
            >
              Manter pedido
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-[var(--status-red)] text-white rounded-lg hover:opacity-90"
            >
              Excluir definitivamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
