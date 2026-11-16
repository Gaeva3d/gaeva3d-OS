/**
 * ItemCard - Displays item with demand context.
 *
 * Redesigned for better visual hierarchy:
 * - Status is the dominant visual (color-coded border/background)
 * - Primary info: SKU + Available quantity
 * - Secondary info: On Hand / Allocated (smaller)
 * - Contextual: Incoming, Shortage warnings
 */
import { Link } from 'react-router-dom';
import { useItemDemand } from '../../hooks/useItemDemand';
import { getStockStatus, getStatusColors } from '../../types/itemDemand';

/**
 * Status indicator with label
 */
function StatusBadge({ status }) {
  const labels = {
    critical: 'Shortage',
    short: 'Out of Stock',
    tight: 'Low Stock',
    healthy: 'In Stock',
  };
  const colors = getStatusColors(status);

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
      ${status === 'critical' ? 'bg-red-500/20 text-red-400' : ''}
      ${status === 'short' ? 'bg-orange-500/20 text-orange-400' : ''}
      ${status === 'tight' ? 'bg-yellow-500/20 text-yellow-400' : ''}
      ${status === 'healthy' ? 'bg-green-500/20 text-green-400' : ''}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {labels[status] || status}
    </span>
  );
}

/**
 * Big number display for primary metric
 */
