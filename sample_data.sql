-- Ward Watch Sample Data - Indian Patients
-- This file contains sample data for testing the Ward Watch application
-- Run this file after setting up the database schema

-- ============================================================================
-- ADMIN USERS
-- ============================================================================
-- Password for all admins: "admin123" (hashed with bcrypt)
INSERT INTO admins (admin_id, username, password_hash, full_name, email, role)
VALUES 
  ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'admin', '$2b$10$rKZLvVZJQxQYX5yQ5yQ5yO5yQ5yQ5yQ5yQ5yQ5yQ5yQ5yQ5yQ5yQ5', 'Dr. Rajesh Kumar', 'rajesh.kumar@wardwatch.com', 'admin'),
  ('b2c3d4e5-f6a7-8901-2345-678901bcdef0', 'nurse_head', '$2b$10$rKZLvVZJQxQYX5yQ5yQ5yO5yQ5yQ5yQ5yQ5yQ5yQ5yQ5yQ5yQ5yQ5', 'Sr. Priya Sharma', 'priya.sharma@wardwatch.com', 'nurse');

-- ============================================================================
-- DEPARTMENTS
-- ============================================================================
INSERT INTO departments (department_id, department_name, head_of_department)
VALUES 
  ('dept-001', 'General Medicine', 'Dr. Anjali Verma'),
  ('dept-002', 'Cardiology', 'Dr. Suresh Patel'),
  ('dept-003', 'Orthopedics', 'Dr. Vikram Singh'),
  ('dept-004', 'Pediatrics', 'Dr. Meera Reddy'),
  ('dept-005', 'Surgery', 'Dr. Arjun Nair');

-- ============================================================================
-- STAFF
-- ============================================================================
INSERT INTO staff (staff_id, staff_name, role, department_id, contact_number, shift)
VALUES 
  ('staff-001', 'Nurse Kavita Desai', 'Nurse', 'dept-001', '9876543210', 'Morning'),
  ('staff-002', 'Nurse Ravi Kumar', 'Nurse', 'dept-001', '9876543211', 'Evening'),
  ('staff-003', 'Nurse Sunita Joshi', 'Nurse', 'dept-002', '9876543212', 'Night'),
  ('staff-004', 'Nurse Amit Gupta', 'Nurse', 'dept-003', '9876543213', 'Morning'),
  ('staff-005', 'Dr. Deepak Malhotra', 'Doctor', 'dept-001', '9876543214', 'Morning'),
  ('staff-006', 'Dr. Neha Kapoor', 'Doctor', 'dept-002', '9876543215', 'Evening'),
  ('staff-007', 'Technician Rahul Sharma', 'Technician', 'dept-005', '9876543216', 'Morning'),
  ('staff-008', 'Nurse Pooja Reddy', 'Nurse', 'dept-004', '9876543217', 'Evening');

