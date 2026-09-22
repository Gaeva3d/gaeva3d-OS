import { requireSupabase } from "@/integrations/supabase/client";

export interface AccessResult {
  ok: boolean;
  memberId?: string;
  email?: string;
  password?: string;
  created?: boolean;
}

// Credentials stay in component memory only; never use query caches or storage.
export async function manageTeamAccess(body: Record<string, unknown>): Promise<AccessResult> {
  const { data, error } = await requireSupabase().functions.invoke<
    AccessResult & { error?: string }
  >("team-access", { body });
  if (error) {
    let message = "Não foi possível concluir. Confira sua conexão e tente novamente.";
    if (error.context instanceof Response) {
      const result = await error.context.json().catch(() => null);
      if (typeof result?.error === "string") message = result.error;
    }
    throw new Error(message);
  }
  if (!data?.ok) throw new Error(data?.error ?? "Não foi possível concluir o acesso.");
  return data;
}

export async function changeOwnPassword(password: string) {
  await manageTeamAccess({ action: "change_password", password });
  const { error } = await requireSupabase().auth.refreshSession();
  if (error) {
    await requireSupabase().auth.signOut({ scope: "local" });
    throw new Error("Senha alterada. Entre novamente com a nova senha.");
  }
}
