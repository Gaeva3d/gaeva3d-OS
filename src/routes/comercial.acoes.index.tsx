import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, BarChart3, CalendarDays, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/gaeva/app-shell";
import { CommercialActionForm } from "@/components/gaeva/commercial-action-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  COMMERCIAL_OPERATION_LABELS,
  COMMERCIAL_PHASE_LABELS,
  commercialActionRealized,
  formatPreviewPeriod,
  type CommercialActionPhase,
  type CommercialActionPreview,
} from "@/lib/gaeva/commercial-preview";
import { formatCurrency, formatDateTime } from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";

export const Route = createFileRoute("/comercial/acoes/")({
  head: () => ({
    meta: [
      { title: "Ações comerciais — GAEVA OS" },
      { name: "description", content: "Prévia visual das ações comerciais do GAEVA OS." },
      { property: "og:title", content: "Ações comerciais — GAEVA OS" },
      { property: "og:description", content: "Prévia visual das ações comerciais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CommercialActionsPage,
});

type PreviewState = "example" | "empty" | "loading" | "error";

const PHASE_BADGE: Record<CommercialActionPhase, string> = {
  rascunho: "border-border bg-muted text-muted-foreground",
  programada: "border-primary/20 bg-primary/5 text-primary",
  em_andamento: "border-success/20 bg-success/5 text-success",
  encerrada: "border-border bg-secondary text-secondary-foreground",
};

function CommercialActionsPage() {
  const { currentMember, can } = useGaeva();
  const hasAccess = currentMember.role === "admin" || currentMember.role === "comercial";
  const canManage = can("manage_commercial");
  const [previewState, setPreviewState] = useState<PreviewState>("example");
  const [search, setSearch] = useState("");
  const [phase, setPhase] = useState<CommercialActionPhase | "all">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [drafts, setDrafts] = useState<CommercialActionPreview[]>([]);
  const actions = useMemo(
    () =>
      [...drafts, ...COMMERCIAL_ACTIONS_FIXTURE].filter(
        (action) =>
          (phase === "all" || action.phase === phase) &&
          action.name.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")),
      ),
    [drafts, phase, search],
  );

  if (!hasAccess) {
    return (
      <AppShell title="Ações comerciais" description="Prévia visual — integração com CRM pendente">
        <Alert className="max-w-2xl">
          <AlertTriangle className="size-4" />
          <AlertTitle>Área restrita</AlertTitle>
          <AlertDescription>
            Esta prévia reutiliza o acesso Comercial e Admin já existente.
          </AlertDescription>
        </Alert>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Ações comerciais"
      description="Prévia visual — integração com CRM pendente"
      actions={
        canManage ? (
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="size-4" /> Nova ação
          </Button>
        ) : undefined
      }
    >
      <Alert className="mb-5 border-primary/20 bg-primary/5">
        <BarChart3 className="size-4 text-primary" />
        <AlertTitle>Modo demonstração</AlertTitle>
        <AlertDescription>
          Os exemplos abaixo são fictícios e não leem nem gravam dados reais. O lançamento de vendas
          ficará indisponível até a integração.
        </AlertDescription>
      </Alert>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
            placeholder="Buscar ação comercial"
            aria-label="Buscar ação comercial"
          />
        </div>
        <Select
          value={phase}
          onValueChange={(value) => setPhase(value as CommercialActionPhase | "all")}
        >
          <SelectTrigger className="w-full sm:w-48" aria-label="Filtrar por situação">
            <SelectValue placeholder="Situação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as situações</SelectItem>
            {(Object.keys(COMMERCIAL_PHASE_LABELS) as CommercialActionPhase[]).map((item) => (
              <SelectItem key={item} value={item}>
                {COMMERCIAL_PHASE_LABELS[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={previewState}
          onValueChange={(value) => setPreviewState(value as PreviewState)}
        >
          <SelectTrigger className="w-full sm:w-52" aria-label="Revisar estado da prévia">
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

      {previewState === "loading" ? (
        <div className="space-y-3" aria-label="Carregando ações comerciais">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : previewState === "error" ? (
        <Card>
          <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="size-7 text-danger" />
            <div>
              <p className="font-semibold">Não foi possível carregar as ações</p>
              <p className="text-sm text-muted-foreground">
                Estado visual para validar a futura falha de integração.
              </p>
            </div>
            <Button variant="outline" onClick={() => setPreviewState("example")}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : previewState === "empty" || actions.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <CalendarDays className="size-7 text-muted-foreground" />
            <div>
              <p className="font-semibold">Nenhuma ação encontrada</p>
              <p className="text-sm text-muted-foreground">
                A integração real ainda não foi ativada.
              </p>
            </div>
            <Button variant="outline" onClick={() => setPreviewState("example")}>
              Ver exemplo demonstrativo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="hidden grid-cols-[minmax(260px,1.5fr)_minmax(190px,1fr)_140px_minmax(180px,1fr)_minmax(200px,1fr)_150px] gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground lg:grid">
            <span>Ação</span>
            <span>Período</span>
            <span>Situação</span>
            <span>Operações</span>
            <span>Meta e realizado</span>
            <span>Atualização</span>
          </div>
          {actions.map((action) => {
            const realized = commercialActionRealized(action.id);
            const progress =
              action.goalCents > 0 ? Math.min((realized / action.goalCents) * 100, 100) : 0;
            return (
              <Link
                key={action.id}
                to="/comercial/acoes/$id"
                params={{ id: action.id }}
                className="grid gap-3 border-b border-border px-4 py-4 transition-colors last:border-0 hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring lg:grid-cols-[minmax(260px,1.5fr)_minmax(190px,1fr)_140px_minmax(180px,1fr)_minmax(200px,1fr)_150px] lg:items-center lg:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{action.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    Responsável: {action.ownerName}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatPreviewPeriod(action.startDate, action.endDate)}
                </span>
                <Badge variant="outline" className={PHASE_BADGE[action.phase]}>
                  {COMMERCIAL_PHASE_LABELS[action.phase]}
                </Badge>
                <div className="flex flex-wrap gap-1.5">
                  {action.operations.map((operation) => (
                    <Badge
                      key={operation}
                      variant="secondary"
                      className={operation === "gaeva" ? "text-primary" : "text-warning"}
                    >
                      {COMMERCIAL_OPERATION_LABELS[operation]}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between gap-2 text-xs">
                    <span>{formatCurrency(realized / 100)}</span>
                    <span className="text-muted-foreground">
                      de {formatCurrency(action.goalCents / 100)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(action.updatedAt)}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <CommercialActionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onCreate={(action) => setDrafts((current) => [action, ...current])}
      />
    </AppShell>
  );
}
