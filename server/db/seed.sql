-- Ward Watch Database Seed Data
-- Run this after running schema.sql
-- This file provides comprehensive test data for development and testing

-- ============================================================
-- MASTER DATA
-- ============================================================

-- Insert Departments
INSERT INTO departments (department_name) VALUES
  ('Emergency'),
  ('ICU'),
  ('General Medicine'),
  ('Surgery'),
  ('Pediatrics'),
  ('Cardiology'),
  ('Orthopedics'),
  ('Neurology'),
  ('Oncology'),
  ('Gynecology')
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
  ('Sublingual'),
  ('Transdermal'),
  ('Nasal')
ON CONFLICT DO NOTHING;

-- Insert Medications (Extended List)
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
  ('Ceftriaxone', '1g', 'Injectable'),
  ('Azithromycin', '500mg', 'Tablet'),
  ('Losartan', '50mg', 'Tablet'),
  ('Metoprolol', '50mg', 'Tablet'),
  ('Levothyroxine', '100mcg', 'Tablet'),
  ('Amlodipine', '5mg', 'Tablet'),
  ('Gabapentin', '300mg', 'Capsule'),
  ('Prednisone', '20mg', 'Tablet'),
  ('Diazepam', '5mg', 'Tablet'),
  ('Enoxaparin', '40mg/0.4mL', 'Injectable'),
  ('Heparin', '5000 units/mL', 'Injectable')
ON CONFLICT DO NOTHING;

-- Insert Procedures (Extended List)
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
  ('Blood Transfusion', 'Administration of blood products'),
  ('Arterial Blood Gas', 'ABG sampling and analysis'),
  ('Central Line Insertion', 'Central venous catheter placement'),
  ('Lumbar Puncture', 'Spinal fluid collection'),
  ('Thoracentesis', 'Pleural fluid drainage'),
  ('Paracentesis', 'Abdominal fluid drainage'),
  ('Tracheostomy Care', 'Tracheostomy tube maintenance'),
  ('Ventilator Management', 'Mechanical ventilation adjustment'),
  ('Dialysis', 'Hemodialysis session')
ON CONFLICT DO NOTHING;

-- Insert Investigations (Extended List)
INSERT INTO investigations (investigation_name, description, normal_range) VALUES
  ('Complete Blood Count', 'Full blood panel analysis', 'Hb: 12-16 g/dL, WBC: 4-11 k/µL, PLT: 150-400 k/µL'),
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
  ('Ultrasound Abdomen', 'Abdominal ultrasound', 'Normal study'),
  ('MRI Brain', 'Magnetic resonance imaging of brain', 'No abnormalities'),
  ('Thyroid Function Test', 'TSH, T3, T4 levels', 'TSH: 0.4-4.0 mIU/L'),
  ('Lipid Profile', 'Cholesterol panel', 'Total: <200 mg/dL, LDL: <100 mg/dL'),
  ('HbA1c', 'Glycated hemoglobin', '<5.7% (normal)'),
  ('Arterial Blood Gas', 'ABG analysis', 'pH: 7.35-7.45, pO2: 80-100 mmHg'),
  ('Troponin', 'Cardiac enzyme', '<0.04 ng/mL'),
  ('D-Dimer', 'Coagulation marker', '<500 ng/mL'),
  ('Echocardiography', '2D Echo heart scan', 'Normal cardiac function')
ON CONFLICT DO NOTHING;

-- ============================================================
-- STAFF DATA
-- ============================================================

