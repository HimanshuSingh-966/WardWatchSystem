import PatientTable, { Patient } from '../PatientTable';

const mockPatients: Patient[] = [
  {
    id: '1',
    ipdNumber: 'IPD001',
    name: 'John Smith',
    age: 65,
    gender: 'M',
    bed: 'A-101',
    ward: 'ICU',
    diagnosis: 'Pneumonia',
    admissionDate: new Date('2024-01-15'),
    isDischarged: false,
  },
  {
    id: '2',
    ipdNumber: 'IPD002',
    name: 'Mary Johnson',
    age: 45,
    gender: 'F',
    bed: 'B-205',
    ward: 'General',
    diagnosis: 'Diabetes Type 2',
    admissionDate: new Date('2024-01-18'),
    isDischarged: false,
  },
  {
    id: '3',
    ipdNumber: 'IPD003',
    name: 'Robert Davis',
    age: 72,
    gender: 'M',
    bed: 'A-103',
    ward: 'ICU',
    diagnosis: 'Heart Failure',
    admissionDate: new Date('2024-01-10'),
    isDischarged: true,
    dischargeDate: new Date('2024-01-20'),
  },
];

export default function PatientTableExample() {
  return (
    <div className="p-8">
      <PatientTable
        patients={mockPatients}
        onViewDetails={(id) => console.log('View patient:', id)}
        onEdit={(id) => console.log('Edit patient:', id)}
        onDischarge={(id) => console.log('Discharge patient:', id)}
      />
    </div>
  );
}