-- ============================================================================
-- PATIENTS
-- ============================================================================
INSERT INTO patients (patient_id, ipd_number, patient_name, age, gender, contact_number, address, bed_number, ward, diagnosis, admission_date, emergency_contact, is_discharged)
VALUES 
  -- Active Patients
  ('p-001', 'IPD2024001', 'Ramesh Patel', 65, 'Male', '9123456789', 'B-204, Anand Nagar, Mumbai, Maharashtra 400001', '101', 'General Ward A', 'Type 2 Diabetes with Hypertension', '2024-11-05', 'Son: Vijay Patel - 9123456790', false),
  
  ('p-002', 'IPD2024002', 'Lakshmi Iyer', 42, 'Female', '9123456791', 'Flat 302, MG Road, Bangalore, Karnataka 560001', '102', 'General Ward A', 'Acute Gastroenteritis', '2024-11-06', 'Husband: Suresh Iyer - 9123456792', false),
  
  ('p-003', 'IPD2024003', 'Mohammed Rizwan', 58, 'Male', '9123456793', '45/A, Karol Bagh, New Delhi 110005', '201', 'ICU', 'Myocardial Infarction (Heart Attack)', '2024-11-07', 'Wife: Ayesha Rizwan - 9123456794', false),
  
  ('p-004', 'IPD2024004', 'Sneha Reddy', 28, 'Female', '9123456795', 'Plot 12, Jubilee Hills, Hyderabad, Telangana 500033', '103', 'General Ward A', 'Appendicitis - Post Surgery', '2024-11-06', 'Mother: Sumitra Reddy - 9123456796', false),
  
  ('p-005', 'IPD2024005', 'Anil Kumar Singh', 71, 'Male', '9123456797', 'C-15, Rajendra Nagar, Patna, Bihar 800016', '202', 'ICU', 'Chronic Kidney Disease Stage 4', '2024-11-04', 'Son: Rajiv Singh - 9123456798', false),
  
  ('p-006', 'IPD2024006', 'Priya Chatterjee', 35, 'Female', '9123456799', '23B, Park Street, Kolkata, West Bengal 700016', '104', 'General Ward A', 'Dengue Fever', '2024-11-07', 'Husband: Abhijit Chatterjee - 9123456800', false),
  
  ('p-007', 'IPD2024007', 'Suresh Nambiar', 54, 'Male', '9123456801', 'TC 10/234, Kowdiar, Thiruvananthapuram, Kerala 695003', '301', 'Ortho Ward', 'Fracture Right Femur', '2024-11-05', 'Wife: Rekha Nambiar - 9123456802', false),
  
  ('p-008', 'IPD2024008', 'Fatima Begum', 47, 'Female', '9123456803', '78, Charminar Road, Hyderabad, Telangana 500002', '105', 'General Ward A', 'Pneumonia', '2024-11-06', 'Son: Asif Begum - 9123456804', false),
  
  ('p-009', 'IPD2024009', 'Rajendra Yadav', 60, 'Male', '9123456805', 'Village Pipraich, Gorakhpur, Uttar Pradesh 273001', '203', 'ICU', 'Cerebrovascular Accident (Stroke)', '2024-11-07', 'Son: Mukesh Yadav - 9123456806', false),
  
  ('p-010', 'IPD2024010', 'Anita Deshmukh', 38, 'Female', '9123456807', 'Flat 501, Shivaji Nagar, Pune, Maharashtra 411005', '106', 'General Ward A', 'Asthma Exacerbation', '2024-11-07', 'Husband: Prakash Deshmukh - 9123456808', false),
  
  -- Discharged Patients
  ('p-011', 'IPD2024011', 'Gopal Krishna', 52, 'Male', '9123456809', '12A, Anna Salai, Chennai, Tamil Nadu 600002', '107', 'General Ward A', 'Urinary Tract Infection', '2024-10-28', 'Wife: Lalita Krishna - 9123456810', true),
  
  ('p-012', 'IPD2024012', 'Sushma Mehta', 45, 'Female', '9123456811', 'B-67, Satellite, Ahmedabad, Gujarat 380015', '108', 'General Ward A', 'Migraine with Complications', '2024-10-30', 'Husband: Rajiv Mehta - 9123456812', true);

-- Update discharge dates for discharged patients
UPDATE patients SET discharge_date = '2024-11-02' WHERE patient_id = 'p-011';
UPDATE patients SET discharge_date = '2024-11-04' WHERE patient_id = 'p-012';

-- ============================================================================
-- MEDICATIONS
-- ============================================================================
INSERT INTO medications (medication_id, medication_name, dosage_form, strength, manufacturer)
VALUES 
  ('med-001', 'Metformin', 'Tablet', '500mg', 'Cipla Ltd'),
  ('med-002', 'Amlodipine', 'Tablet', '5mg', 'Sun Pharma'),
  ('med-003', 'Paracetamol', 'Tablet', '650mg', 'Mankind Pharma'),
  ('med-004', 'Azithromycin', 'Tablet', '500mg', 'Zydus Cadila'),
  ('med-005', 'Omeprazole', 'Capsule', '20mg', 'Dr. Reddys'),
  ('med-006', 'Atorvastatin', 'Tablet', '10mg', 'Lupin Pharma'),
  ('med-007', 'Aspirin', 'Tablet', '75mg', 'Bayer'),
  ('med-008', 'Insulin Glargine', 'Injection', '100 units/ml', 'Biocon'),
  ('med-009', 'Amoxicillin', 'Capsule', '500mg', 'Ranbaxy'),
  ('med-010', 'Levothyroxine', 'Tablet', '50mcg', 'Abbott');

-- ============================================================================
-- PROCEDURES
-- ============================================================================
INSERT INTO procedures (procedure_id, procedure_name, description, estimated_duration)
VALUES 
  ('proc-001', 'Dressing Change', 'Sterile wound dressing change', 15),
  ('proc-002', 'Blood Sugar Monitoring', 'Capillary blood glucose test', 5),
  ('proc-003', 'Vital Signs Check', 'Temperature, BP, Pulse, Respiration rate', 10),
  ('proc-004', 'IV Cannulation', 'Intravenous access placement', 10),
  ('proc-005', 'Catheterization', 'Urinary catheter insertion', 15),
  ('proc-006', 'Nebulization', 'Bronchodilator inhalation therapy', 20),
  ('proc-007', 'Physiotherapy', 'Chest or limb physiotherapy session', 30),
  ('proc-008', 'ECG', '12-lead Electrocardiogram', 10);

