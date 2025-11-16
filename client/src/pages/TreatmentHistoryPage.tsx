import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, User } from "lucide-react";
import { format } from "date-fns";
import type { Patient as BackendPatient, TreatmentHistory } from "@shared/schema";

interface PatientWithHistory extends BackendPatient {
  history: TreatmentHistory[];
}

export default function TreatmentHistoryPage() {
  const { admin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

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

  const { data: patients = [], isLoading: patientsLoading, isError: patientsError } = useQuery<BackendPatient[]>({
    queryKey: ['/api/patients?discharged=false'],
  });

  const { data: allHistory = [], isLoading: historyLoading, isError: historyError, refetchInterval } = useQuery<PatientWithHistory[]>({
    queryKey: ['/api/treatment-history/all'],
    refetchInterval: 30000,
  });

  const getTreatmentTypeBadge = (type: string) => {
    const variants = {
      medication: "default",
      procedure: "secondary",
      investigation: "outline"
    } as const;
    
    return (
      <Badge variant={variants[type as keyof typeof variants] || "default"} data-testid={`badge-type-${type}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getTimingIndicator = (scheduledTime: Date, completedAt: Date) => {
    const scheduled = new Date(scheduledTime);
    const completed = new Date(completedAt);
    const diffMinutes = Math.floor((completed.getTime() - scheduled.getTime()) / (1000 * 60));

    if (Math.abs(diffMinutes) <= 15) {
      return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
    } else if (diffMinutes > 15) {
      return <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
    } else {
      return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const formatTimeDifference = (scheduledTime: Date, completedAt: Date) => {
    const scheduled = new Date(scheduledTime);
    const completed = new Date(completedAt);
    const diffMinutes = Math.floor((completed.getTime() - scheduled.getTime()) / (1000 * 60));

    if (diffMinutes === 0) return "On time";
    if (diffMinutes > 0) return `${diffMinutes}m late`;
    return `${Math.abs(diffMinutes)}m early`;
  };

  const sortedPatients = [...allHistory].sort((a, b) => {
    const dateA = new Date(a.admission_date || 0);
    const dateB = new Date(b.admission_date || 0);
    return dateB.getTime() - dateA.getTime();
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
              <CardTitle>Treatment History - All Patients</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Patients organized by admission date · Showing completed treatments
              </p>
            </CardHeader>
            <CardContent>
              {patientsError || historyError ? (
                <div className="text-center py-12">
                  <p className="text-destructive" data-testid="text-error">
                    Failed to load treatment history. Please try refreshing the page.
                  </p>
                </div>
              ) : patientsLoading || historyLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  ))}
                </div>
              ) : sortedPatients.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground" data-testid="text-no-history">
                    No treatment history available yet
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedPatients.map((patient) => (
                    <div key={patient.patient_id} className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg" data-testid={`text-patient-name-${patient.patient_id}`}>
                                {patient.patient_name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span>IPD: {patient.ipd_number}</span>
                                <span>•</span>
                                <span>Bed: {patient.bed_number} ({patient.ward})</span>
                                <span>•</span>
                                <span>Admitted: {format(new Date(patient.admission_date), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="mt-1">
                            {patient.history.length} {patient.history.length === 1 ? 'treatment' : 'treatments'}
                          </Badge>
                        </div>
                        <div className="mt-3 text-sm">
                          <span className="text-muted-foreground">Diagnosis: </span>
                          <span className="font-medium">{patient.diagnosis}</span>
                        </div>
                      </div>

                      {patient.history.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Treatment</TableHead>
                              <TableHead>Scheduled</TableHead>
                              <TableHead>Completed</TableHead>
                              <TableHead>Timing</TableHead>
                              <TableHead>Completed By</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {patient.history.map((history) => (
                              <TableRow key={history.history_id} data-testid={`row-history-${history.history_id}`}>
                                <TableCell>
                                  {getTreatmentTypeBadge(history.treatment_type)}
                                </TableCell>
                                <TableCell className="font-medium" data-testid={`text-treatment-${history.history_id}`}>
                                  {history.treatment_name}
                                </TableCell>
                                <TableCell data-testid={`text-scheduled-${history.history_id}`}>
                                  {format(new Date(history.scheduled_time), 'MMM d, h:mm a')}
                                </TableCell>
                                <TableCell data-testid={`text-completed-${history.history_id}`}>
                                  {format(new Date(history.completed_at), 'MMM d, h:mm a')}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {getTimingIndicator(history.scheduled_time, history.completed_at)}
                                    <span className="text-sm" data-testid={`text-timing-${history.history_id}`}>
                                      {formatTimeDifference(history.scheduled_time, history.completed_at)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell data-testid={`text-completed-by-${history.history_id}`}>
                                  {history.completed_by}
                                </TableCell>
                                <TableCell className="max-w-md truncate" data-testid={`text-notes-${history.history_id}`}>
                                  {history.notes || <span className="text-muted-foreground italic">No notes</span>}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-center py-8 text-muted-foreground text-sm">
                          No completed treatments yet for this patient
                        </p>
                      )}

                      {sortedPatients[sortedPatients.length - 1].patient_id !== patient.patient_id && (
                        <Separator className="mt-8" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
