import type { SupabaseClient, createClient as clientFactory } from "@supabase/supabase-js";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};
const roles = new Set(["admin", "commercial", "production", "designer", "viewer"]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function temporaryPassword() {
  return (
    "Aa1!" +
    Array.from(crypto.getRandomValues(new Uint8Array(16)), (n) =>
      n.toString(16).padStart(2, "0"),
    ).join("")
  );
}

function response(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers });
}

async function findProfile(client: SupabaseClient, email: string) {
  const { data, error } = await client
    .from("profiles")
    .select("id,email,is_active")
    .eq("email", email)
    .maybeSingle();
  if (error) throw new Error("Não foi possível consultar a conta. Tente novamente.");
  return data;
}

export function createTeamAccessHandler(config: {
  url: string;
  publicKey: string;
  serviceKey: string;
  createClient: typeof clientFactory;
}) {
  return async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return response(405, { error: "Método não permitido." });
    const authorization = request.headers.get("Authorization") ?? "";
    if (!/^Bearer \S+$/i.test(authorization))
      return response(401, { error: "Entre no sistema para continuar." });
    if (!config.url || !config.publicKey || !config.serviceKey)
      return response(503, { error: "O serviço de acesso ainda não está disponível." });
    const options = { auth: { persistSession: false, autoRefreshToken: false } };
    const admin = config.createClient(config.url, config.serviceKey, options);
    const caller = config.createClient(config.url, config.publicKey, {
      ...options,
      global: { headers: { Authorization: authorization } },
    });
    try {
      // Verify the token with Auth, then consult the current trusted profile.
      const { data: identity, error: identityError } = await admin.auth.getUser(
        authorization.slice(7),
      );
      if (identityError || !identity.user)
        return response(401, { error: "Sessão expirada. Entre novamente." });
      const user = identity.user;
      const { data: profile, error: profileError } = await caller
        .from("profiles")
        .select("role,is_active")
        .eq("id", user.id)
        .single();
      if (profileError || !profile?.is_active)
        return response(403, { error: "Seu acesso está inativo ou indisponível." });
      const raw = await request.text();
      if (raw.length > 8192) return response(413, { error: "Solicitação muito grande." });
      let input: Record<string, unknown>;
      try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
        input = parsed;
      } catch {
        return response(400, { error: "Solicitação inválida." });
      }

      if (input.action === "change_password") {
        const password = typeof input.password === "string" ? input.password : "";
        if (password.length < 12 || password.length > 128 || !password.trim())
          return response(400, { error: "A senha deve ter entre 12 e 128 caracteres." });
        // The target is always the verified caller, never a client-supplied ID.
        const { error } = await admin.auth.admin.updateUserById(user.id, {
          password,
          app_metadata: { ...user.app_metadata, gaeva_requires_password_change: false },
        });
        if (error)
          return response(400, {
            error:
              "Não foi possível salvar. Escolha uma senha diferente, com pelo menos 12 caracteres.",
          });
        return response(200, { ok: true });
      }

      if (profile.role !== "admin" || user.app_metadata?.gaeva_requires_password_change === true)
        return response(403, {
          error:
            "Somente administradores com acesso ativo podem gerenciar contas. Troque a senha temporária antes de continuar.",
        });
      if (input.action === "reset_password") {
        if (typeof input.memberId !== "string" || !uuid.test(input.memberId))
          return response(400, { error: "Integrante inválido." });
        const { data: member, error: memberError } = await caller
          .from("team_members")
          .select("id,name,user_id,email,is_active,deleted_at")
          .eq("id", input.memberId)
          .single();
        if (memberError || !member?.user_id || !member.is_active || member.deleted_at)
          return response(409, { error: "O integrante precisa ter uma conta ativa vinculada." });
        if (member.user_id === user.id)
          return response(400, { error: "Use Alterar senha para modificar sua própria senha." });
        const { data: targetProfile } = await caller
          .from("profiles")
          .select("is_active")
          .eq("id", member.user_id)
          .single();
        const { data: target, error: targetError } = await admin.auth.admin.getUserById(
          member.user_id,
        );
        if (!targetProfile?.is_active || targetError || !target.user)
          return response(409, { error: "Conta inativa ou indisponível." });
        const password = temporaryPassword();
        const { error } = await admin.auth.admin.updateUserById(member.user_id, {
          password,
          app_metadata: { ...target.user.app_metadata, gaeva_requires_password_change: true },
        });
        if (error) return response(400, { error: "Não foi possível gerar a senha temporária." });
        return response(200, {
          ok: true,
          memberId: member.id,
          email: target.user.email,
          password,
          created: false,
        });
      }

      if (input.action !== "create_access") return response(400, { error: "Ação inválida." });
      const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
        return response(400, { error: "Informe um e-mail válido." });
      const memberId = input.memberId;
      if (memberId != null && (typeof memberId !== "string" || !uuid.test(memberId)))
        return response(400, { error: "Integrante inválido." });
      if (
        !memberId &&
        (typeof input.name !== "string" ||
          !input.name.trim() ||
          input.name.trim().length > 120 ||
          typeof input.role !== "string" ||
          !roles.has(input.role) ||
          !Number.isInteger(input.capacity) ||
          Number(input.capacity) < 1 ||
          Number(input.capacity) > 10000 ||
          typeof input.jobTitle !== "string" ||
          input.jobTitle.length > 120)
      )
        return response(400, { error: "Confira nome, perfil e capacidade do integrante." });

      const { data: member, error: prepareError } = await caller.rpc("prepare_team_access", {
        p_email: email,
        p_member_id: memberId ?? null,
        p_name: input.name ?? null,
        p_role: input.role ?? "production",
        p_job_title: input.jobTitle ?? null,
        p_capacity: input.capacity ?? 3,
      });
      if (prepareError || !member)
        return response(409, {
          error: prepareError?.message ?? "Não foi possível preparar o cadastro.",
        });
      let existing = await findProfile(caller, email);
      let targetId = existing?.id as string | undefined;
      let password: string | undefined;
      let created = false;
      if (!targetId) {
        const generated = temporaryPassword();
        const { data: newIdentity, error: createError } = await admin.auth.admin.createUser({
          email,
          password: generated,
          email_confirm: true,
          app_metadata: { full_name: member.name, gaeva_requires_password_change: true },
        });
        if (!createError && newIdentity.user) {
          targetId = newIdentity.user.id;
          password = generated;
          created = true;
        } else {
          // A concurrent create or an interrupted response must not duplicate users.
          existing = await findProfile(caller, email);
          targetId = existing?.id;
          if (!targetId)
            return response(409, {
              error:
                "O integrante foi salvo, mas a conta não foi criada. Tente novamente em Criar acesso.",
            });
        }
      }
      const { data: target, error: targetError } = await admin.auth.admin.getUserById(targetId!);
      if (targetError || !target.user?.email_confirmed_at)
        return response(409, { error: "Este e-mail possui uma conta pendente de confirmação." });
      const { data: linked, error: linkError } = await caller.rpc("link_team_access", {
        p_member_id: member.id,
        p_user_id: targetId,
      });
      if (linkError || !linked)
        return response(409, {
          error:
            linkError?.message ??
            "A conta foi criada, mas falta concluir o vínculo. Tente novamente em Criar acesso.",
        });
      return response(200, { ok: true, memberId: linked.id, email, password, created });
    } catch {
      // Never log request bodies, Auth responses, keys, or generated passwords.
      return response(500, {
        error:
          "Não foi possível concluir. Atualize a equipe e tente novamente; cadastros existentes serão reaproveitados.",
      });
    }
  };
}