-- ============================================================================
-- INVESTIGATIONS
-- ============================================================================
INSERT INTO investigations (investigation_id, investigation_name, category, preparation_required)
VALUES 
  ('inv-001', 'Complete Blood Count', 'Hematology', false),
  ('inv-002', 'Liver Function Test', 'Biochemistry', true),
  ('inv-003', 'Kidney Function Test', 'Biochemistry', false),
  ('inv-004', 'Chest X-Ray', 'Radiology', false),
  ('inv-005', 'ECG', 'Cardiology', false),
  ('inv-006', 'Blood Sugar Fasting', 'Biochemistry', true),
  ('inv-007', 'Blood Sugar PP', 'Biochemistry', true),
  ('inv-008', 'HbA1c', 'Biochemistry', false),
  ('inv-009', 'Lipid Profile', 'Biochemistry', true),
  ('inv-010', 'Urine Routine', 'Pathology', false),
  ('inv-011', '2D Echo', 'Cardiology', false),
  ('inv-012', 'CT Scan Brain', 'Radiology', false);

-- ============================================================================
-- MEDICATION ORDERS
-- ============================================================================
INSERT INTO medication_orders (order_id, patient_id, medication_id, dosage, frequency, route, start_date, end_date, prescribed_by, special_instructions)
VALUES 
  -- Ramesh Patel (Diabetes)
  ('mo-001', 'p-001', 'med-001', '500mg', 'Twice Daily', 'Oral', '2024-11-05', '2024-11-15', 'staff-005', 'After meals'),
  ('mo-002', 'p-001', 'med-002', '5mg', 'Once Daily', 'Oral', '2024-11-05', '2024-11-15', 'staff-005', 'Morning before breakfast'),
  
  -- Lakshmi Iyer (Gastroenteritis)
  ('mo-003', 'p-002', 'med-005', '20mg', 'Once Daily', 'Oral', '2024-11-06', '2024-11-12', 'staff-005', 'Before breakfast'),
  
  -- Mohammed Rizwan (Heart Attack)
  ('mo-004', 'p-003', 'med-007', '75mg', 'Once Daily', 'Oral', '2024-11-07', '2024-11-21', 'staff-006', 'After breakfast'),
  ('mo-005', 'p-003', 'med-006', '10mg', 'Once Daily', 'Oral', '2024-11-07', '2024-11-21', 'staff-006', 'At bedtime'),
  
  -- Sneha Reddy (Post Surgery)
  ('mo-006', 'p-004', 'med-003', '650mg', 'Every 6 hours', 'Oral', '2024-11-06', '2024-11-10', 'staff-005', 'For pain relief'),
  ('mo-007', 'p-004', 'med-004', '500mg', 'Once Daily', 'Oral', '2024-11-06', '2024-11-11', 'staff-005', 'Antibiotic course'),
  
  -- Fatima Begum (Pneumonia)
  ('mo-008', 'p-008', 'med-009', '500mg', 'Three times daily', 'Oral', '2024-11-06', '2024-11-13', 'staff-005', 'Complete the course'),
  
  -- Anita Deshmukh (Asthma)
  ('mo-009', 'p-010', 'med-003', '650mg', 'Every 6 hours', 'Oral', '2024-11-07', '2024-11-11', 'staff-005', 'If fever persists');

-- ============================================================================
-- PROCEDURE ORDERS
-- ============================================================================
INSERT INTO procedure_orders (order_id, patient_id, procedure_id, frequency, scheduled_time, ordered_by, special_instructions)
VALUES 
  -- Daily vital checks for all patients
  ('po-001', 'p-001', 'proc-003', 'Every 4 hours', '06:00:00', 'staff-005', 'Monitor BP closely'),
  ('po-002', 'p-002', 'proc-003', 'Every 6 hours', '06:00:00', 'staff-005', NULL),
  ('po-003', 'p-003', 'proc-003', 'Every 2 hours', '06:00:00', 'staff-006', 'ICU protocol - continuous monitoring'),
  ('po-004', 'p-004', 'proc-001', 'Twice Daily', '08:00:00', 'staff-005', 'Post-surgical wound care'),
  ('po-005', 'p-005', 'proc-003', 'Every 4 hours', '06:00:00', 'staff-005', 'Monitor fluid balance'),
  ('po-006', 'p-007', 'proc-007', 'Twice Daily', '10:00:00', 'staff-004', 'Limb physiotherapy'),
  ('po-007', 'p-008', 'proc-006', 'Four times daily', '08:00:00', 'staff-005', 'Bronchodilator nebulization'),
  ('po-008', 'p-009', 'proc-003', 'Every 2 hours', '06:00:00', 'staff-005', 'Neuro observations'),
  ('po-009', 'p-010', 'proc-006', 'Every 6 hours', '08:00:00', 'staff-005', 'Salbutamol nebulization'),
  
  -- Blood sugar monitoring
  ('po-010', 'p-001', 'proc-002', 'Four times daily', '06:00:00', 'staff-005', 'Before meals and at bedtime');

