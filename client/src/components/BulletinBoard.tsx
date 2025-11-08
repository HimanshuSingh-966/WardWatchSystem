import { X, Clock, Pill, Stethoscope, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface BulletinItem {
  id: string;
  time: string;
  patientName: string;
  ipdNumber: string;
  treatmentType: 'medication' | 'procedure' | 'investigation';
  treatmentName: string;
  details?: string;
  priority: 'High' | 'Medium' | 'Low';
  isOverdue: boolean;
  bedNumber: string;
}

interface BulletinBoardProps {
  items: BulletinItem[];
  onClose?: () => void;
  onItemClick?: (id: string) => void;
}

const typeIcons = {
  medication: Pill,
  procedure: Stethoscope,
  investigation: FlaskConical,
};

const priorityColors = {
  High: 'bg-destructive text-destructive-foreground',
  Medium: 'bg-yellow-500 text-white',
  Low: 'bg-green-500 text-white',
};

export default function BulletinBoard({
  items,
  onClose,
  onItemClick,
}: BulletinBoardProps) {
  if (items.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b-4 border-primary shadow-xl">
      <div className="max-w-7xl mx-auto">
        <div className="p-4 flex items-center justify-between border-b border-border bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Treatment Board</h2>
            <Badge variant="secondary" className="text-base px-3">
              {items.length} Scheduled
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/10"
            data-testid="button-close-bulletin"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="h-[400px]">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-2">
              {items.map((item) => {
                const Icon = typeIcons[item.treatmentType];
                return (
                  <Card
                    key={item.id}
                    className={`p-4 hover-elevate cursor-pointer transition-all border-l-4 ${
                      item.priority === 'High' ? 'border-l-destructive' :
                      item.priority === 'Medium' ? 'border-l-yellow-500' :
                      'border-l-green-500'
                    } ${item.isOverdue ? 'bg-destructive/5' : ''}`}
                    onClick={() => onItemClick?.(item.id)}
                    data-testid={`bulletin-item-${item.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <div className={`px-3 py-1 rounded-md font-mono text-lg font-semibold ${priorityColors[item.priority]}`}>
                          {item.time}
                        </div>
                        {item.isOverdue && (
                          <Badge variant="destructive" className="animate-pulse">
                            OVERDUE
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">
                            {item.treatmentName}
                          </span>
                          {item.details && (
                            <span className="text-sm text-muted-foreground">
                              ({item.details})
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {item.patientName}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {item.ipdNumber}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            Bed {item.bedNumber}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-end">
                          <Badge 
                            className={`${
                              item.treatmentType === 'medication' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' :
                              item.treatmentType === 'procedure' ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20' :
                              'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                            }`}
                          >
                            {item.treatmentType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-border bg-card text-center">
          <p className="text-sm text-muted-foreground">
            <Clock className="inline h-3 w-3 mr-1" />
            Next update in 30 seconds • Click any item for details
          </p>
        </div>
      </div>
    </div>
  );
}
