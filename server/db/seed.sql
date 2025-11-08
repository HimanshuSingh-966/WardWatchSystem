-- Ward Watch - Sample Data Seed Script
-- This script populates the database with sample data for testing and development

-- Insert sample departments
INSERT INTO departments (department_name) VALUES
  ('Emergency'),
  ('ICU'),
  ('General Medicine'),
  ('Surgery'),
  ('Pediatrics')
ON CONFLICT DO NOTHING;

-- Insert sample routes of administration
INSERT INTO routes_of_administration (route_name) VALUES
  ('Oral (PO)'),
  ('Intravenous (IV)'),
  ('Intramuscular (IM)'),
  ('Subcutaneous (SC)'),
  ('Topical'),
  ('Inhalation')
ON CONFLICT DO NOTHING;

-- Insert sample medications
INSERT INTO medications (medication_name, dosage, form) VALUES
  ('Amoxicillin', '500mg', 'Capsule'),
  ('Paracetamol', '650mg', 'Tablet'),
  ('Insulin', '10 units', 'Injectable'),
  ('Aspirin', '75mg', 'Tablet'),
  ('Ibuprofen', '400mg', 'Tablet'),
  ('Metformin', '500mg', 'Tablet'),
  ('Omeprazole', '20mg', 'Capsule'),
  ('Salbutamol', '100mcg', 'Inhaler')
ON CONFLICT DO NOTHING;

-- Insert sample procedures
INSERT INTO procedures (procedure_name, description) VALUES
  ('Blood Pressure Check', 'Routine blood pressure measurement'),
  ('Wound Dressing', 'Change and clean wound dressing'),
  ('Catheter Insertion', 'Urinary catheter insertion'),
  ('IV Line Setup', 'Intravenous line placement'),
  ('ECG', 'Electrocardiogram'),
  ('Oxygen Therapy', 'Supplemental oxygen administration'),
  ('Vital Signs Monitoring', 'Complete vital signs assessment')
ON CONFLICT DO NOTHING;

-- Insert sample investigations
INSERT INTO investigations (investigation_name, description, normal_range) VALUES
  ('Blood Glucose', 'Fasting blood sugar test', '70-100 mg/dL'),
  ('Complete Blood Count', 'Full blood panel analysis', 'Varies by parameter'),
  ('Chest X-Ray', 'Thoracic radiograph', 'N/A'),
  ('Urinalysis', 'Urine analysis', 'Normal'),
  ('ECG', 'Heart electrical activity', 'Normal sinus rhythm'),
  ('Serum Creatinine', 'Kidney function test', '0.7-1.3 mg/dL'),
  ('Liver Function Test', 'Hepatic enzyme panel', 'Varies by parameter')
ON CONFLICT DO NOTHING;

-- Insert sample staff (reference data for nursing notes and vital signs)
DO $$
DECLARE
  dept_id UUID;
BEGIN
  SELECT department_id INTO dept_id FROM departments WHERE department_name = 'ICU' LIMIT 1;
  
  INSERT INTO staff (staff_name, role, department_id, contact_number, email) VALUES
    ('Dr. Sarah Williams', 'Doctor', dept_id, '+1234567890', 'dr.williams@hospital.com'),
    ('Dr. Michael Chen', 'Doctor', dept_id, '+1234567891', 'dr.chen@hospital.com'),
    ('Nurse Emily Brown', 'Nurse', dept_id, '+1234567892', 'nurse.brown@hospital.com'),
    ('Nurse James Wilson', 'Nurse', dept_id, '+1234567893', 'nurse.wilson@hospital.com')
  ON CONFLICT DO NOTHING;
END $$;

-- Note: Admin user creation should be done through the API registration endpoint
-- for security reasons. The password will be properly hashed.
-- 
-- Example: POST /api/auth/register with body:
-- {
--   "username": "admin",
--   "password": "admin123",
--   "full_name": "System Administrator",
--   "email": "admin@hospital.com"
-- }
