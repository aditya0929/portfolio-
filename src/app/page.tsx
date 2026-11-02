import { AchievementsSection } from "@/components/achievements-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero/hero-section";
import { OpenSourceSection } from "@/components/open-source-section";
import { ProjectsSection } from "@/components/projects-section";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-black">
      <HeroSection />
      <AchievementsSection />
      <ProjectsSection />
      <OpenSourceSection />
      <div id="footer-curtain" className="relative z-30 w-full border-t border-white/10 bg-black">
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
