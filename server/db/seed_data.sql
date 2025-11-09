-- ============================================================================
-- Ward Watch - Seed Data
-- ============================================================================
-- This file contains sample data to populate your Ward Watch system
-- Run this AFTER running schema.sql
-- 
-- Note: UUIDs, created_at, and updated_at are auto-generated
-- ============================================================================

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE nursing_notes, vital_signs, investigation_orders, procedure_orders, 
--                medication_orders, patient_staff_assignments, patients, staff, 
--                investigations, procedures, routes_of_administration, medications, 
--                departments, admins CASCADE;

-- ============================================================================
-- 1. ADMIN USERS
-- ============================================================================
-- Default password for all admins: "password123"
-- Password hash generated using bcrypt with 10 rounds

INSERT INTO admins (username, password_hash, full_name, email, contact_number, is_active)
VALUES 
  ('admin', '$2b$10$rPLqb5PJhZqCqVqJ4qGQcOYZ1ZqXJ.zJZ5vJqCqVqJ4qGQcOYZ1Zq', 'System Administrator', 'admin@wardwatch.com', '+1-555-0100', true),
  ('dr.smith', '$2b$10$rPLqb5PJhZqCqVqJ4qGQcOYZ1ZqXJ.zJZ5vJqCqVqJ4qGQcOYZ1Zq', 'Dr. Robert Smith', 'rsmith@hospital.com', '+1-555-0101', true),
  ('nurse.admin', '$2b$10$rPLqb5PJhZqCqVqJ4qGQcOYZ1ZqXJ.zJZ5vJqCqVqJ4qGQcOYZ1Zq', 'Sarah Johnson', 'sjohnson@hospital.com', '+1-555-0102', true);

-- ============================================================================
-- 2. DEPARTMENTS
-- ============================================================================

INSERT INTO departments (department_name)
VALUES 
  ('Emergency Medicine'),
  ('Intensive Care Unit (ICU)'),
  ('Cardiology'),
  ('Pediatrics'),
  ('General Surgery'),
  ('Orthopedics'),
  ('Internal Medicine'),
  ('Neurology'),
  ('Obstetrics & Gynecology'),
  ('Radiology');

-- ============================================================================
-- 3. MEDICATIONS (Master Data)
-- ============================================================================

INSERT INTO medications (medication_name, dosage, form)
VALUES 
  -- Analgesics & Antipyretics
  ('Paracetamol', '500mg', 'Tablet'),
  ('Paracetamol', '1000mg', 'Tablet'),
  ('Ibuprofen', '400mg', 'Tablet'),
  ('Diclofenac', '50mg', 'Tablet'),
  ('Tramadol', '50mg', 'Capsule'),
  ('Morphine', '10mg', 'Injection'),
  
  -- Antibiotics
  ('Amoxicillin', '500mg', 'Capsule'),
  ('Amoxicillin', '250mg', 'Syrup'),
  ('Ceftriaxone', '1g', 'Injection'),
  ('Azithromycin', '500mg', 'Tablet'),
  ('Ciprofloxacin', '500mg', 'Tablet'),
  ('Metronidazole', '400mg', 'Tablet'),
  
  -- Cardiovascular
  ('Aspirin', '75mg', 'Tablet'),
  ('Atorvastatin', '20mg', 'Tablet'),
  ('Amlodipine', '5mg', 'Tablet'),
  ('Enalapril', '5mg', 'Tablet'),
  ('Metoprolol', '50mg', 'Tablet'),
  
  -- Gastrointestinal
  ('Omeprazole', '20mg', 'Capsule'),
  ('Ranitidine', '150mg', 'Tablet'),
  ('Ondansetron', '4mg', 'Tablet'),
  
  -- Diabetes
  ('Metformin', '500mg', 'Tablet'),
  ('Insulin Glargine', '100 units/ml', 'Injection'),
  
  -- Respiratory
  ('Salbutamol', '100mcg', 'Inhaler'),
  ('Prednisolone', '5mg', 'Tablet'),
  
  -- IV Fluids
  ('Normal Saline 0.9%', '1000ml', 'IV Fluid'),
  ('Dextrose 5%', '500ml', 'IV Fluid'),
  ('Ringer Lactate', '1000ml', 'IV Fluid'),
  
  -- Others
  ('Diazepam', '5mg', 'Tablet'),
  ('Furosemide', '40mg', 'Tablet'),
  ('Heparin', '5000 units/ml', 'Injection');

-- ============================================================================
-- 4. ROUTES OF ADMINISTRATION
-- ============================================================================

INSERT INTO routes_of_administration (route_name)
VALUES 
  ('Oral (PO)'),
  ('Intravenous (IV)'),
  ('Intramuscular (IM)'),
  ('Subcutaneous (SC)'),
  ('Topical'),
  ('Inhalation'),
  ('Sublingual (SL)'),
  ('Rectal (PR)'),
  ('Per Nasogastric Tube (NGT)');

-- ============================================================================
-- 5. PROCEDURES (Master Data)
-- ============================================================================

INSERT INTO procedures (procedure_name, description)
VALUES 
  ('ECG (Electrocardiogram)', 'Recording of electrical activity of the heart to assess cardiac rhythm and detect abnormalities'),
  ('Wound Dressing', 'Cleaning and dressing of surgical or traumatic wounds to promote healing and prevent infection'),
  ('Foley Catheter Insertion', 'Insertion of urinary catheter for bladder drainage and urine output monitoring'),
  ('Nasogastric Tube Insertion', 'Placement of feeding tube through nose into stomach for nutrition or gastric decompression'),
  ('IV Cannulation', 'Insertion of intravenous cannula for fluid and medication administration'),
  ('Chest Physiotherapy', 'Breathing exercises and techniques to improve lung function and clear secretions'),
  ('Blood Transfusion', 'Administration of blood or blood products to treat anemia or blood loss'),
  ('Central Line Insertion', 'Placement of central venous catheter for long-term IV access or hemodynamic monitoring'),
  ('Arterial Blood Gas (ABG) Sampling', 'Collection of arterial blood sample to assess respiratory and metabolic status'),
  ('Tracheostomy Care', 'Cleaning and maintenance of tracheostomy tube to ensure airway patency'),
  ('Suture Removal', 'Removal of surgical sutures after adequate wound healing'),
  ('Nebulization', 'Administration of medication through inhaled mist to treat respiratory conditions'),
  ('Oxygen Therapy', 'Supplemental oxygen administration via nasal cannula, mask, or other devices'),
  ('Chest Tube Insertion', 'Placement of drain in pleural space to remove air or fluid from chest cavity'),
  ('Lumbar Puncture', 'Spinal tap to collect cerebrospinal fluid for diagnostic testing');

