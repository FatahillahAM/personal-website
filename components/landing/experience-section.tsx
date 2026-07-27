import { getExperiences, getCertifications } from "@/lib/content";
import { ExperienceSectionClient } from "./experience-section-client";

export async function ExperienceSection() {
  const [work, education, certifications] = await Promise.all([
    getExperiences("work"),
    getExperiences("education"),
    getCertifications(),
  ]);

  return (
    <ExperienceSectionClient
      work={work}
      education={education}
      certifications={certifications}
    />
  );
}
