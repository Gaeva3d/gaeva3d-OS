import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";
import StatCard from "../../components/StatCard";
import RecentOrderRow from "../../components/dashboard/RecentOrderRow";
import SalesChart from "../../components/dashboard/SalesChart";
import ProductionPipeline from "../../components/dashboard/ProductionPipeline";

export default function AdminDashboard() {
  const api = useApi();
  const formatCurrency = useFormatCurrency();
  const [stats, setStats] = useState(null);
  const [invoiceSummary, setInvoiceSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingPOs, setPendingPOs] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [salesPeriod, setSalesPeriod] = useState("MTD");
  const [salesLoading, setSalesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch sales trend data when period changes
  useEffect(() => {
    fetchSalesData(salesPeriod);
  }, [salesPeriod]);

  const fetchSalesData = async (period) => {
    setSalesLoading(true);
    try {
      const data = await api.get(`/api/v1/admin/dashboard/sales-trend?period=${period}`);
      setSalesData(data);
    } catch (err) {
      console.error("Failed to fetch sales data:", err);
    } finally {
      setSalesLoading(false);
    }
  };

  // Format revenue with smart display (show actual $ under 1k, otherwise Xk)
  const formatRevenue = (amount) => {
    if (amount < 1000) {
      return `$${amount.toFixed(0)}`;
    }
    return `$${(amount / 1000).toFixed(1)}k`;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [summaryResult, ordersResult, posResult, invoiceSummaryResult] = await Promise.allSettled([
        api.get("/api/v1/admin/dashboard/summary"),
        api.get("/api/v1/admin/dashboard/recent-orders?limit=5"),
        api.get("/api/v1/purchase-orders?status=draft,ordered&limit=5"),
        api.get("/api/v1/invoices/summary"),
      ]);

      if (summaryResult.status === "fulfilled") {
        setStats(summaryResult.value);
      } else {
        throw summaryResult.reason;
      }

      if (ordersResult.status === "fulfilled") {
        setRecentOrders(ordersResult.value);
      }

      if (posResult.status === "fulfilled") {
        const posData = posResult.value;
        setPendingPOs(posData.items || posData || []);
      }

      if (invoiceSummaryResult.status === "fulfilled") {
        setInvoiceSummary(invoiceSummaryResult.value);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div>
          <div className="h-7 w-40 bg-gray-800 rounded" />
          <div className="h-4 w-64 bg-gray-800 rounded mt-2" />
        </div>

        {/* Sales chart skeleton */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between mb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 w-14 bg-gray-800 rounded-md" />
              ))}
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-16 bg-gray-800 rounded" />
              <div className="h-8 w-16 bg-gray-800 rounded" />
            </div>
          </div>
          <div className="h-32 bg-gray-800/50 rounded" />
        </div>

        {/* Stat cards skeleton (Sales section) */}
        <div>
          <div className="h-3 w-12 bg-gray-800 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="h-3 w-24 bg-gray-800 rounded mb-3" />
                <div className="h-8 w-12 bg-gray-800 rounded mb-2" />
                <div className="h-3 w-20 bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Stat cards skeleton (Inventory section) */}
        <div>
          <div className="h-3 w-16 bg-gray-800 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="h-3 w-24 bg-gray-800 rounded mb-3" />
                <div className="h-8 w-12 bg-gray-800 rounded mb-2" />
                <div className="h-3 w-20 bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="h-5 w-32 bg-gray-800 rounded mb-4" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-10 bg-gray-800/50 rounded mb-2" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-400 flex flex-col">
        <h3 className="font-semibold mb-2">Não foi possível carregar o painel</h3>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Indicadores</h1>
          <p className="text-gray-400 mt-1">Indicadores e tendências da sua produção</p>
        </div>
        <Link
          to="/admin"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Painel inicial
        </Link>
      </div>

      {/* Sales Trend Chart - Primary KPI */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <SalesChart
          data={salesData}
          period={salesPeriod}
          onPeriodChange={setSalesPeriod}
          loading={salesLoading}
        />
      </div>

      {/* Action Items removed — CommandCenter is the canonical action-items surface (PR-13) */}

      {/* SALES Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Comercial
          </h2>
          <div className="flex-1 h-px bg-gray-800"></div>
          <Link
            to="/admin/orders"
            className="text-xs text-blue-400 hover:text-blue-300"
            aria-label="Ver todos os pedidos"
          >
            Ver tudo →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Propostas pendentes"
            value={stats?.quotes?.pending || 0}
            subtitle="Aguardando revisão"
            color="warning"
            to="/admin/quotes"
          />
          <StatCard
            title="Pedidos em andamento"
            value={
              (stats?.orders?.confirmed || 0) +
              (stats?.orders?.in_production || 0)
            }
            subtitle={`${stats?.orders?.confirmed || 0} confirmados, ${
              stats?.orders?.in_production || 0
            } em produção`}
            color="primary"
            to="/admin/orders"
          />
          <StatCard
            title="Prontos para envio"
            value={stats?.orders?.ready_to_ship || 0}
            subtitle={`${stats?.orders?.overdue || 0} em atraso`}
            color={stats?.orders?.overdue > 0 ? "danger" : "success"}
            to="/admin/shipping"
          />
          <StatCard
            title="Receita dos últimos 30 dias"
            value={formatRevenue(stats?.revenue?.last_30_days || 0)}
            subtitle={`${stats?.revenue?.orders_last_30_days || 0} pedidos`}
            color="success"
            to="/admin/payments"
          />
          <StatCard
            title="Contas a receber"
            value={formatCurrency(invoiceSummary?.total_ar || 0)}
            subtitle={
              invoiceSummary?.overdue_count > 0
                ? `${invoiceSummary.overdue_count} em atraso`
                : "Nenhuma fatura vencida"
            }
            color={invoiceSummary?.overdue_count > 0 ? "danger" : "success"}
            to="/admin/invoices"
          />
        </div>
      </div>

      {/* INVENTORY Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Estoque
          </h2>
          <div className="flex-1 h-px bg-gray-800"></div>
          <Link
            to="/admin/items"
            className="text-xs text-blue-400 hover:text-blue-300"
            aria-label="Ver todos os itens do estoque"
          >
            Ver tudo →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Itens com estoque baixo"
            value={stats?.inventory?.low_stock_count || 0}
            subtitle="Abaixo do ponto de reposição ou com falta no MRP"
            color={stats?.inventory?.low_stock_count > 0 ? "danger" : "success"}
            to="/admin/purchasing?tab=low-stock"
          />
          <StatCard
            title="Listas de materiais ativas"
            value={stats?.boms?.active || 0}
            subtitle={`${stats?.boms?.needs_review || 0} aguardam revisão`}
            color="secondary"
            to="/admin/bom"
          />
          <StatCard
            title="Pedidos que precisam de materiais"
            value={stats?.inventory?.active_orders || 0}
            subtitle="Para planejamento de materiais"
            color="neutral"
            to="/admin/purchasing"
          />
        </div>
      </div>

      {/* PRODUCTION Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Produção
          </h2>
          <div className="flex-1 h-px bg-gray-800"></div>
          <Link
            to="/admin/production"
            className="text-xs text-blue-400 hover:text-blue-300"
            aria-label="Ver todas as ordens de produção"
          >
            Ver tudo →
          </Link>
        </div>

        {/* Production Pipeline Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Fluxo de produção</h3>
          <ProductionPipeline stats={stats} />
          {!stats?.production?.in_progress && !stats?.production?.scheduled && !stats?.production?.draft && !stats?.production?.released && (
            <p className="text-gray-500 text-sm text-center py-4">Nenhuma ordem de produção ativa</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Ordens de produção em andamento"
            value={stats?.production?.in_progress || 0}
            subtitle={`${stats?.production?.ready_to_start || 0} prontas para iniciar`}
            color="primary"
            to="/admin/production?status=in_progress"
          />
          <StatCard
            title="Concluídas hoje"
            value={stats?.production?.complete_today || 0}
            subtitle="Unidades concluídas"
            color="success"
            to="/admin/manufacturing"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Pedidos recentes</h3>
            <Link
              to="/admin/orders"
              className="text-sm text-blue-400 hover:text-blue-300"
              aria-label="Ver todos os pedidos"
            >
              Ver tudo →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Pedido
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Produto
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Situação
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                    Total
                  </th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <RecentOrderRow key={order.id} order={order} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      Nenhum pedido recente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Purchase Orders */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Compras pendentes</h3>
            <Link
              to="/admin/purchasing"
              aria-label="Ver todas as compras"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Ver tudo →
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {pendingPOs.length > 0 ? (
              pendingPOs.map((po) => (
                <Link
                  key={po.id}
                  to={`/admin/purchasing?po=${po.id}`}
                  className="block px-6 py-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{po.po_number || `PO-${po.id}`}</p>
                      <p className="text-sm text-gray-400">{po.vendor_name || "Sem fornecedor"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        po.status === "draft"
                          ? "bg-gray-500/20 text-gray-400"
                          : po.status === "ordered"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}>
                        {po.status?.charAt(0).toUpperCase() + po.status?.slice(1)}
                      </span>
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-gray-500">
                    <span>{po.line_count || po.lines?.length || 0} items</span>
                    <span>
                      ${parseFloat(po.total_amount || po.total || 0).toFixed(2)}
                    </span>
                    {po.expected_date && (
                      <span>Previsão: {new Date(po.expected_date).toLocaleDateString("pt-BR")}</span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                Nenhuma ordem de compra pendente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