-- ============================================================================
-- 6. INVESTIGATIONS (Master Data)
-- ============================================================================

INSERT INTO investigations (investigation_name, description, normal_range)
VALUES 
  -- Hematology
  ('Complete Blood Count (CBC)', 'Comprehensive blood test measuring red cells, white cells, platelets, and hemoglobin', 'WBC: 4,000-11,000/μL, RBC: 4.5-5.5 million/μL, Hgb: 12-16 g/dL (F), 14-18 g/dL (M), Platelets: 150,000-450,000/μL'),
  ('Hemoglobin (Hgb)', 'Measures oxygen-carrying protein in red blood cells', '12-16 g/dL (Female), 14-18 g/dL (Male)'),
  ('ESR (Erythrocyte Sedimentation Rate)', 'Measures inflammation in the body', '0-20 mm/hr (Female), 0-15 mm/hr (Male)'),
  ('Prothrombin Time (PT/INR)', 'Blood clotting test', 'PT: 11-13.5 seconds, INR: 0.8-1.1'),
  
  -- Biochemistry
  ('Random Blood Sugar (RBS)', 'Blood glucose level at any time of day', '70-140 mg/dL'),
  ('Fasting Blood Sugar (FBS)', 'Blood glucose after 8-12 hours fasting', '70-100 mg/dL'),
  ('HbA1c (Glycated Hemoglobin)', 'Average blood sugar over past 2-3 months', 'Below 5.7% (Normal), 5.7-6.4% (Prediabetes), Above 6.5% (Diabetes)'),
  ('Serum Creatinine', 'Kidney function test', '0.6-1.2 mg/dL (Female), 0.7-1.3 mg/dL (Male)'),
  ('Blood Urea Nitrogen (BUN)', 'Kidney function test', '7-20 mg/dL'),
  ('Serum Electrolytes', 'Sodium, Potassium, Chloride levels', 'Na: 135-145 mEq/L, K: 3.5-5.0 mEq/L, Cl: 96-106 mEq/L'),
  ('Liver Function Test (LFT)', 'Tests liver enzymes and function', 'AST: 10-40 U/L, ALT: 7-56 U/L, ALP: 44-147 U/L, Bilirubin: 0.1-1.2 mg/dL'),
  ('Lipid Profile', 'Cholesterol and triglycerides', 'Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL (M), >50 mg/dL (F), Triglycerides: <150 mg/dL'),
  ('Serum Calcium', 'Calcium level in blood', '8.5-10.5 mg/dL'),
  ('Serum Uric Acid', 'Uric acid levels', '2.5-7.0 mg/dL (Female), 3.5-8.0 mg/dL (Male)'),
  
  -- Cardiac Markers
  ('Troponin I', 'Cardiac muscle damage marker', '<0.04 ng/mL'),
  ('CK-MB (Creatine Kinase-MB)', 'Heart attack marker', '<5 ng/mL'),
  
  -- Microbiology
  ('Blood Culture', 'Detects bacteria or fungi in blood', 'No growth'),
  ('Urine Culture', 'Identifies urinary tract infection', 'No significant growth'),
  ('Sputum Culture', 'Identifies respiratory infection', 'No pathogenic organisms'),
  
  -- Urinalysis
  ('Urine Routine & Microscopy', 'Complete urine analysis', 'pH: 4.5-8.0, Specific Gravity: 1.005-1.030, No protein, glucose, or blood'),
  
  -- Radiology
  ('Chest X-Ray (PA View)', 'Imaging of chest and lungs', 'No abnormalities detected'),
  ('X-Ray (Specify Site)', 'Radiographic imaging of specific body part', 'No fracture or abnormalities'),
  ('CT Scan (Specify Site)', 'Computed tomography imaging', 'Normal study'),
  ('Ultrasound (Specify Site)', 'Ultrasound imaging', 'Normal study'),
  ('MRI (Specify Site)', 'Magnetic resonance imaging', 'Normal study'),
  
  -- Others
  ('Arterial Blood Gas (ABG)', 'Blood oxygen, CO2, and pH levels', 'pH: 7.35-7.45, PaO2: 80-100 mmHg, PaCO2: 35-45 mmHg, HCO3: 22-26 mEq/L'),
  ('D-Dimer', 'Blood clot marker', '<0.5 mg/L');

-- ============================================================================
-- 7. STAFF
-- ============================================================================

INSERT INTO staff (staff_name, role, department_id, contact_number, email)
SELECT 
  staff_data.name,
  staff_data.role,
  d.department_id,
  staff_data.phone,
  staff_data.email
