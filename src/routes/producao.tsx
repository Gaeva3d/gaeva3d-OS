import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, X } from "lucide-react";
import { useState, type DragEvent } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/gaeva/app-shell";
import { PriorityBadge, RiskBadge, StatusBadge } from "@/components/gaeva/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  daysUntil,
  deadlineRisk,
  formatDate,
  isLate,
  isUrgent,
  needsPrinter,
} from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";
import {
  PRODUCTION_STAGES,
  PRODUCT_LABELS,
  STATUS_LABELS,
  type Order,
  type OrderStatus,
} from "@/lib/gaeva/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/producao")({
  head: () => ({
    meta: [
      { title: "Produção — GAEVA OS" },
      {
        name: "description",
        content: "Quadro operacional da produção: etapas, responsáveis e impressoras.",
      },
      { property: "og:title", content: "Produção — GAEVA OS" },
      { property: "og:description", content: "Quadro operacional da produção GAEVA." },
    ],
  }),
  component: ProductionBoard,
});

type ListKey =
  "hoje" | "urgentes" | "atrasados" | "sem_responsavel" | "sem_impressora" | "bloqueados";

const LIST_LABELS: Record<ListKey, string> = {
  hoje: "Hoje",
  urgentes: "Urgentes",
  atrasados: "Atrasados",
  sem_responsavel: "Sem responsável",
  sem_impressora: "Sem impressora",
  bloqueados: "Bloqueados",
};

