import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { AboutSection } from "@/components/landing/about-section";
import { WorkSection } from "@/components/landing/work-section";
import { ExperienceSection } from "@/components/landing/experience-section";
import { ContactSection } from "@/components/landing/contact-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ExperienceSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
