/**
 * AdminPayments - Payment Management Dashboard
 *
 * Features:
 * - Payment dashboard with KPIs
 * - Payment history with filtering
 * - Record new payments
 * - Record refunds
 * - Outstanding balance tracking
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../components/Toast";
import EmptyState from "../../components/EmptyState";
import RecordPaymentModal from "../../components/payments/RecordPaymentModal";
import { PAYMENT_COLORS as statusColors } from "../../lib/statusColors.js";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

// Payment method display
const paymentMethodLabels = {
  cash: "Cash",
  check: "Check",
  credit_card: "Credit Card",
  paypal: "PayPal",
  stripe: "Stripe",
  venmo: "Venmo",
  zelle: "Zelle",
  wire: "Wire Transfer",
  other: "Other",
};

export default function AdminPayments() {
  const api = useApi();
  const toast = useToast();
  // State
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [dashboardError, setDashboardError] = useState(false);
  const [paymentsError, setPaymentsError] = useState(false);
  const paymentEpoch = useRef(0);
  const dashboardEpoch = useRef(0);
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isRefund, setIsRefund] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    paymentMethod: "",
    paymentType: "",
    fromDate: "",
    toDate: "",
  });

  const fetchDashboard = useCallback(async () => {
    const epoch = ++dashboardEpoch.current;
    try {
      const data = await api.get("/api/v1/payments/dashboard");
      if (epoch !== dashboardEpoch.current) return;
      setDashboard(data);
      setDashboardError(false);
    } catch {
      if (epoch !== dashboardEpoch.current) return;
      setDashboard(null);
      setDashboardError(true);
    }
  }, [api]);

  const fetchPayments = useCallback(async () => {
    const epoch = ++paymentEpoch.current;
    setLoading(true);
    setPaymentsError(false);
    setPayments([]);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        page_size: 25,
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.paymentMethod)
        params.append("payment_method", filters.paymentMethod);
      if (filters.paymentType)
        params.append("payment_type", filters.paymentType);
      if (filters.fromDate) params.append("from_date", filters.fromDate);
      if (filters.toDate) params.append("to_date", filters.toDate);

      const data = await api.get(`/api/v1/payments?${params}`);
      if (epoch !== paymentEpoch.current) return;
      if (!Array.isArray(data?.items) || data.items.some((item) => !item || typeof item !== "object" || Array.isArray(item))
        || !Number.isInteger(data.page) || data.page < 1
        || !Number.isInteger(data.total) || data.total < 0
        || !Number.isInteger(data.total_pages) || data.total_pages < 0) {
        throw new Error("Invalid payment list");
      }
      setPayments(data.items);
      setPagination({
        page: data.page,
        total: data.total,
        totalPages: data.total_pages,
      });
    } catch {
      if (epoch === paymentEpoch.current) setPaymentsError(true);
    } finally {
      if (epoch === paymentEpoch.current) setLoading(false);
    }
  }, [api, pagination.page, filters]);

  useEffect(() => {
    fetchDashboard();
    return () => { dashboardEpoch.current += 1; };
  }, [fetchDashboard]);

  useEffect(() => {
    fetchPayments();
    return () => { paymentEpoch.current += 1; };
  }, [fetchPayments]);

  const updateFilters = (next) => {
    setPagination((current) => ({ ...current, page: 1 }));
    setFilters(next);
  };

  const handleVoidPayment = async (paymentId, paymentNumber) => {
    if (!confirm(`Are you sure you want to void payment ${paymentNumber}?`))
      return;

    try {
      await api.del(`/api/v1/payments/${paymentId}`);
      toast.success("Payment voided");
      fetchPayments();
      fetchDashboard();
    } catch (err) {
      toast.error(err.message || "Failed to void payment");
    }
  };

  const handlePaymentRecorded = () => {
    setShowPaymentModal(false);
    setIsRefund(false);
    fetchPayments();
    fetchDashboard();
    toast.success(isRefund ? "Refund recorded" : "Payment recorded");
  };

  const formatCurrency = useFormatCurrency();

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="text-gray-400 text-sm">
            Track and manage payment transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsRefund(true);
              setShowPaymentModal(true);
            }}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            Record Refund
          </button>
          <button
            onClick={() => {
              setIsRefund(false);
              setShowPaymentModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Record Payment
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboardError && <div role="alert" className="mb-4 text-gray-300">Resumo financeiro indisponível. <button type="button" className="underline min-h-11" onClick={fetchDashboard}>Atualizar resumo</button></div>}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Today */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              Today
            </div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(dashboard.amount_today)}
            </div>
            <div className="text-sm text-gray-500">
              {dashboard.payments_today} payment
              {dashboard.payments_today !== 1 ? "s" : ""}
            </div>
          </div>

          {/* This Week */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              This Week
            </div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(dashboard.amount_this_week)}
            </div>
            <div className="text-sm text-gray-500">
              {dashboard.payments_this_week} payment
              {dashboard.payments_this_week !== 1 ? "s" : ""}
            </div>
          </div>

          {/* This Month */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              This Month
            </div>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(dashboard.amount_this_month)}
            </div>
            <div className="text-sm text-gray-500">
              {dashboard.payments_this_month} payment
              {dashboard.payments_this_month !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Outstanding */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              Outstanding
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {formatCurrency(dashboard.total_outstanding)}
            </div>
            <div className="text-sm text-gray-500">
              {dashboard.orders_with_balance} order
              {dashboard.orders_with_balance !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Breakdown */}
      {dashboard &&
        dashboard.by_method &&
        Object.keys(dashboard.by_method).length > 0 && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
            <div className="text-gray-400 text-xs uppercase tracking-wide mb-3">
              This Month by Method
            </div>
            <div className="flex flex-wrap gap-4">
              {Object.entries(dashboard.by_method).map(([method, amount]) => (
                <div key={method} className="flex items-center gap-2">
                  <span className="text-gray-400">
                    {paymentMethodLabels[method] || method}:
                  </span>
                  <span className="text-white font-medium">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Filters */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="col-span-2 md:col-span-1">
            <input
              aria-label="Buscar pagamentos"
              type="text"
              placeholder="Search payments..."
              value={filters.search}
              onChange={(e) =>
                updateFilters({ ...filters, search: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500"
            />
          </div>

          {/* Payment Method */}
          <select
            aria-label="Método de pagamento"
            value={filters.paymentMethod}
            onChange={(e) =>
              updateFilters({ ...filters, paymentMethod: e.target.value })
            }
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Methods</option>
            {Object.entries(paymentMethodLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Payment Type */}
          <select
            aria-label="Tipo de pagamento"
            value={filters.paymentType}
            onChange={(e) =>
              updateFilters({ ...filters, paymentType: e.target.value })
            }
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Types</option>
            <option value="payment">Payments</option>
            <option value="refund">Refunds</option>
          </select>

          {/* Date Range */}
          <input
            aria-label="Data inicial"
            type="date"
            value={filters.fromDate}
            onChange={(e) =>
              updateFilters({ ...filters, fromDate: e.target.value })
            }
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
            placeholder="From"
            min="2000-01-01"
            max="2099-12-31"
          />
          <input
            aria-label="Data final"
            type="date"
            value={filters.toDate}
            onChange={(e) => updateFilters({ ...filters, toDate: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
            placeholder="To"
            min="2000-01-01"
            max="2099-12-31"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div role="status" aria-busy="true" className="p-12 text-center text-gray-400">
            Carregando pagamentos…
          </div>
        ) : paymentsError ? (
          <div role="alert" className="p-6 text-red-400">
            <p>Não foi possível consultar os pagamentos. Verifique seu acesso e tente novamente.</p>
            <button type="button" onClick={fetchPayments} className="underline min-h-11">Tentar novamente</button>
          </div>
        ) : payments.length === 0 ? (
          (() => {
            const hasActiveFilters = filters.search || filters.paymentMethod || filters.paymentType || filters.fromDate || filters.toDate;
            return hasActiveFilters ? (
              <EmptyState
                icon="filter"
                title="No payments match your filters"
                onClearFilters={() => updateFilters({ search: "", paymentMethod: "", paymentType: "", fromDate: "", toDate: "" })}
              />
            ) : (
              <EmptyState
                icon="default"
                title="No payments yet"
                description="Payments are recorded from sales orders or invoices."
                actionLabel="Go to Orders"
                actionTo="/admin/orders"
              />
            );
          })()
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Payment #
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Order
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Method
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-t border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <span className="text-white font-medium">
                        {payment.payment_number}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {payment.sales_order_id != null ? <a
                        href={`/admin/orders/${payment.sales_order_id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {payment.order_number}
                      </a> : <span className="text-gray-400">Sem pedido vinculado</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={
                          payment.amount < 0 ? "text-red-400" : "text-green-400"
                        }
                      >
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {paymentMethodLabels[payment.payment_method] ||
                        payment.payment_method}
                      {payment.check_number && (
                        <span className="text-gray-500 text-xs ml-1">
                          #{payment.check_number}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          payment.payment_type === "refund"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {payment.payment_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          statusColors[payment.status] ||
                          "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">
                      {formatDate(payment.payment_date)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {payment.status === "completed" && (
                        <button
                          onClick={() =>
                            handleVoidPayment(
                              payment.id,
                              payment.payment_number
                            )
                          }
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Void
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center px-4 py-3 border-t border-gray-800">
                <div className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * 25 + 1} to{" "}
                  {Math.min(pagination.page * 25, pagination.total)} of{" "}
                  {pagination.total}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page - 1,
                      })
                    }
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 bg-gray-800 text-gray-400 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page + 1,
                      })
                    }
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-1 bg-gray-800 text-gray-400 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <RecordPaymentModal
          isRefund={isRefund}
          onClose={() => {
            setShowPaymentModal(false);
            setIsRefund(false);
          }}
          onSuccess={handlePaymentRecorded}
        />
      )}
    </div>
  );
}
