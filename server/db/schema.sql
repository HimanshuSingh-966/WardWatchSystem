-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_ipd ON patients(ipd_number);
CREATE INDEX IF NOT EXISTS idx_patients_discharged ON patients(is_discharged);
CREATE INDEX IF NOT EXISTS idx_medication_orders_patient ON medication_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_medication_orders_scheduled ON medication_orders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_procedure_orders_patient ON procedure_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_procedure_orders_scheduled ON procedure_orders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_investigation_orders_patient ON investigation_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_investigation_orders_scheduled ON investigation_orders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_nursing_notes_patient ON nursing_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_patient ON vital_signs(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_acknowledged ON notification_queue(is_acknowledged);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes_of_administration FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investigations_updated_at BEFORE UPDATE ON investigations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medication_orders_updated_at BEFORE UPDATE ON medication_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procedure_orders_updated_at BEFORE UPDATE ON procedure_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investigation_orders_updated_at BEFORE UPDATE ON investigation_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nursing_notes_updated_at BEFORE UPDATE ON nursing_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patient_staff_assignments_updated_at BEFORE UPDATE ON patient_staff_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
