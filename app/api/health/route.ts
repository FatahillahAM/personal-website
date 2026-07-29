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

  // The project host is already public (it ships to every browser as a
  // NEXT_PUBLIC_ variable), so showing it here leaks nothing — and it lets you
  // confirm the site is pointed at the same project you ran the SQL in.
  let supabaseProject: string | null = null;
  try {
    supabaseProject = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
      : null;
  } catch {
    supabaseProject = "invalid URL — check NEXT_PUBLIC_SUPABASE_URL";
  }

  const tables: Record<string, unknown> = {};
  let databaseReachable = false;
  let anyRowsReturned = false;

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
      // Actually fetch a row. Relying on the count header alone was
      // unreliable: when it's absent the count is null, which is easy to
      // misread as "empty". Fetching proves whether data really comes back.
      const { data, error, count } = await db
        .from(table)
        .select("*", { count: "exact" })
        .limit(1);

      if (error) {
        tables[table] = `error: ${error.message}`;
      } else {
        const returned = data?.length ?? 0;
        if (returned > 0) anyRowsReturned = true;
        databaseReachable = true;
        tables[table] = {
          reportedCount: count,
          rowReturned: returned > 0,
        };
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
      "Supabase keys are set but no table could be read. Run supabase/setup.sql."
    );
  if (databaseReachable && !anyRowsReturned)
    problems.push(
      "Connected, but no table returned a row. Confirm that the SQL was run in " +
        `the same project the site points at (${supabaseProject}), and that the ` +
        "anon key belongs to that same project."
    );

  return Response.json(
    {
      ok: problems.length === 0,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: hasSupabaseUrl,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: hasSupabaseKey,
        ANTHROPIC_API_KEY: hasAnthropicKey,
      },
      supabaseProject,
      databaseReachable,
      anyRowsReturned,
      tables,
      problems,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
