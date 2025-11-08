import TimelineTable, { TimelineRow } from '../TimelineTable';

const mockData: TimelineRow[] = [
  {
    time: '06:00 AM',
    patient: {
      ipdNumber: 'IPD001',
      name: 'John Smith',
      age: 65,
      gender: 'M',
      bed: 'A-101',
      ward: 'ICU',
      diagnosis: 'Pneumonia',
    },
    treatments: [
      { id: '1', type: 'medication', name: 'Amoxicillin', details: '500mg IV', isCompleted: true, priority: 'High' },
      { id: '2', type: 'medication', name: 'Paracetamol', details: '650mg PO', isCompleted: false, priority: 'Medium' },
    ],
  },
  {
    time: '06:00 AM',
    patient: {
      ipdNumber: 'IPD002',
      name: 'Mary Johnson',
      age: 45,
      gender: 'F',
      bed: 'B-205',
      ward: 'General',
      diagnosis: 'Diabetes',
    },
    treatments: [
      { id: '3', type: 'procedure', name: 'Blood Sugar Check', isCompleted: false, priority: 'High' },
    ],
  },
  {
    time: '08:00 AM',
    patient: {
      ipdNumber: 'IPD001',
      name: 'John Smith',
      age: 65,
      gender: 'M',
      bed: 'A-101',
      ward: 'ICU',
      diagnosis: 'Pneumonia',
    },
    treatments: [
      { id: '4', type: 'investigation', name: 'Chest X-Ray', isCompleted: false, priority: 'Medium' },
    ],
  },
];

export default function TimelineTableExample() {
  return (
    <div className="p-8">
      <TimelineTable 
        data={mockData}
        onAddTreatment={(time, patientId) => console.log('Add treatment:', time, patientId)}
        onEditTreatment={(id) => console.log('Edit treatment:', id)}
        onDeleteTreatment={(id) => console.log('Delete treatment:', id)}
        onToggleComplete={(id) => console.log('Toggle complete:', id)}
      />
    </div>
  );
}
