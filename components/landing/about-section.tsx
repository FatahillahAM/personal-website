"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  {
    number: "01",
    title: "Automation Engineering",
    description:
      "CNC machine operation, control, and preventive maintenance on a production floor.",
  },
  {
    number: "02",
    title: "CAD / CAM Design",
    description:
      "Part modelling, assemblies, and manufacturing drawings in SolidWorks.",
  },
  {
    number: "03",
    title: "IT Support & Networking",
    description:
      "Helpdesk, workstation and server maintenance, and network configuration with Cisco and Mikrotik.",
  },
  {
    number: "04",
    title: "Video Editing & Videography",
    description:
      "Two years of shooting and editing for campus organisations and event committees.",
  },
];

const tools = ["SolidWorks", "CNC", "CAD/CAM", "Cisco", "Mikrotik", "Video Editing"];

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
            An automation engineering graduate who is just as comfortable behind a
            CNC control panel as behind a camera.
          </h2>
        </div>

        {/* Photo + bio + services */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-8">
            {/* Portrait */}
            <div
              className={`relative overflow-hidden rounded-2xl border border-foreground/10 bg-muted aspect-square max-w-sm transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <img
                src="/profile.jpg"
                alt="Portrait of Fatahillah Aditya M."
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                I graduated in Automation Engineering from Universitas Diponegoro
                with a 3.52 GPA, after finishing vocational school in Computer and
                Network Technology. That combination is the through-line in my
                work: machines on one side, the systems and networks that support
                them on the other.
              </p>
              <p>
                On the shop floor at CV. Laksana Carroserie I ran and maintained CNC
                machines. Earlier, at PT. PLN (Persero) Distribusi Jakarta Raya, I
                handled IT helpdesk work and kept office computers and servers
                running. Alongside all of it, I spent more than two years editing
                video and shooting footage for campus organisations and event
                committees.
              </p>
              <div className="pt-4 flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-sm font-mono px-3 py-1.5 border border-foreground/15 rounded-full text-foreground/80"
                  >
                    {tool}
                  </span>
                ))}
              </div>
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
