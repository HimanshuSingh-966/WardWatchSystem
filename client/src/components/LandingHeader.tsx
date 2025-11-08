import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;
    
    return `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Activity className={`w-5 h-5 sm:w-6 sm:h-6 ${isScrolled ? 'text-primary' : 'text-white'}`} />
          <span className={`text-base sm:text-xl font-semibold ${isScrolled ? 'text-foreground' : 'text-white'}`}>
            Ward Watch
          </span>
        </div>
        
        <div className={`flex items-center gap-1.5 sm:gap-2 ${isScrolled ? 'text-foreground' : 'text-white'}`} data-testid="text-clock">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base font-medium tabular-nums">
            {formatTime(time)}
          </span>
        </div>
        
        <Link href="/login">
          <Button 
            variant={isScrolled ? "default" : "outline"}
            size="sm"
            className={isScrolled ? '' : 'bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20'}
            data-testid="button-login"
          >
            <span className="hidden sm:inline">Admin Login</span>
            <span className="sm:hidden">Login</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
