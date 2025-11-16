-- Comprehensive Seeding Data for Ward Watch Database
-- Run this after running schema.sql

-- Insert Departments
INSERT INTO departments (department_name) VALUES
  ('Emergency'),
  ('ICU'),
  ('General Medicine'),
  ('Surgery'),
  ('Pediatrics'),
  ('Cardiology'),
  ('Orthopedics'),
  ('Neurology')
ON CONFLICT DO NOTHING;

-- Insert Routes of Administration
INSERT INTO routes_of_administration (route_name) VALUES
  ('Oral (PO)'),
  ('Intravenous (IV)'),
  ('Intramuscular (IM)'),
  ('Subcutaneous (SC)'),
  ('Topical'),
  ('Inhalation'),
  ('Rectal'),
  ('Sublingual')
ON CONFLICT DO NOTHING;

-- Insert Medications
INSERT INTO medications (medication_name, dosage, form) VALUES
  ('Paracetamol', '500mg', 'Tablet'),
  ('Ibuprofen', '400mg', 'Tablet'),
  ('Amoxicillin', '500mg', 'Capsule'),
  ('Metformin', '850mg', 'Tablet'),
  ('Aspirin', '75mg', 'Tablet'),
  ('Omeprazole', '20mg', 'Capsule'),
  ('Lisinopril', '10mg', 'Tablet'),
  ('Atorvastatin', '20mg', 'Tablet'),
  ('Insulin Glargine', '100 units/mL', 'Injectable'),
  ('Salbutamol', '100mcg', 'Inhaler'),
  ('Ciprofloxacin', '500mg', 'Tablet'),
  ('Furosemide', '40mg', 'Tablet'),
  ('Warfarin', '5mg', 'Tablet'),
  ('Morphine', '10mg/mL', 'Injectable'),
  ('Ceftriaxone', '1g', 'Injectable')
ON CONFLICT DO NOTHING;

-- Insert Procedures
INSERT INTO procedures (procedure_name, description) VALUES
  ('Blood Pressure Check', 'Routine blood pressure measurement'),
  ('Wound Dressing', 'Change and clean wound dressing'),
  ('Catheter Insertion', 'Urinary catheter insertion'),
  ('IV Line Setup', 'Intravenous line placement'),
  ('ECG', 'Electrocardiogram'),
  ('Nebulization', 'Respiratory therapy with nebulizer'),
  ('Oxygen Therapy', 'Supplemental oxygen administration'),
  ('Nasogastric Tube Insertion', 'NG tube placement'),
  ('Suture Removal', 'Removal of surgical sutures'),
  ('Drain Management', 'Check and maintain surgical drains'),
  ('Chest Physiotherapy', 'Respiratory therapy for chest congestion'),
  ('Blood Transfusion', 'Administration of blood products')
ON CONFLICT DO NOTHING;

-- Insert Investigations
INSERT INTO investigations (investigation_name, description, normal_range) VALUES
  ('Complete Blood Count', 'Full blood panel analysis', 'Hb: 12-16 g/dL, WBC: 4-11 k/µL'),
  ('Blood Glucose', 'Fasting blood sugar test', '70-100 mg/dL'),
  ('Serum Creatinine', 'Kidney function test', '0.7-1.3 mg/dL'),
  ('Liver Function Test', 'Hepatic panel', 'ALT: 7-56 U/L, AST: 10-40 U/L'),
  ('Chest X-Ray', 'Thoracic radiograph', 'No abnormalities'),
  ('Urinalysis', 'Urine analysis', 'Normal'),
  ('ECG', 'Heart electrical activity', 'Normal sinus rhythm'),
  ('Electrolytes', 'Serum electrolyte panel', 'Na: 135-145 mEq/L, K: 3.5-5.0 mEq/L'),
  ('Coagulation Profile', 'PT, INR, APTT', 'PT: 11-13s, INR: 0.8-1.2'),
  ('Blood Culture', 'Bacterial culture from blood', 'No growth'),
  ('CT Scan', 'Computed tomography scan', 'As per findings'),
  ('Ultrasound Abdomen', 'Abdominal ultrasound', 'Normal study')
ON CONFLICT DO NOTHING;

