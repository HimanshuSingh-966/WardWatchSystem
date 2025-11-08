import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, UserX, Eye } from "lucide-react";
import { format } from "date-fns";

export interface Patient {
  id: string;
  ipdNumber: string;
  name: string;
  age: number;
  gender: string;
  bed: string;
  ward: string;
  diagnosis: string;
  admissionDate: Date;
  isDischarged: boolean;
  dischargeDate?: Date;
}

interface PatientTableProps {
  patients: Patient[];
  onViewDetails?: (patientId: string) => void;
  onEdit?: (patientId: string) => void;
  onDischarge?: (patientId: string) => void;
}

export default function PatientTable({
  patients,
  onViewDetails,
  onEdit,
  onDischarge,
}: PatientTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-card">
          <TableRow>
            <TableHead className="font-semibold">IPD No.</TableHead>
            <TableHead className="font-semibold">Patient Name</TableHead>
            <TableHead className="font-semibold">Age/Gender</TableHead>
            <TableHead className="font-semibold">Bed</TableHead>
            <TableHead className="font-semibold">Ward</TableHead>
            <TableHead className="font-semibold">Diagnosis</TableHead>
            <TableHead className="font-semibold">Admission Date</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow 
              key={patient.id}
              className={patient.isDischarged ? 'opacity-60' : 'hover-elevate cursor-pointer'}
              onClick={() => onViewDetails?.(patient.id)}
              data-testid={`row-patient-${patient.id}`}
            >
              <TableCell className="font-mono text-sm font-medium">
                {patient.ipdNumber}
              </TableCell>
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {patient.age}/{patient.gender}
              </TableCell>
              <TableCell className="text-sm">{patient.bed}</TableCell>
              <TableCell className="text-sm">{patient.ward}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {patient.diagnosis}
              </TableCell>
              <TableCell className="text-sm font-mono">
                {format(patient.admissionDate, 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {patient.isDischarged ? (
                  <Badge variant="secondary">
                    Discharged{patient.dischargeDate && ` (${format(patient.dischargeDate, 'MMM dd')})`}
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                    Active
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails?.(patient.id)}
                    data-testid={`button-view-${patient.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {!patient.isDischarged && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(patient.id)}
                        data-testid={`button-edit-${patient.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDischarge?.(patient.id)}
                        data-testid={`button-discharge-${patient.id}`}
                      >
                        <UserX className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
