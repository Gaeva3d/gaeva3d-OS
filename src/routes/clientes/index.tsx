import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/gaeva/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate, isClosed, maskPhone, whatsappLink } from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes — GAEVA OS" },
      {
        name: "description",
        content: "Base de clientes GAEVA com histórico de pedidos e contato.",
      },
      { property: "og:title", content: "Clientes — GAEVA OS" },
      { property: "og:description", content: "Base de clientes GAEVA." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { customers, orders, createCustomer, can } = useGaeva();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    notes: "",
  });

  const editable = can("manage_commercial");
  const filtered = customers.filter((c) =>
    [c.name, c.company ?? "", c.city, c.phone]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const stats = (customerId: string) => {
    const list = orders.filter((o) => o.customer_id === customerId);
    const last = list
      .map((o) => o.created_at)
      .sort()
      .at(-1);
    return {
      total: list.length,
      active: list.filter((o) => !isClosed(o)).length,
      value: list.reduce((sum, o) => sum + o.value, 0),
      last,
    };
  };

  return (
    <AppShell
      title="Clientes"
      description="Base comercial da GAEVA"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!editable}>
              <Plus className="size-4" /> Novo cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo cliente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-nome">Nome*</Label>
                <Input
                  id="c-nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-empresa">Empresa</Label>
                <Input
                  id="c-empresa"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-tel">Telefone/WhatsApp*</Label>
                <Input
                  id="c-tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-email">E-mail</Label>
                <Input
                  id="c-email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-cidade">Cidade*</Label>
                <Input
                  id="c-cidade"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-uf">UF*</Label>
                <Input
                  id="c-uf"
                  maxLength={2}
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="c-obs">Observações</Label>
                <Textarea
                  id="c-obs"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={async () => {
                  if (
                    !form.name.trim() ||
                    form.phone.replace(/\D/g, "").length < 10 ||
                    !form.city ||
                    !form.state
                  ) {
                    toast.error("Preencha nome, telefone, cidade e UF.");
                    return;
                  }
                  try {
                    await createCustomer({
                      name: form.name,
                      company: form.company || null,
                      phone: form.phone,
                      email: form.email || null,
                      city: form.city,
                      state: form.state,
                      notes: form.notes || null,
                    });
                    setForm({
                      name: "",
                      company: "",
                      phone: "",
                      email: "",
                      city: "",
                      state: "",
                      notes: "",
                    });
                    setOpen(false);
                    toast.success("Cliente cadastrado.");
                  } catch (createError) {
                    toast.error(
                      createError instanceof Error
                        ? createError.message
                        : "Erro ao cadastrar cliente.",
                    );
                  }
                }}
              >
                Salvar cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardContent className="py-4">
          <div className="relative max-w-md">
            <Search
              className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar cliente"
              aria-label="Buscar cliente"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="overflow-x-auto p-0">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Nenhum cliente encontrado.
            </p>
          ) : (
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  {[
                    "Nome",
                    "Empresa",
                    "WhatsApp",
                    "Cidade/UF",
                    "Pedidos",
                    "Ativos",
                    "Valor acumulado",
                    "Última compra",
                    "",
                  ].map((h) => (
                    <th key={h} className="px-3 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const s = stats(c.id);
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/40"
                    >
                      <td className="px-3 py-2">
                        <Link
                          to="/clientes/$id"
                          params={{ id: c.id }}
                          className="font-medium text-primary hover:underline"
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{c.company ?? "—"}</td>
                      <td className="px-3 py-2">{c.phone}</td>
                      <td className="px-3 py-2">
                        {c.city}/{c.state}
                      </td>
                      <td className="px-3 py-2 tabular-nums">{s.total}</td>
                      <td className="px-3 py-2 tabular-nums">{s.active}</td>
                      <td className="px-3 py-2 tabular-nums">{formatCurrency(s.value)}</td>
                      <td className="px-3 py-2">{formatDate(s.last)}</td>
                      <td className="px-3 py-2">
                        <Button asChild size="sm" variant="outline">
                          <a
                            href={whatsappLink(c.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Abrir WhatsApp de ${c.name}`}
                          >
                            <MessageCircle className="size-4" /> WhatsApp
                          </a>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
