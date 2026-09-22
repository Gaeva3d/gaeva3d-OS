import { LoaderCircle, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordForm } from "./password-form";

export function FirstAccessScreen({ onSignOut }: { onSignOut: () => Promise<void> }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Defina sua senha</CardTitle>
          <p className="text-sm text-muted-foreground">
            Bem-vindo ao GAEVA OS. Substitua a senha temporária para acessar sua operação.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <PasswordForm />
          <Button variant="ghost" className="w-full" onClick={() => void onSignOut()}>
            Sair
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export function AuthScreen({
  configured,
  error,
  onSignIn,
}: {
  configured: boolean;
  error?: string | null;
  onSignIn: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string | undefined }>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const result = await onSignIn(email.trim(), password);
    if (!result.ok) setFormError(result.error ?? "Não foi possível entrar.");
    setSubmitting(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LockKeyhole className="size-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">GAEVA OS</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Acesso interno à operação 3D</p>
          </div>
        </CardHeader>
        <CardContent>
          {!configured ? (
            <div className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
              A conexão foi criada, mas as variáveis do Supabase ainda não estão disponíveis neste
              ambiente.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-1.5">
                <Label htmlFor="login-email">E-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-password">Senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {formError || error ? (
                <p className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
                  {formError ?? error}
                </p>
              ) : null}
              <Button className="w-full" type="submit" disabled={submitting}>
                {submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
                Entrar
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Primeiro acesso? Use o e-mail e a senha temporária fornecidos pela administração.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export function AppLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="size-4 animate-spin" /> Carregando operação…
      </div>
    </div>
  );
}
