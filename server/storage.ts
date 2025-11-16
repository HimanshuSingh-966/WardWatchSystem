import { supabase } from './db/supabase';
import type { 
  Admin, InsertAdmin,
  Patient, InsertPatient,
  PatientDetails,
  Department, InsertDepartment,
  Staff, InsertStaff,
  Medication, InsertMedication,
  Procedure, InsertProcedure,
  Investigation, InsertInvestigation,
  MedicationOrder, InsertMedicationOrder,
  ProcedureOrder, InsertProcedureOrder,
  InvestigationOrder, InsertInvestigationOrder,
  NursingNote, InsertNursingNote,
  VitalSign, InsertVitalSign,
  Route, InsertRoute,
  PatientStaffAssignment, InsertPatientStaffAssignment,
  TreatmentHistory
} from "@shared/schema";

export interface IStorage {
  // Admin methods
  getAdmin(id: string): Promise<Admin | null>;
  getAdminByUsername(username: string): Promise<Admin | null>;
  createAdmin(admin: InsertAdmin & { password_hash: string }): Promise<Admin>;
  updateAdminLastLogin(id: string): Promise<void>;

  // Patient methods
  getPatients(isDischargedFilter?: boolean): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | null>;
  getPatientDetails(id: string): Promise<PatientDetails | null>;
  getPatientByIPD(ipdNumber: string): Promise<Patient | null>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient>;
  dischargePatient(id: string): Promise<Patient>;
  deletePatient(id: string): Promise<void>;

  // Patient Staff Assignment methods
  getPatientStaffAssignments(patientId: string): Promise<PatientStaffAssignment[]>;
  assignStaffToPatient(assignment: InsertPatientStaffAssignment): Promise<PatientStaffAssignment>;
  updatePatientStaffAssignment(patientId: string, role: 'Doctor' | 'Nurse', staffId: string): Promise<PatientStaffAssignment>;
  removePatientStaffAssignment(patientId: string, role: 'Doctor' | 'Nurse'): Promise<void>;

  // Department methods
  getDepartments(): Promise<Department[]>;
  getDepartment(id: string): Promise<Department | null>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: string, department: InsertDepartment): Promise<Department>;
  deleteDepartment(id: string): Promise<void>;

  // Staff methods
  getStaff(): Promise<Staff[]>;
  getStaffMember(id: string): Promise<Staff | null>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: string, staff: Partial<InsertStaff>): Promise<Staff>;
  deleteStaff(id: string): Promise<void>;

  // Medication methods
  getMedications(): Promise<Medication[]>;
  getMedication(id: string): Promise<Medication | null>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: string, medication: InsertMedication): Promise<Medication>;
  deleteMedication(id: string): Promise<void>;

  // Procedure methods
  getProcedures(): Promise<Procedure[]>;
  getProcedure(id: string): Promise<Procedure | null>;
  createProcedure(procedure: InsertProcedure): Promise<Procedure>;
  updateProcedure(id: string, procedure: InsertProcedure): Promise<Procedure>;
  deleteProcedure(id: string): Promise<void>;

  // Investigation methods
  getInvestigations(): Promise<Investigation[]>;
  getInvestigation(id: string): Promise<Investigation | null>;
  createInvestigation(investigation: InsertInvestigation): Promise<Investigation>;
  updateInvestigation(id: string, investigation: InsertInvestigation): Promise<Investigation>;
  deleteInvestigation(id: string): Promise<void>;

  // Route methods
  getRoutes(): Promise<Route[]>;
  getRoute(id: string): Promise<Route | null>;
  createRoute(route: InsertRoute): Promise<Route>;

  // Medication Order methods
  getMedicationOrders(patientId?: string, date?: string): Promise<MedicationOrder[]>;
  getMedicationOrder(id: string): Promise<MedicationOrder | null>;
  createMedicationOrder(order: InsertMedicationOrder): Promise<MedicationOrder>;
  updateMedicationOrder(id: string, order: Partial<InsertMedicationOrder>): Promise<MedicationOrder>;
  completeMedicationOrder(id: string, completedBy: string): Promise<MedicationOrder>;
  deleteMedicationOrder(id: string): Promise<void>;

  // Procedure Order methods
  getProcedureOrders(patientId?: string, date?: string): Promise<ProcedureOrder[]>;
  getProcedureOrder(id: string): Promise<ProcedureOrder | null>;
  createProcedureOrder(order: InsertProcedureOrder): Promise<ProcedureOrder>;
  updateProcedureOrder(id: string, order: Partial<InsertProcedureOrder>): Promise<ProcedureOrder>;
  completeProcedureOrder(id: string, completedBy: string): Promise<ProcedureOrder>;
  deleteProcedureOrder(id: string): Promise<void>;

  // Investigation Order methods
  getInvestigationOrders(patientId?: string, date?: string): Promise<InvestigationOrder[]>;
  getInvestigationOrder(id: string): Promise<InvestigationOrder | null>;
  createInvestigationOrder(order: InsertInvestigationOrder): Promise<InvestigationOrder>;
  updateInvestigationOrder(id: string, order: Partial<InsertInvestigationOrder>): Promise<InvestigationOrder>;
  completeInvestigationOrder(id: string, completedBy: string, result?: string): Promise<InvestigationOrder>;
  deleteInvestigationOrder(id: string): Promise<void>;

  // Nursing Notes methods
  getNursingNotes(patientId?: string): Promise<NursingNote[]>;
  getNursingNote(id: string): Promise<NursingNote | null>;
  createNursingNote(note: InsertNursingNote): Promise<NursingNote>;
  updateNursingNote(id: string, note: Partial<InsertNursingNote>): Promise<NursingNote>;
  deleteNursingNote(id: string): Promise<void>;

  // Vital Signs methods
  getVitalSigns(patientId: string): Promise<VitalSign[]>;
  createVitalSign(vital: InsertVitalSign): Promise<VitalSign>;

  // Treatment History methods
  getTreatmentHistory(patientId: string): Promise<TreatmentHistory[]>;
}

