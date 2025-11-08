import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddPatientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function AddPatientModal({
  open,
  onClose,
  onSubmit,
}: AddPatientModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log('Submit patient:', data);
    onSubmit?.(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-add-patient">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ipdNumber">IPD Number</Label>
                <Input
                  id="ipdNumber"
                  name="ipdNumber"
                  placeholder="IPD001"
                  required
                  data-testid="input-ipd-number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  data-testid="input-name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="65"
                  required
                  data-testid="input-age"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue="M">
                  <SelectTrigger data-testid="select-gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="O">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="+1234567890"
                  data-testid="input-contact"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bed">Bed Number</Label>
                <Input
                  id="bed"
                  name="bed"
                  placeholder="A-101"
                  required
                  data-testid="input-bed"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <Select name="ward">
                  <SelectTrigger data-testid="select-ward">
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="General">General Ward</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Pediatric">Pediatric</SelectItem>
                    <SelectItem value="Surgical">Surgical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input
                id="diagnosis"
                name="diagnosis"
                placeholder="Primary diagnosis"
                required
                data-testid="input-diagnosis"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admissionDate">Admission Date</Label>
              <Input
                id="admissionDate"
                name="admissionDate"
                type="date"
                required
                data-testid="input-admission-date"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Patient address"
                rows={2}
                data-testid="textarea-address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                name="emergencyContact"
                placeholder="Name and phone number"
                data-testid="input-emergency-contact"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit">
              Add Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
