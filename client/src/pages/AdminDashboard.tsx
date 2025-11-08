import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import TabNavigation, { DashboardTab } from "@/components/TabNavigation";
import TimelineTable, { TimelineRow } from "@/components/TimelineTable";
import PatientTable, { Patient } from "@/components/PatientTable";
import NursingNotesTable, { NursingNote } from "@/components/NursingNotesTable";
import BulletinBoard, { BulletinItem } from "@/components/BulletinBoard";
import AddTreatmentModal from "@/components/AddTreatmentModal";
import AddPatientModal from "@/components/AddPatientModal";
import AddNursingNoteModal from "@/components/AddNursingNoteModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Patient as BackendPatient, NursingNote as BackendNursingNote, Staff } from "@shared/schema";

export default function AdminDashboard() {
  const { admin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!admin) {
      setLocation('/login');
    }
  }, [admin, setLocation]);

  // Redirect to master data page when master tab is clicked
  useEffect(() => {
    if (activeTab === 'master') {
      setLocation('/admin/master-data');
    }
  }, [activeTab, setLocation]);
  
  const [showAddTreatmentModal, setShowAddTreatmentModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [modalDefaults, setModalDefaults] = useState<{ time?: string; patient?: string }>({});

  // Mock data removed -
    patient: {
      ipdNumber: 'IPD001',
      name: 'John Smith',
      age: 65,
      gender: 'M',
      bed: 'A-101',
      ward: 'ICU',
      diagnosis: 'Pneumonia',
    },
    treatments: [
      { id: '1', type: 'medication', name: 'Amoxicillin', details: '500mg IV', isCompleted: false, priority: 'High' },
      { id: '2', type: 'medication', name: 'Paracetamol', details: '650mg PO', isCompleted: false, priority: 'Medium' },
    ],
  },
  {
    time: '06:00 AM',
    patient: {
      ipdNumber: 'IPD002',
      name: 'Mary Johnson',
      age: 45,
      gender: 'F',
      bed: 'B-205',
      ward: 'General',
      diagnosis: 'Diabetes',
    },
    treatments: [
      { id: '3', type: 'procedure', name: 'Blood Sugar Check', isCompleted: true, priority: 'High' },
    ],
  },
  {
    time: '06:15 AM',
    patient: {
      ipdNumber: 'IPD003',
      name: 'Robert Davis',
      age: 72,
      gender: 'M',
      bed: 'A-103',
      ward: 'ICU',
      diagnosis: 'Heart Failure',
    },
    treatments: [
      { id: '4', type: 'investigation', name: 'Blood Glucose Test', isCompleted: false, priority: 'High' },
    ],
  },
];

const mockPatients: Patient[] = [
  {
    id: '1',
    ipdNumber: 'IPD001',
    name: 'John Smith',
    age: 65,
    gender: 'M',
    bed: 'A-101',
    ward: 'ICU',
    diagnosis: 'Pneumonia',
    admissionDate: new Date('2024-01-15'),
    isDischarged: false,
  },
  {
    id: '2',
    ipdNumber: 'IPD002',
    name: 'Mary Johnson',
    age: 45,
    gender: 'F',
    bed: 'B-205',
    ward: 'General',
    diagnosis: 'Diabetes',
    admissionDate: new Date('2024-01-18'),
    isDischarged: false,
  },
];

const mockNursingNotes: NursingNote[] = [
  {
    id: '1',
    patientName: 'John Smith',
    ipdNumber: 'IPD001',
    noteType: 'Observation',
    note: 'Patient showing improvement in respiratory function. Oxygen saturation stable at 95%. Cough less frequent.',
    recordedBy: 'Nurse Sarah Williams',
    recordedAt: new Date('2024-01-20T08:30:00'),
  },
  {
    id: '2',
    patientName: 'Mary Johnson',
    ipdNumber: 'IPD002',
    noteType: 'Assessment',
    note: 'Blood glucose levels stable. Patient reports feeling better. No signs of hypoglycemia.',
    recordedBy: 'Dr. Emily Chen',
    recordedAt: new Date('2024-01-20T10:15:00'),
  },
  {
    id: '3',
    patientName: 'John Smith',
    ipdNumber: 'IPD001',
    noteType: 'Progress',
    note: 'Patient able to walk short distances with assistance. Appetite improving. Family visited today.',
    recordedBy: 'Nurse Michael Brown',
    recordedAt: new Date('2024-01-20T14:00:00'),
  },
];

const mockBulletinItems: BulletinItem[] = [
  {
    id: '1',
    time: '06:00',
    patientName: 'John Smith',
    ipdNumber: 'IPD001',
    treatmentType: 'medication',
    treatmentName: 'Amoxicillin',
    details: '500mg IV',
    priority: 'High',
    isOverdue: false,
    bedNumber: 'A-101',
  },
  {
    id: '2',
    time: '06:00',
    patientName: 'Mary Johnson',
    ipdNumber: 'IPD002',
    treatmentType: 'procedure',
    treatmentName: 'Blood Sugar Check',
    priority: 'Medium',
    isOverdue: false,
    bedNumber: 'B-205',
  },
  {
    id: '3',
    time: '06:15',
    patientName: 'Robert Davis',
    ipdNumber: 'IPD003',
    treatmentType: 'investigation',
    treatmentName: 'Blood Glucose Test',
    priority: 'High',
    isOverdue: false,
    bedNumber: 'A-103',
  },
  {
    id: '4',
    time: '06:30',
    patientName: 'John Smith',
    ipdNumber: 'IPD001',
    treatmentType: 'medication',
    treatmentName: 'Paracetamol',
    details: '650mg PO',
    priority: 'Low',
    isOverdue: false,
    bedNumber: 'A-101',
  },
];

export default function AdminDashboard() {
  const { admin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!admin) {
      setLocation('/login');
    }
  }, [admin, setLocation]);

  // Redirect to master data page when master tab is clicked
  useEffect(() => {
    if (activeTab === 'master') {
      setLocation('/admin/master-data');
    }
  }, [activeTab, setLocation]);
  const [showBulletinBoard, setShowBulletinBoard] = useState(true);
  const [bulletinItems, setBulletinItems] = useState(mockBulletinItems);
  const [showAddTreatmentModal, setShowAddTreatmentModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
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
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      toast({ title: "Success", description: "Patient added successfully" });
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

  const handleAddTreatment = (time: string, patientId: string) => {
    setModalDefaults({ time, patient: patientId });
    setShowAddTreatmentModal(true);
  };

  const handleBulletinItemClick = (id: string) => {
    console.log('Bulletin item clicked:', id);
    // Mark as acknowledged or navigate to details
    setBulletinItems(bulletinItems.filter(item => item.id !== id));
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
          adminName={admin?.full_name || "Admin"}
          onNotificationClick={() => setShowBulletinBoard(!showBulletinBoard)}
        />
        
        <div className="pt-16">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          
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
                    onViewDetails={(id) => console.log('View patient:', id)}
                    onEdit={(id) => console.log('Edit patient:', id)}
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
