import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import TimelineTable from "@/components/TimelineTable";
import AddTreatmentModal from "@/components/AddTreatmentModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProceduresPage() {
  const { admin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
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

  const handleAddTreatment = (time: string, patientId: string) => {
    setModalDefaults({ time, patient: patientId });
    setShowAddTreatmentModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader notificationCount={0} onNotificationClick={() => {}} />
      
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
          
          <h2 className="text-2xl font-semibold text-foreground mb-6">Procedures</h2>
          {timelineLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading procedures...</div>
          ) : timelineError ? (
            <div className="text-center py-12 text-destructive">Error loading procedures</div>
          ) : (
            <TimelineTable
              data={timelineData.map((row: any) => ({
                ...row,
                treatments: row.treatments.filter((t: any) => t.type === 'procedure')
              })).filter((row: any) => row.treatments.length > 0)}
              onAddTreatment={handleAddTreatment}
              onEditTreatment={(id) => console.log('Edit procedure:', id)}
              onDeleteTreatment={(id) => console.log('Delete procedure:', id)}
              onToggleComplete={(id) => console.log('Toggle complete:', id)}
            />
          )}
        </div>
      </main>
      
      <AddTreatmentModal
        open={showAddTreatmentModal}
        onClose={() => setShowAddTreatmentModal(false)}
        defaultTime={modalDefaults.time}
        defaultPatient={modalDefaults.patient}
      />
    </div>
  );
}
