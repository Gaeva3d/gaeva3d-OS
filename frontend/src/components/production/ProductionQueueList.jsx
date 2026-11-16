import { productionControlLabels } from "./productionControlLabels";
import { formatProductionDate, formatProductionQuantity, productionCopy, productionOrderStatusLabel, productionStatusLabel } from "./productionControlsCopy";
/**
 * ProductionQueueList - List view of production orders with inline operations
 *
 * Shows all POs with their operations, status, time estimates, and material status.
 * Click a row to open the detail/action modal.
 */
import { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';
import { formatDuration } from '../../utils/formatting';
import { PRODUCTION_ORDER_BADGE_CONFIGS } from '../../lib/statusColors.js';
import { normalizeList } from '../../lib/normalizeList';
import ElapsedTimer from './ElapsedTimer';
import EmptyState from '../EmptyState';
import useQueueOperations from './useQueueOperations';

/**
 * Status badge component
 */
function StatusBadge({ status }) {
  const config = PRODUCTION_ORDER_BADGE_CONFIGS[status] || PRODUCTION_ORDER_BADGE_CONFIGS.draft;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {productionOrderStatusLabel(status)}
    </span>
  );
}

/**
 * Operations chain - shows all ops as connected status indicators
 */
function OperationsChain({ operations }) {
  if (!operations || operations.length === 0) {
    return <span className="text-[var(--ink-4)] text-sm">{productionControlLabels.nenhumaOperacao}</span>;
  }

  const statusIcons = {
    pending: { icon: '○', color: 'text-[var(--ink-3)]', title: productionStatusLabel('pending') },
    queued: { icon: '◐', color: 'text-[var(--ink-2)]', title: productionStatusLabel('queued') },
    running: { icon: '●', color: 'text-[var(--status-amber)] animate-pulse', title: productionStatusLabel('running') },
    complete: { icon: '✓', color: 'text-[var(--status-green)]', title: productionStatusLabel('complete') },
    skipped: { icon: '⊘', color: 'text-[var(--status-amber)]', title: productionStatusLabel('skipped') },
  };

  return (
    <div className="flex items-center gap-1">
      {operations.map((op, idx) => {
        const config = statusIcons[op.status] || statusIcons.pending;
        const tooltip = `${op.operation_code || `Op ${op.sequence}`}: ${config.title}${op.resource_name ? ` em ${op.resource_name}` : ''}`;

        return (
          <div key={op.id} className="flex items-center">
            <span
              className={`${config.color} cursor-default`}
              title={tooltip}
              role="img"
              aria-label={`${op.operation_code || `Op ${op.sequence}`}: ${config.title}`}
            >
              {config.icon}
            </span>
            {idx < operations.length - 1 && (
              <span className="text-[var(--ink-4)] mx-0.5">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Materials status indicator
 */
function MaterialsStatus({ materials }) {
  if (!materials || materials.length === 0) {
    return <span className="text-[var(--ink-4)] text-sm">—</span>;
  }

  const ready = materials.filter(m => m.status === 'allocated' || m.status === 'consumed').length;
  const total = materials.length;
  const hasBlocking = materials.some(m => m.status === 'unavailable' || m.status === 'pending');

  return (
    <span className={`text-sm ${hasBlocking ? 'text-[var(--status-red)]' : ready === total ? 'text-[var(--status-green)]' : 'text-[var(--status-amber)]'}`}>
      {ready}/{total}{productionControlLabels.prontos}
      {hasBlocking && <span className="ml-1 text-[var(--status-red)]">!</span>}
    </span>
  );
}

/**
 * Calculate total estimated time from operations
 */
function calculateTotalTime(operations) {
  if (!operations || operations.length === 0) return 0;
  return operations.reduce((sum, op) => {
    return sum + (parseFloat(op.planned_setup_minutes) || 0) + (parseFloat(op.planned_run_minutes) || 0);
  }, 0);
}

/**
 * Single row in the production queue
 *
 * SCHED-3: When order.status === 'released', shows a light "Dispatch" affordance
 * button at the end of the row.  Clicking it calls onDispatch(order, firstPendingOp)
 * so the parent can open the OperationSchedulerModal prefilled.
 *
 * #781: orders that have produced something to scrap (in progress, completed, or
 * held for QC) show a "Scrap" affordance that calls onScrap(order) so the parent
 * can open the ScrapOrderModal — previously the modal was mounted but unreachable.
 */
function ProductionQueueRow({ order, operations, operationsError, onRowClick, onDispatch, onScrap, onSplit, onComplete, onQC }) {
  const totalMinutes = calculateTotalTime(operations);

  // Gather all materials from all operations
  const allMaterials = operations?.flatMap(op => op.materials || []) || [];

  // Check for running operation
  const runningOp = operations?.find(op => op.status === 'running');

  // SCHED-3: first pending op for dispatch affordance
  const firstPendingOp = operations?.find(op => op.status === 'pending') ?? null;

  // #781: scrap is meaningful once production has yielded units — WIP in
  // progress, finished goods received at completion, or goods held after a QC
  // failure.  draft/released have nothing made yet; scrapped/cancelled are done.
  const canScrap = ['in_progress', 'complete', 'qc_hold', 'short'].includes(order.status);

  // #858: Split/Complete/QC modals were mounted on the page but nothing ever
  // opened them. Split follows the service guard (draft/scheduled/released,
  // >1 unit); Complete is the bulk order-level action for WIP; QC uses the
  // backend-computed guard (is_ready_for_qc) plus held orders awaiting
  // re-inspection.
  const canSplit = ['draft', 'scheduled', 'released'].includes(order.status)
    && (order.quantity_ordered || 0) > 1;
  const canComplete = order.status === 'in_progress';
  const canQC = order.status === 'qc_hold' || order.is_ready_for_qc === true;

  return (
    <tr
      className={`border-b border-[var(--rule-hair)] cursor-pointer transition-colors ${
        runningOp
          ? 'bg-[var(--status-amber-tint)] hover:bg-[var(--status-amber)]/25 border-l-2 border-l-[var(--status-amber)]'
          : 'hover:bg-[var(--paper-sunk)]'
      }`}
      onClick={() => onRowClick(order)}
    >
      {/* Order Code */}
      <td className="px-4 py-3">
        <button type="button" aria-label={`Abrir ordem ${order.code}`} className="font-mono text-[var(--ink)] underline min-h-11 focus-visible:outline-2" onClick={(event) => { event.stopPropagation(); onRowClick(order); }}>{order.code}</button>
        {order.sales_order_code && (
          <div className="text-xs text-[var(--ink-3)]">{productionControlLabels.pedido}{order.sales_order_code}</div>
        )}
      </td>

      {/* Product */}
      <td className="px-4 py-3">
        <div className="text-[var(--ink)]">{order.product_name || order.product?.name || 'Produto desconhecido'}</div>
        <div className="text-xs text-[var(--ink-4)]">{productionControlLabels.qtd}{formatProductionQuantity(order.quantity_ordered)}</div>
      </td>

      {/* Operations */}
      <td className="px-4 py-3">
        {operationsError ? <span className="text-sm text-[var(--status-red)]">{operationsError}</span> : operations ? <OperationsChain operations={operations} /> : <span>Carregando operações…</span>}
      </td>

      {/* Estimated Time / Running Timer */}
      <td className="px-4 py-3">
        {operationsError ? <span>Não informado</span> : runningOp ? (
          <div className="flex flex-col">
            <ElapsedTimer
              startTime={runningOp.actual_start}
              className="text-[var(--status-amber)] text-sm"
            />
            <span className="text-[var(--ink-4)] text-xs">{productionControlLabels.emExecucao3}</span>
          </div>
        ) : (
          <span className="text-[var(--ink-2)] font-mono text-sm">
            {totalMinutes > 0 ? formatDuration(totalMinutes) : '—'}
          </span>
        )}
      </td>

      {/* Materials */}
      <td className="px-4 py-3">
        {operationsError ? <span>Não informado</span> : <MaterialsStatus materials={allMaterials} />}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={order.status} />
      </td>

      {/* Due Date */}
      <td className="px-4 py-3 text-right">
        {order.due_date ? (
          <span className="text-[var(--ink-3)] text-sm">
            {formatProductionDate(order.due_date)}
          </span>
        ) : (
          <span className="text-[var(--ink-4)] text-sm">—</span>
        )}
      </td>

      {/* Row actions: Dispatch (SCHED-3), Split/Complete/QC (#858), Scrap (#781).
          Status-gating keeps this to at most two buttons per row. */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          {order.status === 'released' && firstPendingOp && onDispatch && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDispatch(order, firstPendingOp);
              }}
              className="text-xs text-[var(--ink-2)] hover:text-[var(--ink)] border border-[var(--rule-hair)] hover:border-[var(--ink-4)] rounded px-2 py-1 transition-colors"
              title={productionControlLabels.agendarAProximaOperacaoPendenteDestaOrdem}
            >
              {productionControlLabels.agendar}
            </button>
          )}
          {canSplit && onSplit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSplit(order);
              }}
              className="text-xs text-[var(--ink-2)] hover:text-[var(--ink)] border border-[var(--rule-hair)] hover:border-[var(--ink-4)] rounded px-2 py-1 transition-colors"
              title={productionControlLabels.dividirEstaOrdemEmVariasOrdens}
            >
              {productionControlLabels.dividir}
            </button>
          )}
          {canComplete && onComplete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(order);
              }}
              className="text-xs text-[var(--ink-2)] hover:text-[var(--ink)] border border-[var(--rule-hair)] hover:border-[var(--ink-4)] rounded px-2 py-1 transition-colors"
              title={productionControlLabels.concluirEstaOrdem}
            >
              {productionCopy.complete}
            </button>
          )}
          {canQC && onQC && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQC(order);
              }}
              className="text-xs text-[var(--ink-2)] hover:text-[var(--ink)] border border-[var(--rule-hair)] hover:border-[var(--ink-4)] rounded px-2 py-1 transition-colors"
              title={productionControlLabels.registrarUmaInspecaoDeQualidadeNestaOrdem}
            >
              {productionControlLabels.inspecionar}
            </button>
          )}
          {canScrap && onScrap && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onScrap(order);
              }}
              className="text-xs text-[var(--status-red)] hover:bg-[var(--status-red-tint)] border border-[var(--status-red)]/30 hover:border-[var(--status-red)]/50 rounded px-2 py-1 transition-colors"
              title={productionControlLabels.registrarRefugoNestaOrdem}
            >
              {productionControlLabels.registrarRefugo}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/**
 * Main ProductionQueueList component
 */
