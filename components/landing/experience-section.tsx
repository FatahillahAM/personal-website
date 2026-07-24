"use client";

import { useEffect, useRef, useState } from "react";

const experience = [
  {
    role: "Lead Product Designer",
    company: "Northwind",
    period: "2022 — Present",
    description: "Leading product design for a B2B platform, owning the design system and mentoring a team of three designers.",
  },
  {
    role: "Senior Designer",
    company: "Studio Kava. ",
    period: "2019 — 2022",
    description: "Delivered brand identities and digital products for clients across fintech, travel, and consumer tech.",
  },
  {
    role: "Product Designer",
    company: "Bloom Labs",
    period: "2017 — 2019",
    description: "Designed mobile-first experiences for an early-stage startup, from onboarding to core feature flows.",
  },
  {
    role: "Visual Design Intern",
    company: "Meridian Agency",
    period: "2016 — 2017",
    description: "Supported the creative team on campaigns, social, and marketing collateral for global brands.",
  },
];

function ExperienceRow({ item, index }: { item: (typeof experience)[0]; index: number }) {
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
        <span className="font-mono text-sm text-muted-foreground">{item.period}</span>
      </div>
      <div className="md:col-span-4">
        <h3 className="text-xl lg:text-2xl font-display group-hover:translate-x-1 transition-transform duration-500">
          {item.role}
        </h3>
        <p className="text-muted-foreground">{item.company}</p>
      </div>
      <div className="md:col-span-5">
        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}

export function ExperienceSection() {
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
    <section id="experience" ref={sectionRef} className="relative py-24 lg:py-32 border-t border-foreground/10">
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

        {/* Timeline */}
        <div className="border-t border-foreground/10">
          {experience.map((item, index) => (
            <ExperienceRow key={item.role} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
