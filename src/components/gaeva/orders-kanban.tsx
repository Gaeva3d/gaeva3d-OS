import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  Columns3,
  Loader2,
  Plus,
  RefreshCw,
  Rows3,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "./app-shell";
import { FilterSelect } from "./order-shared";
import {
  OrderDrawer,
  OrderActionDialog,
  CONFIRMATION_CHECKS,
  READY_CHECKS,
  type OperationRequest,
  type RunOperation,
} from "./order-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useGaeva } from "@/lib/gaeva/store";
import { useOperationalOrders } from "@/lib/gaeva/order-operations";
import {
  STAGES,
  EMPTY_FILTERS,
  compareOperationalOrders,
  matchesBoardFilters,
  allowedDestinations,
  isNormalMove,
  isOverdue,
  daysToDeadline,
  elapsed,
  substatus,
  type BoardFilters,
  type OperationalOrder,
  type Stage,
  type QuickFilter,
} from "@/lib/gaeva/kanban";
import { PRODUCT_TO_DB, STATUS_TO_DB } from "@/lib/gaeva/supabase-mappers";
import { PRODUCT_LABELS, type ProductCategory } from "@/lib/gaeva/types";
import { formatCurrency, formatDate } from "@/lib/gaeva/helpers";
import { operationDate } from "@/lib/gaeva/dashboard-helpers";
import { requireSupabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const PRODUCT_OPTIONS = (Object.keys(PRODUCT_LABELS) as ProductCategory[]).map((p) => ({
  value: PRODUCT_TO_DB[p],
  label: PRODUCT_LABELS[p],
}));
const PAYMENT_LABELS: Record<string, string> = {
  paid: "Pago",
  partial: "Entrada paga",
  invoiced: "Faturado",
  pending: "Pagamento pendente",
  overdue: "Pagamento pendente",
  refunded: "Estornado",
  cancelled: "Cancelado",
};
const PENDING_PAYMENT = ["pending", "overdue"];
const QUICK: { id: QuickFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "mine", label: "Meus pedidos" },
  { id: "late", label: "Atrasados" },
  { id: "today", label: "Prazo hoje" },
  { id: "urgent", label: "Urgentes" },
];

