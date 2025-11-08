import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";

export default function DashboardClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hours12 = hours % 12 || 12;
  const amPm = hours >= 12 ? 'PM' : 'AM';

  const hourAngle = ((hours12 % 12) * 30) + (minutes * 0.5);
  const minuteAngle = (minutes * 6) + (seconds * 0.1);
  const secondAngle = seconds * 6;

  const formatTime = () => {
    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return time.toLocaleDateString('en-US', options);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5" data-testid="card-dashboard-clock">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Analog Clock */}
        <div className="relative flex-shrink-0" data-testid="container-analog-clock">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary/20 bg-card relative shadow-lg">
            {/* Clock face markings */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-1 h-2 bg-muted-foreground/30 origin-bottom"
                style={{
                  transform: `translate(-50%, -100%) rotate(${i * 30}deg) translateY(-${16}px)`,
                }}
              />
            ))}
            
            {/* Hour hand */}
            <div
              className="absolute top-1/2 left-1/2 w-1.5 bg-primary rounded-full origin-bottom transition-transform duration-1000"
              style={{
                height: '30%',
                transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
              }}
              data-testid="hand-hour"
            />
            
            {/* Minute hand */}
            <div
              className="absolute top-1/2 left-1/2 w-1 bg-primary rounded-full origin-bottom transition-transform duration-1000"
              style={{
                height: '42%',
                transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
              }}
              data-testid="hand-minute"
            />
            
            {/* Second hand */}
            <div
              className="absolute top-1/2 left-1/2 w-0.5 bg-destructive rounded-full origin-bottom transition-transform duration-200"
              style={{
                height: '45%',
                transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
              }}
              data-testid="hand-second"
            />
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md" />
          </div>
          
          {/* Pulse animation around clock */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-20" />
        </div>

        {/* Digital Time Display */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Current Time</span>
          </div>
          
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-mono tabular-nums"
              data-testid="text-digital-time"
            >
              {formatTime()}
            </span>
            <span className="text-2xl md:text-3xl font-semibold text-primary" data-testid="text-am-pm">
              {amPm}
            </span>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground pt-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm md:text-base" data-testid="text-date">
              {formatDate()}
            </span>
          </div>
        </div>

        {/* Quick Stats Boxes */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold font-mono text-primary" data-testid="text-hours">
              {hours12.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground uppercase">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold font-mono text-primary" data-testid="text-minutes">
              {minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground uppercase">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold font-mono text-destructive" data-testid="text-seconds">
              {seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground uppercase">Seconds</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
