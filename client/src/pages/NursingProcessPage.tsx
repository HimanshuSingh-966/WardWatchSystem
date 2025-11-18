import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit } from "lucide-react";
import type { Patient as BackendPatient, NursingProcess } from "@shared/schema";

export default function NursingProcessPage() {
  const { admin, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [signSymptoms, setSignSymptoms] = useState("");
  const [nurseDiagnosis, setNurseDiagnosis] = useState("");
  const [intervention, setIntervention] = useState("");

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

  const { data: nursingProcesses = [], isLoading: processesLoading } = useQuery<NursingProcess[]>({
    queryKey: ['/api/nursing-process'],
    queryFn: async () => {
      const res = await fetch('/api/nursing-process', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch nursing processes');
      return res.json();
    }
  });

  const processMap = new Map(nursingProcesses.map(p => [p.patient_id, p]));

  const patientsWithProcess = backendPatients.map(patient => {
    const process = processMap.get(patient.patient_id);
    return {
      patient_id: patient.patient_id,
      patient_name: patient.patient_name,
      ipd_number: patient.ipd_number,
      bed_number: patient.bed_number,
      process_id: process?.process_id,
      sign_symptoms: process?.sign_symptoms || '',
      nurse_diagnosis: process?.nurse_diagnosis || '',
      intervention: process?.intervention || '',
    };
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.process_id) {
        return apiRequest(`/api/nursing-process/${data.process_id}`, 'PATCH', {
          sign_symptoms: data.sign_symptoms,
          nurse_diagnosis: data.nurse_diagnosis,
          intervention: data.intervention,
        });
      } else {
        return apiRequest('/api/nursing-process', 'POST', {
          patient_id: data.patient_id,
          sign_symptoms: data.sign_symptoms,
          nurse_diagnosis: data.nurse_diagnosis,
          intervention: data.intervention,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nursing-process'] });
      toast({ title: "Success", description: "Nursing process updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleEdit = (patient: any) => {
    setEditingPatient(patient);
    setSignSymptoms(patient.sign_symptoms || '');
    setNurseDiagnosis(patient.nurse_diagnosis || '');
    setIntervention(patient.intervention || '');
    setShowEditModal(true);
  };

  const handleSubmit = () => {
    if (!editingPatient) return;

    createOrUpdateMutation.mutate({
      patient_id: editingPatient.patient_id,
      process_id: editingPatient.process_id,
      sign_symptoms: signSymptoms,
      nurse_diagnosis: nurseDiagnosis,
      intervention: intervention,
    });

    setShowEditModal(false);
    setEditingPatient(null);
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
          
          <Card>
            <CardHeader>
              <CardTitle>Nursing Process</CardTitle>
              <CardDescription>Document patient assessment, diagnosis, and interventions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-card">
                    <TableRow>
                      <TableHead className="font-semibold">Patient Name</TableHead>
                      <TableHead className="font-semibold">IPD No.</TableHead>
                      <TableHead className="font-semibold">Bed No.</TableHead>
                      <TableHead className="font-semibold">Sign & Symptoms</TableHead>
                      <TableHead className="font-semibold">Nurse Diagnosis</TableHead>
                      <TableHead className="font-semibold">Intervention</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processesLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : patientsWithProcess.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          No active patients found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      patientsWithProcess.map((patient) => (
                        <TableRow 
                          key={patient.patient_id}
                          className="hover-elevate"
                          data-testid={`row-process-${patient.patient_id}`}
                        >
                          <TableCell className="font-medium">{patient.patient_name}</TableCell>
                          <TableCell className="font-mono text-sm">{patient.ipd_number}</TableCell>
                          <TableCell>{patient.bed_number}</TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {patient.sign_symptoms || '-'}
                            </p>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {patient.nurse_diagnosis || '-'}
                            </p>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {patient.intervention || '-'}
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(patient)}
                              data-testid={`button-edit-${patient.patient_id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-3xl" data-testid="modal-edit-process">
          <DialogHeader>
            <DialogTitle>Edit Nursing Process</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                  {editingPatient?.patient_name}
                </div>
              </div>
              <div className="space-y-2">
                <Label>IPD No.</Label>
                <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                  {editingPatient?.ipd_number}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bed No.</Label>
                <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                  {editingPatient?.bed_number}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signSymptoms">Sign & Symptoms</Label>
              <Textarea
                id="signSymptoms"
                value={signSymptoms}
                onChange={(e) => setSignSymptoms(e.target.value)}
                placeholder="Document observed signs and symptoms..."
                rows={4}
                data-testid="textarea-sign-symptoms"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nurseDiagnosis">Nurse Diagnosis</Label>
              <Textarea
                id="nurseDiagnosis"
                value={nurseDiagnosis}
                onChange={(e) => setNurseDiagnosis(e.target.value)}
                placeholder="Enter nursing diagnosis..."
                rows={4}
                data-testid="textarea-nurse-diagnosis"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="intervention">Intervention</Label>
              <Textarea
                id="intervention"
                value={intervention}
                onChange={(e) => setIntervention(e.target.value)}
                placeholder="Document nursing interventions..."
                rows={4}
                data-testid="textarea-intervention"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              data-testid="button-submit"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
