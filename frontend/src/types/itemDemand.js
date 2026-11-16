/**
 * Types and utilities for item demand summary.
 * Matches backend Pydantic schemas from API-101.
 */

/**
 * @typedef {Object} LinkedSalesOrder
 * @property {number} id
 * @property {string} code
 * @property {string|null} customer
 */

/**
 * @typedef {Object} AllocationDetail
 * @property {'production_order'} type
 * @property {string} reference_code
 * @property {number} reference_id
 * @property {number} quantity
 * @property {string|null} needed_date
 * @property {string} status
 * @property {LinkedSalesOrder|null} linked_sales_order
 */

/**
 * @typedef {Object} IncomingDetail
 * @property {'purchase_order'} type
 * @property {string} reference_code
 * @property {number} reference_id
 * @property {number} quantity
 * @property {string|null} expected_date
 * @property {string} status
 * @property {string|null} vendor
 */

/**
 * @typedef {Object} ShortageInfo
 * @property {boolean} is_short
 * @property {number} quantity
 * @property {string[]} blocking_orders
 */

/**
 * @typedef {Object} QuantitySummary
 * @property {number} on_hand
 * @property {number} allocated
 * @property {number} available
 * @property {number} incoming
 * @property {number} projected
 */

/**
 * @typedef {Object} ItemDemandSummary
 * @property {number} item_id
 * @property {string} sku
 * @property {string} name
 * @property {QuantitySummary} quantities
 * @property {AllocationDetail[]} allocations
 * @property {IncomingDetail[]} incoming
 * @property {ShortageInfo} shortage
 */

/**
 * Stock status types for visual indicators.
 * @typedef {'healthy' | 'tight' | 'short' | 'critical'} StockStatus
 */

/**
 * Determine stock status from quantities.
 * @param {QuantitySummary} quantities
 * @returns {StockStatus}
 */
export function getStockStatus(quantities) {
  const { available, on_hand } = quantities;

  // Parse as numbers in case they're strings from JSON
  const availNum = parseFloat(available);
  const onHandNum = parseFloat(on_hand);

  if (availNum < 0) {
    return 'critical';  // Negative available = shortage
  }
  if (availNum === 0) {
    return 'short';     // Zero available
  }
  if (onHandNum > 0 && availNum < onHandNum * 0.2) {
    return 'tight';     // Less than 20% available
  }
  return 'healthy';
}

/**
 * Get Tailwind color classes for stock status.
 * @param {StockStatus} status
 * @returns {{bg: string, text: string, border: string, dot: string}}
 */
export function getStatusColors(status) {
  switch (status) {
    case 'critical':
      return {
        bg: 'bg-red-900/30',
        text: 'text-red-400',
        border: 'border-red-700',
        dot: 'bg-red-500'
      };
    case 'short':
      return {
        bg: 'bg-orange-900/30',
        text: 'text-orange-400',
        border: 'border-orange-700',
        dot: 'bg-orange-500'
      };
    case 'tight':
      return {
        bg: 'bg-yellow-900/30',
        text: 'text-yellow-400',
        border: 'border-yellow-700',
        dot: 'bg-yellow-500'
      };
    case 'healthy':
    default:
      return {
        bg: 'bg-green-900/30',
        text: 'text-green-400',
        border: 'border-green-700',
        dot: 'bg-green-500'
      };
  }
}
