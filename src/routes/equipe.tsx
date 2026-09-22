import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell } from "@/components/gaeva/app-shell";
import { TeamAccessDialog } from "@/components/gaeva/team-access-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initials, isClosed, isLate } from "@/lib/gaeva/helpers";
import { useGaeva } from "@/lib/gaeva/store";
import { ROLE_LABELS, type Role } from "@/lib/gaeva/types";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { title: "Equipe — GAEVA OS" },
      { name: "description", content: "Equipe GAEVA: papéis, especialidades e carga de trabalho." },
      { property: "og:title", content: "Equipe — GAEVA OS" },
      { property: "og:description", content: "Equipe GAEVA e carga de trabalho." },
    ],
  }),
  component: TeamPage,
});

const ROLES: Role[] = ["admin", "comercial", "producao", "designer", "visualizacao"];

function TeamPage() {
  const { team, orders, upsertTeamMember, can, authUser } = useGaeva();
  const editable = can("manage_settings");

  return (
    <AppShell
      title="Equipe"
      description="Papéis, capacidade e carga atual"
      actions={<TeamAccessDialog />}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {team.map((member) => {
          const load = orders.filter((o) => o.owner_id === member.id && !isClosed(o));
          const late = load.filter(isLate).length;
          const pct = Math.min(100, Math.round((load.length / Math.max(member.capacity, 1)) * 100));
          return (
            <Card key={member.id}>
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <Avatar>
                  <AvatarFallback>{initials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{member.name}</CardTitle>
                  <p className="truncate text-xs text-muted-foreground">{member.job_title}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">{ROLE_LABELS[member.role]}</Badge>
                  {member.specialties.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                  {!member.active ? <Badge variant="outline">Inativo</Badge> : null}
                </div>

                <div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Carga atual</span>
                    <span className="tabular-nums">
                      {load.length}/{member.capacity}
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  {late > 0 ? (
                    <p className="mt-1 text-xs text-destructive">{late} pedido(s) em atraso</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  {member.email ? (
                    <p className="break-all text-xs text-muted-foreground">{member.email}</p>
                  ) : null}
                  <Badge variant="outline">
                    {member.user_id ? "Acesso vinculado" : "Sem acesso ao sistema"}
                  </Badge>
                  {editable && (!member.user_id || member.user_id !== authUser.id) ? (
                    <div>
                      <TeamAccessDialog member={member} reset={!!member.user_id} />
                    </div>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <Label>Papel</Label>
                  <Select
                    value={member.role}
                    disabled={!editable}
                    onValueChange={async (v) => {
                      const result = await upsertTeamMember({
                        id: member.id,
                        name: member.name,
                        role: v as Role,
                      });
                      if (result.ok) toast.success("Papel atualizado.");
                      else toast.error(result.error ?? "Não foi possível atualizar o papel.");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROLE_LABELS[r]}
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
