import { z } from "zod";

// Admin Users
export const adminSchema = z.object({
  admin_id: z.string().uuid(),
  username: z.string(),
  password_hash: z.string(),
  full_name: z.string(),
  email: z.string().email().nullable(),
  contact_number: z.string().nullable(),
  is_active: z.boolean().default(true),
  last_login: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertAdminSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  full_name: z.string(),
  email: z.string().email().optional(),
  contact_number: z.string().optional(),
});

export type Admin = z.infer<typeof adminSchema>;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;

// Departments
export const departmentSchema = z.object({
  department_id: z.string().uuid(),
  department_name: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertDepartmentSchema = z.object({
  department_name: z.string(),
});

export type Department = z.infer<typeof departmentSchema>;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

// Staff
export const staffSchema = z.object({
  staff_id: z.string().uuid(),
  staff_name: z.string(),
  role: z.enum(['Doctor', 'Nurse']),
  department_id: z.string().uuid().nullable(),
  contact_number: z.string().nullable(),
  email: z.string().email().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertStaffSchema = z.object({
  staff_name: z.string(),
  role: z.enum(['Doctor', 'Nurse']),
  department_id: z.string().uuid().optional(),
  contact_number: z.string().optional(),
  email: z.string().email().optional(),
});

export type Staff = z.infer<typeof staffSchema>;
export type InsertStaff = z.infer<typeof insertStaffSchema>;

// Patients
export const patientSchema = z.object({
  patient_id: z.string().uuid(),
  ipd_number: z.string(),
  patient_name: z.string(),
  age: z.number(),
  gender: z.enum(['M', 'F', 'O']),
  contact_number: z.string().nullable(),
  address: z.string().nullable(),
  bed_number: z.string(),
  ward: z.string(),
  diagnosis: z.string(),
  admission_date: z.date(),
  is_discharged: z.boolean().default(false),
  discharge_date: z.date().nullable(),
  emergency_contact: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertPatientSchema = z.object({
  ipd_number: z.string(),
  patient_name: z.string(),
  age: z.number().int().positive(),
  gender: z.enum(['M', 'F', 'O']),
  contact_number: z.string().optional(),
  address: z.string().optional(),
  bed_number: z.string(),
  ward: z.string(),
  diagnosis: z.string(),
  admission_date: z.string(),
  emergency_contact: z.string().optional(),
});

export type Patient = z.infer<typeof patientSchema>;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

// Medications
export const medicationSchema = z.object({
  medication_id: z.string().uuid(),
  medication_name: z.string(),
  dosage: z.string().nullable(),
  form: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertMedicationSchema = z.object({
  medication_name: z.string(),
  dosage: z.string().optional(),
  form: z.string().optional(),
});

export type Medication = z.infer<typeof medicationSchema>;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;

// Routes of Administration
export const routeSchema = z.object({
  route_id: z.string().uuid(),
  route_name: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertRouteSchema = z.object({
  route_name: z.string(),
});

export type Route = z.infer<typeof routeSchema>;
export type InsertRoute = z.infer<typeof insertRouteSchema>;

// Procedures
export const procedureSchema = z.object({
  procedure_id: z.string().uuid(),
  procedure_name: z.string(),
  description: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertProcedureSchema = z.object({
  procedure_name: z.string(),
  description: z.string(),
});

export type Procedure = z.infer<typeof procedureSchema>;
export type InsertProcedure = z.infer<typeof insertProcedureSchema>;

// Investigations
export const investigationSchema = z.object({
  investigation_id: z.string().uuid(),
  investigation_name: z.string(),
  description: z.string(),
  normal_range: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertInvestigationSchema = z.object({
  investigation_name: z.string(),
  description: z.string(),
  normal_range: z.string().optional(),
});

export type Investigation = z.infer<typeof investigationSchema>;
export type InsertInvestigation = z.infer<typeof insertInvestigationSchema>;

// Medication Orders
export const medicationOrderSchema = z.object({
  order_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  medication_id: z.string().uuid(),
  route_id: z.string().uuid().nullable(),
  scheduled_time: z.string(), // time without time zone
  frequency: z.string().nullable(),
  start_date: z.date(),
  end_date: z.date().nullable(),
  dosage_amount: z.string().nullable(),
  priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  is_completed: z.boolean().default(false),
  completed_at: z.date().nullable(),
  completed_by: z.string().uuid().nullable(),
  notes: z.string().nullable(),
  is_active: z.boolean().default(true),
  created_by: z.string().uuid().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertMedicationOrderSchema = z.object({
  patient_id: z.string().uuid(),
  medication_id: z.string().uuid(),
  route_id: z.string().uuid().optional(),
  scheduled_time: z.string(),
  frequency: z.string().optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
  dosage_amount: z.string().optional(),
  priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  notes: z.string().optional(),
  created_by: z.string().uuid().optional(),
});

export type MedicationOrder = z.infer<typeof medicationOrderSchema>;
export type InsertMedicationOrder = z.infer<typeof insertMedicationOrderSchema>;

// Procedure Orders
export const procedureOrderSchema = z.object({
  order_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  procedure_id: z.string().uuid(),
  scheduled_time: z.date(),
  priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  is_completed: z.boolean().default(false),
  completed_at: z.date().nullable(),
  completed_by: z.string().uuid().nullable(),
  notes: z.string().nullable(),
  is_active: z.boolean().default(true),
  created_by: z.string().uuid().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertProcedureOrderSchema = z.object({
  patient_id: z.string().uuid(),
  procedure_id: z.string().uuid(),
  scheduled_time: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  notes: z.string().optional(),
  created_by: z.string().uuid().optional(),
});

export type ProcedureOrder = z.infer<typeof procedureOrderSchema>;
export type InsertProcedureOrder = z.infer<typeof insertProcedureOrderSchema>;

// Investigation Orders
export const investigationOrderSchema = z.object({
  order_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  investigation_id: z.string().uuid(),
  scheduled_time: z.date(),
  priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  is_completed: z.boolean().default(false),
  completed_at: z.date().nullable(),
  completed_by: z.string().uuid().nullable(),
  result_value: z.string().nullable(),
  notes: z.string().nullable(),
  is_active: z.boolean().default(true),
  created_by: z.string().uuid().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertInvestigationOrderSchema = z.object({
  patient_id: z.string().uuid(),
  investigation_id: z.string().uuid(),
  scheduled_time: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  result_value: z.string().optional(),
  notes: z.string().optional(),
  created_by: z.string().uuid().optional(),
});

export type InvestigationOrder = z.infer<typeof investigationOrderSchema>;
export type InsertInvestigationOrder = z.infer<typeof insertInvestigationOrderSchema>;

// Nursing Notes
export const nursingNoteSchema = z.object({
  note_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  recorded_by: z.string().uuid(),
  note_type: z.string(),
  note: z.string(),
  recorded_at: z.date(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertNursingNoteSchema = z.object({
  patient_id: z.string().uuid(),
  recorded_by: z.string().uuid(),
  note_type: z.string(),
  note: z.string(),
});

export type NursingNote = z.infer<typeof nursingNoteSchema>;
export type InsertNursingNote = z.infer<typeof insertNursingNoteSchema>;

// Vital Signs
export const vitalSignSchema = z.object({
  vital_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  recorded_by: z.string().uuid(),
  temperature: z.number().nullable(),
  blood_pressure_systolic: z.number().nullable(),
  blood_pressure_diastolic: z.number().nullable(),
  heart_rate: z.number().nullable(),
  respiratory_rate: z.number().nullable(),
  oxygen_saturation: z.number().nullable(),
  recorded_at: z.date(),
  created_at: z.date(),
});

export const insertVitalSignSchema = z.object({
  patient_id: z.string().uuid(),
  recorded_by: z.string().uuid(),
  temperature: z.number().optional(),
  blood_pressure_systolic: z.number().optional(),
  blood_pressure_diastolic: z.number().optional(),
  heart_rate: z.number().optional(),
  respiratory_rate: z.number().optional(),
  oxygen_saturation: z.number().optional(),
});

export type VitalSign = z.infer<typeof vitalSignSchema>;
export type InsertVitalSign = z.infer<typeof insertVitalSignSchema>;

// Treatment History
export const treatmentHistorySchema = z.object({
  history_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  treatment_type: z.enum(['medication', 'procedure', 'investigation']),
  order_id: z.string().uuid(),
  treatment_name: z.string(),
  scheduled_time: z.date(),
  completed_at: z.date(),
  completed_by: z.string().uuid(),
  notes: z.string().nullable(),
  created_at: z.date(),
});

export type TreatmentHistory = z.infer<typeof treatmentHistorySchema>;

// Notification Queue
export const notificationSchema = z.object({
  notification_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  treatment_type: z.enum(['medication', 'procedure', 'investigation']),
  order_id: z.string().uuid(),
  scheduled_time: z.date(),
  message: z.string(),
  is_acknowledged: z.boolean().default(false),
  acknowledged_by: z.string().uuid().nullable(),
  acknowledged_at: z.date().nullable(),
  created_at: z.date(),
});

export type Notification = z.infer<typeof notificationSchema>;

// Patient Staff Assignments
export const patientStaffAssignmentSchema = z.object({
  assignment_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  staff_id: z.string().uuid(),
  assignment_role: z.enum(['Doctor', 'Nurse']),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertPatientStaffAssignmentSchema = z.object({
  patient_id: z.string().uuid(),
  staff_id: z.string().uuid(),
  assignment_role: z.enum(['Doctor', 'Nurse']),
});

export type PatientStaffAssignment = z.infer<typeof patientStaffAssignmentSchema>;
export type InsertPatientStaffAssignment = z.infer<typeof insertPatientStaffAssignmentSchema>;

// Extended Patient Details (with staff assignments and related data)
export const patientDetailsSchema = patientSchema.extend({
  doctor: staffSchema.nullable(),
  nurse: staffSchema.nullable(),
  medication_orders: z.array(medicationOrderSchema).optional(),
  procedure_orders: z.array(procedureOrderSchema).optional(),
  investigation_orders: z.array(investigationOrderSchema).optional(),
  nursing_notes: z.array(nursingNoteSchema).optional(),
  vital_signs: z.array(vitalSignSchema).optional(),
});

export type PatientDetails = z.infer<typeof patientDetailsSchema>;