FROM (VALUES 
  -- Emergency Medicine
  ('Dr. Emily Chen', 'Doctor', 'Emergency Medicine', '+1-555-1001', 'echen@hospital.com'),
  ('Dr. Michael Rodriguez', 'Doctor', 'Emergency Medicine', '+1-555-1002', 'mrodriguez@hospital.com'),
  ('Nurse Jennifer Adams', 'Nurse', 'Emergency Medicine', '+1-555-1003', 'jadams@hospital.com'),
  ('Nurse Kevin O''Brien', 'Nurse', 'Emergency Medicine', '+1-555-1004', 'kobrien@hospital.com'),
  
  -- ICU
  ('Dr. Sarah Thompson', 'Doctor', 'Intensive Care Unit (ICU)', '+1-555-2001', 'sthompson@hospital.com'),
  ('Dr. James Wilson', 'Doctor', 'Intensive Care Unit (ICU)', '+1-555-2002', 'jwilson@hospital.com'),
  ('Nurse Lisa Martinez', 'Nurse', 'Intensive Care Unit (ICU)', '+1-555-2003', 'lmartinez@hospital.com'),
  ('Nurse David Kim', 'Nurse', 'Intensive Care Unit (ICU)', '+1-555-2004', 'dkim@hospital.com'),
  ('Nurse Rachel Green', 'Nurse', 'Intensive Care Unit (ICU)', '+1-555-2005', 'rgreen@hospital.com'),
  
  -- Cardiology
  ('Dr. Amanda Foster', 'Doctor', 'Cardiology', '+1-555-3001', 'afoster@hospital.com'),
  ('Dr. Robert Patterson', 'Doctor', 'Cardiology', '+1-555-3002', 'rpatterson@hospital.com'),
  ('Nurse Maria Garcia', 'Nurse', 'Cardiology', '+1-555-3003', 'mgarcia@hospital.com'),
  
  -- Pediatrics
  ('Dr. Jessica Lee', 'Doctor', 'Pediatrics', '+1-555-4001', 'jlee@hospital.com'),
  ('Dr. Christopher Brown', 'Doctor', 'Pediatrics', '+1-555-4002', 'cbrown@hospital.com'),
  ('Nurse Ashley Taylor', 'Nurse', 'Pediatrics', '+1-555-4003', 'ataylor@hospital.com'),
  ('Nurse Michelle White', 'Nurse', 'Pediatrics', '+1-555-4004', 'mwhite@hospital.com'),
  
  -- General Surgery
  ('Dr. Daniel Harris', 'Doctor', 'General Surgery', '+1-555-5001', 'dharris@hospital.com'),
  ('Dr. Laura Anderson', 'Doctor', 'General Surgery', '+1-555-5002', 'landerson@hospital.com'),
  ('Nurse Thomas Clark', 'Nurse', 'General Surgery', '+1-555-5003', 'tclark@hospital.com'),
  
  -- Orthopedics
  ('Dr. William Turner', 'Doctor', 'Orthopedics', '+1-555-6001', 'wturner@hospital.com'),
  ('Nurse Patricia Moore', 'Nurse', 'Orthopedics', '+1-555-6002', 'pmoore@hospital.com'),
  
  -- Internal Medicine
  ('Dr. Elizabeth Scott', 'Doctor', 'Internal Medicine', '+1-555-7001', 'escott@hospital.com'),
  ('Dr. Richard Hall', 'Doctor', 'Internal Medicine', '+1-555-7002', 'rhall@hospital.com'),
  ('Nurse Samantha Lewis', 'Nurse', 'Internal Medicine', '+1-555-7003', 'slewis@hospital.com'),
  
  -- Neurology
  ('Dr. Margaret Walker', 'Doctor', 'Neurology', '+1-555-8001', 'mwalker@hospital.com'),
  ('Nurse Andrew Young', 'Nurse', 'Neurology', '+1-555-8002', 'ayoung@hospital.com')
) AS staff_data(name, role, dept_name, phone, email)
JOIN departments d ON d.department_name = staff_data.dept_name;

-- ============================================================================
-- 8. PATIENTS
-- ============================================================================

INSERT INTO patients (ipd_number, patient_name, age, gender, contact_number, address, bed_number, ward, diagnosis, admission_date, emergency_contact)
VALUES 
  ('IPD001', 'John Anderson', 58, 'M', '+1-555-8001', '123 Maple Street, Springfield', 'B-101', 'Cardiology', 'Acute Myocardial Infarction', CURRENT_DATE - INTERVAL '2 days', 'Mary Anderson: +1-555-8002'),
  ('IPD002', 'Maria Santos', 45, 'F', '+1-555-8003', '456 Oak Avenue, Springfield', 'ICU-201', 'Intensive Care Unit (ICU)', 'Septic Shock', CURRENT_DATE - INTERVAL '1 day', 'Carlos Santos: +1-555-8004'),
  ('IPD003', 'Robert Johnson', 72, 'M', '+1-555-8005', '789 Pine Road, Springfield', 'B-102', 'Internal Medicine', 'Congestive Heart Failure', CURRENT_DATE - INTERVAL '3 days', 'Susan Johnson: +1-555-8006'),
  ('IPD004', 'Emily Davis', 5, 'F', '+1-555-8007', '321 Birch Lane, Springfield', 'P-301', 'Pediatrics', 'Acute Bronchiolitis', CURRENT_DATE - INTERVAL '1 day', 'Jennifer Davis: +1-555-8008'),
  ('IPD005', 'Michael Chen', 34, 'M', '+1-555-8009', '654 Cedar Court, Springfield', 'E-401', 'Emergency Medicine', 'Appendicitis', CURRENT_DATE, 'Lisa Chen: +1-555-8010'),
  ('IPD006', 'Sarah Williams', 61, 'F', '+1-555-8011', '987 Elm Street, Springfield', 'B-103', 'Internal Medicine', 'Type 2 Diabetes Mellitus - Uncontrolled', CURRENT_DATE - INTERVAL '2 days', 'David Williams: +1-555-8012'),
  ('IPD007', 'James Martinez', 28, 'M', '+1-555-8013', '147 Willow Avenue, Springfield', 'S-501', 'General Surgery', 'Right Femur Fracture', CURRENT_DATE - INTERVAL '1 day', 'Anna Martinez: +1-555-8014'),
  ('IPD008', 'Patricia Brown', 52, 'F', '+1-555-8015', '258 Spruce Road, Springfield', 'B-104', 'Cardiology', 'Atrial Fibrillation', CURRENT_DATE - INTERVAL '4 days', 'Robert Brown: +1-555-8016'),
  ('IPD009', 'David Taylor', 67, 'M', '+1-555-8017', '369 Ash Lane, Springfield', 'ICU-202', 'Intensive Care Unit (ICU)', 'Acute Respiratory Distress Syndrome', CURRENT_DATE - INTERVAL '2 days', 'Helen Taylor: +1-555-8018'),
  ('IPD010', 'Linda Garcia', 8, 'F', '+1-555-8019', '741 Chestnut Court, Springfield', 'P-302', 'Pediatrics', 'Viral Gastroenteritis', CURRENT_DATE, 'Maria Garcia: +1-555-8020');

