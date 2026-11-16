import { productionControlLabels } from "./productionControlLabels";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";
import { formatProductionDate, formatProductionQuantity, productionCopy, productionErrorMessage, productionOrderStatusLabel, productionStatusLabel } from "./productionControlsCopy";
import { useState, useEffect, useRef } from "react";
import { API_URL } from "../../config/api";
import { formatDuration, toLocalInputValue } from "../../utils/formatting";
import { PRODUCTION_ORDER_BADGE_CONFIGS } from "../../lib/statusColors.js";
import Modal from "../Modal";
import OperationCard from "./OperationCard";
import SkipOperationModal from "./SkipOperationModal";
import ShortageModal from "./ShortageModal";

/**
 * Normalize a FastAPI error detail into a renderable string.
 * `detail` can be a string, an array (pydantic validation errors), or an
 * arbitrary object. Calling setError(detail) directly with the latter two
 * shapes produces "[object Object]" on screen.
 */
function normalizeErrorDetail(detail, fallback) {
  if (detail == null) return fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (typeof d === "string" ? d : d?.msg || JSON.stringify(d)))
      .join("; ");
  }
  if (typeof detail === "object") {
    return detail.msg || detail.message || JSON.stringify(detail);
  }
  return String(detail);
}

/**
 * Status badge component
 */
function StatusBadge({ status }) {
  const config =
    PRODUCTION_ORDER_BADGE_CONFIGS[status] ||
    PRODUCTION_ORDER_BADGE_CONFIGS.draft;
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {productionOrderStatusLabel(status)}
    </span>
  );
}

/**
 * Parse datetime string, ensuring UTC interpretation
 * Backend sends UTC times without 'Z' suffix
 */
function parseDateTime(datetime) {
  if (!datetime) return null;
  if (datetime instanceof Date) return datetime;

  // If string doesn't have timezone info, assume UTC and add 'Z'
  let dateStr = datetime;
  if (
    typeof dateStr === "string" &&
    !dateStr.endsWith("Z") &&
    !dateStr.includes("+") &&
    !dateStr.includes("-", 10)
  ) {
    dateStr = dateStr + "Z";
  }
  return new Date(dateStr);
}

/**
 * ProductionOrderModal - Production execution hub
 *
 * Shows production order details with all operations.
 * Allows operators to Schedule, Start, Complete, and Skip operations.
 */
