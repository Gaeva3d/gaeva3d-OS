import { createClient } from "@supabase/supabase-js";

import { resolveSupabaseConfig } from "./public-config";
import type { Database } from "./types";

const config = resolveSupabaseConfig({
  url: import.meta.env["VITE_SUPABASE_URL"] as string | undefined,
  publishableKey: import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined,
  anonKey: import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined,
});

export const isSupabaseConfigured = config !== null;

export const supabase = config
  ? createClient<Database>(config.url, config.publishableKey, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
        detectSessionInUrl: typeof window !== "undefined",
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Configuração Supabase incompleta. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY juntas.",
    );
  }
  return supabase;
}
