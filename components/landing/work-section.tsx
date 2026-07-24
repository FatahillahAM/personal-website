"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "CNC Machining Line",
    category: "Automation Engineering",
    year: "2021",
    description:
      "Ran and maintained CNC machines for bus body manufacturing at CV. Laksana Carroserie, covering machine control and routine servicing.",
    image: "/work-cnc.jpg",
    href: "#contact",
    external: false,
    tags: ["CNC", "Maintenance"],
  },
  {
    title: "Computer Vision-Based Line Balancing",
    category: "Automation / Computer Vision",
    year: "2022",
    description:
      "A vision-based system that measures work-station cycle times from video and redistributes tasks to cut bottlenecks and idle time on the production line.",
    image: "/work-analyze.png",
    href: "#contact",
    external: false,
    tags: ["Computer Vision", "Line Balancing"],
  },
  {
    title: "SolidWorks Part & Assembly Design",
    category: "CAD / CAM",
    year: "2022",
    description:
      "Modelling, assemblies, and manufacturing drawings built during automation engineering coursework at Universitas Diponegoro.",
    image: "/work-solidworks.jpg",
    href: "#contact",
    external: false,
    tags: ["SolidWorks", "CAD/CAM"],
  },
  {
    title: "Company Profile BEM UNDIP 2020",
    category: "Videography",
    year: "2020",
    description:
      "Shot and edited the official company profile video for BEM Universitas Diponegoro — concept, footage, and post-production. Watch it on YouTube.",
    image: "/work-comprof.png",
    href: "https://www.youtube.com/watch?v=wkwx5XyAEk8",
    external: true,
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
      href={project.href}
      {...(project.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
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
      {project.external && (
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-mono text-foreground/80 group-hover:text-foreground transition-colors">
          Watch on YouTube
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      )}
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
              Projects I&apos;m
              <br />
              proud of.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            A small selection of recent work across brand, product, and systems.
            More available on request.
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
