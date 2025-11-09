import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Patient, Staff, PatientStaffAssignment } from "@shared/schema";

interface EditPatientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  patient: Patient | null;
  staff?: Staff[];
  assignments?: PatientStaffAssignment[];
}

export default function EditPatientModal({
  open,
  onClose,
  onSubmit,
  patient,
  staff = [],
  assignments = [],
}: EditPatientModalProps) {
  const [doctorId, setDoctorId] = useState<string>("");
  const [nurseId, setNurseId] = useState<string>("");

  useEffect(() => {
    if (patient && assignments.length >= 0) {
      const doctorAssignment = assignments.find(a => a.assignment_role === 'Doctor');
      const nurseAssignment = assignments.find(a => a.assignment_role === 'Nurse');
      setDoctorId(doctorAssignment?.staff_id || "");
      setNurseId(nurseAssignment?.staff_id || "");
    }
  }, [patient, assignments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    const submitData = {
      ...data,
      doctor_id: doctorId || null,
      nurse_id: nurseId || null,
    };
    
    console.log('Update patient:', submitData);
    onSubmit?.(submitData);
    onClose();
  };

  const doctors = staff.filter(s => s.role === 'Doctor');
  const nurses = staff.filter(s => s.role === 'Nurse');

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-edit-patient">
        <DialogHeader>
          <DialogTitle>Edit Patient - {patient.patient_name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ipdNumber">IPD Number</Label>
                <Input
                  id="ipdNumber"
                  name="ipdNumber"
                  defaultValue={patient.ipd_number}
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
                  defaultValue={patient.patient_name}
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
                  defaultValue={patient.age}
                  placeholder="65"
                  required
                  data-testid="input-age"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue={patient.gender}>
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
                  defaultValue={patient.contact_number || ""}
                  placeholder="+1234567890"
                  data-testid="input-contact"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Assign Doctor</Label>
                <Select value={doctorId} onValueChange={setDoctorId}>
                  <SelectTrigger data-testid="select-doctor">
                    <SelectValue placeholder="Select doctor (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.staff_id} value={doctor.staff_id}>
                        {doctor.staff_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nurse">Assign Nurse</Label>
                <Select value={nurseId} onValueChange={setNurseId}>
                  <SelectTrigger data-testid="select-nurse">
                    <SelectValue placeholder="Select nurse (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {nurses.map((nurse) => (
                      <SelectItem key={nurse.staff_id} value={nurse.staff_id}>
                        {nurse.staff_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bed">Bed Number</Label>
                <Input
                  id="bed"
                  name="bed"
                  defaultValue={patient.bed_number}
                  placeholder="A-101"
                  required
                  data-testid="input-bed"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <Select name="ward" defaultValue={patient.ward}>
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
                defaultValue={patient.diagnosis}
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
                defaultValue={patient.admission_date.toString().split('T')[0]}
                required
                data-testid="input-admission-date"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                defaultValue={patient.address || ""}
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
                defaultValue={patient.emergency_contact || ""}
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
              Update Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
