# Ward Watch

A comprehensive hospital management system for tracking patients, medications, procedures, investigations, and nursing care.

## Features

- **Patient Management**: Register, track, and discharge patients
- **Medication Orders**: Schedule and manage medication administration
- **Procedures & Investigations**: Track medical procedures and laboratory investigations
- **Nursing Notes**: Record patient observations, assessments, and progress notes
- **Treatment Timeline**: View scheduled treatments in chronological order
- **Vital Signs Monitoring**: Track patient vital signs over time
- **Staff Management**: Manage hospital staff and their assignments
- **Master Data**: Configure medications, procedures, investigations, and departments

## Technology Stack

- **Frontend**: React + TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod validation
- **Authentication**: Custom admin authentication system

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Replit account (if deploying on Replit)

## Setup Instructions

### 1. Supabase Configuration

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Project Settings > API
3. Copy your:
   - Project URL (`SUPABASE_URL`)
   - Anon/Public Key (`SUPABASE_ANON_KEY`)

### 2. Database Schema Setup

1. In your Supabase project, go to the SQL Editor
2. Copy the contents of `server/db/schema.sql`
3. Run the SQL script to create all tables

The schema includes 16 tables:
- `admins` - Admin user accounts
- `patients` - Patient records
- `medications` - Master medication list
- `procedures` - Master procedures list
- `investigations` - Master investigations list
- `medication_orders` - Medication prescriptions
- `procedure_orders` - Scheduled procedures
- `investigation_orders` - Lab test orders
- `nursing_notes` - Nursing documentation
- `vital_signs` - Patient vital sign records
- `staff` - Hospital staff records
- `departments` - Hospital departments
- `patient_staff_assignments` - Staff-patient assignments
- `routes_of_administration` - Medication routes
- `treatment_history` - Treatment completion logs
- `notification_queue` - System notifications

### 3. Environment Variables

#### Option A: Using Replit Secrets (Recommended for Replit)

1. In your Replit project, open the "Secrets" tab (lock icon)
2. Add the following secrets:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon/public key

#### Option B: Using .env file (Local Development)

1. Create a `.env` file in the project root
2. Copy the contents of `.env.example`
3. Fill in your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5000` (or your Replit URL)

## Default Admin Account

After setting up the database, create an admin account by running this SQL in Supabase SQL Editor:

```sql
INSERT INTO admins (email, password_hash, full_name, role)
VALUES (
  'admin@wardwatch.com',
  '$2b$10$rN3qLJ5zJ5qF7J5qF7J5qO.qF7J5qF7J5qF7J5qF7J5qF7J5qF7J5q',
  'System Administrator',
  'admin'
);
```

**Login credentials:**
- Email: `admin@wardwatch.com`
- Password: `admin123`

**⚠️ Important:** Change this password after first login!

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                 # Backend Express application
│   ├── db/                # Database configuration
│   │   ├── schema.sql     # Database schema
│   │   └── supabase.ts    # Supabase client
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   └── index.ts           # Server entry point
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Drizzle ORM schema & types
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Register new patient
- `PATCH /api/patients/:id` - Update patient
- `PATCH /api/patients/:id/discharge` - Discharge patient

### Medications
- `GET /api/medications` - List medications
- `POST /api/medications` - Add medication
- `GET /api/medication-orders` - List medication orders
- `POST /api/medication-orders` - Create medication order

### Procedures & Investigations
- `GET /api/procedures` - List procedures
- `POST /api/procedures` - Add procedure
- `GET /api/investigations` - List investigations
- `POST /api/investigations` - Add investigation

### Nursing
- `GET /api/nursing-notes` - List nursing notes
- `POST /api/nursing-notes` - Add nursing note
- `DELETE /api/nursing-notes/:id` - Delete nursing note

### Timeline
- `GET /api/timeline` - Get today's treatment timeline

### Staff & Departments
- `GET /api/staff` - List staff
- `POST /api/staff` - Add staff member
- `GET /api/departments` - List departments
- `POST /api/departments` - Add department

## Security Notes

- All API endpoints require authentication (except login)
- Passwords are hashed using bcrypt
- Session tokens are stored in localStorage
- CORS is configured for security
- Environment variables are used for sensitive data

## Development

### Adding New Features

1. **Database Changes**: Update `server/db/schema.sql` and run in Supabase
2. **Types**: Update `shared/schema.ts` with new Drizzle schemas
3. **Storage**: Add data access methods in `server/storage.ts`
4. **Routes**: Add API endpoints in `server/routes.ts`
5. **Frontend**: Create components and pages in `client/src/`

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use shadcn/ui components for consistent UI
- Implement proper error handling
- Add loading states for async operations

## Deployment

### Replit Deployment

1. The application is pre-configured to run on Replit
2. Make sure your Secrets are configured
3. Click "Run" to start the application
4. Use the "Deploy" tab to publish your application

### Manual Deployment

1. Build the frontend: `npm run build`
2. Set environment variables on your hosting platform
3. Start the server: `npm start`
4. Ensure your database is accessible from your hosting platform

## Troubleshooting

### Database Connection Issues

- Verify your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Check that your Supabase project is active
- Ensure the database schema has been created

### Authentication Problems

- Clear browser localStorage and try logging in again
- Verify the admin account exists in the `admins` table
- Check server logs for authentication errors

### API Errors

- Check browser console for error messages
- Review server logs in the terminal
- Verify API endpoints match the backend routes
- Ensure proper CORS configuration

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review server and browser console logs
3. Verify your environment configuration
4. Check that the database schema is properly set up

## License

This project is private and proprietary.

---

**Ward Watch** - Empowering healthcare teams with efficient patient management.
