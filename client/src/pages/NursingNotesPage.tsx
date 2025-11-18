import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import NursingNotesTable, { NursingNote } from "@/components/NursingNotesTable";
import AddNursingNoteModal from "@/components/AddNursingNoteModal";
import EditNursingNoteModal from "@/components/EditNursingNoteModal";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import type { Patient as BackendPatient, NursingNote as BackendNursingNote, Staff } from "@shared/schema";

export default function NursingNotesPage() {
  const { admin, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<NursingNote | null>(null);

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

  const { data: backendPatients = [] } = useQuery<BackendPatient[]>({
    queryKey: ['/api/patients'],
    queryFn: async () => {
      const res = await fetch('/api/patients?discharged=false', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch patients');
      return res.json();
    }
  });

  const patients = backendPatients.map(p => ({
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

  const { data: staffList = [], isLoading: staffLoading } = useQuery<Staff[]>({
    queryKey: ['/api/staff'],
    queryFn: async () => {
      const res = await fetch('/api/staff', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch staff');
      return res.json();
    }
  });

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

  const updateNursingNoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const result = await apiRequest(`/api/nursing-notes/${id}`, 'PATCH', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nursing-notes'] });
      toast({ title: "Success", description: "Nursing note updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      throw error;
    }
  });

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
              onEdit={(id) => {
                const note = nursingNotes.find(n => n.id === id);
                if (note) {
                  setEditingNote(note);
                  setShowEditNoteModal(true);
                }
              }}
              onDelete={(id) => deleteNursingNoteMutation.mutate(id)}
            />
          )}
        </div>
      </main>
      
      <AddNursingNoteModal
        open={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        onSubmit={(data) => addNursingNoteMutation.mutate(data)}
        patients={patients}
        staff={staffList}
        isLoadingData={staffLoading}
      />
      
      <EditNursingNoteModal
        open={showEditNoteModal}
        onClose={() => {
          setShowEditNoteModal(false);
          setEditingNote(null);
        }}
        onSubmit={async (id, data) => {
          await updateNursingNoteMutation.mutateAsync({ id, data });
        }}
        note={editingNote}
        patients={patients}
        staff={staffList}
        isLoadingData={staffLoading}
      />
    </div>
  );
}
