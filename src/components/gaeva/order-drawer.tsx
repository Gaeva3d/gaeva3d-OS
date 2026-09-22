import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentBadge } from "./badges";
import { Info, OrderFiles, OrderTimeline } from "./order-shared";
import { useGaeva } from "@/lib/gaeva/store";
import {
  fetchOrderDetail,
  refreshOperationalOrder,
  type OrderAction,
} from "@/lib/gaeva/order-operations";
import {
  STAGES,
  allowedDestinations,
  elapsed,
  substatus,
  type OperationalOrder,
  type Stage,
} from "@/lib/gaeva/kanban";
import { mapOrder, mapOrderFile, PRODUCT_TO_DB } from "@/lib/gaeva/supabase-mappers";
import { formatCurrency, formatDate } from "@/lib/gaeva/helpers";
import { formatActivityTime } from "@/lib/gaeva/dashboard-helpers";
import { PRODUCT_LABELS, type FileCategory } from "@/lib/gaeva/types";
import type { Json } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

export const CONFIRMATION_CHECKS = [
  "Referências e material necessário recebidos",
  "Produto, quantidade e modelo/estilo confirmados",
  "Personalizações e nome/texto confirmados quando aplicáveis",
  "Prazo e endereço confirmados quando aplicáveis",
];
export const READY_CHECKS = [
  "Peça produzida e quantidade conferida",
  "Qualidade e acabamento conferidos",
  "Itens adicionais conferidos quando aplicáveis",
  "Embalagem concluída",
];
export interface OperationRequest {
  order: OperationalOrder;
  action: OrderAction;
  title: string;
  payload?: Record<string, Json>;
  noteRequired?: boolean;
  checks?: string[];
  description?: string;
}
export type RunOperation = (
  order: OperationalOrder,
  action: OrderAction,
  payload?: Json,
) => Promise<boolean>;

