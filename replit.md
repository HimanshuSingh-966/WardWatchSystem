# Ward Watch - Hospital Management System

## Project Overview

Ward Watch is a comprehensive hospital management system designed for tracking patients, medications, procedures, investigations, and nursing care. The system features a public marketing landing page and an admin dashboard with time-grouped treatment timelines, real-time bulletin board notifications, and complete CRUD operations for all hospital entities.

## Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Direct Supabase client (not Drizzle)
- **Authentication**: JWT tokens with bcrypt password hashing
- **API**: RESTful API with Zod validation

### Frontend
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **UI Framework**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Design System**: Material Design 3 aesthetic
- **Typography**: Inter (UI), Poppins (marketing), JetBrains Mono (codes/timestamps)

## Project Structure

```
ward-watch/
├── client/
│   └── src/
│       ├── components/       # UI components
│       │   ├── ui/          # shadcn/ui components
│       │   ├── AdminHeader.tsx
│       │   ├── BulletinBoard.tsx
│       │   ├── PatientTable.tsx
│       │   ├── TimelineTable.tsx
│       │   └── ...
│       ├── contexts/         # React contexts
│       │   └── AuthContext.tsx
│       ├── pages/           # Page components
│       │   ├── LandingPage.tsx
│       │   ├── LoginPage.tsx
│       │   └── AdminDashboard.tsx
│       └── lib/             # Utilities
│           ├── queryClient.ts
│           └── utils.ts
├── server/
│   ├── db/
│   │   ├── schema.sql       # PostgreSQL schema
│   │   ├── seed.sql         # Sample data
│   │   ├── supabase.ts      # Supabase client
│   │   └── init-admin.ts    # Admin initialization script
│   ├── auth.ts              # Authentication utilities
│   ├── storage.ts           # Data access layer
│   ├── routes.ts            # API routes
│   └── index.ts             # Server entry point
└── shared/
    └── schema.ts            # Shared TypeScript schemas & Zod validation

```

## Database Schema

The system uses a comprehensive PostgreSQL database with the following main tables:

### Core Tables
- **admins** - Admin users with authentication (username/password)
- **patients** - Patient records (IPD number, demographics, bed, diagnosis)
- **staff** - Doctors and nurses (reference data)
- **departments** - Hospital departments

### Master Data
- **medications** - Medication catalog (name, dosage, form)
- **procedures** - Procedure catalog (name, description)
- **investigations** - Investigation catalog (name, description, normal range)
- **routes_of_administration** - Medication administration routes (PO, IV, IM, etc.)

### Orders & Tracking
- **medication_orders** - Scheduled medication orders with completion tracking
- **procedure_orders** - Scheduled procedure orders with completion tracking
- **investigation_orders** - Scheduled investigation orders with result tracking
- **nursing_notes** - Flexible nursing documentation (observation, assessment, progress)
- **vital_signs** - Patient vital sign records (temp, BP, HR, RR, SpO2)

### History & Notifications
- **treatment_history** - Complete audit trail of all treatments
- **notification_queue** - Real-time notifications for bulletin board
- **patient_staff_assignments** - Staff-patient relationships

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Create admin account
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current admin info (protected)

### Patients (Protected)
- `GET /api/patients?discharged=false` - List active patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create new patient
- `PATCH /api/patients/:id` - Update patient
- `PATCH /api/patients/:id/discharge` - Discharge patient
- `DELETE /api/patients/:id` - Delete patient

### Treatment Orders (Protected)
- `GET /api/medication-orders?patient_id=X&date=YYYY-MM-DD`
- `POST /api/medication-orders` - Create medication order
- `PATCH /api/medication-orders/:id` - Update order
- `PATCH /api/medication-orders/:id/complete` - Mark order complete
- `DELETE /api/medication-orders/:id` - Delete order
- Similar endpoints for `/api/procedure-orders` and `/api/investigation-orders`

### Timeline (Protected)
- `GET /api/timeline?date=YYYY-MM-DD&patient_id=X` - Get time-grouped treatment timeline

### Master Data (Protected)
- `GET/POST/PATCH/DELETE /api/medications` - Medication catalog
- `GET/POST/PATCH/DELETE /api/procedures` - Procedure catalog
- `GET/POST/PATCH/DELETE /api/investigations` - Investigation catalog
- `GET/POST /api/routes` - Routes of administration
- `GET/POST/PATCH/DELETE /api/staff` - Staff directory
- `GET/POST/PATCH/DELETE /api/departments` - Department list

### Nursing & Vitals (Protected)
- `GET/POST/PATCH/DELETE /api/nursing-notes?patient_id=X` - Nursing notes
- `GET /api/vital-signs/:patientId` - Patient vital signs
- `POST /api/vital-signs` - Record new vitals

## Environment Variables

Required environment variables (set in Replit Secrets):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon/public API key  
- `SESSION_SECRET` - Secret for JWT token signing (auto-configured)

## Setup Instructions

### 1. Database Setup

1. Create a Supabase project at https://app.supabase.com
2. Navigate to the SQL Editor in your Supabase dashboard
3. Copy and execute the contents of `server/db/schema.sql` to create all tables
4. (Optional) Execute `server/db/seed.sql` to populate master data

