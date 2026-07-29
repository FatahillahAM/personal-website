import { getSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Configuration check. Visit /api/health to see what's wired up.
 * Reports only booleans and row counts — never the key values themselves.
 */
export async function GET() {
  const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasAnthropicKey = Boolean(process.env.ANTHROPIC_API_KEY);

  const tables: Record<string, number | string> = {};
  let databaseReachable = false;

  const db = getSupabase();
  if (db) {
    for (const table of [
      "profile",
      "services",
      "skills",
      "projects",
      "experiences",
      "certifications",
      "knowledge_notes",
    ]) {
      const { count, error } = await db
        .from(table)
        .select("*", { count: "exact", head: true });
      if (error) {
        tables[table] = `error: ${error.message}`;
      } else {
        tables[table] = count ?? 0;
        databaseReachable = true;
      }
    }
  }

  const problems: string[] = [];
  if (!hasSupabaseUrl) problems.push("NEXT_PUBLIC_SUPABASE_URL is not set.");
  if (!hasSupabaseKey)
    problems.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.");
  if (!hasAnthropicKey)
    problems.push("ANTHROPIC_API_KEY is not set — the AI assistant is disabled.");
  if (hasSupabaseUrl && hasSupabaseKey && !databaseReachable)
    problems.push(
      "Supabase keys are set but no table could be read. Run schema.sql, then seed.sql."
    );
  if (databaseReachable && tables.projects === 0)
    problems.push("Connected, but the projects table is empty. Run seed.sql.");

  return Response.json(
    {
      ok: problems.length === 0,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: hasSupabaseUrl,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: hasSupabaseKey,
        ANTHROPIC_API_KEY: hasAnthropicKey,
      },
      databaseReachable,
      rowCounts: tables,
      problems,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
