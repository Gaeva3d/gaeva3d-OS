import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/gaeva/app-shell";
import { PrinterStatusBadge } from "@/components/gaeva/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";
import { PRINTER_STATUS_LABELS, type PrinterStatus } from "@/lib/gaeva/types";

export const Route = createFileRoute("/impressoras")({
  head: () => ({
    meta: [
      { title: "Impressoras — GAEVA OS" },
      { name: "description", content: "Parque de impressoras da GAEVA: status, fila e materiais." },
      { property: "og:title", content: "Impressoras — GAEVA OS" },
      { property: "og:description", content: "Parque de impressoras da GAEVA." },
    ],
  }),
  component: PrintersPage,
});

const STATUSES: PrinterStatus[] = ["disponivel", "imprimindo", "manutencao", "offline"];

function PrintersPage() {
  const { printers, orders, updatePrinter, createPrinter, can } = useGaeva();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    technology: "FDM",
    current_material: "",
    notes: "",
  });
  const editable = can("manage_production");

  return (
    <AppShell
      title="Impressoras"
      description="Capacidade e fila do parque de máquinas"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!editable}>
              <Plus className="size-4" /> Nova impressora
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova impressora</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-nome">Nome*</Label>
                <Input
                  id="p-nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-tec">Tecnologia</Label>
                <Input
                  id="p-tec"
                  value={form.technology}
                  onChange={(e) => setForm({ ...form, technology: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-mat">Material atual</Label>
                <Input
                  id="p-mat"
                  value={form.current_material}
                  onChange={(e) => setForm({ ...form, current_material: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-obs">Observações</Label>
                <Textarea
                  id="p-obs"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={async () => {
                  if (!form.name.trim()) {
                    toast.error("Informe o nome da impressora.");
                    return;
                  }
                  const result = await createPrinter({
                    name: form.name,
                    technology: form.technology,
                    current_material: form.current_material || null,
                    notes: form.notes || null,
                  });
                  if (!result.ok) {
                    toast.error(result.error ?? "Não foi possível cadastrar a impressora.");
                    return;
                  }
                  setForm({ name: "", technology: "FDM", current_material: "", notes: "" });
                  setOpen(false);
                  toast.success("Impressora cadastrada.");
                }}
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {printers.map((printer) => {
          const current = orders.find((o) => o.id === printer.current_order_id);
          const queue = orders.filter(
            (o) =>
              o.printer_id === printer.id &&
              o.id !== printer.current_order_id &&
              o.status !== "concluido",
          );
          return (
            <Card key={printer.id}>
              <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
                <div>
                  <CardTitle className="text-base">{printer.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {printer.technology} · {printer.current_material ?? "sem material"}
                  </p>
                </div>
                <PrinterStatusBadge status={printer.status} />
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Trabalho atual</p>
                  {current ? (
                    <Link
                      to="/pedidos/$id"
                      params={{ id: current.id }}
                      className="text-primary hover:underline"
                    >
                      {current.code} — {current.project_name}
                    </Link>
                  ) : (
                    <p className="text-muted-foreground">Sem trabalho em execução</p>
                  )}
                  {printer.estimated_hours ? (
                    <p className="text-xs text-muted-foreground">
                      Estimativa: {printer.estimated_hours}h
                    </p>
                  ) : null}
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">Fila ({queue.length})</p>
                  <ul className="mt-1 space-y-1">
                    {queue.slice(0, 4).map((o) => (
                      <li key={o.id} className="flex justify-between gap-2">
                        <Link
                          to="/pedidos/$id"
                          params={{ id: o.id }}
                          className="truncate hover:underline"
                        >
                          {o.code} — {o.project_name}
                        </Link>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDate(o.due_date)}
                        </span>
                      </li>
                    ))}
                    {queue.length === 0 ? (
                      <li className="text-muted-foreground">Fila vazia</li>
                    ) : null}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={printer.status}
                    disabled={!editable}
                    onValueChange={async (v) => {
                      const result = await updatePrinter(printer.id, {
                        status: v as PrinterStatus,
                      });
                      if (result.ok) toast.success("Status da impressora atualizado.");
                      else toast.error(result.error ?? "Não foi possível atualizar a impressora.");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {PRINTER_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
