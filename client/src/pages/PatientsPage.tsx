import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import PatientTable, { Patient } from "@/components/PatientTable";
import AddPatientModal from "@/components/AddPatientModal";
import EditPatientModal from "@/components/EditPatientModal";
import PatientDetailsModal from "@/components/PatientDetailsModal";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import type { Patient as BackendPatient, Staff, PatientDetails, PatientStaffAssignment } from "@shared/schema";

export default function PatientsPage() {
  const { admin, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

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

  const { data: staffList = [] } = useQuery<Staff[]>({
    queryKey: ['/api/staff'],
    queryFn: async () => {
      const res = await fetch('/api/staff', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch staff');
      return res.json();
    }
  });

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
      </main>
      
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
    </div>
  );
}
