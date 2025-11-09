# Ward Watch - Master Data Management Guide

## Table of Contents
1. [What is Master Data Management?](#what-is-master-data-management)
2. [Accessing Master Data Management](#accessing-master-data-management)
3. [Understanding the Five Master Data Categories](#understanding-the-five-master-data-categories)
4. [How to Operate Master Data Management](#how-to-operate-master-data-management)
5. [How Master Data Connects to Other Tabs](#how-master-data-connects-to-other-tabs)
6. [Best Practices](#best-practices)
7. [Common Workflows](#common-workflows)

---

## What is Master Data Management?

**Master Data Management** is the foundation of the Ward Watch system. It's where you configure and maintain the core reference data that the entire hospital management system depends on. Think of it as your **catalog** or **library** of resources.

### Why is it important?

Before you can:
- Schedule a medication for a patient
- Order a medical procedure
- Request a laboratory investigation
- Assign staff to patients
- Organize patients by department

You must first define what medications, procedures, investigations, staff members, and departments exist in your hospital. This is what Master Data Management does.

### The Five Master Data Categories

1. **Medications** - Your hospital's medication catalog
2. **Procedures** - Medical procedures available at your facility
3. **Investigations** - Laboratory tests and diagnostic investigations
4. **Staff** - Doctors, nurses, and other healthcare workers
5. **Departments** - Hospital departments and units

---

## Accessing Master Data Management

### From the Admin Dashboard

1. **Login** to Ward Watch with your admin credentials
2. Navigate to the **Admin Dashboard**
3. Click on the **"Master Data"** tab in the navigation bar
   - This tab is located at the far right of the tab navigation
   - It will redirect you to a dedicated Master Data Management page

### Direct Access

You can also bookmark the Master Data page at: `/admin/master-data`

### Navigation

- **Back to Dashboard**: Click the "Back to Dashboard" button in the top-right corner to return to the main dashboard

---

## Understanding the Five Master Data Categories

### 1. Medications Tab

**Purpose**: Maintain your hospital's complete medication catalog.

**Information Stored**:
- **Medication Name**: The name of the drug (e.g., "Paracetamol", "Amoxicillin")
- **Dosage**: Standard dosage (e.g., "500mg", "250mg")
- **Form**: Medication form (e.g., "Tablet", "Syrup", "Injection")

**Example Entries**:
```
Name: Paracetamol
Dosage: 500mg
Form: Tablet

Name: Amoxicillin
Dosage: 250mg
Form: Capsule
```

### 2. Procedures Tab

**Purpose**: Define all medical procedures performed at your facility.

**Information Stored**:
- **Procedure Name**: Name of the procedure (e.g., "ECG", "X-Ray Chest")
- **Description**: Detailed description of what the procedure involves

**Example Entries**:
```
Name: ECG
Description: Electrocardiogram to assess heart rhythm and electrical activity

Name: Wound Dressing
Description: Cleaning and dressing of surgical or traumatic wounds
```

### 3. Investigations Tab

**Purpose**: Catalog all laboratory tests and diagnostic investigations.

**Information Stored**:
- **Investigation Name**: Name of the test (e.g., "Complete Blood Count", "Blood Sugar")
- **Description**: What the test measures
- **Normal Range**: Reference values for results (optional)

**Example Entries**:
```
Name: Complete Blood Count (CBC)
Description: Measures different components of blood
Normal Range: WBC: 4,000-11,000/μL, RBC: 4.5-5.5 million/μL

Name: Random Blood Sugar
Description: Blood glucose level at any time of day
Normal Range: 70-140 mg/dL
```

### 4. Staff Tab

**Purpose**: Maintain records of all hospital staff members.

**Information Stored**:
- **Staff Name**: Full name of the staff member
- **Role**: Either "Doctor" or "Nurse"
- **Department**: Which department they belong to
- **Contact**: Phone number or email (optional)

**Example Entries**:
```
Name: Dr. Sarah Johnson
Role: Doctor
Department: Emergency Medicine
Contact: sjohnson@hospital.com

Name: Michael Brown
Role: Nurse
Department: ICU
Contact: +1-555-0123
```

### 5. Departments Tab

**Purpose**: Organize your hospital's departmental structure.

**Information Stored**:
- **Department Name**: Name of the department (e.g., "Cardiology", "Pediatrics")

**Example Entries**:
```
Emergency Medicine
Intensive Care Unit (ICU)
Cardiology
Pediatrics
General Surgery
Orthopedics
```

---

## How to Operate Master Data Management

### Adding New Entries

#### Step-by-Step Process

1. **Select the appropriate tab** (Medications, Procedures, Investigations, Staff, or Departments)

2. **Click the "Add" button** (e.g., "Add Medication", "Add Procedure")
   - Located in the top-right corner of each card

3. **Fill in the form** with the required information
   - Required fields are marked and must be completed
   - Optional fields can be left blank

4. **Click "Save"** or "Create" to add the entry

5. **Confirmation**: You'll see a success message when the entry is created

#### Example: Adding a Medication

1. Click the **"Medications"** tab
2. Click **"Add Medication"** button
3. Fill in:
   - Medication Name: "Ibuprofen"
   - Dosage: "400mg"
   - Form: "Tablet"
4. Click **"Save"**
5. The medication now appears in your catalog

### Editing Existing Entries

1. **Find the entry** you want to edit in the table

2. **Click the Edit icon** (pencil icon) in the Actions column

3. **Modify the information** in the form that appears

4. **Click "Save"** to update the entry

5. **Confirmation**: You'll see a success message when updated

### Deleting Entries

1. **Find the entry** you want to remove

2. **Click the Delete icon** (trash icon) in the Actions column

3. **Confirm deletion** if prompted

4. **Warning**: Be careful when deleting! If this data is currently being used:
   - For medications: Check if any active medication orders exist
   - For staff: Check if they're assigned to any patients
   - For departments: Check if any staff members belong to it

---

## How Master Data Connects to Other Tabs

Master Data is the **foundation** that powers all other features in Ward Watch. Here's how each category connects to the rest of the system:

### Connection Overview

```
MASTER DATA (Foundation)
    ↓
OTHER DASHBOARD TABS (Operations)
    ↓
PATIENT CARE (Outcomes)
```

### 1. Medications Master Data → Medications Tab

**Master Data**: Your medication catalog (Paracetamol, Amoxicillin, etc.)

**Medications Tab Usage**:
- When creating a **medication order** for a patient
- You select from the medications you've defined in Master Data
- The dosage and form information pre-populate from the catalog
- You can then specify:
  - Which patient receives it
  - When it should be administered
  - Route of administration (PO, IV, IM, etc.)
  - Priority (High, Medium, Low)

**Example Workflow**:
1. Master Data: Create "Paracetamol 500mg Tablet"
2. Medications Tab: Order Paracetamol for Patient #IPD001
3. Timeline: See the scheduled medication at specific times
4. Nurses mark it complete when administered

### 2. Procedures Master Data → Procedures Tab

**Master Data**: Your procedure catalog (ECG, X-Ray, Wound Dressing, etc.)

**Procedures Tab Usage**:
- When scheduling a **procedure order** for a patient
- You select from the procedures defined in Master Data
- The description helps staff understand what's required
- You specify:
  - Which patient needs the procedure
  - When it should be performed
  - Priority level
  - Additional notes

**Example Workflow**:
1. Master Data: Create "ECG - Electrocardiogram"
2. Procedures Tab: Schedule ECG for Patient #IPD002
3. Timeline: ECG appears in today's treatment schedule
4. Staff completes the procedure and marks it done

### 3. Investigations Master Data → Investigations Tab

**Master Data**: Your lab tests catalog (CBC, Blood Sugar, Urine Culture, etc.)

**Investigations Tab Usage**:
- When ordering **laboratory investigations** for a patient
- You select from the investigations defined in Master Data
- The normal range helps interpret results
- You specify:
  - Which patient needs the test
  - When the sample should be collected
  - Priority (Urgent, Routine)
  - Where to record results

**Example Workflow**:
1. Master Data: Create "Complete Blood Count (CBC)"
2. Investigations Tab: Order CBC for Patient #IPD003
3. Timeline: Lab collection appears in today's schedule
4. Lab processes sample and records results
5. Results can be compared against normal range

### 4. Staff Master Data → Multiple Tabs

**Master Data**: Your healthcare team directory

**Used In**:

**a) Patients Tab**:
- **Assigning doctors** to patients
- **Assigning nurses** to patients
- When you register a new patient or update patient details
- You select from the staff members defined in Master Data

**b) Nursing Notes Tab**:
- **Recording who documented** each nursing note
- The "Recorded By" field pulls from your staff list
- Ensures accountability and traceability

**c) Treatment Timeline**:
- **Tracking who completed** medications, procedures, investigations
- When a treatment is marked complete
- The system records which staff member performed it

**Example Workflow**:
1. Master Data: Create "Dr. Sarah Johnson - Cardiologist"
2. Master Data: Create "Nurse Michael Brown - ICU"
3. Patients Tab: Admit new patient and assign Dr. Johnson as doctor
4. Patients Tab: Assign Nurse Brown to care for the patient
5. Nursing Notes: Nurse Brown records observation (auto-tagged)
6. Timeline: Dr. Johnson reviews and marks treatments complete

### 5. Departments Master Data → Staff & Organization

**Master Data**: Your hospital's departmental structure

**Used In**:

**a) Staff Management**:
- When adding or editing staff members
- You assign them to a department
- This helps organize your team by specialty

**b) Patient Organization**:
- Patients are assigned to wards/departments
- Helps in reporting and resource allocation

**c) Reporting & Analytics** (future feature):
- Department-wise statistics
- Workload distribution
- Resource planning

**Example Workflow**:
1. Master Data: Create "Intensive Care Unit (ICU)" department
2. Master Data: Create "Cardiology" department
3. Staff Tab: Assign Dr. Johnson to Cardiology
4. Staff Tab: Assign Nurse Brown to ICU
5. Patients Tab: Patient in ICU ward gets matched with ICU staff
6. Reports: See workload per department

---

## Data Flow Diagram

Here's how data flows through the system:

```
┌─────────────────────────────────────────────────────┐
│          MASTER DATA MANAGEMENT                     │
│  (One-time setup, updated as needed)               │
├─────────────────────────────────────────────────────┤
│  • Medications Catalog                              │
│  • Procedures Catalog                               │
│  • Investigations Catalog                           │
│  • Staff Directory                                  │
│  • Departments List                                 │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ Referenced by ↓
                  │
┌─────────────────┴───────────────────────────────────┐
│          DASHBOARD OPERATIONAL TABS                 │
│  (Daily operations, patient care)                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  OVERVIEW TAB (Timeline)                           │
│  • Shows all scheduled treatments for today        │
│  • Grouped by time                                 │
│  • Uses data from Medications, Procedures,         │
│    Investigations tabs                             │
│                                                     │
│  MEDICATIONS TAB                                    │
│  • Create medication orders                        │
│  • Selects from Medications Master Data            │
│  • Assigns to Patients                             │
│                                                     │
│  PROCEDURES TAB                                     │
│  • Schedule procedure orders                        │
│  • Selects from Procedures Master Data             │
│  • Assigns to Patients                             │
│                                                     │
│  INVESTIGATIONS TAB                                 │
│  • Order lab tests                                 │
│  • Selects from Investigations Master Data         │
│  • Assigns to Patients                             │
│                                                     │
│  PATIENTS TAB                                       │
│  • Register & manage patients                      │
│  • Assign Staff from Staff Master Data             │
│  • Categorize by Department                        │
│                                                     │
│  NURSING NOTES TAB                                  │
│  • Document patient observations                   │
│  • Tagged with Staff member (from Master Data)     │
│  • Linked to Patients                              │
│                                                     │
│  VITAL SIGNS TAB                                    │
│  • Record patient vital signs                      │
│  • Tagged with Staff member                        │
│  • Linked to Patients                              │
│                                                     │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ Results in ↓
                  │
┌─────────────────┴───────────────────────────────────┐
│          PATIENT CARE & OUTCOMES                    │
├─────────────────────────────────────────────────────┤
│  • Treatments administered                          │
│  • Tests completed                                  │
│  • Progress documented                              │
│  • Patient health monitored                         │
└─────────────────────────────────────────────────────┘
```

---

## Best Practices

### 1. Set Up Master Data First

**Before admitting your first patient**, make sure you have:
- ✅ Added all commonly used medications
- ✅ Created your procedure catalog
- ✅ Listed all available lab investigations
- ✅ Added all hospital departments
- ✅ Registered all staff members

**Why?** This prevents interruptions during patient care. You won't have to stop treating a patient to add a medication to the system.

### 2. Use Consistent Naming Conventions

**Medications**:
- Use generic names primarily
- Include strength in the name if multiple strengths exist
- Examples: "Paracetamol 500mg", "Paracetamol 1000mg"

**Procedures**:
- Use standard medical abbreviations
- Be descriptive but concise
- Examples: "ECG", "Chest X-Ray PA View", "Foley Catheter Insertion"

**Investigations**:
- Include test category if helpful
- Use common abbreviations
- Examples: "CBC (Complete Blood Count)", "RBS (Random Blood Sugar)"

### 3. Keep Descriptions Detailed

For procedures and investigations:
- Include what the test measures
- Note any special preparation needed
- Mention typical duration if relevant

**Example**:
```
Investigation: Fasting Blood Sugar (FBS)
Description: Blood glucose level after 8-12 hours of fasting. 
Patient should not eat or drink (except water) after midnight.
Normal Range: 70-100 mg/dL
```

### 4. Regular Maintenance

**Monthly Tasks**:
- Review medication catalog for new additions
- Update staff directory when new hires join
- Remove discontinued medications or procedures

**Quarterly Tasks**:
- Check for outdated dosage information
- Update investigation normal ranges if protocols change
- Verify all staff information is current

### 5. Data Accuracy

- **Double-check** medication dosages before saving
- **Verify** staff contact information is current
- **Review** normal ranges for investigations annually
- **Get approval** from pharmacy/medical team for new medications

---

## Common Workflows

### Workflow 1: Setting Up a New Hospital Department

**Scenario**: You're opening a new Pediatrics department.

**Steps**:

1. **Add Department**:
   - Go to Master Data > Departments tab
   - Click "Add Department"
   - Enter "Pediatrics"
   - Save

2. **Add Staff for Department**:
   - Go to Master Data > Staff tab
   - Add department doctors:
     - Name: "Dr. Emily Chen"
     - Role: Doctor
     - Department: Pediatrics
   - Add department nurses:
     - Name: "Lisa Martinez"
     - Role: Nurse
     - Department: Pediatrics

3. **Add Department-Specific Items**:
   - Add pediatric medications to Medications tab
   - Add pediatric procedures (e.g., "Infant Feeding Assessment")
   - Add pediatric investigations (e.g., "Growth Chart Assessment")

4. **Ready to Use**:
   - Now when admitting pediatric patients
   - You can assign them to the Pediatrics ward
   - Assign pediatric doctors and nurses
   - Order appropriate pediatric treatments

### Workflow 2: Adding a New Medication to the System

**Scenario**: Hospital pharmacy has added a new antibiotic to the formulary.

**Steps**:

1. **Verify Information**:
   - Confirm drug name: "Ceftriaxone"
   - Confirm dosage: "1g"
   - Confirm form: "Injection"

2. **Add to Master Data**:
   - Go to Master Data > Medications tab
   - Click "Add Medication"
   - Fill in:
     - Medication Name: "Ceftriaxone"
     - Dosage: "1g"
     - Form: "Injection"
   - Save

3. **Immediate Availability**:
   - Medication is now available system-wide
   - Doctors can order it for patients
   - It appears in the medication selection dropdown

4. **Best Practice**:
   - Inform medical staff via hospital communication
   - Update any relevant protocols or guidelines

### Workflow 3: Onboarding a New Staff Member

**Scenario**: A new nurse has joined the ICU team.

**Steps**:

1. **Ensure Department Exists**:
   - Check that "Intensive Care Unit (ICU)" exists in Departments
   - Add it if it doesn't exist

2. **Add Staff Member**:
   - Go to Master Data > Staff tab
   - Click "Add Staff"
   - Fill in:
     - Staff Name: "Jennifer Adams"
     - Role: Nurse
     - Department: Intensive Care Unit (ICU)
     - Contact: "jadams@hospital.com"
   - Save

3. **Assign to Patients**:
   - Go to Patients tab
   - Edit ICU patients
   - Assign Jennifer Adams as their nurse

4. **Nursing Documentation**:
   - Jennifer can now document nursing notes
   - Her name appears as "Recorded By"
   - All her actions are trackable

### Workflow 4: Preparing for Morning Rounds

**Scenario**: Daily preparation before medical rounds begin.

**Steps**:

1. **Review Patients** (Patients Tab):
   - Check all active patients
   - Verify doctor and nurse assignments
   - Update any discharges from previous day

2. **Check Timeline** (Overview Tab):
   - Review all scheduled treatments for today
   - Note any high-priority items
   - Identify potential conflicts or busy periods

3. **Plan Medications** (Medications Tab):
   - Review medication orders
   - Check for any expiring orders
   - Ensure all scheduled doses are in timeline

4. **Schedule Procedures** (Procedures Tab):
   - Add any new procedures ordered overnight
   - Adjust timing for optimal patient flow
   - Mark completed procedures from overnight shift

5. **Order Investigations** (Investigations Tab):
   - Add morning lab work orders
   - Schedule phlebotomy rounds
   - Plan for stat orders vs routine

All of this depends on having complete, accurate Master Data!

---

## Troubleshooting Common Issues

### Issue: "I can't find a medication when creating an order"

**Solution**: 
- The medication doesn't exist in Master Data yet
- Go to Master Data > Medications tab
- Add the medication first
- Then return to create your medication order

### Issue: "Staff member not appearing in dropdown"

**Solution**:
- Check Master Data > Staff tab
- Verify the staff member is added
- Ensure they have the correct role (Doctor vs Nurse)
- Check they're assigned to the right department

### Issue: "Accidentally deleted a medication that's in use"

**Prevention**:
- The system may prevent deletion if there are active orders
- Check the error message for details

**Recovery**:
- Re-add the medication with the exact same information
- Review any affected medication orders
- Contact system administrator if data recovery is needed

### Issue: "Department not showing for new staff member"

**Solution**:
- First create the department in Master Data > Departments
- Then add or edit the staff member
- The department dropdown will now include the new department

---

## Summary

**Master Data Management** is your hospital's foundation:

✅ **Set it up first** before operational use  
✅ **Maintain it regularly** to keep data current  
✅ **Use it everywhere** - it powers all other features  
✅ **Keep it accurate** for patient safety and efficiency  

**Remember**: Every medication order, procedure schedule, lab test, staff assignment, and patient categorization depends on the Master Data you maintain. Taking time to set it up properly will make your daily operations smooth and efficient.

---

**Questions or need help?** Review the Ward Watch README.md for additional technical details and API documentation.
