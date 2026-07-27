import Anthropic from "@anthropic-ai/sdk";
import { buildKnowledgeBase } from "@/lib/content";

// Always run fresh on the server so the assistant sees the latest content.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// claude-haiku-4-5 is fast + cost-efficient — Anthropic's recommended tier
// for chat assistants. Override with ASSISTANT_MODEL if you want Sonnet, etc.
const MODEL = process.env.ASSISTANT_MODEL ?? "claude-haiku-4-5";

const MAX_TURNS = 12; // keep the last N visitor/assistant messages
const MAX_CHARS = 2000; // per incoming message

type Role = "user" | "assistant";
interface ChatMessage {
  role: Role;
  content: string;
}

// Best-effort in-memory rate limit. Fine for a personal site; for heavier
// traffic use a durable store (e.g. Upstash Redis) instead.
const WINDOW_MS = 60_000;
const MAX_REQ = 15;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQ;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "The assistant isn't configured yet." },
      { status: 503 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "Too many messages. Please wait a moment." },
      { status: 429 }
    );
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages: ChatMessage[] = raw
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof (m as ChatMessage).content === "string" &&
        ((m as ChatMessage).role === "user" ||
          (m as ChatMessage).role === "assistant")
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "No question provided." }, { status: 400 });
  }

  const kb = await buildKnowledgeBase();

  const system = `You are the AI assistant on ${kb.ownerName}'s personal website — a living hub for their professional work.

Your job: help visitors understand ${kb.ownerName}'s background, skills, projects, experience, and how to work with them.

Rules:
- Answer ONLY from the information below. Never invent facts, dates, employers, tools, or achievements.
- If something isn't covered, say you don't have that detail and point the visitor to the contact section of the site${
    kb.hasContact ? " (or the contact info listed above)" : ""
  }.
- Be concise, warm, and professional — match the site's calm, minimal tone. A few sentences is usually enough.
- Reply in the visitor's language (they may write in Indonesian or English).
- Speak about ${kb.ownerName} in the third person. Don't roleplay as them.
- When a visitor shows hiring or collaboration interest, briefly encourage them to get in touch.
- Stay on topic: ${kb.ownerName}'s work and how to reach them.

--- KNOWLEDGE BASE (live from the site's database) ---
${kb.text}
--- END KNOWLEDGE BASE ---`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const ai = client.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system,
          messages,
        });
        for await (const event of ai) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("[assistant] stream error:", err);
        controller.enqueue(
          encoder.encode(
            "\n\nSorry — something went wrong. Please try again in a moment."
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
