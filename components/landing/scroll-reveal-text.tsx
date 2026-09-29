"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";

type ScrollRevealTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Opacity kata yang belum "terbaca" (0–1). */
  dimOpacity?: number;
};

/**
 * Teks yang menyala kata per kata mengikuti scroll.
 * Tanpa dependency: progres scroll disimpan di CSS variable `--p`,
 * jadi tidak ada re-render React di setiap frame.
 */
export function ScrollRevealText({
  text,
  as: Tag = "p",
  className = "",
  dimOpacity = 0.15,
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.trim().split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Hormati pengaturan "reduce motion": langsung tampil penuh.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Mulai saat teks masuk di 85% tinggi layar,
      // selesai saat bagian bawahnya mencapai tengah layar.
      const start = vh * 0.85;
      const distance = vh * 0.35 + rect.height;
      const progress = Math.min(Math.max((start - rect.top) / distance, 0), 1);
      el.style.setProperty("--p", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ "--p": 0, "--n": words.length } as CSSProperties}
    >
      {/* Teks utuh untuk screen reader */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span
            key={i}
            className="transition-opacity duration-200 ease-out"
            style={
              {
                "--i": i,
                opacity: `clamp(${dimOpacity}, calc(var(--p) * var(--n) - var(--i)), 1)`,
              } as CSSProperties
            }
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}
