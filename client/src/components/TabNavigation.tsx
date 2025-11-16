import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type DashboardTab = 
  | "overview" 
  | "medications" 
  | "procedures" 
  | "investigations" 
  | "patients" 
  | "notes" 
  | "vitals" 
  | "staff" 
  | "departments" 
  | "history"
  | "master";

interface TabNavigationProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const tabs = [
  { value: "overview" as const, label: "Overview" },
  { value: "medications" as const, label: "Medications" },
  { value: "procedures" as const, label: "Procedures" },
  { value: "investigations" as const, label: "Investigations" },
  { value: "patients" as const, label: "Patients" },
  { value: "notes" as const, label: "Nursing Notes" },
  { value: "vitals" as const, label: "Vital Signs" },
  { value: "staff" as const, label: "Staff" },
  { value: "departments" as const, label: "Departments" },
  { value: "history" as const, label: "Treatment History" },
  { value: "master" as const, label: "Master Data" },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="sticky top-16 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-8">
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as DashboardTab)}>
          <TabsList className="h-12 w-full justify-start overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-testid={`tab-${tab.value}`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
