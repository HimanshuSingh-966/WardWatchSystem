-- Ward Watch Database Schema
-- PostgreSQL Schema Definition

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CORE TABLES
-- ============================================================

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  contact_number VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  department_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  staff_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Doctor', 'Nurse')),
  department_id UUID REFERENCES departments(department_id),
  contact_number VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ipd_number VARCHAR(50) NOT NULL UNIQUE,
  patient_name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(1) NOT NULL CHECK (gender IN ('M', 'F', 'O')),
  contact_number VARCHAR(50),
  address TEXT,
  bed_number VARCHAR(50) NOT NULL,
  ward VARCHAR(100) NOT NULL,
  diagnosis TEXT NOT NULL,
  admission_date DATE NOT NULL,
  is_discharged BOOLEAN DEFAULT false,
  discharge_date DATE,
  emergency_contact VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MASTER DATA TABLES
-- ============================================================

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
  medication_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  form VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes of Administration table
CREATE TABLE IF NOT EXISTS routes_of_administration (
  route_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Procedures table
CREATE TABLE IF NOT EXISTS procedures (
  procedure_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investigations table
CREATE TABLE IF NOT EXISTS investigations (
  investigation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investigation_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  normal_range VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ORDERS & TRACKING TABLES
-- ============================================================

-- Medication Orders table
CREATE TABLE IF NOT EXISTS medication_orders (
  order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  medication_id UUID NOT NULL REFERENCES medications(medication_id),
  route_id UUID REFERENCES routes_of_administration(route_id),
  scheduled_time TIME NOT NULL,
  frequency VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE,
  dosage_amount VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  completed_by UUID REFERENCES admins(admin_id),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admins(admin_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Procedure Orders table
CREATE TABLE IF NOT EXISTS procedure_orders (
  order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  procedure_id UUID NOT NULL REFERENCES procedures(procedure_id),
  scheduled_time TIMESTAMP NOT NULL,
  priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  completed_by UUID REFERENCES admins(admin_id),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admins(admin_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investigation Orders table
CREATE TABLE IF NOT EXISTS investigation_orders (
  order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  investigation_id UUID NOT NULL REFERENCES investigations(investigation_id),
  scheduled_time TIMESTAMP NOT NULL,
  priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  completed_by UUID REFERENCES admins(admin_id),
  result_value VARCHAR(255),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admins(admin_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nursing Notes table
CREATE TABLE IF NOT EXISTS nursing_notes (
  note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  recorded_by UUID NOT NULL REFERENCES staff(staff_id),
  note_type VARCHAR(100) NOT NULL,
  note TEXT NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vital Signs table
CREATE TABLE IF NOT EXISTS vital_signs (
  vital_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  recorded_by UUID NOT NULL REFERENCES staff(staff_id),
  temperature DECIMAL(4,1),
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  respiratory_rate INTEGER,
  oxygen_saturation INTEGER,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- HISTORY & NOTIFICATIONS TABLES
-- ============================================================

-- Treatment History table
CREATE TABLE IF NOT EXISTS treatment_history (
  history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(patient_id),
  treatment_type VARCHAR(50) NOT NULL CHECK (treatment_type IN ('medication', 'procedure', 'investigation')),
  order_id UUID NOT NULL,
  treatment_name VARCHAR(255) NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  completed_at TIMESTAMP NOT NULL,
  completed_by UUID NOT NULL REFERENCES admins(admin_id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification Queue table
CREATE TABLE IF NOT EXISTS notification_queue (
  notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(patient_id),
  treatment_type VARCHAR(50) NOT NULL CHECK (treatment_type IN ('medication', 'procedure', 'investigation')),
  order_id UUID NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  message TEXT NOT NULL,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES admins(admin_id),
  acknowledged_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Staff Assignments table (many-to-many)
CREATE TABLE IF NOT EXISTS patient_staff_assignments (
  assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(staff_id) ON DELETE CASCADE,
  assignment_role VARCHAR(50) NOT NULL CHECK (assignment_role IN ('Doctor', 'Nurse')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(patient_id, assignment_role)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_patients_ipd ON patients(ipd_number);
CREATE INDEX IF NOT EXISTS idx_patients_discharged ON patients(is_discharged);
CREATE INDEX IF NOT EXISTS idx_patients_ward ON patients(ward);
CREATE INDEX IF NOT EXISTS idx_patients_admission ON patients(admission_date);

CREATE INDEX IF NOT EXISTS idx_medication_orders_patient ON medication_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_medication_orders_scheduled ON medication_orders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_medication_orders_active ON medication_orders(is_active);
CREATE INDEX IF NOT EXISTS idx_medication_orders_completed ON medication_orders(is_completed);

CREATE INDEX IF NOT EXISTS idx_procedure_orders_patient ON procedure_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_procedure_orders_scheduled ON procedure_orders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_procedure_orders_active ON procedure_orders(is_active);

CREATE INDEX IF NOT EXISTS idx_investigation_orders_patient ON investigation_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_investigation_orders_scheduled ON investigation_orders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_investigation_orders_active ON investigation_orders(is_active);

CREATE INDEX IF NOT EXISTS idx_nursing_notes_patient ON nursing_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_nursing_notes_recorded ON nursing_notes(recorded_at);

CREATE INDEX IF NOT EXISTS idx_vital_signs_patient ON vital_signs(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_recorded ON vital_signs(recorded_at);

CREATE INDEX IF NOT EXISTS idx_notifications_acknowledged ON notification_queue(is_acknowledged);
CREATE INDEX IF NOT EXISTS idx_notifications_patient ON notification_queue(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notification_queue(scheduled_time);

CREATE INDEX IF NOT EXISTS idx_treatment_history_patient ON treatment_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_history_type ON treatment_history(treatment_type);

CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department_id);

CREATE INDEX IF NOT EXISTS idx_patient_staff_patient ON patient_staff_assignments(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_staff_staff ON patient_staff_assignments(staff_id);

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_medications_updated_at ON medications;
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_routes_updated_at ON routes_of_administration;
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes_of_administration FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_procedures_updated_at ON procedures;
CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_investigations_updated_at ON investigations;
CREATE TRIGGER update_investigations_updated_at BEFORE UPDATE ON investigations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_medication_orders_updated_at ON medication_orders;
CREATE TRIGGER update_medication_orders_updated_at BEFORE UPDATE ON medication_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_procedure_orders_updated_at ON procedure_orders;
CREATE TRIGGER update_procedure_orders_updated_at BEFORE UPDATE ON procedure_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_investigation_orders_updated_at ON investigation_orders;
CREATE TRIGGER update_investigation_orders_updated_at BEFORE UPDATE ON investigation_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_nursing_notes_updated_at ON nursing_notes;
CREATE TRIGGER update_nursing_notes_updated_at BEFORE UPDATE ON nursing_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patient_staff_assignments_updated_at ON patient_staff_assignments;
CREATE TRIGGER update_patient_staff_assignments_updated_at BEFORE UPDATE ON patient_staff_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TREATMENT HISTORY AUTO-TRACKING
-- ============================================================

-- Function to save completed medications to history
CREATE OR REPLACE FUNCTION save_medication_to_history()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = true AND (OLD.is_completed = false OR OLD.is_completed IS NULL) THEN
        INSERT INTO treatment_history (
            patient_id,
            treatment_type,
            order_id,
            treatment_name,
            scheduled_time,
            completed_at,
            completed_by,
            notes
        )
        SELECT 
            NEW.patient_id,
            'medication',
            NEW.order_id,
            CONCAT(m.medication_name, ' ', COALESCE(NEW.dosage_amount, m.dosage), ' ', COALESCE(r.route_name, '')),
            CONCAT(NEW.start_date, ' ', NEW.scheduled_time)::TIMESTAMP,
            NEW.completed_at,
            NEW.completed_by,
            NEW.notes
        FROM medications m
        LEFT JOIN routes_of_administration r ON r.route_id = NEW.route_id
        WHERE m.medication_id = NEW.medication_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to save completed procedures to history
CREATE OR REPLACE FUNCTION save_procedure_to_history()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = true AND (OLD.is_completed = false OR OLD.is_completed IS NULL) THEN
        INSERT INTO treatment_history (
            patient_id,
            treatment_type,
            order_id,
            treatment_name,
            scheduled_time,
            completed_at,
            completed_by,
            notes
        )
        SELECT 
            NEW.patient_id,
            'procedure',
            NEW.order_id,
            p.procedure_name,
            NEW.scheduled_time,
            NEW.completed_at,
            NEW.completed_by,
            NEW.notes
        FROM procedures p
        WHERE p.procedure_id = NEW.procedure_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to save completed investigations to history
CREATE OR REPLACE FUNCTION save_investigation_to_history()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = true AND (OLD.is_completed = false OR OLD.is_completed IS NULL) THEN
        INSERT INTO treatment_history (
            patient_id,
            treatment_type,
            order_id,
            treatment_name,
            scheduled_time,
            completed_at,
            completed_by,
            notes
        )
        SELECT 
            NEW.patient_id,
            'investigation',
            NEW.order_id,
            CONCAT(i.investigation_name, COALESCE(' - Result: ' || NEW.result_value, '')),
            NEW.scheduled_time,
            NEW.completed_at,
            NEW.completed_by,
            NEW.notes
        FROM investigations i
        WHERE i.investigation_id = NEW.investigation_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply history tracking triggers
DROP TRIGGER IF EXISTS medication_order_completion ON medication_orders;
CREATE TRIGGER medication_order_completion AFTER UPDATE ON medication_orders FOR EACH ROW EXECUTE FUNCTION save_medication_to_history();

DROP TRIGGER IF EXISTS procedure_order_completion ON procedure_orders;
CREATE TRIGGER procedure_order_completion AFTER UPDATE ON procedure_orders FOR EACH ROW EXECUTE FUNCTION save_procedure_to_history();

DROP TRIGGER IF EXISTS investigation_order_completion ON investigation_orders;
CREATE TRIGGER investigation_order_completion AFTER UPDATE ON investigation_orders FOR EACH ROW EXECUTE FUNCTION save_investigation_to_history();
