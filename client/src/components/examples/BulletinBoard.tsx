import { useState } from 'react';
import BulletinBoard, { BulletinItem } from '../BulletinBoard';

const mockItems: BulletinItem[] = [
  {
    id: '1',
    time: '06:00',
    patientName: 'John Smith',
    ipdNumber: 'IPD001',
    treatmentType: 'medication',
    treatmentName: 'Amoxicillin',
    details: '500mg IV',
    priority: 'High',
    isOverdue: true,
    bedNumber: 'A-101',
  },
  {
    id: '2',
    time: '06:00',
    patientName: 'Mary Johnson',
    ipdNumber: 'IPD002',
    treatmentType: 'procedure',
    treatmentName: 'Blood Pressure Check',
    priority: 'Medium',
    isOverdue: false,
    bedNumber: 'B-205',
  },
  {
    id: '3',
    time: '06:15',
    patientName: 'Robert Davis',
    ipdNumber: 'IPD003',
    treatmentType: 'investigation',
    treatmentName: 'Blood Glucose Test',
    priority: 'High',
    isOverdue: false,
    bedNumber: 'A-103',
  },
  {
    id: '4',
    time: '06:30',
    patientName: 'John Smith',
    ipdNumber: 'IPD001',
    treatmentType: 'medication',
    treatmentName: 'Paracetamol',
    details: '650mg PO',
    priority: 'Low',
    isOverdue: false,
    bedNumber: 'A-101',
  },
];

export default function BulletinBoardExample() {
  const [items, setItems] = useState(mockItems);

  return (
    <div className="min-h-screen bg-background">
      <BulletinBoard
        items={items}
        onClose={() => console.log('Close bulletin board')}
        onItemClick={(id) => {
          console.log('Item clicked:', id);
          setItems(items.filter(i => i.id !== id));
        }}
      />
      <div className="pt-[500px] p-8">
        <p className="text-muted-foreground">Content below the bulletin board</p>
      </div>
    </div>
  );
}
