// Public browser configuration for the existing GAEVA project.
// This publishable key is intentionally public; authentication and RLS still apply.
// Never add a service_role key, sb_secret key, password, or token here.
const gaevaPublicConfig = {
  url: "https://wohkhxculmrfavnbykkk.supabase.co",
  publishableKey: "sb_publishable_gZVXXnd68svIqwY2Au7dqQ_ai62eERD",
};

type SupabaseEnvironment = {
  url?: string | undefined;
  publishableKey?: string | undefined;
  anonKey?: string | undefined;
};

export function resolveSupabaseConfig(environment: SupabaseEnvironment) {
  const url = environment.url?.trim();
  const publishableKey = environment.publishableKey?.trim() || environment.anonKey?.trim();

  // Lovable previews may not inject VITE_* variables. Use the verified public
  // project configuration only when no override has been provided.
  if (!url && !publishableKey) return gaevaPublicConfig;

  // Never mix an overridden URL with a key from another project.
  if (!url || !publishableKey) return null;

  return { url, publishableKey };
}
