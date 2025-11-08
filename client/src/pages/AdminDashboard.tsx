import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import TabNavigation, { DashboardTab } from "@/components/TabNavigation";
import TimelineTable, { TimelineRow } from "@/components/TimelineTable";
import PatientTable, { Patient } from "@/components/PatientTable";
import NursingNotesTable, { NursingNote } from "@/components/NursingNotesTable";
import NotificationPopup, { Notification } from "@/components/NotificationPopup";
import AddTreatmentModal from "@/components/AddTreatmentModal";
import AddPatientModal from "@/components/AddPatientModal";
import AddNursingNoteModal from "@/components/AddNursingNoteModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// TODO: Remove mock data - replace with actual API calls
const mockTimelineData: TimelineRow[] = [
  {
    time: '06:00 AM',
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

const mockNotifications: Notification[] = [
  {
    id: '1',
    treatmentType: 'medication',
    message: 'Amoxicillin 500mg IV due',
    patientName: 'John Smith (IPD001)',
    scheduledTime: '06:00 AM',
    priority: 'High',
    isOverdue: false,
  },
  {
    id: '2',
    treatmentType: 'procedure',
    message: 'Blood pressure check',
    patientName: 'Mary Johnson (IPD002)',
    scheduledTime: '06:15 AM',
    priority: 'Medium',
    isOverdue: false,
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [showNotifications, setShowNotifications] = useState(true);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showAddTreatmentModal, setShowAddTreatmentModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [modalDefaults, setModalDefaults] = useState<{ time?: string; patient?: string }>({});

  const handleAddTreatment = (time: string, patientId: string) => {
    setModalDefaults({ time, patient: patientId });
    setShowAddTreatmentModal(true);
  };

  const handleAcknowledge = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        notificationCount={notifications.length}
        adminName="Dr. Sarah Chen"
        onNotificationClick={() => setShowNotifications(!showNotifications)}
      />
      
      <div className="pt-16">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-8 py-8">
          {activeTab === 'overview' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Treatment Timeline</h2>
              </div>
              <TimelineTable
                data={mockTimelineData}
                onAddTreatment={handleAddTreatment}
                onEditTreatment={(id) => console.log('Edit treatment:', id)}
                onDeleteTreatment={(id) => console.log('Delete treatment:', id)}
                onToggleComplete={(id) => console.log('Toggle complete:', id)}
              />
            </div>
          )}
          
          {activeTab === 'medications' && (
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Medication Orders</h2>
              <TimelineTable
                data={mockTimelineData.map(row => ({
                  ...row,
                  treatments: row.treatments.filter(t => t.type === 'medication')
                }))}
                onAddTreatment={handleAddTreatment}
                onEditTreatment={(id) => console.log('Edit medication:', id)}
                onDeleteTreatment={(id) => console.log('Delete medication:', id)}
                onToggleComplete={(id) => console.log('Toggle complete:', id)}
              />
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
              <PatientTable
                patients={mockPatients}
                onViewDetails={(id) => console.log('View patient:', id)}
                onEdit={(id) => console.log('Edit patient:', id)}
                onDischarge={(id) => console.log('Discharge patient:', id)}
              />
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
              <NursingNotesTable
                notes={mockNursingNotes}
                onEdit={(id) => console.log('Edit note:', id)}
                onDelete={(id) => console.log('Delete note:', id)}
              />
            </div>
          )}
          
          {(activeTab === 'procedures' || activeTab === 'investigations' || 
            activeTab === 'vitals' || activeTab === 'staff' || activeTab === 'departments' || activeTab === 'master') && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h2>
              <p className="text-muted-foreground">
                This section will be implemented with backend integration
              </p>
            </div>
          )}
        </main>
      </div>
      
      {showNotifications && notifications.length > 0 && (
        <NotificationPopup
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onAcknowledge={handleAcknowledge}
        />
      )}
      
      <AddTreatmentModal
        open={showAddTreatmentModal}
        onClose={() => setShowAddTreatmentModal(false)}
        defaultTime={modalDefaults.time}
        defaultPatient={modalDefaults.patient}
      />
      
      <AddPatientModal
        open={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onSubmit={(data) => console.log('New patient:', data)}
      />
      
      <AddNursingNoteModal
        open={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        onSubmit={(data) => console.log('New nursing note:', data)}
      />
    </div>
  );
}
