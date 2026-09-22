import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpDown,
  Building2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Columns3,
  MoreHorizontal,
  Plus,
  Printer,
  Rows3,
  SignalHigh,
  SlidersHorizontal,
  Tag,
  UserCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/gaeva/app-shell";
import { OrdersKanban } from "@/components/gaeva/orders-kanban";
import { LinearFilters, type FilterField } from "@/components/gaeva/linear-filters";
import { stageForStatus } from "@/lib/gaeva/kanban";
import { PRIORITY_TO_DB, PRODUCT_TO_DB } from "@/lib/gaeva/supabase-mappers";
import { PriorityBadge, RiskBadge, StatusBadge } from "@/components/gaeva/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  attentionScore,
  daysUntil,
  deadlineRisk,
  formatDate,
  formatDateTime,
  initials,
  isLate,
  isUrgent,
} from "@/lib/gaeva/helpers";
import { inDateRange, rangeLastDay } from "@/lib/gaeva/dashboard-helpers";
import { useGaeva } from "@/lib/gaeva/store";
import {
  ORDER_STATUS_FLOW,
  PRIORITY_LABELS,
  PRODUCT_LABELS,
  STATUS_LABELS,
  type Order,
  type OrderStatus,
  type Priority,
  type ProductCategory,
} from "@/lib/gaeva/types";
import { cn } from "@/lib/utils";

interface OrdersSearch {
  inicio?: string | undefined;
  fim?: string | undefined;
  q?: string | undefined;
  status?: OrderStatus | undefined;
  prioridade?: Priority | undefined;
  produto?: ProductCategory | undefined;
  responsavel?: string | undefined;
  impressora?: string | undefined;
  cliente?: string | undefined;
  prazo?: "atrasado" | "hoje" | "semana" | undefined;
  foco?: string | undefined;
  view?: "tabela" | "kanban" | undefined;
}

export const Route = createFileRoute("/pedidos/")({
  validateSearch: (search: Record<string, unknown>): OrdersSearch => {
    const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
    return {
      q: str(search["q"]),
      inicio: str(search["inicio"]),
      fim: str(search["fim"]),
      status: str(search["status"]) as OrderStatus | undefined,
      prioridade: str(search["prioridade"]) as Priority | undefined,
      produto: str(search["produto"]) as ProductCategory | undefined,
      responsavel: str(search["responsavel"]),
      impressora: str(search["impressora"]),
      cliente: str(search["cliente"]),
      prazo: str(search["prazo"]) as OrdersSearch["prazo"],
      foco: str(search["foco"]),
      view: str(search["view"]) as OrdersSearch["view"],
    };
  },
  head: () => ({
    meta: [
      { title: "Pedidos — GAEVA OS" },
      {
        name: "description",
        content: "Lista e kanban de pedidos da GAEVA com filtros combináveis.",
      },
      { property: "og:title", content: "Pedidos — GAEVA OS" },
      { property: "og:description", content: "Lista e kanban de pedidos da GAEVA." },
    ],
  }),
  component: OrdersPage,
});

const PAGE_SIZE = 25;

const COLUMNS = [
  { id: "cliente", label: "Cliente" },
  { id: "produto", label: "Produto" },
  { id: "status", label: "Status" },
  { id: "prioridade", label: "Prioridade" },
  { id: "prazo", label: "Prazo" },
  { id: "responsavel", label: "Responsável" },
  { id: "impressora", label: "Impressora" },
  { id: "atualizado", label: "Atualizado" },
] as const;

type ColumnId = (typeof COLUMNS)[number]["id"];
type SortKey = "code" | "customer" | "due_date" | "priority" | "updated_at";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

const PRIORITY_ORDER: Record<Priority, number> = {
  normal: 2,
  alta: 3,
  urgente: 4,
  critica: 5,
};

const PRAZO_LABELS: Record<"atrasado" | "hoje" | "semana", string> = {
  atrasado: "Atrasados",
  hoje: "Vencem hoje",
  semana: "Próximos 7 dias",
};

const FOCUS_LABELS: Record<string, string> = {
  ativos: "Pedidos ativos",
  urgentes: "Urgentes",
  atrasados: "Atrasados",
  aprovacao: "Aguardando aprovação",
  imprimindo: "Em impressão",
  concluidos_mes: "Concluídos no mês",
  concluidos: "Concluídos",
};

