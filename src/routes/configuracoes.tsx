import { createFileRoute } from "@tanstack/react-router";
import { Database, RefreshCw } from "lucide-react";

import { AppShell } from "@/components/gaeva/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";
import { ROLE_LABELS, type Role } from "@/lib/gaeva/types";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — GAEVA OS" },
      {
        name: "description",
        content: "Perfis de acesso, conexão e trilha de auditoria do GAEVA OS.",
      },
      { property: "og:title", content: "Configurações — GAEVA OS" },
      { property: "og:description", content: "Perfis de acesso e conexão Supabase." },
    ],
  }),
  component: SettingsPage,
});

const PERMISSIONS: Array<{ role: Role; items: string[] }> = [
  { role: "admin", items: ["Tudo", "Configurações", "Equipe", "Auditoria"] },
  { role: "comercial", items: ["Clientes", "Pedidos", "Aprovações", "Financeiro"] },
  { role: "producao", items: ["Quadro de produção", "Apontamentos", "Impressoras"] },
  {
    role: "designer",
    items: ["Pedidos atribuídos", "Modelagem, referências e envio para aprovação"],
  },
  { role: "visualizacao", items: ["Somente leitura"] },
];

function SettingsPage() {
  const { audit, orders, customers, refreshData, error } = useGaeva();

  return (
    <AppShell title="Configurações" description="Acessos, conexão Supabase e auditoria">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfis de acesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {PERMISSIONS.map((p) => (
              <div key={p.role} className="rounded-md border border-border p-3">
                <p className="font-medium">{ROLE_LABELS[p.role]}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.items.map((i) => (
                    <Badge key={i} variant="secondary">
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="size-4" /> Base oficial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              O sistema está conectado ao banco oficial da GAEVA no Supabase. Alterações feitas aqui
              são persistidas e respeitam as permissões de cada perfil.
            </p>
            <p>
              {orders.length} pedidos · {customers.length} clientes carregados.
            </p>
            {error ? <p className="text-danger">Falha de sincronização: {error}</p> : null}
            <Button variant="outline" size="sm" onClick={() => void refreshData()}>
              <RefreshCw className="size-4" /> Sincronizar agora
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Auditoria recente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {audit.length === 0 ? (
            <p className="text-muted-foreground">Nenhum registro ainda.</p>
          ) : (
            audit
              .slice()
              .sort((a, b) => b.created_at.localeCompare(a.created_at))
              .slice(0, 25)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap gap-2 border-b border-border pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{formatDateTime(entry.created_at)}</span>
                  <span className="font-medium">{entry.author}</span>
                  <span>
                    {entry.entity}.{entry.field}: {entry.old_value ?? "—"} →{" "}
                    {entry.new_value ?? "—"}
                  </span>
                  {entry.comment ? (
                    <span className="text-muted-foreground">({entry.comment})</span>
                  ) : null}
                </div>
              ))
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
