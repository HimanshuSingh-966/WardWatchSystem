import { Clock, Bell, Activity, Users, FileText, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Clock,
    title: "Time-Grouped Timeline",
    description: "View all medications, procedures, and investigations organized by scheduled time for efficient workflow management.",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description: "Station board-style alerts keep staff informed of upcoming and overdue treatments with priority-based notifications.",
  },
  {
    icon: Activity,
    title: "Vital Signs Tracking",
    description: "Monitor patient vitals over time with comprehensive charting and historical trend analysis.",
  },
  {
    icon: Users,
    title: "Staff Management",
    description: "Assign multiple doctors and nurses to patients with clear role-based access and accountability.",
  },
  {
    icon: FileText,
    title: "Nursing Notes",
    description: "Flexible documentation system for observations, care activities, and patient progress notes.",
  },
  {
    icon: TrendingUp,
    title: "Treatment History",
    description: "Complete audit trail of all administered treatments with completion tracking and outcomes.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Everything You Need for Patient Care
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools designed specifically for hospital nursing workflows
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover-elevate transition-all duration-300"
              data-testid={`card-feature-${index}`}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
