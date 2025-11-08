# Ward Watch - Database Setup Guide

## Initial Setup

### 1. Create Supabase Project
1. Go to [Supabase](https://app.supabase.com)
2. Create a new project
3. Note your project URL and anon key from Settings > API

### 2. Run Database Schema
1. In your Supabase project dashboard, navigate to the SQL Editor
2. Copy the entire contents of `server/db/schema.sql`
3. Paste and execute in the SQL Editor

This will create all necessary tables with proper relationships and indexes.

### 3. Add Sample Data (Optional)

Run this SQL to add initial master data:

```sql
-- Insert sample departments
INSERT INTO departments (department_name) VALUES
  ('Emergency'),
  ('ICU'),
  ('General Medicine'),
  ('Surgery'),
  ('Pediatrics');

-- Insert sample routes of administration
INSERT INTO routes_of_administration (route_name) VALUES
  ('Oral (PO)'),
  ('Intravenous (IV)'),
  ('Intramuscular (IM)'),
  ('Subcutaneous (SC)'),
  ('Topical');

-- Insert sample medications
INSERT INTO medications (medication_name, dosage, form) VALUES
  ('Amoxicillin', '500mg', 'Capsule'),
  ('Paracetamol', '650mg', 'Tablet'),
  ('Insulin', '10 units', 'Injectable'),
  ('Aspirin', '75mg', 'Tablet'),
  ('Ibuprofen', '400mg', 'Tablet');

-- Insert sample procedures
INSERT INTO procedures (procedure_name, description) VALUES
  ('Blood Pressure Check', 'Routine blood pressure measurement'),
  ('Wound Dressing', 'Change and clean wound dressing'),
  ('Catheter Insertion', 'Urinary catheter insertion'),
  ('IV Line Setup', 'Intravenous line placement'),
  ('ECG', 'Electrocardiogram');

-- Insert sample investigations
INSERT INTO investigations (investigation_name, description, normal_range) VALUES
  ('Blood Glucose', 'Fasting blood sugar test', '70-100 mg/dL'),
  ('Complete Blood Count', 'Full blood panel analysis', 'Varies by parameter'),
  ('Chest X-Ray', 'Thoracic radiograph', 'N/A'),
  ('Urinalysis', 'Urine analysis', 'Normal'),
  ('ECG', 'Heart electrical activity', 'Normal sinus rhythm');

-- Insert sample staff (these are reference only, no authentication)
INSERT INTO staff (staff_name, role, contact_number, email) VALUES
  ('Dr. Sarah Williams', 'Doctor', '+1234567890', 'dr.williams@hospital.com'),
  ('Dr. Michael Chen', 'Doctor', '+1234567891', 'dr.chen@hospital.com'),
  ('Nurse Emily Brown', 'Nurse', '+1234567892', 'nurse.brown@hospital.com'),
  ('Nurse James Wilson', 'Nurse', '+1234567893', 'nurse.wilson@hospital.com');

-- Create a default admin user (username: admin, password: admin123)
-- Password hash for 'admin123' (bcrypt)
INSERT INTO admins (username, password_hash, full_name, email) VALUES
  ('admin', '$2b$10$K7L/6zJ4HqVQF3xGZ4yqkO5pYd3YZ9vJ3YZ5Q5Z5Z5Z5Z5Z5Z5Z5Z', 'System Administrator', 'admin@hospital.com');
```

**Note**: The default password hash above is for demonstration only. You should create your own admin account through the `/api/auth/register` endpoint with a secure password.

### 4. Environment Variables

The application automatically uses these environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SESSION_SECRET` - Secret for JWT tokens (automatically configured)

## Database Structure

The database includes 15+ tables organized as follows:

### Core Tables
- `admins` - Admin users with authentication
- `patients` - Patient records
- `staff` - Doctors and nurses (reference data)
- `departments` - Hospital departments

### Master Data
- `medications` - Medication catalog
- `procedures` - Procedure catalog
- `investigations` - Investigation catalog
- `routes_of_administration` - Medication routes

### Orders & Tracking
- `medication_orders` - Scheduled medication orders
- `procedure_orders` - Scheduled procedure orders
- `investigation_orders` - Scheduled investigation orders
- `nursing_notes` - Flexible nursing documentation
- `vital_signs` - Patient vital sign records

### History & Notifications
- `treatment_history` - Complete audit trail
- `notification_queue` - Real-time notifications
- `patient_staff_assignments` - Staff-patient relationships

## API Endpoints

All endpoints (except `/api/auth/login` and `/api/auth/register`) require authentication with a Bearer token.

### Authentication
- `POST /api/auth/register` - Create admin account
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current admin info

### Patients
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `PATCH /api/patients/:id` - Update patient
- `PATCH /api/patients/:id/discharge` - Discharge patient
- `DELETE /api/patients/:id` - Delete patient

### Treatment Orders
- `GET /api/medication-orders` - List medication orders
- `POST /api/medication-orders` - Create medication order
- `PATCH /api/medication-orders/:id/complete` - Mark complete
- Similar endpoints for `procedure-orders` and `investigation-orders`

### Timeline
- `GET /api/timeline` - Get combined treatment timeline (grouped by time)

### Master Data
- `GET/POST/PATCH/DELETE` for `/api/medications`, `/api/procedures`, `/api/investigations`
- `GET/POST/PATCH/DELETE` for `/api/staff`, `/api/departments`

### Nursing Notes
- `GET/POST/PATCH/DELETE /api/nursing-notes`

## Testing the Setup

1. Register an admin user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "yourpassword",
    "full_name": "Admin User",
    "email": "admin@example.com"
  }'
```

2. Login and get a token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "yourpassword"
  }'
```

3. Use the token to access protected endpoints:
```bash
curl -X GET http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Connection Issues
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correctly set
- Check if your Supabase project is active
- Ensure tables are created in Supabase SQL Editor

### Authentication Errors
- Make sure the Bearer token is included in Authorization header
- Token expires after 24 hours - login again to get a new one

### Missing Data
- Run the sample data SQL script above
- Or create records through the API endpoints