-- Insert Staff Members
INSERT INTO staff (staff_name, role, contact_number, email) VALUES
  ('Dr. Priya Sharma', 'Doctor', '+91-98100-01001', 'dr.priya@hospital.com'),
  ('Dr. Rajesh Kumar', 'Doctor', '+91-98100-01002', 'dr.rajesh@hospital.com'),
  ('Dr. Anjali Patel', 'Doctor', '+91-98100-01003', 'dr.anjali@hospital.com'),
  ('Dr. Arjun Singh', 'Doctor', '+91-98100-01004', 'dr.arjun@hospital.com'),
  ('Dr. Sneha Reddy', 'Doctor', '+91-98100-01005', 'dr.sneha@hospital.com'),
  ('Dr. Vikram Mehta', 'Doctor', '+91-98100-01006', 'dr.vikram@hospital.com'),
  ('Dr. Kavita Nair', 'Doctor', '+91-98100-01007', 'dr.kavita@hospital.com'),
  ('Dr. Arun Desai', 'Doctor', '+91-98100-01008', 'dr.arun@hospital.com'),
  ('Nurse Sunita Verma', 'Nurse', '+91-98100-02001', 'nurse.sunita@hospital.com'),
  ('Nurse Ramesh Iyer', 'Nurse', '+91-98100-02002', 'nurse.ramesh@hospital.com'),
  ('Nurse Pooja Gupta', 'Nurse', '+91-98100-02003', 'nurse.pooja@hospital.com'),
  ('Nurse Suresh Rao', 'Nurse', '+91-98100-02004', 'nurse.suresh@hospital.com'),
  ('Nurse Lakshmi Menon', 'Nurse', '+91-98100-02005', 'nurse.lakshmi@hospital.com'),
  ('Nurse Manoj Pillai', 'Nurse', '+91-98100-02006', 'nurse.manoj@hospital.com'),
  ('Nurse Deepa Joshi', 'Nurse', '+91-98100-02007', 'nurse.deepa@hospital.com'),
  ('Nurse Kiran Bhat', 'Nurse', '+91-98100-02008', 'nurse.kiran@hospital.com'),
  ('Nurse Meera Kulkarni', 'Nurse', '+91-98100-02009', 'nurse.meera@hospital.com'),
  ('Nurse Anil Shetty', 'Nurse', '+91-98100-02010', 'nurse.anil@hospital.com')
ON CONFLICT DO NOTHING;

-- ============================================================
-- ADMIN USERS
-- ============================================================

-- Insert Admin User
-- Default password: admin123
-- Hash generated using bcrypt with 10 rounds
INSERT INTO admins (username, password_hash, full_name, email, contact_number) VALUES
  ('admin', '$2b$10$K7L1OwyWdYKxXNnXZ5rXO.5aYJmH4QIf9JqBmYRZ7ZeYQZ7ZeYQZ7e', 'System Administrator', 'admin@hospital.com', '+91-98100-00001'),
  ('nurse1', '$2b$10$K7L1OwyWdYKxXNnXZ5rXO.5aYJmH4QIf9JqBmYRZ7ZeYQZ7ZeYQZ7e', 'Sunita Verma', 'sunita.verma@hospital.com', '+91-98100-02001'),
  ('doctor1', '$2b$10$K7L1OwyWdYKxXNnXZ5rXO.5aYJmH4QIf9JqBmYRZ7ZeYQZ7ZeYQZ7e', 'Dr. Priya Sharma', 'priya.sharma@hospital.com', '+91-98100-01001')
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- PATIENT DATA
-- ============================================================

