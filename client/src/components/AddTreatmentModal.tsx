import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

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
  const [treatmentType, setTreatmentType] = useState<'medication' | 'procedure' | 'investigation'>('medication');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log('Submit treatment:', { ...data, treatmentType });
    onSubmit?.({ ...data, treatmentType });
    onClose();
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
                <Label htmlFor="patient">Patient IPD</Label>
                <Input
                  id="patient"
                  name="patient"
                  defaultValue={defaultPatient}
                  placeholder="IPD001"
                  required
                  data-testid="input-patient"
                />
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
                    <Select name="medication">
                      <SelectTrigger data-testid="select-medication">
                        <SelectValue placeholder="Select medication" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amoxicillin">Amoxicillin</SelectItem>
                        <SelectItem value="paracetamol">Paracetamol</SelectItem>
                        <SelectItem value="insulin">Insulin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="route">Route</Label>
                    <Select name="route">
                      <SelectTrigger data-testid="select-route">
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oral">Oral (PO)</SelectItem>
                        <SelectItem value="iv">Intravenous (IV)</SelectItem>
                        <SelectItem value="im">Intramuscular (IM)</SelectItem>
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
                <Select name="procedure">
                  <SelectTrigger data-testid="select-procedure">
                    <SelectValue placeholder="Select procedure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood-pressure">Blood Pressure Check</SelectItem>
                    <SelectItem value="wound-dressing">Wound Dressing</SelectItem>
                    <SelectItem value="catheter">Catheter Insertion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {treatmentType === 'investigation' && (
              <div className="space-y-2">
                <Label htmlFor="investigation">Investigation</Label>
                <Select name="investigation">
                  <SelectTrigger data-testid="select-investigation">
                    <SelectValue placeholder="Select investigation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood-glucose">Blood Glucose Test</SelectItem>
                    <SelectItem value="chest-xray">Chest X-Ray</SelectItem>
                    <SelectItem value="ecg">ECG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" defaultValue="Medium">
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
