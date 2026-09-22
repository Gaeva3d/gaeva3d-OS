import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  AlertTriangle,
  CalendarClock,
  CircleDollarSign,
  Info,
  LockKeyhole,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { AppShell } from "@/components/gaeva/app-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  COMMERCIAL_ACTIONS_FIXTURE,
  COMMERCIAL_ACTION_EXAMPLES,
  COMMERCIAL_OPERATION_LABELS,
  COMMERCIAL_PHASE_LABELS,
  formatPreviewDate,
  formatPreviewPeriod,
  type CommercialOperation,
} from "@/lib/gaeva/commercial-preview";
import { formatCurrency, formatDate } from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";

export const Route = createFileRoute("/comercial/acoes/$id")({
  head: () => ({
    meta: [
      { title: "Detalhe da ação comercial — GAEVA OS" },
      { name: "description", content: "Prévia visual do placar de uma ação comercial." },
      { property: "og:title", content: "Detalhe da ação comercial — GAEVA OS" },
      { property: "og:description", content: "Prévia visual do placar comercial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CommercialActionDetailPage,
});

type DetailState = "example" | "empty" | "loading" | "error";
type OperationFilter = CommercialOperation | "all";

const chartConfig = {
  cumulative: { label: "Realizado acumulado", color: "var(--color-primary)" },
  goalCumulative: { label: "Meta acumulada", color: "var(--color-warning)" },
  gaeva: { label: "GAEVA", color: "var(--color-primary)" },
  dry: { label: "Dry Maia — Nova Operação", color: "var(--color-warning)" },
  value: { label: "Valor", color: "var(--color-primary)" },
} satisfies ChartConfig;

const currencyAxis = (value: number) => `${Math.round(value / 100_000)}k`;
const currencyTooltip = (value: unknown) =>
  typeof value === "number" ? formatCurrency(value / 100) : "—";
const CHART_LABELS: Record<string, string> = {
  cumulative: "Realizado acumulado",
  goalCumulative: "Meta acumulada",
  gaeva: "GAEVA",
  dry: "Dry Maia — Nova Operação",
  value: "Valor",
};

function CurrencyTooltipValue(value: unknown, name: string | number) {
  const labelKey = String(name);
  return (
    <div className="flex min-w-52 items-center justify-between gap-4">
      <span className="text-muted-foreground">{CHART_LABELS[labelKey] ?? labelKey}</span>
      <span className="font-medium tabular-nums text-foreground">{currencyTooltip(value)}</span>
    </div>
  );
}

function CommercialActionDetailPage() {
  const { id } = Route.useParams();
  const { currentMember } = useGaeva();
  const hasAccess = currentMember.role === "admin" || currentMember.role === "comercial";
  const action = COMMERCIAL_ACTIONS_FIXTURE.find((item) => item.id === id);
  const example = action ? COMMERCIAL_ACTION_EXAMPLES[action.id] : undefined;
  const daily = useMemo(() => example?.daily ?? [], [example]);
  const ranking = useMemo(() => example?.ranking ?? [], [example]);
  const [state, setState] = useState<DetailState>("example");
  const [operation, setOperation] = useState<OperationFilter>("all");
  const [search, setSearch] = useState("");

  const filteredSales = useMemo(
    () =>
      (example?.sales ?? []).filter(
        (sale) =>
          (operation === "all" || sale.operation === operation) &&
          `${sale.customerName} ${sale.agentName}`
            .toLocaleLowerCase("pt-BR")
            .includes(search.toLocaleLowerCase("pt-BR")),
      ),
    [example, operation, search],
  );
  const isOverall = operation === "all";
  const chartDaily = useMemo(() => {
    if (operation === "all") return daily;
    let cumulative = 0;
    return daily.map((point) => {
      const amount = operation === "gaeva" ? point.gaeva : point.dry;
      if (amount !== null) cumulative += amount;
      return {
        ...point,
        gaeva: operation === "gaeva" ? point.gaeva : null,
        dry: operation === "dry_maia_nova_operacao" ? point.dry : null,
        realized: amount,
        cumulative: amount === null ? null : cumulative,
      };
    });
  }, [daily, operation]);
  const rankingData = useMemo(
    () =>
      ranking
        .map((agent) => {
          if (operation === "all") return agent;
          return operation === "gaeva"
            ? { ...agent, value: agent.gaevaValue, count: agent.gaevaCount }
            : { ...agent, value: agent.dryValue, count: agent.dryCount };
        })
        .filter((agent) => agent.count > 0),
    [operation, ranking],
  );
  const realized = isOverall
    ? ([...daily].reverse().find((point) => point.cumulative !== null)?.cumulative ?? 0)
    : daily.reduce(
        (sum, point) => sum + (operation === "gaeva" ? (point.gaeva ?? 0) : (point.dry ?? 0)),
        0,
      );
  const goal = action?.goalCents ?? 3_000_000;
  const progress = realized / goal;
  const count = rankingData.reduce((sum, agent) => sum + agent.count, 0);
  const allOperationData = example
    ? [
        { name: "GAEVA", value: daily.reduce((sum, point) => sum + (point.gaeva ?? 0), 0) },
        {
          name: "Dry Maia — Nova Operação",
          value: daily.reduce((sum, point) => sum + (point.dry ?? 0), 0),
        },
      ]
    : [];
  const operationData =
    operation === "all"
      ? allOperationData
      : allOperationData.filter((item) =>
          operation === "gaeva" ? item.name === "GAEVA" : item.name !== "GAEVA",
        );
  const totalDays = action
    ? Math.round(
        (new Date(`${action.endDate}T12:00:00Z`).getTime() -
          new Date(`${action.startDate}T12:00:00Z`).getTime()) /
          86_400_000,
      ) + 1
    : 0;
  const elapsedDays =
    action && example
      ? Math.round(
          (new Date(`${example.simulatedDate}T12:00:00Z`).getTime() -
            new Date(`${action.startDate}T12:00:00Z`).getTime()) /
            86_400_000,
        ) + 1
      : 0;
  const remainingDays = Math.max(totalDays - elapsedDays + 1, 0);
  const expectedToDate = totalDays > 0 ? (goal / totalDays) * elapsedDays : 0;

  if (!hasAccess) {
    return (
      <AppShell title="Ações comerciais" description="Prévia visual — integração com CRM pendente">
        <Alert>
          <LockKeyhole className="size-4" />
          <AlertTitle>Sem acesso</AlertTitle>
          <AlertDescription>
            Nenhum dado desta área está disponível para o seu perfil.
          </AlertDescription>
        </Alert>
      </AppShell>
    );
  }

  if (!action && !id.startsWith("preview-")) {
    return (
      <AppShell
        title="Ação não encontrada"
        description="Prévia visual — integração com CRM pendente"
      >
        <Card>
          <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="size-7 text-warning" />
            <p className="font-semibold">Ação não encontrada</p>
            <Button asChild variant="outline">
              <Link to="/comercial/acoes">Voltar às ações</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  if (!action) {
    return (
      <AppShell title="Ação indisponível" description="Prévia visual — integração com CRM pendente">
        <Card>
          <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="size-7 text-warning" />
            <p className="font-semibold">Este rascunho existia apenas na tela anterior</p>
            <Button asChild variant="outline">
              <Link to="/comercial/acoes">Voltar às ações</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title={action.name} description="Prévia visual — integração com CRM pendente">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/comercial/acoes" aria-label="Voltar às ações comerciais">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Comercial / Ações comerciais</p>
            <p className="truncate text-sm font-medium">
              {formatPreviewPeriod(action.startDate, action.endDate)}
            </p>
          </div>
          <Badge variant="outline">{COMMERCIAL_PHASE_LABELS[action.phase]}</Badge>
        </div>
        <Select value={state} onValueChange={(value) => setState(value as DetailState)}>
          <SelectTrigger className="w-52" aria-label="Revisar estado do detalhe">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="example">Exemplo demonstrativo</SelectItem>
            <SelectItem value="empty">Estado vazio</SelectItem>
            <SelectItem value="loading">Estado carregando</SelectItem>
            <SelectItem value="error">Estado de erro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Alert className="mb-5 border-primary/20 bg-primary/5">
        <Info className="size-4 text-primary" />
        <AlertTitle>Modo demonstração</AlertTitle>
        <AlertDescription>
          Dados de exemplo. Esta prévia não salva alterações nem usa vendas reais.
        </AlertDescription>
      </Alert>

      {state === "loading" ? (
        <DetailSkeleton />
      ) : state === "error" ? (
        <Card>
          <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="size-7 text-danger" />
            <div>
              <p className="font-semibold">Não foi possível carregar o placar</p>
              <p className="text-sm text-muted-foreground">
                Estado visual de falha da futura integração.
              </p>
            </div>
            <Button variant="outline" onClick={() => setState("example")}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : state === "empty" || !example ? (
        <Card>
          <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <CircleDollarSign className="size-7 text-muted-foreground" />
            <div>
              <p className="font-semibold">Ainda não há vendas elegíveis</p>
              <p className="text-sm text-muted-foreground">
                Use o exemplo demonstrativo para revisar gráficos e métricas.
              </p>
            </div>
            {!example ? (
              <Button asChild variant="outline">
                <Link to="/comercial/acoes/$id" params={{ id: "acao-15-dias" }}>
                  Ver exemplo demonstrativo
                </Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setState("example")}>
                Ver exemplo demonstrativo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <section
            className="overflow-hidden rounded-xl bg-sidebar text-sidebar-foreground shadow-sm"
            aria-label="Placar da ação"
          >
            <div className="border-b border-sidebar-border px-5 py-3 text-xs font-medium text-sidebar-foreground/70">
              Simulação em {formatPreviewDate(example.simulatedDate)}
            </div>
            <div className="grid divide-y divide-sidebar-border lg:grid-cols-4 lg:divide-x lg:divide-y-0">
              <Score
                label={isOverall ? "Realizado" : "Realizado no recorte"}
                value={formatCurrency(realized / 100)}
                detail={
                  isOverall
                    ? `${Math.round(progress * 100)}% da meta`
                    : "Sem meta para este recorte"
                }
              />
              <Score
                label="Meta"
                value={isOverall ? formatCurrency(goal / 100) : "—"}
                detail={isOverall ? "Objetivo conjunto" : "Disponível na visão geral"}
              />
              <Score
                label={realized >= goal ? "Excedente" : "Faltante"}
                value={isOverall ? formatCurrency(Math.abs(goal - realized) / 100) : "—"}
                detail={
                  isOverall
                    ? realized >= goal
                      ? "Acima da meta"
                      : "Para atingir a meta"
                    : "Sem comparação global"
                }
              />
              <Score
                label="Ritmo necessário"
                value={
                  isOverall && remainingDays > 0
                    ? formatCurrency(Math.max(goal - realized, 0) / remainingDays / 100)
                    : "—"
                }
                detail={isOverall ? "Por dia restante" : "Sem meta no recorte"}
              />
            </div>
            {isOverall ? (
              <div className="px-5 pb-5">
                <Progress
                  value={Math.min(progress * 100, 100)}
                  className="h-2 bg-sidebar-accent [&>div]:bg-primary"
                />
              </div>
            ) : null}
            <div className="grid gap-px bg-sidebar-border sm:grid-cols-3 lg:grid-cols-5">
              <ContextMetric label="Dias restantes" value={`${remainingDays}`} />
              <ContextMetric
                label="Meta diária"
                value={isOverall && totalDays > 0 ? formatCurrency(goal / totalDays / 100) : "—"}
              />
              <ContextMetric
                label="Esperado até hoje"
                value={isOverall ? formatCurrency(expectedToDate / 100) : "—"}
              />
              <ContextMetric label="Ticket médio" value={formatCurrency(realized / count / 100)} />
              <ContextMetric label="Quantidade" value={`${count} vendas`} />
            </div>
          </section>

          <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Recorte do placar</p>
              <p className="text-xs text-muted-foreground">
                A meta conjunta aparece apenas na visão geral.
              </p>
            </div>
            <Select
              value={operation}
              onValueChange={(value) => setOperation(value as OperationFilter)}
            >
              <SelectTrigger className="w-full sm:w-64" aria-label="Filtrar operação">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as operações</SelectItem>
                <SelectItem value="gaeva">GAEVA</SelectItem>
                <SelectItem value="dry_maia_nova_operacao">Dry Maia — Nova Operação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 xl:grid-cols-12">
            <ChartCard
              title={isOverall ? "Acumulado vs. meta" : "Realizado acumulado no recorte"}
              description={isOverall ? "Evolução do período" : "Sem comparação com a meta conjunta"}
              className="xl:col-span-8"
            >
              <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[560px]">
                <ComposedChart data={chartDaily} margin={{ left: 4, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    tickFormatter={currencyAxis}
                    tickLine={false}
                    axisLine={false}
                    width={42}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={CurrencyTooltipValue} />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="var(--color-cumulative)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  {isOverall ? (
                    <Line
                      type="monotone"
                      dataKey="goalCumulative"
                      stroke="var(--color-goalCumulative)"
                      strokeDasharray="6 4"
                      strokeWidth={2}
                      dot={false}
                    />
                  ) : null}
                </ComposedChart>
              </ChartContainer>
            </ChartCard>
            <ChartCard
              title="Operações"
              description={isOverall ? "Valor no período" : "Operação selecionada"}
              className="xl:col-span-4"
            >
              <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[360px]">
                <BarChart data={operationData} layout="vertical" margin={{ left: 12, right: 24 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={currencyAxis}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={74}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={CurrencyTooltipValue} />}
                  />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </ChartCard>
            <ChartCard
              title="Vendas por dia"
              description="Colunas empilhadas por operação"
              className="xl:col-span-8"
            >
              <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[560px]">
                <BarChart data={chartDaily} margin={{ left: 4, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={currencyAxis}
                    axisLine={false}
                    tickLine={false}
                    width={42}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={CurrencyTooltipValue} />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  {operation !== "dry_maia_nova_operacao" ? (
                    <Bar
                      dataKey="gaeva"
                      stackId="sales"
                      fill="var(--color-gaeva)"
                      radius={operation === "gaeva" ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ) : null}
                  {operation !== "gaeva" ? (
                    <Bar
                      dataKey="dry"
                      stackId="sales"
                      fill="var(--color-dry)"
                      radius={[4, 4, 0, 0]}
                    />
                  ) : null}
                </BarChart>
              </ChartContainer>
            </ChartCard>
            <ChartCard
              title="Ranking comercial"
              description={
                isOverall ? "Valor e quantidade — visão geral" : "Valor e quantidade no recorte"
              }
              className="xl:col-span-4"
            >
              <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[360px]">
                <BarChart data={rankingData} layout="vertical" margin={{ left: 20, right: 24 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={currencyAxis}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={88}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent formatter={CurrencyTooltipValue} />}
                  />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </ChartCard>
          </div>

          <Card className="mt-4 overflow-hidden">
            <CardHeader className="gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">Vendas demonstrativas</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Somente para revisão visual. Não é possível lançar vendas nesta etapa.
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                  placeholder="Buscar cliente ou responsável"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-sm">
                  <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Data</th>
                      <th className="px-4 py-3 font-medium">Operação</th>
                      <th className="px-4 py-3 font-medium">Responsável</th>
                      <th className="px-4 py-3 font-medium">Cliente</th>
                      <th className="px-4 py-3 text-right font-medium">Valor</th>
                      <th className="px-4 py-3 font-medium">Confirmação</th>
                      <th className="px-4 py-3 font-medium">Origem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale) => (
                      <tr key={sale.id} className="border-t border-border">
                        <td className="px-4 py-3">{formatDate(sale.date)}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="secondary"
                            className={sale.operation === "gaeva" ? "text-primary" : "text-warning"}
                          >
                            {COMMERCIAL_OPERATION_LABELS[sale.operation]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{sale.agentName}</td>
                        <td className="px-4 py-3">{sale.customerName}</td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">
                          {formatCurrency(sale.amountCents / 100)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="border-success/20 bg-success/5 text-success"
                          >
                            Confirmada
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{sale.originLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </AppShell>
  );
}

function Score({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="p-5">
      <p className="text-xs font-medium text-sidebar-foreground/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-sidebar-foreground/55">{detail}</p>
    </div>
  );
}
function ContextMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-sidebar px-5 py-3">
      <p className="text-[11px] text-sidebar-foreground/50">{label}</p>
      <p className="mt-1 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}
function ChartCard({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="overflow-x-auto p-4 pt-2">{children}</CardContent>
    </Card>
  );
}
function DetailSkeleton() {
  return (
    <div className="space-y-4" aria-label="Carregando placar">
      <Skeleton className="h-64 w-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  );
}
