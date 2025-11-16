import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Medication, Procedure, Investigation, Patient, Route } from "@shared/schema";

interface AddTreatmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  defaultTime?: string;
  defaultPatient?: string;
}

export default function AddTreatmentModal({
  open,
  onClose,
  onSubmit,
  defaultTime,
  defaultPatient,
}: AddTreatmentModalProps) {
  const { toast } = useToast();
  const [treatmentType, setTreatmentType] = useState<'medication' | 'procedure' | 'investigation'>('medication');
  const [selectedPatient, setSelectedPatient] = useState(defaultPatient || '');
  const [selectedMedication, setSelectedMedication] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedInvestigation, setSelectedInvestigation] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [priority, setPriority] = useState('Medium');

  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ['/api/patients?discharged=false'],
    enabled: open,
  });

  const { data: medications = [] } = useQuery<Medication[]>({
    queryKey: ['/api/medications'],
    enabled: open && treatmentType === 'medication',
  });

  const { data: procedures = [] } = useQuery<Procedure[]>({
    queryKey: ['/api/procedures'],
    enabled: open && treatmentType === 'procedure',
  });

  const { data: investigations = [] } = useQuery<Investigation[]>({
    queryKey: ['/api/investigations'],
    enabled: open && treatmentType === 'investigation',
  });

  const { data: routes = [] } = useQuery<Route[]>({
    queryKey: ['/api/routes'],
    enabled: open && treatmentType === 'medication',
  });

  const createMedicationOrder = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/medication-orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timeline'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/pending'] });
      toast({ title: "Success", description: "Medication order created successfully" });
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createProcedureOrder = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/procedure-orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timeline'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/pending'] });
      toast({ title: "Success", description: "Procedure order created successfully" });
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createInvestigationOrder = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/investigation-orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timeline'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/pending'] });
      toast({ title: "Success", description: "Investigation order created successfully" });
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const time = formData.get('time') as string;
    const notes = formData.get('notes') as string;
    const startDate = new Date().toISOString().split('T')[0];

    if (treatmentType === 'medication') {
      const dosage = formData.get('dosage') as string;
      const frequency = formData.get('frequency') as string;
      createMedicationOrder.mutate({
        patient_id: selectedPatient,
        medication_id: selectedMedication,
        route_id: selectedRoute || undefined,
        scheduled_time: time,
        frequency,
        start_date: startDate,
        dosage_amount: dosage,
        priority,
        notes,
      });
    } else if (treatmentType === 'procedure') {
      const scheduledDateTime = new Date();
      const [hours, minutes] = time.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      createProcedureOrder.mutate({
        patient_id: selectedPatient,
        procedure_id: selectedProcedure,
        scheduled_time: scheduledDateTime.toISOString(),
        priority,
        notes,
      });
    } else if (treatmentType === 'investigation') {
      const scheduledDateTime = new Date();
      const [hours, minutes] = time.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      createInvestigationOrder.mutate({
        patient_id: selectedPatient,
        investigation_id: selectedInvestigation,
        scheduled_time: scheduledDateTime.toISOString(),
        priority,
        notes,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-add-treatment">
        <DialogHeader>
          <DialogTitle>Add New Treatment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Scheduled Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  defaultValue={defaultTime}
                  required
                  data-testid="input-time"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient} required>
                  <SelectTrigger data-testid="select-patient">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.patient_id} value={patient.patient_id}>
                        {patient.ipd_number} - {patient.patient_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="treatmentType">Treatment Type</Label>
              <Select value={treatmentType} onValueChange={(v: any) => setTreatmentType(v)}>
                <SelectTrigger data-testid="select-treatment-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="investigation">Investigation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {treatmentType === 'medication' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication</Label>
                    <Select value={selectedMedication} onValueChange={setSelectedMedication} required>
                      <SelectTrigger data-testid="select-medication">
                        <SelectValue placeholder="Select medication" />
                      </SelectTrigger>
                      <SelectContent>
                        {medications.map((med) => (
                          <SelectItem key={med.medication_id} value={med.medication_id}>
                            {med.medication_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="route">Route</Label>
                    <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                      <SelectTrigger data-testid="select-route">
                        <SelectValue placeholder="Select route (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {routes.map((route) => (
                          <SelectItem key={route.route_id} value={route.route_id}>
                            {route.route_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      name="dosage"
                      placeholder="500mg"
                      data-testid="input-dosage"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                      id="frequency"
                      name="frequency"
                      placeholder="BID, TID, etc."
                      data-testid="input-frequency"
                    />
                  </div>
                </div>
              </>
            )}
            
            {treatmentType === 'procedure' && (
              <div className="space-y-2">
                <Label htmlFor="procedure">Procedure</Label>
                <Select value={selectedProcedure} onValueChange={setSelectedProcedure} required>
                  <SelectTrigger data-testid="select-procedure">
                    <SelectValue placeholder="Select procedure" />
                  </SelectTrigger>
                  <SelectContent>
                    {procedures.map((proc) => (
                      <SelectItem key={proc.procedure_id} value={proc.procedure_id}>
                        {proc.procedure_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {treatmentType === 'investigation' && (
              <div className="space-y-2">
                <Label htmlFor="investigation">Investigation</Label>
                <Select value={selectedInvestigation} onValueChange={setSelectedInvestigation} required>
                  <SelectTrigger data-testid="select-investigation">
                    <SelectValue placeholder="Select investigation" />
                  </SelectTrigger>
                  <SelectContent>
                    {investigations.map((inv) => (
                      <SelectItem key={inv.investigation_id} value={inv.investigation_id}>
                        {inv.investigation_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger data-testid="select-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional notes..."
                rows={3}
                data-testid="textarea-notes"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit">
              Add Treatment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
