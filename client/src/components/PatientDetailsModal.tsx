import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Stethoscope, UserRound, Calendar, MapPin, Phone, AlertCircle, Activity, FileText, Pill, FlaskConical } from "lucide-react";
import { format } from "date-fns";
import type { PatientDetails } from "@shared/schema";

interface PatientDetailsModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string | null;
  patientDetails: PatientDetails | null;
  isLoading?: boolean;
}

export default function PatientDetailsModal({
  open,
  onClose,
  patientDetails,
  isLoading,
}: PatientDetailsModalProps) {
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-patient-details">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          <div className="text-center py-12 text-muted-foreground">Loading patient details...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!patientDetails) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-patient-details">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Details - {patientDetails.patient_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">IPD Number</p>
                  <p className="font-mono font-medium" data-testid="text-ipd-number">{patientDetails.ipd_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age / Gender</p>
                  <p className="font-medium" data-testid="text-age-gender">{patientDetails.age} / {patientDetails.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bed Number</p>
                  <p className="font-medium" data-testid="text-bed">{patientDetails.bed_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ward</p>
                  <p className="font-medium" data-testid="text-ward">{patientDetails.ward}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">Diagnosis</p>
                <p className="font-medium" data-testid="text-diagnosis">{patientDetails.diagnosis}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Admission Date</p>
                    <p className="font-medium" data-testid="text-admission-date">
                      {format(new Date(patientDetails.admission_date), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium" data-testid="text-contact">{patientDetails.contact_number || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {patientDetails.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-sm" data-testid="text-address">{patientDetails.address}</p>
                  </div>
                </div>
              )}

              {patientDetails.emergency_contact && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Emergency Contact</p>
                    <p className="text-sm" data-testid="text-emergency-contact">{patientDetails.emergency_contact}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assigned Healthcare Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                  <Stethoscope className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assigned Doctor</p>
                    <p className="font-semibold" data-testid="text-doctor">
                      {patientDetails.doctor ? patientDetails.doctor.staff_name : 'Not Assigned'}
                    </p>
                    {patientDetails.doctor?.contact_number && (
                      <p className="text-sm text-muted-foreground">{patientDetails.doctor.contact_number}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                  <UserRound className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assigned Nurse</p>
                    <p className="font-semibold" data-testid="text-nurse">
                      {patientDetails.nurse ? patientDetails.nurse.staff_name : 'Not Assigned'}
                    </p>
                    {patientDetails.nurse?.contact_number && (
                      <p className="text-sm text-muted-foreground">{patientDetails.nurse.contact_number}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="medications">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="medications" data-testid="tab-medications">
                <Pill className="h-4 w-4 mr-2" />
                Medications
              </TabsTrigger>
              <TabsTrigger value="procedures" data-testid="tab-procedures">
                <Stethoscope className="h-4 w-4 mr-2" />
                Procedures
              </TabsTrigger>
              <TabsTrigger value="investigations" data-testid="tab-investigations">
                <FlaskConical className="h-4 w-4 mr-2" />
                Investigations
              </TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-nursing-notes">
                <FileText className="h-4 w-4 mr-2" />
                Nursing Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="medications" className="space-y-3">
              {patientDetails.medication_orders && patientDetails.medication_orders.length > 0 ? (
                patientDetails.medication_orders.map((order) => (
                  <Card key={order.order_id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">Medication Order</p>
                          <p className="text-sm text-muted-foreground">
                            Time: {order.scheduled_time} | Frequency: {order.frequency || 'N/A'}
                          </p>
                          {order.dosage_amount && (
                            <p className="text-sm">Dosage: {order.dosage_amount}</p>
                          )}
                        </div>
                        <Badge variant={order.is_completed ? 'default' : 'secondary'}>
                          {order.is_completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">No medication orders</p>
              )}
            </TabsContent>

            <TabsContent value="procedures" className="space-y-3">
              {patientDetails.procedure_orders && patientDetails.procedure_orders.length > 0 ? (
                patientDetails.procedure_orders.map((order) => (
                  <Card key={order.order_id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">Procedure Order</p>
                          <p className="text-sm text-muted-foreground">
                            Scheduled: {format(new Date(order.scheduled_time), 'PPpp')}
                          </p>
                        </div>
                        <Badge variant={order.is_completed ? 'default' : 'secondary'}>
                          {order.is_completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">No procedure orders</p>
              )}
            </TabsContent>

            <TabsContent value="investigations" className="space-y-3">
              {patientDetails.investigation_orders && patientDetails.investigation_orders.length > 0 ? (
                patientDetails.investigation_orders.map((order) => (
                  <Card key={order.order_id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">Investigation Order</p>
                          <p className="text-sm text-muted-foreground">
                            Scheduled: {format(new Date(order.scheduled_time), 'PPpp')}
                          </p>
                          {order.result_value && (
                            <p className="text-sm mt-1">Result: {order.result_value}</p>
                          )}
                        </div>
                        <Badge variant={order.is_completed ? 'default' : 'secondary'}>
                          {order.is_completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">No investigation orders</p>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-3">
              {patientDetails.nursing_notes && patientDetails.nursing_notes.length > 0 ? (
                patientDetails.nursing_notes.map((note) => (
                  <Card key={note.note_id}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{note.note_type}</Badge>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(note.recorded_at), 'PPp')}
                          </p>
                        </div>
                        <p className="text-sm">{note.note}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">No nursing notes</p>
              )}
            </TabsContent>
          </Tabs>

          {patientDetails.vital_signs && patientDetails.vital_signs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientDetails.vital_signs.slice(0, 3).map((vital) => (
                    <div key={vital.vital_id} className="p-3 rounded-md bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">
                        {format(new Date(vital.recorded_at), 'PPp')}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        {vital.temperature && <p>Temp: {vital.temperature}°C</p>}
                        {vital.blood_pressure_systolic && vital.blood_pressure_diastolic && (
                          <p>BP: {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}</p>
                        )}
                        {vital.heart_rate && <p>HR: {vital.heart_rate} bpm</p>}
                        {vital.respiratory_rate && <p>RR: {vital.respiratory_rate}</p>}
                        {vital.oxygen_saturation && <p>SpO2: {vital.oxygen_saturation}%</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} data-testid="button-close">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
