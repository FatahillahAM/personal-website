import { getProjects } from "@/lib/content";
import { WorkSectionClient } from "./work-section-client";

// Server component: pulls projects from the database, then hands them to the
// client component that keeps all the scroll animations.
export async function WorkSection() {
  const projects = await getProjects();
  return <WorkSectionClient projects={projects} />;
}
