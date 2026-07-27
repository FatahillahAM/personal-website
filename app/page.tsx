import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { AboutSection } from "@/components/landing/about-section";
import { WorkSection } from "@/components/landing/work-section";
import { ExperienceSection } from "@/components/landing/experience-section";
import { ContactSection } from "@/components/landing/contact-section";
import { FooterSection } from "@/components/landing/footer-section";
import { AssistantWidget } from "@/components/landing/assistant-widget";
import { getProfile } from "@/lib/content";

// Re-render at most once a minute so edits in the Supabase dashboard show up
// quickly. Lower this to 0 for always-fresh, or wire up on-demand revalidation.
export const revalidate = 60;

export default async function Home() {
  const profile = await getProfile();

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ExperienceSection />
      <ContactSection />
      <FooterSection />
      <AssistantWidget ownerName={profile?.name} />
    </main>
  );
}
