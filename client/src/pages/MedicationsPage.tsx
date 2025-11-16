import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/AdminHeader";
import TimelineTable from "@/components/TimelineTable";
import AddTreatmentModal from "@/components/AddTreatmentModal";
import BulletinBoard, { BulletinItem } from "@/components/BulletinBoard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MedicationsPage() {
  const { admin, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showAddTreatmentModal, setShowAddTreatmentModal] = useState(false);
  const [showBulletinBoard, setShowBulletinBoard] = useState(true);
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

  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications/pending', 'medication'],
    queryFn: async () => {
      const res = await fetch('/api/notifications/pending?type=medication', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
    refetchInterval: 60000,
  });

  const bulletinItems: BulletinItem[] = notifications.map((notif: any) => ({
    id: notif.id,
    time: notif.scheduledTime,
    patientName: notif.patientName,
    ipdNumber: notif.ipdNumber,
    treatmentType: notif.treatmentType,
    treatmentName: notif.treatmentName,
    details: notif.details,
    priority: notif.priority,
    isOverdue: notif.isOverdue,
    bedNumber: notif.bedNumber,
  }));

  const handleAddTreatment = (time: string, patientId: string) => {
    setModalDefaults({ time, patient: patientId });
    setShowAddTreatmentModal(true);
  };

  const handleBulletinItemClick = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ['/api/timeline'] });
  };

  const deleteMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return apiRequest('DELETE', `/api/medication-orders/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timeline'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/pending', 'medication'] });
      toast({
        title: "Success",
        description: "Medication order deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return apiRequest('PATCH', `/api/medication-orders/${orderId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timeline'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/pending', 'medication'] });
      toast({
        title: "Success",
        description: "Medication order marked as complete",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteTreatment = (id: string, type: 'medication' | 'procedure' | 'investigation') => {
    deleteMutation.mutate(id);
  };

  const handleToggleComplete = (id: string, type: 'medication' | 'procedure' | 'investigation') => {
    completeMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        notificationCount={bulletinItems.length} 
        onNotificationClick={() => setShowBulletinBoard(!showBulletinBoard)} 
      />
      
      {showBulletinBoard && bulletinItems.length > 0 && (
        <BulletinBoard
          items={bulletinItems}
          onClose={() => setShowBulletinBoard(false)}
          onItemClick={handleBulletinItemClick}
        />
      )}
      
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
          
          <h2 className="text-2xl font-semibold text-foreground mb-6">Medication Orders</h2>
          {timelineLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading medications...</div>
          ) : timelineError ? (
            <div className="text-center py-12 text-destructive">Error loading medications</div>
          ) : (
            <TimelineTable
              data={timelineData.map((row: any) => ({
                ...row,
                treatments: row.treatments.filter((t: any) => t.type === 'medication')
              })).filter((row: any) => row.treatments.length > 0)}
              onAddTreatment={handleAddTreatment}
              onEditTreatment={(id) => console.log('Edit medication:', id)}
              onDeleteTreatment={handleDeleteTreatment}
              onToggleComplete={handleToggleComplete}
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
