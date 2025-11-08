import { X, Clock, AlertTriangle, Pill, Stethoscope, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Notification {
  id: string;
  treatmentType: 'medication' | 'procedure' | 'investigation';
  message: string;
  patientName: string;
  scheduledTime: string;
  priority: 'High' | 'Medium' | 'Low';
  isOverdue: boolean;
}

interface NotificationPopupProps {
  notifications: Notification[];
  onClose?: () => void;
  onAcknowledge?: (id: string) => void;
}

const typeIcons = {
  medication: Pill,
  procedure: Stethoscope,
  investigation: FlaskConical,
};

const priorityColors = {
  High: 'bg-destructive/10 border-l-destructive text-destructive',
  Medium: 'bg-yellow-500/10 border-l-yellow-500 text-yellow-700 dark:text-yellow-400',
  Low: 'bg-green-500/10 border-l-green-500 text-green-700 dark:text-green-400',
};

export default function NotificationPopup({
  notifications,
  onClose,
  onAcknowledge,
}: NotificationPopupProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-8 w-96 z-50">
      <Card className="shadow-xl border-2">
        <div className="p-4 border-b border-border flex items-center justify-between bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <h3 className="font-semibold">Upcoming Treatments</h3>
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/10"
            data-testid="button-close-notifications"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="max-h-[500px]">
          <div className="p-2 space-y-2">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.treatmentType];
              return (
                <Card
                  key={notification.id}
                  className={`p-4 border-l-4 ${priorityColors[notification.priority]} hover-elevate cursor-pointer transition-all`}
                  onClick={() => onAcknowledge?.(notification.id)}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{notification.patientName}</span>
                        {notification.isOverdue && (
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                      <p className="text-sm text-foreground/90 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="font-mono">{notification.scheduledTime}</span>
                        {notification.isOverdue && (
                          <Badge variant="destructive" className="text-xs">Overdue</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">Click any notification to acknowledge</p>
        </div>
      </Card>
    </div>
  );
}
