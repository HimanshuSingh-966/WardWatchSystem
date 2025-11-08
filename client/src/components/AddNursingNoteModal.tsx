import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Patient {
  id: string;
  ipdNumber: string;
  name: string;
}

interface Staff {
  staff_id: string;
  staff_name: string;
}

interface AddNursingNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  patients?: Patient[];
  staff?: Staff[];
  isLoadingData?: boolean;
}

export default function AddNursingNoteModal({
  open,
  onClose,
  onSubmit,
  patients = [],
  staff = [],
  isLoadingData = false,
}: AddNursingNoteModalProps) {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      return;
    }
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      patient: selectedPatient,
      noteType: formData.get('noteType') as string,
      note: formData.get('note') as string,
      recordedBy: selectedStaff || undefined,
    };
    
    onSubmit?.(data);
    setSelectedPatient("");
    setSelectedStaff("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-add-nursing-note">
        <DialogHeader>
          <DialogTitle>Add Nursing Note</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="noteType">Note Type</Label>
                <Select name="noteType" defaultValue="Observation">
                  <SelectTrigger data-testid="select-note-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Observation">General Observation</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="Intervention">Intervention</SelectItem>
                    <SelectItem value="Progress">Progress Note</SelectItem>
                    <SelectItem value="Handover">Handover Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                name="note"
                placeholder="Enter your nursing note here..."
                rows={8}
                required
                data-testid="textarea-note"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recordedBy">Recorded By</Label>
              <Select name="recordedBy" value={selectedStaff} onValueChange={setSelectedStaff} disabled={isLoadingData}>
                <SelectTrigger data-testid="select-recorded-by">
                  <SelectValue placeholder={isLoadingData ? "Loading staff..." : "Select staff member (optional)"} />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((staffMember) => (
                    <SelectItem key={staffMember.staff_id} value={staffMember.staff_id}>
                      {staffMember.staff_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedPatient} data-testid="button-submit">
              Add Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