### 2. Create Admin User

Run the initialization script to create a default admin account:

```bash
npx tsx server/db/init-admin.ts
```

This creates:
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change this password immediately after first login!

### 3. Start the Application

The application is already configured to run with:
```bash
npm run dev
```

This starts both the Express backend (port 5000) and Vite frontend.

## Features

### Landing Page
- Hero section with healthcare imagery
- Feature highlights (real-time monitoring, comprehensive management, etc.)
- Benefits section
- Call-to-action for admin access

### Admin Dashboard

#### 1. Timeline View (Default Tab)
- Time-grouped treatment timeline showing all scheduled treatments
- Groups treatments by time slot and patient
- Displays patient info (IPD#, name, age, gender, bed, ward, diagnosis)
- Shows treatment details (medications, procedures, investigations)
- Inline completion checkboxes for marking treatments as done
- Priority indicators (High/Medium/Low)
- Filter by date and patient

#### 2. Patient Management Tab
- Comprehensive patient table with all demographics
- Search and filter capabilities
- Add new patient modal with full form:
  - IPD number (unique identifier)
  - Personal info (name, age, gender, contact, address)
  - Bed assignment (bed number, ward)
  - Diagnosis and admission date
  - Emergency contact
- Edit patient information
- Discharge patient functionality
- View patient treatment history

#### 3. Nursing Notes Tab
- Chronological list of all nursing notes
- Filter by patient
- Add new nursing note modal:
  - Patient selection
  - Note type (Observation, Assessment, Progress, etc.)
  - Note content
  - Recorded by (staff member)
  - Timestamp
- Edit and delete notes

#### 4. Bulletin Board
- Train station-style notification display
- Real-time alerts for upcoming treatments
- Click-to-acknowledge functionality
- Scrolling notification feed
- Priority-based highlighting
- Filter by acknowledged/unacknowledged

### Notifications
- Pop-up notification system for urgent alerts
- Toast notifications for user actions
- Real-time treatment reminders

## Design System

### Colors
Material Design 3 aesthetic with:
- Primary: Healthcare blue
- Accent: Medical green  
- Destructive: Alert red
- Muted backgrounds for cards and panels

### Typography
- **UI Text**: Inter (clean, modern sans-serif)
- **Marketing Headlines**: Poppins (friendly, approachable)
- **Patient IDs/Timestamps/Codes**: JetBrains Mono (monospace for data clarity)

### Components
All UI components use shadcn/ui built on Radix UI primitives:
- Buttons, Cards, Tables, Forms
- Dialogs, Dropdowns, Tooltips
- Badges, Tabs, Toasts

## Current Status

### ✅ Completed
- Complete backend API with authentication
- Database schema with 15+ tables
- Supabase integration
- Frontend component structure
- Landing page with marketing content
- Login page with JWT authentication
- Admin dashboard layout with tabs
- Header with notification bell and user menu
- Mock data UI implementations

### 🚧 In Progress
- Connecting frontend to backend API (Task 4)
- Replacing mock data with real API calls
- Timeline aggregation and bulletin board integration

### 📋 TODO
- Treatment order management UI
- Patient creation and editing forms
- Nursing notes CRUD functionality
- Master data management UI
- Vital signs tracking
- Real-time notifications via WebSocket
- Reports and analytics

## Development Notes

### Mock Data Locations
The following files contain mock data that needs to be replaced with API calls:
- `client/src/pages/AdminDashboard.tsx` - Timeline, patients, nursing notes, bulletin items
- Components are already built and just need data source updates

### Authentication Flow
1. User enters credentials on `/login`
2. POST to `/api/auth/login` returns JWT token
3. Token stored in localStorage
4. Token included in Authorization header for all protected API calls
5. Auth context provides `admin`, `token`, `login()`, `logout()` to entire app

### Data Flow
1. Components use TanStack Query hooks (`useQuery`, `useMutation`)
2. Query client automatically includes auth headers
3. Storage layer (SupabaseStorage) handles all database operations
4. Routes validate request bodies with Zod schemas
5. Responses use TypeScript types from `shared/schema.ts`

## Testing

### Manual Testing Checklist
- [ ] Register new admin user
- [ ] Login with credentials
- [ ] View patient list
- [ ] Create new patient
- [ ] Add medication order
- [ ] Mark treatment as complete
- [ ] Add nursing note
- [ ] View timeline grouped by time
- [ ] Bulletin board notifications
- [ ] Logout functionality

## Deployment

The application is designed to run on Replit with:
- Backend and frontend on same port (5000)
- Vite dev server in development
- Ready for Replit deployment/publishing

## Security Considerations

- JWT tokens expire after 24 hours
- Passwords hashed with bcrypt (10 rounds)
- All protected routes require valid authentication
- Input validation with Zod schemas
- SQL injection prevention via Supabase parameterized queries
- CORS configured for same-origin policy

## Future Enhancements

- WebSocket support for real-time updates
- Patient vital signs charting
- Medication administration records (MAR)
- Doctor's orders management
- Discharge summaries
- Reports and analytics dashboard
- Mobile-responsive design improvements
- Role-based access control (doctor vs nurse vs admin)
- Audit logs for compliance
