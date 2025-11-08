import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddNursingNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function AddNursingNoteModal({
  open,
  onClose,
  onSubmit,
}: AddNursingNoteModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log('Submit nursing note:', data);
    onSubmit?.(data);
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
                <Label htmlFor="patient">Patient</Label>
                <Select name="patient">
                  <SelectTrigger data-testid="select-patient">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IPD001">John Smith (IPD001)</SelectItem>
                    <SelectItem value="IPD002">Mary Johnson (IPD002)</SelectItem>
                    <SelectItem value="IPD003">Robert Davis (IPD003)</SelectItem>
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
              <Select name="recordedBy">
                <SelectTrigger data-testid="select-recorded-by">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nurse1">Nurse Sarah Williams</SelectItem>
                  <SelectItem value="nurse2">Nurse Michael Brown</SelectItem>
                  <SelectItem value="doctor1">Dr. Emily Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit">
              Add Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