-- Insert Sample Patients (Mix of active and discharged)
INSERT INTO patients (ipd_number, patient_name, age, gender, contact_number, address, bed_number, ward, diagnosis, admission_date, is_discharged, discharge_date, emergency_contact) VALUES
  ('IPD001', 'Ramesh Kumar', 45, 'M', '+91-98765-43210', '15/A, MG Road, Mumbai, Maharashtra 400001', 'A101', 'General Medicine', 'Type 2 Diabetes with Hypertension', '2024-11-10', false, NULL, '+91-98765-43211'),
  ('IPD002', 'Savitri Devi', 62, 'F', '+91-98765-43220', '42, Sector 15, Noida, UP 201301', 'B203', 'Cardiology', 'Acute Myocardial Infarction', '2024-11-12', false, NULL, '+91-98765-43221'),
  ('IPD003', 'Vikram Singh', 35, 'M', '+91-98765-43230', '78, Brigade Road, Bangalore, Karnataka 560001', 'C105', 'Surgery', 'Post-Appendectomy', '2024-11-14', false, NULL, '+91-98765-43231'),
  ('IPD004', 'Anita Deshmukh', 28, 'F', '+91-98765-43240', '23, Park Street, Kolkata, West Bengal 700016', 'D201', 'ICU', 'Severe Pneumonia - Recovered', '2024-10-20', true, '2024-11-05', '+91-98765-43241'),
  ('IPD005', 'Sunil Patil', 55, 'M', '+91-98765-43250', '56, FC Road, Pune, Maharashtra 411004', 'B108', 'Orthopedics', 'Fractured Femur - Discharged', '2024-10-15', true, '2024-11-01', '+91-98765-43251'),
  ('IPD006', 'Lakshmi Iyer', 71, 'F', '+91-98765-43260', '89, Anna Salai, Chennai, Tamil Nadu 600002', 'A205', 'Neurology', 'Ischemic Stroke', '2024-11-13', false, NULL, '+91-98765-43261'),
  ('IPD007', 'Ashok Reddy', 52, 'M', '+91-98765-43270', '34, Banjara Hills, Hyderabad, Telangana 500034', 'C302', 'Cardiology', 'Congestive Heart Failure', '2024-11-11', false, NULL, '+91-98765-43271'),
  ('IPD008', 'Priya Menon', 39, 'F', '+91-98765-43280', '67, Marine Drive, Kochi, Kerala 682031', 'B104', 'General Medicine', 'Acute Gastroenteritis', '2024-11-15', false, NULL, '+91-98765-43281'),
  ('IPD009', 'Amit Joshi', 48, 'M', '+91-98765-43290', '12, Civil Lines, Jaipur, Rajasthan 302006', 'A308', 'Surgery', 'Post-Cholecystectomy', '2024-11-09', false, NULL, '+91-98765-43291'),
  ('IPD010', 'Geeta Agarwal', 67, 'F', '+91-98765-43300', '45, Hazratganj, Lucknow, UP 226001', 'C201', 'Oncology', 'Breast Cancer - Chemotherapy', '2024-11-08', false, NULL, '+91-98765-43301')
ON CONFLICT (ipd_number) DO NOTHING;

-- ============================================================
-- PATIENT-STAFF ASSIGNMENTS & ORDERS
-- ============================================================

DO $$
DECLARE
  v_admin_id UUID;
  v_patient1_id UUID;
  v_patient2_id UUID;
  v_patient3_id UUID;
  v_patient4_id UUID;
  v_patient5_id UUID;
  v_patient6_id UUID;
  v_patient7_id UUID;
  v_patient8_id UUID;
  v_patient9_id UUID;
  v_patient10_id UUID;
  v_doctor1_id UUID;
  v_doctor2_id UUID;
  v_doctor3_id UUID;
  v_doctor4_id UUID;
  v_nurse1_id UUID;
  v_nurse2_id UUID;
  v_nurse3_id UUID;
  v_nurse4_id UUID;
  v_med_paracetamol UUID;
  v_med_insulin UUID;
  v_med_aspirin UUID;
  v_med_metformin UUID;
  v_med_morphine UUID;
  v_med_ceftriaxone UUID;
  v_proc_bp UUID;
  v_proc_ecg UUID;
  v_proc_wound UUID;
  v_proc_oxygen UUID;
  v_inv_cbc UUID;
  v_inv_glucose UUID;
  v_inv_ecg UUID;
  v_inv_xray UUID;
  v_route_oral UUID;
  v_route_iv UUID;
  v_route_sc UUID;
  v_route_im UUID;
