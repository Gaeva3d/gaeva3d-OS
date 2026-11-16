/**
 * OrderWorkflowPanel - Order Workflow steps + secondary order actions row.
 *
 * Extracted from OrderDetail.jsx (DEBT-1 D1-C). Step logic, gating predicates
 * that only serve this panel, and markup moved verbatim. Shared order state
 * and shared predicates flow in via explicit props.
 */
import { useNavigate } from "react-router-dom";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";
import { orderCopy, orderStatusLabel, workflowStateLabel } from "./orderCopy";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  CreditCard,
  Factory,
  FileText,
  Truck,
} from "lucide-react";
import {
  SHIPPED_ORDER_STATUSES,
  UNCONFIRMED_ORDER_STATUSES,
} from "./orderWorkflowUtils";

/**
 * The step ladder on an order: quote -> confirm -> produce -> ship -> invoice,
 * each rendered from its own state and gated by the order's data.
 *
 * Step colours follow the status vocabulary in index.css: green = cleared,
 * amber = in progress, red = stopped, neutral = not started yet. The accent
 * is deliberately absent — it means "the action to take", and a step is a
 * report on what happened, not a button.
 */
export default function OrderWorkflowPanel({
  order,
  orderInvoice,
  paymentSummary,
  productionOrders,
  materialRequirements,
  generatingInvoice,
  sendingInvoice,
  confirmingOrder,
  hasOrderProduct,
  hasMainProductWO,
  hasShipmentEvidence,
  isBillingReleaseSatisfied,
  getProductionComplete,
  getProductionReleaseBlockReason,
  onConfirmOrder,
  onCreateProductionOrder,
  onGenerateInvoice,
  onSendInvoice,
  onRecordPayment,
  onRejectOrder,
  onCancelOrder,
  onCloseShort,
  onDeleteOrder,
}) {
  const navigate = useNavigate();
  const formatCurrency = useFormatCurrency();

  const canCancelOrder = () => {
    return order && ["pending", "confirmed", "on_hold"].includes(order.status);
  };

  const canCloseShort = () => {
    return (
      order &&
      !order.closed_short &&
      ["confirmed", "in_production", "ready_to_ship"].includes(order.status)
    );
  };

  const canDeleteOrder = () => {
    return order && ["cancelled", "pending"].includes(order.status);
  };

  const canGenerateInvoice = () => {
    const invoiceableStatuses = [
      "confirmed",
      "in_production",
      "ready_to_ship",
      "shipped",
      "delivered",
      "completed",
    ];
    return order && !orderInvoice && invoiceableStatuses.includes(order.status);
  };

  const getShipBlockReason = () => {
    if (!order) return orderCopy.orderLoading;
    if (SHIPPED_ORDER_STATUSES.has(order.status)) return orderCopy.orderAlreadyShipped;
    if (productionOrders.length === 0) return orderCopy.createProductionFirst;
    if (!getProductionComplete()) return orderCopy.productionMustFinish;
    if (materialRequirements.some((req) => req.net_shortage > 0)) {
      return orderCopy.materialsMustBeAvailable;
    }
    return "";
  };

  const canShipOrder = () => !getShipBlockReason();

  const getStepState = ({ done, active, blocked }) => {
    if (done) return "done";
    if (active) return "active";
    if (blocked) return "blocked";
    return "waiting";
  };

  const getStepClasses = (state) => {
    if (state === "done") {
      return {
        panel: "border-[var(--status-green)]/40 bg-[var(--status-green-tint)]",
        icon: "bg-[var(--status-green-tint)] text-[var(--status-green)]",
        label: "text-[var(--status-green)]",
      };
    }
    if (state === "active") {
      // amber is defined as in-progress/working (index.css status semantics)
      return {
        panel: "border-[var(--status-amber)]/40 bg-[var(--status-amber-tint)]",
        icon: "bg-[var(--status-amber-tint)] text-[var(--status-amber)]",
        label: "text-[var(--status-amber)]",
      };
    }
    if (state === "blocked") {
      // a blocked step is a stop condition, not work in progress
      return {
        panel: "border-[var(--status-red)]/40 bg-[var(--status-red-tint)]",
        icon: "bg-[var(--status-red-tint)] text-[var(--status-red)]",
        label: "text-[var(--status-red)]",
      };
    }
    return {
      panel: "border-[var(--rule-hair)] bg-[var(--paper-sunk)]",
      icon: "bg-[var(--paper-sunk)] text-[var(--ink-3)]",
      label: "text-[var(--ink-3)]",
    };
  };

  const renderStepIcon = (step) => {
    if (step.state === "done") {
      return <CheckCircle2 className="h-5 w-5" />;
    }
    if (step.state === "blocked") {
      return <AlertTriangle className="h-5 w-5" />;
    }
    if (step.Icon) {
      return <step.Icon className="h-5 w-5" />;
    }
    return <Circle className="h-5 w-5" />;
  };

  const getOrderWorkflowSteps = () => {
    const status = order?.status || "";
    const orderConfirmed = !UNCONFIRMED_ORDER_STATUSES.has(status);
    const canConfirmOrder = ["pending", "pending_confirmation"].includes(status);
    const hasInvoice = Boolean(orderInvoice);
    const invoiceStatus = orderInvoice?.status || "";
    const hasPayment = Number(paymentSummary?.total_paid || 0) > 0;
    const billingReleased = isBillingReleaseSatisfied();
    const productionReleased = hasMainProductWO();
    const productionComplete = getProductionComplete();
    const shipped = SHIPPED_ORDER_STATUSES.has(status);
    // LEGACY-1: "done" requires evidence, not just a status claim.
    const shipmentEvidence = hasShipmentEvidence();
    const legacyMismatch = shipped && !shipmentEvidence;
    const noProductionNeeded = !hasOrderProduct();
    const releaseBlockReason = getProductionReleaseBlockReason();
    const shipBlockReason = getShipBlockReason();

    const billingAction = (() => {
      if (canGenerateInvoice()) {
        return {
          label: generatingInvoice ? orderCopy.creating : orderCopy.createInvoice,
          onClick: onGenerateInvoice,
          disabled: generatingInvoice,
        };
      }
      if (orderInvoice?.status === "draft") {
        return {
          label: sendingInvoice ? orderCopy.markingSent : orderCopy.markSent,
          onClick: onSendInvoice,
          disabled: sendingInvoice,
        };
      }
      if (!billingReleased && orderConfirmed) {
        return {
          label: orderCopy.recordPayment,
          onClick: onRecordPayment,
        };
      }
      if (orderInvoice) {
        return {
          label: orderCopy.openInvoice,
          onClick: () => navigate(`/admin/invoices?invoice=${orderInvoice.id}`),
        };
      }
      return null;
    })();

    return [
      {
        id: "confirm",
        title: orderCopy.confirmOrder,
        Icon: CheckCircle2,
        state: getStepState({
          done: orderConfirmed,
          active: canConfirmOrder,
          blocked: status === "draft",
        }),
        meta: canConfirmOrder ? orderCopy.needsReview : orderStatusLabel(status),
        detail: canConfirmOrder
          ? orderCopy.confirmReview
          : orderCopy.confirmedForBilling,
        action: canConfirmOrder
          ? {
              label: confirmingOrder ? orderCopy.confirming : orderCopy.confirm,
              onClick: onConfirmOrder,
              disabled: confirmingOrder,
            }
          : null,
      },
      {
        id: "billing",
        title: orderCopy.billingStep,
        Icon: hasInvoice ? FileText : CreditCard,
        state: getStepState({
          done: billingReleased,
          active: orderConfirmed && !billingReleased,
          blocked: !orderConfirmed,
        }),
        meta: hasInvoice
          ? `${orderInvoice.invoice_number} · ${orderStatusLabel(invoiceStatus)}`
          : hasPayment
          ? `${formatCurrency(paymentSummary?.total_paid)} pagos`
          : orderCopy.notReleased,
        detail: billingReleased
          ? orderCopy.billingReleased
          : orderCopy.billingBeforeProduction,
        action: billingAction,
      },
      {
        id: "production",
        title: orderCopy.productionOrders,
        Icon: Factory,
        state: getStepState({
          done: productionReleased || noProductionNeeded,
          active: !productionReleased && !noProductionNeeded && !releaseBlockReason,
          blocked: Boolean(releaseBlockReason) && !productionReleased && !noProductionNeeded,
        }),
        meta: noProductionNeeded
          ? orderCopy.noProductLine
          : productionReleased
          ? `${productionOrders.length} ${productionOrders.length === 1 ? "ordem de produção" : "ordens de produção"}`
          : orderCopy.notReleased,
        detail: noProductionNeeded
          ? orderCopy.noProductionForServices
          : productionReleased
          ? orderCopy.productionLinked
          : releaseBlockReason || orderCopy.readyToCreateWorkOrders,
        action: productionReleased && productionOrders.length > 0
          ? {
              label: orderCopy.openWorkOrder,
              onClick: () => navigate(`/admin/production/${productionOrders[0].id}`),
            }
          : !releaseBlockReason
          ? {
              label: orderCopy.createWorkOrders,
              onClick: onCreateProductionOrder,
            }
          : null,
      },
      {
        id: "fulfillment",
        title: orderCopy.fulfillment,
        Icon: Truck,
        state: getStepState({
          done: shipped && shipmentEvidence,
          active: canShipOrder(),
          blocked: legacyMismatch || (!shipped && Boolean(shipBlockReason)),
        }),
        meta: legacyMismatch
          ? orderCopy.needsReview
          : shipped
          ? orderStatusLabel(status)
          : productionComplete
          ? orderCopy.readyToShip
          : orderCopy.waiting,
        detail: legacyMismatch
          ? `Status do pedido: ${orderStatusLabel(status)}. Não há envio registrado.`
          : shipped
          ? orderCopy.shipmentInProgress
          : shipBlockReason || orderCopy.productionReady,
        action: canShipOrder()
          ? {
              label: orderCopy.shipOrder,
              onClick: () => navigate(`/admin/shipping?orderId=${order.id}`),
            }
          : null,
      },
    ];
  };

  return (
      <div className="rounded-xl border border-[var(--rule-hair)] bg-[var(--paper)] p-5 shadow-[var(--shadow-pop)]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">{orderCopy.orderWorkflow}</h2>
            <p className="text-sm text-[var(--ink-3)]">
              {orderCopy.orderWorkflowDescription}
            </p>
          </div>
          <span className="w-fit rounded-full bg-[var(--paper-sunk)] px-3 py-1 text-xs font-medium text-[var(--ink-2)]">
            {orderStatusLabel(order.status)}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          {getOrderWorkflowSteps().map((step, index) => {
            const classes = getStepClasses(step.state);
            return (
              <div
                key={step.id}
                className={`flex min-h-[210px] flex-col rounded-lg border p-4 ${classes.panel}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${classes.icon}`}>
                      {renderStepIcon(step)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-4)]">
                        Etapa {index + 1}
                      </div>
                      <h3 className="text-sm font-semibold text-[var(--ink)]">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <span className={`rounded-full bg-[var(--paper-sunk)] px-2 py-1 text-xs font-medium capitalize ${classes.label}`}>
                    {workflowStateLabel(step.state)}
                  </span>
                </div>

                <div className="mt-4 flex-1">
                  <div className={`text-sm font-medium capitalize ${classes.label}`}>
                    {step.meta || orderCopy.waiting}
                  </div>
                  <p className="mt-2 text-sm leading-5 text-[var(--ink-2)]">
                    {step.detail}
                  </p>
                </div>

                {step.action && (
                  <button
                    onClick={step.action.onClick}
                    disabled={step.action.disabled}
                    className="mt-4 w-full rounded-lg bg-[var(--orange)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--orange-press)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {step.action.label}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Secondary / destructive actions — below workflow steps */}
        {(order.status === "pending_confirmation" || canCancelOrder() || canCloseShort() || canDeleteOrder()) && (
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--rule-hair)] pt-4">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--ink-4)]">
              {orderCopy.orderActions}
            </span>
            {(order.status === "pending" || order.status === "pending_confirmation") && (
              <>
                <button
                  onClick={onConfirmOrder}
                  disabled={confirmingOrder}
                  className="rounded-lg bg-[var(--paper-sunk)] px-3 py-1.5 text-sm text-[var(--ink-2)] border border-[var(--rule-hair)] hover:bg-[var(--rule-hair)] disabled:opacity-50"
                >
                  {confirmingOrder ? orderCopy.confirming : orderCopy.confirmOrder}
                </button>
                {order.status === "pending_confirmation" && (
                  <button
                    onClick={onRejectOrder}
                    className="rounded-lg bg-[var(--status-red)] px-3 py-1.5 text-sm text-white hover:opacity-90"
                  >
                    {orderCopy.rejectOrder}
                  </button>
                )}
              </>
            )}
            {canCancelOrder() && (
              <button
                onClick={onCancelOrder}
                className="rounded-lg bg-[var(--paper-sunk)] px-3 py-1.5 text-sm text-[var(--ink-2)] border border-[var(--rule-hair)] hover:bg-[var(--rule-hair)]"
              >
                {orderCopy.cancelOrder}
              </button>
            )}
            {canCloseShort() && (
              <button
                onClick={onCloseShort}
                className="rounded-lg bg-[var(--paper-sunk)] px-3 py-1.5 text-sm text-[var(--ink-2)] border border-[var(--rule-hair)] hover:bg-[var(--rule-hair)]"
              >
                {orderCopy.closeShort}
              </button>
            )}
            {canDeleteOrder() && (
              <button
                onClick={onDeleteOrder}
                className="rounded-lg bg-[var(--status-red)] px-3 py-1.5 text-sm text-white hover:opacity-90 border border-[var(--status-red)]"
              >
                {orderCopy.deleteOrder}
              </button>
            )}
          </div>
        )}
      </div>
  );
}