function PrimaryMetric({ label, value, status }) {
  const colors = getStatusColors(status);
  const isNegative = value < 0;

  return (
    <div className="text-center">
      <p className={`
        text-3xl font-bold tabular-nums
        ${isNegative ? 'text-red-400' : status === 'critical' ? colors.text : 'text-white'}
      `}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}

/**
 * Small secondary metric
 */
function SecondaryMetric({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium text-gray-300 tabular-nums">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-[10px] text-gray-500 uppercase">{label}</p>
    </div>
  );
}

/**
 * Shortage warning section
 */
function ShortageWarning({ shortage }) {
  return (
    <div className="mt-3 p-2 bg-red-900/40 border border-red-700 rounded text-sm">
      <p className="font-medium text-red-400">
        Shortage: {shortage.quantity.toLocaleString()} units
      </p>
      {shortage.blocking_orders.length > 0 && (
        <p className="text-red-300 mt-1 text-xs">
          Blocking: {shortage.blocking_orders.slice(0, 3).join(', ')}
          {shortage.blocking_orders.length > 3 && ` +${shortage.blocking_orders.length - 3} more`}
        </p>
      )}
    </div>
  );
}

/**
 * List of allocations
 */
function AllocationList({ allocations }) {
  return (
    <div className="mt-3 border-t border-gray-700 pt-3">
      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
        Allocated To
      </h4>
      <ul className="space-y-1">
        {allocations.slice(0, 5).map((alloc) => (
          <li key={alloc.reference_id} className="text-sm flex justify-between">
            <span>
              <Link
                to={`/admin/production/${alloc.reference_id}`}
                className="text-cyan-400 hover:underline"
              >
                {alloc.reference_code}
              </Link>
              {alloc.linked_sales_order && (
                <span className="text-gray-500 ml-2">
                  {alloc.linked_sales_order.customer}
                </span>
              )}
            </span>
            <span className="text-gray-400">{alloc.quantity}</span>
          </li>
        ))}
        {allocations.length > 5 && (
          <li className="text-xs text-gray-500">
            +{allocations.length - 5} more allocations
          </li>
        )}
      </ul>
    </div>
  );
}

/**
 * Compact mode view - single line
 */
function ItemCardCompact({ data, status, colors, onClick, className }) {
  return (
    <div
      data-testid="item-card"
      className={`
        flex items-center justify-between p-2 border rounded
        ${colors.border} ${colors.bg} ${className || ''}
        ${onClick ? 'cursor-pointer hover:shadow-sm' : ''}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
        <span className="font-medium text-sm text-white truncate">{data.sku}</span>
      </div>
      <div className="flex items-center gap-3 text-sm flex-shrink-0 ml-2">
        <span className="text-gray-400">{data.quantities.on_hand}</span>
        <span className={`font-semibold ${status === 'critical' ? colors.text : 'text-white'}`}>
          {data.quantities.available} avail
        </span>
      </div>
    </div>
  );
}

/**
 * Loading skeleton
 */
function ItemCardSkeleton({ compact }) {
  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 border border-gray-700 rounded bg-gray-800 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-600" />
          <div className="h-4 w-24 bg-gray-600 rounded" />
        </div>
        <div className="h-4 w-20 bg-gray-600 rounded" />
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-28 bg-gray-600 rounded" />
        <div className="h-5 w-16 bg-gray-600 rounded-full" />
      </div>
      <div className="h-4 w-36 bg-gray-600 rounded mb-4" />
      <div className="flex justify-center mb-3">
        <div className="h-10 w-20 bg-gray-600 rounded" />
      </div>
      <div className="flex justify-around">
        <div className="h-6 w-12 bg-gray-600 rounded" />
        <div className="h-6 w-12 bg-gray-600 rounded" />
      </div>
    </div>
  );
}

/**
 * ItemCard component - displays item with demand context
 *
 * @param {Object} props
 * @param {number} props.itemId - Item ID to fetch demand for
 * @param {import('../../types/itemDemand').ItemDemandSummary} [props.demandData] - Pre-fetched data (skip API call)
 * @param {boolean} [props.showDetails] - Show detailed view with allocations
 * @param {boolean} [props.compact] - Compact mode for lists
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 */
export function ItemCard({
  itemId,
  demandData,
  showDetails = false,
  compact = false,
  onClick,
  className = ''
}) {
  // Use provided data or fetch
  const { data: fetchedData, loading, error } = useItemDemand(
    demandData ? null : itemId
  );

  const data = demandData || fetchedData;

  // Clickable wrapper props
  const wrapperProps = onClick ? {
    onClick,
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => e.key === 'Enter' && onClick(),
  } : {};

  if (loading) {
    return (
      <div {...wrapperProps} className={onClick ? 'cursor-pointer' : ''}>
        <ItemCardSkeleton compact={compact} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div {...wrapperProps} className={onClick ? 'cursor-pointer' : ''}>
        <div className={`p-4 border border-red-700 bg-red-900/30 rounded-lg ${className}`}>
          <p className="text-red-400 text-sm">
            {error || 'Failed to load item'}
          </p>
        </div>
      </div>
    );
  }

  const status = getStockStatus(data.quantities);
  const colors = getStatusColors(status);

  if (compact) {
    return (
      <ItemCardCompact
        data={data}
        status={status}
        colors={colors}
        onClick={onClick}
        className={className}
      />
    );
  }

  return (
    <div
      data-testid="item-card"
      className={`
        p-4 border-2 rounded-lg transition-all hover:shadow-lg
        ${colors.border} ${colors.bg} ${className}
        ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {/* Header - SKU + Status Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-white text-lg truncate">{data.sku}</h3>
          <p className="text-sm text-gray-400 truncate">{data.name}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Primary Metric - Available (what matters most) */}
      <div className="py-3 border-y border-gray-700/50 my-3">
        <PrimaryMetric
          label="Available"
          value={data.quantities.available}
          status={status}
        />
      </div>

      {/* Secondary Metrics - On Hand / Allocated */}
      <div className="flex justify-around">
        <SecondaryMetric label="On Hand" value={data.quantities.on_hand} />
        <div className="w-px bg-gray-700" />
        <SecondaryMetric label="Allocated" value={data.quantities.allocated} />
      </div>

      {/* Info Badges - Stocking Policy & On Order */}
      {(() => {
        const reorderPoint = parseFloat(data.reorder_point) || 0;
        const incoming = data.quantities.incoming || 0;
        const isStocked = data.stocking_policy === 'stocked' || reorderPoint > 0;

        if (!isStocked && incoming <= 0) return null;

        return (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {/* Stocking Policy Badge - show if stocked or has reorder point */}
            {isStocked && (
              <span className="inline-flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/30">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Stocked
                {reorderPoint > 0 && (
                  <span className="text-purple-300 ml-1">ROP: {reorderPoint.toLocaleString()}</span>
                )}
              </span>
            )}

            {/* On Order / Incoming Badge */}
            {incoming > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/30">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                +{incoming.toLocaleString()} on order
              </span>
            )}
          </div>
        );
      })()}

      {/* Shortage Warning */}
      {data.shortage.is_short && (
        <ShortageWarning shortage={data.shortage} />
      )}

      {/* Allocation Details (optional) */}
      {showDetails && data.allocations.length > 0 && (
        <AllocationList allocations={data.allocations} />
      )}
    </div>
  );
}

export default ItemCard;