-- ============================================================================
-- 9. PATIENT-STAFF ASSIGNMENTS
-- ============================================================================

INSERT INTO patient_staff_assignments (patient_id, staff_id, assignment_role)
SELECT 
  p.patient_id,
  s.staff_id,
  assignments.role
FROM (VALUES
  -- IPD001: John Anderson - Cardiology
  ('IPD001', 'Dr. Amanda Foster', 'Doctor'),
  ('IPD001', 'Nurse Maria Garcia', 'Nurse'),
  
  -- IPD002: Maria Santos - ICU
  ('IPD002', 'Dr. Sarah Thompson', 'Doctor'),
  ('IPD002', 'Nurse Lisa Martinez', 'Nurse'),
  
  -- IPD003: Robert Johnson - Internal Medicine
  ('IPD003', 'Dr. Elizabeth Scott', 'Doctor'),
  ('IPD003', 'Nurse Samantha Lewis', 'Nurse'),
  
  -- IPD004: Emily Davis - Pediatrics
  ('IPD004', 'Dr. Jessica Lee', 'Doctor'),
  ('IPD004', 'Nurse Ashley Taylor', 'Nurse'),
  
  -- IPD005: Michael Chen - Emergency
  ('IPD005', 'Dr. Emily Chen', 'Doctor'),
  ('IPD005', 'Nurse Jennifer Adams', 'Nurse'),
  
  -- IPD006: Sarah Williams - Internal Medicine
  ('IPD006', 'Dr. Richard Hall', 'Doctor'),
  ('IPD006', 'Nurse Samantha Lewis', 'Nurse'),
  
  -- IPD007: James Martinez - Surgery
  ('IPD007', 'Dr. Daniel Harris', 'Doctor'),
  ('IPD007', 'Nurse Thomas Clark', 'Nurse'),
  
  -- IPD008: Patricia Brown - Cardiology
  ('IPD008', 'Dr. Robert Patterson', 'Doctor'),
  ('IPD008', 'Nurse Maria Garcia', 'Nurse'),
  
  -- IPD009: David Taylor - ICU
  ('IPD009', 'Dr. James Wilson', 'Doctor'),
  ('IPD009', 'Nurse David Kim', 'Nurse'),
  
  -- IPD010: Linda Garcia - Pediatrics
  ('IPD010', 'Dr. Christopher Brown', 'Doctor'),
  ('IPD010', 'Nurse Michelle White', 'Nurse')
) AS assignments(ipd, staff_name, role)
JOIN patients p ON p.ipd_number = assignments.ipd
JOIN staff s ON s.staff_name = assignments.staff_name;

-- ============================================================================
-- 10. MEDICATION ORDERS
-- ============================================================================

INSERT INTO medication_orders (patient_id, medication_id, route_id, scheduled_time, frequency, start_date, end_date, dosage_amount, priority, notes)
SELECT 
  p.patient_id,
  m.medication_id,
  r.route_id,
  orders.time::TIME,
  orders.frequency,
  orders.start_date::DATE,
  orders.end_date::DATE,
  orders.dosage,
  orders.priority,
  orders.notes