export default function ProductionQueueList({
  orders,
  onOrderClick,
  loading,
  filters,
  onFiltersChange,
  onCreateOrder,
  onDispatch,
  onScrap,
  onSplit,
  onComplete,
  onQC,
}) {
  const { operations: operationsMap, failures: operationsFailures, loading: loadingOps, retry: retryOperations } = useQueueOperations(orders);
  const [workCenters, setWorkCenters] = useState([]);

  // Fetch work centers on mount
  useEffect(() => {
    const fetchWorkCenters = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/work-centers`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setWorkCenters(normalizeList(data, ["work_centers", "workCenters"]).items);
        }
      } catch { // err unused
        // Non-critical
      }
    };
    fetchWorkCenters();
  }, []);

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    // Status filter
    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'active') {
        // Active = not complete and not short
        if (order.status === 'complete' || order.status === 'short') return false;
      } else {
        if (order.status !== filters.status) return false;
      }
    }

    // Search filter
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      const matchesCode = order.code?.toLowerCase().includes(search);
      const matchesProduct = order.product_name?.toLowerCase().includes(search) ||
                            order.product?.name?.toLowerCase().includes(search);
      const matchesSO = order.sales_order_code?.toLowerCase().includes(search);
      if (!matchesCode && !matchesProduct && !matchesSO) return false;
    }

    // Work center filter - show orders with any operation in selected work center
    if (filters?.workCenter && filters.workCenter !== 'all') {
      const ops = operationsMap[order.id] || [];
      const hasMatchingOp = ops.some(
        op => op.work_center_id === parseInt(filters.workCenter) ||
              op.work_center_code === filters.workCenter
      );
      if (!hasMatchingOp) return false;
    }

    return true;
  }) || [];

  // Sort orders: in_progress first, then by priority (lower = higher), then by due date
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // In progress orders first
    const aInProgress = a.status === 'in_progress' ? 0 : 1;
    const bInProgress = b.status === 'in_progress' ? 0 : 1;
    if (aInProgress !== bInProgress) return aInProgress - bInProgress;

    // Then by priority (lower number = higher priority)
    const aPriority = a.priority ?? 5;
    const bPriority = b.priority ?? 5;
    if (aPriority !== bPriority) return aPriority - bPriority;

    // Then by due date (earliest first, null goes last)
    const aDue = a.due_date ? new Date(a.due_date).getTime() : Infinity;
    const bDue = b.due_date ? new Date(b.due_date).getTime() : Infinity;
    return aDue - bDue;
  });

  if (loading) {
    return (
      <div className="bg-[var(--paper)] border border-[var(--rule-hair)] rounded-xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--orange)]"></div>
          <span className="ml-3 text-[var(--ink-3)]">{productionControlLabels.carregandoOrdensDeProducao}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--paper)] border border-[var(--rule-hair)] rounded-xl shadow-[var(--shadow-pop)] overflow-hidden relative">
      {/* Filters */}
      <div className="p-4 border-b border-[var(--rule-hair)] flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={productionControlLabels.busquePeloCodigoDaOrdemProdutoOuPedido}
            value={filters?.search || ''}
            onChange={(e) => onFiltersChange?.({ ...filters, search: e.target.value })}
            className="w-full bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-2 text-[var(--ink)] placeholder-[var(--ink-4)]"
          />
        </div>
        <select
          value={filters?.status || 'active'}
          onChange={(e) => onFiltersChange?.({ ...filters, status: e.target.value })}
          className="bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-2 text-[var(--ink)]"
        >
          <option value="active">{productionControlLabels.somenteAtivas}</option>
          <option value="all">{productionControlLabels.todosOsStatus}</option>
          <option value="draft">{productionControlLabels.rascunho}</option>
          <option value="released">{productionControlLabels.liberada}</option>
          <option value="in_progress">{productionControlLabels.emAndamento2}</option>
          <option value="complete">{productionControlLabels.concluida}</option>
          <option value="short">{productionControlLabels.producaoParcial}</option>
        </select>
        <select
          value={filters?.workCenter || 'all'}
          onChange={(e) => onFiltersChange?.({ ...filters, workCenter: e.target.value })}
          className="bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-2 text-[var(--ink)]"
        >
          <option value="all">{productionControlLabels.todosOsCentrosDeTrabalho}</option>
          {workCenters.map((wc) => (
            <option key={wc.id} value={wc.id}>
              {wc.name || wc.code}
            </option>
          ))}
        </select>
      </div>

      {Object.keys(operationsFailures).length > 0 && (
        <div role="alert" className="p-4 text-sm text-[var(--status-red)]">
          <p>Algumas operações não puderam ser consultadas. Materiais, tempos e filtros por centro de trabalho podem estar incompletos.</p>
          <button type="button" onClick={retryOperations} className="underline min-h-11">Tentar novamente</button>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--paper-sunk)] text-left">
              <th className="px-4 py-3 text-[var(--ink-3)] font-medium text-sm">{productionCopy.order}</th>
              <th className="px-4 py-3 text-[var(--ink-3)] font-medium text-sm">{productionCopy.product}</th>
              <th className="px-4 py-3 text-[var(--ink-3)] font-medium text-sm">{productionCopy.operations}</th>
              <th className="px-4 py-3 text-[var(--ink-3)] font-medium text-sm">{productionControlLabels.tempoEstimado}</th>
              <th className="px-4 py-3 text-[var(--ink-3)] font-medium text-sm">{productionCopy.materials}</th>
              <th className="px-4 py-3 text-[var(--ink-3)] font-medium text-sm">{productionControlLabels.status}</th>
              <th className="px-4 py-3 text-[var(--ink-3)] font-medium text-sm text-right">{productionControlLabels.prazo2}</th>
              <th className="px-4 py-3 text-[var(--ink-3)] font-medium text-sm text-right"></th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-4">
                  {filters?.workCenter && filters.workCenter !== 'all' && (loadingOps || Object.keys(operationsFailures).length > 0) ? (
                    <p className="p-4">Não foi possível concluir a consulta das operações para este filtro.</p>
                  ) : filters?.search || (filters?.status && filters.status !== 'all') || (filters?.workCenter && filters.workCenter !== 'all') ? (
                    <EmptyState
                      icon="filter"
                      tone="workbench"
                      title={productionControlLabels.nenhumaOrdemCorrespondeAosFiltros}
                      onClearFilters={() => onFiltersChange && onFiltersChange({ search: '', status: 'all', workCenter: 'all' })}
                    />
                  ) : (
                    <EmptyState
                      icon="production"
                      tone="workbench"
                      title={productionControlLabels.nenhumaOrdemDeProducaoCadastrada}
                      description="Crie uma ordem de produção para começar a acompanhar os trabalhos de impressão."
                      actionLabel="Criar ordem de produção"
                      onAction={onCreateOrder}
                    />
                  )}
                </td>
              </tr>
            ) : (
              sortedOrders.map((order) => (
                <ProductionQueueRow
                  key={order.id}
                  order={order}
                  operations={operationsMap[order.id]}
                  operationsError={operationsFailures[order.id]}
                  onRowClick={onOrderClick}
                  onDispatch={onDispatch}
                  onScrap={onScrap}
                  onSplit={onSplit}
                  onComplete={onComplete}
                  onQC={onQC}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Loading operations overlay - shows on top of table */}
      {loadingOps && (
        <div role="status" aria-busy="true" className="absolute inset-0 bg-[var(--paper)]/80 flex items-center justify-center z-10 rounded-xl">
          <div className="flex items-center gap-3 px-4 py-3 bg-[var(--paper)] rounded-lg border border-[var(--rule-hair)] shadow-[var(--shadow-pop)]">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[var(--orange)] border-t-transparent"></div>
            <span className="text-[var(--ink-2)] text-sm font-medium">{productionControlLabels.carregandoDetalhesDasOperacoes}</span>
          </div>
        </div>
      )}

      {/* Summary footer */}
      {sortedOrders.length > 0 && (
        <div className="px-4 py-3 border-t border-[var(--rule-hair)] text-sm text-[var(--ink-4)] flex justify-between">
          <span>{sortedOrders.length} {sortedOrders.length === 1 ? 'ordem' : 'ordens'}</span>
          <span>
            {sortedOrders.filter(o => o.status === 'in_progress').length}{productionControlLabels.emAndamento3}
          </span>
        </div>
      )}
    </div>
  );
}
