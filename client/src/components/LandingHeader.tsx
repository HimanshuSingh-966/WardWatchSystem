import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className={`w-6 h-6 ${isScrolled ? 'text-primary' : 'text-white'}`} />
          <span className={`text-xl font-semibold ${isScrolled ? 'text-foreground' : 'text-white'}`}>
            Ward Watch
          </span>
        </div>
        
        <Link href="/login">
          <Button 
            variant={isScrolled ? "default" : "outline"}
            className={isScrolled ? '' : 'bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20'}
            data-testid="button-login"
          >
            Admin Login
          </Button>
        </Link>
      </div>
    </header>
  );
}
