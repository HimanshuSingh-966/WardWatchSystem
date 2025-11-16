import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateToken, authMiddleware, type AuthRequest } from "./auth";
import { 
  insertAdminSchema, insertPatientSchema, insertDepartmentSchema, 
  insertStaffSchema, insertMedicationSchema, insertProcedureSchema,
  insertInvestigationSchema, insertMedicationOrderSchema,
  insertProcedureOrderSchema, insertInvestigationOrderSchema,
  insertNursingNoteSchema, insertVitalSignSchema, insertRouteSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ==================== Authentication Routes ====================
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const admin = await storage.getAdminByUsername(username);
      
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await comparePassword(password, admin.password_hash);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!admin.is_active) {
        return res.status(403).json({ error: "Account is inactive" });
      }

      await storage.updateAdminLastLogin(admin.admin_id);
      const token = generateToken(admin.admin_id);

      res.json({
        token,
        admin: {
          admin_id: admin.admin_id,
          username: admin.username,
          full_name: admin.full_name,
          email: admin.email,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const admin = await storage.getAdmin(req.adminId!);
      
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      res.json({
        admin_id: admin.admin_id,
        username: admin.username,
        full_name: admin.full_name,
        email: admin.email,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertAdminSchema.parse(req.body);
      const password_hash = await hashPassword(validatedData.password);

      const admin = await storage.createAdmin({
        ...validatedData,
        password_hash,
      });

      res.status(201).json({
        admin_id: admin.admin_id,
        username: admin.username,
        full_name: admin.full_name,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ==================== Patient Routes ====================
  
  app.get("/api/patients", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { discharged } = req.query;
      const isDischargedFilter = discharged === 'true' ? true : discharged === 'false' ? false : undefined;
      const patients = await storage.getPatients(isDischargedFilter);
      res.json(patients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/patients/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(patient);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/patients/:id/details", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const patientDetails = await storage.getPatientDetails(req.params.id);
      if (!patientDetails) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(patientDetails);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/patients", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { doctor_id, nurse_id, ...patientData } = req.body;
      const validatedData = insertPatientSchema.parse(patientData);
      
      if (doctor_id) {
        const doctor = await storage.getStaffMember(doctor_id);
        if (!doctor) {
          return res.status(400).json({ error: "Invalid doctor ID" });
        }
        if (doctor.role !== 'Doctor') {
          return res.status(400).json({ error: "Staff member is not a doctor" });
        }
      }
      
      if (nurse_id) {
        const nurse = await storage.getStaffMember(nurse_id);
        if (!nurse) {
          return res.status(400).json({ error: "Invalid nurse ID" });
        }
        if (nurse.role !== 'Nurse') {
          return res.status(400).json({ error: "Staff member is not a nurse" });
        }
      }
      
      const patient = await storage.createPatient(validatedData);
      
      try {
        if (doctor_id) {
          await storage.updatePatientStaffAssignment(patient.patient_id, 'Doctor', doctor_id);
        }
        if (nurse_id) {
          await storage.updatePatientStaffAssignment(patient.patient_id, 'Nurse', nurse_id);
        }
        res.status(201).json(patient);
      } catch (assignmentError: any) {
        try {
          await storage.deletePatient(patient.patient_id);
          res.status(500).json({ error: `Failed to assign staff: ${assignmentError.message}` });
        } catch (rollbackError: any) {
          res.status(500).json({ 
            error: `Critical error: Failed to assign staff and rollback failed: ${assignmentError.message}` 
          });
        }
      }
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/patients/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { doctor_id, nurse_id, ...patientData } = req.body;
      const validatedData = insertPatientSchema.partial().parse(patientData);
      
      if (doctor_id !== undefined && doctor_id) {
        const doctor = await storage.getStaffMember(doctor_id);
        if (!doctor) {
          return res.status(400).json({ error: "Invalid doctor ID" });
        }
        if (doctor.role !== 'Doctor') {
          return res.status(400).json({ error: "Staff member is not a doctor" });
        }
      }
      
      if (nurse_id !== undefined && nurse_id) {
        const nurse = await storage.getStaffMember(nurse_id);
        if (!nurse) {
          return res.status(400).json({ error: "Invalid nurse ID" });
        }
        if (nurse.role !== 'Nurse') {
          return res.status(400).json({ error: "Staff member is not a nurse" });
        }
      }
      
      const originalPatient = await storage.getPatient(req.params.id);
      if (!originalPatient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      
      const originalAssignments = await storage.getPatientStaffAssignments(req.params.id);
      const originalDoctor = originalAssignments.find(a => a.assignment_role === 'Doctor');
      const originalNurse = originalAssignments.find(a => a.assignment_role === 'Nurse');
      
      const patient = await storage.updatePatient(req.params.id, validatedData);
      
      try {
        if (doctor_id !== undefined) {
          if (doctor_id) {
            await storage.updatePatientStaffAssignment(req.params.id, 'Doctor', doctor_id);
          } else {
            await storage.removePatientStaffAssignment(req.params.id, 'Doctor');
          }
        }
        if (nurse_id !== undefined) {
          if (nurse_id) {
            await storage.updatePatientStaffAssignment(req.params.id, 'Nurse', nurse_id);
          } else {
            await storage.removePatientStaffAssignment(req.params.id, 'Nurse');
          }
        }
        
        res.json(patient);
      } catch (assignmentError: any) {
        try {
          await storage.updatePatient(req.params.id, {
            ipd_number: originalPatient.ipd_number,
            patient_name: originalPatient.patient_name,
            age: originalPatient.age,
            gender: originalPatient.gender,
            contact_number: originalPatient.contact_number || undefined,
            address: originalPatient.address || undefined,
            bed_number: originalPatient.bed_number,
            ward: originalPatient.ward,
            diagnosis: originalPatient.diagnosis,
            admission_date: originalPatient.admission_date.toISOString().split('T')[0],
            emergency_contact: originalPatient.emergency_contact || undefined,
          });
          
          if (originalDoctor) {
            await storage.updatePatientStaffAssignment(req.params.id, 'Doctor', originalDoctor.staff_id);
          } else {
            await storage.removePatientStaffAssignment(req.params.id, 'Doctor').catch(() => {});
          }
          
          if (originalNurse) {
            await storage.updatePatientStaffAssignment(req.params.id, 'Nurse', originalNurse.staff_id);
          } else {
            await storage.removePatientStaffAssignment(req.params.id, 'Nurse').catch(() => {});
          }
        } catch (rollbackError: any) {
          return res.status(500).json({ 
            error: `Critical error: Failed to update staff assignments and rollback failed: ${assignmentError.message}` 
          });
        }
        res.status(500).json({ error: `Failed to update staff assignments: ${assignmentError.message}` });
      }
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/patients/:id/discharge", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const patient = await storage.dischargePatient(req.params.id);
      res.json(patient);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/patients/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deletePatient(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Department Routes ====================
  
  app.get("/api/departments", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/departments", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(validatedData);
      res.status(201).json(department);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/departments/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertDepartmentSchema.parse(req.body);
      const department = await storage.updateDepartment(req.params.id, validatedData);
      res.json(department);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/departments/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteDepartment(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Staff Routes ====================
  
  app.get("/api/staff", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const staff = await storage.getStaff();
      res.json(staff);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/staff", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertStaffSchema.parse(req.body);
      const staff = await storage.createStaff(validatedData);
      res.status(201).json(staff);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/staff/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertStaffSchema.partial().parse(req.body);
      const staff = await storage.updateStaff(req.params.id, validatedData);
      res.json(staff);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/staff/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteStaff(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Medication Routes ====================
  
  app.get("/api/medications", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const medications = await storage.getMedications();
      res.json(medications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/medications", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertMedicationSchema.parse(req.body);
      const medication = await storage.createMedication(validatedData);
      res.status(201).json(medication);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/medications/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertMedicationSchema.parse(req.body);
      const medication = await storage.updateMedication(req.params.id, validatedData);
      res.json(medication);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/medications/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteMedication(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Procedure Routes ====================
  
  app.get("/api/procedures", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const procedures = await storage.getProcedures();
      res.json(procedures);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/procedures", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertProcedureSchema.parse(req.body);
      const procedure = await storage.createProcedure(validatedData);
      res.status(201).json(procedure);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/procedures/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertProcedureSchema.parse(req.body);
      const procedure = await storage.updateProcedure(req.params.id, validatedData);
      res.json(procedure);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/procedures/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteProcedure(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Investigation Routes ====================
  
  app.get("/api/investigations", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const investigations = await storage.getInvestigations();
      res.json(investigations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/investigations", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertInvestigationSchema.parse(req.body);
      const investigation = await storage.createInvestigation(validatedData);
      res.status(201).json(investigation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/investigations/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertInvestigationSchema.parse(req.body);
      const investigation = await storage.updateInvestigation(req.params.id, validatedData);
      res.json(investigation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/investigations/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteInvestigation(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Route of Administration Routes ====================
  
  app.get("/api/routes", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const routes = await storage.getRoutes();
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/routes", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(validatedData);
      res.status(201).json(route);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ==================== Medication Order Routes ====================
  
  app.get("/api/medication-orders", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { patient_id, date } = req.query;
      const orders = await storage.getMedicationOrders(
        patient_id as string | undefined,
        date as string | undefined
      );
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/medication-orders", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertMedicationOrderSchema.parse({
        ...req.body,
        created_by: req.adminId,
      });
      const order = await storage.createMedicationOrder(validatedData);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/medication-orders/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertMedicationOrderSchema.partial().parse(req.body);
      const order = await storage.updateMedicationOrder(req.params.id, validatedData);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/medication-orders/:id/complete", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const order = await storage.completeMedicationOrder(req.params.id, req.adminId!);
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/medication-orders/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteMedicationOrder(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Procedure Order Routes ====================
  
  app.get("/api/procedure-orders", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { patient_id, date } = req.query;
      const orders = await storage.getProcedureOrders(
        patient_id as string | undefined,
        date as string | undefined
      );
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/procedure-orders", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertProcedureOrderSchema.parse({
        ...req.body,
        created_by: req.adminId,
      });
      const order = await storage.createProcedureOrder(validatedData);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/procedure-orders/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertProcedureOrderSchema.partial().parse(req.body);
      const order = await storage.updateProcedureOrder(req.params.id, validatedData);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/procedure-orders/:id/complete", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const order = await storage.completeProcedureOrder(req.params.id, req.adminId!);
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/procedure-orders/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteProcedureOrder(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Investigation Order Routes ====================
  
  app.get("/api/investigation-orders", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { patient_id, date } = req.query;
      const orders = await storage.getInvestigationOrders(
        patient_id as string | undefined,
        date as string | undefined
      );
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/investigation-orders", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertInvestigationOrderSchema.parse({
        ...req.body,
        created_by: req.adminId,
      });
      const order = await storage.createInvestigationOrder(validatedData);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/investigation-orders/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertInvestigationOrderSchema.partial().parse(req.body);
      const order = await storage.updateInvestigationOrder(req.params.id, validatedData);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/investigation-orders/:id/complete", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { result_value } = req.body;
      const order = await storage.completeInvestigationOrder(req.params.id, req.adminId!, result_value);
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/investigation-orders/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteInvestigationOrder(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Nursing Notes Routes ====================
  
  app.get("/api/nursing-notes", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { patient_id } = req.query;
      const notes = await storage.getNursingNotes(patient_id as string | undefined);
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/nursing-notes", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertNursingNoteSchema.parse(req.body);
      const note = await storage.createNursingNote(validatedData);
      res.status(201).json(note);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/nursing-notes/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertNursingNoteSchema.partial().parse(req.body);
      const note = await storage.updateNursingNote(req.params.id, validatedData);
      res.json(note);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/nursing-notes/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      await storage.deleteNursingNote(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Vital Signs Routes ====================
  
  app.get("/api/vital-signs/:patientId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const vitals = await storage.getVitalSigns(req.params.patientId);
      res.json(vitals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/vital-signs", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertVitalSignSchema.parse(req.body);
      const vital = await storage.createVitalSign(validatedData);
      res.status(201).json(vital);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ==================== Treatment History Routes ====================
  
  app.get("/api/treatment-history/all", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const history = await storage.getAllPatientsWithHistory();
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/treatment-history/:patientId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const history = await storage.getTreatmentHistory(req.params.patientId);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Timeline Route (Combined View) ====================
  
  app.get("/api/timeline", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { date, patient_id } = req.query;
      
      // Fetch all order types in parallel
      const [medicationOrders, procedureOrders, investigationOrders, patients] = await Promise.all([
        storage.getMedicationOrders(patient_id as string | undefined, date as string | undefined),
        storage.getProcedureOrders(patient_id as string | undefined, date as string | undefined),
        storage.getInvestigationOrders(patient_id as string | undefined, date as string | undefined),
        storage.getPatients(false), // Only active patients
      ]);

      // Get medications, procedures, and investigations for details
      const [medications, procedures, investigations, staff] = await Promise.all([
        storage.getMedications(),
        storage.getProcedures(),
        storage.getInvestigations(),
        storage.getStaff(),
      ]);

      // Fetch all patient staff assignments
      const patientAssignments = await Promise.all(
        patients.map(p => storage.getPatientStaffAssignments(p.patient_id))
      );

      // Create lookup maps for fast access
      const patientMap = new Map(patients.map(p => [p.patient_id, p]));
      const medicationMap = new Map(medications.map(m => [m.medication_id, m]));
      const procedureMap = new Map(procedures.map(p => [p.procedure_id, p]));
      const investigationMap = new Map(investigations.map(i => [i.investigation_id, i]));
      const staffMap = new Map(staff.map(s => [s.staff_id, s]));

      // Create patient-to-staff mapping
      const patientStaffMap = new Map<string, { doctor: any; nurse: any }>();
      patients.forEach((patient, index) => {
        const assignments = patientAssignments[index];
        const doctorAssignment = assignments.find(a => a.assignment_role === 'Doctor');
        const nurseAssignment = assignments.find(a => a.assignment_role === 'Nurse');
        
        patientStaffMap.set(patient.patient_id, {
          doctor: doctorAssignment ? staffMap.get(doctorAssignment.staff_id) : null,
          nurse: nurseAssignment ? staffMap.get(nurseAssignment.staff_id) : null,
        });
      });

      // Combine all orders with enriched data
      const timeline: any[] = [];

      medicationOrders.forEach(order => {
        const patient = patientMap.get(order.patient_id);
        const medication = medicationMap.get(order.medication_id);
        const staffInfo = patientStaffMap.get(order.patient_id);
        if (patient && medication) {
          timeline.push({
            time: order.scheduled_time,
            patient: {
              id: patient.patient_id,
              ipdNumber: patient.ipd_number,
              name: patient.patient_name,
              age: patient.age,
              gender: patient.gender,
              bed: patient.bed_number,
              ward: patient.ward,
              diagnosis: patient.diagnosis,
              doctor: staffInfo?.doctor?.staff_name || null,
              nurse: staffInfo?.nurse?.staff_name || null,
            },
            treatment: {
              id: order.order_id,
              type: 'medication',
              name: medication.medication_name,
              details: order.dosage_amount,
              isCompleted: order.is_completed,
              priority: order.priority,
            },
          });
        }
      });

      procedureOrders.forEach(order => {
        const patient = patientMap.get(order.patient_id);
        const procedure = procedureMap.get(order.procedure_id);
        const staffInfo = patientStaffMap.get(order.patient_id);
        if (patient && procedure) {
          const time = new Date(order.scheduled_time).toTimeString().slice(0, 5);
          timeline.push({
            time,
            patient: {
              id: patient.patient_id,
              ipdNumber: patient.ipd_number,
              name: patient.patient_name,
              age: patient.age,
              gender: patient.gender,
              bed: patient.bed_number,
              ward: patient.ward,
              diagnosis: patient.diagnosis,
              doctor: staffInfo?.doctor?.staff_name || null,
              nurse: staffInfo?.nurse?.staff_name || null,
            },
            treatment: {
              id: order.order_id,
              type: 'procedure',
              name: procedure.procedure_name,
              details: '',
              isCompleted: order.is_completed,
              priority: order.priority,
            },
          });
        }
      });

      investigationOrders.forEach(order => {
        const patient = patientMap.get(order.patient_id);
        const investigation = investigationMap.get(order.investigation_id);
        const staffInfo = patientStaffMap.get(order.patient_id);
        if (patient && investigation) {
          const time = new Date(order.scheduled_time).toTimeString().slice(0, 5);
          timeline.push({
            time,
            patient: {
              id: patient.patient_id,
              ipdNumber: patient.ipd_number,
              name: patient.patient_name,
              age: patient.age,
              gender: patient.gender,
              bed: patient.bed_number,
              ward: patient.ward,
              diagnosis: patient.diagnosis,
              doctor: staffInfo?.doctor?.staff_name || null,
              nurse: staffInfo?.nurse?.staff_name || null,
            },
            treatment: {
              id: order.order_id,
              type: 'investigation',
              name: investigation.investigation_name,
              details: order.result_value || '',
              isCompleted: order.is_completed,
              priority: order.priority,
            },
          });
        }
      });

      // Group by time and patient
      const grouped = timeline.reduce((acc, item) => {
        const key = `${item.time}-${item.patient.ipdNumber}`;
        if (!acc[key]) {
          acc[key] = {
            time: item.time,
            patient: item.patient,
            treatments: [],
          };
        }
        acc[key].treatments.push(item.treatment);
        return acc;
      }, {} as Record<string, any>);

      // Sort by time first, then by patient name within same time
      const sortedTimeline = Object.values(grouped).sort((a: any, b: any) => {
        // Compare times first
        if (a.time !== b.time) {
          return a.time.localeCompare(b.time);
        }
        // If same time, sort by patient name
        return a.patient.name.localeCompare(b.patient.name);
      });

      res.json(sortedTimeline);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== Notifications Route ====================
  
  app.get("/api/notifications/pending", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { type } = req.query; // Filter by treatment type: 'medication', 'procedure', 'investigation', or undefined for all
      const now = new Date();
      const lookAheadMinutes = 15; // Look ahead 15 minutes
      const lookAheadTime = new Date(now.getTime() + lookAheadMinutes * 60000);
      
      // Helper function to create datetime from time string for today or tomorrow
      const createDateTimeFromTime = (timeString: string): Date => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const todayDate = new Date(now);
        todayDate.setHours(hours, minutes, 0, 0);
        
        // If scheduled time has passed today and is more than 12 hours ago, assume it's for tomorrow
        if (todayDate < now && (now.getTime() - todayDate.getTime()) > 12 * 60 * 60000) {
          todayDate.setDate(todayDate.getDate() + 1);
        }
        
        return todayDate;
      };
      
      // Fetch all active orders
      const [medicationOrders, procedureOrders, investigationOrders, patients] = await Promise.all([
        storage.getMedicationOrders(),
        storage.getProcedureOrders(),
        storage.getInvestigationOrders(),
        storage.getPatients(false),
      ]);

      // Get master data
      const [medications, procedures, investigations] = await Promise.all([
        storage.getMedications(),
        storage.getProcedures(),
        storage.getInvestigations(),
      ]);

      // Create lookup maps
      const patientMap = new Map(patients.map(p => [p.patient_id, p]));
      const medicationMap = new Map(medications.map(m => [m.medication_id, m]));
      const procedureMap = new Map(procedures.map(p => [p.procedure_id, p]));
      const investigationMap = new Map(investigations.map(i => [i.investigation_id, i]));

      const notifications: any[] = [];

      // Check medication orders (if no filter or filter is 'medication')
      if (!type || type === 'medication') {
        medicationOrders.forEach(order => {
          if (!order.is_completed) {
            const scheduledDateTime = createDateTimeFromTime(order.scheduled_time);
            
            // Include if overdue OR within look-ahead window
            if (scheduledDateTime < now || scheduledDateTime <= lookAheadTime) {
              const patient = patientMap.get(order.patient_id);
              const medication = medicationMap.get(order.medication_id);
              if (patient && medication) {
                const isOverdue = scheduledDateTime < now;
                notifications.push({
                  id: order.order_id,
                  treatmentType: 'medication',
                  message: `${medication.medication_name}${order.dosage_amount ? ` - ${order.dosage_amount}` : ''} ${isOverdue ? 'overdue' : 'due'} for ${patient.patient_name}`,
                  patientName: patient.patient_name,
                  patientId: patient.patient_id,
                  ipdNumber: patient.ipd_number,
                  bedNumber: patient.bed_number,
                  scheduledTime: order.scheduled_time,
                  scheduledDateTime,
                  priority: order.priority,
                  isOverdue,
                  treatmentName: medication.medication_name,
                  details: order.dosage_amount || '',
                });
              }
            }
          }
        });
      }

      // Check procedure orders (if no filter or filter is 'procedure')
      if (!type || type === 'procedure') {
        procedureOrders.forEach(order => {
          if (!order.is_completed) {
            const scheduledDateTime = new Date(order.scheduled_time);
            
            // Include if overdue OR within look-ahead window
            if (scheduledDateTime < now || scheduledDateTime <= lookAheadTime) {
              const patient = patientMap.get(order.patient_id);
              const procedure = procedureMap.get(order.procedure_id);
              if (patient && procedure) {
                const isOverdue = scheduledDateTime < now;
                const timeString = scheduledDateTime.toTimeString().slice(0, 5);
                notifications.push({
                  id: order.order_id,
                  treatmentType: 'procedure',
                  message: `${procedure.procedure_name} ${isOverdue ? 'overdue' : 'due'} for ${patient.patient_name}`,
                  patientName: patient.patient_name,
                  patientId: patient.patient_id,
                  ipdNumber: patient.ipd_number,
                  bedNumber: patient.bed_number,
                  scheduledTime: timeString,
                  scheduledDateTime,
                  priority: order.priority,
                  isOverdue,
                  treatmentName: procedure.procedure_name,
                  details: '',
                });
              }
            }
          }
        });
      }

      // Check investigation orders (if no filter or filter is 'investigation')
      if (!type || type === 'investigation') {
        investigationOrders.forEach(order => {
          if (!order.is_completed) {
            const scheduledDateTime = new Date(order.scheduled_time);
            
            // Include if overdue OR within look-ahead window
            if (scheduledDateTime < now || scheduledDateTime <= lookAheadTime) {
              const patient = patientMap.get(order.patient_id);
              const investigation = investigationMap.get(order.investigation_id);
              if (patient && investigation) {
                const isOverdue = scheduledDateTime < now;
                const timeString = scheduledDateTime.toTimeString().slice(0, 5);
                notifications.push({
                  id: order.order_id,
                  treatmentType: 'investigation',
                  message: `${investigation.investigation_name} ${isOverdue ? 'overdue' : 'due'} for ${patient.patient_name}`,
                  patientName: patient.patient_name,
                  patientId: patient.patient_id,
                  ipdNumber: patient.ipd_number,
                  bedNumber: patient.bed_number,
                  scheduledTime: timeString,
                  scheduledDateTime,
                  priority: order.priority,
                  isOverdue,
                  treatmentName: investigation.investigation_name,
                  details: '',
                });
              }
            }
          }
        });
      }

      // Sort by overdue status, then scheduled time, then priority
      notifications.sort((a, b) => {
        // Overdue items first
        if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
        
        // Then by scheduled time (using actual DateTime for proper comparison)
        const timeDiff = a.scheduledDateTime.getTime() - b.scheduledDateTime.getTime();
        if (timeDiff !== 0) return timeDiff;
        
        // Finally by priority
        const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
        return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
      });

      // Remove scheduledDateTime before sending (not needed in response)
      const response = notifications.map(n => {
        const { scheduledDateTime, ...rest } = n;
        return rest;
      });

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
