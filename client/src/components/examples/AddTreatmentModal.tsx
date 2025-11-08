import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AddTreatmentModal from '../AddTreatmentModal';

export default function AddTreatmentModalExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <AddTreatmentModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => console.log('Treatment data:', data)}
        defaultTime="06:00"
        defaultPatient="IPD001"
      />
    </div>
  );
}