function ProductionBoard() {
  const {
    orders,
    customers,
    team,
    printers,
    changeStatus,
    updateOrder,
    upsertJob,
    addProductionEvent,
    can,
  } = useGaeva();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [list, setList] = useState<ListKey>("hoje");
  const [pointing, setPointing] = useState({
    real_hours: "",
    real_material: "",
    failed: false,
    failure_reason: "",
    reprint: false,
    notes: "",
  });

  const editable = can("manage_production");
  const open = orders.filter((o) => o.status !== "cancelado");
  const selected = orders.find((o) => o.id === selectedId);
  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? "—";

  const lists: Record<ListKey, Order[]> = {
    hoje: open.filter((o) => (daysUntil(o.due_date) ?? 99) <= 1 && o.status !== "concluido"),
    urgentes: open.filter(isUrgent),
    atrasados: open.filter(isLate),
    sem_responsavel: open.filter((o) => !o.owner_id && o.status !== "concluido"),
    sem_impressora: open.filter(needsPrinter),
    bloqueados: open.filter((o) => o.status === "bloqueado"),
  };

  const onDrop = async (event: DragEvent<HTMLDivElement>, stage: OrderStatus) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (!id) return;
    if (!editable) {
      toast.error("Seu papel atual não permite mover pedidos.");
      return;
    }
    const res = await changeStatus(id, stage);
    if (res.ok) toast.success(`Movido para ${STATUS_LABELS[stage]}.`);
    else toast.error(res.error ?? "Movimento não permitido.");
  };

  return (
    <AppShell title="Produção" description="Impressão, acabamento e postagem dos pedidos">
      <p className="mb-4 text-sm text-muted-foreground">
        Para acompanhar a entrada, o Design e a aprovação, abra o{" "}
        <Link
          to="/pedidos/kanban"
          className="font-medium text-primary underline underline-offset-4"
        >
          Kanban de pedidos
        </Link>
        .
      </p>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(LIST_LABELS) as ListKey[]).map((key) => (
          <Button
            key={key}
            size="sm"
            variant={list === key ? "default" : "outline"}
            onClick={() => setList(key)}
          >
            {LIST_LABELS[key]}
            <span className="ml-1 tabular-nums opacity-70">{lists[key].length}</span>
          </Button>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">{LIST_LABELS[list]}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {lists[list].length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">Nenhum pedido nesta lista.</p>
          ) : (
            lists[list].map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedId(o.id)}
                className="rounded-md border border-border bg-surface p-3 text-left transition-colors hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{o.code}</span>
                  <RiskBadge risk={deadlineRisk(o)} />
                </div>
                <p className="mt-1 truncate text-sm font-medium">{o.project_name}</p>
                <p className="text-xs text-muted-foreground">{customerName(o.customer_id)}</p>
              </button>
            ))
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-4">
        {PRODUCTION_STAGES.map((stage) => {
          const items = open.filter((o) => o.status === stage);
          return (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, stage)}
              className="w-72 shrink-0 rounded-lg border border-border bg-secondary/40 p-2"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <StatusBadge status={stage} />
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((o) => (
                  <div
                    key={o.id}
                    draggable={editable}
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", o.id)}
                    onClick={() => setSelectedId(o.id)}
                    className={cn(
                      "cursor-pointer rounded-md border border-border bg-card p-3 text-sm transition-colors hover:border-primary/50",
                      isLate(o) && "border-danger/40",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{o.code}</span>
                      <PriorityBadge priority={o.priority} />
                    </div>
                    <div className="mt-2 flex gap-2">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded bg-secondary">
                        <Boxes className="size-4 text-muted-foreground" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{o.project_name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {customerName(o.customer_id)} · {PRODUCT_LABELS[o.product]} · {o.quantity}{" "}
                          un
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span>{formatDate(o.due_date)}</span>
                      <RiskBadge risk={deadlineRisk(o)} />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {team.find((t) => t.id === o.owner_id)?.name ?? "Sem responsável"} ·{" "}
                      {printers.find((p) => p.id === o.printer_id)?.name ?? "Sem impressora"}
                    </p>
                  </div>
                ))}
                {items.length === 0 ? (
                  <p className="px-1 py-4 text-xs text-muted-foreground">Vazio</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {selected ? (
        <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-md overflow-y-auto border-l border-border bg-surface p-5 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-muted-foreground">{selected.code}</p>
              <h2 className="text-lg font-semibold">{selected.project_name}</h2>
              <p className="text-sm text-muted-foreground">{customerName(selected.customer_id)}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Fechar painel"
              onClick={() => setSelectedId(null)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={selected.status} />
              <PriorityBadge priority={selected.priority} />
              <RiskBadge risk={deadlineRisk(selected)} />
            </div>

            <div className="space-y-1.5">
              <Label>Etapa</Label>
              <Select
                value={selected.status}
                onValueChange={async (v) => {
                  const res = await changeStatus(selected.id, v as OrderStatus);
                  if (res.ok) toast.success("Etapa atualizada.");
                  else toast.error(res.error ?? "Movimento não permitido.");
                }}
                disabled={!editable}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTION_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Responsável</Label>
              <Select
                value={selected.owner_id ?? "none"}
                onValueChange={async (v) => {
                  const result = await updateOrder(selected.id, {
                    owner_id: v === "none" ? null : v,
                  });
                  if (result.ok) toast.success("Responsável atualizado.");
                  else toast.error(result.error ?? "Não foi possível atualizar o responsável.");
                }}
                disabled={!editable}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem responsável</SelectItem>
                  {team.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Impressora</Label>
              <Select
                value={selected.printer_id ?? "none"}
                onValueChange={async (v) => {
                  const result = await updateOrder(selected.id, {
                    printer_id: v === "none" ? null : v,
                  });
                  if (result.ok) toast.success("Impressora atualizada.");
                  else toast.error(result.error ?? "Não foi possível atualizar a impressora.");
                }}
                disabled={!editable}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem impressora</SelectItem>
                  {printers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border border-border p-3">
              <p className="text-sm font-medium">Apontamento</p>
              <div className="mt-2 grid gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="tempo-real">Tempo real (h)</Label>
                  <Input
                    id="tempo-real"
                    type="number"
                    min={0}
                    value={pointing.real_hours}
                    onChange={(e) => setPointing({ ...pointing, real_hours: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="material-real">Material real</Label>
                  <Input
                    id="material-real"
                    value={pointing.real_material}
                    onChange={(e) => setPointing({ ...pointing, real_material: e.target.value })}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={pointing.failed}
                    onCheckedChange={(v) => setPointing({ ...pointing, failed: Boolean(v) })}
                  />
                  Falhou?
                </label>
                {pointing.failed ? (
                  <Input
                    placeholder="Motivo da falha"
                    value={pointing.failure_reason}
                    onChange={(e) => setPointing({ ...pointing, failure_reason: e.target.value })}
                  />
                ) : null}
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={pointing.reprint}
                    onCheckedChange={(v) => setPointing({ ...pointing, reprint: Boolean(v) })}
                  />
                  Reimpressão
                </label>
                <Textarea
                  placeholder="Observação"
                  value={pointing.notes}
                  onChange={(e) => setPointing({ ...pointing, notes: e.target.value })}
                />
                <Button
                  size="sm"
                  disabled={!editable}
                  onClick={async () => {
                    const jobResult = await upsertJob({
                      order_id: selected.id,
                      printer_id: selected.printer_id ?? null,
                      member_id: selected.owner_id ?? null,
                      stage: selected.status,
                      real_hours: pointing.real_hours ? Number(pointing.real_hours) : null,
                      real_material: pointing.real_material || null,
                      failed: pointing.failed,
                      failure_reason: pointing.failure_reason || null,
                      reprint: pointing.reprint,
                      notes: pointing.notes || null,
                      finished_at: new Date().toISOString(),
                    });
                    if (!jobResult.ok) {
                      toast.error(jobResult.error ?? "Não foi possível salvar o apontamento.");
                      return;
                    }
                    const eventResult = await addProductionEvent(
                      selected.id,
                      `Apontamento em ${STATUS_LABELS[selected.status]}${
                        pointing.failed ? ` — falha: ${pointing.failure_reason}` : ""
                      }`,
                    );
                    if (!eventResult.ok) {
                      toast.warning(
                        eventResult.error ?? "Apontamento salvo sem registrar o evento.",
                      );
                    }
                    setPointing({
                      real_hours: "",
                      real_material: "",
                      failed: false,
                      failure_reason: "",
                      reprint: false,
                      notes: "",
                    });
                    toast.success("Apontamento salvo.");
                  }}
                >
                  Salvar apontamento
                </Button>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link to="/pedidos/$id" params={{ id: selected.id }}>
                Abrir pedido completo
              </Link>
            </Button>
          </div>
        </aside>
      ) : null}
    </AppShell>
  );
}
