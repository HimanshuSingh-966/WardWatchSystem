import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Link } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Pill, 
  Stethoscope, 
  FlaskConical, 
  Users, 
  FileText, 
  Activity, 
  UserCog, 
  Building, 
  Database 
} from "lucide-react";

interface DashboardSection {
  id: string;
  title: string;
  icon: any;
  path: string;
  color: string;
}

const sections: DashboardSection[] = [
  {
    id: "overview",
    title: "Overview",
    icon: LayoutDashboard,
    path: "/admin/overview",
    color: "text-blue-500",
  },
  {
    id: "medications",
    title: "Medications",
    icon: Pill,
    path: "/admin/medications",
    color: "text-green-500",
  },
  {
    id: "procedures",
    title: "Procedures",
    icon: Stethoscope,
    path: "/admin/procedures",
    color: "text-purple-500",
  },
  {
    id: "investigations",
    title: "Investigations",
    icon: FlaskConical,
    path: "/admin/investigations",
    color: "text-orange-500",
  },
  {
    id: "patients",
    title: "Patients",
    icon: Users,
    path: "/admin/patients",
    color: "text-red-500",
  },
  {
    id: "notes",
    title: "Nursing Notes",
    icon: FileText,
    path: "/admin/nursing-notes",
    color: "text-indigo-500",
  },
  {
    id: "vitals",
    title: "Vital Signs",
    icon: Activity,
    path: "/admin/vital-signs",
    color: "text-pink-500",
  },
  {
    id: "staff",
    title: "Staff",
    icon: UserCog,
    path: "/admin/staff",
    color: "text-teal-500",
  },
  {
    id: "departments",
    title: "Departments",
    icon: Building,
    path: "/admin/departments",
    color: "text-cyan-500",
  },
  {
    id: "master",
    title: "Master Data",
    icon: Database,
    path: "/admin/master-data",
    color: "text-amber-500",
  },
];

export default function DashboardHome() {
  const { admin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !admin) {
      const timer = setTimeout(() => {
        if (!admin) {
          setLocation('/login');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [admin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader notificationCount={0} onNotificationClick={() => {}} />
      
      <main className="pt-24 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Ward Watch</h1>
            <p className="text-lg text-muted-foreground">Select a section to manage</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link 
                  key={section.id} 
                  href={section.path}
                  data-testid={`link-${section.id}`}
                >
                  <Card className="hover-elevate active-elevate-2 cursor-pointer h-full transition-all">
                    <CardContent className="flex flex-col items-center justify-center p-8 gap-4">
                      <div className={`${section.color} transition-colors`}>
                        <Icon className="w-16 h-16" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground text-center">
                        {section.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
