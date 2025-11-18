import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Patient {
  id: string;
  ipdNumber: string;
  name: string;
}

interface RecordVitalSignsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  patients?: Patient[];
  isLoadingData?: boolean;
}

export default function RecordVitalSignsModal({
  open,
  onClose,
  onSubmit,
  patients = [],
  isLoadingData = false,
}: RecordVitalSignsModalProps) {
  const [selectedPatient, setSelectedPatient] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      return;
    }
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      patient: selectedPatient,
      temperature: formData.get('temperature') ? parseFloat(formData.get('temperature') as string) : undefined,
      bloodPressureSystolic: formData.get('systolic') ? parseInt(formData.get('systolic') as string) : undefined,
      bloodPressureDiastolic: formData.get('diastolic') ? parseInt(formData.get('diastolic') as string) : undefined,
      heartRate: formData.get('heartRate') ? parseInt(formData.get('heartRate') as string) : undefined,
      respiratoryRate: formData.get('respiratoryRate') ? parseInt(formData.get('respiratoryRate') as string) : undefined,
      oxygenSaturation: formData.get('spo2') ? parseFloat(formData.get('spo2') as string) : undefined,
    };
    
    onSubmit?.(data);
    setSelectedPatient("");
    (e.target as HTMLFormElement).reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-record-vitals">
        <DialogHeader>
          <DialogTitle>Record Vital Signs</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient <span className="text-destructive">*</span></Label>
              <Select name="patient" value={selectedPatient} onValueChange={setSelectedPatient} required disabled={isLoadingData}>
                <SelectTrigger data-testid="select-patient">
                  <SelectValue placeholder={isLoadingData ? "Loading patients..." : "Select patient"} />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.ipdNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  min="90"
                  max="110"
                  placeholder="98.6"
                  data-testid="input-temperature"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  name="heartRate"
                  type="number"
                  min="30"
                  max="200"
                  placeholder="72"
                  data-testid="input-heart-rate"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Blood Pressure (mmHg)</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    name="systolic"
                    type="number"
                    min="60"
                    max="250"
                    placeholder="120"
                    data-testid="input-systolic"
                  />
                  <span className="text-muted-foreground">/</span>
                  <Input
                    name="diastolic"
                    type="number"
                    min="40"
                    max="150"
                    placeholder="80"
                    data-testid="input-diastolic"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="spo2">SpO2 (%)</Label>
                <Input
                  id="spo2"
                  name="spo2"
                  type="number"
                  step="0.1"
                  min="70"
                  max="100"
                  placeholder="98"
                  data-testid="input-spo2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                <Input
                  id="respiratoryRate"
                  name="respiratoryRate"
                  type="number"
                  min="8"
                  max="40"
                  placeholder="16"
                  data-testid="input-respiratory-rate"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedPatient} data-testid="button-submit">
              Record Vitals
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
