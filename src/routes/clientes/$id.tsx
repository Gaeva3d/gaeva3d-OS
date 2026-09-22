import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/gaeva/app-shell";
import { PriorityBadge, StatusBadge } from "@/components/gaeva/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate, isClosed, maskPhone, whatsappLink } from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";
import { PRODUCT_LABELS } from "@/lib/gaeva/types";

export const Route = createFileRoute("/clientes/$id")({
  head: () => ({
    meta: [
      { title: "Cliente — GAEVA OS" },
      {
        name: "description",
        content: "Ficha do cliente com histórico de pedidos e dados de contato.",
      },
      { property: "og:title", content: "Cliente — GAEVA OS" },
      { property: "og:description", content: "Ficha do cliente GAEVA." },
    ],
  }),
  component: CustomerDetail,
});

function CustomerDetail() {
  const { id } = Route.useParams();
  const { customers, orders, updateCustomer, can } = useGaeva();
  const customer = customers.find((c) => c.id === id);
  const [draft, setDraft] = useState<{ phone?: string; email?: string; notes?: string } | null>(
    null,
  );
  const editable = can("manage_commercial");

  if (!customer) {
    return (
      <AppShell title="Cliente não encontrado">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Este cliente não existe ou foi removido.
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/clientes">Voltar para clientes</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const list = orders.filter((o) => o.customer_id === customer.id);
  const active = list.filter((o) => !isClosed(o));
  const total = list.reduce((sum, o) => sum + o.value, 0);
  const form = {
    phone: draft?.phone ?? customer.phone,
    email: draft?.email ?? customer.email ?? "",
    notes: draft?.notes ?? customer.notes ?? "",
  };

  return (
    <AppShell
      title={customer.name}
      description={customer.company ?? `${customer.city}/${customer.state}`}
      actions={
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/clientes">
              <ArrowLeft className="size-4" /> Clientes
            </Link>
          </Button>
          <Button asChild size="sm">
            <a href={whatsappLink(customer.phone)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Pedidos</span>
              <span className="tabular-nums">{list.length}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Em andamento</span>
              <span className="tabular-nums">{active.length}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Valor acumulado</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Cadastro</span>
              <span>{formatDate(customer.created_at)}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Dados de contato</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="d-tel">Telefone/WhatsApp</Label>
              <Input
                id="d-tel"
                value={form.phone}
                disabled={!editable}
                onChange={(e) => setDraft({ ...form, phone: maskPhone(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d-email">E-mail</Label>
              <Input
                id="d-email"
                value={form.email}
                disabled={!editable}
                onChange={(e) => setDraft({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="d-obs">Observações</Label>
              <Textarea
                id="d-obs"
                value={form.notes}
                disabled={!editable}
                onChange={(e) => setDraft({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                size="sm"
                disabled={!editable || !draft}
                onClick={async () => {
                  const result = await updateCustomer(customer.id, {
                    phone: form.phone,
                    email: form.email || null,
                    notes: form.notes || null,
                  });
                  if (!result.ok) {
                    toast.error(result.error ?? "Não foi possível atualizar o cliente.");
                    return;
                  }
                  setDraft(null);
                  toast.success("Cliente atualizado.");
                }}
              >
                Salvar alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Histórico de pedidos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {list.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              Este cliente ainda não tem pedidos.
            </p>
          ) : (
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  {["Código", "Projeto", "Produto", "Prazo", "Status", "Prioridade", "Valor"].map(
                    (h) => (
                      <th key={h} className="px-3 py-2 font-medium">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {list.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/40"
                  >
                    <td className="px-3 py-2">
                      <Link
                        to="/pedidos/$id"
                        params={{ id: o.id }}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {o.code}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{o.project_name}</td>
                    <td className="px-3 py-2">{PRODUCT_LABELS[o.product]}</td>
                    <td className="px-3 py-2">{formatDate(o.due_date)}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-3 py-2">
                      <PriorityBadge priority={o.priority} />
                    </td>
                    <td className="px-3 py-2 tabular-nums">{formatCurrency(o.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
