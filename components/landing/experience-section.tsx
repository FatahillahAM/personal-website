"use client";

import { useEffect, useRef, useState } from "react";

type TimelineItem = {
  role: string;
  organization: string;
  period: string;
  description?: string;
  thesis?: string;
};

const experience: TimelineItem[] = [
  {
    role: "Mechanical Engineer",
    organization: "CV. Laksana Carroserie — Semarang, Indonesia",
    period: "Sep 2021 — Dec 2021",
    description:
      "Operated and controlled CNC machines on the production line, and carried out routine maintenance to keep them running.",
  },
  {
    role: "IT Helpdesk",
    organization: "PT. PLN (Persero) Distribusi Jakarta Raya — Jakarta, Indonesia",
    period: "May 2017 — Jul 2017",
    description:
      "Maintained local computers across the Jakarta office and its service areas, and supported the office servers.",
  },
];

const education: TimelineItem[] = [
  {
    role: "M.Eng. Industrial Engineering and Management — GPA 3.83 / 4.00",
    organization: "Universitas Diponegoro",
    period: "Jan 2024 — Aug 2026",
    description:
      "Graduate programme covering production systems, operations research, quality engineering, and engineering management.",
    // TODO: ganti dengan judul & ringkasan tesis kamu yang sebenarnya
    thesis:
      "Thesis — Computer Vision-Based Line Balancing: a vision system that measures work-station cycle times from video footage and redistributes tasks across stations to reduce bottlenecks and idle time on the production line.",
  },
  {
    role: "Automation Engineering — GPA 3.52 / 4.00",
    organization: "Universitas Diponegoro",
    period: "Aug 2018 — Feb 2023",
    description:
      "Focused on automation systems, CNC machining, and CAD/CAM design with SolidWorks.",
  },
  {
    role: "Computer and Network Technology",
    organization: "SMKN 1 Kota Tangerang",
    period: "Aug 2015 — May 2018",
    description:
      "Vocational programme in computer hardware, network configuration, and IT support fundamentals.",
  },
];

const certifications = [
  "Connecting Operator — BNSP",
  "Visiting Lecture: Medical Robot Controlled Intelligent Assistive Technology for Handling Covid-19 — Automation Engineering, Universitas Diponegoro",
];

function ExperienceRow({ item, index }: { item: TimelineItem; index: number }) {
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
        {item.thesis && (
          <p className="mt-3 pl-4 border-l border-foreground/20 text-muted-foreground leading-relaxed max-w-2xl">
            {item.thesis}
          </p>
        )}
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
          {experience.map((item, index) => (
            <ExperienceRow key={item.role} item={item} index={index} />
          ))}
        </div>

        {/* Education */}
        <div className="mt-20 lg:mt-28">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            Education
          </span>
          <div className="border-t border-foreground/10">
            {education.map((item, index) => (
              <ExperienceRow key={item.role} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-20 lg:mt-28">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            Certification
          </span>
          <ul className="border-t border-foreground/10">
            {certifications.map((item) => (
              <li
                key={item}
                className="py-6 border-b border-foreground/10 text-muted-foreground leading-relaxed max-w-3xl"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
