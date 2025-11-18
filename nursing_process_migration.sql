-- Nursing Process Table Migration
-- Add this SQL to your database to create the nursing_process table

-- Create nursing_process table
CREATE TABLE IF NOT EXISTS nursing_process (
  process_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  sign_symptoms TEXT,
  nurse_diagnosis TEXT,
  intervention TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(patient_id) -- Each patient can have only one nursing process record
);

-- Create index on patient_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_nursing_process_patient_id ON nursing_process(patient_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_nursing_process_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_nursing_process_updated_at
  BEFORE UPDATE ON nursing_process
  FOR EACH ROW
  EXECUTE FUNCTION update_nursing_process_updated_at();

-- Add comment to table
COMMENT ON TABLE nursing_process IS 'Stores nursing process documentation including signs & symptoms, diagnosis, and interventions for each patient';
COMMENT ON COLUMN nursing_process.process_id IS 'Unique identifier for the nursing process record';
COMMENT ON COLUMN nursing_process.patient_id IS 'Reference to the patient';
COMMENT ON COLUMN nursing_process.sign_symptoms IS 'Documented signs and symptoms observed';
COMMENT ON COLUMN nursing_process.nurse_diagnosis IS 'Nursing diagnosis based on assessment';
COMMENT ON COLUMN nursing_process.intervention IS 'Nursing interventions planned or performed';
