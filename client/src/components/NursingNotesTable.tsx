import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

export interface NursingNote {
  id: string;
  patientName: string;
  ipdNumber: string;
  noteType: string;
  note: string;
  recordedBy: string;
  recordedAt: Date;
}

interface NursingNotesTableProps {
  notes: NursingNote[];
  onEdit?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
}

const noteTypeColors: Record<string, string> = {
  Observation: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  Assessment: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  Intervention: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  Progress: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  Handover: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
};

export default function NursingNotesTable({
  notes,
  onEdit,
  onDelete,
}: NursingNotesTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-card">
          <TableRow>
            <TableHead className="font-semibold">Date & Time</TableHead>
            <TableHead className="font-semibold">Patient</TableHead>
            <TableHead className="font-semibold">IPD No.</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Note</TableHead>
            <TableHead className="font-semibold">Recorded By</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map((note) => (
            <TableRow 
              key={note.id}
              className="hover-elevate"
              data-testid={`row-note-${note.id}`}
            >
              <TableCell className="font-mono text-sm">
                {format(note.recordedAt, 'MMM dd, yyyy HH:mm')}
              </TableCell>
              <TableCell className="font-medium">{note.patientName}</TableCell>
              <TableCell className="font-mono text-sm">{note.ipdNumber}</TableCell>
              <TableCell>
                <Badge className={noteTypeColors[note.noteType] || 'bg-muted'}>
                  {note.noteType}
                </Badge>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {note.note}
                </p>
              </TableCell>
              <TableCell className="text-sm">{note.recordedBy}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit?.(note.id)}
                    data-testid={`button-edit-${note.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(note.id)}
                    data-testid={`button-delete-${note.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
