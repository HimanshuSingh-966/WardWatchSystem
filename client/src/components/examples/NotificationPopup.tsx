import { useState } from 'react';
import NotificationPopup, { Notification } from '../NotificationPopup';

const mockNotifications: Notification[] = [
  {
    id: '1',
    treatmentType: 'medication',
    message: 'Amoxicillin 500mg IV due',
    patientName: 'John Smith (IPD001)',
    scheduledTime: '06:00 AM',
    priority: 'High',
    isOverdue: true,
  },
  {
    id: '2',
    treatmentType: 'procedure',
    message: 'Blood pressure check',
    patientName: 'Mary Johnson (IPD002)',
    scheduledTime: '06:15 AM',
    priority: 'Medium',
    isOverdue: false,
  },
  {
    id: '3',
    treatmentType: 'investigation',
    message: 'Blood glucose test',
    patientName: 'Robert Davis (IPD003)',
    scheduledTime: '06:30 AM',
    priority: 'High',
    isOverdue: false,
  },
];

export default function NotificationPopupExample() {
  const [notifications, setNotifications] = useState(mockNotifications);

  return (
    <div className="min-h-screen bg-background p-8">
      <NotificationPopup
        notifications={notifications}
        onClose={() => console.log('Close notifications')}
        onAcknowledge={(id) => {
          console.log('Acknowledge notification:', id);
          setNotifications(notifications.filter(n => n.id !== id));
        }}
      />
    </div>
  );
}
