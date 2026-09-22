import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  Printer as PrinterIcon,
} from "lucide-react";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/gaeva/app-shell";
import { StatPanel, type StatItem } from "@/components/gaeva/stat-panel";
import { PriorityBadge, RiskBadge, StatusBadge } from "@/components/gaeva/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireSupabase } from "@/integrations/supabase/client";
import { mapAudit } from "@/lib/gaeva/supabase-mappers";
import {
  dashboardRange,
  previousDashboardRange,
  operationDate,
  inDateRange,
  describeActivity,
  formatActivityTime,
  type DashboardPeriod,
} from "@/lib/gaeva/dashboard-helpers";
import {
  attentionScore,
  daysUntil,
  deadlineRisk,
  eventAtRisk,
  formatDate,
  isClosed,
  isLate,
  isUrgent,
} from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";
import {
  PRODUCT_LABELS,
  STATUS_LABELS,
  type OrderStatus,
  type AuditLog,
  type Order,
} from "@/lib/gaeva/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral — GAEVA OS" },
      {
        name: "description",
        content: "Cockpit operacional da GAEVA: pedidos, riscos e fila do dia.",
      },
      { property: "og:title", content: "Visão geral — GAEVA OS" },
      { property: "og:description", content: "Cockpit operacional da GAEVA." },
    ],
  }),
  component: Dashboard,
});

const ACTIVE_EXCLUDED: OrderStatus[] = ["concluido", "cancelado"];

