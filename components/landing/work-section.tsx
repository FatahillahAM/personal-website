"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

// NOTE: add your own images to /public and fill in the `image` field
// (e.g. image: "/work-cnc.jpg"). While it's empty the placeholder is used.
const projects = [
  {
    title: "CNC Machining Line",
    category: "Automation Engineering",
    year: "2021",
    description:
      "Ran and maintained CNC machines for bus body manufacturing at CV. Laksana Carroserie, covering machine control and routine servicing.",
    image: "",
    tags: ["CNC", "Maintenance"],
  },
  {
    title: "Office IT & Server Support",
    category: "IT Support",
    year: "2017",
    description:
      "Kept local computers and servers running across PT. PLN (Persero) Distribusi Jakarta Raya's office and service areas.",
    image: "",
    tags: ["Helpdesk", "Networking"],
  },
  {
    title: "SolidWorks Part & Assembly Design",
    category: "CAD / CAM",
    year: "2022",
    description:
      "Modelling, assemblies, and manufacturing drawings built during automation engineering coursework at Universitas Diponegoro.",
    image: "",
    tags: ["SolidWorks", "CAD/CAM"],
  },
  {
    title: "Campus Event Videography",
    category: "Video Editing",
    year: "2019 — 2022",
    description:
      "Two years of shooting and editing documentation, recaps, and promotional video for campus organisations and event committees.",
    image: "",
    tags: ["Videography", "Editing"],
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      ref={cardRef}
      href="#contact"
      className={`group block transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${(index % 2) * 120}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-muted aspect-[4/3] mb-6">
        <img
          src={project.image || "/placeholder.svg"}
          alt={`${project.title} — ${project.category}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-background/90 backdrop-blur flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl lg:text-3xl font-display mb-1 group-hover:translate-x-1 transition-transform duration-500">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {project.category} · {project.year}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2.5 py-1 border border-foreground/15 rounded-full text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
        {project.description}
      </p>
    </a>
  );
}

export function WorkSection() {
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
    <section id="work" ref={sectionRef} className="relative py-24 lg:py-32 border-t border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Selected Work
            </span>
            <h2
              className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              What I&apos;ve
              <br />
              worked on.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            A short selection across automation, IT support, and video. Full
            details and footage available on request.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
