import { Copy, KeyRound, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useGaeva } from "@/lib/gaeva/store";
import { ROLE_TO_DB } from "@/lib/gaeva/supabase-mappers";
import { manageTeamAccess, type AccessResult } from "@/lib/gaeva/team-access";
import { ROLE_LABELS, type Role, type TeamMember } from "@/lib/gaeva/types";

const roles: Role[] = ["admin", "comercial", "producao", "designer", "visualizacao"];

export function TeamAccessDialog({
  member,
  reset = false,
}: {
  member?: TeamMember;
  reset?: boolean;
}) {
  const { can, refreshData, upsertTeamMember } = useGaeva();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(member?.email ?? "");
  const [role, setRole] = useState<Role>("producao");
  const [jobTitle, setJobTitle] = useState("");
  const [capacity, setCapacity] = useState("3");
  const [createLogin, setCreateLogin] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AccessResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const title = reset ? "Gerar nova senha temporária" : member ? "Criar acesso" : "Novo integrante";
  const changeOpen = (next: boolean) => {
    if (busy) return;
    setOpen(next);
    setError("");
    setResult(null);
    setShowPassword(false);
    if (next) {
      setEmail(member?.email ?? "");
      setName("");
      setRole("producao");
      setJobTitle("");
      setCapacity("3");
      setCreateLogin(true);
    }
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (!member && !createLogin) {
        const saved = await upsertTeamMember({
          name: name.trim(),
          email: email.trim() || null,
          role,
          job_title: jobTitle.trim() || ROLE_LABELS[role],
          capacity: Number(capacity),
          active: true,
          specialties: [],
        });
        if (!saved.ok) throw new Error(saved.error);
        setOpen(false);
        toast.success("Integrante cadastrado sem acesso ao sistema.");
      } else {
        const access = await manageTeamAccess(
          reset
            ? { action: "reset_password", memberId: member!.id }
            : {
                action: "create_access",
                email,
                ...(member
                  ? { memberId: member.id }
                  : {
                      name,
                      role: ROLE_TO_DB[role],
                      jobTitle: jobTitle || ROLE_LABELS[role],
                      capacity: Number(capacity),
                    }),
              },
        );
        setResult(access);
        await refreshData();
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível concluir o cadastro.");
    } finally {
      setBusy(false);
    }
  };
  const copy = async () => {
    if (!result?.password) return;
    try {
      await navigator.clipboard.writeText(
        `GAEVA OS\nE-mail: ${result.email}\nSenha temporária: ${result.password}\nTroque a senha no primeiro acesso.`,
      );
      toast.success("Dados de acesso copiados.");
    } catch {
      setShowPassword(true);
      toast.error("Copie a senha exibida abaixo.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={member ? "outline" : "default"}
          disabled={!can("manage_settings") || member?.active === false}
        >
          {member ? <KeyRound className="size-4" /> : <Plus className="size-4" />}
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{result ? "Acesso vinculado" : title}</DialogTitle>
          <DialogDescription>
            {result
              ? "A conta está associada ao cadastro da equipe."
              : reset
                ? `A senha atual de ${member?.name} será substituída. A pessoa precisará trocar a senha temporária ao entrar.`
                : member
                  ? `Libere o acesso de ${member.name} mantendo o cadastro e as atribuições existentes.`
                  : "Cadastre a pessoa e escolha o perfil de acesso."}
          </DialogDescription>
        </DialogHeader>
        {result ? (
          <div className="space-y-4">
            <div>
              <Label>E-mail de acesso</Label>
              <p className="break-all text-sm">{result.email}</p>
            </div>
            {result.password ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="generated-password">Senha temporária</Label>
                  <Input
                    id="generated-password"
                    readOnly
                    type={showPassword ? "text" : "password"}
                    value={result.password}
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Ocultar senha" : "Mostrar senha"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Copie antes de fechar. Esta senha não ficará disponível para consulta e não será
                  enviada por e-mail. Compartilhe os dados com a pessoa; ela definirá a própria
                  senha ao entrar.
                </p>
                <Button type="button" className="w-full" onClick={() => void copy()}>
                  <Copy className="size-4" />
                  Copiar dados de acesso
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                A conta já existia e foi vinculada. A pessoa pode entrar com a senha que já utiliza.
                Se necessário, gere uma nova senha temporária no cartão do integrante.
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => changeOpen(false)}
            >
              Concluir
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {!member ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="team-name">Nome</Label>
                  <Input
                    id="team-name"
                    required
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team-job">Cargo</Label>
                  <Input
                    id="team-job"
                    maxLength={120}
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team-role">Perfil de acesso</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                    <SelectTrigger id="team-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team-capacity">Capacidade de pedidos simultâneos</Label>
                  <Input
                    id="team-capacity"
                    type="number"
                    min={1}
                    max={10000}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={createLogin}
                    onChange={(e) => setCreateLogin(e.target.checked)}
                  />
                  Criar acesso ao sistema
                </label>
              </>
            ) : null}
            {!reset ? (
              <div className="space-y-1.5">
                <Label htmlFor="team-email">
                  E-mail{createLogin ? " de acesso" : " (opcional)"}
                </Label>
                <Input
                  id="team-email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required={!!member || createLogin}
                  readOnly={!!member?.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {createLogin ? (
                  <p className="text-xs text-muted-foreground">
                    O sistema gera a senha temporária após salvar.
                  </p>
                ) : null}
              </div>
            ) : null}
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={busy} className="w-full">
              {busy
                ? "Preparando acesso…"
                : reset
                  ? "Confirmar e gerar senha"
                  : createLogin
                    ? "Salvar e criar acesso"
                    : "Salvar integrante"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
