import { NavBar } from "@/components/site/nav-bar";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { EmbedSection } from "@/components/site/embed-section";
import { Features } from "@/components/site/features";
import { DashboardPreview } from "@/components/site/dashboard-preview";
import { StatsSection } from "@/components/site/stats-section";
import { FaqSection } from "@/components/site/faq-section";
import { CtaSection } from "@/components/site/cta-section";
import { Footer } from "@/components/site/footer";

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
