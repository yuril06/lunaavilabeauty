import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only client using the service role key.
// Never import this file from a Client Component — the service role key
// bypasses Row Level Security and must stay on the server.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase server env vars are missing.");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
