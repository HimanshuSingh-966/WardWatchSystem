import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import RecordVitalSignsModal from "@/components/RecordVitalSignsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus } from "lucide-react";
import { format } from "date-fns";
import type { Patient as BackendPatient, VitalSign } from "@shared/schema";

export default function VitalSignsPage() {
  const { admin, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showRecordModal, setShowRecordModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !admin) {
      const timer = setTimeout(() => {
        if (!admin) {
          setLocation('/login');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [admin, isLoading, setLocation]);

  const { data: backendPatients = [] } = useQuery<BackendPatient[]>({
    queryKey: ['/api/patients'],
    queryFn: async () => {
      const res = await fetch('/api/patients?discharged=false', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch patients');
      return res.json();
    }
  });

  const patients = backendPatients.map(p => ({
    id: p.patient_id,
    ipdNumber: p.ipd_number,
    name: p.patient_name,
  }));

  const { data: allVitals = [], isLoading: vitalsLoading } = useQuery<VitalSign[]>({
    queryKey: ['/api/vital-signs'],
    queryFn: async () => {
      const res = await fetch('/api/vital-signs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch vital signs');
      return res.json();
    }
  });

  const patientMap = new Map(backendPatients.map(p => [p.patient_id, p]));
  const vitalSigns = allVitals.map(vital => {
    const patient = patientMap.get(vital.patient_id);
    return {
      ...vital,
      patientName: patient?.patient_name || 'Unknown',
      ipdNumber: patient?.ipd_number || 'Unknown',
    };
  });

  const recordVitalsMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/vital-signs', 'POST', {
      patient_id: data.patient,
      recorded_by: admin?.admin_id,
      temperature: data.temperature,
      blood_pressure_systolic: data.bloodPressureSystolic,
      blood_pressure_diastolic: data.bloodPressureDiastolic,
      heart_rate: data.heartRate,
      respiratory_rate: data.respiratoryRate,
      oxygen_saturation: data.oxygenSaturation,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vital-signs'] });
      toast({ title: "Success", description: "Vital signs recorded successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader notificationCount={0} onNotificationClick={() => {}} />
      
      <main className="pt-24 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vital Signs Management</CardTitle>
                  <CardDescription>Monitor and record patient vital signs</CardDescription>
                </div>
                <Button onClick={() => setShowRecordModal(true)} data-testid="button-add-vital">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Vitals
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>IPD No.</TableHead>
                    <TableHead>Temperature (°F)</TableHead>
                    <TableHead>Blood Pressure</TableHead>
                    <TableHead>Heart Rate</TableHead>
                    <TableHead>SpO2 (%)</TableHead>
                    <TableHead>Recorded At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vitalsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        Loading vital signs...
                      </TableCell>
                    </TableRow>
                  ) : vitalSigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        No vital signs recorded yet. Click "Record Vitals" to add patient vital signs.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vitalSigns.map((vital) => (
                      <TableRow key={vital.vital_id} data-testid={`row-vital-${vital.vital_id}`}>
                        <TableCell className="font-medium">{vital.patientName}</TableCell>
                        <TableCell className="font-mono text-sm">{vital.ipdNumber}</TableCell>
                        <TableCell>
                          {vital.temperature ? `${vital.temperature}°F` : '-'}
                        </TableCell>
                        <TableCell>
                          {vital.blood_pressure_systolic && vital.blood_pressure_diastolic
                            ? `${vital.blood_pressure_systolic}/${vital.blood_pressure_diastolic}`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {vital.heart_rate ? `${vital.heart_rate} bpm` : '-'}
                        </TableCell>
                        <TableCell>
                          {vital.oxygen_saturation ? `${vital.oxygen_saturation}%` : '-'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {format(new Date(vital.recorded_at), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-muted-foreground text-sm">-</span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <RecordVitalSignsModal
        open={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        onSubmit={(data) => recordVitalsMutation.mutate(data)}
        patients={patients}
        isLoadingData={false}
      />
    </div>
  );
}
