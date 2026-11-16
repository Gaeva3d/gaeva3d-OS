import { useState, useEffect, useRef } from "react";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useCRUD } from "../../hooks/useCRUD";
import { useToast } from "../../components/Toast";
import ContactMetricWidget from "../../components/customers/ContactMetricWidget";
import EmptyState from "../../components/EmptyState";
import { STATUS_OPTIONS, getStatusStyle, PAYMENT_TERMS_LABELS } from "../../components/customers/constants";
import CustomerModal from "../../components/customers/CustomerModal";
import CustomerDetailsModal from "../../components/customers/CustomerDetailsModal";
import ImportCSVModal from "../../components/customers/ImportCSVModal";
import "../../styles/gaeva-contacts.css";

export default function AdminCustomers() {
  const formatCurrency = useFormatCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const api = useApi();
  const [filters, setFilters] = useState({ search: "", status: "all" });
  const {
    items: customers,
    loading,
    error,
    fetchAll: fetchCustomers,
    refresh,
  } = useCRUD("/api/v1/admin/customers", {
    extractKey: null,
    defaultParams: { limit: "200", ...(filters.status === "all" ? {} : { status: filters.status }) },
    latestReadOnly: true,
  });
  const fetchedStatus = useRef("all");

  // Modal states
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const selectionEpoch = useRef(0);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  useEffect(() => () => { selectionEpoch.current += 1; }, []);

  const cancelPendingSelection = () => {
    selectionEpoch.current += 1;
    setLoadingCustomer(false);
  };

  // Check for action=new parameter and open modal
  useEffect(() => {
    const action = searchParams.get("action");
    const returnTo = searchParams.get("returnTo");

    if (action === "new") {
      selectionEpoch.current += 1;
      setLoadingCustomer(false);
      setEditingCustomer(null);
      setShowCustomerModal(true);
      // Remove the action parameter from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("action");
      if (returnTo) {
        newParams.set("returnTo", returnTo);
      }
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Initial read stays with useCRUD. Every later status, including all, is a
  // new read with the current query defaults; all omits the old status key.
  useEffect(() => {
    if (filters.status !== fetchedStatus.current) {
      fetchedStatus.current = filters.status;
      Promise.resolve(fetchCustomers()).catch(() => {});
    }
  }, [filters.status, fetchCustomers]);

  const filteredCustomers = customers.filter((customer) => {
    if (!filters.search) return true;
    const search = filters.search.toLowerCase();
    return (
      customer.email?.toLowerCase().includes(search) ||
      customer.customer_number?.toLowerCase().includes(search) ||
      customer.full_name?.toLowerCase().includes(search) ||
      customer.company_name?.toLowerCase().includes(search)
    );
  });

  // Stats calculations
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    withOrders: customers.filter((c) => c.order_count > 0).length,
    bookedOrders: customers.reduce(
      (sum, c) => sum + (parseFloat(c.total_spent) || 0),
      0
    ),
    paidCash: customers.reduce(
      (sum, c) => sum + (parseFloat(c.total_paid) || 0),
      0
    ),
    outstanding: customers.reduce(
      (sum, c) => sum + (parseFloat(c.outstanding_balance) || 0),
      0
    ),
  };

  // Save customer
  const handleSaveCustomer = async (customerData) => {
    try {
      const savedCustomer = editingCustomer
        ? await api.patch(`/api/v1/admin/customers/${editingCustomer.id}`, customerData)
        : await api.post("/api/v1/admin/customers", customerData);

      // Check if we need to return to order creation
      const returnTo = searchParams.get("returnTo");
      if (returnTo === "order" && !editingCustomer) {
        // Store the newly created customer ID for the order modal
        const pendingData = sessionStorage.getItem("pendingOrderData");
        if (pendingData) {
          try {
            const data = JSON.parse(pendingData);
            data.newCustomerId = savedCustomer.id;
            sessionStorage.setItem("pendingOrderData", JSON.stringify(data));
          } catch {
            // Session storage update failure is non-critical - order creation will proceed
          }
        }
        // Navigate back to orders page (which will open the modal)
        navigate("/admin/orders");
        return;
      }

      toast.success(editingCustomer ? "Cliente atualizado" : "Cliente cadastrado");
      setShowCustomerModal(false);
      setEditingCustomer(null);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // A single selection epoch covers view and edit so an older read cannot
  // replace a newer intent, even when the two actions differ.
  const loadCustomer = async (customerId, mode) => {
    const epoch = ++selectionEpoch.current;
    setLoadingCustomer(true);
    setViewingCustomer(null);
    setShowCustomerModal(false);
    try {
      const data = await api.get(`/api/v1/admin/customers/${customerId}`);
      if (epoch !== selectionEpoch.current) return;
      if (!data || data.id !== customerId) {
        toast.error("Os dados deste cliente não estão disponíveis. Tente novamente.");
        return;
      }
      if (mode === "edit") {
        setEditingCustomer(data);
        setShowCustomerModal(true);
      } else {
        setViewingCustomer(data);
      }
    } catch {
      if (epoch === selectionEpoch.current) {
        toast.error("Não foi possível abrir este cliente. Verifique seu acesso e tente novamente.");
      }
    } finally {
      if (epoch === selectionEpoch.current) setLoadingCustomer(false);
    }
  };

  const handleEditCustomer = (id) => loadCustomer(id, "edit");
  const handleViewCustomer = (id) => loadCustomer(id, "view");

  return (
    <div className="gaeva-contacts space-y-6">
      {/* Header */}
      <div className="contacts-heading flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <div>
          <p className="contacts-eyebrow">Relacionamento</p>
          <h1 className="text-2xl font-bold text-white">Contatos</h1>
          <p className="text-gray-400 mt-1">
            Gerencie clientes e consulte o histórico de pedidos
          </p>
        </div>
        <div className="contacts-heading-actions flex gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="contacts-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importar CSV
          </button>
          <button
            onClick={() => {
              cancelPendingSelection();
              setEditingCustomer(null);
              setShowCustomerModal(true);
            }}
            className="contacts-primary"
          >
            + Adicionar cliente
          </button>
        </div>
      </div>

      {/* Stats */}
      {!loading && !error && <div className="contacts-metrics widget-grid" aria-label="Resumo dos clientes consultados">
        <ContactMetricWidget title="Total de clientes" value={stats.total} />
        <ContactMetricWidget title="Ativos" value={stats.active} />
        <ContactMetricWidget title="Com pedidos" value={stats.withOrders} />
        <ContactMetricWidget
          title="Pedidos registrados"
          value={formatCurrency(stats.bookedOrders)}
          currency
        />
        <ContactMetricWidget
          title="Valor recebido"
          value={formatCurrency(stats.paidCash)}
          currency
        />
        <ContactMetricWidget
          title="Saldo a receber"
          value={formatCurrency(stats.outstanding)}
          currency
        />
      </div>}

      {/* Filters */}
      <div className="contacts-toolbar flex flex-col sm:flex-row gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4" role="search" aria-label="Filtrar contatos">
        <div className="flex-1">
          <input
            aria-label="Buscar clientes"
            type="text"
            placeholder="Buscar por e-mail, nome, empresa ou número do cliente..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500"
          />
        </div>
        <select
          aria-label="Status dos clientes"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
        >
          <option value="all">Todos os status</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
          <p>Não foi possível carregar os clientes. Verifique seu acesso e tente novamente.</p>
          <button type="button" className="min-h-11 underline" onClick={() => refresh().catch(() => {})}>Tentar novamente</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div role="status" aria-busy="true" className="flex items-center justify-center gap-3 h-32">
          <div aria-hidden="true" className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span>Carregando clientes…</span>
        </div>
      )}

      {/* Customers Table */}
      {loadingCustomer && <p role="status">Carregando dados do cliente…</p>}
      {!loading && !error && (
        <section className="contacts-table-panel bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" aria-label="Lista de contatos">
          <div className="contacts-list-heading"><h2>Clientes e empresas</h2><span>{filteredCustomers.length} de {customers.length} nesta consulta</span></div>
          <div className="contacts-table-scroll overflow-x-auto" role="region" aria-label="Tabela de contatos" tabIndex={0}>
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  Nº do cliente
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  Nome
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  E-mail
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  Empresa
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  Condições de pagamento
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  Pedidos
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  Valor dos pedidos
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  Recebido
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  Saldo
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-400 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4 text-white font-mono text-sm">
                    {customer.customer_number || "-"}
                  </td>
                  <td className="contacts-person py-3 px-4 text-gray-300">
                    <span className="contacts-avatar" aria-hidden="true">{(customer.full_name || customer.email || "?").trim().slice(0, 1).toLocaleUpperCase("pt-BR")}</span>
                    <span>{customer.full_name || "-"}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{customer.email}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {customer.company_name || "-"}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-300 text-sm">
                    {PAYMENT_TERMS_LABELS[customer.payment_terms] || customer.payment_terms?.toUpperCase() || "COD"}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-300">
                    {customer.order_count || 0}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    {formatCurrency(customer.total_spent || 0)}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-300">
                    {formatCurrency(customer.total_paid || 0)}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-300">
                    {formatCurrency(customer.outstanding_balance || 0)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(
                        customer.status
                      )}`}
                    >
                      {STATUS_OPTIONS.find((s) => s.value === customer.status)
                        ?.label || customer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewCustomer(customer.id)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        Visualizar
                      </button>
                      <button
                        onClick={() => handleEditCustomer(customer.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-4">
                    {customers.length === 0 ? (
                      <EmptyState
                        icon="customers"
                        title="Nenhum cliente cadastrado"
                        description="Cadastre o primeiro cliente para criar propostas e pedidos."
                        actionLabel="Adicionar cliente"
                        onAction={() => { cancelPendingSelection(); setEditingCustomer(null); setShowCustomerModal(true); }}
                      />
                    ) : (
                      <EmptyState
                        icon="filter"
                        title="Nenhum cliente corresponde aos filtros"
                        onClearFilters={() => setFilters({ search: "", status: "all" })}
                      />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </section>
      )}

      {/* Customer Create/Edit Modal */}
      {showCustomerModal && (
        <CustomerModal
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onClose={() => {
            setShowCustomerModal(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Customer Details Modal */}
      {viewingCustomer && (
        <CustomerDetailsModal
          customer={viewingCustomer}
          onClose={() => setViewingCustomer(null)}
          onEdit={() => {
            setViewingCustomer(null);
            handleEditCustomer(viewingCustomer.id);
          }}
        />
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <ImportCSVModal
          onClose={() => setShowImportModal(false)}
          onImportComplete={() => {
            setShowImportModal(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