-- ============================================================================
-- INVESTIGATION ORDERS
-- ============================================================================
INSERT INTO investigation_orders (order_id, patient_id, investigation_id, ordered_by, priority, special_instructions, status)
VALUES 
  -- Ramesh Patel (Diabetes monitoring)
  ('io-001', 'p-001', 'inv-006', 'staff-005', 'Routine', '8-hour fasting required', 'Scheduled'),
  ('io-002', 'p-001', 'inv-008', 'staff-005', 'Routine', NULL, 'Scheduled'),
  
  -- Mohammed Rizwan (Heart Attack follow-up)
  ('io-003', 'p-003', 'inv-005', 'staff-006', 'Urgent', 'Daily ECG', 'Completed'),
  ('io-004', 'p-003', 'inv-011', 'staff-006', 'Urgent', '2D Echo for cardiac function', 'Scheduled'),
  
  -- Anil Kumar Singh (Kidney Disease)
  ('io-005', 'p-005', 'inv-003', 'staff-005', 'Urgent', 'Daily monitoring', 'Scheduled'),
  ('io-006', 'p-005', 'inv-001', 'staff-005', 'Routine', NULL, 'Scheduled'),
  
  -- Priya Chatterjee (Dengue)
  ('io-007', 'p-006', 'inv-001', 'staff-005', 'Urgent', 'Platelet count critical', 'Completed'),
  
  -- Rajendra Yadav (Stroke)
  ('io-008', 'p-009', 'inv-012', 'staff-005', 'Urgent', 'CT Brain for stroke assessment', 'Completed'),
  
  -- Fatima Begum (Pneumonia)
  ('io-009', 'p-008', 'inv-004', 'staff-005', 'Urgent', 'Chest X-ray to assess pneumonia', 'Completed');

-- ============================================================================
-- NURSING NOTES
-- ============================================================================
INSERT INTO nursing_notes (note_id, patient_id, recorded_by, note_type, note, recorded_at)
VALUES 
  ('nn-001', 'p-001', 'staff-001', 'General', 'Patient stable. Blood sugar levels improving with medication. Vitals within normal limits.', '2024-11-07 08:30:00'),
  
  ('nn-002', 'p-002', 'staff-001', 'General', 'Patient complaining of mild abdominal discomfort. Given medication as prescribed. Advised bed rest.', '2024-11-07 09:15:00'),
  
  ('nn-003', 'p-003', 'staff-003', 'Critical', 'Patient in ICU. Chest pain subsided. ECG shows improvement. Continuous cardiac monitoring ongoing.', '2024-11-07 22:00:00'),
  
  ('nn-004', 'p-004', 'staff-001', 'Post-Operative', 'Post-operative day 1. Surgical wound clean and dry. Dressing changed. Patient tolerating oral feeds.', '2024-11-07 10:00:00'),
  
  ('nn-005', 'p-005', 'staff-003', 'Critical', 'Patient on dialysis schedule. Fluid intake and output monitored. Family counseled about kidney disease management.', '2024-11-07 20:30:00'),
  
  ('nn-006', 'p-006', 'staff-001', 'General', 'Dengue protocol followed. Platelet count 95,000. Patient advised rest and adequate fluid intake. Fever reducing.', '2024-11-07 11:00:00'),
  
  ('nn-007', 'p-007', 'staff-004', 'General', 'Physiotherapy session completed. Patient showing good progress with limb movements. Pain managed with prescribed medication.', '2024-11-07 14:00:00'),
  
  ('nn-008', 'p-008', 'staff-002', 'General', 'Nebulization given. Patient breathing comfortably. Oxygen saturation 96%. Antibiotics continued.', '2024-11-07 16:00:00'),
  
  ('nn-009', 'p-009', 'staff-003', 'Critical', 'Stroke patient. Right-sided weakness persists. Neuro observations every 2 hours. Family updated on condition.', '2024-11-07 21:00:00'),
  
  ('nn-010', 'p-010', 'staff-002', 'General', 'Asthma exacerbation controlled. Peak flow improving. Nebulization schedule maintained. Patient comfortable.', '2024-11-07 17:30:00'),
  
  ('nn-011', 'p-001', 'staff-002', 'Vitals', 'BP: 135/85, Pulse: 78, Temp: 98.2°F, RR: 18. Blood sugar (pre-lunch): 142 mg/dL', '2024-11-07 12:00:00'),
  
  ('nn-012', 'p-003', 'staff-003', 'Vitals', 'BP: 128/82, Pulse: 72, Temp: 98.6°F, RR: 16. ECG normal sinus rhythm. Patient stable.', '2024-11-07 23:00:00');

