import { NavBar } from "@/components/home/nav-bar";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { EmbedSection } from "@/components/home/embed-section";
import { Features } from "@/components/home/features";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { StatsSection } from "@/components/home/stats-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";
import { Footer } from "@/components/home/footer";

export default function Home() {
  const user = null;
  return (
    <>
      <div className="min-h-screen">
        <NavBar />
        <main>
          <Hero />
          <HowItWorks />
          <EmbedSection />
          <Features />
          <DashboardPreview />
          <StatsSection />
          <FaqSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
      {user && (
        <script src="https://pulsedesk-jet.vercel.app/widget.js" data-site-id="pulsedesk" async></script>
      )}
    </>
  );
}