-- Insert Staff
INSERT INTO staff (staff_name, role, contact_number, email) VALUES
  ('Dr. Sarah Williams', 'Doctor', '+1-555-0101', 'dr.williams@hospital.com'),
  ('Dr. Michael Chen', 'Doctor', '+1-555-0102', 'dr.chen@hospital.com'),
  ('Dr. Priya Sharma', 'Doctor', '+1-555-0103', 'dr.sharma@hospital.com'),
  ('Dr. James Anderson', 'Doctor', '+1-555-0104', 'dr.anderson@hospital.com'),
  ('Nurse Emily Brown', 'Nurse', '+1-555-0201', 'nurse.brown@hospital.com'),
  ('Nurse Robert Wilson', 'Nurse', '+1-555-0202', 'nurse.wilson@hospital.com'),
  ('Nurse Maria Garcia', 'Nurse', '+1-555-0203', 'nurse.garcia@hospital.com'),
  ('Nurse David Taylor', 'Nurse', '+1-555-0204', 'nurse.taylor@hospital.com'),
  ('Nurse Lisa Martinez', 'Nurse', '+1-555-0205', 'nurse.martinez@hospital.com'),
  ('Nurse John Thompson', 'Nurse', '+1-555-0206', 'nurse.thompson@hospital.com')
ON CONFLICT DO NOTHING;

-- Insert Admin User (password: admin123 - bcrypt hash)
INSERT INTO admins (username, password_hash, full_name, email, contact_number) VALUES
  ('admin', '$2b$10$K7L1vwyhWdYKxQNnQZ5rDO5aYJmH4QIf9JqBmYRZ7ZeYQZ7ZeYQZ7Z', 'System Administrator', 'admin@hospital.com', '+1-555-0001')
ON CONFLICT (username) DO NOTHING;

-- Insert Sample Patients (3 Active, 2 Discharged)
INSERT INTO patients (ipd_number, patient_name, age, gender, contact_number, address, bed_number, ward, diagnosis, admission_date, is_discharged, discharge_date, emergency_contact) VALUES
  ('IPD001', 'John Smith', 45, 'M', '+1-555-1001', '123 Main St, Springfield', 'A101', 'General Medicine', 'Type 2 Diabetes with Hypertension', '2024-11-10', false, NULL, '+1-555-1002'),
  ('IPD002', 'Mary Johnson', 62, 'F', '+1-555-2001', '456 Oak Ave, Riverside', 'B203', 'Cardiology', 'Acute Myocardial Infarction', '2024-11-12', false, NULL, '+1-555-2002'),
  ('IPD003', 'Robert Davis', 35, 'M', '+1-555-3001', '789 Pine Rd, Lakeside', 'C105', 'Surgery', 'Post-Appendectomy', '2024-11-14', false, NULL, '+1-555-3002'),
  ('IPD004', 'Patricia Miller', 28, 'F', '+1-555-4001', '321 Elm St, Hilltop', 'A205', 'ICU', 'Severe Pneumonia', '2024-10-20', true, '2024-11-05', '+1-555-4002'),
  ('IPD005', 'James Wilson', 55, 'M', '+1-555-5001', '654 Maple Dr, Greenwood', 'B108', 'Orthopedics', 'Fractured Femur', '2024-10-15', true, '2024-11-01', '+1-555-5002')
ON CONFLICT (ipd_number) DO NOTHING;

-- Get UUIDs for reference (this is a variable declaration in PostgreSQL)
DO $$
DECLARE
  v_admin_id UUID;
  v_patient1_id UUID;
  v_patient2_id UUID;
  v_patient3_id UUID;
  v_patient4_id UUID;
  v_patient5_id UUID;
  v_doctor1_id UUID;
  v_doctor2_id UUID;
  v_nurse1_id UUID;
  v_nurse2_id UUID;
  v_med_paracetamol UUID;
  v_med_insulin UUID;
  v_med_aspirin UUID;
  v_proc_bp UUID;
  v_proc_ecg UUID;
  v_inv_cbc UUID;
  v_inv_glucose UUID;
  v_route_oral UUID;
  v_route_iv UUID;
  v_route_sc UUID;
