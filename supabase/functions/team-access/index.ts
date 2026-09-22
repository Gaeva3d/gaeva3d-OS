import { createClient } from "@supabase/supabase-js";
import { createTeamAccessHandler } from "./handler.ts";

Deno.serve(
  createTeamAccessHandler({
    url: Deno.env.get("SUPABASE_URL") ?? "",
    publicKey: Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    serviceKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    createClient,
  }),
);