export function OrdersKanban({ initialFilters }: { initialFilters?: Partial<BoardFilters> }) {
  const { authUser, currentMember, team, printers, can, runOrderAction } = useGaeva();
  const [showFinished, setShowFinished] = useState(false);
  const [filters, setFilters] = useState<BoardFilters>(() => ({
    ...EMPTY_FILTERS,
    quick: currentMember.role === "designer" ? "mine" : "all",
    ...initialFilters,
  }));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [request, setRequest] = useState<OperationRequest | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [over, setOver] = useState<Stage | null>(null);
  const [dragged, setDragged] = useState<string | null>(null);
  const query = useOperationalOrders(authUser.id, showFinished);
  const orders = query.data ?? [];
  const filtered = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "cancelled" && (showFinished || o.status !== "completed"))
        .filter((o) =>
          matchesBoardFilters(o, filters, {
            role: currentMember.role,
            userId: authUser.id,
            memberId: currentMember.id,
          }),
        )
        .sort((a, b) => compareOperationalOrders(a, b)),
    [orders, showFinished, filters, currentMember, authUser.id],
  );
  const active = filtered.filter((o) => o.status !== "completed");
  const late = active.filter((o) => isOverdue(o)).length;
  const largest = Math.max(
    0,
    ...STAGES.filter((s) => s.id !== "completed").map(
      (s) => active.filter((o) => o.stage === s.id).length,
    ),
  );
  const patch = (value: Partial<BoardFilters>) => setFilters((old) => ({ ...old, ...value }));
  const selected = orders.find((o) => o.id === selectedId) ?? null;
  const sellers = [
    ...new Map(
      orders
        .filter((o) => o.created_by)
        .map((o) => [o.created_by!, { value: o.created_by!, label: o.seller_name ?? "Usuário" }]),
    ).values(),
  ];
  const run: RunOperation = async (order, action, payload) => {
    if (busyId) return false;
    setBusyId(order.id);
    try {
      const result = await runOrderAction(order.id, order.updated_at, action, payload);
      if (!result.ok) {
        toast.error(result.error ?? "Não foi possível salvar.");
        return false;
      }
      toast.success("Pedido atualizado.");
      if (
        action === "finish" ||
        (action === "move" && (payload as { status?: string })?.status === "completed")
      )
        setSelectedId(null);
      return true;
    } finally {
      setBusyId(null);
    }
  };
  const move = (order: OperationalOrder, target: Stage) => {
    if (busyId || order.stage === target) return;
    if (!allowedDestinations(order, currentMember.role, currentMember.id).includes(target)) {
      toast.error("Seu perfil não permite esta movimentação.");
      return;
    }
    const stage = STAGES.find((s) => s.id === target)!;
    const unusual = !isNormalMove(order.stage, target);
    const checks =
      order.stage === "confirmation" && target === "design"
        ? CONFIRMATION_CHECKS
        : order.stage === "ready" && target === "shipping"
          ? READY_CHECKS
          : undefined;
    if (!unusual && !checks && order.stage !== "approval") {
      void run(order, "move", { status: STATUS_TO_DB[stage.status] });
      return;
    }
    setRequest({
      order,
      action: "move",
      title: unusual ? "Confirmar movimentação" : `Mover para ${stage.label}`,
      payload: { status: STATUS_TO_DB[stage.status] },
      noteRequired: unusual || (order.stage === "approval" && target === "design"),
      ...(checks ? { checks } : {}),
      description: unusual
        ? "Movimentação fora do fluxo habitual. Registre a justificativa para o histórico."
        : `O status real do pedido será atualizado para ${stage.label}.`,
    });
  };
  const drop = (event: DragEvent, stage: Stage) => {
    event.preventDefault();
    setOver(null);
    setDragged(null);
    const id =
      event.dataTransfer.getData("application/x-gaeva-order") ||
      event.dataTransfer.getData("text/plain");
    const order = orders.find((o) => o.id === id);
    if (order) move(order, stage);
  };
  const filterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "quick" && !!value,
  ).length;
  const chip = (key: keyof BoardFilters, label: string) => ({
    key,
    label,
    clear: () => patch({ [key]: "" } as Partial<BoardFilters>),
  });
  const memberLabel = (id: string) => team.find((t) => t.id === id)?.name ?? "Responsável";
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (filters.query) chips.push(chip("query", `Busca: ${filters.query}`));
  if (filters.quick !== "all")
    chips.push({
      key: "quick",
      label: QUICK.find((q) => q.id === filters.quick)?.label ?? "Filtro rápido",
      clear: () => patch({ quick: "all" }),
    });
  if (filters.owner) chips.push(chip("owner", `Responsável: ${memberLabel(filters.owner)}`));
  if (filters.designer) chips.push(chip("designer", `Designer: ${memberLabel(filters.designer)}`));
  if (filters.seller)
    chips.push(
      chip(
        "seller",
        `Vendedor: ${sellers.find((s) => s.value === filters.seller)?.label ?? "Usuário"}`,
      ),
    );
  if (filters.product)
    chips.push(
      chip(
        "product",
        `Produto: ${PRODUCT_OPTIONS.find((p) => p.value === filters.product)?.label ?? filters.product}`,
      ),
    );
  if (filters.priority)
    chips.push(
      chip(
        "priority",
        `Prioridade: ${{ normal: "Normal", high: "Prioridade", urgent: "Urgente" }[filters.priority] ?? filters.priority}`,
      ),
    );
  if (filters.stage)
    chips.push(
      chip("stage", `Etapa: ${STAGES.find((s) => s.id === filters.stage)?.label ?? filters.stage}`),
    );
  if (filters.deadline)
    chips.push(
      chip(
        "deadline",
        `Prazo: ${{ late: "Atrasados", today: "Hoje", week: "Próximos 7 dias" }[filters.deadline] ?? filters.deadline}`,
      ),
    );
  if (filters.from) chips.push(chip("from", `Venda de: ${formatDate(filters.from)}`));
  if (filters.to) chips.push(chip("to", `Venda até: ${formatDate(filters.to)}`));
  const stats = [
    { label: "Ativos", value: active.length, onClick: () => patch({ quick: "all", stage: "" }) },
    { label: "Atrasados", value: late, onClick: () => patch({ quick: "late", stage: "" }) },
    {
      label: "Novos hoje",
      value: active.filter((o) => operationDate(o.created_at) === operationDate()).length,
      onClick: () => patch({ quick: "all", stage: "", from: operationDate(), to: operationDate() }),
    },
    ...STAGES.filter((s) => ["design", "approval", "printing", "shipping"].includes(s.id)).map(
      (s) => ({
        label: s.label,
        value: active.filter((o) => o.stage === s.id).length,
        onClick: () => patch({ stage: s.id }),
      }),
    ),
  ];
  return (
    <AppShell
      title="Kanban de pedidos"
      description="Do Comercial à finalização, no mesmo pedido"
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link to="/pedidos" search={{ view: "tabela" }}>
              <Rows3 className="size-4" />
              Tabela
            </Link>
          </Button>
          {can("manage_commercial") ? (
            <Button size="sm" asChild>
              <Link to="/pedidos/novo">
                <Plus className="size-4" />
                Novo pedido
              </Link>
            </Button>
          ) : null}
        </>
      }
    >
      <div
        className="mb-5 grid grid-cols-3 gap-2 rounded-lg border border-border bg-card p-2 sm:grid-cols-4 xl:grid-cols-7"
        aria-label="Resumo operacional filtrado"
      >
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={s.onClick}
            className="rounded p-2 text-left hover:bg-secondary"
          >
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {s.label}
            </span>
            <span
              className={cn(
                "block text-xl font-semibold tabular-nums",
                s.label === "Atrasados" && s.value > 0 && "text-danger",
              )}
            >
              {s.value}
            </span>
          </button>
        ))}
      </div>
      <div className="space-y-3 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden />
            <Input
              className="pl-9"
              value={filters.query}
              onChange={(e) => patch({ query: e.target.value })}
              placeholder="Buscar pedido, cliente ou telefone"
              aria-label="Buscar pedido, cliente ou telefone"
            />
          </div>
          <Button
            size="sm"
            variant={filtersOpen ? "secondary" : "outline"}
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="size-4" />
            Filtros{filterCount ? ` (${filterCount})` : ""}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Atualizar Kanban"
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
          >
            <RefreshCw className={cn("size-4", query.isFetching && "animate-spin")} />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {QUICK.map((q) => (
            <Button
              key={q.id}
              size="sm"
              variant={filters.quick === q.id ? "secondary" : "ghost"}
              onClick={() => patch({ quick: q.id })}
            >
              {q.label}
            </Button>
          ))}
          <label className="ml-auto flex items-center gap-2 whitespace-nowrap text-xs">
            <Checkbox checked={showFinished} onCheckedChange={(v) => setShowFinished(v === true)} />
            Mostrar finalizados
          </label>
        </div>
        {filtersOpen ? (
          <div className="flex flex-wrap gap-2 border-t pt-3">
            <FilterSelect
              label="Responsável"
              value={filters.owner}
              options={team.map((t) => ({ value: t.id, label: t.name }))}
              onChange={(v) => patch({ owner: v ?? "" })}
            />
            <FilterSelect
              label="Designer"
              value={filters.designer}
              options={team.map((t) => ({ value: t.id, label: t.name }))}
              onChange={(v) => patch({ designer: v ?? "" })}
            />
            <FilterSelect
              label="Vendedor"
              value={filters.seller}
              options={sellers}
              onChange={(v) => patch({ seller: v ?? "" })}
            />
            <FilterSelect
              label="Produto"
              value={filters.product}
              options={PRODUCT_OPTIONS}
              onChange={(v) => patch({ product: v ?? "" })}
            />
            <FilterSelect
              label="Prioridade"
              value={filters.priority}
              options={[
                { value: "normal", label: "Normal" },
                { value: "high", label: "Prioridade" },
                { value: "urgent", label: "Urgente" },
              ]}
              onChange={(v) => patch({ priority: v ?? "" })}
            />
            <FilterSelect
              label="Status"
              value={filters.stage}
              options={STAGES.filter((s) => showFinished || s.id !== "completed").map((s) => ({
                value: s.id,
                label: s.label,
              }))}
              onChange={(v) => patch({ stage: v ?? "" })}
            />
            <FilterSelect
              label="Prazo"
              value={filters.deadline}
              options={[
                { value: "late", label: "Atrasados" },
                { value: "today", label: "Hoje" },
                { value: "week", label: "Próximos 7 dias" },
              ]}
              onChange={(v) => patch({ deadline: v ?? "" })}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Label htmlFor="sold-from" className="text-xs">
                Venda de
              </Label>
              <Input
                className="w-[150px]"
                type="date"
                id="sold-from"
                value={filters.from}
                onChange={(e) => patch({ from: e.target.value })}
              />
              <Label htmlFor="sold-to" className="text-xs">
                até
              </Label>
              <Input
                className="w-[150px]"
                type="date"
                id="sold-to"
                value={filters.to}
                min={filters.from}
                onChange={(e) => patch({ to: e.target.value })}
              />
            </div>
          </div>
        ) : null}
        {chips.length ? (
          <div className="flex flex-wrap items-center gap-2 border-t pt-3">
            <span className="text-xs text-muted-foreground">
              {chips.length} filtro{chips.length > 1 ? "s" : ""} ativo
              {chips.length > 1 ? "s" : ""}
            </span>
            {chips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex max-w-[240px] items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1 text-xs"
              >
                <span className="truncate">{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.clear}
                  aria-label={`Remover filtro ${chip.label}`}
                  className="transition-ui rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setFilters({ ...EMPTY_FILTERS })}>
              Limpar filtros
            </Button>
          </div>
        ) : null}
      </div>
      {query.isError ? (
        <div role="alert" className="mt-4 rounded border border-danger/30 bg-danger/5 p-4 text-sm">
          Não foi possível carregar os pedidos. {query.error.message}
          <Button className="ml-2" size="sm" variant="outline" onClick={() => void query.refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : null}
      {query.isPending ? (
        <div role="status" className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Carregando pedidos ativos…
        </div>
      ) : (
        <>
          {!query.isError &&
          filters.quick === "mine" &&
          currentMember.role === "designer" &&
          filtered.length === 0 ? (
            <div
              role="status"
              className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm"
            >
              <p className="font-medium">Nenhum pedido de Design ou aprovação nesta visão.</p>
              <p className="mt-1 text-muted-foreground">
                Confira os filtros. Produção ou Administração pode atribuir um pedido a você pelo
                Kanban.
              </p>
            </div>
          ) : null}
          <p className="mt-4 text-xs text-muted-foreground">
            {filtered.length} pedidos nesta visão · ordenados por atraso, urgência, prazo próximo e
            tempo na etapa. <span className="sm:hidden">Deslize para ver as etapas.</span>
          </p>
          <div
            className="mt-3 flex snap-x gap-3 overflow-x-auto pb-5"
            aria-label="Etapas dos pedidos"
          >
            {STAGES.filter((s) => showFinished || s.id !== "completed").map((stage) => {
              const cards = filtered.filter((o) => o.stage === stage.id);
              const possible =
                !!dragged &&
                !!orders.find(
                  (o) =>
                    o.id === dragged &&
                    allowedDestinations(o, currentMember.role, currentMember.id).includes(stage.id),
                );
              return (
                <section
                  key={stage.id}
                  aria-label={`${stage.label}, ${cards.length} pedidos`}
                  onDragOver={(event) => {
                    if (possible) {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setOver(stage.id);
                    }
                  }}
                  onDragLeave={() => setOver(null)}
                  onDrop={(event) => drop(event, stage.id)}
                  className={cn(
                    "flex max-h-[calc(100vh-330px)] w-[300px] max-w-[85vw] shrink-0 snap-start flex-col rounded-lg border border-border bg-secondary/35",
                    over === stage.id && possible && "border-primary bg-primary/5",
                  )}
                >
                  <div className="sticky top-0 z-10 rounded-t-lg border-b border-border bg-secondary/80 px-3 py-2 backdrop-blur">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-xs font-semibold uppercase tracking-wide">
                        {stage.label}
                      </h2>
                      <span className="rounded bg-background px-2 py-0.5 text-xs tabular-nums">
                        {cards.length}
                      </span>
                    </div>
                    {cards.length >= 10 && cards.length === largest && stage.id !== "completed" ? (
                      <p className="mt-1 text-[11px] text-warning">
                        Maior fila · gargalo potencial
                      </p>
                    ) : null}
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                    <KanbanColumn
                      cards={cards}
                      busyId={busyId}
                      printerName={(id) => printers.find((p) => p.id === id)?.name}
                      canDrag={(o) =>
                        !busyId &&
                        allowedDestinations(o, currentMember.role, currentMember.id).length > 0
                      }
                      onOpen={(o) => setSelectedId(o.id)}
                      onDragStart={(e, o) => {
                        e.dataTransfer.setData("application/x-gaeva-order", o.id);
                        e.dataTransfer.setData("text/plain", o.id);
                        e.dataTransfer.effectAllowed = "move";
                        setDragged(o.id);
                      }}
                      onDragEnd={() => {
                        setDragged(null);
                        setOver(null);
                      }}
                    />
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
      <OrderDrawer
        order={selected}
        onClose={() => setSelectedId(null)}
        onRequest={setRequest}
        onMove={move}
        onRun={run}
        busy={!!busyId}
      />
      <OrderActionDialog
        key={request ? `${request.order.id}-${request.action}-${request.title}` : "closed"}
        request={request}
        onClose={() => setRequest(null)}
        onRun={run}
        busy={!!busyId}
      />
    </AppShell>
  );
}

function KanbanColumn({
  cards,
  busyId,
  canDrag,
  printerName,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  cards: OperationalOrder[];
  busyId: string | null;
  canDrag: (o: OperationalOrder) => boolean;
  printerName: (id: string | null) => string | undefined;
  onOpen: (o: OperationalOrder) => void;
  onDragStart: (e: DragEvent, o: OperationalOrder) => void;
  onDragEnd: () => void;
}) {
  const [limit, setLimit] = useState(30);
  if (!cards.length)
    return (
      <p className="rounded border border-dashed border-border py-10 text-center text-xs text-muted-foreground">
        Nenhum pedido
      </p>
    );
  return (
    <div className="space-y-2">
      {cards.slice(0, limit).map((order) => (
        <KanbanCard
          key={order.id}
          order={order}
          busy={busyId === order.id}
          draggable={canDrag(order)}
          printerName={printerName(order.initial_printer_id)}
          onOpen={() => onOpen(order)}
          onDragStart={(e) => onDragStart(e, order)}
          onDragEnd={onDragEnd}
        />
      ))}
      {cards.length > limit ? (
        <Button
          className="w-full"
          size="sm"
          variant="ghost"
          onClick={() => setLimit((n) => n + 30)}
        >
          Mostrar mais {Math.min(30, cards.length - limit)}
        </Button>
      ) : null}
    </div>
  );
}
function KanbanCard({
  order,
  busy,
  draggable,
  printerName,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  order: OperationalOrder;
  busy: boolean;
  draggable: boolean;
  printerName?: string | undefined;
  onOpen: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: () => void;
}) {
  const late = isOverdue(order);
  const due = daysToDeadline(order);
  const urgent = ["urgent", "critical"].includes(order.priority);
  const risk =
    order.status === "completed"
      ? "Finalizado"
      : late
        ? `${Math.abs(due)}d atrasado`
        : due === 0
          ? "Prazo hoje"
          : due <= 3
            ? "Prazo próximo"
            : "Dentro do prazo";
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      aria-label={`${order.code}, ${order.customer_name}, ${risk}. Abrir pedido`}
      aria-busy={busy}
      className={cn(
        "w-full rounded-md border border-border bg-card p-3 text-left shadow-sm transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        late && "border-danger/35",
        draggable && "cursor-grab active:cursor-grabbing",
        busy && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted-foreground">{order.code}</span>
        {busy ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : urgent ? (
          <span className="rounded bg-danger/10 px-1.5 py-0.5 text-[10px] font-semibold text-danger">
            URGENTE
          </span>
        ) : order.priority === "high" ? (
          <span className="text-[10px] font-medium text-warning">PRIORIDADE</span>
        ) : null}
      </div>
      <p className="mt-1 truncate text-sm font-semibold">{order.customer_name}</p>
      <div className="mt-2 flex gap-2">
        <OrderThumbnail order={order} />
        <div className="min-w-0">
          <p className="truncate text-xs">
            {PRODUCT_OPTIONS.find((p) => p.value === order.category)?.label ?? order.project_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {order.quantity} {order.quantity === 1 ? "unidade" : "unidades"}
          </p>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-xs">
        <div className="flex justify-between gap-1">
          <span>Prazo: {formatDate(order.promised_at)}</span>
          <span
            className={cn(
              "text-[10px]",
              late
                ? "text-danger"
                : due <= 3 && order.status !== "completed"
                  ? "text-warning"
                  : "text-success",
            )}
          >
            {risk}
          </span>
        </div>
        <p
          className="truncate text-muted-foreground"
          title={`Responsável: ${order.owner_name ?? "a definir"}`}
        >
          Responsável: {order.owner_name ?? "a definir"}
        </p>
        {order.stage === "design" || order.stage === "approval" || order.designer_name ? (
          <p
            className="truncate text-muted-foreground"
            title={`Designer: ${order.designer_name ?? "aguardando atribuição"}`}
          >
            Designer: {order.designer_name ?? "aguardando atribuição"}
          </p>
        ) : null}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            {elapsed(order.stage_entered_at)} nesta etapa
          </span>
          {order.revision_count > 0 ? (
            <span className="rounded border px-1 text-[10px]">Revisão {order.revision_count}</span>
          ) : null}
        </div>
      </div>
      {order.stage === "printing" || order.stage === "ready" ? (
        <p className="mt-1 truncate text-xs text-muted-foreground">
          Impressora: {printerName ?? "a definir"}
        </p>
      ) : null}
      {order.shipped_at ? (
        <p className="truncate text-xs text-muted-foreground">
          Postado em {formatDate(order.shipped_at)}
        </p>
      ) : null}
      <p
        className={cn(
          "mt-2 truncate border-t border-border pt-2 text-[11px] text-muted-foreground",
          order.block_reason && "text-warning",
        )}
      >
        {substatus(order)}
      </p>
      <p
        className="mt-1 text-[10px] text-muted-foreground tabular-nums"
        title={`Venda ${formatDate(order.created_at)} · ${order.seller_name ?? "vendedor não registrado"} · ${elapsed(order.created_at)} desde a criação`}
      >
        {formatCurrency(order.total_value)} ·{" "}
        <span className={cn(PENDING_PAYMENT.includes(order.payment_status) && "text-warning")}>
          {PAYMENT_LABELS[order.payment_status] ?? order.payment_status}
        </span>
      </p>
    </button>
  );
}
function OrderThumbnail({ order }: { order: OperationalOrder }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [order.thumbnail_path]);
  const image = useQuery({
    queryKey: ["orders", "thumbnail", order.id, order.thumbnail_path],
    enabled: visible && !!order.thumbnail_path && !!order.thumbnail_bucket,
    staleTime: 3000000,
    queryFn: async () => {
      const result = await requireSupabase()
        .storage.from(order.thumbnail_bucket!)
        .createSignedUrl(order.thumbnail_path!, 3600);
      if (result.error) throw result.error;
      return result.data.signedUrl;
    },
  });
  if (!order.thumbnail_path) return null;
  return (
    <div ref={ref} className="size-10 shrink-0 overflow-hidden rounded border bg-secondary/50">
      {image.data ? (
        <img src={image.data} alt="" loading="lazy" className="size-full object-cover" />
      ) : (
        <Columns3 className="m-2 size-5 text-muted-foreground/40" aria-hidden />
      )}
    </div>
  );
}