export function OrderActionDialog({
  request,
  onClose,
  onRun,
  busy,
}: {
  request: OperationRequest | null;
  onClose: () => void;
  onRun: RunOperation;
  busy: boolean;
}) {
  const [note, setNote] = useState("");
  const [checked, setChecked] = useState<string[]>([]);
  const valid =
    !!request &&
    (!request.noteRequired || !!note.trim()) &&
    (!request.checks || checked.length === request.checks.length);
  return (
    <Dialog
      open={!!request}
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{request?.title}</DialogTitle>
          <DialogDescription>
            {request?.order.code} ·{" "}
            {request?.description ?? "A ação será registrada no histórico do pedido."}
          </DialogDescription>
        </DialogHeader>
        {request?.checks?.map((label) => (
          <label key={label} className="flex items-start gap-2 text-sm">
            <Checkbox
              checked={checked.includes(label)}
              onCheckedChange={(value) =>
                setChecked((old) => (value ? [...old, label] : old.filter((x) => x !== label)))
              }
              disabled={busy}
            />
            <span>{label}</span>
          </label>
        ))}
        {request &&
        (request.noteRequired || ["send_approval", "approve"].includes(request.action)) ? (
          <div className="space-y-2">
            <Label htmlFor="operation-note">
              {request?.noteRequired ? "Motivo / informação necessária *" : "Observação (opcional)"}
            </Label>
            <Textarea
              id="operation-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={busy}
            />
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button
            disabled={!valid || busy}
            onClick={async () => {
              if (!request) return;
              const ok = await onRun(request.order, request.action, {
                ...request.payload,
                note: note.trim(),
                confirmed: !!request.checks,
              });
              if (ok) onClose();
            }}
          >
            {busy ? "Salvando…" : request?.title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StageTracker({ stage }: { stage: string }) {
  const currentIndex = STAGES.findIndex((s) => s.id === stage);
  return (
    <ol
      aria-label="Progresso do pedido"
      className="flex items-center gap-1 overflow-x-auto rounded-lg border border-border bg-secondary/40 p-2"
    >
      {STAGES.map((s, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        return (
          <li
            key={s.id}
            aria-current={current ? "step" : undefined}
            className="flex min-w-0 flex-1 flex-col gap-1"
            title={s.label}
          >
            <span
              className={cn(
                "h-1 rounded-full",
                done ? "bg-primary/45" : current ? "bg-primary" : "bg-border",
              )}
            />
            <span
              className={cn(
                "truncate text-[10px] leading-tight",
                current ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderDrawer({
  order,
  onClose,
  onRequest,
  onMove,
  onRun,
  busy,
}: {
  order: OperationalOrder | null;
  onClose: () => void;
  onRequest: (r: OperationRequest) => void;
  onMove: (o: OperationalOrder, s: Stage) => void;
  onRun: RunOperation;
  busy: boolean;
}) {
  return (
    <Sheet
      open={!!order}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{order?.code ?? "Pedido"}</SheetTitle>
          <SheetDescription>{order?.customer_name}</SheetDescription>
        </SheetHeader>
        {order ? (
          <OrderDrawerContent
            key={order.id}
            order={order}
            onRequest={onRequest}
            onMove={onMove}
            onRun={onRun}
            busy={busy}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function OrderDrawerContent({
  order,
  onRequest,
  onMove,
  onRun,
  busy,
}: {
  order: OperationalOrder;
  onRequest: (r: OperationRequest) => void;
  onMove: (o: OperationalOrder, s: Stage) => void;
  onRun: RunOperation;
  busy: boolean;
}) {
  const { team, printers, currentMember, can, addFiles, removeFile, updateOrder } = useGaeva();
  const cache = useQueryClient();
  const detail = useQuery({
    queryKey: ["orders", "detail", order.id],
    queryFn: () => fetchOrderDetail(order.id),
    staleTime: 15_000,
  });
  const [category, setCategory] = useState<FileCategory>("referencia");
  const [uploading, setUploading] = useState(false);
  const role = currentMember.role;
  const operational = can("manage_production");
  const modeler = operational || (role === "designer" && order.designer_id === currentMember.id);
  const approval = can("manage_commercial");
  const editable = operational || can("manage_commercial") || modeler;
  const request = (action: OrderAction, title: string, options: Partial<OperationRequest> = {}) => {
    if (
      !options.noteRequired &&
      !options.checks &&
      !["approve", "send_approval"].includes(action)
    ) {
      void onRun(order, action, options.payload);
      return;
    }
    onRequest({ order, action, title, ...options });
  };
  const destinations = allowedDestinations(order, role, currentMember.id);
  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const result = await addFiles(
        order.id,
        files.map((file) => ({
          file,
          name: file.name,
          size: file.size,
          mime_type: file.type || "application/octet-stream",
          category,
        })),
      );
      if (!result.ok) throw new Error(result.error);
      await refreshOperationalOrder(cache, order.id);
      toast.success("Arquivos anexados.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar arquivos.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  const actionButton = (
    action: OrderAction,
    label: string,
    options: Partial<OperationRequest> = {},
    secondary = false,
  ) => (
    <Button
      key={action}
      size="sm"
      variant={secondary ? "outline" : "default"}
      disabled={busy}
      onClick={() => request(action, label, options)}
    >
      {label}
    </Button>
  );

  return (
    <div className="space-y-5 px-4 pb-8">
      <StageTracker stage={order.stage} />
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded border bg-secondary px-2 py-1">
          {STAGES.find((s) => s.id === order.stage)?.label}
        </span>
        <span>Prazo: {formatDate(order.promised_at)}</span>
        <span className="text-muted-foreground">{elapsed(order.stage_entered_at)} nesta etapa</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Info
          label="Responsável atual"
          value={
            order.owner_name ??
            (order.stage === "design" ? "Aguardando designer" : "Sem responsável")
          }
        />
        <Info label="Situação" value={substatus(order)} />
        {operational ? (
          <div className="space-y-1">
            <Label>Designer responsável</Label>
            <Select
              value={order.designer_id ?? "none"}
              disabled={!operational || busy}
              onValueChange={(id) =>
                void onRun(order, "assign_designer", { member_id: id === "none" ? null : id })
              }
            >
              <SelectTrigger aria-label="Designer responsável">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aguardando designer</SelectItem>
                {team
                  .filter((t) => t.active)
                  .map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} · {t.job_title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <Info
            label="Designer responsável"
            value={order.designer_name ?? "Aguardando atribuição"}
          />
        )}
      </div>
      {order.block_reason ? (
        <p className="rounded border border-warning/30 bg-warning/5 p-3 text-sm">
          {order.block_reason}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {order.stage === "new" && operational ? actionButton("assume", "Assumir pedido") : null}
        {order.stage === "confirmation" && operational ? (
          <>
            {actionButton("confirm", "Confirmar informações", { checks: CONFIRMATION_CHECKS })}
            {actionButton("missing", "Falta informação", { noteRequired: true }, true)}
          </>
        ) : null}
        {order.stage === "design" && modeler ? (
          <>
            {!order.modeling_started_at
              ? actionButton("start_modeling", "Iniciar modelagem")
              : null}
            {actionButton(
              "send_approval",
              "Enviar para aprovação",
              {
                description: "A nova versão e o horário do envio serão registrados.",
              },
              !order.modeling_started_at,
            )}
          </>
        ) : null}
        {order.stage === "approval" && approval ? (
          <>
            {actionButton("approve", "Aprovar e enviar para Produção", {
              description: "Confirme o retorno do cliente. A aprovação libera a fila de impressão.",
            })}
            {actionButton("request_changes", "Solicitar alteração", { noteRequired: true }, true)}
          </>
        ) : null}
        {order.stage === "printing" && operational ? (
          <>
            {order.status === "printing" ? (
              <>
                {actionButton("complete_print", "Concluir impressão")}
                {actionButton("fail_print", "Registrar falha", { noteRequired: true }, true)}
              </>
            ) : (
              <Button
                size="sm"
                disabled={busy || !order.initial_printer_id}
                onClick={() =>
                  request(
                    "start_print",
                    order.job_status === "failed" ? "Iniciar nova impressão" : "Iniciar impressão",
                  )
                }
              >
                {order.job_status === "failed" ? "Iniciar nova impressão" : "Iniciar impressão"}
              </Button>
            )}
            {!order.initial_printer_id ? (
              <p className="w-full text-xs text-muted-foreground">
                Selecione a impressora na aba Produção para iniciar.
              </p>
            ) : null}
          </>
        ) : null}
        {order.stage === "ready" && operational ? (
          <>
            {order.status === "finishing" ? actionButton("quality", "Iniciar conferência") : null}
            {order.status !== "packaging"
              ? actionButton(
                  "pack",
                  "Conferido, preparar embalagem",
                  {},
                  order.status !== "quality_control",
                )
              : null}
            {actionButton(
              "release",
              "Liberar para postagem",
              { checks: READY_CHECKS },
              order.status !== "packaging",
            )}
          </>
        ) : null}
        {order.stage === "shipping" && operational ? (
          <>
            {order.shipped_at
              ? actionButton("finish", "Finalizar pedido")
              : actionButton("ship", "Marcar como postado", {
                  description:
                    "O pedido ficará como postado até a finalização. Confira os dados na aba Envio.",
                })}
          </>
        ) : null}
        {destinations.length ? (
          <Select onValueChange={(s) => onMove(order, s as Stage)} value="" disabled={busy}>
            <SelectTrigger className="h-9 w-[175px]" aria-label="Mover pedido para">
              <SelectValue placeholder="Mover para" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((s) => (
                <SelectItem key={s} value={s}>
                  {STAGES.find((stage) => stage.id === s)?.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>
      {operational ? (
        <div className="grid gap-3 border-y py-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Responsável atual</Label>
            <Select
              value={order.assigned_to ?? "none"}
              disabled={busy}
              onValueChange={(id) =>
                void onRun(order, "assign_owner", { member_id: id === "none" ? null : id })
              }
            >
              <SelectTrigger aria-label="Responsável atual">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem responsável</SelectItem>
                {team
                  .filter((t) => t.active)
                  .map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Prioridade</Label>
            <Select
              value={order.priority === "critical" ? "urgent" : order.priority}
              disabled={busy}
              onValueChange={(priority) =>
                priority === "urgent"
                  ? request("priority", "Marcar como urgente", {
                      noteRequired: true,
                      payload: { priority },
                    })
                  : void onRun(order, "priority", { priority })
              }
            >
              <SelectTrigger aria-label="Prioridade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">Prioridade</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}
      {detail.isPending ? (
        <p role="status">Carregando informações do pedido…</p>
      ) : detail.isError ? (
        <div role="alert">
          Não foi possível carregar o pedido.{" "}
          <Button size="sm" onClick={() => void detail.refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <Tabs
          defaultValue={
            role === "designer" && ["design", "approval"].includes(order.stage)
              ? "briefing"
              : "pedido"
          }
        >
          <TabsList className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="pedido">Pedido</TabsTrigger>
            <TabsTrigger value="briefing">Briefing</TabsTrigger>
            <TabsTrigger value="referencias">Referências</TabsTrigger>
            <TabsTrigger value="producao">Produção</TabsTrigger>
            <TabsTrigger value="envio">Envio</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="pedido" className="space-y-4 pt-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info
                label="Produto"
                value={
                  PRODUCT_LABELS[
                    Object.keys(PRODUCT_TO_DB).find(
                      (k) => PRODUCT_TO_DB[k as keyof typeof PRODUCT_TO_DB] === order.category,
                    ) as keyof typeof PRODUCT_LABELS
                  ] ?? order.project_name
                }
              />
              <Info label="Quantidade" value={`${order.quantity} unidades`} />
              <Info label="Valor" value={formatCurrency(order.total_value)} />
              <Info label="Vendedor" value={order.seller_name ?? "Não registrado"} />
              <Info label="Data da venda" value={formatActivityTime(order.created_at)} />
              <Info label="Telefone" value={order.customer_phone} />
              <Info label="Entrada" value={formatCurrency(detail.data.order.deposit_value)} />
              <Info label="Saldo" value={formatCurrency(detail.data.order.balance_value ?? 0)} />
            </div>
            <PaymentBadge
              status={mapOrder(detail.data.order, undefined, detail.data.approvals).payment_status}
            />
            {detail.data.items.map((item) => (
              <div key={item.id} className="rounded border p-3 text-sm">
                <p className="font-medium">
                  {item.name} · {item.quantity} un.
                </p>
                <p className="text-muted-foreground">
                  {[
                    item.dimensions,
                    item.material,
                    item.colors.join(", "),
                    item.finishing,
                    item.purpose,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            ))}
            {order.stage === "completed" ? (
              <FinalizedMilestones
                order={order}
                approvalAt={
                  detail.data.approvals.find((a) => a.status === "approved")?.decided_at ?? null
                }
              />
            ) : null}
            <Button asChild variant="outline" size="sm">
              <Link to="/pedidos/$id" params={{ id: order.id }}>
                Abrir página completa
              </Link>
            </Button>
          </TabsContent>
          <TabsContent value="briefing" className="space-y-4 pt-3">
            <Info
              label="Descrição e referências"
              value={detail.data.order.briefing_description ?? "Não informado"}
            />
            {detail.data.order.mandatory_requirements ? (
              <Info
                label="Informações complementares"
                value={detail.data.order.mandatory_requirements}
              />
            ) : null}
            <Info
              label="Informações comerciais"
              value={detail.data.order.commercial_notes ?? "Não informado"}
            />
            <Info
              label="Observações internas"
              value={detail.data.order.internal_notes ?? "Não informado"}
            />
            <Info
              label="Conferência da Produção"
              value={order.briefing_complete ? "Informações confirmadas" : "Aguardando confirmação"}
            />
            {can("manage_commercial") || operational ? (
              <OrderInfoEditor
                key={detail.data.order.updated_at}
                data={detail.data}
                onSave={async (patch) => {
                  const result = await updateOrder(order.id, patch);
                  if (!result.ok) {
                    toast.error(result.error);
                    return false;
                  }
                  await refreshOperationalOrder(cache, order.id);
                  toast.success("Informações atualizadas.");
                  return true;
                }}
              />
            ) : null}
            {editable &&
            order.stage !== "completed" &&
            (role !== "designer" || order.stage === "design")
              ? actionButton("note", "Adicionar observação", { noteRequired: true }, true)
              : null}
          </TabsContent>
          <TabsContent value="referencias" className="space-y-3 pt-3">
            {editable ? (
              <>
                <Select
                  value={category}
                  onValueChange={(c) => setCategory(c as FileCategory)}
                  disabled={uploading}
                >
                  <SelectTrigger aria-label="Tipo do arquivo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="referencia">Referência</SelectItem>
                    <SelectItem value="modelo">Modelo / render</SelectItem>
                    <SelectItem value="documento">Documento</SelectItem>
                    <SelectItem value="foto_producao">Foto de produção</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="file"
                  multiple
                  onChange={upload}
                  disabled={uploading || busy}
                  aria-label="Anexar referências ou renders"
                />
                {uploading ? (
                  <p role="status" className="text-sm">
                    Enviando arquivos…
                  </p>
                ) : null}
              </>
            ) : null}
            <OrderFiles
              files={detail.data.files.map((f) => mapOrderFile(f, f.url))}
              {...(editable
                ? {
                    onRemove: async (id: string) => {
                      if (!window.confirm("Remover este arquivo do pedido?")) return;
                      const result = await removeFile(id);
                      if (!result.ok) toast.error(result.error);
                      else await refreshOperationalOrder(cache, order.id);
                    },
                  }
                : {})}
            />
          </TabsContent>
          <TabsContent value="producao" className="space-y-4 pt-3">
            {operational ? (
              <div className="space-y-1">
                <Label>Impressora</Label>
                <Select
                  value={order.initial_printer_id ?? "none"}
                  disabled={!operational || busy}
                  onValueChange={async (id) => {
                    const result = await updateOrder(order.id, {
                      printer_id: id === "none" ? null : id,
                    });
                    if (!result.ok) toast.error(result.error);
                    else await refreshOperationalOrder(cache, order.id);
                  }}
                >
                  <SelectTrigger aria-label="Impressora">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Selecione quando necessário</SelectItem>
                    {printers.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : order.initial_printer_id ? (
              <Info
                label="Impressora"
                value={
                  printers.find((p) => p.id === order.initial_printer_id)?.name ??
                  "Impressora atribuída"
                }
              />
            ) : null}
            <Info label="Tempo na etapa" value={elapsed(order.stage_entered_at)} />
            <Info label="Revisões solicitadas" value={String(order.revision_count)} />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Versões e aprovações</h3>
              {detail.data.approvals.length ? (
                detail.data.approvals.map((a) => (
                  <div key={a.id} className="rounded border p-3 text-sm">
                    <p className="font-medium">
                      Versão {a.version} ·{" "}
                      {
                        {
                          pending: "Aguardando cliente",
                          approved: "Aprovado",
                          changes_requested: "Alteração solicitada",
                          rejected: "Reprovado",
                        }[a.status]
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Enviado: {formatActivityTime(a.created_at)}
                    </p>
                    {a.decided_at ? (
                      <p className="text-xs text-muted-foreground">
                        {a.decider?.full_name ?? "Equipe"} · {formatActivityTime(a.decided_at)}
                      </p>
                    ) : null}
                    {a.notes ? <p className="mt-1 whitespace-pre-wrap">{a.notes}</p> : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma versão enviada.</p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Impressões</h3>
              {detail.data.jobs.map((j) => (
                <div key={j.id} className="rounded border p-3 text-sm">
                  <p>
                    Tentativa {j.attempt_number} ·{" "}
                    {
                      {
                        queued: "Na fila",
                        running: "Imprimindo",
                        paused: "Pausado",
                        failed: "Falha",
                        completed: "Concluída",
                        cancelled: "Cancelada",
                      }[j.status]
                    }
                  </p>
                  <p className="text-muted-foreground">
                    {printers.find((p) => p.id === j.printer_id)?.name ?? "Sem impressora"}
                  </p>
                  {j.started_at ? (
                    <p className="text-xs">Início: {formatActivityTime(j.started_at)}</p>
                  ) : null}
                  {j.finished_at ? (
                    <p className="text-xs">Fim: {formatActivityTime(j.finished_at)}</p>
                  ) : null}
                  {j.failure_reason ? <p className="text-danger">{j.failure_reason}</p> : null}
                  {j.reprint_of_id ? (
                    <p className="text-xs">
                      Reimpressão registrada; tentativa anterior preservada.
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="envio" className="space-y-4 pt-3">
            <Info
              label="Destino"
              value={[order.customer_name, order.city, order.state].filter(Boolean).join(" · ")}
            />
            <ShippingEditor
              key={detail.data.order.updated_at}
              data={detail.data.order}
              disabled={(!operational && !can("manage_commercial")) || busy}
              onSave={(payload) => onRun(order, "shipping_details", payload)}
            />
            <Info
              label="Data de postagem"
              value={order.shipped_at ? formatActivityTime(order.shipped_at) : "Ainda não postado"}
            />
          </TabsContent>
          <TabsContent value="historico" className="pt-4">
            <OrderTimeline orderId={order.id} code={order.code} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function ShippingEditor({
  data,
  disabled,
  onSave,
}: {
  data: Awaited<ReturnType<typeof fetchOrderDetail>>["order"];
  disabled: boolean;
  onSave: (payload: Json) => Promise<boolean>;
}) {
  const [form, setForm] = useState({
    shipping_address: data.shipping_address ?? "",
    shipping_method: data.shipping_method ?? "",
    carrier: data.carrier ?? "",
    tracking_code: data.tracking_code ?? "",
  });
  const [saving, setSaving] = useState(false);
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          await onSave(form);
        } finally {
          setSaving(false);
        }
      }}
    >
      {Object.entries({
        shipping_address: "Endereço completo de envio",
        shipping_method: "Forma de envio",
        carrier: "Transportadora",
        tracking_code: "Código de rastreamento",
      }).map(([key, label]) => (
        <div key={key} className="space-y-1">
          <Label htmlFor={`shipping-${key}`}>{label}</Label>
          <Input
            id={`shipping-${key}`}
            value={form[key as keyof typeof form]}
            disabled={disabled || saving}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}
      {!disabled ? (
        <Button size="sm" type="submit" disabled={saving}>
          {saving ? "Salvando…" : "Salvar dados de envio"}
        </Button>
      ) : null}
    </form>
  );
}
function OrderInfoEditor({
  data,
  onSave,
}: {
  data: Awaited<ReturnType<typeof fetchOrderDetail>>;
  onSave: (patch: {
    briefing: string;
    commercial_notes: string;
    due_date: string;
  }) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    briefing: data.order.briefing_description ?? "",
    commercial_notes: data.order.commercial_notes ?? "",
    due_date: data.order.promised_at,
  });
  if (!editing)
    return (
      <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
        Corrigir informações
      </Button>
    );
  return (
    <form
      className="space-y-3 rounded border p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          if (await onSave(form)) setEditing(false);
        } finally {
          setSaving(false);
        }
      }}
    >
      <Label htmlFor="edit-briefing">Descrição e referências</Label>
      <Textarea
        id="edit-briefing"
        value={form.briefing}
        onChange={(e) => setForm({ ...form, briefing: e.target.value })}
      />
      <Label htmlFor="edit-commercial">Observações comerciais</Label>
      <Textarea
        id="edit-commercial"
        value={form.commercial_notes}
        onChange={(e) => setForm({ ...form, commercial_notes: e.target.value })}
      />
      <Label htmlFor="edit-due">Prazo prometido</Label>
      <Input
        id="edit-due"
        type="date"
        required
        value={form.due_date}
        onChange={(e) => setForm({ ...form, due_date: e.target.value })}
      />
      <div className="flex gap-2">
        <Button size="sm" disabled={saving}>
          Salvar
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={() => setEditing(false)}
          disabled={saving}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

import { requireSupabase } from "@/integrations/supabase/client";
import { operationDate } from "@/lib/gaeva/dashboard-helpers";
import { STATUS_STAGE } from "@/lib/gaeva/kanban";
function FinalizedMilestones({
  order,
  approvalAt,
}: {
  order: OperationalOrder;
  approvalAt: string | null;
}) {
  const result = useQuery({
    queryKey: ["orders", "milestones", order.id, order.updated_at],
    queryFn: async () => {
      const dates: Record<string, string> = {};
      for (let offset = 0; ; offset += 200) {
        const response = await requireSupabase()
          .from("audit_logs")
          .select("id,created_at,new_values,old_values")
          .eq("table_name", "orders")
          .eq("record_id", order.id)
          .order("id")
          .range(offset, offset + 199);
        if (response.error) throw response.error;
        for (const a of response.data) {
          const after = a.new_values as Record<string, unknown> | null;
          const before = a.old_values as Record<string, unknown> | null;
          const stage = STATUS_STAGE[String(after?.["status"])];
          if (stage && stage !== STATUS_STAGE[String(before?.["status"])]) {
            if (stage !== "confirmation" || !dates[stage]) dates[stage] = a.created_at;
          }
        }
        if (response.data.length < 200) return dates;
      }
    },
  });
  if (result.isPending)
    return (
      <p role="status" className="text-sm">
        Carregando marcos do pedido…
      </p>
    );
  if (result.isError)
    return (
      <p role="alert" className="text-sm text-danger">
        Não foi possível carregar os marcos do pedido.
      </p>
    );
  const finished = result.data["completed"];
  return (
    <div className="grid gap-3 rounded border p-3 sm:grid-cols-2">
      {[
        ["Venda", order.created_at],
        ["Entrada na Produção", result.data["confirmation"]],
        ["Modelagem", result.data["design"]],
        ["Aprovação", approvalAt],
        ["Impressão concluída", result.data["ready"]],
        ["Postagem", order.shipped_at],
        ["Finalização", finished],
      ].map(([label, date]) => (
        <Info
          key={label}
          label={label!}
          value={date ? formatActivityTime(date) : "Não registrado"}
        />
      ))}
      <Info
        label="Tempo total"
        value={finished ? elapsed(order.created_at, new Date(finished)) : "Não registrado"}
      />
      <Info
        label="Cumprimento do prazo"
        value={
          finished
            ? operationDate(finished) <= order.promised_at
              ? "Finalizado dentro do prazo"
              : "Finalizado fora do prazo"
            : "Não registrado"
        }
      />
    </div>
  );
}