BEGIN
  -- Get IDs from inserted data
  SELECT admin_id INTO v_admin_id FROM admins WHERE username = 'admin' LIMIT 1;
  SELECT patient_id INTO v_patient1_id FROM patients WHERE ipd_number = 'IPD001' LIMIT 1;
  SELECT patient_id INTO v_patient2_id FROM patients WHERE ipd_number = 'IPD002' LIMIT 1;
  SELECT patient_id INTO v_patient3_id FROM patients WHERE ipd_number = 'IPD003' LIMIT 1;
  SELECT patient_id INTO v_patient4_id FROM patients WHERE ipd_number = 'IPD004' LIMIT 1;
  SELECT patient_id INTO v_patient5_id FROM patients WHERE ipd_number = 'IPD005' LIMIT 1;
  SELECT staff_id INTO v_doctor1_id FROM staff WHERE staff_name = 'Dr. Sarah Williams' LIMIT 1;
  SELECT staff_id INTO v_doctor2_id FROM staff WHERE staff_name = 'Dr. Michael Chen' LIMIT 1;
  SELECT staff_id INTO v_nurse1_id FROM staff WHERE staff_name = 'Nurse Emily Brown' LIMIT 1;
  SELECT staff_id INTO v_nurse2_id FROM staff WHERE staff_name = 'Nurse Robert Wilson' LIMIT 1;
  SELECT medication_id INTO v_med_paracetamol FROM medications WHERE medication_name = 'Paracetamol' LIMIT 1;
  SELECT medication_id INTO v_med_insulin FROM medications WHERE medication_name = 'Insulin Glargine' LIMIT 1;
  SELECT medication_id INTO v_med_aspirin FROM medications WHERE medication_name = 'Aspirin' LIMIT 1;
  SELECT procedure_id INTO v_proc_bp FROM procedures WHERE procedure_name = 'Blood Pressure Check' LIMIT 1;
  SELECT procedure_id INTO v_proc_ecg FROM procedures WHERE procedure_name = 'ECG' LIMIT 1;
  SELECT investigation_id INTO v_inv_cbc FROM investigations WHERE investigation_name = 'Complete Blood Count' LIMIT 1;
  SELECT investigation_id INTO v_inv_glucose FROM investigations WHERE investigation_name = 'Blood Glucose' LIMIT 1;
  SELECT route_id INTO v_route_oral FROM routes_of_administration WHERE route_name = 'Oral (PO)' LIMIT 1;
  SELECT route_id INTO v_route_iv FROM routes_of_administration WHERE route_name = 'Intravenous (IV)' LIMIT 1;
  SELECT route_id INTO v_route_sc FROM routes_of_administration WHERE route_name = 'Subcutaneous (SC)' LIMIT 1;

  -- Assign Staff to Patients
  INSERT INTO patient_staff_assignments (patient_id, staff_id, assignment_role) VALUES
    (v_patient1_id, v_doctor1_id, 'Doctor'),
    (v_patient1_id, v_nurse1_id, 'Nurse'),
    (v_patient2_id, v_doctor2_id, 'Doctor'),
    (v_patient2_id, v_nurse2_id, 'Nurse'),
    (v_patient3_id, v_doctor1_id, 'Doctor'),
    (v_patient3_id, v_nurse1_id, 'Nurse')
  ON CONFLICT (patient_id, assignment_role) DO NOTHING;

  -- Active Medication Orders for Patient 1 (John Smith - Diabetes patient)
  INSERT INTO medication_orders (patient_id, medication_id, route_id, scheduled_time, frequency, start_date, end_date, dosage_amount, priority, is_active, created_by) VALUES
    (v_patient1_id, v_med_insulin, v_route_sc, '08:00', 'Once Daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', '20 units', 'High', true, v_admin_id),
    (v_patient1_id, v_med_paracetamol, v_route_oral, '08:00', 'Three times daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '5 days', '500mg', 'Medium', true, v_admin_id),
    (v_patient1_id, v_med_paracetamol, v_route_oral, '14:00', 'Three times daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '5 days', '500mg', 'Medium', true, v_admin_id)
  ON CONFLICT DO NOTHING;

  -- Active Medication Orders for Patient 2 (Mary Johnson - MI patient)
  INSERT INTO medication_orders (patient_id, medication_id, route_id, scheduled_time, frequency, start_date, end_date, dosage_amount, priority, is_active, created_by) VALUES
    (v_patient2_id, v_med_aspirin, v_route_oral, '09:00', 'Once Daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '75mg', 'High', true, v_admin_id)
  ON CONFLICT DO NOTHING;

  -- Active Procedure Orders
  INSERT INTO procedure_orders (patient_id, procedure_id, scheduled_time, priority, is_active, created_by) VALUES
    (v_patient1_id, v_proc_bp, CURRENT_TIMESTAMP + INTERVAL '2 hours', 'High', true, v_admin_id),
    (v_patient2_id, v_proc_ecg, CURRENT_TIMESTAMP + INTERVAL '1 hour', 'High', true, v_admin_id)
  ON CONFLICT DO NOTHING;

  -- Active Investigation Orders
  INSERT INTO investigation_orders (patient_id, investigation_id, scheduled_time, priority, is_active, created_by) VALUES
    (v_patient1_id, v_inv_glucose, CURRENT_TIMESTAMP + INTERVAL '1 day', 'High', true, v_admin_id),
    (v_patient2_id, v_inv_cbc, CURRENT_TIMESTAMP + INTERVAL '3 hours', 'High', true, v_admin_id)
  ON CONFLICT DO NOTHING;

  -- Add some COMPLETED orders with history for discharged patients
  -- These will automatically trigger the history tracking
  INSERT INTO medication_orders (patient_id, medication_id, route_id, scheduled_time, frequency, start_date, end_date, dosage_amount, priority, is_completed, completed_at, completed_by, is_active, created_by, notes) VALUES
    (v_patient4_id, v_med_paracetamol, v_route_oral, '08:00', 'Three times daily', '2024-10-21', '2024-10-25', '500mg', 'Medium', true, '2024-10-21 08:15:00', v_admin_id, false, v_admin_id, 'Administered as prescribed'),
    (v_patient4_id, v_med_paracetamol, v_route_oral, '14:00', 'Three times daily', '2024-10-21', '2024-10-25', '500mg', 'Medium', true, '2024-10-21 14:10:00', v_admin_id, false, v_admin_id, 'Administered as prescribed'),
    (v_patient5_id, v_med_aspirin, v_route_oral, '09:00', 'Once Daily', '2024-10-16', '2024-10-31', '75mg', 'Medium', true, '2024-10-16 09:05:00', v_admin_id, false, v_admin_id, 'Patient tolerated well')
  ON CONFLICT DO NOTHING;

  INSERT INTO procedure_orders (patient_id, procedure_id, scheduled_time, priority, is_completed, completed_at, completed_by, is_active, created_by, notes) VALUES
    (v_patient4_id, v_proc_bp, '2024-10-22 10:00:00', 'High', true, '2024-10-22 10:05:00', v_admin_id, false, v_admin_id, 'BP: 120/80 mmHg'),
    (v_patient4_id, v_proc_ecg, '2024-10-23 11:00:00', 'High', true, '2024-10-23 11:15:00', v_admin_id, false, v_admin_id, 'Normal sinus rhythm'),
    (v_patient5_id, v_proc_bp, '2024-10-17 09:00:00', 'Medium', true, '2024-10-17 09:10:00', v_admin_id, false, v_admin_id, 'BP: 130/85 mmHg')
  ON CONFLICT DO NOTHING;

  INSERT INTO investigation_orders (patient_id, investigation_id, scheduled_time, priority, is_completed, completed_at, completed_by, result_value, is_active, created_by, notes) VALUES
    (v_patient4_id, v_inv_cbc, '2024-10-22 08:00:00', 'High', true, '2024-10-22 12:00:00', v_admin_id, 'Hb: 11.5 g/dL, WBC: 15 k/µL', false, v_admin_id, 'Elevated WBC indicating infection'),
    (v_patient4_id, v_inv_glucose, '2024-10-23 07:00:00', 'Medium', true, '2024-10-23 07:30:00', v_admin_id, '95 mg/dL', false, v_admin_id, 'Within normal range'),
    (v_patient5_id, v_inv_cbc, '2024-10-16 08:00:00', 'Medium', true, '2024-10-16 11:00:00', v_admin_id, 'Hb: 13.2 g/dL, WBC: 8.5 k/µL', false, v_admin_id, 'Normal values')
  ON CONFLICT DO NOTHING;

  -- Add Nursing Notes
  INSERT INTO nursing_notes (patient_id, recorded_by, note_type, note) VALUES
    (v_patient1_id, v_nurse1_id, 'General Assessment', 'Patient is alert and oriented. Vital signs stable. Blood glucose monitored regularly.'),
    (v_patient2_id, v_nurse2_id, 'Post-MI Care', 'Patient resting comfortably. No chest pain reported. Cardiac monitoring continuous.'),
    (v_patient3_id, v_nurse1_id, 'Post-Operative', 'Surgical site clean and dry. Patient ambulating with assistance. Pain controlled with medication.')
  ON CONFLICT DO NOTHING;

  -- Add Vital Signs
  INSERT INTO vital_signs (patient_id, recorded_by, temperature, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation) VALUES
    (v_patient1_id, v_nurse1_id, 98.6, 130, 85, 78, 16, 98),
    (v_patient2_id, v_nurse2_id, 98.4, 125, 80, 72, 18, 99),
    (v_patient3_id, v_nurse1_id, 99.1, 118, 75, 82, 16, 97)
  ON CONFLICT DO NOTHING;

END $$;