BEGIN
  -- Get IDs from inserted data
  SELECT admin_id INTO v_admin_id FROM admins WHERE username = 'admin' LIMIT 1;
  
  SELECT patient_id INTO v_patient1_id FROM patients WHERE ipd_number = 'IPD001' LIMIT 1;
  SELECT patient_id INTO v_patient2_id FROM patients WHERE ipd_number = 'IPD002' LIMIT 1;
  SELECT patient_id INTO v_patient3_id FROM patients WHERE ipd_number = 'IPD003' LIMIT 1;
  SELECT patient_id INTO v_patient4_id FROM patients WHERE ipd_number = 'IPD004' LIMIT 1;
  SELECT patient_id INTO v_patient5_id FROM patients WHERE ipd_number = 'IPD005' LIMIT 1;
  SELECT patient_id INTO v_patient6_id FROM patients WHERE ipd_number = 'IPD006' LIMIT 1;
  SELECT patient_id INTO v_patient7_id FROM patients WHERE ipd_number = 'IPD007' LIMIT 1;
  SELECT patient_id INTO v_patient8_id FROM patients WHERE ipd_number = 'IPD008' LIMIT 1;
  SELECT patient_id INTO v_patient9_id FROM patients WHERE ipd_number = 'IPD009' LIMIT 1;
  SELECT patient_id INTO v_patient10_id FROM patients WHERE ipd_number = 'IPD010' LIMIT 1;
  
  SELECT staff_id INTO v_doctor1_id FROM staff WHERE staff_name = 'Dr. Priya Sharma' LIMIT 1;
  SELECT staff_id INTO v_doctor2_id FROM staff WHERE staff_name = 'Dr. Rajesh Kumar' LIMIT 1;
  SELECT staff_id INTO v_doctor3_id FROM staff WHERE staff_name = 'Dr. Anjali Patel' LIMIT 1;
  SELECT staff_id INTO v_doctor4_id FROM staff WHERE staff_name = 'Dr. Arjun Singh' LIMIT 1;
  
  SELECT staff_id INTO v_nurse1_id FROM staff WHERE staff_name = 'Nurse Sunita Verma' LIMIT 1;
  SELECT staff_id INTO v_nurse2_id FROM staff WHERE staff_name = 'Nurse Ramesh Iyer' LIMIT 1;
  SELECT staff_id INTO v_nurse3_id FROM staff WHERE staff_name = 'Nurse Pooja Gupta' LIMIT 1;
  SELECT staff_id INTO v_nurse4_id FROM staff WHERE staff_name = 'Nurse Suresh Rao' LIMIT 1;
  
  SELECT medication_id INTO v_med_paracetamol FROM medications WHERE medication_name = 'Paracetamol' LIMIT 1;
  SELECT medication_id INTO v_med_insulin FROM medications WHERE medication_name = 'Insulin Glargine' LIMIT 1;
  SELECT medication_id INTO v_med_aspirin FROM medications WHERE medication_name = 'Aspirin' LIMIT 1;
  SELECT medication_id INTO v_med_metformin FROM medications WHERE medication_name = 'Metformin' LIMIT 1;
  SELECT medication_id INTO v_med_morphine FROM medications WHERE medication_name = 'Morphine' LIMIT 1;
  SELECT medication_id INTO v_med_ceftriaxone FROM medications WHERE medication_name = 'Ceftriaxone' LIMIT 1;
  
  SELECT procedure_id INTO v_proc_bp FROM procedures WHERE procedure_name = 'Blood Pressure Check' LIMIT 1;
  SELECT procedure_id INTO v_proc_ecg FROM procedures WHERE procedure_name = 'ECG' LIMIT 1;
  SELECT procedure_id INTO v_proc_wound FROM procedures WHERE procedure_name = 'Wound Dressing' LIMIT 1;
  SELECT procedure_id INTO v_proc_oxygen FROM procedures WHERE procedure_name = 'Oxygen Therapy' LIMIT 1;
  
  SELECT investigation_id INTO v_inv_cbc FROM investigations WHERE investigation_name = 'Complete Blood Count' LIMIT 1;
  SELECT investigation_id INTO v_inv_glucose FROM investigations WHERE investigation_name = 'Blood Glucose' LIMIT 1;
  SELECT investigation_id INTO v_inv_ecg FROM investigations WHERE investigation_name = 'ECG' LIMIT 1;
  SELECT investigation_id INTO v_inv_xray FROM investigations WHERE investigation_name = 'Chest X-Ray' LIMIT 1;
  
  SELECT route_id INTO v_route_oral FROM routes_of_administration WHERE route_name = 'Oral (PO)' LIMIT 1;
  SELECT route_id INTO v_route_iv FROM routes_of_administration WHERE route_name = 'Intravenous (IV)' LIMIT 1;
  SELECT route_id INTO v_route_sc FROM routes_of_administration WHERE route_name = 'Subcutaneous (SC)' LIMIT 1;
  SELECT route_id INTO v_route_im FROM routes_of_administration WHERE route_name = 'Intramuscular (IM)' LIMIT 1;

  -- Assign Staff to Active Patients
  INSERT INTO patient_staff_assignments (patient_id, staff_id, assignment_role) VALUES
    (v_patient1_id, v_doctor1_id, 'Doctor'),
    (v_patient1_id, v_nurse1_id, 'Nurse'),
    (v_patient2_id, v_doctor2_id, 'Doctor'),
    (v_patient2_id, v_nurse2_id, 'Nurse'),
    (v_patient3_id, v_doctor1_id, 'Doctor'),
    (v_patient3_id, v_nurse1_id, 'Nurse'),
    (v_patient6_id, v_doctor3_id, 'Doctor'),
    (v_patient6_id, v_nurse3_id, 'Nurse'),
    (v_patient7_id, v_doctor2_id, 'Doctor'),
    (v_patient7_id, v_nurse2_id, 'Nurse'),
    (v_patient8_id, v_doctor1_id, 'Doctor'),
    (v_patient8_id, v_nurse4_id, 'Nurse'),
    (v_patient9_id, v_doctor4_id, 'Doctor'),
    (v_patient9_id, v_nurse1_id, 'Nurse'),
    (v_patient10_id, v_doctor3_id, 'Doctor'),
    (v_patient10_id, v_nurse3_id, 'Nurse')
  ON CONFLICT (patient_id, assignment_role) DO NOTHING;

  -- Active Medication Orders for Patient 1 (John Smith - Diabetes with Hypertension)
  INSERT INTO medication_orders (patient_id, medication_id, route_id, scheduled_time, frequency, start_date, end_date, dosage_amount, priority, is_active, created_by) VALUES
    (v_patient1_id, v_med_insulin, v_route_sc, '08:00', 'Once Daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', '20 units', 'High', true, v_admin_id),
    (v_patient1_id, v_med_metformin, v_route_oral, '08:00', 'Twice Daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', '850mg', 'High', true, v_admin_id),
    (v_patient1_id, v_med_metformin, v_route_oral, '20:00', 'Twice Daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', '850mg', 'High', true, v_admin_id),
    (v_patient1_id, v_med_paracetamol, v_route_oral, '08:00', 'Three times daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '5 days', '500mg', 'Medium', true, v_admin_id),
    (v_patient1_id, v_med_paracetamol, v_route_oral, '14:00', 'Three times daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '5 days', '500mg', 'Medium', true, v_admin_id),
    (v_patient1_id, v_med_paracetamol, v_route_oral, '20:00', 'Three times daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '5 days', '500mg', 'Medium', true, v_admin_id)
  ON CONFLICT DO NOTHING;

  -- Active Medication Orders for Patient 2 (Mary Johnson - MI patient)
  INSERT INTO medication_orders (patient_id, medication_id, route_id, scheduled_time, frequency, start_date, end_date, dosage_amount, priority, is_active, created_by) VALUES
    (v_patient2_id, v_med_aspirin, v_route_oral, '09:00', 'Once Daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '75mg', 'High', true, v_admin_id),
    (v_patient2_id, v_med_morphine, v_route_iv, '06:00', 'Every 6 hours PRN', CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', '5mg', 'High', true, v_admin_id),
    (v_patient2_id, v_med_morphine, v_route_iv, '12:00', 'Every 6 hours PRN', CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', '5mg', 'High', true, v_admin_id)
  ON CONFLICT DO NOTHING;

  -- Active Medication Orders for Patient 3 (Robert Davis - Post-Appendectomy)
  INSERT INTO medication_orders (patient_id, medication_id, route_id, scheduled_time, frequency, start_date, end_date, dosage_amount, priority, is_active, created_by) VALUES
    (v_patient3_id, v_med_ceftriaxone, v_route_iv, '08:00', 'Once Daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '5 days', '1g', 'High', true, v_admin_id),
    (v_patient3_id, v_med_paracetamol, v_route_oral, '08:00', 'Four times daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', '500mg', 'Medium', true, v_admin_id),
    (v_patient3_id, v_med_paracetamol, v_route_oral, '14:00', 'Four times daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', '500mg', 'Medium', true, v_admin_id)
  ON CONFLICT DO NOTHING;

  -- Active Procedure Orders
  INSERT INTO procedure_orders (patient_id, procedure_id, scheduled_time, priority, is_active, created_by) VALUES
    (v_patient1_id, v_proc_bp, CURRENT_TIMESTAMP + INTERVAL '2 hours', 'High', true, v_admin_id),
    (v_patient2_id, v_proc_ecg, CURRENT_TIMESTAMP + INTERVAL '1 hour', 'High', true, v_admin_id),
    (v_patient2_id, v_proc_oxygen, CURRENT_TIMESTAMP + INTERVAL '30 minutes', 'High', true, v_admin_id),
    (v_patient3_id, v_proc_wound, CURRENT_TIMESTAMP + INTERVAL '4 hours', 'Medium', true, v_admin_id),
    (v_patient6_id, v_proc_bp, CURRENT_TIMESTAMP + INTERVAL '3 hours', 'High', true, v_admin_id),
    (v_patient7_id, v_proc_ecg, CURRENT_TIMESTAMP + INTERVAL '2 hours', 'High', true, v_admin_id)
  ON CONFLICT DO NOTHING;

  -- Active Investigation Orders
  INSERT INTO investigation_orders (patient_id, investigation_id, scheduled_time, priority, is_active, created_by) VALUES
    (v_patient1_id, v_inv_glucose, CURRENT_TIMESTAMP + INTERVAL '1 day', 'High', true, v_admin_id),
    (v_patient2_id, v_inv_cbc, CURRENT_TIMESTAMP + INTERVAL '3 hours', 'High', true, v_admin_id),
    (v_patient2_id, v_inv_ecg, CURRENT_TIMESTAMP + INTERVAL '2 hours', 'High', true, v_admin_id),
    (v_patient3_id, v_inv_cbc, CURRENT_TIMESTAMP + INTERVAL '1 day', 'Medium', true, v_admin_id),
    (v_patient6_id, v_inv_xray, CURRENT_TIMESTAMP + INTERVAL '4 hours', 'High', true, v_admin_id),
    (v_patient8_id, v_inv_cbc, CURRENT_TIMESTAMP + INTERVAL '6 hours', 'Medium', true, v_admin_id)
  ON CONFLICT DO NOTHING;

  -- Add COMPLETED orders with history for discharged patients (Patient 4 & 5)
  INSERT INTO medication_orders (patient_id, medication_id, route_id, scheduled_time, frequency, start_date, end_date, dosage_amount, priority, is_completed, completed_at, completed_by, is_active, created_by, notes) VALUES
    (v_patient4_id, v_med_ceftriaxone, v_route_iv, '08:00', 'Twice Daily', '2024-10-21', '2024-10-30', '1g', 'High', true, '2024-10-21 08:15:00', v_admin_id, false, v_admin_id, 'IV antibiotic for pneumonia'),
    (v_patient4_id, v_med_paracetamol, v_route_oral, '08:00', 'Three times daily', '2024-10-21', '2024-11-04', '500mg', 'Medium', true, '2024-10-21 08:20:00', v_admin_id, false, v_admin_id, 'For fever management'),
    (v_patient5_id, v_med_morphine, v_route_im, '08:00', 'Every 6 hours PRN', '2024-10-16', '2024-10-25', '10mg', 'High', true, '2024-10-16 08:10:00', v_admin_id, false, v_admin_id, 'Post-operative pain relief')
  ON CONFLICT DO NOTHING;

  INSERT INTO procedure_orders (patient_id, procedure_id, scheduled_time, priority, is_completed, completed_at, completed_by, is_active, created_by, notes) VALUES
    (v_patient4_id, v_proc_bp, '2024-10-22 10:00:00', 'High', true, '2024-10-22 10:05:00', v_admin_id, false, v_admin_id, 'BP: 120/80 mmHg - Normal'),
    (v_patient4_id, v_proc_ecg, '2024-10-23 11:00:00', 'High', true, '2024-10-23 11:15:00', v_admin_id, false, v_admin_id, 'Normal sinus rhythm'),
    (v_patient4_id, v_proc_oxygen, '2024-10-22 08:00:00', 'High', true, '2024-10-22 08:30:00', v_admin_id, false, v_admin_id, 'O2 saturation improved to 98%'),
    (v_patient5_id, v_proc_bp, '2024-10-17 09:00:00', 'Medium', true, '2024-10-17 09:10:00', v_admin_id, false, v_admin_id, 'BP: 130/85 mmHg'),
    (v_patient5_id, v_proc_wound, '2024-10-18 10:00:00', 'High', true, '2024-10-18 10:20:00', v_admin_id, false, v_admin_id, 'Surgical site clean, healing well')
  ON CONFLICT DO NOTHING;

  INSERT INTO investigation_orders (patient_id, investigation_id, scheduled_time, priority, is_completed, completed_at, completed_by, result_value, is_active, created_by, notes) VALUES
    (v_patient4_id, v_inv_cbc, '2024-10-22 08:00:00', 'High', true, '2024-10-22 12:00:00', v_admin_id, 'Hb: 11.5 g/dL, WBC: 15.2 k/µL', false, v_admin_id, 'Elevated WBC - Infection present'),
    (v_patient4_id, v_inv_xray, '2024-10-23 09:00:00', 'High', true, '2024-10-23 11:00:00', v_admin_id, 'Bilateral infiltrates consistent with pneumonia', false, v_admin_id, 'Confirmed pneumonia diagnosis'),
    (v_patient5_id, v_inv_cbc, '2024-10-16 08:00:00', 'Medium', true, '2024-10-16 11:00:00', v_admin_id, 'Hb: 13.2 g/dL, WBC: 8.5 k/µL', false, v_admin_id, 'Normal post-operative values')
  ON CONFLICT DO NOTHING;

  -- Add Nursing Notes for Active Patients
  INSERT INTO nursing_notes (patient_id, recorded_by, note_type, note, recorded_at) VALUES
    (v_patient1_id, v_nurse1_id, 'General Assessment', 'Patient is alert and oriented x3. Vital signs stable. Blood glucose monitored q6h. Patient tolerating oral diet well.', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    (v_patient1_id, v_nurse1_id, 'Medication Administration', 'Morning insulin 20 units SC administered. No adverse reactions noted. Pre-meal glucose: 145 mg/dL', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
    (v_patient2_id, v_nurse2_id, 'Post-MI Care', 'Patient resting comfortably in semi-Fowlers position. No chest pain reported. Cardiac monitoring continuous. O2 sat 98% on 2L NC.', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
    (v_patient2_id, v_nurse2_id, 'Vital Signs', 'BP: 125/80, HR: 72, RR: 18, Temp: 98.4F. Patient stable, no acute distress.', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
    (v_patient3_id, v_nurse1_id, 'Post-Operative', 'Post-op day 2. Surgical site clean and dry, no signs of infection. Patient ambulating with assistance. Pain 3/10, controlled with oral analgesics.', CURRENT_TIMESTAMP - INTERVAL '5 hours'),
    (v_patient3_id, v_nurse1_id, 'Bowel Function', 'Patient reports passing flatus. Bowel sounds present in all quadrants. Tolerating clear liquids.', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
    (v_patient6_id, v_nurse3_id, 'Neurological Assessment', 'Post-stroke care. Patient alert, following commands. Right-sided weakness noted. Speech slightly slurred but improving.', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    (v_patient7_id, v_nurse2_id, 'Cardiac Monitoring', 'CHF patient. Lung sounds: bilateral crackles lower lobes. Daily weights monitored. I/O balanced. Lasix given as ordered.', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
    (v_patient8_id, v_nurse4_id, 'GI Assessment', 'Gastroenteritis resolving. No vomiting in past 12 hours. Tolerating oral fluids. Abdomen soft, non-tender.', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
    (v_patient9_id, v_nurse1_id, 'Post-Op Cholecystectomy', 'Laparoscopic cholecystectomy day 7. Incisions healing well. Drain removed. Patient ready for discharge planning.', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
    (v_patient10_id, v_nurse3_id, 'Chemotherapy', 'Day 3 of chemotherapy cycle. Patient experiencing mild nausea, controlled with antiemetics. Adequate hydration maintained.', CURRENT_TIMESTAMP - INTERVAL '5 hours')
  ON CONFLICT DO NOTHING;

  -- Add Vital Signs for Active Patients (Recent readings)
  INSERT INTO vital_signs (patient_id, recorded_by, temperature, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation, recorded_at) VALUES
    (v_patient1_id, v_nurse1_id, 98.6, 130, 85, 78, 16, 98, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    (v_patient1_id, v_nurse1_id, 98.4, 128, 82, 76, 16, 99, CURRENT_TIMESTAMP - INTERVAL '8 hours'),
    (v_patient2_id, v_nurse2_id, 98.4, 125, 80, 72, 18, 98, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
    (v_patient2_id, v_nurse2_id, 98.6, 122, 78, 70, 17, 99, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
    (v_patient3_id, v_nurse1_id, 99.1, 118, 75, 82, 16, 97, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
    (v_patient3_id, v_nurse1_id, 98.8, 120, 76, 80, 17, 98, CURRENT_TIMESTAMP - INTERVAL '9 hours'),
    (v_patient6_id, v_nurse3_id, 98.2, 142, 88, 76, 18, 96, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    (v_patient7_id, v_nurse2_id, 98.8, 135, 85, 88, 20, 94, CURRENT_TIMESTAMP - INTERVAL '4 hours'),
    (v_patient8_id, v_nurse4_id, 99.2, 115, 72, 85, 18, 98, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
    (v_patient9_id, v_nurse1_id, 98.6, 122, 78, 74, 16, 99, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
    (v_patient10_id, v_nurse3_id, 98.4, 118, 74, 72, 16, 97, CURRENT_TIMESTAMP - INTERVAL '5 hours')
  ON CONFLICT DO NOTHING;

  -- Add some notifications for upcoming treatments
  INSERT INTO notification_queue (patient_id, treatment_type, order_id, scheduled_time, message, is_acknowledged) 
  SELECT 
    patient_id,
    'medication'::VARCHAR(50),
    order_id,
    CONCAT(start_date, ' ', scheduled_time)::TIMESTAMP,
    CONCAT('Medication due: ', m.medication_name, ' ', dosage_amount, ' for patient ', p.patient_name),
    false
  FROM medication_orders mo
  JOIN medications m ON m.medication_id = mo.medication_id
  JOIN patients p ON p.patient_id = mo.patient_id
  WHERE mo.is_active = true 
    AND mo.is_completed = false 
    AND CONCAT(mo.start_date, ' ', mo.scheduled_time)::TIMESTAMP > CURRENT_TIMESTAMP
    AND CONCAT(mo.start_date, ' ', mo.scheduled_time)::TIMESTAMP < CURRENT_TIMESTAMP + INTERVAL '24 hours'
  LIMIT 5
  ON CONFLICT DO NOTHING;

END $$;
