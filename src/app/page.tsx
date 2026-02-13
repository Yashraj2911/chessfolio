import Hero from "@/components/hero/Hero";
import SectionIdentity from "@/components/SectionIdentity";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectsSection from "@/components/ProjectsSection";
import SectionFooter from "@/components/SectionFooter";
import SectionSeparator from "@/components/SectionSeparator";

export default function Home() {
  return (
    <>
      <Hero />
      <SectionSeparator />
      <SectionIdentity />
      <SectionSeparator />
      <ExperienceTimeline />
      <SectionSeparator />
      <ProjectsSection />
      <SectionSeparator />
      <SectionFooter />
    </>
  );
}
