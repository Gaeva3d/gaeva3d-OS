import { useState, useRef } from "react";
import { useLocale } from "../../contexts/LocaleContext";

export default function SalesChart({ data, period, onPeriodChange, loading }) {
  const { currency_code, locale } = useLocale();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [chartWidth, setChartWidth] = useState(300);
  const chartRef = useRef(null);

  // Parse date string as local date (avoid UTC timezone shift)
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    // "2025-12-22" -> parse as local date, not UTC
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Format date as YYYY-MM-DD for comparison
  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Fill in missing dates in the range with zero values
  const fillDateRange = (rawData, startDate, endDate) => {
    if (!startDate || !endDate || !rawData) return rawData || [];

    // Create a map of existing data by date
    const dataMap = {};
    (rawData || []).forEach(d => {
      dataMap[d.date] = d;
    });

    // Parse start and end dates
    const start = parseLocalDate(startDate.split('T')[0]);
    const end = parseLocalDate(endDate.split('T')[0]);
    if (!start || !end) return rawData || [];

    // Generate all dates in range
    const filledData = [];
    const current = new Date(start);
    while (current <= end) {
      const dateKey = formatDateKey(current);
      if (dataMap[dateKey]) {
        filledData.push(dataMap[dateKey]);
      } else {
        // Add zero entry for missing date
        filledData.push({
          date: dateKey,
          total: 0,
          sales: 0,
          orders: 0,
          payments: 0,
          payment_count: 0,
        });
      }
      current.setDate(current.getDate() + 1);
    }

    return filledData;
  };

  const periods = [
    { key: "WTD", label: "Week" },
    { key: "MTD", label: "Month" },
    { key: "QTD", label: "Quarter" },
    { key: "YTD", label: "Year" },
    { key: "ALL", label: "All" },
  ];

  // Calculate chart dimensions
  const chartHeight = 120;

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Fill in all dates in the period range (show zeros for days with no activity)
  const dataPoints = fillDateRange(data?.data, data?.start_date, data?.end_date);

  // Calculate cumulative values for proper trend display
  const cumulativeData = dataPoints.reduce((acc, d) => {
    const prev = acc[acc.length - 1] || { cumulativeSales: 0, cumulativePayments: 0 };
    acc.push({
      ...d,
      cumulativeSales: prev.cumulativeSales + (d.sales || d.total || 0),
      cumulativePayments: prev.cumulativePayments + (d.payments || 0),
    });
    return acc;
  }, []);

  // Use max of both cumulative totals for consistent scale
  const maxCumulativeSales = cumulativeData.length > 0 ? cumulativeData[cumulativeData.length - 1].cumulativeSales : 1;
  const maxCumulativePayments = cumulativeData.length > 0 ? cumulativeData[cumulativeData.length - 1].cumulativePayments : 1;
  const maxValue = Math.max(maxCumulativeSales, maxCumulativePayments, 1);

  // Max daily orders for bar scaling
  const maxDailyOrders = Math.max(...dataPoints.map(d => d.orders || 0), 1);

  // Generate SVG path for sales line (cumulative)
  const generateSalesPath = () => {
    if (cumulativeData.length === 0) return "";

    const points = cumulativeData.map((d, i) => {
      const x = (i / Math.max(cumulativeData.length - 1, 1)) * 100;
      const y = 100 - (d.cumulativeSales / maxValue) * 100;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  // Generate SVG path for payments line (cumulative)
  const generatePaymentsPath = () => {
    if (cumulativeData.length === 0) return "";

    const points = cumulativeData.map((d, i) => {
      const x = (i / Math.max(cumulativeData.length - 1, 1)) * 100;
      const y = 100 - (d.cumulativePayments / maxValue) * 100;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  // Generate area fill path for sales (cumulative)
  const generateSalesAreaPath = () => {
    if (cumulativeData.length === 0) return "";

    const points = cumulativeData.map((d, i) => {
      const x = (i / Math.max(cumulativeData.length - 1, 1)) * 100;
      const y = 100 - (d.cumulativeSales / maxValue) * 100;
      return `${x},${y}`;
    });

    return `M 0,100 L ${points.join(" L ")} L 100,100 Z`;
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency_code,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (e, index) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setChartWidth(chartRef.current.offsetWidth);
    }
    setHoveredIndex(index);
  };

  // Get hovered data point info
  const getHoveredData = () => {
    if (hoveredIndex === null || !cumulativeData[hoveredIndex]) return null;
    const d = cumulativeData[hoveredIndex];
    const outstanding = d.cumulativeSales - d.cumulativePayments;
    const localDate = parseLocalDate(d.date);
    return {
      date: localDate ? localDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
      orders: d.orders || 0,
      dailySales: d.sales || d.total || 0,
      dailyPayments: d.payments || 0,
      cumulativeSales: d.cumulativeSales,
      cumulativePayments: d.cumulativePayments,
      outstanding,
    };
  };

  const totalRevenue = data?.total_revenue || 0;
  const totalPayments = data?.total_payments || 0;
  const outstanding = totalRevenue - totalPayments;

  return (
    <div>
      {/* Period selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => onPeriodChange(p.key)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                period === p.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {/* Summary stats with both sales and payments */}
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-sm font-semibold text-blue-400">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs text-gray-500">
              {data?.total_orders || 0} orders
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-400">
              {formatCurrency(totalPayments)}
            </p>
            <p className="text-xs text-gray-500">
              collected
            </p>
          </div>
          {outstanding > 0 && (
            <div>
              <p className="text-sm font-semibold text-yellow-400">
                {formatCurrency(outstanding)}
              </p>
              <p className="text-xs text-gray-500">
                outstanding
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-3 bg-gray-500/30 rounded-sm"></div>
          <span className="text-gray-500">Daily Orders</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-blue-500"></div>
          <span className="text-gray-400">Cumulative Orders</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-green-500"></div>
          <span className="text-gray-400">Cumulative Payments</span>
        </div>
      </div>

      {/* Chart */}
      {dataPoints.length > 0 ? (
        <div
          ref={chartRef}
          className="relative"
          style={{ height: chartHeight }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Grid lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#374151" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#374151" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#374151" strokeWidth="0.5" />

            {/* Daily order count bars (background) */}
            {dataPoints.map((d, i) => {
              const barWidth = 100 / Math.max(dataPoints.length, 1) * 0.6;
              const x = (i / Math.max(dataPoints.length - 1, 1)) * 100 - barWidth / 2;
              const barHeight = ((d.orders || 0) / maxDailyOrders) * 100;
              return (
                <rect
                  key={`bar-${i}`}
                  x={Math.max(0, x)}
                  y={100 - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  opacity="0.3"
                />
              );
            })}

            {/* Sales area fill */}
            <path
              d={generateSalesAreaPath()}
              fill="url(#salesGradient)"
              opacity="0.2"
            />

            {/* Sales line (blue) */}
            <path
              d={generateSalesPath()}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Payments line (green) */}
            <path
              d={generatePaymentsPath()}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Hover targets (invisible rectangles for each data point) */}
            {dataPoints.map((d, i) => {
              const sliceWidth = 100 / dataPoints.length;
              const x = i * sliceWidth;
              return (
                <rect
                  key={`hover-${i}`}
                  x={x}
                  y={0}
                  width={sliceWidth}
                  height={100}
                  fill="transparent"
                  onMouseMove={(e) => handleMouseMove(e, i)}
                  style={{ cursor: 'crosshair' }}
                />
              );
            })}

            {/* Hover indicator circles */}
            {hoveredIndex !== null && cumulativeData[hoveredIndex] && (
              <>
                <circle
                  cx={(hoveredIndex / Math.max(cumulativeData.length - 1, 1)) * 100}
                  cy={100 - (cumulativeData[hoveredIndex].cumulativeSales / maxValue) * 100}
                  r="3"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={(hoveredIndex / Math.max(cumulativeData.length - 1, 1)) * 100}
                  cy={100 - (cumulativeData[hoveredIndex].cumulativePayments / maxValue) * 100}
                  r="3"
                  fill="#22c55e"
                  stroke="white"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6b7280" />
                <stop offset="100%" stopColor="#6b7280" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 pointer-events-none">
            <span>{formatCurrency(maxValue)}</span>
            <span>{formatCurrency(maxValue / 2)}</span>
            <span>$0</span>
          </div>

          {/* Tooltip */}
          {hoveredIndex !== null && getHoveredData() && (
            <div
              className="absolute z-10 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 pointer-events-none"
              style={{
                left: Math.min(mousePos.x + 10, chartWidth - 180),
                top: Math.max(mousePos.y - 80, 0),
                minWidth: '160px',
              }}
            >
              {(() => {
                const d = getHoveredData();
                return (
                  <>
                    <div className="text-white font-medium text-sm mb-2">{d.date}</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">Orders:</span>
                        <span className="text-white font-medium">{d.orders}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-blue-400">Day Sales:</span>
                        <span className="text-white">${d.dailySales.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-green-400">Day Payments:</span>
                        <span className="text-white">${d.dailyPayments.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-700 my-1 pt-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-blue-400">Total Orders:</span>
                          <span className="text-white">${d.cumulativeSales.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-green-400">Total Paid:</span>
                          <span className="text-white">${d.cumulativePayments.toFixed(2)}</span>
                        </div>
                        {d.outstanding > 0 && (
                          <div className="flex justify-between gap-4">
                            <span className="text-yellow-400">Outstanding:</span>
                            <span className="text-yellow-400 font-medium">${d.outstanding.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
          No data for this period
        </div>
      )}

      {/* X-axis date range */}
      {dataPoints.length > 0 && (
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{dataPoints[0]?.date ? parseLocalDate(dataPoints[0].date)?.toLocaleDateString() : ""}</span>
          <span>{dataPoints[dataPoints.length - 1]?.date ? parseLocalDate(dataPoints[dataPoints.length - 1].date)?.toLocaleDateString() : ""}</span>
        </div>
      )}
    </div>
  );
}