FROM (VALUES
  -- IPD001: John Anderson - MI patient
  ('IPD001', 'Aspirin', 'Oral (PO)', '09:00', 'Once Daily', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '30 days')::TEXT, '75mg', 'High', 'Antiplatelet therapy'),
  ('IPD001', 'Atorvastatin', 'Oral (PO)', '21:00', 'Once Daily', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '30 days')::TEXT, '20mg', 'High', 'Lipid management'),
  ('IPD001', 'Metoprolol', 'Oral (PO)', '09:00', 'Twice Daily', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '30 days')::TEXT, '50mg', 'High', 'Beta blocker'),
  ('IPD001', 'Heparin', 'Subcutaneous (SC)', '08:00', 'Every 12 hours', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '7 days')::TEXT, '5000 units', 'High', 'DVT prophylaxis'),
  
  -- IPD002: Maria Santos - Septic shock
  ('IPD002', 'Ceftriaxone', 'Intravenous (IV)', '08:00', 'Every 12 hours', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '7 days')::TEXT, '1g', 'High', 'Broad spectrum antibiotic'),
  ('IPD002', 'Normal Saline 0.9%', 'Intravenous (IV)', '00:00', 'Continuous', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '2 days')::TEXT, '1000ml over 8 hours', 'High', 'Fluid resuscitation'),
  
  -- IPD003: Robert Johnson - CHF
  ('IPD003', 'Furosemide', 'Oral (PO)', '08:00', 'Once Daily', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '30 days')::TEXT, '40mg', 'Medium', 'Diuretic'),
  ('IPD003', 'Enalapril', 'Oral (PO)', '09:00', 'Once Daily', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '30 days')::TEXT, '5mg', 'Medium', 'ACE inhibitor'),
  
  -- IPD004: Emily Davis - Bronchiolitis
  ('IPD004', 'Salbutamol', 'Inhalation', '08:00', 'Every 6 hours', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '5 days')::TEXT, '2 puffs', 'Medium', 'Bronchodilator'),
  ('IPD004', 'Paracetamol', 'Oral (PO)', '08:00', 'Every 6 hours PRN', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '3 days')::TEXT, '120mg', 'Low', 'For fever >38.5°C'),
  
  -- IPD005: Michael Chen - Appendicitis (pre-op)
  ('IPD005', 'Ceftriaxone', 'Intravenous (IV)', '10:00', 'Single dose', CURRENT_DATE::TEXT, CURRENT_DATE::TEXT, '1g', 'High', 'Pre-operative antibiotic prophylaxis'),
  ('IPD005', 'Tramadol', 'Oral (PO)', '11:00', 'Every 6 hours PRN', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '2 days')::TEXT, '50mg', 'Medium', 'Pain management'),
  
  -- IPD006: Sarah Williams - Diabetes
  ('IPD006', 'Insulin Glargine', 'Subcutaneous (SC)', '21:00', 'Once Daily', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '14 days')::TEXT, '20 units', 'High', 'Basal insulin'),
  ('IPD006', 'Metformin', 'Oral (PO)', '09:00', 'Twice Daily', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '30 days')::TEXT, '500mg', 'Medium', 'Oral hypoglycemic'),
  
  -- IPD007: James Martinez - Femur fracture
  ('IPD007', 'Morphine', 'Intravenous (IV)', '08:00', 'Every 4 hours PRN', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '3 days')::TEXT, '10mg', 'High', 'Pain control'),
  ('IPD007', 'Heparin', 'Subcutaneous (SC)', '08:00', 'Every 12 hours', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '10 days')::TEXT, '5000 units', 'High', 'DVT prophylaxis'),
  
  -- IPD008: Patricia Brown - Atrial Fibrillation
  ('IPD008', 'Metoprolol', 'Oral (PO)', '08:00', 'Twice Daily', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '30 days')::TEXT, '50mg', 'High', 'Rate control'),
  
  -- IPD009: David Taylor - ARDS
  ('IPD009', 'Ceftriaxone', 'Intravenous (IV)', '08:00', 'Every 12 hours', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '10 days')::TEXT, '1g', 'High', 'Antibiotic therapy'),
  ('IPD009', 'Furosemide', 'Intravenous (IV)', '08:00', 'Twice Daily', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '5 days')::TEXT, '40mg', 'High', 'Reduce pulmonary edema'),
  
  -- IPD010: Linda Garcia - Gastroenteritis
  ('IPD010', 'Ondansetron', 'Oral (PO)', '08:00', 'Three times daily', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '2 days')::TEXT, '4mg', 'Medium', 'Anti-emetic'),
  ('IPD010', 'Ringer Lactate', 'Intravenous (IV)', '10:00', 'Continuous', CURRENT_DATE::TEXT, (CURRENT_DATE + INTERVAL '1 day')::TEXT, '1000ml over 12 hours', 'Medium', 'Rehydration')
) AS orders(ipd, med_name, route_name, time, frequency, start_date, end_date, dosage, priority, notes)
JOIN patients p ON p.ipd_number = orders.ipd
JOIN medications m ON m.medication_name = orders.med_name AND (m.dosage = orders.dosage OR orders.dosage LIKE '%' || m.dosage || '%')
JOIN routes_of_administration r ON r.route_name = orders.route_name;

-- ============================================================================
-- 11. PROCEDURE ORDERS
-- ============================================================================

INSERT INTO procedure_orders (patient_id, procedure_id, scheduled_time, priority, notes)
SELECT 
  p.patient_id,
  proc.procedure_id,
  orders.scheduled_time::TIMESTAMP,
  orders.priority,
  orders.notes
FROM (VALUES
  -- Today's procedures
  ('IPD001', 'ECG (Electrocardiogram)', (CURRENT_DATE || ' 10:00:00')::TEXT, 'High', 'Daily ECG monitoring'),
  ('IPD002', 'Central Line Insertion', (CURRENT_DATE || ' 11:00:00')::TEXT, 'High', 'For vasopressor administration'),
  ('IPD003', 'Chest Physiotherapy', (CURRENT_DATE || ' 14:00:00')::TEXT, 'Medium', 'Respiratory therapy'),
  ('IPD004', 'Nebulization', (CURRENT_DATE || ' 09:00:00')::TEXT, 'Medium', 'Salbutamol nebulization'),
  ('IPD005', 'IV Cannulation', (CURRENT_DATE || ' 08:30:00')::TEXT, 'High', 'Pre-operative IV access'),
  ('IPD007', 'Wound Dressing', (CURRENT_DATE || ' 10:30:00')::TEXT, 'Medium', 'Post-operative wound care'),
  ('IPD008', 'ECG (Electrocardiogram)', (CURRENT_DATE || ' 09:30:00')::TEXT, 'Medium', 'Atrial fibrillation monitoring'),
  ('IPD009', 'Arterial Blood Gas (ABG) Sampling', (CURRENT_DATE || ' 08:00:00')::TEXT, 'High', 'ARDS monitoring'),
  ('IPD009', 'Chest Physiotherapy', (CURRENT_DATE || ' 15:00:00')::TEXT, 'High', 'Pulmonary care'),
  ('IPD010', 'IV Cannulation', (CURRENT_DATE || ' 09:30:00')::TEXT, 'Medium', 'For IV fluid administration'),
  
  -- Tomorrow's procedures
  ('IPD001', 'ECG (Electrocardiogram)', (CURRENT_DATE + INTERVAL '1 day' || ' 10:00:00')::TEXT, 'Medium', 'Follow-up ECG'),
  ('IPD003', 'Chest Physiotherapy', (CURRENT_DATE + INTERVAL '1 day' || ' 14:00:00')::TEXT, 'Medium', 'Daily respiratory therapy'),
  ('IPD007', 'Suture Removal', (CURRENT_DATE + INTERVAL '5 days' || ' 11:00:00')::TEXT, 'Low', 'Post-op day 7')
) AS orders(ipd, proc_name, scheduled_time, priority, notes)
JOIN patients p ON p.ipd_number = orders.ipd
JOIN procedures proc ON proc.procedure_name = orders.proc_name;

-- ============================================================================
-- 12. INVESTIGATION ORDERS
-- ============================================================================

INSERT INTO investigation_orders (patient_id, investigation_id, scheduled_time, priority, notes)
SELECT 
  p.patient_id,
  inv.investigation_id,
  orders.scheduled_time::TIMESTAMP,
  orders.priority,
  orders.notes
