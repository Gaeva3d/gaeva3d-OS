import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarClock, Paperclip, Trash2 } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/gaeva/app-shell";
import { Info, OrderFiles, OrderTimeline } from "@/components/gaeva/order-shared";
import { PaymentBadge, PriorityBadge, RiskBadge, StatusBadge } from "@/components/gaeva/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  daysUntil,
  deadlineRisk,
  eventAtRisk,
  formatBytes,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";
import {
  ORDER_STATUS_FLOW,
  PRIORITY_LABELS,
  PRODUCT_LABELS,
  STATUS_LABELS,
  type FileCategory,
  type OrderStatus,
  type Priority,
} from "@/lib/gaeva/types";

export const Route = createFileRoute("/pedidos/$id")({
  head: () => ({
    meta: [
      { title: "Detalhe do pedido — GAEVA OS" },
      {
        name: "description",
        content: "Resumo, arquivos, produção, aprovação e histórico do pedido.",
      },
      { property: "og:title", content: "Detalhe do pedido — GAEVA OS" },
      { property: "og:description", content: "Acompanhamento completo do pedido GAEVA." },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const {
    orders,
    customers,
    team,
    printers,
    files,
    jobs,
    events,
    audit,
    approvals,
    changeStatus,
    updateOrder,
    addFiles,
    removeFile,
    registerApproval,
    addProductionEvent,
    can,
  } = useGaeva();

  const order = orders.find((o) => o.id === id);
  const [note, setNote] = useState("");
  const [approvalVersion, setApprovalVersion] = useState("v1");
  const [approvalNotes, setApprovalNotes] = useState("");

  if (!order) {
    return (
      <AppShell title="Pedido não encontrado">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-sm text-muted-foreground">Este pedido não existe ou foi removido.</p>
            <Button asChild className="mt-4" size="sm">
              <Link to="/pedidos">
                <ArrowLeft className="size-4" /> Voltar para pedidos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const customer = customers.find((c) => c.id === order.customer_id);
  const owner = team.find((t) => t.id === order.owner_id);
  const printer = printers.find((p) => p.id === order.printer_id);
  const orderFiles = files.filter((f) => f.order_id === order.id);
  const orderJobs = jobs.filter((j) => j.order_id === order.id);
  const orderEvents = events.filter((e) => e.order_id === order.id);
  const orderAudit = audit.filter((a) => a.entity_id === order.id);
  const orderApprovals = approvals.filter((a) => a.order_id === order.id);
  const editable = can("manage_production") || can("manage_commercial");

  const onStatus = async (status: OrderStatus) => {
    let reason: string | null = null;
    if (status === "bloqueado") {
      reason = window.prompt("Motivo do bloqueio:");
      if (!reason) return;
    }
    const res = await changeStatus(order.id, status, reason ? { reason } : undefined);
    if (res.ok) toast.success("Status atualizado.");
    else toast.error(res.error ?? "Erro ao atualizar.");
  };

  const onFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(event.target.files ?? []);
    const res = await addFiles(
      order.id,
      list.map((f) => ({
        file: f,
        name: f.name,
        size: f.size,
        mime_type: f.type || "application/octet-stream",
        category: (f.type.startsWith("image/") ? "referencia" : "documento") as FileCategory,
        url: null,
      })),
    );
    event.target.value = "";
    if (res.ok) toast.success("Arquivos anexados.");
    else toast.error(res.error ?? "Não foi possível anexar os arquivos.");
  };

  return (
    <AppShell
      title={`${order.code} · ${order.project_name}`}
      description={
        customer ? `${customer.name}${customer.company ? ` — ${customer.company}` : ""}` : ""
      }
      actions={
        <Button asChild size="sm" variant="outline">
          <Link to="/pedidos">
            <ArrowLeft className="size-4" /> Pedidos
          </Link>
        </Button>
      }
    >
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 py-4">
          <StatusBadge status={order.status} />
          <PriorityBadge priority={order.priority} />
          <RiskBadge risk={deadlineRisk(order)} />
          <span className="text-sm text-muted-foreground">Prazo: {formatDate(order.due_date)}</span>
          {order.event_date ? (
            <span
              className={
                eventAtRisk(order)
                  ? "flex items-center gap-1 rounded-md border border-danger/40 bg-danger/10 px-2 py-1 text-xs font-medium text-danger"
                  : "flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs"
              }
            >
              <CalendarClock className="size-3.5" aria-hidden />
              Evento: {formatDate(order.event_date)}
              {eventAtRisk(order) ? ` (em ${daysUntil(order.event_date)} dias)` : ""}
            </span>
          ) : null}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {editable ? (
              <>
                <Select value={order.status} onValueChange={(v) => onStatus(v as OrderStatus)}>
                  <SelectTrigger className="h-9 w-[220px]" aria-label="Alterar status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUS_FLOW.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={order.priority}
                  onValueChange={async (v) => {
                    const priority = v as Priority;
                    let result;
                    if (
                      (priority === "urgente" || priority === "critica") &&
                      !order.urgency_reason
                    ) {
                      const reason = window.prompt("Motivo da urgência (obrigatório):");
                      if (!reason) {
                        toast.error("Urgência exige motivo.");
                        return;
                      }
                      result = await updateOrder(
                        order.id,
                        { priority, urgency_reason: reason },
                        reason,
                      );
                    } else {
                      result = await updateOrder(order.id, { priority });
                    }
                    if (result.ok) toast.success("Prioridade atualizada.");
                    else toast.error(result.error ?? "Não foi possível atualizar a prioridade.");
                  }}
                >
                  <SelectTrigger className="h-9 w-[140px]" aria-label="Alterar prioridade">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                      <SelectItem key={p} value={p}>
                        {PRIORITY_LABELS[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="resumo" className="mt-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
          <TabsTrigger value="producao">Produção</TabsTrigger>
          <TabsTrigger value="aprovacao">Aprovação</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Dados principais</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info label="Produto" value={PRODUCT_LABELS[order.product]} />
              <Info label="Quantidade" value={String(order.quantity)} />
              {order.dimensions ? <Info label="Dimensões" value={order.dimensions} /> : null}
              {order.material ? <Info label="Material" value={order.material} /> : null}
              {order.colors ? <Info label="Cores" value={order.colors} /> : null}
              {order.finishing ? <Info label="Acabamento" value={order.finishing} /> : null}
              {order.purpose ? <Info label="Finalidade" value={order.purpose} /> : null}
              <Info label="Responsável" value={owner?.name ?? "Sem responsável"} />
              {printer ? <Info label="Impressora" value={printer.name} /> : null}
              <Info label="Criado em" value={formatDateTime(order.created_at)} />
              <div className="sm:col-span-2">
                <Info label="Briefing" value={order.briefing ?? "—"} />
              </div>
              {order.references_notes ? (
                <div className="sm:col-span-2">
                  <Info label="Referências adicionais" value={order.references_notes} />
                </div>
              ) : null}
              {order.rights_notes ? (
                <details className="rounded-md border border-border p-3 sm:col-span-2">
                  <summary className="cursor-pointer text-sm font-medium">
                    Informações complementares
                  </summary>
                  <div className="mt-3">
                    <Info label="Direitos de uso" value={order.rights_notes} />
                  </div>
                </details>
              ) : null}
              {order.urgency_reason ? (
                <div className="sm:col-span-2">
                  <Info label="Motivo da urgência" value={order.urgency_reason} />
                </div>
              ) : null}
              {order.status === "bloqueado" && order.blocked_reason ? (
                <div className="sm:col-span-2">
                  <Info label="Motivo do bloqueio" value={order.blocked_reason} />
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Próximo passo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="rounded-md border border-border bg-secondary/50 p-3 text-sm">
                <p className="mt-1 text-muted-foreground">
                  {order.status === "aguardando_aprovacao"
                    ? "Registrar retorno do cliente na aba Aprovação."
                    : order.status === "bloqueado"
                      ? "Resolver o bloqueio e retomar a etapa anterior."
                      : `Concluir "${STATUS_LABELS[order.status]}" e avançar no fluxo.`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arquivos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Arquivos do pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {editable ? (
                <Input type="file" multiple onChange={onFiles} aria-label="Anexar arquivos" />
              ) : null}
              <OrderFiles
                files={orderFiles}
                {...(editable
                  ? {
                      onRemove: async (fileId: string) => {
                        if (!window.confirm("Remover este arquivo do pedido?")) return;
                        const result = await removeFile(fileId);
                        if (result.ok) toast.success("Arquivo removido.");
                        else toast.error(result.error);
                      },
                    }
                  : {})}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="producao" className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Atribuições</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Responsável</Label>
                <Select
                  value={order.owner_id ?? "none"}
                  onValueChange={async (v) => {
                    const result = await updateOrder(order.id, {
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
                  value={order.printer_id ?? "none"}
                  onValueChange={async (v) => {
                    const result = await updateOrder(order.id, {
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
              <Info
                label="Tempo estimado"
                value={order.estimated_hours ? `${order.estimated_hours} h` : "—"}
              />
              <Info label="Material estimado" value={order.estimated_material ?? "—"} />
              <Info label="Observações internas" value={order.internal_notes ?? "—"} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Apontamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderJobs.map((j) => (
                <div key={j.id} className="rounded-md border border-border p-3 text-sm">
                  <p className="font-medium">{STATUS_LABELS[j.stage]}</p>
                  <p className="text-muted-foreground">
                    Tempo: {j.real_hours ?? "—"} h de {j.estimated_hours ?? "—"} h · Material:{" "}
                    {j.real_material ?? "—"}
                  </p>
                  {j.failed ? (
                    <p className="mt-1 text-danger">
                      Falha: {j.failure_reason} {j.reprint ? "· reimpressão realizada" : ""}
                    </p>
                  ) : null}
                  {j.notes ? <p className="mt-1 text-muted-foreground">{j.notes}</p> : null}
                </div>
              ))}
              {orderJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum trabalho de produção registrado.
                </p>
              ) : null}

              <div className="space-y-2 border-t border-border pt-3">
                <Label htmlFor="apontamento">Novo apontamento</Label>
                <Textarea
                  id="apontamento"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex.: iniciada impressão do lote 2 na Bambu Lab A1"
                  disabled={!editable}
                />
                <Button
                  size="sm"
                  disabled={!editable || !note.trim()}
                  onClick={async () => {
                    const result = await addProductionEvent(order.id, note.trim());
                    if (!result.ok) {
                      toast.error(result.error ?? "Não foi possível registrar o apontamento.");
                      return;
                    }
                    setNote("");
                    toast.success("Apontamento registrado.");
                  }}
                >
                  Registrar
                </Button>
                <ul className="space-y-2 pt-2">
                  {orderEvents.map((e) => (
                    <li key={e.id} className="text-sm">
                      <span className="font-medium">{e.author}</span>: {e.message}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {formatDateTime(e.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aprovacao" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aprovação do cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Info label="Status" value={order.approval_registered ? "Aprovado" : "Pendente"} />
                <Info label="Data" value={formatDateTime(order.approval_date)} />
                <Info label="Versão" value={order.approval_version ?? "—"} />
              </div>
              <Info label="Observação" value={order.approval_notes ?? "—"} />

              <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="versao">Versão</Label>
                  <Input
                    id="versao"
                    value={order.approval_version ?? "Ainda não enviada"}
                    readOnly
                    disabled={!can("manage_commercial") || order.status !== "aguardando_aprovacao"}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="obs-aprovacao">Observação</Label>
                  <Input
                    id="obs-aprovacao"
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    disabled={!can("manage_commercial") || order.status !== "aguardando_aprovacao"}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={!can("manage_commercial") || order.status !== "aguardando_aprovacao"}
                  onClick={async () => {
                    const result = await registerApproval(order.id, {
                      version: approvalVersion,
                      notes: approvalNotes,
                      approved: true,
                    });
                    if (result.ok) toast.success("Aprovação registrada.");
                    else toast.error(result.error ?? "Não foi possível registrar a aprovação.");
                  }}
                >
                  Aprovar e enviar para Produção
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!can("manage_commercial") || order.status !== "aguardando_aprovacao"}
                  onClick={async () => {
                    const result = await registerApproval(order.id, {
                      version: approvalVersion,
                      notes: approvalNotes,
                      approved: false,
                    });
                    if (result.ok) toast.message("Reprovação registrada.");
                    else toast.error(result.error ?? "Não foi possível registrar a reprovação.");
                  }}
                >
                  Solicitar alteração
                </Button>
              </div>

              <ul className="space-y-2 border-t border-border pt-3 text-sm">
                {orderApprovals.map((a) => (
                  <li key={a.id}>
                    {a.version} — {a.status} · {formatDateTime(a.created_at)}
                    {a.notes ? ` · ${a.notes}` : ""}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financeiro básico</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <Info label="Valor do pedido" value={formatCurrency(order.value)} />
              <Info label="Entrada" value={formatCurrency(order.down_payment)} />
              <Info label="Saldo" value={formatCurrency(order.value - order.down_payment)} />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Pagamento</p>
                <div className="mt-1">
                  <PaymentBadge status={order.payment_status} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Histórico imutável</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline orderId={order.id} code={order.code} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
