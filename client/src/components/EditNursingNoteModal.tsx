import { useState, useEffect } from "react";
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

interface NursingNote {
  id: string;
  patientName: string;
  ipdNumber: string;
  noteType: string;
  note: string;
  recordedBy: string;
}

interface EditNursingNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (id: string, data: any) => void;
  note: NursingNote | null;
  patients?: Patient[];
  staff?: Staff[];
  isLoadingData?: boolean;
}

export default function EditNursingNoteModal({
  open,
  onClose,
  onSubmit,
  note,
  patients = [],
  staff = [],
  isLoadingData = false,
}: EditNursingNoteModalProps) {
  const [noteType, setNoteType] = useState("");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (note) {
      setNoteType(note.noteType);
      setNoteText(note.note);
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!note || !noteType || !noteText.trim()) {
      return;
    }
    
    const data = {
      note_type: noteType,
      note: noteText,
    };
    
    try {
      await onSubmit?.(note.id, data);
      onClose();
    } catch (error) {
      // Error is handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-edit-nursing-note">
        <DialogHeader>
          <DialogTitle>Edit Nursing Note</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                  {note?.patientName} ({note?.ipdNumber})
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="noteType">Note Type</Label>
                <Select name="noteType" value={noteType} onValueChange={setNoteType}>
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
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your nursing note here..."
                rows={8}
                required
                data-testid="textarea-note"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Recorded By</Label>
              <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                {note?.recordedBy}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={!noteType || !noteText.trim()} data-testid="button-submit">
              Update Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