export default function ProductionOrderModal({
  productionOrder,
  onClose,
  onUpdated,
}) {
  const formatCurrency = useFormatCurrency();
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOpId, setExpandedOpId] = useState(null);
  const [notes, setNotes] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);

  // Skip modal state
  const [skipModalOpen, setSkipModalOpen] = useState(false);
  const [operationToSkip, setOperationToSkip] = useState(null);

  // Shortage modal state
  const [shortageModalOpen, setShortageModalOpen] = useState(false);
  const [shortageInfo, setShortageInfo] = useState(null);

  const [refreshRoutingLoading, setRefreshRoutingLoading] = useState(false);

  // Spool assignment state
  const [assignedSpools, setAssignedSpools] = useState([]);
  const [spoolPickerFor, setSpoolPickerFor] = useState(null); // component_id of material being assigned
  const [availableSpools, setAvailableSpools] = useState([]);
  const [spoolLoading, setSpoolLoading] = useState(false);

  // Workstream B0: variant swap state. variantPickerFor = { materialId, templateId }
  // when the operator is choosing a variant to substitute for a template-component
  // material. Tactical override for templates whose own-stock is 0 but variants
  // have stock — does not change BOM, only mutates this PO's material row.
  const [variantPickerFor, setVariantPickerFor] = useState(null);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [variantLoading, setVariantLoading] = useState(false);
  const [variantSwapReason, setVariantSwapReason] = useState("");
  // Tracks the in-flight variant-list AbortController so a quick second click
  // on a different material aborts the older request and prevents a slow
  // earlier response from clobbering a faster later one.
  const variantFetchControllerRef = useRef(null);

  // Schedule modal state (for pending ops)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [operationToSchedule, setOperationToSchedule] = useState(null);
  const [workCenters, setWorkCenters] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [scheduledStart, setScheduledStart] = useState("");
  const [suggestedSlot, setSuggestedSlot] = useState(null); // { start, end } when conflict occurs

  // Fetch operations on mount
  useEffect(() => {
    if (productionOrder?.id) {
      fetchOperations();
      fetchAssignedSpools();
      setNotes(productionOrder.notes || '');
    }
  }, [productionOrder?.id]);

  // Fetch work centers for scheduling
  useEffect(() => {
    fetchWorkCenters();
  }, []);

  // Workstream B0: abort any in-flight variant-list fetch on unmount so the
  // response can't write into state after the component is gone.
  useEffect(() => {
    return () => {
      if (variantFetchControllerRef.current) {
        variantFetchControllerRef.current.abort();
        variantFetchControllerRef.current = null;
      }
    };
  }, []);

  // Fetch resources when work center changes
  useEffect(() => {
    if (selectedWorkCenter) {
      fetchResources(selectedWorkCenter);
    } else {
      setResources([]);
    }
  }, [selectedWorkCenter]);

  const fetchAssignedSpools = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/production-orders/${productionOrder.id}/spools`,
        { credentials: "include" }
      );
      if (res.ok) {
        setAssignedSpools(await res.json());
      }
    } catch { /* ignore */ }
  };

  const openSpoolPicker = async (componentId) => {
    setSpoolPickerFor(componentId);
    setAvailableSpools([]);
    setSpoolLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/v1/spools/?product_id=${componentId}&status=active`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setAvailableSpools(data.items || []);
      }
    } catch { /* ignore */ }
    setSpoolLoading(false);
  };

  const assignSpool = async (spoolId) => {
    if (spoolLoading) return;
    try {
      setSpoolLoading(true);
      const res = await fetch(
        `${API_URL}/api/v1/production-orders/${productionOrder.id}/spools/${spoolId}`,
        { method: "POST", credentials: "include" }
      );
      if (res.ok) {
        await fetchAssignedSpools();
        setSpoolPickerFor(null);
      }
    } catch { /* ignore */ }
    setSpoolLoading(false);
  };

  const openVariantPicker = async (materialId, templateId) => {
    // Abort any in-flight variant-list fetch from a prior click — guards
    // against the slow-response-clobbers-fast-response race.
    if (variantFetchControllerRef.current) {
      variantFetchControllerRef.current.abort();
    }
    const controller = new AbortController();
    variantFetchControllerRef.current = controller;

    setVariantPickerFor({ materialId, templateId });
    setAvailableVariants([]);
    setVariantSwapReason("");
    setVariantLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/v1/items/${templateId}/variants`,
        { credentials: "include", signal: controller.signal }
      );
      // If a newer request started, this response is stale — silently drop it.
      if (variantFetchControllerRef.current !== controller) return;
      if (res.ok) {
        const data = await res.json();
        setAvailableVariants(Array.isArray(data) ? data : data.items || []);
      } else {
        // Surface real failures instead of silently rendering "no variants".
        const err = await res.json().catch(() => ({}));
        setError(normalizeErrorDetail(err.detail, "Não foi possível carregar as variantes"));
      }
    } catch (e) {
      if (e.name === "AbortError") return;  // expected on supersession or unmount
      // Genuine network/parse error on the latest request — show it.
      if (variantFetchControllerRef.current === controller) {
        setError(normalizeErrorDetail(e?.message, "Não foi possível carregar as variantes"));
      }
    } finally {
      // Only clear loading if this is still the latest request.
      if (variantFetchControllerRef.current === controller) {
        setVariantLoading(false);
        variantFetchControllerRef.current = null;
      }
    }
  };

  const swapVariant = async (newComponentId) => {
    if (!variantPickerFor || variantLoading) return;
    try {
      setVariantLoading(true);
      const res = await fetch(
        `${API_URL}/api/v1/production-orders/${productionOrder.id}/materials/${variantPickerFor.materialId}/component`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            new_component_id: newComponentId,
            reason: variantSwapReason.trim() || null,
          }),
        }
      );
      if (res.ok) {
        setVariantPickerFor(null);
        setVariantSwapReason("");
        await fetchOperations();
        if (onUpdated) onUpdated();
      } else {
        const err = await res.json().catch(() => ({}));
        setError(normalizeErrorDetail(err.detail, "Não foi possível trocar a variante"));
      }
    } catch (e) {
      setError(normalizeErrorDetail(e.message, "Não foi possível trocar a variante"));
    }
    setVariantLoading(false);
  };

  const fetchOperations = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/v1/production-orders/${productionOrder.id}/operations`,
        { credentials: "include" },
      );
      if (res.ok) {
        const data = await res.json();
        const ops = data.operations || data || [];
        setOperations(ops);

        // Auto-expand running operation
        const runningOp = ops.find((op) => op.status === "running");
        if (runningOp) {
          setExpandedOpId(runningOp.id);
        }
      }
    } catch {
      // err unused
      setError(productionCopy.loadingOperationsFailed);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkCenters = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/work-centers/?center_type=machine&active_only=true`,
        { credentials: "include" },
      );
      if (res.ok) {
        setWorkCenters(await res.json());
      }
    } catch {
      // Non-critical
    }
  };

  const fetchResources = async (workCenterId) => {
    try {
      const [resourcesRes, printersRes] = await Promise.all([
        fetch(
          `${API_URL}/api/v1/work-centers/${workCenterId}/resources?active_only=true`,
          { credentials: "include" },
        ),
        fetch(
          `${API_URL}/api/v1/work-centers/${workCenterId}/printers?active_only=true`,
          { credentials: "include" },
        ),
      ]);

      const allResources = [];

      if (resourcesRes.ok) {
        const data = await resourcesRes.json();
        allResources.push(
          ...data.filter(
            (r) => r.status === "available" || r.status === "idle",
          ),
        );
      }

      if (printersRes.ok) {
        const printers = await printersRes.json();
        // Get existing resource codes to avoid duplicates
        const existingCodes = new Set(allResources.map((r) => r.code));
        allResources.push(
          ...printers
            .filter(
              (p) =>
                p.status === "idle" || p.status === "available" || !p.status,
            )
            .filter((p) => !existingCodes.has(p.code)) // Skip if already in resources
            .map((p) => ({
              id: p.id,
              code: p.code,
              name: p.name,
              status: p.status || "available",
              is_printer: true,
            })),
        );
      }

      setResources(allResources);
    } catch {
      // Non-critical
    }
  };

  // Calculate max qty for current operation (from previous op or PO qty)
  const getMaxQtyForOperation = (opIndex) => {
    if (opIndex === 0) {
      return productionOrder.quantity_ordered || 0;
    }
    const prevOp = operations[opIndex - 1];
    if (prevOp?.status === "complete") {
      return prevOp.quantity_completed || 0;
    }
    if (prevOp?.status === "skipped") {
      // Inherit from the one before
      return getMaxQtyForOperation(opIndex - 1);
    }
    return productionOrder.quantity_ordered || 0;
  };

  // Handle schedule operation
  const handleSchedule = (operation) => {
    setOperationToSchedule(operation);
    setSelectedWorkCenter(operation.work_center_id || null);
    const now = new Date();
    now.setHours(now.getHours() + 1);
    setScheduledStart(toLocalInputValue(now));
    setScheduleModalOpen(true);
  };

  const submitSchedule = async () => {
    if (!operationToSchedule || !selectedResource) return;

    setActionLoading(true);
    setError(null);
    setSuggestedSlot(null);

    try {
      // Calculate end time from operation planned times
      const plannedMinutes =
        (parseFloat(operationToSchedule.planned_setup_minutes) || 0) +
        (parseFloat(operationToSchedule.planned_run_minutes) || 0);
      const start = new Date(scheduledStart);
      const end = new Date(start.getTime() + plannedMinutes * 60000);

      const res = await fetch(
        `${API_URL}/api/v1/production-orders/${productionOrder.id}/operations/${operationToSchedule.id}/schedule`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resource_id: selectedResource.id,
            scheduled_start: start.toISOString(),
            scheduled_end: end.toISOString(),
            is_printer: selectedResource.is_printer || false,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        // If conflict (409), fetch next available slot and suggest it
        if (res.status === 409) {
          try {
            const slotRes = await fetch(
              `${API_URL}/api/v1/production-orders/resources/next-available`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  resource_id: selectedResource.id,
                  duration_minutes: Math.ceil(plannedMinutes) || 60,
                  is_printer: selectedResource.is_printer || false,
                  after: start.toISOString(),
                }),
              },
            );
            if (slotRes.ok) {
              const slot = await slotRes.json();
              setSuggestedSlot({
                start: slot.next_available,
                end: slot.suggested_end,
              });
              setError("Conflito de agendamento. Confira o horário sugerido abaixo.");
              return;
            }
          } catch {
            // If we can't get suggestion, fall through to regular error
          }
        }

        throw new Error(data.detail || "Não foi possível agendar a operação");
      }

      // Backend returns 200 with success: false for scheduling conflicts,
      // including next_available_start/end for the suggested slot.
      if (data.success === false) {
        if (data.next_available_start) {
          setSuggestedSlot({
            start: data.next_available_start,
            end: data.next_available_end,
          });
        }
        setError(productionErrorMessage({ message: data.message }, "Conflito de agendamento. Confira o horário sugerido abaixo."));
        return;
      }

      setScheduleModalOpen(false);
      setOperationToSchedule(null);
      setSelectedResource(null);
      setSuggestedSlot(null);
      fetchOperations();
    } catch (err) {
      setError(productionErrorMessage(err, "Não foi possível atualizar a ordem de produção"));
    } finally {
      setActionLoading(false);
    }
  };

  // Apply suggested time slot
  const applySuggestedSlot = () => {
    if (suggestedSlot) {
      setScheduledStart(toLocalInputValue(suggestedSlot.start));
      setSuggestedSlot(null);
      setError(null);
    }
  };

  // Handle start operation
  const handleStart = async (operation) => {
    setActionLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/api/v1/production-orders/${productionOrder.id}/operations/${operation.id}/start`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || productionCopy.startOperationFailed);
      }

      // Refresh operations first, then notify parent
      await fetchOperations();
      onUpdated?.();
    } catch (err) {
      setError(productionErrorMessage(err, "Não foi possível atualizar a ordem de produção"));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle complete operation
  const handleComplete = async (
    operationId,
    qtyGood,
    qtyBad,
    scrapReason = null,
  ) => {
    setActionLoading(true);
    setError(null);

    try {
      const payload = {
        quantity_completed: qtyGood,
        quantity_scrapped: qtyBad,
      };
      if (scrapReason) {
        payload.scrap_reason = scrapReason;
      }

      const res = await fetch(
        `${API_URL}/api/v1/production-orders/${productionOrder.id}/operations/${operationId}/complete`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || productionCopy.completeOperationFailed);
      }

      const data = await res.json();

      // Check if PO is now short - show shortage modal
      if (
        data.production_order?.status === "short" &&
        data.production_order?.quantity_short > 0
      ) {
        setShortageInfo({
          poCode: data.production_order.code,
          quantityOrdered: data.production_order.quantity_ordered,
          quantityCompleted: data.production_order.quantity_completed,
          quantityShort: data.production_order.quantity_short,
          salesOrderId: data.production_order.sales_order_id,
          salesOrderCode: data.production_order.sales_order_code,
          productId: productionOrder.product_id || productionOrder.product?.id,
        });
        setShortageModalOpen(true);
      }

      // Refresh operations first, then notify parent
      await fetchOperations();
      onUpdated?.();
    } catch (err) {
      setError(productionErrorMessage(err, "Não foi possível atualizar a ordem de produção"));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle skip operation
  const handleSkip = (operation) => {
    setOperationToSkip(operation);
    setSkipModalOpen(true);
  };

  const onSkipped = () => {
    fetchOperations();
    onUpdated?.();
  };

  // Handle notes save
  const saveNotes = async () => {
    if (notes === productionOrder.notes) return;

    setNotesSaving(true);
    try {
      await fetch(`${API_URL}/api/v1/production-orders/${productionOrder.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });
      onUpdated?.();
    } catch {
      // Silent fail
    } finally {
      setNotesSaving(false);
    }
  };

  // Handle claim (assign current user to next operation)
  const handleClaim = async () => {
    const nextOp = operations.find(
      (op) =>
        op.status === "pending" ||
        op.status === "queued" ||
        op.status === "running",
    );
    if (!nextOp) return;

    // For now, just set operator_name - would need user context for real implementation
    // This is a placeholder - in production you'd get the current user from auth context
    alert("É necessário entrar para assumir esta ordem.");
  };

  // Refresh routing — re-snapshot the product's current active routing
  const handleRefreshRouting = async () => {
    if (refreshRoutingLoading) return;
    if (
      !window.confirm(
        "Reaplicar o roteiro atual a esta ordem de produção? As operações pendentes serão substituídas.",
      )
    )
      return;
    setRefreshRoutingLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/api/v1/production-orders/${productionOrder.id}/refresh-routing`,
        { method: "POST", credentials: "include" },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(normalizeErrorDetail(data?.detail, "Não foi possível atualizar o roteiro"));
      }
      await fetchOperations();
      onUpdated?.();
    } catch (err) {
      setError(productionErrorMessage(err, "Não foi possível atualizar a ordem de produção"));
    } finally {
      setRefreshRoutingLoading(false);
    }
  };

  // Calculate totals
  const totalMinutes = operations.reduce(
    (sum, op) =>
      sum +
      (parseFloat(op.planned_setup_minutes) || 0) +
      (parseFloat(op.planned_run_minutes) || 0),
    0,
  );

  const completedOps = operations.filter(
    (op) => op.status === "complete",
  ).length;
  const runningOps = operations.filter((op) => op.status === "running").length;

  // Gather all materials
  const allMaterials = operations.flatMap((op) => op.materials || []);
  const materialsReady = allMaterials.filter(
    (m) => m.status === "allocated" || m.status === "consumed",
  ).length;
  const materialsBlocking = allMaterials.filter(
    (m) => m.status === "unavailable" || m.status === "pending",
  );

  if (!productionOrder) return null;

  const canRefreshRouting = ["draft", "released", "on_hold"].includes(
    productionOrder.status,
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`${productionCopy.workOrder} ${productionOrder.code}`}
      variant="workbench"
      className="w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-[var(--rule-hair)]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[var(--ink)]">
              {productionOrder.code}
            </h2>
            <StatusBadge status={productionOrder.status} />
          </div>
          <p className="text-[var(--ink-3)] mt-1">
            {productionOrder.product_name ||
              productionOrder.product?.name ||
              "Produto desconhecido"}
            <span className="text-[var(--ink-4)]"> × </span>
            <span className="text-[var(--ink)] font-mono">
              {formatProductionQuantity(productionOrder.quantity_ordered)}
            </span>
            {productionOrder.due_date && (
              <span className="text-[var(--ink-4)] ml-3">
                {productionControlLabels.prazo}{formatProductionDate(productionOrder.due_date)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--ink-3)] hover:text-[var(--ink)] text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mt-4 bg-[var(--status-red-tint)] border border-[var(--status-red)]/30 rounded-lg p-3 text-[var(--status-red)] text-sm">
          {error}
        </div>
      )}

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-3">
              <div className="text-[var(--ink-4)] text-xs">{productionCopy.operations}</div>
              <div className="text-[var(--ink)] font-medium">
                {completedOps}/{operations.length}{productionControlLabels.concluidas}
                {runningOps > 0 && (
                  <span className="text-[var(--status-amber)] ml-1">({runningOps}{productionControlLabels.emExecucao2}</span>
                )}
              </div>
            </div>
            <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-3">
              <div className="text-[var(--ink-4)] text-xs">{productionControlLabels.duracaoEstimada2}</div>
              <div className="text-[var(--ink)] font-medium font-mono">
                {formatDuration(totalMinutes)}
              </div>
            </div>
            <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-3">
              <div className="text-[var(--ink-4)] text-xs">{productionCopy.materials}</div>
              <div
                className={`font-medium ${
                  materialsBlocking.length > 0 ? 'text-[var(--status-red)]' : 'text-[var(--status-green)]'
                }`}
              >
                {allMaterials.length > 0
                  ? `${materialsReady}/${allMaterials.length} prontos`
                  : 'Nenhum material necessário'}
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          {(productionOrder.estimated_material_cost != null || productionOrder.actual_material_cost != null) && (
            <div>
              <h3 className="text-[var(--ink-3)] text-sm font-medium mb-3">{productionControlLabels.custos}</h3>
              <div className="grid grid-cols-2 gap-3">
                {productionOrder.estimated_material_cost != null && (
                  <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-3">
                    <div className="text-[var(--ink-4)] text-xs mb-1">{productionControlLabels.estimado}</div>
                    <div className="text-[var(--ink)] font-mono text-sm">
                      {formatCurrency((parseFloat(productionOrder.estimated_material_cost) + parseFloat(productionOrder.estimated_labor_cost || 0)))}
                    </div>
                    <div className="text-[var(--ink-4)] text-xs mt-1">
                      {productionControlLabels.materiais}{formatCurrency(parseFloat(productionOrder.estimated_material_cost))}{productionControlLabels.maoDeObra}{formatCurrency(parseFloat(productionOrder.estimated_labor_cost || 0))}
                    </div>
                  </div>
                )}
                {productionOrder.actual_material_cost != null && (
                  <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-3">
                    <div className="text-[var(--ink-4)] text-xs mb-1">{productionControlLabels.realizado}</div>
                    <div className="text-[var(--ink)] font-mono text-sm">
                      {formatCurrency((parseFloat(productionOrder.actual_material_cost) + parseFloat(productionOrder.actual_labor_cost || 0)))}
                    </div>
                    <div className="text-[var(--ink-4)] text-xs mt-1">
                      {productionControlLabels.materiais}{formatCurrency(parseFloat(productionOrder.actual_material_cost))}{productionControlLabels.maoDeObra}{formatCurrency(parseFloat(productionOrder.actual_labor_cost || 0))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Operations */}
          <div>
            <h3 className="text-[var(--ink-3)] text-sm font-medium mb-3">{productionCopy.operations}</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--orange)]"></div>
              </div>
            ) : operations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--ink-4)] mb-3">{productionControlLabels.nenhumaOperacaoDefinidaParaEstaOrdem}</p>
                {canRefreshRouting && (
                  <button
                    onClick={handleRefreshRouting}
                    disabled={refreshRoutingLoading}
                    className="px-4 py-2 bg-[var(--orange)] hover:bg-[var(--orange-press)] disabled:opacity-50 text-white rounded-lg transition-colors text-sm"
                  >
                    {refreshRoutingLoading ? 'Atualizando…' : 'Aplicar roteiro agora'}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {operations.map((op, idx) => (
                  <OperationCard
                    key={op.id}
                    operation={op}
                    maxQty={getMaxQtyForOperation(idx)}
                    expanded={expandedOpId === op.id}
                    onToggleExpand={() =>
                      setExpandedOpId(expandedOpId === op.id ? null : op.id)
                    }
                    onSchedule={handleSchedule}
                    onStart={handleStart}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                    loading={actionLoading}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Materials */}
          {allMaterials.length > 0 && (
            <div>
              <h3 className="text-[var(--ink-3)] text-sm font-medium mb-3">{productionCopy.materials}</h3>
              <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-4 space-y-2">
                {allMaterials.slice(0, 5).map((mat, idx) => {
                  const matSpool = assignedSpools.find(
                    (s) => s.product_id === mat.component_id
                  );
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--ink-2)]">
                          {mat.component_name || mat.component_sku || 'Desconhecido'}
                          <span className="text-[var(--ink-4)] ml-2">
                            × {mat.quantity_required} {mat.unit || ''}
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              mat.status === 'consumed'
                                ? 'text-[var(--status-green)]'
                                : mat.status === 'allocated'
                                ? 'text-[var(--status-green)]'
                                : 'text-[var(--status-red)]'
                            }
                          >
                            {productionStatusLabel(mat.status)}
                          </span>
                          {mat.component_id && mat.component_is_template && mat.status === "pending" && (
                            <button
                              onClick={() => openVariantPicker(mat.id, mat.component_id)}
                              className="text-xs px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--rule-hair)] hover:bg-[var(--rule-hair)] text-[var(--ink-2)] transition-colors"
                              title={`${mat.component_sku || 'Componente'} é um modelo. Selecione uma variante para consumo.`}
                              aria-label={`Selecionar variante para ${mat.component_sku || 'componente'}`}
                            >
                              {productionControlLabels.selecionarVariante}
                            </button>
                          )}
                          {mat.component_id && (
                            <button
                              onClick={() => openSpoolPicker(mat.component_id)}
                              className="text-xs px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--rule-hair)] hover:bg-[var(--rule-hair)] text-[var(--ink-2)] transition-colors"
                              title={productionControlLabels.atribuirCarretelParaRastreabilidadeOpcional}
                            >
                              {matSpool ? '🔗 ' + matSpool.spool_code : 'Atribuir carretel'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {allMaterials.length > 5 && (
                  <div className="text-[var(--ink-4)] text-xs">
                    +{allMaterials.length - 5}{productionControlLabels.materiaisAMais}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Spool Picker Dropdown */}
          {spoolPickerFor && (
            <div className="bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg p-4 shadow-[var(--shadow-pop)]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-[var(--ink)]">{productionControlLabels.selecionarCarretel}</h4>
                <button
                  onClick={() => setSpoolPickerFor(null)}
                  aria-label={productionCopy.close}
                  className="text-[var(--ink-3)] hover:text-[var(--ink)] text-sm"
                >
                  ✕
                </button>
              </div>
              {spoolLoading ? (
                <div className="text-[var(--ink-3)] text-sm">{productionControlLabels.carregandoCarreteis}</div>
              ) : availableSpools.length === 0 ? (
                <div className="text-[var(--ink-4)] text-sm">{productionControlLabels.nenhumCarretelAtivoParaEsteMaterial}</div>
              ) : (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {availableSpools.map((spool) => (
                    <button
                      key={spool.id}
                      onClick={() => assignSpool(spool.id)}
                      disabled={spoolLoading}
                      className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[var(--paper-sunk)] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-[var(--ink)]">{spool.spool_number}</span>
                      <span className="text-[var(--ink-3)]">
                        {(spool.current_weight_kg ?? 0).toFixed(2)}{productionControlLabels.kg}
                        {spool.supplier_lot_number && (
                          <span className="ml-2 text-[var(--ink-4)]">{productionControlLabels.lote}{spool.supplier_lot_number}</span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Variant Picker (Workstream B0) */}
          {variantPickerFor && (
            <div className="bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg p-4 shadow-[var(--shadow-pop)]">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-[var(--ink)]">
                  {productionControlLabels.selecioneAVarianteAConsumir}
                  <span className="ml-2 text-xs text-[var(--ink-3)] font-normal">
                    {productionControlLabels.substituiOModeloDaFichaTecnicaApenasNestaOrdem}
                  </span>
                </h4>
                <button
                  onClick={() => {
                    // Abort the in-flight variant fetch so the response
                    // can't write into a closed picker's state.
                    if (variantFetchControllerRef.current) {
                      variantFetchControllerRef.current.abort();
                      variantFetchControllerRef.current = null;
                    }
                    setVariantPickerFor(null);
                    setVariantSwapReason("");
                  }}
                  className="text-[var(--ink-3)] hover:text-[var(--ink)] text-sm"
                  aria-label={productionControlLabels.cancelarTrocaDeVariante}
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                value={variantSwapReason}
                onChange={(e) => setVariantSwapReason(e.target.value)}
                maxLength={500}
                placeholder={productionControlLabels.motivoOpcionalRegistradoParaAuditoria}
                className="w-full mb-3 px-3 py-1.5 text-sm rounded bg-[var(--paper-sunk)] border border-[var(--rule-hair)] text-[var(--ink)] placeholder-[var(--ink-4)] focus:outline-none focus:border-[var(--orange)]"
              />
              {variantLoading ? (
                <div className="text-[var(--ink-3)] text-sm">{productionControlLabels.carregandoVariantes}</div>
              ) : availableVariants.length === 0 ? (
                <div className="text-[var(--ink-4)] text-sm">
                  {productionControlLabels.esteModeloAindaNaoTemVariantesCadastreAsNa}
                </div>
              ) : (
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {availableVariants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => swapVariant(v.id)}
                      disabled={variantLoading || !v.active}
                      className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[var(--paper-sunk)] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-[var(--ink)] text-left">
                        {v.sku}
                        <span className="text-[var(--ink-4)] ml-2">{v.name}</span>
                      </span>
                      <span className={(v.on_hand_qty ?? 0) > 0 ? "text-[var(--status-green)]" : "text-[var(--status-red)]"}>
                        {(v.on_hand_qty ?? 0).toFixed(0)}{productionControlLabels.emEstoque}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assigned Spools Summary */}
          {assignedSpools.length > 0 && (
            <div>
              <h3 className="text-[var(--ink-3)] text-sm font-medium mb-3">{productionControlLabels.carreteisAtribuidos}</h3>
              <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-4 space-y-1">
                {assignedSpools.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--ink-2)]">
                      {s.spool_code}
                      <span className="text-[var(--ink-4)] ml-2">— {s.product_name}</span>
                    </span>
                    <span className="text-[var(--ink-3)] text-xs">
                      {s.quantity_remaining != null ? `${s.quantity_remaining} kg restantes` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h3 className="text-[var(--ink-3)] text-sm font-medium mb-3">{productionControlLabels.observacoes}</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              rows={3}
              placeholder={productionControlLabels.adicioneObservacoesDeProducao}
              className="w-full bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-3 text-[var(--ink)] placeholder-[var(--ink-4)] resize-none focus:border-[var(--orange)] focus:outline-none"
            />
            {notesSaving && (
              <div className="text-[var(--ink-4)] text-xs mt-1">{productionControlLabels.salvando}</div>
            )}
          </div>
        </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-6 border-t border-[var(--rule-hair)]">
        <div className="flex gap-2">
          <button
            onClick={handleClaim}
            className="px-4 py-2 bg-[var(--paper-sunk)] border border-[var(--rule-hair)] hover:text-[var(--ink)] text-[var(--ink-2)] rounded-lg transition-colors"
          >
            {productionControlLabels.assumirOrdem}
          </button>
          {canRefreshRouting && (
            <button
              onClick={handleRefreshRouting}
              disabled={refreshRoutingLoading}
              className="px-4 py-2 bg-[var(--paper-sunk)] border border-[var(--rule-hair)] text-[var(--ink-2)] hover:text-[var(--ink)] disabled:opacity-50 rounded-lg transition-colors text-sm"
              title={productionControlLabels.reaplicarORoteiroAtivoDoProdutoAEstaOrdem}
            >
              {refreshRoutingLoading ? "Atualizando…" : "Atualizar roteiro"}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[var(--paper-sunk)] border border-[var(--rule-hair)] hover:text-[var(--ink)] text-[var(--ink-2)] rounded-lg transition-colors"
        >
          {productionCopy.close}
        </button>
      </div>

      {/* Skip Modal */}
      <SkipOperationModal
        isOpen={skipModalOpen}
        onClose={() => {
          setSkipModalOpen(false);
          setOperationToSkip(null);
        }}
        operation={operationToSkip}
        productionOrderId={productionOrder.id}
        onSkipped={onSkipped}
      />

      {/* Schedule Modal */}
      {scheduleModalOpen && operationToSchedule && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setScheduleModalOpen(false)}
          />
          <div className="relative bg-[var(--paper)] border border-[var(--rule-hair)] shadow-[var(--shadow-pop)] rounded-xl w-full max-w-md mx-4 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[var(--ink)]">
              {productionControlLabels.agendarOperacao}
            </h3>
            <p className="text-[var(--ink-3)] text-sm">
              {operationToSchedule.operation_code ||
                `Op ${operationToSchedule.sequence}`}
            </p>

            {/* Work Center */}
            <div>
              <label className="block text-sm text-[var(--ink-3)] mb-1">
                {productionCopy.workCenter}
              </label>
              {operationToSchedule.work_center_id ? (
                // Operation has a defined work center - lock it
                <div className="w-full bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg px-4 py-2 text-[var(--ink)]">
                  {workCenters.find(
                    (wc) => wc.id === operationToSchedule.work_center_id,
                  )?.name ||
                    operationToSchedule.work_center_name ||
                    `${productionCopy.workCenter} ${operationToSchedule.work_center_id}`}
                </div>
              ) : (
                // No work center defined - allow selection
                <select
                  value={selectedWorkCenter || ""}
                  onChange={(e) =>
                    setSelectedWorkCenter(
                      e.target.value ? parseInt(e.target.value) : null,
                    )
                  }
                  className="w-full bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-2 text-[var(--ink)]"
                >
                  <option value="">{productionControlLabels.selecioneUmCentroDeTrabalho}</option>
                  {workCenters.map((wc) => (
                    <option key={wc.id} value={wc.id}>
                      {wc.code} - {wc.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Resource */}
            {selectedWorkCenter && (
              <div>
                <label className="block text-sm text-[var(--ink-3)] mb-1">
                  {productionControlLabels.maquinaOuImpressora}
                </label>
                <select
                  value={selectedResource?.id || ""}
                  onChange={(e) => {
                    const res = resources.find(
                      (r) => r.id === parseInt(e.target.value),
                    );
                    setSelectedResource(res || null);
                  }}
                  className="w-full bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-2 text-[var(--ink)]"
                >
                  <option value="">{productionControlLabels.selecioneUmaMaquina}</option>
                  {resources.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.code} - {res.name}
                      {res.is_printer ? " [Impressora]" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Start Time */}
            <div>
              <label className="block text-sm text-[var(--ink-3)] mb-1">
                {productionControlLabels.horarioDeInicio}
              </label>
              <input
                type="datetime-local"
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
                className="w-full bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-2 text-[var(--ink)]"
              />
            </div>

            {/* Suggested Slot (shown after conflict) */}
            {suggestedSlot && (
              <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-3">
                <p className="text-[var(--ink-2)] text-sm mb-2">
                  {productionControlLabels.proximoHorarioDisponivel}{" "}
                  {parseDateTime(suggestedSlot.start).toLocaleString("pt-BR")}
                </p>
                <button
                  onClick={applySuggestedSlot}
                  className="px-3 py-1 bg-[var(--paper)] border border-[var(--rule-hair)] text-[var(--ink-2)] text-sm rounded hover:text-[var(--ink)] transition-colors"
                >
                  {productionControlLabels.usarEsteHorario}
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="px-4 py-2 text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors"
              >
                {productionCopy.cancel}
              </button>
              <button
                onClick={submitSchedule}
                disabled={actionLoading || !selectedResource}
                className="px-6 py-2 bg-[var(--orange)] text-white rounded-lg hover:bg-[var(--orange-press)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading ? productionCopy.scheduling : productionCopy.schedule}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shortage Modal */}
      <ShortageModal
        isOpen={shortageModalOpen}
        onClose={() => {
          setShortageModalOpen(false);
          setShortageInfo(null);
        }}
        poCode={shortageInfo?.poCode}
        quantityOrdered={shortageInfo?.quantityOrdered}
        quantityCompleted={shortageInfo?.quantityCompleted}
        quantityShort={shortageInfo?.quantityShort}
        salesOrderId={shortageInfo?.salesOrderId}
        salesOrderCode={shortageInfo?.salesOrderCode}
        productId={shortageInfo?.productId}
        onReplacementCreated={() => {
          // Refresh the list and notify user
          onUpdated?.();
        }}
      />
    </Modal>
  );
}