-- ============================================================================
-- TREATMENT TIMELINE ENTRIES (Recent scheduled treatments)
-- ============================================================================
INSERT INTO treatment_timeline (timeline_id, patient_id, treatment_type, treatment_name, scheduled_time, status, priority, administered_by, notes)
VALUES 
  -- Today's scheduled treatments (2024-11-08)
  ('tt-001', 'p-001', 'medication', 'Metformin 500mg', '2024-11-08 08:00:00', 'Pending', 'Normal', NULL, 'After breakfast'),
  ('tt-002', 'p-001', 'medication', 'Amlodipine 5mg', '2024-11-08 07:00:00', 'Pending', 'Normal', NULL, 'Before breakfast'),
  ('tt-003', 'p-001', 'procedure', 'Blood Sugar Monitoring', '2024-11-08 06:30:00', 'Pending', 'Normal', NULL, NULL),
  ('tt-004', 'p-001', 'procedure', 'Vital Signs Check', '2024-11-08 06:00:00', 'Pending', 'Normal', NULL, NULL),
  
  ('tt-005', 'p-003', 'procedure', 'Vital Signs Check', '2024-11-08 06:00:00', 'Pending', 'High', NULL, 'ICU - Every 2 hours'),
  ('tt-006', 'p-003', 'medication', 'Aspirin 75mg', '2024-11-08 08:00:00', 'Pending', 'High', NULL, 'After breakfast'),
  ('tt-007', 'p-003', 'investigation', '2D Echo', '2024-11-08 10:00:00', 'Scheduled', 'High', NULL, 'Cardiac function assessment'),
  
  ('tt-008', 'p-004', 'procedure', 'Dressing Change', '2024-11-08 08:00:00', 'Pending', 'Normal', NULL, 'Surgical wound'),
  ('tt-009', 'p-004', 'medication', 'Paracetamol 650mg', '2024-11-08 08:00:00', 'Pending', 'Normal', NULL, 'For pain'),
  
  ('tt-010', 'p-007', 'procedure', 'Physiotherapy', '2024-11-08 10:00:00', 'Pending', 'Normal', NULL, 'Limb physiotherapy'),
  ('tt-011', 'p-008', 'procedure', 'Nebulization', '2024-11-08 08:00:00', 'Pending', 'Normal', NULL, 'Bronchodilator'),
  ('tt-012', 'p-010', 'procedure', 'Nebulization', '2024-11-08 08:00:00', 'Pending', 'Normal', NULL, 'Salbutamol'),
  
  -- Yesterday's completed treatments (2024-11-07)
  ('tt-013', 'p-001', 'medication', 'Metformin 500mg', '2024-11-07 20:00:00', 'Completed', 'Normal', 'staff-002', 'After dinner'),
  ('tt-014', 'p-003', 'procedure', 'ECG', '2024-11-07 18:00:00', 'Completed', 'High', 'staff-007', 'Results normal'),
  ('tt-015', 'p-008', 'investigation', 'Chest X-Ray', '2024-11-07 15:00:00', 'Completed', 'Urgent', 'staff-007', 'Pneumonia confirmed');

-- ============================================================================
-- SUMMARY STATISTICS
-- ============================================================================

-- Total Active Patients: 10
-- Total Discharged Patients: 2
-- Departments: 5
-- Staff Members: 8
-- Medications in Formulary: 10
-- Procedures Available: 8
-- Investigations Available: 12

-- Patient Distribution:
-- General Ward A: 5 patients
-- ICU: 3 patients
-- Ortho Ward: 1 patient

-- Common Diagnoses:
-- Diabetes, Gastroenteritis, Heart Attack, Appendicitis, Kidney Disease
-- Dengue, Fracture, Pneumonia, Stroke, Asthma

SELECT 'Sample data inserted successfully!' as message;
