"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  { number: "01", title: "Brand Identity", description: "Logos, visual systems, and guidelines that give companies a distinct, lasting voice." },
  { number: "02", title: "Product Design", description: "End-to-end UX and UI for web and mobile products, from first sketch to shipped feature." },
  { number: "03", title: "Design Systems", description: "Scalable component libraries and tokens that keep growing teams fast and consistent." },
  { number: "04", title: "Art Direction", description: "Creative direction for campaigns, launches, and the details that make work feel considered." },
];

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 lg:py-32 border-t border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            About
          </span>
          <h2
            className={`text-3xl lg:text-5xl font-display tracking-tight leading-tight max-w-4xl text-balance transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            For nearly a decade I&apos;ve partnered with startups and studios to turn
            complex ideas into clear, beautiful, human-centered design.
          </h2>
        </div>

        {/* Bio + services */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              I believe great design is invisible — it removes friction, earns trust,
              and quietly does its job. My work sits at the intersection of brand and
              product, where a strong visual identity meets an interface that just
              works.
            </p>
            <p>
              I&apos;ve led design at early-stage startups, collaborated with
              cross-functional teams, and shipped products used by millions. Whether
              it&apos;s a wordmark or a full design system, I care about the craft in
              every pixel.
            </p>
            <div className="pt-4 flex flex-wrap gap-2">
              {["Figma", "Framer", "Webflow", "After Effects", "Blender", "Prototyping"].map((tool) => (
                <span
                  key={tool}
                  className="text-sm font-mono px-3 py-1.5 border border-foreground/15 rounded-full text-foreground/80"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Services list */}
          <div>
            {services.map((service, index) => (
              <div
                key={service.number}
                className={`flex gap-6 py-6 border-b border-foreground/10 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="font-mono text-sm text-muted-foreground shrink-0 pt-1">
                  {service.number}
                </span>
                <div>
                  <h3 className="text-xl lg:text-2xl font-display mb-2">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
