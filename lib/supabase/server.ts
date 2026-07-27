import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * A read-only Supabase client for server components and route handlers.
 * Uses the public anon key with Row Level Security, so it can only read
 * the content you've marked as published.
 *
 * Returns `null` if the environment variables aren't set yet, so the site
 * keeps building/rendering before you finish the Supabase setup.
 */
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY not set — content will be empty."
      );
    }
    cached = null;
    return cached;
  }

  cached = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  return cached;
}