function applyFocus(orders: Order[], foco?: string): Order[] {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  switch (foco) {
    case "ativos":
      return orders.filter((o) => o.status !== "concluido" && o.status !== "cancelado");
    case "urgentes":
      return orders.filter(
        (order) => order.status !== "concluido" && order.status !== "cancelado" && isUrgent(order),
      );
    case "atrasados":
      return orders.filter(isLate);
    case "aprovacao":
      return orders.filter((o) => o.status === "aguardando_aprovacao");
    case "imprimindo":
      return orders.filter((o) => o.status === "imprimindo");
    case "concluidos":
      return orders.filter((order) => order.status === "concluido");
    case "concluidos_mes":
      return orders.filter((o) => o.status === "concluido" && new Date(o.updated_at) >= monthStart);
    default:
      return orders;
  }
}

function OrdersPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/pedidos/" });
  const { orders, customers, team, printers, changeStatus, updateOrder, can } = useGaeva();
  const [query, setQuery] = useState(search.q ?? "");
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);
  const [hidden, setHidden] = useState<ColumnId[]>([]);

  const view = search.view ?? "tabela";
  const editable = can("manage_production") || can("manage_commercial");

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? "—";
  const memberName = (id?: string | null) => team.find((t) => t.id === id)?.name ?? "—";
  const printerName = (id?: string | null) => printers.find((p) => p.id === id)?.name ?? "—";

  const filtered = useMemo(() => {
    let list = applyFocus(orders, search.foco);
    if (search.inicio || search.fim)
      list = list.filter((order) => inDateRange(order.created_at, search.inicio, search.fim));
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((o) =>
        [o.code, o.project_name, customerName(o.customer_id)].join(" ").toLowerCase().includes(q),
      );
    }
    if (search.status) list = list.filter((o) => o.status === search.status);
    if (search.prioridade) list = list.filter((o) => o.priority === search.prioridade);
    if (search.produto) list = list.filter((o) => o.product === search.produto);
    if (search.responsavel) list = list.filter((o) => o.owner_id === search.responsavel);
    if (search.impressora) list = list.filter((o) => o.printer_id === search.impressora);
    if (search.cliente) list = list.filter((o) => o.customer_id === search.cliente);
    if (search.prazo === "atrasado") list = list.filter(isLate);
    if (search.prazo === "hoje") list = list.filter((o) => daysUntil(o.due_date) === 0);
    if (search.prazo === "semana")
      list = list.filter(
        (o) => (daysUntil(o.due_date) ?? 99) <= 7 && (daysUntil(o.due_date) ?? 0) >= 0,
      );
    return [...list].sort((a, b) => attentionScore(a) - attentionScore(b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, search, query, customers]);

  const setFilter = (patch: Partial<OrdersSearch>) =>
    navigate({ to: ".", search: (prev) => ({ ...prev, ...patch }) });

  const clearFilters = () => {
    setQuery("");
    navigate({ to: ".", search: { view } });
  };

  const handleStatus = async (order: Order, status: OrderStatus) => {
    let reason: string | null = null;
    if (status === "bloqueado") {
      reason = window.prompt("Motivo do bloqueio:");
      if (!reason) return;
    }
    const res = await changeStatus(order.id, status, reason ? { reason } : undefined);
    if (res.ok) {
      toast.success(`Status atualizado para ${STATUS_LABELS[status]}.`);
    } else {
      toast.error(res.error ?? "Não foi possível alterar o status.");
    }
  };

  const handlePriority = async (order: Order, priority: Priority) => {
    let res;
    if ((priority === "urgente" || priority === "critica") && !order.urgency_reason) {
      const reason = window.prompt("Motivo da urgência (obrigatório):");
      if (!reason) {
        toast.error("Urgência exige motivo.");
        return;
      }
      res = await updateOrder(order.id, { priority, urgency_reason: reason }, reason);
    } else {
      res = await updateOrder(order.id, { priority });
    }
    if (res.ok) toast.success("Prioridade atualizada.");
    else toast.error(res.error ?? "Não foi possível atualizar a prioridade.");
  };

  const handleOwner = async (order: Order, ownerId: string | null) => {
    const res = await updateOrder(order.id, { owner_id: ownerId });
    if (res.ok) toast.success("Responsável atualizado.");
    else toast.error(res.error ?? "Não foi possível atualizar o responsável.");
  };

  const toggleSort = (key: SortKey) =>
    setSort((old) =>
      old?.key === key ? (old.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" },
    );

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const factor = sort.dir === "asc" ? 1 : -1;
    const value = (o: Order) => {
      switch (sort.key) {
        case "code":
          return o.code;
        case "customer":
          return customerName(o.customer_id);
        case "due_date":
          return o.due_date ?? "";
        case "priority":
          return String(PRIORITY_ORDER[o.priority] ?? 0).padStart(2, "0");
        case "updated_at":
          return o.updated_at;
      }
    };
    return [...filtered].sort((a, b) => value(a).localeCompare(value(b)) * factor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, sort, customers]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const visible = (id: ColumnId) => !hidden.includes(id);

  const filterFields: FilterField[] = [
    {
      id: "status",
      label: "Status",
      icon: CircleDashed,
      options: ORDER_STATUS_FLOW.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
    },
    {
      id: "prioridade",
      label: "Prioridade",
      icon: SignalHigh,
      options: (Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => ({
        value: p,
        label: PRIORITY_LABELS[p],
      })),
    },
    {
      id: "prazo",
      label: "Prazo",
      icon: CalendarClock,
      options: [
        { value: "atrasado", label: "Atrasados" },
        { value: "hoje", label: "Vencem hoje" },
        { value: "semana", label: "Próximos 7 dias" },
      ],
    },
    {
      id: "produto",
      label: "Produto",
      icon: Tag,
      options: (Object.keys(PRODUCT_LABELS) as ProductCategory[]).map((p) => ({
        value: p,
        label: PRODUCT_LABELS[p],
      })),
    },
    {
      id: "responsavel",
      label: "Responsável",
      icon: UserCircle,
      options: team.map((t) => ({ value: t.id, label: t.name })),
    },
    {
      id: "impressora",
      label: "Impressora",
      icon: Printer,
      options: printers.map((p) => ({ value: p.id, label: p.name })),
    },
    {
      id: "cliente",
      label: "Cliente",
      icon: Building2,
      options: customers.map((c) => ({ value: c.id, label: c.name })),
    },
  ];

  const filterValues: Record<string, string | undefined> = {
    status: search.status,
    prioridade: search.prioridade,
    prazo: search.prazo,
    produto: search.produto,
    responsavel: search.responsavel,
    impressora: search.impressora,
    cliente: search.cliente,
  };

  const extraChips: { key: string; label: string; clear: () => void }[] = [];
  if (search.foco)
    extraChips.push({
      key: "foco",
      label: FOCUS_LABELS[search.foco] ?? "Foco",
      clear: () => setFilter({ foco: undefined }),
    });

  if (view === "kanban")
    return (
      <OrdersKanban
        initialFilters={{
          query: search.q ?? "",
          owner: search.responsavel ?? "",
          from: search.inicio ?? "",
          to: rangeLastDay(search.fim) ?? "",
          stage: search.status ? (stageForStatus(search.status) ?? "") : "",
          product: search.produto ? PRODUCT_TO_DB[search.produto] : "",
          priority: search.prioridade ? PRIORITY_TO_DB[search.prioridade] : "",
          quick:
            search.foco === "atrasados" ? "late" : search.foco === "urgentes" ? "urgent" : "all",
        }}
      />
    );
  return (
    <AppShell
      title="Pedidos"
      description={
        (search.foco ? FOCUS_LABELS[search.foco] : undefined) ??
        "Cadastro comercial e acompanhamento"
      }
      actions={
        <>
          <div className="flex rounded-md border border-border p-0.5">
            <Button
              size="sm"
              variant={view === "tabela" ? "secondary" : "ghost"}
              onClick={() => setFilter({ view: "tabela" })}
            >
              <Rows3 className="size-4" /> Tabela
            </Button>
            <Button size="sm" variant="ghost" onClick={() => navigate({ to: "/pedidos/kanban" })}>
              <Columns3 className="size-4" /> Kanban
            </Button>
          </div>
          <Button asChild size="sm">
            <Link to="/pedidos/novo">
              <Plus className="size-4" /> Novo pedido
            </Link>
          </Button>
        </>
      }
    >
      {search.inicio || search.fim ? (
        <p className="mb-3 text-sm text-muted-foreground">
          Data de cadastro: {formatDate(search.inicio)} até {formatDate(rangeLastDay(search.fim))}.
        </p>
      ) : null}
      <Card>
        <CardContent className="py-4">
          <LinearFilters
            query={query}
            onQueryChange={setQuery}
            queryPlaceholder="Buscar por código, projeto ou cliente"
            fields={filterFields}
            values={filterValues}
            onChange={(field, value) =>
              setFilter({ [field]: value } as Partial<OrdersSearch> as never)
            }
            onClear={clearFilters}
            extraChips={extraChips}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="size-4" /> Colunas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Colunas visíveis</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {COLUMNS.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={!hidden.includes(column.id)}
                    onCheckedChange={(checked) =>
                      setHidden((old) =>
                        checked ? old.filter((id) => id !== column.id) : [...old, column.id],
                      )
                    }
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </LinearFilters>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="mt-4">
          <CardContent className="flex max-h-[200px] flex-col items-center justify-center gap-2 py-8 text-center">
            <p className="text-sm font-medium">Nenhum pedido encontrado</p>
            <p className="text-sm text-muted-foreground">
              Ajuste os filtros ou cadastre um novo pedido.
            </p>
            <Button asChild size="sm">
              <Link to="/pedidos/novo">
                <Plus className="size-4" /> Novo pedido
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-4 overflow-hidden">
          <CardContent className="p-0">
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full min-w-[880px] text-sm">
                <thead className="sticky top-0 z-10 border-b border-border bg-secondary/80 text-left text-xs uppercase text-muted-foreground backdrop-blur">
                  <tr>
                    <SortableTh
                      label="Pedido"
                      sortKey="code"
                      sort={sort}
                      onSort={toggleSort}
                      className="min-w-[220px]"
                    />
                    {visible("cliente") ? (
                      <SortableTh
                        label="Cliente"
                        sortKey="customer"
                        sort={sort}
                        onSort={toggleSort}
                      />
                    ) : null}
                    {visible("produto") ? <th className="px-3 py-2 font-medium">Produto</th> : null}
                    {visible("status") ? <th className="px-3 py-2 font-medium">Status</th> : null}
                    {visible("prioridade") ? (
                      <SortableTh
                        label="Prioridade"
                        sortKey="priority"
                        sort={sort}
                        onSort={toggleSort}
                      />
                    ) : null}
                    {visible("prazo") ? (
                      <SortableTh
                        label="Prazo"
                        sortKey="due_date"
                        sort={sort}
                        onSort={toggleSort}
                      />
                    ) : null}
                    {visible("responsavel") ? (
                      <th className="px-3 py-2 font-medium">Responsável</th>
                    ) : null}
                    {visible("impressora") ? (
                      <th className="px-3 py-2 font-medium">Impressora</th>
                    ) : null}
                    {visible("atualizado") ? (
                      <SortableTh
                        label="Atualizado"
                        sortKey="updated_at"
                        sort={sort}
                        onSort={toggleSort}
                      />
                    ) : null}
                    <th className="w-10 px-3 py-2 font-medium">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((o) => (
                    <tr
                      key={o.id}
                      tabIndex={0}
                      role="link"
                      aria-label={`Abrir pedido ${o.code}`}
                      onClick={() => navigate({ to: "/pedidos/$id", params: { id: o.id } })}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          navigate({ to: "/pedidos/$id", params: { id: o.id } });
                        }
                      }}
                      className={cn(
                        "transition-ui cursor-pointer border-b border-border last:border-0 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                        isLate(o) && "bg-danger/5",
                        o.status === "bloqueado" && "bg-danger/8",
                        o.status === "aguardando_aprovacao" && "bg-warning/8",
                      )}
                    >
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-xs font-medium text-primary">{o.code}</span>
                        <div className="max-w-[260px] truncate font-medium">{o.project_name}</div>
                        <div className="max-w-[260px] truncate text-xs text-muted-foreground">
                          {customerName(o.customer_id)}
                        </div>
                      </td>
                      {visible("cliente") ? (
                        <td className="max-w-[180px] truncate px-3 py-2.5">
                          {customerName(o.customer_id)}
                        </td>
                      ) : null}
                      {visible("produto") ? (
                        <td className="whitespace-nowrap px-3 py-2.5">
                          {PRODUCT_LABELS[o.product]}
                          <span className="ml-1 text-xs text-muted-foreground tabular-nums">
                            ×{o.quantity}
                          </span>
                        </td>
                      ) : null}
                      {visible("status") ? (
                        <td className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                          {editable ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                aria-label={`Alterar status do pedido ${o.code}`}
                                className="transition-ui rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <StatusBadge status={o.status} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="max-h-72 overflow-auto">
                                <DropdownMenuLabel>Alterar status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {ORDER_STATUS_FLOW.map((s) => (
                                  <DropdownMenuItem
                                    key={s}
                                    onSelect={() => void handleStatus(o, s)}
                                  >
                                    {STATUS_LABELS[s]}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <StatusBadge status={o.status} />
                          )}
                        </td>
                      ) : null}
                      {visible("prioridade") ? (
                        <td className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                          {editable ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                aria-label={`Alterar prioridade do pedido ${o.code}`}
                                className="transition-ui rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <PriorityBadge priority={o.priority} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Alterar prioridade</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                                  <DropdownMenuItem
                                    key={p}
                                    onSelect={() => void handlePriority(o, p)}
                                  >
                                    {PRIORITY_LABELS[p]}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <PriorityBadge priority={o.priority} />
                          )}
                        </td>
                      ) : null}
                      {visible("prazo") ? (
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2 whitespace-nowrap tabular-nums">
                            {formatDate(o.due_date)}
                            <RiskBadge risk={deadlineRisk(o)} />
                          </div>
                        </td>
                      ) : null}
                      {visible("responsavel") ? (
                        <td className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                          {editable ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                aria-label={`Atribuir responsável do pedido ${o.code}`}
                                className="transition-ui flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <OwnerCell name={memberName(o.owner_id)} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="max-h-72 overflow-auto">
                                <DropdownMenuLabel>Responsável</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => void handleOwner(o, null)}>
                                  Sem responsável
                                </DropdownMenuItem>
                                {team.map((t) => (
                                  <DropdownMenuItem
                                    key={t.id}
                                    onSelect={() => void handleOwner(o, t.id)}
                                  >
                                    {t.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <OwnerCell name={memberName(o.owner_id)} />
                          )}
                        </td>
                      ) : null}
                      {visible("impressora") ? (
                        <td className="max-w-[160px] truncate px-3 py-2.5">
                          {printerName(o.printer_id)}
                        </td>
                      ) : null}
                      {visible("atualizado") ? (
                        <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground tabular-nums">
                          {formatDateTime(o.updated_at)}
                        </td>
                      ) : null}
                      <td className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              aria-label={`Ações do pedido ${o.code}`}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to="/pedidos/$id" params={{ id: o.id }}>
                                Abrir pedido
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/pedidos" search={{ cliente: o.customer_id }}>
                                Filtrar por este cliente
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2 text-sm">
              <p className="text-muted-foreground tabular-nums">
                {sorted.length} pedido{sorted.length > 1 ? "s" : ""} · página {currentPage} de{" "}
                {pageCount}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft className="size-4" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= pageCount}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Próxima <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}

function OwnerCell({ name }: { name: string }) {
  const known = name && name !== "—";
  return (
    <span className="flex items-center gap-2">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground">
        {known ? initials(name) : "—"}
      </span>
      <span className="max-w-[130px] truncate">{known ? name : "Sem responsável"}</span>
    </span>
  );
}

function SortableTh({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const activeSort = sort?.key === sortKey;
  return (
    <th className={cn("px-3 py-2 font-medium", className)}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        aria-label={`Ordenar por ${label}`}
        className="transition-ui inline-flex items-center gap-1 rounded uppercase hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {label}
        <ArrowUpDown className={cn("size-3", activeSort ? "text-primary" : "opacity-40")} />
      </button>
    </th>
  );
}
