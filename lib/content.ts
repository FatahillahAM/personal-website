import { getSupabase } from "@/lib/supabase/server";

// ---------- types ----------
export interface Profile {
  name: string;
  title: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  socials: Record<string, string>;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  category: string | null;
  year: string | null;
  description: string | null;
  image: string | null;
  href: string;
  external: boolean;
  tags: string[];
}

export interface Experience {
  id: string;
  kind: "work" | "education";
  role: string;
  organization: string | null;
  period: string | null;
  description: string | null;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string | null;
}

export interface KnowledgeNote {
  id: string;
  topic: string;
  content: string;
}

// ---------- fetchers (each degrades gracefully to a safe default) ----------
export async function getProfile(): Promise<Profile | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db
    .from("profile")
    .select("name,title,headline,bio,location,email,phone,socials")
    .eq("id", 1)
    .maybeSingle();
  if (error) console.error("[content] profile:", error.message);
  return (data as Profile) ?? null;
}

export async function getServices(): Promise<Service[]> {
  const db = getSupabase();
  if (!db) return [];
  const { data, error } = await db
    .from("services")
    .select("id,title,description,sort_order")
    .order("sort_order", { ascending: true });
  if (error) console.error("[content] services:", error.message);
  return (data as Service[]) ?? [];
}

export async function getSkills(): Promise<string[]> {
  const db = getSupabase();
  if (!db) return [];
  const { data, error } = await db
    .from("skills")
    .select("name")
    .order("sort_order", { ascending: true });
  if (error) console.error("[content] skills:", error.message);
  return (data ?? []).map((s: { name: string }) => s.name);
}

export async function getProjects(): Promise<Project[]> {
  const db = getSupabase();
  if (!db) return [];
  const { data, error } = await db
    .from("projects")
    .select("id,title,category,year,description,image,href,external,tags")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) console.error("[content] projects:", error.message);
  return (data as Project[]) ?? [];
}

export async function getExperiences(
  kind: "work" | "education"
): Promise<Experience[]> {
  const db = getSupabase();
  if (!db) return [];
  const { data, error } = await db
    .from("experiences")
    .select("id,kind,role,organization,period,description")
    .eq("kind", kind)
    .order("sort_order", { ascending: true });
  if (error) console.error("[content] experiences:", error.message);
  return (data as Experience[]) ?? [];
}

export async function getCertifications(): Promise<Certification[]> {
  const db = getSupabase();
  if (!db) return [];
  const { data, error } = await db
    .from("certifications")
    .select("id,title,issuer")
    .order("sort_order", { ascending: true });
  if (error) console.error("[content] certifications:", error.message);
  return (data as Certification[]) ?? [];
}

export async function getKnowledgeNotes(): Promise<KnowledgeNote[]> {
  const db = getSupabase();
  if (!db) return [];
  const { data, error } = await db
    .from("knowledge_notes")
    .select("id,topic,content")
    .eq("published", true);
  if (error) console.error("[content] knowledge_notes:", error.message);
  return (data as KnowledgeNote[]) ?? [];
}

/**
 * Assemble everything into one plain-text knowledge base for the AI.
 * Because it reads live from the database, the assistant always answers
 * from the latest content — edit in Supabase and it updates instantly.
 */
export async function buildKnowledgeBase(): Promise<{
  ownerName: string;
  hasContact: boolean;
  text: string;
}> {
  const [profile, services, skills, projects, work, education, certs, notes] =
    await Promise.all([
      getProfile(),
      getServices(),
      getSkills(),
      getProjects(),
      getExperiences("work"),
      getExperiences("education"),
      getCertifications(),
      getKnowledgeNotes(),
    ]);

  const ownerName = profile?.name ?? "the site owner";
  const lines: string[] = [];

  if (profile) {
    lines.push("## Profile");
    lines.push(`Name: ${profile.name}`);
    if (profile.title) lines.push(`Title: ${profile.title}`);
    if (profile.headline) lines.push(`Headline: ${profile.headline}`);
    if (profile.location) lines.push(`Location: ${profile.location}`);
    if (profile.bio) lines.push(`Bio: ${profile.bio}`);
    if (profile.email) lines.push(`Public email: ${profile.email}`);
    if (profile.phone) lines.push(`Public phone: ${profile.phone}`);
    const socials = Object.entries(profile.socials ?? {});
    if (socials.length)
      lines.push(
        `Links: ${socials.map(([k, v]) => `${k}: ${v}`).join(", ")}`
      );
    lines.push("");
  }

  if (services.length) {
    lines.push("## What he does");
    for (const s of services)
      lines.push(`- ${s.title}${s.description ? `: ${s.description}` : ""}`);
    lines.push("");
  }

  if (skills.length) {
    lines.push("## Skills & tools");
    lines.push(skills.join(", "));
    lines.push("");
  }

  if (projects.length) {
    lines.push("## Projects");
    for (const p of projects) {
      const meta = [p.category, p.year].filter(Boolean).join(" · ");
      lines.push(`### ${p.title}${meta ? ` (${meta})` : ""}`);
      if (p.description) lines.push(p.description);
      if (p.tags?.length) lines.push(`Tags: ${p.tags.join(", ")}`);
      if (p.external && p.href) lines.push(`Link: ${p.href}`);
      lines.push("");
    }
  }

  if (work.length) {
    lines.push("## Work experience");
    for (const e of work) {
      lines.push(
        `- ${e.role}${e.organization ? `, ${e.organization}` : ""}${
          e.period ? ` (${e.period})` : ""
        }${e.description ? ` — ${e.description}` : ""}`
      );
    }
    lines.push("");
  }

  if (education.length) {
    lines.push("## Education");
    for (const e of education) {
      lines.push(
        `- ${e.role}${e.organization ? `, ${e.organization}` : ""}${
          e.period ? ` (${e.period})` : ""
        }${e.description ? ` — ${e.description}` : ""}`
      );
    }
    lines.push("");
  }

  if (certs.length) {
    lines.push("## Certifications");
    for (const c of certs)
      lines.push(`- ${c.title}${c.issuer ? ` — ${c.issuer}` : ""}`);
    lines.push("");
  }

  if (notes.length) {
    lines.push("## Additional notes");
    for (const n of notes) lines.push(`- ${n.topic}: ${n.content}`);
    lines.push("");
  }

  return {
    ownerName,
    hasContact: Boolean(profile?.email || profile?.phone),
    text: lines.join("\n").trim(),
  };
}
