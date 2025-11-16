import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Pill, Stethoscope, FlaskConical } from "lucide-react";

export interface TreatmentItem {
  id: string;
  type: 'medication' | 'procedure' | 'investigation';
  name: string;
  details?: string;
  isCompleted: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface TimelineRow {
  time: string;
  patient: {
    id?: string;
    ipdNumber: string;
    name: string;
    age: number;
    gender: string;
    bed: string;
    ward: string;
    diagnosis: string;
    doctor?: string | null;
    nurse?: string | null;
  };
  treatments: TreatmentItem[];
}

interface TimelineTableProps {
  data: TimelineRow[];
  onAddTreatment?: (time: string, patientId: string) => void;
  onEditTreatment?: (treatmentId: string) => void;
  onDeleteTreatment?: ((treatmentId: string) => void) | ((treatmentId: string, treatmentType: 'medication' | 'procedure' | 'investigation') => void);
  onToggleComplete?: ((treatmentId: string) => void) | ((treatmentId: string, treatmentType: 'medication' | 'procedure' | 'investigation') => void);
}

const typeIcons = {
  medication: Pill,
  procedure: Stethoscope,
  investigation: FlaskConical,
};

const priorityColors = {
  High: 'border-l-destructive',
  Medium: 'border-l-yellow-500',
  Low: 'border-l-green-500',
};

const patientColors = [
  'bg-blue-200 dark:bg-blue-900/50',
  'bg-purple-200 dark:bg-purple-900/50',
  'bg-pink-200 dark:bg-pink-900/50',
  'bg-orange-200 dark:bg-orange-900/50',
  'bg-teal-200 dark:bg-teal-900/50',
  'bg-indigo-200 dark:bg-indigo-900/50',
  'bg-rose-200 dark:bg-rose-900/50',
  'bg-cyan-200 dark:bg-cyan-900/50',
];

export default function TimelineTable({
  data,
  onAddTreatment,
  onEditTreatment,
  onDeleteTreatment,
  onToggleComplete,
}: TimelineTableProps) {
  const uniquePatients = Array.from(new Set(data.map(row => row.patient.ipdNumber)));
  const patientColorMap = new Map(
    uniquePatients.map((ipdNo, index) => [ipdNo, patientColors[index % patientColors.length]])
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 bg-card">
          <TableRow>
            <TableHead className="w-24 font-semibold">Time</TableHead>
            <TableHead className="w-32">IPD No.</TableHead>
            <TableHead className="w-48">Patient Name</TableHead>
            <TableHead className="w-24">Age/Gender</TableHead>
            <TableHead className="w-32">Bed</TableHead>
            <TableHead className="w-32">Ward</TableHead>
            <TableHead className="w-40">Doctor</TableHead>
            <TableHead className="w-40">Nurse</TableHead>
            <TableHead className="w-48">Diagnosis</TableHead>
            <TableHead>Treatments</TableHead>
            <TableHead className="w-16">Done</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => {
            const allCompleted = row.treatments.length > 0 && row.treatments.every(t => t.isCompleted);
            const patientBgColor = patientColorMap.get(row.patient.ipdNumber) || patientColors[0];
            
            return (
            <TableRow 
              key={rowIndex}
              className={`${allCompleted ? 'bg-green-200 dark:bg-green-900/50' : patientBgColor} ${rowIndex > 0 && data[rowIndex - 1].time !== row.time ? 'border-t-2 border-t-border' : ''}`}
            >
              <TableCell className="font-semibold font-mono text-sm">{row.time}</TableCell>
              <TableCell className="font-mono text-sm">{row.patient.ipdNumber}</TableCell>
              <TableCell className="font-medium">{row.patient.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {row.patient.age}/{row.patient.gender}
              </TableCell>
              <TableCell className="text-sm">{row.patient.bed}</TableCell>
              <TableCell className="text-sm">{row.patient.ward}</TableCell>
              <TableCell className="text-sm font-medium">{row.patient.doctor || 'N/A'}</TableCell>
              <TableCell className="text-sm font-medium">{row.patient.nurse || 'N/A'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.patient.diagnosis}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {row.treatments.map((treatment) => {
                    const Icon = typeIcons[treatment.type];
                    return (
                      <Badge
                        key={treatment.id}
                        variant="outline"
                        className={`border-l-4 ${priorityColors[treatment.priority]} ${
                          treatment.isCompleted ? 'opacity-60 line-through' : ''
                        }`}
                        data-testid={`badge-treatment-${treatment.id}`}
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {treatment.name}
                        {treatment.details && (
                          <span className="text-xs ml-1 text-muted-foreground">
                            ({treatment.details})
                          </span>
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </TableCell>
              <TableCell>
                {row.treatments.map((treatment) => (
                  <div key={treatment.id} className="mb-1">
                    <Checkbox
                      checked={treatment.isCompleted}
                      onCheckedChange={() => onToggleComplete?.(treatment.id, treatment.type)}
                      data-testid={`checkbox-complete-${treatment.id}`}
                    />
                  </div>
                ))}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAddTreatment?.(row.time, row.patient.ipdNumber)}
                    data-testid={`button-add-${rowIndex}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => row.treatments[0] && onEditTreatment?.(row.treatments[0].id)}
                    data-testid={`button-edit-${rowIndex}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => row.treatments[0] && onDeleteTreatment?.(row.treatments[0].id, row.treatments[0].type)}
                    data-testid={`button-delete-${rowIndex}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
