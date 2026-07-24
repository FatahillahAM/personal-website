"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const socials = [
  { name: "Email", handle: "hello@ayla.design", href: "mailto:hello@ayla.design" },
  { name: "Instagram", handle: "@ayla.designs", href: "#" },
  { name: "Dribbble", handle: "/aylaprakoso", href: "#" },
  { name: "LinkedIn", handle: "/in/aylaprakoso", href: "#" },
];

export function ContactSection() {
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
    <section id="contact" ref={sectionRef} className="relative py-24 lg:py-40 border-t border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: headline */}
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
              <span className="w-8 h-px bg-foreground/30" />
              Contact
            </span>
            <h2
              className={`text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] mb-8 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Let&apos;s build
              <br />
              something.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-8">
              I&apos;m currently open to select freelance projects and
              collaborations. Have an idea? I&apos;d love to hear about it.
            </p>
            <a
              href="mailto:hello@ayla.design"
              className="inline-flex items-center gap-2 text-2xl lg:text-3xl font-display border-b border-foreground/30 pb-1 hover:border-foreground transition-colors group"
            >
              hello@ayla.design
              <ArrowUpRight className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          {/* Right: social links */}
          <div className="lg:pl-12">
            {socials.map((social, index) => (
              <a
                key={social.name}
                href={social.href}
                className={`group flex items-center justify-between py-6 border-b border-foreground/10 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="text-lg font-medium">{social.name}</span>
                <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                  <span className="font-mono text-sm">{social.handle}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
