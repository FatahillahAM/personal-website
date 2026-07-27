"use client";

import { useEffect, useRef, useState } from "react";
import type { Experience, Certification } from "@/lib/content";

function ExperienceRow({ item, index }: { item: Experience; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className={`group grid md:grid-cols-12 gap-4 md:gap-8 py-8 lg:py-10 border-b border-foreground/10 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="md:col-span-3">
        <p className="text-sm font-mono text-muted-foreground">{item.period}</p>
      </div>
      <div className="md:col-span-9">
        <h3 className="text-xl lg:text-2xl font-display group-hover:translate-x-1 transition-transform duration-500">
          {item.role}
        </h3>
        {item.organization && (
          <p className="mt-1 text-muted-foreground">{item.organization}</p>
        )}
        {item.description && (
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

export function ExperienceSectionClient({
  work,
  education,
  certifications,
}: {
  work: Experience[];
  education: Experience[];
  certifications: Certification[];
}) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-t border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Experience
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Where I&apos;ve
            <br />
            worked.
          </h2>
        </div>

        {/* Work timeline */}
        <div className="border-t border-foreground/10">
          {work.map((item, index) => (
            <ExperienceRow key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
              <span className="w-8 h-px bg-foreground/30" />
              Education
            </span>
            <div className="border-t border-foreground/10">
              {education.map((item, index) => (
                <ExperienceRow key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
              <span className="w-8 h-px bg-foreground/30" />
              Certification
            </span>
            <ul className="border-t border-foreground/10">
              {certifications.map((item) => (
                <li
                  key={item.id}
                  className="py-6 border-b border-foreground/10 text-muted-foreground leading-relaxed max-w-3xl"
                >
                  {item.title}
                  {item.issuer ? ` — ${item.issuer}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
