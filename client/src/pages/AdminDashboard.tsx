import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import TabNavigation, { DashboardTab } from "@/components/TabNavigation";
import TimelineTable, { TimelineRow } from "@/components/TimelineTable";
import PatientTable, { Patient } from "@/components/PatientTable";
import NotificationPopup, { Notification } from "@/components/NotificationPopup";
import AddTreatmentModal from "@/components/AddTreatmentModal";

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalDefaults, setModalDefaults] = useState<{ time?: string; patient?: string }>({});

  const handleAddTreatment = (time: string, patientId: string) => {
    setModalDefaults({ time, patient: patientId });
    setShowAddModal(true);
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
              <h2 className="text-2xl font-semibold text-foreground mb-6">Treatment Timeline</h2>
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
              <h2 className="text-2xl font-semibold text-foreground mb-6">Patient Management</h2>
              <PatientTable
                patients={mockPatients}
                onViewDetails={(id) => console.log('View patient:', id)}
                onEdit={(id) => console.log('Edit patient:', id)}
                onDischarge={(id) => console.log('Discharge patient:', id)}
              />
            </div>
          )}
          
          {(activeTab === 'procedures' || activeTab === 'investigations' || activeTab === 'notes' || 
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
      
      {showNotifications && (
        <NotificationPopup
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onAcknowledge={handleAcknowledge}
        />
      )}
      
      <AddTreatmentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        defaultTime={modalDefaults.time}
        defaultPatient={modalDefaults.patient}
      />
    </div>
  );
}