export class SupabaseStorage implements IStorage {
  // Admin methods
  async getAdmin(id: string): Promise<Admin | null> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('admin_id', id)
      .single();
    
    if (error) return null;
    return data as Admin;
  }

  async getAdminByUsername(username: string): Promise<Admin | null> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) return null;
    return data as Admin;
  }

  async createAdmin(admin: InsertAdmin & { password_hash: string }): Promise<Admin> {
    const { data, error } = await supabase
      .from('admins')
      .insert([admin])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Admin;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('admin_id', id);
  }

  // Patient methods
  async getPatients(isDischargedFilter?: boolean): Promise<Patient[]> {
    let query = supabase.from('patients').select('*');
    
    if (isDischargedFilter !== undefined) {
      query = query.eq('is_discharged', isDischargedFilter);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data as Patient[]) || [];
  }

  async getPatient(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('patient_id', id)
      .single();
    
    if (error) return null;
    return data as Patient;
  }

  async getPatientByIPD(ipdNumber: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('ipd_number', ipdNumber)
      .single();
    
    if (error) return null;
    return data as Patient;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Patient;
  }

  async updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .update(patient)
      .eq('patient_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Patient;
  }

  async dischargePatient(id: string): Promise<Patient> {
    const { data, error} = await supabase
      .from('patients')
      .update({ 
        is_discharged: true, 
        discharge_date: new Date().toISOString()
      })
      .eq('patient_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Patient;
  }

  async deletePatient(id: string): Promise<void> {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('patient_id', id);
    
    if (error) throw new Error(error.message);
  }

  async getPatientDetails(id: string): Promise<PatientDetails | null> {
    const patient = await this.getPatient(id);
    if (!patient) return null;

    const [assignments, medicationOrders, procedureOrders, investigationOrders, nursingNotes, vitalSigns] = await Promise.all([
      this.getPatientStaffAssignments(id),
      this.getMedicationOrders(id),
      this.getProcedureOrders(id),
      this.getInvestigationOrders(id),
      this.getNursingNotes(id),
      this.getVitalSigns(id)
    ]);

    const doctorAssignment = assignments.find(a => a.assignment_role === 'Doctor');
    const nurseAssignment = assignments.find(a => a.assignment_role === 'Nurse');

    const doctor = doctorAssignment ? await this.getStaffMember(doctorAssignment.staff_id) : null;
    const nurse = nurseAssignment ? await this.getStaffMember(nurseAssignment.staff_id) : null;

    return {
      ...patient,
      doctor,
      nurse,
      medication_orders: medicationOrders,
      procedure_orders: procedureOrders,
      investigation_orders: investigationOrders,
      nursing_notes: nursingNotes,
      vital_signs: vitalSigns
    };
  }

  // Patient Staff Assignment methods
  async getPatientStaffAssignments(patientId: string): Promise<PatientStaffAssignment[]> {
    const { data, error } = await supabase
      .from('patient_staff_assignments')
      .select('*')
      .eq('patient_id', patientId);
    
    if (error) throw new Error(error.message);
    return data as PatientStaffAssignment[];
  }

  async assignStaffToPatient(assignment: InsertPatientStaffAssignment): Promise<PatientStaffAssignment> {
    const { data, error } = await supabase
      .from('patient_staff_assignments')
      .insert([assignment])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as PatientStaffAssignment;
  }

  async updatePatientStaffAssignment(patientId: string, role: 'Doctor' | 'Nurse', staffId: string): Promise<PatientStaffAssignment> {
    const { data, error } = await supabase
      .from('patient_staff_assignments')
      .update({ staff_id: staffId })
      .eq('patient_id', patientId)
      .eq('assignment_role', role)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as PatientStaffAssignment;
  }

  async removePatientStaffAssignment(patientId: string, role: 'Doctor' | 'Nurse'): Promise<void> {
    const { error } = await supabase
      .from('patient_staff_assignments')
      .delete()
      .eq('patient_id', patientId)
      .eq('assignment_role', role);
    
    if (error) throw new Error(error.message);
  }

  // Department methods
  async getDepartments(): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as Department[];
  }

  async getDepartment(id: string): Promise<Department | null> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('department_id', id)
      .single();
    
    if (error) return null;
    return data as Department;
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .insert([department])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Department;
  }

  async updateDepartment(id: string, department: InsertDepartment): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .update(department)
      .eq('department_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Department;
  }

  async deleteDepartment(id: string): Promise<void> {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('department_id', id);
    
    if (error) throw new Error(error.message);
  }

  // Staff methods
  async getStaff(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as Staff[];
  }

  async getStaffMember(id: string): Promise<Staff | null> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('staff_id', id)
      .single();
    
    if (error) return null;
    return data as Staff;
  }

  async createStaff(staff: InsertStaff): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .insert([staff])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Staff;
  }

  async updateStaff(id: string, staff: Partial<InsertStaff>): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .update(staff)
      .eq('staff_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Staff;
  }

  async deleteStaff(id: string): Promise<void> {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('staff_id', id);
    
    if (error) throw new Error(error.message);
  }

  // Medication methods
  async getMedications(): Promise<Medication[]> {
    const { data, error } = await supabase
      .from('medications')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as Medication[];
  }

  async getMedication(id: string): Promise<Medication | null> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('medication_id', id)
      .single();
    
    if (error) return null;
    return data as Medication;
  }

  async createMedication(medication: InsertMedication): Promise<Medication> {
    const { data, error } = await supabase
      .from('medications')
      .insert([medication])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Medication;
  }

  async updateMedication(id: string, medication: InsertMedication): Promise<Medication> {
    const { data, error } = await supabase
      .from('medications')
      .update(medication)
      .eq('medication_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Medication;
  }

  async deleteMedication(id: string): Promise<void> {
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('medication_id', id);
    
    if (error) throw new Error(error.message);
  }

  // Procedure methods
  async getProcedures(): Promise<Procedure[]> {
    const { data, error } = await supabase
      .from('procedures')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as Procedure[];
  }

  async getProcedure(id: string): Promise<Procedure | null> {
    const { data, error } = await supabase
      .from('procedures')
      .select('*')
      .eq('procedure_id', id)
      .single();
    
    if (error) return null;
    return data as Procedure;
  }

  async createProcedure(procedure: InsertProcedure): Promise<Procedure> {
    const { data, error } = await supabase
      .from('procedures')
      .insert([procedure])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Procedure;
  }

  async updateProcedure(id: string, procedure: InsertProcedure): Promise<Procedure> {
    const { data, error } = await supabase
      .from('procedures')
      .update(procedure)
      .eq('procedure_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Procedure;
  }

  async deleteProcedure(id: string): Promise<void> {
    const { error } = await supabase
      .from('procedures')
      .delete()
      .eq('procedure_id', id);
    
    if (error) throw new Error(error.message);
  }

  // Investigation methods
  async getInvestigations(): Promise<Investigation[]> {
    const { data, error } = await supabase
      .from('investigations')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as Investigation[];
  }

  async getInvestigation(id: string): Promise<Investigation | null> {
    const { data, error } = await supabase
      .from('investigations')
      .select('*')
      .eq('investigation_id', id)
      .single();
    
    if (error) return null;
    return data as Investigation;
  }

  async createInvestigation(investigation: InsertInvestigation): Promise<Investigation> {
    const { data, error } = await supabase
      .from('investigations')
      .insert([investigation])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Investigation;
  }

  async updateInvestigation(id: string, investigation: InsertInvestigation): Promise<Investigation> {
    const { data, error } = await supabase
      .from('investigations')
      .update(investigation)
      .eq('investigation_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Investigation;
  }

  async deleteInvestigation(id: string): Promise<void> {
    const { error } = await supabase
      .from('investigations')
      .delete()
      .eq('investigation_id', id);
    
    if (error) throw new Error(error.message);
  }

  // Route methods
  async getRoutes(): Promise<Route[]> {
    const { data, error } = await supabase
      .from('routes_of_administration')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as Route[];
  }

  async getRoute(id: string): Promise<Route | null> {
    const { data, error } = await supabase
      .from('routes_of_administration')
      .select('*')
      .eq('route_id', id)
      .single();
    
    if (error) return null;
    return data as Route;
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const { data, error } = await supabase
      .from('routes_of_administration')
      .insert([route])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Route;
  }

  // Medication Order methods
  async getMedicationOrders(patientId?: string, date?: string): Promise<MedicationOrder[]> {
    let query = supabase.from('medication_orders').select('*');
    
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }
    
    if (date) {
      query = query.eq('start_date', date);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as MedicationOrder[];
  }

  async getMedicationOrder(id: string): Promise<MedicationOrder | null> {
    const { data, error } = await supabase
      .from('medication_orders')
      .select('*')
      .eq('order_id', id)
      .single();
    
    if (error) return null;
    return data as MedicationOrder;
  }

  async createMedicationOrder(order: InsertMedicationOrder): Promise<MedicationOrder> {
    const { data, error } = await supabase
      .from('medication_orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as MedicationOrder;
  }

  async updateMedicationOrder(id: string, order: Partial<InsertMedicationOrder>): Promise<MedicationOrder> {
    const { data, error } = await supabase
      .from('medication_orders')
      .update(order)
      .eq('order_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as MedicationOrder;
  }

  async completeMedicationOrder(id: string, completedBy: string): Promise<MedicationOrder> {
    const { data, error } = await supabase
      .from('medication_orders')
      .update({ 
        is_completed: true, 
        completed_at: new Date().toISOString(),
        completed_by: completedBy
      })
      .eq('order_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as MedicationOrder;
  }

  async deleteMedicationOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('medication_orders')
      .delete()
      .eq('order_id', id);
    
    if (error) throw new Error(error.message);
  }

  // Procedure Order methods
  async getProcedureOrders(patientId?: string, date?: string): Promise<ProcedureOrder[]> {
    let query = supabase.from('procedure_orders').select('*');
    
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }
    
    if (date) {
      query = query.gte('scheduled_time', `${date}T00:00:00`)
           .lte('scheduled_time', `${date}T23:59:59`);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as ProcedureOrder[];
  }

  async getProcedureOrder(id: string): Promise<ProcedureOrder | null> {
    const { data, error } = await supabase
      .from('procedure_orders')
      .select('*')
      .eq('order_id', id)
      .single();
    
    if (error) return null;
    return data as ProcedureOrder;
  }

  async createProcedureOrder(order: InsertProcedureOrder): Promise<ProcedureOrder> {
    const { data, error } = await supabase
      .from('procedure_orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as ProcedureOrder;
  }

  async updateProcedureOrder(id: string, order: Partial<InsertProcedureOrder>): Promise<ProcedureOrder> {
    const { data, error } = await supabase
      .from('procedure_orders')
      .update(order)
      .eq('order_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as ProcedureOrder;
  }

  async completeProcedureOrder(id: string, completedBy: string): Promise<ProcedureOrder> {
    const { data, error } = await supabase
      .from('procedure_orders')
      .update({ 
        is_completed: true, 
        completed_at: new Date().toISOString(),
        completed_by: completedBy
      })
      .eq('order_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as ProcedureOrder;
  }

  async deleteProcedureOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('procedure_orders')
      .delete()
      .eq('order_id', id);
    
    if (error) throw new Error(error.message);
  }

  // Investigation Order methods
  async getInvestigationOrders(patientId?: string, date?: string): Promise<InvestigationOrder[]> {
    let query = supabase.from('investigation_orders').select('*');
    
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }
    
    if (date) {
      query = query.gte('scheduled_time', `${date}T00:00:00`)
           .lte('scheduled_time', `${date}T23:59:59`);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as InvestigationOrder[];
  }

  async getInvestigationOrder(id: string): Promise<InvestigationOrder | null> {
    const { data, error } = await supabase
      .from('investigation_orders')
      .select('*')
      .eq('order_id', id)
      .single();
    
    if (error) return null;
    return data as InvestigationOrder;
  }

  async createInvestigationOrder(order: InsertInvestigationOrder): Promise<InvestigationOrder> {
    const { data, error } = await supabase
      .from('investigation_orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as InvestigationOrder;
  }

  async updateInvestigationOrder(id: string, order: Partial<InsertInvestigationOrder>): Promise<InvestigationOrder> {
    const { data, error } = await supabase
      .from('investigation_orders')
      .update(order)
      .eq('order_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as InvestigationOrder;
  }

  async completeInvestigationOrder(id: string, completedBy: string, result?: string): Promise<InvestigationOrder> {
    const { data, error } = await supabase
      .from('investigation_orders')
      .update({ 
        is_completed: true, 
        completed_at: new Date().toISOString(),
        completed_by: completedBy,
        ...(result && { result_value: result })
      })
      .eq('order_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as InvestigationOrder;
  }

  async deleteInvestigationOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('investigation_orders')
      .delete()
      .eq('order_id', id);
    
    if (error) throw new Error(error.message);
  }

  // Nursing Notes methods
  async getNursingNotes(patientId?: string): Promise<NursingNote[]> {
    let query = supabase.from('nursing_notes').select('*');
    
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as NursingNote[];
  }

  async getNursingNote(id: string): Promise<NursingNote | null> {
    const { data, error } = await supabase
      .from('nursing_notes')
      .select('*')
      .eq('note_id', id)
      .single();
    
    if (error) return null;
    return data as NursingNote;
  }

  async createNursingNote(note: InsertNursingNote): Promise<NursingNote> {
    const { data, error } = await supabase
      .from('nursing_notes')
      .insert([note])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as NursingNote;
  }

  async updateNursingNote(id: string, note: Partial<InsertNursingNote>): Promise<NursingNote> {
    const { data, error } = await supabase
      .from('nursing_notes')
      .update(note)
      .eq('note_id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as NursingNote;
  }

  async deleteNursingNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('nursing_notes')
      .delete()
      .eq('note_id', id);
    
    if (error) throw new Error(error.message);
  }

  // Vital Signs methods
  async getVitalSigns(patientId: string): Promise<VitalSign[]> {
    const { data, error } = await supabase
      .from('vital_signs')
      .select('*')
      .eq('patient_id', patientId)
      .order('recorded_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as VitalSign[];
  }

  async createVitalSign(vital: InsertVitalSign): Promise<VitalSign> {
    const { data, error } = await supabase
      .from('vital_signs')
      .insert([vital])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as VitalSign;
  }

  // Treatment History methods
  async getTreatmentHistory(patientId: string): Promise<TreatmentHistory[]> {
    const { data, error } = await supabase
      .from('treatment_history')
      .select('*')
      .eq('patient_id', patientId)
      .order('completed_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as TreatmentHistory[];
  }
}

export const storage = new SupabaseStorage();
