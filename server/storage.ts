import { sql } from './db/database';
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

// Helper function to convert PostgreSQL row dates to Date objects
function convertDates<T extends Record<string, any>>(row: T, dateFields: string[]): T {
  const converted = { ...row };
  for (const field of dateFields) {
    if (converted[field] && typeof converted[field] === 'string') {
      converted[field] = new Date(converted[field]);
    }
  }
  return converted;
}

export class PostgresStorage implements IStorage {
  // Admin methods
  async getAdmin(id: string): Promise<Admin | null> {
    try {
      const result = await sql`SELECT * FROM admins WHERE admin_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['last_login', 'created_at', 'updated_at']) as Admin;
    } catch (error) {
      return null;
    }
  }

  async getAdminByUsername(username: string): Promise<Admin | null> {
    try {
      const result = await sql`SELECT * FROM admins WHERE username = ${username} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['last_login', 'created_at', 'updated_at']) as Admin;
    } catch (error) {
      return null;
    }
  }

  async createAdmin(admin: InsertAdmin & { password_hash: string }): Promise<Admin> {
    const result = await sql`
      INSERT INTO admins (username, password_hash, full_name, email, contact_number)
      VALUES (${admin.username}, ${admin.password_hash}, ${admin.full_name}, ${admin.email || null}, ${admin.contact_number || null})
      RETURNING *
    `;
    return convertDates(result[0], ['last_login', 'created_at', 'updated_at']) as Admin;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    await sql`UPDATE admins SET last_login = NOW() WHERE admin_id = ${id}`;
  }

  // Patient methods
  async getPatients(isDischargedFilter?: boolean): Promise<Patient[]> {
    let result;
    if (isDischargedFilter !== undefined) {
      result = await sql`SELECT * FROM patients WHERE is_discharged = ${isDischargedFilter}`;
    } else {
      result = await sql`SELECT * FROM patients`;
    }
    return result.map(row => convertDates(row, ['admission_date', 'discharge_date', 'created_at', 'updated_at'])) as Patient[];
  }

  async getPatient(id: string): Promise<Patient | null> {
    try {
      const result = await sql`SELECT * FROM patients WHERE patient_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['admission_date', 'discharge_date', 'created_at', 'updated_at']) as Patient;
    } catch (error) {
      return null;
    }
  }

  async getPatientByIPD(ipdNumber: string): Promise<Patient | null> {
    try {
      const result = await sql`SELECT * FROM patients WHERE ipd_number = ${ipdNumber} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['admission_date', 'discharge_date', 'created_at', 'updated_at']) as Patient;
    } catch (error) {
      return null;
    }
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const result = await sql`
      INSERT INTO patients (
        ipd_number, patient_name, age, gender, contact_number, address, 
        bed_number, ward, diagnosis, admission_date, emergency_contact
      )
      VALUES (
        ${patient.ipd_number}, ${patient.patient_name}, ${patient.age}, ${patient.gender},
        ${patient.contact_number || null}, ${patient.address || null}, ${patient.bed_number},
        ${patient.ward}, ${patient.diagnosis}, ${patient.admission_date}, ${patient.emergency_contact || null}
      )
      RETURNING *
    `;
    return convertDates(result[0], ['admission_date', 'discharge_date', 'created_at', 'updated_at']) as Patient;
  }

  async updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (patient.ipd_number !== undefined) {
      updates.push(`ipd_number = $${paramIndex++}`);
      values.push(patient.ipd_number);
    }
    if (patient.patient_name !== undefined) {
      updates.push(`patient_name = $${paramIndex++}`);
      values.push(patient.patient_name);
    }
    if (patient.age !== undefined) {
      updates.push(`age = $${paramIndex++}`);
      values.push(patient.age);
    }
    if (patient.gender !== undefined) {
      updates.push(`gender = $${paramIndex++}`);
      values.push(patient.gender);
    }
    if (patient.contact_number !== undefined) {
      updates.push(`contact_number = $${paramIndex++}`);
      values.push(patient.contact_number || null);
    }
    if (patient.address !== undefined) {
      updates.push(`address = $${paramIndex++}`);
      values.push(patient.address || null);
    }
    if (patient.bed_number !== undefined) {
      updates.push(`bed_number = $${paramIndex++}`);
      values.push(patient.bed_number);
    }
    if (patient.ward !== undefined) {
      updates.push(`ward = $${paramIndex++}`);
      values.push(patient.ward);
    }
    if (patient.diagnosis !== undefined) {
      updates.push(`diagnosis = $${paramIndex++}`);
      values.push(patient.diagnosis);
    }
    if (patient.admission_date !== undefined) {
      updates.push(`admission_date = $${paramIndex++}`);
      values.push(patient.admission_date);
    }
    if (patient.emergency_contact !== undefined) {
      updates.push(`emergency_contact = $${paramIndex++}`);
      values.push(patient.emergency_contact || null);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await sql`
      UPDATE patients 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE patient_id = $${paramIndex}
      RETURNING *
    `.apply(null, values);

    return convertDates(result[0], ['admission_date', 'discharge_date', 'created_at', 'updated_at']) as Patient;
  }

  async dischargePatient(id: string): Promise<Patient> {
    const result = await sql`
      UPDATE patients 
      SET is_discharged = true, discharge_date = NOW(), updated_at = NOW()
      WHERE patient_id = ${id}
      RETURNING *
    `;

    await Promise.all([
      sql`UPDATE medication_orders SET is_active = false WHERE patient_id = ${id}`,
      sql`UPDATE procedure_orders SET is_active = false WHERE patient_id = ${id}`,
      sql`UPDATE investigation_orders SET is_active = false WHERE patient_id = ${id}`,
    ]);

    return convertDates(result[0], ['admission_date', 'discharge_date', 'created_at', 'updated_at']) as Patient;
  }

  async deletePatient(id: string): Promise<void> {
    await sql`DELETE FROM patients WHERE patient_id = ${id}`;
  }

  async getPatientDetails(id: string): Promise<PatientDetails | null> {
    const patient = await this.getPatient(id);
    if (!patient) return null;

    const [assignments, medOrders, procOrders, invOrders, notes, vitals] = await Promise.all([
      this.getPatientStaffAssignments(id),
      this.getMedicationOrders(id),
      this.getProcedureOrders(id),
      this.getInvestigationOrders(id),
      this.getNursingNotes(id),
      this.getVitalSigns(id),
    ]);

    const doctorAssignment = assignments.find(a => a.assignment_role === 'Doctor');
    const nurseAssignment = assignments.find(a => a.assignment_role === 'Nurse');

    const [doctor, nurse] = await Promise.all([
      doctorAssignment ? this.getStaffMember(doctorAssignment.staff_id) : Promise.resolve(null),
      nurseAssignment ? this.getStaffMember(nurseAssignment.staff_id) : Promise.resolve(null),
    ]);

    return {
      ...patient,
      doctor,
      nurse,
      medication_orders: medOrders,
      procedure_orders: procOrders,
      investigation_orders: invOrders,
      nursing_notes: notes,
      vital_signs: vitals,
    } as PatientDetails;
  }

  async getPatientStaffAssignments(patientId: string): Promise<PatientStaffAssignment[]> {
    const result = await sql`SELECT * FROM patient_staff_assignments WHERE patient_id = ${patientId}`;
    return result.map(row => convertDates(row, ['created_at', 'updated_at'])) as PatientStaffAssignment[];
  }

  async assignStaffToPatient(assignment: InsertPatientStaffAssignment): Promise<PatientStaffAssignment> {
    const result = await sql`
      INSERT INTO patient_staff_assignments (patient_id, staff_id, assignment_role)
      VALUES (${assignment.patient_id}, ${assignment.staff_id}, ${assignment.assignment_role})
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as PatientStaffAssignment;
  }

  async updatePatientStaffAssignment(patientId: string, role: 'Doctor' | 'Nurse', staffId: string): Promise<PatientStaffAssignment> {
    const result = await sql`
      INSERT INTO patient_staff_assignments (patient_id, staff_id, assignment_role)
      VALUES (${patientId}, ${staffId}, ${role})
      ON CONFLICT (patient_id, assignment_role) 
      DO UPDATE SET staff_id = ${staffId}, updated_at = NOW()
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as PatientStaffAssignment;
  }

  async removePatientStaffAssignment(patientId: string, role: 'Doctor' | 'Nurse'): Promise<void> {
    await sql`DELETE FROM patient_staff_assignments WHERE patient_id = ${patientId} AND assignment_role = ${role}`;
  }

  // Department methods
  async getDepartments(): Promise<Department[]> {
    const result = await sql`SELECT * FROM departments`;
    return result.map(row => convertDates(row, ['created_at', 'updated_at'])) as Department[];
  }

  async getDepartment(id: string): Promise<Department | null> {
    try {
      const result = await sql`SELECT * FROM departments WHERE department_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['created_at', 'updated_at']) as Department;
    } catch (error) {
      return null;
    }
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const result = await sql`
      INSERT INTO departments (department_name)
      VALUES (${department.department_name})
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as Department;
  }

  async updateDepartment(id: string, department: InsertDepartment): Promise<Department> {
    const result = await sql`
      UPDATE departments 
      SET department_name = ${department.department_name}, updated_at = NOW()
      WHERE department_id = ${id}
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as Department;
  }

  async deleteDepartment(id: string): Promise<void> {
    await sql`DELETE FROM departments WHERE department_id = ${id}`;
  }

  // Staff methods
  async getStaff(): Promise<Staff[]> {
    const result = await sql`SELECT * FROM staff`;
    return result.map(row => convertDates(row, ['created_at', 'updated_at'])) as Staff[];
  }

  async getStaffMember(id: string): Promise<Staff | null> {
    try {
      const result = await sql`SELECT * FROM staff WHERE staff_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['created_at', 'updated_at']) as Staff;
    } catch (error) {
      return null;
    }
  }

  async createStaff(staff: InsertStaff): Promise<Staff> {
    const result = await sql`
      INSERT INTO staff (staff_name, role, department_id, contact_number, email)
      VALUES (${staff.staff_name}, ${staff.role}, ${staff.department_id || null}, ${staff.contact_number || null}, ${staff.email || null})
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as Staff;
  }

  async updateStaff(id: string, staff: Partial<InsertStaff>): Promise<Staff> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (staff.staff_name !== undefined) {
      updates.push(`staff_name = $${paramIndex++}`);
      values.push(staff.staff_name);
    }
    if (staff.role !== undefined) {
      updates.push(`role = $${paramIndex++}`);
      values.push(staff.role);
    }
    if (staff.department_id !== undefined) {
      updates.push(`department_id = $${paramIndex++}`);
      values.push(staff.department_id || null);
    }
    if (staff.contact_number !== undefined) {
      updates.push(`contact_number = $${paramIndex++}`);
      values.push(staff.contact_number || null);
    }
    if (staff.email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(staff.email || null);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await sql`
      UPDATE staff 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE staff_id = $${paramIndex}
      RETURNING *
    `.apply(null, values);

    return convertDates(result[0], ['created_at', 'updated_at']) as Staff;
  }

  async deleteStaff(id: string): Promise<void> {
    await sql`DELETE FROM staff WHERE staff_id = ${id}`;
  }

  // Medication methods
  async getMedications(): Promise<Medication[]> {
    const result = await sql`SELECT * FROM medications`;
    return result.map(row => convertDates(row, ['created_at', 'updated_at'])) as Medication[];
  }

  async getMedication(id: string): Promise<Medication | null> {
    try {
      const result = await sql`SELECT * FROM medications WHERE medication_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['created_at', 'updated_at']) as Medication;
    } catch (error) {
      return null;
    }
  }

  async createMedication(medication: InsertMedication): Promise<Medication> {
    const result = await sql`
      INSERT INTO medications (medication_name, dosage, form)
      VALUES (${medication.medication_name}, ${medication.dosage || null}, ${medication.form || null})
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as Medication;
  }

  async updateMedication(id: string, medication: InsertMedication): Promise<Medication> {
    const result = await sql`
      UPDATE medications 
      SET medication_name = ${medication.medication_name}, dosage = ${medication.dosage || null}, form = ${medication.form || null}, updated_at = NOW()
      WHERE medication_id = ${id}
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as Medication;
  }

  async deleteMedication(id: string): Promise<void> {
    await sql`DELETE FROM medications WHERE medication_id = ${id}`;
  }

  // Procedure methods
  async getProcedures(): Promise<Procedure[]> {
    const result = await sql`SELECT * FROM procedures`;
    return result.map(row => convertDates(row, ['created_at', 'updated_at'])) as Procedure[];
  }

  async getProcedure(id: string): Promise<Procedure | null> {
    try {
      const result = await sql`SELECT * FROM procedures WHERE procedure_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['created_at', 'updated_at']) as Procedure;
    } catch (error) {
      return null;
    }
  }

  async createProcedure(procedure: InsertProcedure): Promise<Procedure> {
    const result = await sql`
      INSERT INTO procedures (procedure_name, description)
      VALUES (${procedure.procedure_name}, ${procedure.description})
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as Procedure;
  }

  async updateProcedure(id: string, procedure: InsertProcedure): Promise<Procedure> {
    const result = await sql`
      UPDATE procedures 
      SET procedure_name = ${procedure.procedure_name}, description = ${procedure.description}, updated_at = NOW()
      WHERE procedure_id = ${id}
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as Procedure;
  }

  async deleteProcedure(id: string): Promise<void> {
    await sql`DELETE FROM procedures WHERE procedure_id = ${id}`;
  }

  // Investigation methods
  async getInvestigations(): Promise<Investigation[]> {
    const result = await sql`SELECT * FROM investigations`;
    return result.map(row => convertDates(row, ['created_at', 'updated_at'])) as Investigation[];
  }

  async getInvestigation(id: string): Promise<Investigation | null> {
    try {
      const result = await sql`SELECT * FROM investigations WHERE investigation_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['created_at', 'updated_at']) as Investigation;
    } catch (error) {
      return null;
    }
  }

  async createInvestigation(investigation: InsertInvestigation): Promise<Investigation> {
    const result = await sql`
      INSERT INTO investigations (investigation_name, description, normal_range)
      VALUES (${investigation.investigation_name}, ${investigation.description}, ${investigation.normal_range || null})
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as Investigation;
  }

  async updateInvestigation(id: string, investigation: InsertInvestigation): Promise<Investigation> {
    const result = await sql`
      UPDATE investigations 
      SET investigation_name = ${investigation.investigation_name}, description = ${investigation.description}, normal_range = ${investigation.normal_range || null}, updated_at = NOW()
      WHERE investigation_id = ${id}
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as Investigation;
  }

  async deleteInvestigation(id: string): Promise<void> {
    await sql`DELETE FROM investigations WHERE investigation_id = ${id}`;
  }

  // Route methods
  async getRoutes(): Promise<Route[]> {
    const result = await sql`SELECT * FROM routes_of_administration`;
    return result.map(row => convertDates(row, ['created_at', 'updated_at'])) as Route[];
  }

  async getRoute(id: string): Promise<Route | null> {
    try {
      const result = await sql`SELECT * FROM routes_of_administration WHERE route_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['created_at', 'updated_at']) as Route;
    } catch (error) {
      return null;
    }
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const result = await sql`
      INSERT INTO routes_of_administration (route_name)
      VALUES (${route.route_name})
      RETURNING *
    `;
    return convertDates(result[0], ['created_at', 'updated_at']) as Route;
  }

  // Medication Order methods
  async getMedicationOrders(patientId?: string, date?: string): Promise<MedicationOrder[]> {
    let result;
    if (patientId && date) {
      result = await sql`SELECT * FROM medication_orders WHERE is_active = true AND patient_id = ${patientId} AND start_date = ${date}`;
    } else if (patientId) {
      result = await sql`SELECT * FROM medication_orders WHERE is_active = true AND patient_id = ${patientId}`;
    } else if (date) {
      result = await sql`SELECT * FROM medication_orders WHERE is_active = true AND start_date = ${date}`;
    } else {
      result = await sql`SELECT * FROM medication_orders WHERE is_active = true`;
    }
    return result.map(row => convertDates(row, ['start_date', 'end_date', 'completed_at', 'created_at', 'updated_at'])) as MedicationOrder[];
  }

  async getMedicationOrder(id: string): Promise<MedicationOrder | null> {
    try {
      const result = await sql`SELECT * FROM medication_orders WHERE order_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['start_date', 'end_date', 'completed_at', 'created_at', 'updated_at']) as MedicationOrder;
    } catch (error) {
      return null;
    }
  }

  async createMedicationOrder(order: InsertMedicationOrder): Promise<MedicationOrder> {
    const result = await sql`
      INSERT INTO medication_orders (
        patient_id, medication_id, route_id, scheduled_time, frequency, 
        start_date, end_date, dosage_amount, priority, notes, created_by
      )
      VALUES (
        ${order.patient_id}, ${order.medication_id}, ${order.route_id || null}, ${order.scheduled_time},
        ${order.frequency || null}, ${order.start_date}, ${order.end_date || null}, ${order.dosage_amount || null},
        ${order.priority}, ${order.notes || null}, ${order.created_by || null}
      )
      RETURNING *
    `;
    return convertDates(result[0], ['start_date', 'end_date', 'completed_at', 'created_at', 'updated_at']) as MedicationOrder;
  }

  async updateMedicationOrder(id: string, order: Partial<InsertMedicationOrder>): Promise<MedicationOrder> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (order.medication_id !== undefined) {
      updates.push(`medication_id = $${paramIndex++}`);
      values.push(order.medication_id);
    }
    if (order.route_id !== undefined) {
      updates.push(`route_id = $${paramIndex++}`);
      values.push(order.route_id || null);
    }
    if (order.scheduled_time !== undefined) {
      updates.push(`scheduled_time = $${paramIndex++}`);
      values.push(order.scheduled_time);
    }
    if (order.frequency !== undefined) {
      updates.push(`frequency = $${paramIndex++}`);
      values.push(order.frequency || null);
    }
    if (order.start_date !== undefined) {
      updates.push(`start_date = $${paramIndex++}`);
      values.push(order.start_date);
    }
    if (order.end_date !== undefined) {
      updates.push(`end_date = $${paramIndex++}`);
      values.push(order.end_date || null);
    }
    if (order.dosage_amount !== undefined) {
      updates.push(`dosage_amount = $${paramIndex++}`);
      values.push(order.dosage_amount || null);
    }
    if (order.priority !== undefined) {
      updates.push(`priority = $${paramIndex++}`);
      values.push(order.priority);
    }
    if (order.notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(order.notes || null);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await sql`
      UPDATE medication_orders 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE order_id = $${paramIndex}
      RETURNING *
    `.apply(null, values);

    return convertDates(result[0], ['start_date', 'end_date', 'completed_at', 'created_at', 'updated_at']) as MedicationOrder;
  }

  async completeMedicationOrder(id: string, completedBy: string): Promise<MedicationOrder> {
    const result = await sql`
      UPDATE medication_orders 
      SET is_completed = true, completed_at = NOW(), completed_by = ${completedBy}, updated_at = NOW()
      WHERE order_id = ${id}
      RETURNING *
    `;
    return convertDates(result[0], ['start_date', 'end_date', 'completed_at', 'created_at', 'updated_at']) as MedicationOrder;
  }

  async deleteMedicationOrder(id: string): Promise<void> {
    await sql`DELETE FROM medication_orders WHERE order_id = ${id}`;
  }

  // Procedure Order methods
  async getProcedureOrders(patientId?: string, date?: string): Promise<ProcedureOrder[]> {
    let result;
    if (patientId && date) {
      result = await sql`
        SELECT * FROM procedure_orders 
        WHERE is_active = true AND patient_id = ${patientId} 
        AND scheduled_time >= ${date}::timestamp AND scheduled_time < (${date}::timestamp + interval '1 day')
      `;
    } else if (patientId) {
      result = await sql`SELECT * FROM procedure_orders WHERE is_active = true AND patient_id = ${patientId}`;
    } else if (date) {
      result = await sql`
        SELECT * FROM procedure_orders 
        WHERE is_active = true 
        AND scheduled_time >= ${date}::timestamp AND scheduled_time < (${date}::timestamp + interval '1 day')
      `;
    } else {
      result = await sql`SELECT * FROM procedure_orders WHERE is_active = true`;
    }
    return result.map(row => convertDates(row, ['scheduled_time', 'completed_at', 'created_at', 'updated_at'])) as ProcedureOrder[];
  }

  async getProcedureOrder(id: string): Promise<ProcedureOrder | null> {
    try {
      const result = await sql`SELECT * FROM procedure_orders WHERE order_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['scheduled_time', 'completed_at', 'created_at', 'updated_at']) as ProcedureOrder;
    } catch (error) {
      return null;
    }
  }

  async createProcedureOrder(order: InsertProcedureOrder): Promise<ProcedureOrder> {
    const result = await sql`
      INSERT INTO procedure_orders (patient_id, procedure_id, scheduled_time, priority, notes, created_by)
      VALUES (${order.patient_id}, ${order.procedure_id}, ${order.scheduled_time}, ${order.priority}, ${order.notes || null}, ${order.created_by || null})
      RETURNING *
    `;
    return convertDates(result[0], ['scheduled_time', 'completed_at', 'created_at', 'updated_at']) as ProcedureOrder;
  }

  async updateProcedureOrder(id: string, order: Partial<InsertProcedureOrder>): Promise<ProcedureOrder> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (order.procedure_id !== undefined) {
      updates.push(`procedure_id = $${paramIndex++}`);
      values.push(order.procedure_id);
    }
    if (order.scheduled_time !== undefined) {
      updates.push(`scheduled_time = $${paramIndex++}`);
      values.push(order.scheduled_time);
    }
    if (order.priority !== undefined) {
      updates.push(`priority = $${paramIndex++}`);
      values.push(order.priority);
    }
    if (order.notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(order.notes || null);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await sql`
      UPDATE procedure_orders 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE order_id = $${paramIndex}
      RETURNING *
    `.apply(null, values);

    return convertDates(result[0], ['scheduled_time', 'completed_at', 'created_at', 'updated_at']) as ProcedureOrder;
  }

  async completeProcedureOrder(id: string, completedBy: string): Promise<ProcedureOrder> {
    const result = await sql`
      UPDATE procedure_orders 
      SET is_completed = true, completed_at = NOW(), completed_by = ${completedBy}, updated_at = NOW()
      WHERE order_id = ${id}
      RETURNING *
    `;
    return convertDates(result[0], ['scheduled_time', 'completed_at', 'created_at', 'updated_at']) as ProcedureOrder;
  }

  async deleteProcedureOrder(id: string): Promise<void> {
    await sql`DELETE FROM procedure_orders WHERE order_id = ${id}`;
  }

  // Investigation Order methods
  async getInvestigationOrders(patientId?: string, date?: string): Promise<InvestigationOrder[]> {
    let result;
    if (patientId && date) {
      result = await sql`
        SELECT * FROM investigation_orders 
        WHERE is_active = true AND patient_id = ${patientId} 
        AND scheduled_time >= ${date}::timestamp AND scheduled_time < (${date}::timestamp + interval '1 day')
      `;
    } else if (patientId) {
      result = await sql`SELECT * FROM investigation_orders WHERE is_active = true AND patient_id = ${patientId}`;
    } else if (date) {
      result = await sql`
        SELECT * FROM investigation_orders 
        WHERE is_active = true 
        AND scheduled_time >= ${date}::timestamp AND scheduled_time < (${date}::timestamp + interval '1 day')
      `;
    } else {
      result = await sql`SELECT * FROM investigation_orders WHERE is_active = true`;
    }
    return result.map(row => convertDates(row, ['scheduled_time', 'completed_at', 'created_at', 'updated_at'])) as InvestigationOrder[];
  }

  async getInvestigationOrder(id: string): Promise<InvestigationOrder | null> {
    try {
      const result = await sql`SELECT * FROM investigation_orders WHERE order_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['scheduled_time', 'completed_at', 'created_at', 'updated_at']) as InvestigationOrder;
    } catch (error) {
      return null;
    }
  }

  async createInvestigationOrder(order: InsertInvestigationOrder): Promise<InvestigationOrder> {
    const result = await sql`
      INSERT INTO investigation_orders (patient_id, investigation_id, scheduled_time, priority, result_value, notes, created_by)
      VALUES (${order.patient_id}, ${order.investigation_id}, ${order.scheduled_time}, ${order.priority}, ${order.result_value || null}, ${order.notes || null}, ${order.created_by || null})
      RETURNING *
    `;
    return convertDates(result[0], ['scheduled_time', 'completed_at', 'created_at', 'updated_at']) as InvestigationOrder;
  }

  async updateInvestigationOrder(id: string, order: Partial<InsertInvestigationOrder>): Promise<InvestigationOrder> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (order.investigation_id !== undefined) {
      updates.push(`investigation_id = $${paramIndex++}`);
      values.push(order.investigation_id);
    }
    if (order.scheduled_time !== undefined) {
      updates.push(`scheduled_time = $${paramIndex++}`);
      values.push(order.scheduled_time);
    }
    if (order.priority !== undefined) {
      updates.push(`priority = $${paramIndex++}`);
      values.push(order.priority);
    }
    if (order.result_value !== undefined) {
      updates.push(`result_value = $${paramIndex++}`);
      values.push(order.result_value || null);
    }
    if (order.notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(order.notes || null);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await sql`
      UPDATE investigation_orders 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE order_id = $${paramIndex}
      RETURNING *
    `.apply(null, values);

    return convertDates(result[0], ['scheduled_time', 'completed_at', 'created_at', 'updated_at']) as InvestigationOrder;
  }

  async completeInvestigationOrder(id: string, completedBy: string, result?: string): Promise<InvestigationOrder> {
    const resultUpdate = result ? sql`, result_value = ${result}` : sql``;
    const query = sql`
      UPDATE investigation_orders 
      SET is_completed = true, completed_at = NOW(), completed_by = ${completedBy}, updated_at = NOW()${resultUpdate}
      WHERE order_id = ${id}
      RETURNING *
    `;
    const queryResult = await query;
    return convertDates(queryResult[0], ['scheduled_time', 'completed_at', 'created_at', 'updated_at']) as InvestigationOrder;
  }

  async deleteInvestigationOrder(id: string): Promise<void> {
    await sql`DELETE FROM investigation_orders WHERE order_id = ${id}`;
  }

  // Nursing Notes methods
  async getNursingNotes(patientId?: string): Promise<NursingNote[]> {
    let result;
    if (patientId) {
      result = await sql`SELECT * FROM nursing_notes WHERE patient_id = ${patientId} ORDER BY recorded_at DESC`;
    } else {
      result = await sql`SELECT * FROM nursing_notes ORDER BY recorded_at DESC`;
    }
    return result.map(row => convertDates(row, ['recorded_at', 'created_at', 'updated_at'])) as NursingNote[];
  }

  async getNursingNote(id: string): Promise<NursingNote | null> {
    try {
      const result = await sql`SELECT * FROM nursing_notes WHERE note_id = ${id} LIMIT 1`;
      if (result.length === 0) return null;
      return convertDates(result[0], ['recorded_at', 'created_at', 'updated_at']) as NursingNote;
    } catch (error) {
      return null;
    }
  }

  async createNursingNote(note: InsertNursingNote): Promise<NursingNote> {
    const result = await sql`
      INSERT INTO nursing_notes (patient_id, recorded_by, note_type, note)
      VALUES (${note.patient_id}, ${note.recorded_by}, ${note.note_type}, ${note.note})
      RETURNING *
    `;
    return convertDates(result[0], ['recorded_at', 'created_at', 'updated_at']) as NursingNote;
  }

  async updateNursingNote(id: string, note: Partial<InsertNursingNote>): Promise<NursingNote> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (note.note_type !== undefined) {
      updates.push(`note_type = $${paramIndex++}`);
      values.push(note.note_type);
    }
    if (note.note !== undefined) {
      updates.push(`note = $${paramIndex++}`);
      values.push(note.note);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await sql`
      UPDATE nursing_notes 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE note_id = $${paramIndex}
      RETURNING *
    `.apply(null, values);

    return convertDates(result[0], ['recorded_at', 'created_at', 'updated_at']) as NursingNote;
  }

  async deleteNursingNote(id: string): Promise<void> {
    await sql`DELETE FROM nursing_notes WHERE note_id = ${id}`;
  }

  // Vital Signs methods
  async getVitalSigns(patientId: string): Promise<VitalSign[]> {
    const result = await sql`SELECT * FROM vital_signs WHERE patient_id = ${patientId} ORDER BY recorded_at DESC`;
    return result.map(row => convertDates(row, ['recorded_at', 'created_at'])) as VitalSign[];
  }

  async createVitalSign(vital: InsertVitalSign): Promise<VitalSign> {
    const result = await sql`
      INSERT INTO vital_signs (
        patient_id, recorded_by, temperature, blood_pressure_systolic, 
        blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation
      )
      VALUES (
        ${vital.patient_id}, ${vital.recorded_by}, ${vital.temperature || null}, 
        ${vital.blood_pressure_systolic || null}, ${vital.blood_pressure_diastolic || null},
        ${vital.heart_rate || null}, ${vital.respiratory_rate || null}, ${vital.oxygen_saturation || null}
      )
      RETURNING *
    `;
    return convertDates(result[0], ['recorded_at', 'created_at']) as VitalSign;
  }

  // Treatment History methods
  async getTreatmentHistory(patientId: string): Promise<TreatmentHistory[]> {
    const result = await sql`
      SELECT * FROM treatment_history 
      WHERE patient_id = ${patientId} 
      ORDER BY completed_at DESC
    `;
    return result.map(row => convertDates(row, ['scheduled_time', 'completed_at', 'created_at'])) as TreatmentHistory[];
  }
}

export const storage = new PostgresStorage();
