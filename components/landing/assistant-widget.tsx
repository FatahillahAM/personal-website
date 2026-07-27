"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X, ArrowUp, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What kind of work does he do?",
  "Tell me about his experience",
  "What tools does he use?",
  "How can I get in touch?",
];

export function AssistantWidget({ ownerName }: { ownerName?: string }) {
  const who = ownerName ? ownerName.split(" ")[0] : "my";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;

    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({ error: null }));
        throw new Error(error ?? "Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (err) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again.";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: msg };
        return copy;
      });
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/90 px-4 py-3 text-sm shadow-lg backdrop-blur transition-all duration-300 hover:border-foreground/30 hover:shadow-xl motion-reduce:transition-none"
      >
        {open ? (
          <X className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        <span className="font-mono">
          {open ? "Close" : "Ask about my work"}
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="AI assistant"
          className="fixed bottom-24 right-6 z-50 flex w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-2xl duration-300 animate-in fade-in slide-in-from-bottom-4 motion-reduce:animate-none"
          style={{ height: "min(560px, calc(100vh - 8rem))" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-foreground/10 px-5 py-4">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                AI Assistant
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask anything about {ownerName ?? "my"}
                {ownerName ? "'s work" : " work"}.
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Hi — I can answer questions about {who}
                  {ownerName ? "’s" : ""} background, projects, and skills, straight
                  from what’s on this site.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full rounded-xl border border-foreground/10 px-3.5 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:border-foreground/25 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-foreground px-4 py-2.5 text-sm leading-relaxed text-background"
                        : "max-w-[90%] text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap"
                    }
                  >
                    {m.content ||
                      (busy && i === messages.length - 1 ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground motion-reduce:animate-none" />
                      ) : (
                        ""
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="border-t border-foreground/10 p-3">
            <div className="flex items-end gap-2 rounded-xl border border-foreground/15 bg-background px-3 py-2 focus-within:border-foreground/30">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Type your question…"
                className="max-h-28 flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => send(input)}
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="shrink-0 rounded-full bg-foreground p-2 text-background transition-opacity disabled:opacity-30"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-2 px-1 font-mono text-[10px] text-muted-foreground">
              AI answers are based on this site’s content.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
