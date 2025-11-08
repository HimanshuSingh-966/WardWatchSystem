import LandingHeader from "@/components/LandingHeader";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import CTASection from "@/components/CTASection";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
      
      <footer className="py-8 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Ward Watch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
