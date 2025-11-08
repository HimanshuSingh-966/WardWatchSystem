-- Ward Watch Sample Data - Indian Patients
-- This file contains realistic sample data for testing the Ward Watch application
-- Ensure the database schema (server/db/schema.sql) is created before running this file

-- ============================================================================
-- DEPARTMENTS
-- ============================================================================
INSERT INTO departments (department_id, department_name, created_at, updated_at)
VALUES 
  ('a1b2c3d4-0001-4000-8000-000000000001', 'General Medicine', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Cardiology', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'Orthopedics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- STAFF
-- ============================================================================
INSERT INTO staff (staff_id, staff_name, role, department_id, contact_number, email, created_at, updated_at)
VALUES 
  ('b1b2c3d4-0002-4000-8000-000000000001', 'Nurse Kavita Desai', 'Nurse', 'a1b2c3d4-0001-4000-8000-000000000001', '9876543210', 'kavita.desai@hospital.in', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('b1b2c3d4-0002-4000-8000-000000000002', 'Nurse Ravi Kumar', 'Nurse', 'a1b2c3d4-0001-4000-8000-000000000001', '9876543211', 'ravi.kumar@hospital.in', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('b1b2c3d4-0002-4000-8000-000000000003', 'Dr. Deepak Malhotra', 'Doctor', 'a1b2c3d4-0001-4000-8000-000000000001', '9876543214', 'deepak.m@hospital.in', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('b1b2c3d4-0002-4000-8000-000000000004', 'Dr. Neha Kapoor', 'Doctor', 'a1b2c3d4-0001-4000-8000-000000000002', '9876543215', 'neha.k@hospital.in', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('b1b2c3d4-0002-4000-8000-000000000005', 'Nurse Sunita Joshi', 'Nurse', 'a1b2c3d4-0001-4000-8000-000000000002', '9876543212', 'sunita.j@hospital.in', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- PATIENTS - Active Admissions
-- ============================================================================
INSERT INTO patients (patient_id, ipd_number, patient_name, age, gender, contact_number, address, bed_number, ward, diagnosis, admission_date, is_discharged, discharge_date, emergency_contact, created_at, updated_at)
VALUES 
  -- Active Patients
  ('c1c2c3d4-0003-4000-8000-000000000001', 'IPD2024001', 'Ramesh Patel', 65, 'M', '9123456789', 'B-204, Anand Nagar, Mumbai, Maharashtra 400001', '101', 'General Ward A', 'Type 2 Diabetes with Hypertension', '2024-11-05', false, NULL, 'Son: Vijay Patel - 9123456790', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('c1c2c3d4-0003-4000-8000-000000000002', 'IPD2024002', 'Lakshmi Iyer', 42, 'F', '9123456791', 'Flat 302, MG Road, Bangalore, Karnataka 560001', '102', 'General Ward A', 'Acute Gastroenteritis', '2024-11-06', false, NULL, 'Husband: Suresh Iyer - 9123456792', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('c1c2c3d4-0003-4000-8000-000000000003', 'IPD2024003', 'Mohammed Rizwan', 58, 'M', '9123456793', '45/A, Karol Bagh, New Delhi 110005', '201', 'ICU', 'Myocardial Infarction (Heart Attack)', '2024-11-07', false, NULL, 'Wife: Ayesha Rizwan - 9123456794', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('c1c2c3d4-0003-4000-8000-000000000004', 'IPD2024004', 'Sneha Reddy', 28, 'F', '9123456795', 'Plot 12, Jubilee Hills, Hyderabad, Telangana 500033', '103', 'General Ward A', 'Appendicitis - Post Surgery', '2024-11-06', false, NULL, 'Mother: Sumitra Reddy - 9123456796', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('c1c2c3d4-0003-4000-8000-000000000005', 'IPD2024005', 'Priya Chatterjee', 35, 'F', '9123456799', '23B, Park Street, Kolkata, West Bengal 700016', '104', 'General Ward A', 'Dengue Fever', '2024-11-07', false, NULL, 'Husband: Abhijit Chatterjee - 9123456800', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('c1c2c3d4-0003-4000-8000-000000000006', 'IPD2024006', 'Suresh Nambiar', 54, 'M', '9123456801', 'TC 10/234, Kowdiar, Thiruvananthapuram, Kerala 695003', '301', 'Ortho Ward', 'Fracture Right Femur', '2024-11-05', false, NULL, 'Wife: Rekha Nambiar - 9123456802', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('c1c2c3d4-0003-4000-8000-000000000007', 'IPD2024007', 'Fatima Begum', 47, 'F', '9123456803', '78, Charminar Road, Hyderabad, Telangana 500002', '105', 'General Ward A', 'Pneumonia', '2024-11-06', false, NULL, 'Son: Asif Begum - 9123456804', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('c1c2c3d4-0003-4000-8000-000000000008', 'IPD2024008', 'Anita Deshmukh', 38, 'F', '9123456807', 'Flat 501, Shivaji Nagar, Pune, Maharashtra 411005', '106', 'General Ward A', 'Asthma Exacerbation', '2024-11-07', false, NULL, 'Husband: Prakash Deshmukh - 9123456808', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Discharged Patients
  ('c1c2c3d4-0003-4000-8000-000000000009', 'IPD2024009', 'Gopal Krishna', 52, 'M', '9123456809', '12A, Anna Salai, Chennai, Tamil Nadu 600002', '107', 'General Ward A', 'Urinary Tract Infection', '2024-10-28', true, '2024-11-02', 'Wife: Lalita Krishna - 9123456810', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('c1c2c3d4-0003-4000-8000-000000000010', 'IPD2024010', 'Sushma Mehta', 45, 'F', '9123456811', 'B-67, Satellite, Ahmedabad, Gujarat 380015', '108', 'General Ward A', 'Migraine with Complications', '2024-10-30', true, '2024-11-04', 'Husband: Rajiv Mehta - 9123456812', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- MEDICATIONS
-- ============================================================================
INSERT INTO medications (medication_id, medication_name, dosage, form, created_at, updated_at)
VALUES 
  ('d1d2d3d4-0004-4000-8000-000000000001', 'Metformin', '500mg', 'Tablet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d1d2d3d4-0004-4000-8000-000000000002', 'Amlodipine', '5mg', 'Tablet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d1d2d3d4-0004-4000-8000-000000000003', 'Paracetamol', '650mg', 'Tablet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d1d2d3d4-0004-4000-8000-000000000004', 'Azithromycin', '500mg', 'Tablet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d1d2d3d4-0004-4000-8000-000000000005', 'Omeprazole', '20mg', 'Capsule', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d1d2d3d4-0004-4000-8000-000000000006', 'Atorvastatin', '10mg', 'Tablet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d1d2d3d4-0004-4000-8000-000000000007', 'Aspirin', '75mg', 'Tablet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d1d2d3d4-0004-4000-8000-000000000008', 'Amoxicillin', '500mg', 'Capsule', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- ROUTES OF ADMINISTRATION
-- ============================================================================
INSERT INTO routes_of_administration (route_id, route_name, created_at, updated_at)
VALUES 
  ('e1e2e3e4-0005-4000-8000-000000000001', 'Oral', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('e1e2e3e4-0005-4000-8000-000000000002', 'Intravenous', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('e1e2e3e4-0005-4000-8000-000000000003', 'Intramuscular', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('e1e2e3e4-0005-4000-8000-000000000004', 'Subcutaneous', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- PROCEDURES
-- ============================================================================
INSERT INTO procedures (procedure_id, procedure_name, description, created_at, updated_at)
VALUES 
  ('f1f2f3f4-0006-4000-8000-000000000001', 'Dressing Change', 'Sterile wound dressing change', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('f1f2f3f4-0006-4000-8000-000000000002', 'Blood Sugar Monitoring', 'Capillary blood glucose test', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('f1f2f3f4-0006-4000-8000-000000000003', 'Vital Signs Check', 'Temperature, BP, Pulse, Respiration rate', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('f1f2f3f4-0006-4000-8000-000000000004', 'IV Cannulation', 'Intravenous access placement', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('f1f2f3f4-0006-4000-8000-000000000005', 'Nebulization', 'Bronchodilator inhalation therapy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('f1f2f3f4-0006-4000-8000-000000000006', 'Physiotherapy', 'Chest or limb physiotherapy session', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- INVESTIGATIONS
-- ============================================================================
INSERT INTO investigations (investigation_id, investigation_name, description, normal_range, created_at, updated_at)
VALUES 
  ('g1g2g3g4-0007-4000-8000-000000000001', 'Complete Blood Count', 'CBC with differential count', 'WBC: 4000-11000/μL, RBC: 4.5-5.5M/μL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('g1g2g3g4-0007-4000-8000-000000000002', 'Liver Function Test', 'LFT panel', 'ALT: 7-56 U/L, AST: 10-40 U/L', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('g1g2g3g4-0007-4000-8000-000000000003', 'Kidney Function Test', 'RFT with creatinine', 'Creatinine: 0.7-1.3 mg/dL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('g1g2g3g4-0007-4000-8000-000000000004', 'Chest X-Ray', 'PA view chest radiograph', 'N/A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('g1g2g3g4-0007-4000-8000-000000000005', 'ECG', '12-lead Electrocardiogram', 'Normal sinus rhythm', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('g1g2g3g4-0007-4000-8000-000000000006', 'Blood Sugar Fasting', 'FBS test', '70-100 mg/dL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('g1g2g3g4-0007-4000-8000-000000000007', 'HbA1c', 'Glycated hemoglobin', '4-5.6%', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- NURSING NOTES
-- ============================================================================
INSERT INTO nursing_notes (note_id, patient_id, recorded_by, note_type, note, recorded_at, created_at, updated_at)
VALUES 
  ('h1h2h3h4-0008-4000-8000-000000000001', 'c1c2c3d4-0003-4000-8000-000000000001', 'b1b2c3d4-0002-4000-8000-000000000001', 'General', 'Patient stable. Blood sugar levels improving with medication. Vitals within normal limits.', '2024-11-07 08:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('h1h2h3h4-0008-4000-8000-000000000002', 'c1c2c3d4-0003-4000-8000-000000000002', 'b1b2c3d4-0002-4000-8000-000000000001', 'General', 'Patient complaining of mild abdominal discomfort. Given medication as prescribed. Advised bed rest.', '2024-11-07 09:15:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('h1h2h3h4-0008-4000-8000-000000000003', 'c1c2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0002-4000-8000-000000000005', 'Critical', 'Patient in ICU. Chest pain subsided. ECG shows improvement. Continuous cardiac monitoring ongoing.', '2024-11-07 22:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('h1h2h3h4-0008-4000-8000-000000000004', 'c1c2c3d4-0003-4000-8000-000000000004', 'b1b2c3d4-0002-4000-8000-000000000001', 'Post-Operative', 'Post-operative day 1. Surgical wound clean and dry. Dressing changed. Patient tolerating oral feeds.', '2024-11-07 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('h1h2h3h4-0008-4000-8000-000000000005', 'c1c2c3d4-0003-4000-8000-000000000005', 'b1b2c3d4-0002-4000-8000-000000000001', 'General', 'Dengue protocol followed. Platelet count stable. Patient advised rest and adequate fluid intake. Fever reducing.', '2024-11-07 11:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('h1h2h3h4-0008-4000-8000-000000000006', 'c1c2c3d4-0003-4000-8000-000000000007', 'b1b2c3d4-0002-4000-8000-000000000002', 'General', 'Nebulization given. Patient breathing comfortably. Oxygen saturation 96%. Antibiotics continued.', '2024-11-07 16:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('h1h2h3h4-0008-4000-8000-000000000007', 'c1c2c3d4-0003-4000-8000-000000000008', 'b1b2c3d4-0002-4000-8000-000000000002', 'General', 'Asthma exacerbation controlled. Peak flow improving. Nebulization schedule maintained. Patient comfortable.', '2024-11-07 17:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('h1h2h3h4-0008-4000-8000-000000000008', 'c1c2c3d4-0003-4000-8000-000000000001', 'b1b2c3d4-0002-4000-8000-000000000002', 'Vitals', 'BP: 135/85, Pulse: 78, Temp: 98.2°F, RR: 18. Blood sugar (pre-lunch): 142 mg/dL', '2024-11-07 12:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- MEDICATION ORDERS
-- ============================================================================
INSERT INTO medication_orders (order_id, patient_id, medication_id, route_id, scheduled_time, frequency, start_date, end_date, dosage_amount, priority, is_completed, completed_at, completed_by, notes, is_active, created_by, created_at, updated_at)
VALUES 
  -- Ramesh Patel (Diabetes)
  ('mo-00001-0000-4000-8000-000000000001', 'c1c2c3d4-0003-4000-8000-000000000001', 'd1d2d3d4-0004-4000-8000-000000000001', 'e1e2e3e4-0005-4000-8000-000000000001', '08:00:00', 'Twice Daily', '2024-11-05', '2024-11-15', '500mg', 'Medium', false, NULL, NULL, 'After meals', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('mo-00001-0000-4000-8000-000000000002', 'c1c2c3d4-0003-4000-8000-000000000001', 'd1d2d3d4-0004-4000-8000-000000000002', 'e1e2e3e4-0005-4000-8000-000000000001', '07:00:00', 'Once Daily', '2024-11-05', '2024-11-15', '5mg', 'Medium', false, NULL, NULL, 'Morning before breakfast', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Lakshmi Iyer (Gastroenteritis)
  ('mo-00001-0000-4000-8000-000000000003', 'c1c2c3d4-0003-4000-8000-000000000002', 'd1d2d3d4-0004-4000-8000-000000000005', 'e1e2e3e4-0005-4000-8000-000000000001', '07:00:00', 'Once Daily', '2024-11-06', '2024-11-12', '20mg', 'Medium', false, NULL, NULL, 'Before breakfast', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Mohammed Rizwan (Heart Attack)
  ('mo-00001-0000-4000-8000-000000000004', 'c1c2c3d4-0003-4000-8000-000000000003', 'd1d2d3d4-0004-4000-8000-000000000007', 'e1e2e3e4-0005-4000-8000-000000000001', '08:00:00', 'Once Daily', '2024-11-07', '2024-11-21', '75mg', 'High', false, NULL, NULL, 'After breakfast', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('mo-00001-0000-4000-8000-000000000005', 'c1c2c3d4-0003-4000-8000-000000000003', 'd1d2d3d4-0004-4000-8000-000000000006', 'e1e2e3e4-0005-4000-8000-000000000001', '21:00:00', 'Once Daily', '2024-11-07', '2024-11-21', '10mg', 'High', false, NULL, NULL, 'At bedtime', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Sneha Reddy (Post Surgery)
  ('mo-00001-0000-4000-8000-000000000006', 'c1c2c3d4-0003-4000-8000-000000000004', 'd1d2d3d4-0004-4000-8000-000000000003', 'e1e2e3e4-0005-4000-8000-000000000001', '08:00:00', 'Every 6 hours', '2024-11-06', '2024-11-10', '650mg', 'Medium', false, NULL, NULL, 'For pain relief', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Fatima Begum (Pneumonia)
  ('mo-00001-0000-4000-8000-000000000007', 'c1c2c3d4-0003-4000-8000-000000000007', 'd1d2d3d4-0004-4000-8000-000000000008', 'e1e2e3e4-0005-4000-8000-000000000001', '08:00:00', 'Three times daily', '2024-11-06', '2024-11-13', '500mg', 'Medium', false, NULL, NULL, 'Complete the course', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- PROCEDURE ORDERS
-- ============================================================================
INSERT INTO procedure_orders (order_id, patient_id, procedure_id, scheduled_time, priority, is_completed, completed_at, completed_by, notes, is_active, created_by, created_at, updated_at)
VALUES 
  -- Vital checks for patients
  ('po-00001-0000-4000-8000-000000000001', 'c1c2c3d4-0003-4000-8000-000000000001', 'f1f2f3f4-0006-4000-8000-000000000003', '2024-11-08 06:00:00', 'Medium', false, NULL, NULL, 'Monitor BP closely', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('po-00001-0000-4000-8000-000000000002', 'c1c2c3d4-0003-4000-8000-000000000003', 'f1f2f3f4-0006-4000-8000-000000000003', '2024-11-08 06:00:00', 'High', false, NULL, NULL, 'ICU protocol - continuous monitoring', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('po-00001-0000-4000-8000-000000000003', 'c1c2c3d4-0003-4000-8000-000000000004', 'f1f2f3f4-0006-4000-8000-000000000001', '2024-11-08 08:00:00', 'Medium', false, NULL, NULL, 'Post-surgical wound care', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('po-00001-0000-4000-8000-000000000004', 'c1c2c3d4-0003-4000-8000-000000000006', 'f1f2f3f4-0006-4000-8000-000000000006', '2024-11-08 10:00:00', 'Medium', false, NULL, NULL, 'Limb physiotherapy', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('po-00001-0000-4000-8000-000000000005', 'c1c2c3d4-0003-4000-8000-000000000007', 'f1f2f3f4-0006-4000-8000-000000000005', '2024-11-08 08:00:00', 'Medium', false, NULL, NULL, 'Bronchodilator nebulization', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('po-00001-0000-4000-8000-000000000006', 'c1c2c3d4-0003-4000-8000-000000000008', 'f1f2f3f4-0006-4000-8000-000000000005', '2024-11-08 08:00:00', 'Medium', false, NULL, NULL, 'Salbutamol nebulization', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Blood sugar monitoring
  ('po-00001-0000-4000-8000-000000000007', 'c1c2c3d4-0003-4000-8000-000000000001', 'f1f2f3f4-0006-4000-8000-000000000002', '2024-11-08 06:30:00', 'Medium', false, NULL, NULL, 'Before meals and at bedtime', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================================================
-- INVESTIGATION ORDERS
-- ============================================================================
INSERT INTO investigation_orders (order_id, patient_id, investigation_id, scheduled_time, priority, is_completed, completed_at, completed_by, result_value, notes, is_active, created_by, created_at, updated_at)
VALUES 
  ('io-00001-0000-4000-8000-000000000001', 'c1c2c3d4-0003-4000-8000-000000000001', 'g1g2g3g4-0007-4000-8000-000000000006', '2024-11-08 07:00:00', 'Medium', false, NULL, NULL, NULL, '8-hour fasting required', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('io-00001-0000-4000-8000-000000000002', 'c1c2c3d4-0003-4000-8000-000000000001', 'g1g2g3g4-0007-4000-8000-000000000007', '2024-11-08 07:00:00', 'Medium', false, NULL, NULL, NULL, 'HbA1c for diabetes monitoring', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('io-00001-0000-4000-8000-000000000003', 'c1c2c3d4-0003-4000-8000-000000000003', 'g1g2g3g4-0007-4000-8000-000000000005', '2024-11-08 09:00:00', 'High', false, NULL, NULL, NULL, 'Daily ECG for cardiac monitoring', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('io-00001-0000-4000-8000-000000000004', 'c1c2c3d4-0003-4000-8000-000000000005', 'g1g2g3g4-0007-4000-8000-000000000001', '2024-11-08 07:00:00', 'High', false, NULL, NULL, NULL, 'Platelet count monitoring for dengue', true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  ('io-00001-0000-4000-8000-000000000005', 'c1c2c3d4-0003-4000-8000-000000000007', 'g1g2g3g4-0007-4000-8000-000000000004', '2024-11-07 14:00:00', 'High', true, '2024-11-07 15:30:00', NULL, 'Bilateral infiltrates seen', 'Chest X-ray confirms pneumonia', false, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT 'Sample data for Ward Watch inserted successfully!' as message;
SELECT 'Total Active Patients: 8, Discharged: 2' as summary;
