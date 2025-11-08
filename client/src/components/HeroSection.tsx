import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import heroImage from "@assets/generated_images/Hospital_ward_technology_hero_e42de68c.png";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Smart Patient Care,<br />Simplified
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Ward Watch streamlines hospital nursing workflows with intelligent medication tracking, real-time notifications, and comprehensive patient management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold"
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 px-8 py-6 text-lg"
            data-testid="button-learn-more"
          >
            Learn More
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