FROM (VALUES
  -- Today's investigations
  ('IPD001', 'Troponin I', (CURRENT_DATE || ' 06:00:00')::TEXT, 'High', 'Cardiac marker monitoring'),
  ('IPD001', 'Complete Blood Count (CBC)', (CURRENT_DATE || ' 06:00:00')::TEXT, 'Medium', 'Routine monitoring'),
  ('IPD001', 'Lipid Profile', (CURRENT_DATE || ' 06:00:00')::TEXT, 'Medium', 'Baseline lipid panel'),
  
  ('IPD002', 'Blood Culture', (CURRENT_DATE || ' 08:00:00')::TEXT, 'High', 'Before starting antibiotics'),
  ('IPD002', 'Complete Blood Count (CBC)', (CURRENT_DATE || ' 06:00:00')::TEXT, 'High', 'Monitor sepsis'),
  ('IPD002', 'Serum Creatinine', (CURRENT_DATE || ' 06:00:00')::TEXT, 'High', 'Renal function'),
  ('IPD002', 'Serum Electrolytes', (CURRENT_DATE || ' 06:00:00')::TEXT, 'High', 'Electrolyte monitoring'),
  
  ('IPD003', 'Chest X-Ray (PA View)', (CURRENT_DATE || ' 09:00:00')::TEXT, 'Medium', 'Assess pulmonary edema'),
  ('IPD003', 'Complete Blood Count (CBC)', (CURRENT_DATE || ' 06:00:00')::TEXT, 'Medium', 'Routine monitoring'),
  ('IPD003', 'Serum Electrolytes', (CURRENT_DATE || ' 06:00:00')::TEXT, 'Medium', 'Monitor electrolytes on diuretics'),
  
  ('IPD004', 'Chest X-Ray (PA View)', (CURRENT_DATE || ' 10:00:00')::TEXT, 'Medium', 'Assess bronchiolitis'),
  ('IPD004', 'Complete Blood Count (CBC)', (CURRENT_DATE || ' 06:00:00')::TEXT, 'Medium', 'Check for infection'),
  
  ('IPD005', 'Complete Blood Count (CBC)', (CURRENT_DATE || ' 07:00:00')::TEXT, 'High', 'Pre-operative workup'),
  ('IPD005', 'Ultrasound (Specify Site)', (CURRENT_DATE || ' 08:00:00')::TEXT, 'High', 'Abdominal ultrasound for appendicitis'),
  
  ('IPD006', 'Fasting Blood Sugar (FBS)', (CURRENT_DATE || ' 06:00:00')::TEXT, 'High', 'Monitor diabetes control'),
  ('IPD006', 'HbA1c (Glycated Hemoglobin)', (CURRENT_DATE || ' 06:00:00')::TEXT, 'Medium', 'Assess long-term control'),
  ('IPD006', 'Serum Creatinine', (CURRENT_DATE || ' 06:00:00')::TEXT, 'Medium', 'Diabetic nephropathy screening'),
  
  ('IPD007', 'X-Ray (Specify Site)', (CURRENT_DATE || ' 08:00:00')::TEXT, 'Medium', 'Right femur X-ray - post-reduction'),
  ('IPD007', 'Complete Blood Count (CBC)', (CURRENT_DATE || ' 06:00:00')::TEXT, 'Medium', 'Pre-operative labs'),
  
  ('IPD008', 'Prothrombin Time (PT/INR)', (CURRENT_DATE || ' 06:00:00')::TEXT, 'High', 'Monitor anticoagulation if started'),
  ('IPD008', 'Serum Electrolytes', (CURRENT_DATE || ' 06:00:00')::TEXT, 'Medium', 'Routine monitoring'),
  
  ('IPD009', 'Arterial Blood Gas (ABG)', (CURRENT_DATE || ' 06:00:00')::TEXT, 'High', 'Monitor respiratory status'),
  ('IPD009', 'Chest X-Ray (PA View)', (CURRENT_DATE || ' 07:00:00')::TEXT, 'High', 'Daily CXR for ARDS'),
  ('IPD009', 'Complete Blood Count (CBC)', (CURRENT_DATE || ' 06:00:00')::TEXT, 'High', 'Monitor infection'),
  ('IPD009', 'Serum Creatinine', (CURRENT_DATE || ' 06:00:00')::TEXT, 'High', 'Renal function'),
  
  ('IPD010', 'Urine Routine & Microscopy', (CURRENT_DATE || ' 08:00:00')::TEXT, 'Medium', 'Rule out UTI'),
  ('IPD010', 'Serum Electrolytes', (CURRENT_DATE || ' 06:00:00')::TEXT, 'Medium', 'Monitor hydration status'),
  
  -- Tomorrow's investigations
  ('IPD001', 'Troponin I', (CURRENT_DATE + INTERVAL '1 day' || ' 06:00:00')::TEXT, 'High', '12-hour troponin'),
  ('IPD002', 'Complete Blood Count (CBC)', (CURRENT_DATE + INTERVAL '1 day' || ' 06:00:00')::TEXT, 'High', 'Daily CBC'),
  ('IPD009', 'Arterial Blood Gas (ABG)', (CURRENT_DATE + INTERVAL '1 day' || ' 06:00:00')::TEXT, 'High', 'Daily ABG monitoring')
) AS orders(ipd, inv_name, scheduled_time, priority, notes)
JOIN patients p ON p.ipd_number = orders.ipd
JOIN investigations inv ON inv.investigation_name = orders.inv_name;

-- ============================================================================
-- 13. NURSING NOTES
-- ============================================================================

INSERT INTO nursing_notes (patient_id, recorded_by, note_type, note, recorded_at)
SELECT 
  p.patient_id,
  s.staff_id,
  notes.note_type,
  notes.note,
  notes.recorded_at::TIMESTAMP