function Dashboard() {
  const { orders, customers, team, audit, loading } = useGaeva();
  const [period, setPeriod] = useState<DashboardPeriod>("mes");
  const [anchor, setAnchor] = useState(() => operationDate());
  const range = dashboardRange(period, anchor);
  const periodSearch = { inicio: range.start, fim: range.end };
  const periodOrders = orders.filter((order) =>
    inDateRange(order.created_at, range.start, range.end),
  );

  if (loading) {
    return (
      <AppShell title="Visão geral" description="Carregando operação...">
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </AppShell>
    );
  }

  const active = periodOrders.filter((o) => !ACTIVE_EXCLUDED.includes(o.status));
  const urgent = active.filter(isUrgent);
  const late = active.filter(isLate);
  const waitingApproval = active.filter((o) => o.status === "aguardando_aprovacao");
  const printing = active.filter((o) => o.status === "imprimindo");
  const completed = periodOrders.filter((order) => order.status === "concluido");

  const attention = [...active]
    .filter(
      (o) =>
        isLate(o) || isUrgent(o) || o.status === "bloqueado" || (daysUntil(o.due_date) ?? 99) <= 2,
    )
    .sort((a, b) => attentionScore(a) - attentionScore(b))
    .slice(0, 6);

  const todayQueue = [...active]
    .filter((o) => (daysUntil(o.due_date) ?? 99) <= 3)
    .sort((a, b) => attentionScore(a) - attentionScore(b));

  const stageSummary = (Object.keys(STATUS_LABELS) as OrderStatus[])
    .map((status) => ({ status, count: periodOrders.filter((o) => o.status === status).length }))
    .filter((s) => s.count > 0);

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? "—";
  const memberName = (id?: string | null) =>
    team.find((t) => t.id === id)?.name ?? "Sem responsável";

  const previousRange = previousDashboardRange(period, anchor);
  const previousOrders = orders.filter((order) =>
    inDateRange(order.created_at, previousRange.start, previousRange.end),
  );
  const previousActive = previousOrders.filter((o) => !ACTIVE_EXCLUDED.includes(o.status));

  const cards: StatItem[] = [
    {
      label: "Pedidos ativos",
      value: active.length,
      previous: previousActive.length,
      icon: Layers,
      focus: "ativos",
    },
    {
      label: "Urgentes",
      value: urgent.length,
      previous: previousActive.filter(isUrgent).length,
      icon: AlertTriangle,
      focus: "urgentes",
      inverse: true,
    },
    {
      label: "Atrasados",
      value: late.length,
      previous: previousActive.filter(isLate).length,
      icon: Clock,
      focus: "atrasados",
      inverse: true,
    },
    {
      label: "Aguardando aprovação",
      value: waitingApproval.length,
      previous: previousActive.filter((o) => o.status === "aguardando_aprovacao").length,
      icon: CalendarClock,
      focus: "aprovacao",
      inverse: true,
    },
    {
      label: "Em impressão",
      value: printing.length,
      previous: previousActive.filter((o) => o.status === "imprimindo").length,
      icon: PrinterIcon,
      focus: "imprimindo",
    },
    {
      label: "Concluídos",
      value: completed.length,
      previous: previousOrders.filter((o) => o.status === "concluido").length,
      icon: CheckCircle2,
      focus: "concluidos",
    },
  ];

  return (
    <AppShell
      title="Visão geral"
      description="Cockpit operacional da GAEVA"
      actions={
        <>
          <Button asChild size="sm">
            <Link to="/pedidos/novo">
              <Plus className="size-4" /> Novo pedido
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/producao">Ver fila de produção</Link>
          </Button>
        </>
      }
    >
      <div className="mb-5 flex flex-wrap items-end gap-4">
        <div>
          <span className="mb-2 block text-sm font-medium">Período</span>
          <div className="flex gap-1" role="group" aria-label="Período do painel">
            {(["dia", "mes", "ano"] as const).map((value) => (
              <Button
                key={value}
                size="sm"
                variant={period === value ? "default" : "outline"}
                aria-pressed={period === value}
                onClick={() => setPeriod(value)}
              >
                {{ dia: "Dia", mes: "Mês", ano: "Ano" }[value]}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dashboard-date">{{ dia: "Data", mes: "Mês", ano: "Ano" }[period]}</Label>
          <Input
            key={`${period}-${anchor}`}
            id="dashboard-date"
            className="w-auto"
            type={period === "dia" ? "date" : period === "mes" ? "month" : "number"}
            min={period === "ano" ? 2000 : undefined}
            max={period === "ano" ? 9998 : undefined}
            defaultValue={
              period === "dia"
                ? anchor
                : period === "mes"
                  ? anchor.slice(0, 7)
                  : Number(anchor.slice(0, 4))
            }
            onChange={(event) => {
              const value = event.target.value;
              if (!value) return;
              if (
                period === "ano" &&
                (!/^\d{4}$/.test(value) || Number(value) < 2000 || Number(value) > 9998)
              )
                return;
              setAnchor(
                period === "dia" ? value : period === "mes" ? `${value}-01` : `${value}-01-01`,
              );
            }}
            onBlur={(event) => {
              event.currentTarget.value =
                period === "dia"
                  ? anchor
                  : period === "mes"
                    ? anchor.slice(0, 7)
                    : anchor.slice(0, 4);
            }}
          />
        </div>
        <Button variant="ghost" size="sm" onClick={() => setAnchor(operationDate())}>
          Período atual
        </Button>
        <p className="basis-full text-sm text-muted-foreground">
          Pedidos por data de cadastro, com a situação atual. Atividades por data da alteração.
        </p>
      </div>
      <StatPanel items={cards} search={periodSearch} />

      <div className="mt-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Exigem atenção no período</CardTitle>
            <Link
              to="/pedidos"
              search={{ ...periodSearch, foco: "ativos" }}
              className="text-xs font-medium text-primary hover:underline"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {attention.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhum pedido exige atenção neste período.
              </p>
            ) : (
              attention.map((o) => (
                <Link
                  key={o.id}
                  to="/pedidos/$id"
                  params={{ id: o.id }}
                  className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm transition-colors hover:border-primary/50"
                >
                  <span className="font-mono text-xs text-muted-foreground">{o.code}</span>
                  <span className="min-w-0 flex-1 truncate font-medium">{o.project_name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {customerName(o.customer_id)}
                  </span>
                  <StatusBadge status={o.status} />
                  <PriorityBadge priority={o.priority} />
                  <RiskBadge risk={deadlineRisk(o)} />
                  {eventAtRisk(o) ? (
                    <span className="rounded-md border border-danger/40 bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
                      Evento {formatDate(o.event_date)}
                    </span>
                  ) : null}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Prazos próximos no período</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {todayQueue.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhum pedido cadastrado neste período tem prazo nos próximos três dias ou está
                atrasado.
              </p>
            ) : (
              <table className="w-full min-w-[720px] text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Pedido</th>
                    <th className="py-2 pr-3 font-medium">Produto</th>
                    <th className="py-2 pr-3 font-medium">Etapa</th>
                    <th className="py-2 pr-3 font-medium">Prazo</th>
                    <th className="py-2 pr-3 font-medium">Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {todayQueue.map((o) => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="py-2 pr-3">
                        <Link
                          to="/pedidos/$id"
                          params={{ id: o.id }}
                          className="font-mono text-xs text-primary hover:underline"
                        >
                          {o.code}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {customerName(o.customer_id)}
                        </div>
                      </td>
                      <td className="py-2 pr-3">{PRODUCT_LABELS[o.product]}</td>
                      <td className="py-2 pr-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          {formatDate(o.due_date)}
                          <RiskBadge risk={deadlineRisk(o)} />
                        </div>
                      </td>
                      <td className="py-2 pr-3">{memberName(o.owner_id)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo por etapa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {stageSummary.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem pedidos neste período.</p>
              ) : null}
              {stageSummary.map(({ status, count }) => (
                <Link
                  key={status}
                  to="/pedidos"
                  search={{ status, ...periodSearch }}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-secondary"
                >
                  <span>{STATUS_LABELS[status]}</span>
                  <span className="font-semibold tabular-nums">{count}</span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <RecentActivity
            start={range.start}
            end={range.end}
            orders={orders}
            refreshKey={audit[0]?.id ?? ""}
          />
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        {periodOrders.filter((o) => !isClosed(o)).length} pedidos em aberto no período · base
        oficial sincronizada
      </p>
    </AppShell>
  );
}

function RecentActivity({
  start,
  end,
  orders,
  refreshKey,
}: {
  start: string;
  end: string;
  orders: Order[];
  refreshKey: string;
}) {
  const [entries, setEntries] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    // Query the selected period on the server instead of filtering only the
    // latest 250 entries loaded elsewhere in the app. São Paulo uses UTC-03.
    void (async () => {
      try {
        const response = await requireSupabase()
          .from("audit_logs")
          .select("*, actor:profiles!audit_logs_actor_id_fkey(full_name)")
          .neq("table_name", "printers")
          .gte("created_at", `${start}T00:00:00-03:00`)
          .lt("created_at", `${end}T00:00:00-03:00`)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .limit(6);
        if (response.error) throw response.error;
        if (!cancelled)
          setEntries(response.data.map((row) => mapAudit(row, row.actor?.full_name ?? "Sistema")));
      } catch {
        if (!cancelled) {
          setEntries([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [start, end, refreshKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Atividades recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3" aria-live="polite">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando atividades…</p>
        ) : error ? (
          <p className="text-sm text-danger">
            Não foi possível carregar as atividades. Atualize a página para tentar novamente.
          </p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem atividades neste período.</p>
        ) : (
          entries.map((entry) => {
            const activity = describeActivity(entry, orders);
            const content = (
              <>
                <p className="break-words">
                  <span className="font-medium">{entry.author}</span> {activity.text}.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatActivityTime(entry.created_at)}
                </p>
              </>
            );
            return activity.orderId ? (
              <Link
                key={entry.id}
                to="/pedidos/$id"
                params={{ id: activity.orderId }}
                className="block min-w-0 rounded-md p-2 text-sm hover:bg-secondary"
              >
                {content}
              </Link>
            ) : (
              <div key={entry.id} className="min-w-0 p-2 text-sm">
                {content}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
