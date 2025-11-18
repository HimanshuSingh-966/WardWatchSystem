import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Medication, Procedure, Investigation, Route } from "@shared/schema";

interface TreatmentOrder {
  order_id: string;
  type: 'medication' | 'procedure' | 'investigation';
  medication_id?: string;
  procedure_id?: string;
  investigation_id?: string;
  route_id?: string | null;
  scheduled_time?: string;
  frequency?: string | null;
  start_date?: string;
  end_date?: string | null;
  dosage_amount?: string | null;
  priority: 'High' | 'Medium' | 'Low';
  notes?: string | null;
  result_value?: string | null;
}

interface EditTreatmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (orderId: string, data: any) => Promise<void>;
  order: TreatmentOrder | null;
}

export default function EditTreatmentModal({
  open,
  onClose,
  onSubmit,
  order,
}: EditTreatmentModalProps) {
  const [selectedMedication, setSelectedMedication] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedInvestigation, setSelectedInvestigation] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [time, setTime] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [resultValue, setResultValue] = useState('');
  const [originalScheduledTime, setOriginalScheduledTime] = useState<string | null>(null);

  const { data: medications = [] } = useQuery<Medication[]>({
    queryKey: ['/api/medications'],
    enabled: open && order?.type === 'medication',
  });

  const { data: procedures = [] } = useQuery<Procedure[]>({
    queryKey: ['/api/procedures'],
    enabled: open && order?.type === 'procedure',
  });

  const { data: investigations = [] } = useQuery<Investigation[]>({
    queryKey: ['/api/investigations'],
    enabled: open && order?.type === 'investigation',
  });

  const { data: routes = [] } = useQuery<Route[]>({
    queryKey: ['/api/routes'],
    enabled: open && order?.type === 'medication',
  });

  useEffect(() => {
    if (order) {
      setPriority(order.priority);
      setNotes(order.notes || '');
      
      if (order.type === 'medication') {
        setSelectedMedication(order.medication_id || '');
        setSelectedRoute(order.route_id || '');
        setTime(order.scheduled_time || '');
        setDosage(order.dosage_amount || '');
        setFrequency(order.frequency || '');
        setOriginalScheduledTime(order.scheduled_time || null);
      } else if (order.type === 'procedure') {
        setSelectedProcedure(order.procedure_id || '');
        setOriginalScheduledTime(order.scheduled_time || null);
        if (order.scheduled_time) {
          const timeMatch = order.scheduled_time.match(/T(\d{2}:\d{2})/);
          if (timeMatch) {
            setTime(timeMatch[1]);
          }
        }
      } else if (order.type === 'investigation') {
        setSelectedInvestigation(order.investigation_id || '');
        setOriginalScheduledTime(order.scheduled_time || null);
        setResultValue(order.result_value || '');
        if (order.scheduled_time) {
          const timeMatch = order.scheduled_time.match(/T(\d{2}:\d{2})/);
          if (timeMatch) {
            setTime(timeMatch[1]);
          }
        }
      }
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order) return;

    let data: any = {
      priority,
      notes: notes || undefined,
    };

    if (order.type === 'medication') {
      if (!selectedMedication) return;
      data = {
        ...data,
        medication_id: selectedMedication,
        route_id: selectedRoute || undefined,
        scheduled_time: time,
        frequency: frequency || undefined,
        dosage_amount: dosage || undefined,
      };
    } else if (order.type === 'procedure') {
      if (!selectedProcedure) return;
      let scheduledDateTime: string;
      if (originalScheduledTime) {
        const hasSeconds = /T\d{2}:\d{2}:\d{2}/.test(originalScheduledTime);
        const secondsMatch = originalScheduledTime.match(/T\d{2}:\d{2}(:\d{2}(?:\.\d+)?)/);
        const secondsPart = secondsMatch && secondsMatch[1] ? secondsMatch[1] : (hasSeconds ? ':00' : '');
        scheduledDateTime = originalScheduledTime.replace(/T\d{2}:\d{2}(:\d{2}(?:\.\d+)?)?/, `T${time}${secondsPart}`);
      } else {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        scheduledDateTime = `${year}-${month}-${day}T${time}:00`;
      }
      data = {
        ...data,
        procedure_id: selectedProcedure,
        scheduled_time: scheduledDateTime,
      };
    } else if (order.type === 'investigation') {
      if (!selectedInvestigation) return;
      let scheduledDateTime: string;
      if (originalScheduledTime) {
        const hasSeconds = /T\d{2}:\d{2}:\d{2}/.test(originalScheduledTime);
        const secondsMatch = originalScheduledTime.match(/T\d{2}:\d{2}(:\d{2}(?:\.\d+)?)/);
        const secondsPart = secondsMatch && secondsMatch[1] ? secondsMatch[1] : (hasSeconds ? ':00' : '');
        scheduledDateTime = originalScheduledTime.replace(/T\d{2}:\d{2}(:\d{2}(?:\.\d+)?)?/, `T${time}${secondsPart}`);
      } else {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        scheduledDateTime = `${year}-${month}-${day}T${time}:00`;
      }
      data = {
        ...data,
        investigation_id: selectedInvestigation,
        scheduled_time: scheduledDateTime,
        result_value: resultValue || undefined,
      };
    }

    try {
      await onSubmit?.(order.order_id, data);
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-edit-treatment">
        <DialogHeader>
          <DialogTitle>Edit {order.type.charAt(0).toUpperCase() + order.type.slice(1)} Order</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {order.type === 'medication' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication *</Label>
                    <Select value={selectedMedication} onValueChange={setSelectedMedication}>
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
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
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
                    <Label htmlFor="dosage">Dosage Amount</Label>
                    <Input
                      id="dosage"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="e.g., 500mg"
                      data-testid="input-dosage"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                      id="frequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      placeholder="e.g., Twice daily"
                      data-testid="input-frequency"
                    />
                  </div>
                </div>
              </>
            )}

            {order.type === 'procedure' && (
              <div className="space-y-2">
                <Label htmlFor="procedure">Procedure *</Label>
                <Select value={selectedProcedure} onValueChange={setSelectedProcedure}>
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

            {order.type === 'investigation' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="investigation">Investigation *</Label>
                  <Select value={selectedInvestigation} onValueChange={setSelectedInvestigation}>
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

                <div className="space-y-2">
                  <Label htmlFor="result">Result Value</Label>
                  <Input
                    id="result"
                    value={resultValue}
                    onChange={(e) => setResultValue(e.target.value)}
                    placeholder="Enter result value"
                    data-testid="input-result"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Scheduled Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  data-testid="input-time"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(val) => setPriority(val as 'High' | 'Medium' | 'Low')}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
                data-testid="textarea-notes"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit">
              Update Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
