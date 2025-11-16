import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import TabNavigation, { DashboardTab } from "@/components/TabNavigation";
import TimelineTable from "@/components/TimelineTable";
import PatientTable, { Patient } from "@/components/PatientTable";
import NursingNotesTable, { NursingNote } from "@/components/NursingNotesTable";
import BulletinBoard, { BulletinItem } from "@/components/BulletinBoard";
import AddTreatmentModal from "@/components/AddTreatmentModal";
import AddPatientModal from "@/components/AddPatientModal";
import EditPatientModal from "@/components/EditPatientModal";
import PatientDetailsModal from "@/components/PatientDetailsModal";
import AddNursingNoteModal from "@/components/AddNursingNoteModal";
import DashboardClock from "@/components/DashboardClock";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Patient as BackendPatient, NursingNote as BackendNursingNote, Staff, PatientDetails, PatientStaffAssignment } from "@shared/schema";

export default function AdminDashboard() {
  const { admin, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Redirect to login if not authenticated (only after loading completes)
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

  // Redirect to separate pages when specific tabs are clicked
  useEffect(() => {
    if (activeTab === 'master') {
      setLocation('/admin/master-data');
    } else if (activeTab === 'history') {
      setLocation('/admin/treatment-history');
    }
  }, [activeTab, setLocation]);
  
  const [showBulletinBoard, setShowBulletinBoard] = useState(true);
  const [showAddTreatmentModal, setShowAddTreatmentModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [modalDefaults, setModalDefaults] = useState<{ time?: string; patient?: string }>({});

  // Fetch patients
  const { data: backendPatients = [], isLoading: patientsLoading, isError: patientsError } = useQuery<BackendPatient[]>({
    queryKey: ['/api/patients'],
    queryFn: async () => {
      const res = await fetch('/api/patients?discharged=false', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch patients');
      return res.json();
    }
  });

  // Transform backend patients to match component interface
  const patients: Patient[] = backendPatients.map(p => ({
    id: p.patient_id,
    ipdNumber: p.ipd_number,
    name: p.patient_name,
    age: p.age,
    gender: p.gender,
    bed: p.bed_number,
    ward: p.ward,
    diagnosis: p.diagnosis,
    admissionDate: new Date(p.admission_date),
    isDischarged: p.is_discharged,
    dischargeDate: p.discharge_date ? new Date(p.discharge_date) : undefined,
  }));

  // Fetch patient details
  const { data: selectedPatientDetails, isLoading: patientDetailsLoading } = useQuery<PatientDetails>({
    queryKey: ['/api/patients', selectedPatientId, 'details'],
    queryFn: async () => {
      if (!selectedPatientId) throw new Error('No patient selected');
      const res = await fetch(`/api/patients/${selectedPatientId}/details`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch patient details');
      return res.json();
    },
    enabled: !!selectedPatientId,
  });

  // Fetch patient staff assignments for editing
  const { data: selectedPatientAssignments = [] } = useQuery<PatientStaffAssignment[]>({
    queryKey: ['/api/patients', selectedPatientId, 'assignments'],
    queryFn: async () => {
      if (!selectedPatientId) return [];
      const res = await fetch(`/api/patients/${selectedPatientId}/details`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) return [];
      const details = await res.json();
      const assignments: PatientStaffAssignment[] = [];
      if (details.doctor) {
        assignments.push({
          assignment_id: '',
          patient_id: selectedPatientId,
          staff_id: details.doctor.staff_id,
          assignment_role: 'Doctor' as const,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      if (details.nurse) {
        assignments.push({
          assignment_id: '',
          patient_id: selectedPatientId,
          staff_id: details.nurse.staff_id,
          assignment_role: 'Nurse' as const,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      return assignments;
    },
    enabled: !!selectedPatientId,
  });

  const selectedPatient = backendPatients.find(p => p.patient_id === selectedPatientId);

  // Add patient mutation
  const addPatientMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/patients', 'POST', {
      ipd_number: data.ipdNumber,
      patient_name: data.name,
      age: parseInt(data.age),
      gender: data.gender,
      contact_number: data.contactNumber || undefined,
      address: data.address || undefined,
      bed_number: data.bed,
      ward: data.ward,
      diagnosis: data.diagnosis,
      admission_date: data.admissionDate,
      emergency_contact: data.emergencyContact || undefined,
      doctor_id: data.doctor_id,
      nurse_id: data.nurse_id,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      toast({ title: "Success", description: "Patient added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Update patient mutation
  const updatePatientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest(`/api/patients/${id}`, 'PATCH', {
      ipd_number: data.ipdNumber,
      patient_name: data.name,
      age: parseInt(data.age),
      gender: data.gender,
      contact_number: data.contactNumber || undefined,
      address: data.address || undefined,
      bed_number: data.bed,
      ward: data.ward,
      diagnosis: data.diagnosis,
      admission_date: data.admissionDate,
      emergency_contact: data.emergencyContact || undefined,
      doctor_id: data.doctor_id,
      nurse_id: data.nurse_id,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      toast({ title: "Success", description: "Patient updated successfully" });
      setSelectedPatientId(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Discharge patient mutation
  const dischargePatientMutation = useMutation({
    mutationFn: (patientId: string) => apiRequest(`/api/patients/${patientId}/discharge`, 'PATCH'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      toast({ title: "Success", description: "Patient discharged successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Fetch timeline data
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

  // Fetch staff for nursing notes
  const { data: staffList = [], isLoading: staffLoading, isError: staffError } = useQuery<Staff[]>({
    queryKey: ['/api/staff'],
    queryFn: async () => {
      const res = await fetch('/api/staff', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch staff');
      return res.json();
    }
  });

  // Fetch nursing notes
  const { data: backendNotes = [], isLoading: notesLoading, isError: notesError } = useQuery<BackendNursingNote[]>({
    queryKey: ['/api/nursing-notes'],
    queryFn: async () => {
      const res = await fetch('/api/nursing-notes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch nursing notes');
      return res.json();
    }
  });

  // Transform nursing notes to match component interface
  const nursingNotes: NursingNote[] = backendNotes.map(note => {
    const patient = backendPatients.find(p => p.patient_id === note.patient_id);
    const staff = staffList.find(s => s.staff_id === note.recorded_by);
    return {
      id: note.note_id,
      patientName: patient?.patient_name || 'Unknown',
      ipdNumber: patient?.ipd_number || 'Unknown',
      noteType: note.note_type,
      note: note.note,
      recordedBy: staff?.staff_name || 'Unknown',
      recordedAt: new Date(note.recorded_at),
    };
  });

  // Add nursing note mutation
  const addNursingNoteMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/nursing-notes', 'POST', {
      patient_id: data.patient,
      recorded_by: data.recordedBy || admin?.admin_id,
      note_type: data.noteType,
      note: data.note,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nursing-notes'] });
      toast({ title: "Success", description: "Nursing note added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Delete nursing note mutation
  const deleteNursingNoteMutation = useMutation({
    mutationFn: (noteId: string) => apiRequest(`/api/nursing-notes/${noteId}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nursing-notes'] });
      toast({ title: "Success", description: "Nursing note deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Fetch pending notifications (poll every 60 seconds)
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications/pending'],
    queryFn: async () => {
      const res = await fetch('/api/notifications/pending', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  // Transform notifications to bulletin items
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
        
        <div className="pt-16">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="max-w-7xl mx-auto px-8 pt-6 pb-4">
            <DashboardClock />
          </div>
          
          <main className="max-w-7xl mx-auto px-8 py-8">
            {activeTab === 'overview' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Treatment Timeline</h2>
                </div>
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
            )}
            
            {activeTab === 'medications' && (
              <div>
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
                    onDeleteTreatment={(id) => console.log('Delete medication:', id)}
                    onToggleComplete={(id) => console.log('Toggle complete:', id)}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'patients' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Patient Management</h2>
                  <Button 
                    onClick={() => setShowAddPatientModal(true)}
                    data-testid="button-add-patient"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </div>
                {patientsLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading patients...</div>
                ) : patientsError ? (
                  <div className="text-center py-12 text-destructive">Error loading patients</div>
                ) : (
                  <PatientTable
                    patients={patients}
                    onViewDetails={(id) => {
                      setSelectedPatientId(id);
                      setShowPatientDetailsModal(true);
                    }}
                    onEdit={(id) => {
                      setSelectedPatientId(id);
                      setShowEditPatientModal(true);
                    }}
                    onDischarge={(id) => dischargePatientMutation.mutate(id)}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'notes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Nursing Notes</h2>
                  <Button 
                    onClick={() => setShowAddNoteModal(true)}
                    data-testid="button-add-note"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
                {notesLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading notes...</div>
                ) : notesError ? (
                  <div className="text-center py-12 text-destructive">Error loading notes</div>
                ) : (
                  <NursingNotesTable
                    notes={nursingNotes}
                    onEdit={(id) => console.log('Edit note:', id)}
                    onDelete={(id) => deleteNursingNoteMutation.mutate(id)}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'master' && (
              <div>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Redirecting to Master Data Management...</p>
                </div>
              </div>
            )}
            
            {(activeTab === 'procedures' || activeTab === 'investigations' || 
              activeTab === 'vitals' || activeTab === 'staff' || activeTab === 'departments') && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                </h2>
                <p className="text-muted-foreground">
                  Use the Master tab to manage medications, procedures, investigations, staff, and departments
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <AddTreatmentModal
        open={showAddTreatmentModal}
        onClose={() => setShowAddTreatmentModal(false)}
        defaultTime={modalDefaults.time}
        defaultPatient={modalDefaults.patient}
      />
      
      <AddPatientModal
        open={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onSubmit={(data) => addPatientMutation.mutate(data)}
        staff={staffList}
      />

      <EditPatientModal
        open={showEditPatientModal}
        onClose={() => {
          setShowEditPatientModal(false);
          setSelectedPatientId(null);
        }}
        onSubmit={(data) => {
          if (selectedPatientId) {
            updatePatientMutation.mutate({ id: selectedPatientId, data });
          }
        }}
        patient={selectedPatient || null}
        staff={staffList}
        assignments={selectedPatientAssignments}
      />

      <PatientDetailsModal
        open={showPatientDetailsModal}
        onClose={() => {
          setShowPatientDetailsModal(false);
          setSelectedPatientId(null);
        }}
        patientId={selectedPatientId}
        patientDetails={selectedPatientDetails || null}
        isLoading={patientDetailsLoading}
      />
      
      <AddNursingNoteModal
        open={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        onSubmit={(data) => addNursingNoteMutation.mutate(data)}
        patients={patientsLoading ? [] : patients}
        staff={staffLoading ? [] : staffList}
        isLoadingData={patientsLoading || staffLoading}
      />
    </div>
  );
}