FROM (VALUES
  -- Recent nursing notes
  ('IPD001', 'Nurse Maria Garcia', 'Assessment', 'Patient alert and oriented. Denies chest pain at rest. Blood pressure 128/82 mmHg, heart rate 72 bpm regular. No signs of heart failure.', (CURRENT_DATE - INTERVAL '2 hours' || ' 14:00:00')::TEXT),
  ('IPD001', 'Nurse Maria Garcia', 'Observation', 'Patient ambulated to bathroom without assistance. Tolerated activity well without shortness of breath or chest discomfort.', (CURRENT_DATE - INTERVAL '4 hours' || ' 12:00:00')::TEXT),
  
  ('IPD002', 'Nurse Lisa Martinez', 'Assessment', 'Patient remains febrile with temperature 38.8°C. On vasopressor support. MAP maintained above 65 mmHg. Urine output 35 ml/hr. GCS 15/15.', (CURRENT_DATE - INTERVAL '1 hour' || ' 15:00:00')::TEXT),
  ('IPD002', 'Nurse Lisa Martinez', 'Intervention', 'Central line inserted by Dr. Thompson without complications. CVP monitoring initiated. Blood cultures sent before antibiotic administration.', (CURRENT_DATE - INTERVAL '5 hours' || ' 11:00:00')::TEXT),
  
  ('IPD003', 'Nurse Samantha Lewis', 'Observation', 'Patient reports feeling less short of breath after furosemide. No orthopnea. Pedal edema decreased from 3+ to 2+. Weight down 2 kg from yesterday.', (CURRENT_DATE - INTERVAL '3 hours' || ' 13:00:00')::TEXT),
  
  ('IPD004', 'Nurse Ashley Taylor', 'Assessment', 'Child active and playful. Respiratory rate 32/min, mild subcostal retractions present. Oxygen saturation 96% on room air. Taking oral fluids well.', (CURRENT_DATE - INTERVAL '2 hours' || ' 14:00:00')::TEXT),
  ('IPD004', 'Nurse Ashley Taylor', 'Progress', 'Nebulization given at 0900h. Good response noted with decreased work of breathing. Mother educated about hydration and monitoring.', (CURRENT_DATE - INTERVAL '7 hours' || ' 09:30:00')::TEXT),
  
  ('IPD005', 'Nurse Jennifer Adams', 'Assessment', 'Patient complaining of severe right lower quadrant pain, 8/10. Abdomen rigid with rebound tenderness. Nil per oral maintained. IV access secured.', (CURRENT_DATE - INTERVAL '1 hour' || ' 15:00:00')::TEXT),
  
  ('IPD006', 'Nurse Samantha Lewis', 'Observation', 'Pre-breakfast blood sugar 156 mg/dL. Insulin glargine administered as ordered. Patient educated about carbohydrate counting and portion control.', (CURRENT_DATE - INTERVAL '10 hours' || ' 06:00:00')::TEXT),
  
  ('IPD007', 'Nurse Thomas Clark', 'Assessment', 'Post-operative day 1. Vital signs stable. Pain controlled with morphine PCA. Neurovascular status of right lower extremity intact - warm, mobile, good sensation.', (CURRENT_DATE - INTERVAL '6 hours' || ' 10:00:00')::TEXT),
  ('IPD007', 'Nurse Thomas Clark', 'Intervention', 'Wound dressing changed. Surgical site clean, dry, intact with no signs of infection. Patient encouraged to do ankle pumps for DVT prevention.', (CURRENT_DATE - INTERVAL '6 hours' || ' 10:30:00')::TEXT),
  
  ('IPD008', 'Nurse Maria Garcia', 'Observation', 'Heart rate irregular, ranging 90-110 bpm. Patient denies palpitations or chest pain. Blood pressure 132/78 mmHg. ECG shows atrial fibrillation.', (CURRENT_DATE - INTERVAL '4 hours' || ' 12:00:00')::TEXT),
  
  ('IPD009', 'Nurse David Kim', 'Assessment', 'Patient intubated and sedated. Ventilator settings: PEEP 12, FiO2 60%. Lung sounds coarse bilaterally. ABG pending. Positioned prone for 12 hours.', (CURRENT_DATE - INTERVAL '2 hours' || ' 14:00:00')::TEXT),
  ('IPD009', 'Nurse David Kim', 'Handover', 'Critical patient with ARDS. On mechanical ventilation and prone positioning. Watch for hemodynamic instability. Next ABG due at 1800h.', (CURRENT_DATE - INTERVAL '30 minutes' || ' 15:30:00')::TEXT),
  
  ('IPD010', 'Nurse Michelle White', 'Assessment', 'Child appears well hydrated. No vomiting in last 4 hours. Tolerating clear liquids. One episode of loose stool. Abdomen soft, non-tender.', (CURRENT_DATE - INTERVAL '3 hours' || ' 13:00:00')::TEXT),
  ('IPD010', 'Nurse Michelle White', 'Progress', 'IV fluids running as ordered. Mother at bedside. Child resting comfortably. Plan to advance to regular diet if no further vomiting.', (CURRENT_DATE - INTERVAL '1 hour' || ' 15:00:00')::TEXT)
) AS notes(ipd, nurse_name, note_type, note, recorded_at)
JOIN patients p ON p.ipd_number = notes.ipd
JOIN staff s ON s.staff_name = notes.nurse_name;

-- ============================================================================
-- 14. VITAL SIGNS
-- ============================================================================

INSERT INTO vital_signs (patient_id, recorded_by, temperature, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation, recorded_at)
SELECT 
  p.patient_id,
  s.staff_id,
  vitals.temp,
  vitals.bp_sys,
  vitals.bp_dia,
  vitals.hr,
  vitals.rr,
  vitals.spo2,
  vitals.recorded_at::TIMESTAMP
