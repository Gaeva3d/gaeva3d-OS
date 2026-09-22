import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Paperclip, Trash2 } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/gaeva/app-shell";
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
import { formatBytes, maskPhone } from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";
import { PAYMENT_LABELS, PRODUCT_LABELS, type FileCategory } from "@/lib/gaeva/types";
import { cn } from "@/lib/utils";
import {
  NEW_ORDER_PRODUCTS,
  NEW_ORDER_PAYMENTS,
  buildNewOrderInput,
  validateOrderDraft,
  type NewOrderDraft,
} from "@/lib/gaeva/new-order";

export const Route = createFileRoute("/pedidos/novo")({
  head: () => ({
    meta: [
      { title: "Novo pedido — GAEVA OS" },
      {
        name: "description",
        content: "Cadastro completo de pedido: cliente, pedido, briefing e arquivos.",
      },
      { property: "og:title", content: "Novo pedido — GAEVA OS" },
      { property: "og:description", content: "Cadastro completo de pedido da GAEVA." },
    ],
  }),
  component: NewOrderPage,
});

const STEPS = ["Cliente", "Pedido", "Briefing e arquivos"] as const;

interface PendingFile {
  file: File;
  name: string;
  size: number;
  mime_type: string;
  category: FileCategory;
}

function NewOrderPage() {
  const navigate = useNavigate();
  const { customers, team, authUser, createCustomer, createOrder, addFiles, nextCode, can } =
    useGaeva();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [newCustomer, setNewCustomer] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    notes: "",
  });

  const [order, setOrder] = useState<NewOrderDraft>({
    product: "corporativo",
    quantity: 1,
    dimensions: "",
    finishing: "",
    purpose: "",
    event_date: "",
    due_date: "",
    value: "",
    down_payment: "",
    payment_status: "",
    commercial_notes: "",
  });
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<PendingFile[]>([]);

  const readOnly = !can("manage_commercial");

  const validateStep = (index: number): boolean => {
    const e: Record<string, string> = {};
    if (index === 0) {
      if (newCustomer) {
        if (!customer.name.trim()) e["name"] = "Informe o nome do cliente.";
        if (customer.phone.replace(/\D/g, "").length < 10)
          e["phone"] = "Telefone/WhatsApp obrigatório.";
        if (!customer.city.trim()) e["city"] = "Informe a cidade.";
        if (!customer.state.trim()) e["state"] = "Informe a UF.";
      } else if (!customerId) {
        e["customerId"] = "Selecione um cliente ou cadastre um novo.";
      }
    }
    if (index === 1) Object.assign(e, validateOrderDraft(order));
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(event.target.files ?? []);
    setFiles((prev) => [
      ...prev,
      ...list.map((f) => ({
        file: f,
        name: f.name,
        size: f.size,
        mime_type: f.type || "application/octet-stream",
        category: (f.type.startsWith("image/") ? "referencia" : "documento") as FileCategory,
      })),
    ]);
    event.target.value = "";
  };

  const submit = async () => {
    if (readOnly) {
      toast.error("Seu papel atual não permite criar pedidos.");
      return;
    }
    for (const index of [0, 1]) {
      if (!validateStep(index)) {
        setStep(index);
        toast.error("Revise os campos obrigatórios.");
        return;
      }
    }
    setSubmitting(true);
    try {
      const finalCustomerId = newCustomer
        ? (
            await createCustomer({
              name: customer.name,
              company: customer.company || null,
              phone: customer.phone,
              email: customer.email || null,
              city: customer.city,
              state: customer.state.toUpperCase(),
              notes: customer.notes || null,
            })
          ).id
        : customerId;

      const owner = team.find((member) => member.user_id === authUser.id && member.active);
      const name = newCustomer
        ? customer.name
        : (customers.find((item) => item.id === finalCustomerId)?.name ?? "Cliente");
      const created = await createOrder(
        buildNewOrderInput(order, finalCustomerId, name, owner?.id ?? null, description),
      );

      if (files.length) {
        const upload = await addFiles(created.id, files);
        if (!upload.ok)
          toast.warning(`Pedido criado, mas houve falha nos arquivos: ${upload.error}`);
      }
      toast.success(`Pedido ${created.code} criado.`);
      void navigate({ to: "/pedidos/$id", params: { id: created.id } });
    } catch (submitError) {
      toast.error(
        submitError instanceof Error ? submitError.message : "Não foi possível criar o pedido.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const err = (key: string) =>
    errors[key] ? <p className="mt-1 text-xs text-danger">{errors[key]}</p> : null;

  return (
    <AppShell title="Novo pedido" description={`Código automático: ${nextCode()}`}>
      <div className="mb-5 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors",
              i === step
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "border-border text-muted-foreground hover:bg-secondary",
            )}
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-xs">
              {i + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      {readOnly ? (
        <p className="mb-4 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm">
          Seu perfil não permite criar pedidos. Peça ao Comercial ou a um administrador para
          cadastrar o pedido.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {String(step + 1)}. {STEPS[step]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="novo-cliente"
                  checked={newCustomer}
                  onCheckedChange={(v) => setNewCustomer(Boolean(v))}
                />
                <Label htmlFor="novo-cliente">Cadastrar novo cliente</Label>
              </div>

              {newCustomer ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Nome*" error={errors["name"]}>
                    <Input
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    />
                  </Field>
                  <Field label="Empresa">
                    <Input
                      value={customer.company}
                      onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                    />
                  </Field>
                  <Field label="Telefone/WhatsApp*" error={errors["phone"]}>
                    <Input
                      value={customer.phone}
                      placeholder="(41) 99999-9999"
                      onChange={(e) =>
                        setCustomer({ ...customer, phone: maskPhone(e.target.value) })
                      }
                    />
                  </Field>
                  <Field label="E-mail">
                    <Input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                  </Field>
                  <Field label="Cidade*" error={errors["city"]}>
                    <Input
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    />
                  </Field>
                  <Field label="UF*" error={errors["state"]}>
                    <Input
                      maxLength={2}
                      value={customer.state}
                      onChange={(e) =>
                        setCustomer({ ...customer, state: e.target.value.toUpperCase() })
                      }
                    />
                  </Field>
                  <Field label="Observações do cliente" className="md:col-span-2">
                    <Textarea
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    />
                  </Field>
                </div>
              ) : (
                <Field label="Cliente existente*" error={errors["customerId"]}>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger className="max-w-md">
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                          {c.company ? ` — ${c.company}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Categoria/produto">
                <Select
                  value={order.product}
                  onValueChange={(v) =>
                    setOrder({
                      ...order,
                      product: v as NewOrderDraft["product"],
                      event_date: v === "corporativo" ? order.event_date : "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NEW_ORDER_PRODUCTS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {PRODUCT_LABELS[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Quantidade*" error={errors["quantity"]}>
                <Input
                  type="number"
                  min={1}
                  value={order.quantity}
                  onChange={(e) => setOrder({ ...order, quantity: Number(e.target.value) })}
                />
              </Field>
              {order.product === "corporativo" ? (
                <Field label="Data fixa do evento" error={errors["event_date"]}>
                  <Input
                    type="date"
                    value={order.event_date}
                    onChange={(e) => setOrder({ ...order, event_date: e.target.value })}
                  />
                </Field>
              ) : null}
              <Field label="Prazo prometido*" error={errors["due_date"]}>
                <Input
                  type="date"
                  value={order.due_date}
                  onChange={(e) => setOrder({ ...order, due_date: e.target.value })}
                />
              </Field>
              <Field label="Valor do pedido (R$)" error={errors["value"]}>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  placeholder="Informe o valor"
                  value={order.value}
                  onChange={(e) => setOrder({ ...order, value: e.target.value })}
                />
              </Field>
              <Field label="Entrada (R$)" error={errors["down_payment"]}>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  placeholder="Informe a entrada"
                  value={order.down_payment}
                  onChange={(e) => setOrder({ ...order, down_payment: e.target.value })}
                />
              </Field>
              <Field label="Saldo">
                <Input
                  readOnly
                  value={`R$ ${Math.max(Number(order.value) - Number(order.down_payment), 0).toFixed(2)}`}
                />
              </Field>
              <Field label="Status de pagamento*" error={errors["payment_status"]}>
                <Select
                  value={order.payment_status}
                  onValueChange={(v) =>
                    setOrder({ ...order, payment_status: v as NewOrderDraft["payment_status"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEW_ORDER_PAYMENTS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {PAYMENT_LABELS[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Observações comerciais" className="md:col-span-3">
                <Textarea
                  value={order.commercial_notes}
                  onChange={(e) => setOrder({ ...order, commercial_notes: e.target.value })}
                />
              </Field>
              <details className="rounded-md border border-border p-3 md:col-span-3">
                <summary className="cursor-pointer text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Detalhes adicionais (opcional)
                </summary>
                <p className="mt-2 text-xs text-muted-foreground">
                  Preencha apenas o que já foi combinado com o cliente.
                </p>
                <div className="mt-3 grid gap-4 md:grid-cols-3">
                  <Field label="Tamanho/dimensões">
                    <Input
                      value={order.dimensions}
                      onChange={(e) => setOrder({ ...order, dimensions: e.target.value })}
                    />
                  </Field>
                  <Field label="Acabamento">
                    <Input
                      value={order.finishing}
                      onChange={(e) => setOrder({ ...order, finishing: e.target.value })}
                    />
                  </Field>
                  <Field label="Finalidade/evento">
                    <Input
                      value={order.purpose}
                      onChange={(e) => setOrder({ ...order, purpose: e.target.value })}
                    />
                  </Field>
                </div>
              </details>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <Field label="Descrição, referências e requisitos">
                <Textarea
                  rows={6}
                  value={description}
                  placeholder="Descreva a peça, as referências e os detalhes que precisam ser respeitados."
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <div>
                <Label htmlFor="arquivos" className="mb-2 block">
                  Arquivos (imagens e documentos)
                </Label>
                <Input id="arquivos" type="file" multiple onChange={onFiles} />
                <ul className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm"
                    >
                      <Paperclip className="size-4 text-muted-foreground" aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{f.name}</span>
                      <span className="text-xs text-muted-foreground">{formatBytes(f.size)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remover ${f.name}`}
                        onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  ))}
                  {files.length === 0 ? (
                    <li className="text-sm text-muted-foreground">Nenhum arquivo anexado.</li>
                  ) : null}
                </ul>
              </div>
            </div>
          ) : null}

          {err("root")}
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft className="size-4" /> Voltar
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => {
              if (validateStep(step)) setStep((s) => s + 1);
              else toast.error("Revise os campos obrigatórios desta etapa.");
            }}
          >
            Avançar <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={() => void submit()} disabled={readOnly || submitting}>
            <Check className="size-4" /> {submitting ? "Criando…" : "Criar pedido"}
          </Button>
        )}
      </div>
    </AppShell>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string | undefined;
  className?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
