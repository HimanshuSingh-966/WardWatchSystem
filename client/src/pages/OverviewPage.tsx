import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import TimelineTable from "@/components/TimelineTable";
import BulletinBoard, { BulletinItem } from "@/components/BulletinBoard";
import AddTreatmentModal from "@/components/AddTreatmentModal";
import DashboardClock from "@/components/DashboardClock";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function OverviewPage() {
  const { admin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showBulletinBoard, setShowBulletinBoard] = useState(true);
  const [showAddTreatmentModal, setShowAddTreatmentModal] = useState(false);
  const [modalDefaults, setModalDefaults] = useState<{ time?: string; patient?: string }>({});

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

  const { data: timelineData = [], isLoading: timelineLoading, isError: timelineError } = useQuery({
    queryKey: ['/api/timeline'],
    queryFn: async () => {
      const res = await fetch('/api/timeline', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch timeline');
      return res.json();
    }
  });

  const bulletinItems: BulletinItem[] = timelineData
    .flatMap((row: any) => 
      row.treatments.map((treatment: any) => ({
        id: treatment.id,
        time: row.time,
        patientName: row.patient.name,
        ipdNumber: row.patient.ipdNumber,
        treatmentType: treatment.type,
        treatmentName: treatment.name,
        details: treatment.details,
        priority: treatment.priority,
        isOverdue: treatment.isOverdue || false,
        bedNumber: row.patient.bed,
      }))
    )
    .filter((item: any) => !item.isCompleted)
    .slice(0, 10);

  const handleAddTreatment = (time: string, patientId: string) => {
    setModalDefaults({ time, patient: patientId });
    setShowAddTreatmentModal(true);
  };

  const handleBulletinItemClick = (id: string) => {
    console.log('Bulletin item clicked:', id);
    queryClient.invalidateQueries({ queryKey: ['/api/timeline'] });
  };

  return (
    <div className="min-h-screen bg-background">
      {showBulletinBoard && bulletinItems.length > 0 && (
        <BulletinBoard
          items={bulletinItems}
          onClose={() => setShowBulletinBoard(false)}
          onItemClick={handleBulletinItemClick}
        />
      )}
      
      <div className={showBulletinBoard && bulletinItems.length > 0 ? 'pt-[500px]' : ''}>
        <AdminHeader
          notificationCount={bulletinItems.length}
          onNotificationClick={() => setShowBulletinBoard(!showBulletinBoard)}
        />
        
        <main className="pt-24 pb-16 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            
            <DashboardClock />
            
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Treatment Timeline</h2>
              {timelineLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading timeline...</div>
              ) : timelineError ? (
                <div className="text-center py-12 text-destructive">Error loading timeline</div>
              ) : timelineData.length > 0 ? (
                <TimelineTable
                  data={timelineData}
                  onAddTreatment={handleAddTreatment}
                  onEditTreatment={(id) => console.log('Edit treatment:', id)}
                  onDeleteTreatment={(id) => console.log('Delete treatment:', id)}
                  onToggleComplete={(id) => console.log('Toggle complete:', id)}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No treatments scheduled for today
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      <AddTreatmentModal
        open={showAddTreatmentModal}
        onClose={() => setShowAddTreatmentModal(false)}
        defaultTime={modalDefaults.time}
        defaultPatient={modalDefaults.patient}
      />
    </div>
  );
}