FROM (VALUES
  -- Morning vitals (6 AM)
  ('IPD001', 'Nurse Maria Garcia', 37.1, 128, 82, 72, 16, 98, (CURRENT_DATE || ' 06:00:00')::TEXT),
  ('IPD002', 'Nurse Lisa Martinez', 38.8, 102, 65, 118, 24, 94, (CURRENT_DATE || ' 06:00:00')::TEXT),
  ('IPD003', 'Nurse Samantha Lewis', 36.9, 142, 88, 84, 20, 96, (CURRENT_DATE || ' 06:00:00')::TEXT),
  ('IPD004', 'Nurse Ashley Taylor', 37.8, 95, 60, 110, 32, 96, (CURRENT_DATE || ' 06:00:00')::TEXT),
  ('IPD005', 'Nurse Jennifer Adams', 37.6, 118, 75, 88, 18, 99, (CURRENT_DATE || ' 06:00:00')::TEXT),
  ('IPD006', 'Nurse Samantha Lewis', 36.8, 136, 82, 76, 16, 97, (CURRENT_DATE || ' 06:00:00')::TEXT),
  ('IPD007', 'Nurse Thomas Clark', 37.2, 122, 78, 80, 16, 98, (CURRENT_DATE || ' 06:00:00')::TEXT),
  ('IPD008', 'Nurse Maria Garcia', 36.7, 132, 78, 98, 18, 97, (CURRENT_DATE || ' 06:00:00')::TEXT),
  ('IPD009', 'Nurse David Kim', 38.2, 108, 68, 112, 22, 88, (CURRENT_DATE || ' 06:00:00')::TEXT),
  ('IPD010', 'Nurse Michelle White', 37.4, 102, 65, 102, 24, 98, (CURRENT_DATE || ' 06:00:00')::TEXT),
  
  -- Noon vitals (12 PM)
  ('IPD001', 'Nurse Maria Garcia', 36.9, 124, 80, 68, 14, 99, (CURRENT_DATE || ' 12:00:00')::TEXT),
  ('IPD002', 'Nurse Lisa Martinez', 38.6, 98, 62, 115, 26, 92, (CURRENT_DATE || ' 12:00:00')::TEXT),
  ('IPD003', 'Nurse Samantha Lewis', 36.8, 138, 84, 80, 18, 97, (CURRENT_DATE || ' 12:00:00')::TEXT),
  ('IPD004', 'Nurse Ashley Taylor', 37.2, 92, 58, 105, 28, 97, (CURRENT_DATE || ' 12:00:00')::TEXT),
  ('IPD006', 'Nurse Samantha Lewis', 36.7, 132, 80, 74, 16, 98, (CURRENT_DATE || ' 12:00:00')::TEXT),
  ('IPD007', 'Nurse Thomas Clark', 37.0, 120, 76, 78, 16, 99, (CURRENT_DATE || ' 12:00:00')::TEXT),
  ('IPD008', 'Nurse Maria Garcia', 36.8, 128, 76, 95, 16, 98, (CURRENT_DATE || ' 12:00:00')::TEXT),
  ('IPD009', 'Nurse David Kim', 38.4, 105, 65, 108, 24, 86, (CURRENT_DATE || ' 12:00:00')::TEXT),
  ('IPD010', 'Nurse Michelle White', 37.0, 98, 62, 98, 22, 99, (CURRENT_DATE || ' 12:00:00')::TEXT),
  
  -- Afternoon vitals (4 PM)
  ('IPD001', 'Nurse Maria Garcia', 37.0, 126, 78, 70, 16, 98, (CURRENT_DATE || ' 16:00:00')::TEXT),
  ('IPD002', 'Nurse Lisa Martinez', 38.4, 105, 68, 110, 24, 93, (CURRENT_DATE || ' 16:00:00')::TEXT),
  ('IPD009', 'Nurse David Kim', 38.1, 110, 70, 105, 22, 89, (CURRENT_DATE || ' 16:00:00')::TEXT)
) AS vitals(ipd, nurse_name, temp, bp_sys, bp_dia, hr, rr, spo2, recorded_at)
JOIN patients p ON p.ipd_number = vitals.ipd
JOIN staff s ON s.staff_name = vitals.nurse_name;

-- ============================================================================
-- SEED DATA INSERTION COMPLETE
-- ============================================================================

-- Verify data insertion
SELECT 
  'Admins' as table_name, COUNT(*) as record_count FROM admins
UNION ALL
SELECT 'Departments', COUNT(*) FROM departments
UNION ALL
SELECT 'Medications', COUNT(*) FROM medications
UNION ALL
SELECT 'Routes', COUNT(*) FROM routes_of_administration
UNION ALL
SELECT 'Procedures', COUNT(*) FROM procedures
UNION ALL
SELECT 'Investigations', COUNT(*) FROM investigations
UNION ALL
SELECT 'Staff', COUNT(*) FROM staff
UNION ALL
SELECT 'Patients', COUNT(*) FROM patients
UNION ALL
SELECT 'Patient-Staff Assignments', COUNT(*) FROM patient_staff_assignments
UNION ALL
SELECT 'Medication Orders', COUNT(*) FROM medication_orders
UNION ALL
SELECT 'Procedure Orders', COUNT(*) FROM procedure_orders
UNION ALL
SELECT 'Investigation Orders', COUNT(*) FROM investigation_orders
UNION ALL
SELECT 'Nursing Notes', COUNT(*) FROM nursing_notes
UNION ALL
SELECT 'Vital Signs', COUNT(*) FROM vital_signs
ORDER BY table_name;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- Default Admin Credentials:
--   Username: admin
--   Password: password123
--
-- This seed data includes:
--   - 3 admin users
--   - 10 departments
--   - 30 medications
--   - 9 routes of administration
--   - 15 procedures
--   - 27 investigations
--   - 26 staff members (doctors and nurses)
--   - 10 active patients
--   - Patient-staff assignments for all patients
--   - Medication orders (current and scheduled)
--   - Procedure orders (today and upcoming)
--   - Investigation orders (today and upcoming)
--   - Nursing notes (recent documentation)
--   - Vital signs (multiple readings throughout the day)
--
-- All data is realistic and represents a typical hospital scenario with:
--   - Cardiac patients
--   - ICU critical care
--   - Pediatric cases
--   - Surgical patients
--   - Medical conditions (diabetes, infections, etc.)
--
-- ============================================================================
