# Ward Watch - Frontend & Backend Communication Guide

## Overview
Ward Watch is a full-stack web application built with React (frontend) and Express (backend). This guide explains how the frontend and backend communicate.

## Architecture

```
┌─────────────────┐         HTTP/HTTPS          ┌─────────────────┐
│                 │  ────────────────────────▶   │                 │
│   React Client  │         (Port 5000)          │  Express Server │
│   (Frontend)    │  ◀────────────────────────   │   (Backend)     │
│                 │      JSON Response           │                 │
└─────────────────┘                              └─────────────────┘
        │                                                 │
        │                                                 │
        ▼                                                 ▼
┌─────────────────┐                              ┌─────────────────┐
│  React Query    │                              │   PostgreSQL    │
│  (State Mgmt)   │                              │    Database     │
└─────────────────┘                              └─────────────────┘
```

## Project Structure

```
ward-watch/
├── client/                   # Frontend code
│   └── src/
│       ├── pages/           # Page components (Routes)
│       ├── components/      # Reusable UI components
│       ├── lib/            # Utilities & query client
│       └── contexts/       # React contexts (Auth, etc.)
├── server/                  # Backend code
│   ├── index.ts            # Express server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage interface
│   └── auth.ts             # Authentication logic
└── shared/                  # Shared between frontend & backend
    └── schema.ts           # TypeScript types & database schema
```

## How Frontend & Backend Communicate

### 1. Authentication Flow

**Login Process:**
```typescript
// Frontend: client/src/pages/LoginPage.tsx
const handleSubmit = async (e) => {
  await login(username, password);  // Calls AuthContext
  setLocation('/admin/dashboard');
};

// AuthContext: client/src/contexts/AuthContext.tsx
const login = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  setToken(data.token);
  localStorage.setItem('auth_token', data.token);
};

// Backend: server/routes.ts
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  // Validate credentials & return JWT token
  res.json({ token, admin });
});
```

**Protected Routes:**
```typescript
// All subsequent API calls include the token
fetch('/api/patients', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
});
```

### 2. Data Fetching with React Query

**Frontend Pattern:**
```typescript
// client/src/pages/AdminDashboard.tsx
const { data: patients = [], isLoading } = useQuery<Patient[]>({
  queryKey: ['/api/patients'],
  queryFn: async () => {
    const res = await fetch('/api/patients?discharged=false', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
  }
});
```

**Backend Pattern:**
```typescript
// server/routes.ts
app.get('/api/patients', authenticateToken, async (req, res) => {
  try {
    const discharged = req.query.discharged === 'true';
    const patients = await storage.getPatients(discharged);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});
```

### 3. Creating/Updating Data

**Frontend Pattern:**
```typescript
const addPatientMutation = useMutation({
  mutationFn: (data) => apiRequest('/api/patients', 'POST', {
    ipd_number: data.ipdNumber,
    patient_name: data.name,
    // ... other fields
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
    toast({ title: "Success", description: "Patient added" });
  }
});

// Using the mutation
addPatientMutation.mutate(formData);
```

**Backend Pattern:**
```typescript
app.post('/api/patients', authenticateToken, async (req, res) => {
  try {
    const patientData = req.body;
    const newPatient = await storage.createPatient(patientData);
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### 4. API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login & get JWT token | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| GET | `/api/patients` | Get all patients | Yes |
| POST | `/api/patients` | Create new patient | Yes |
| PATCH | `/api/patients/:id/discharge` | Discharge patient | Yes |
| GET | `/api/nursing-notes` | Get nursing notes | Yes |
| POST | `/api/nursing-notes` | Create nursing note | Yes |
| DELETE | `/api/nursing-notes/:id` | Delete nursing note | Yes |
| GET | `/api/timeline` | Get treatment timeline | Yes |
| GET | `/api/staff` | Get all staff | Yes |
| POST | `/api/staff` | Create staff member | Yes |
| GET | `/api/medications` | Get medications | Yes |
| POST | `/api/medications` | Create medication | Yes |

## Data Flow Example: Adding a Patient

```
1. User fills form in AddPatientModal
   ↓
2. Form submits to onSubmit handler
   ↓
3. Handler calls mutation: addPatientMutation.mutate(data)
   ↓
4. Mutation sends POST request to /api/patients
   ↓
5. Backend receives request, validates data
   ↓
6. Backend creates patient in database
   ↓
7. Backend returns new patient data
   ↓
8. Frontend receives response
   ↓
9. React Query invalidates cache: queryClient.invalidateQueries()
   ↓
10. Patient list automatically refetches & updates UI
```

## State Management

### React Query Cache
- **queryKey**: Unique identifier for cached data
- **Automatic refetching**: When component mounts or window refocuses
- **Manual invalidation**: After mutations to ensure fresh data

```typescript
// Hierarchical cache keys for better invalidation
queryKey: ['/api/patients', patientId]  // ✅ Good
queryKey: [`/api/patients/${patientId}`]  // ❌ Avoid
```

### Local Storage
- **auth_token**: JWT token for authentication
- Persists across page refreshes
- Cleared on logout

## Common Patterns

### 1. Loading States
```typescript
if (isLoading) return <div>Loading...</div>;
if (isError) return <div>Error loading data</div>;
return <DataTable data={data} />;
```

### 2. Optimistic Updates
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
  toast({ title: "Success" });
}
```

### 3. Error Handling
```typescript
try {
  await mutation.mutateAsync(data);
} catch (error) {
  toast({ 
    variant: "destructive", 
    description: error.message 
  });
}
```

## Development Workflow

### Running the Application
```bash
npm run dev
```
This starts both frontend (Vite) and backend (Express) on port 5000.

### Making Changes

**Frontend Changes:**
1. Edit files in `client/src/`
2. Vite hot-reloads automatically
3. Changes appear immediately in browser

**Backend Changes:**
1. Edit files in `server/`
2. Server restarts automatically
3. Refresh browser to see changes

**Schema Changes:**
1. Edit `shared/schema.ts`
2. Update both frontend types and backend database
3. Restart server for changes to take effect

### Adding New Features

**New API Endpoint:**
1. Define route in `server/routes.ts`
2. Add storage method in `server/storage.ts`
3. Use endpoint in frontend with React Query

**New Page:**
1. Create page component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Add navigation link in sidebar/header

## Best Practices

### Frontend
- ✅ Use React Query for all API calls
- ✅ Invalidate cache after mutations
- ✅ Show loading/error states
- ✅ Use TypeScript types from `shared/schema.ts`
- ✅ Keep components focused and reusable

### Backend
- ✅ Always validate request data
- ✅ Use authentication middleware
- ✅ Return appropriate HTTP status codes
- ✅ Handle errors gracefully
- ✅ Use storage interface for database operations

### Security
- ✅ Never expose JWT secret
- ✅ Validate all user input
- ✅ Use prepared statements (prevent SQL injection)
- ✅ Require authentication for sensitive endpoints
- ✅ Don't log sensitive information

## Debugging Tips

### Frontend Issues
1. Check browser console for errors
2. Inspect Network tab for API calls
3. Verify React Query DevTools (if installed)
4. Check localStorage for auth token

### Backend Issues
1. Check server logs in terminal
2. Verify database connection
3. Test endpoints with curl/Postman
4. Check authentication middleware

### Common Problems

**"401 Unauthorized"**
- Token expired or invalid
- Check if token exists in localStorage
- Try logging in again

**Data not updating**
- Forgot to invalidate React Query cache
- Add `queryClient.invalidateQueries()` after mutation

**CORS errors**
- Frontend and backend on different ports
- Ensure Vite proxy is configured correctly

## Testing

### Manual Testing
1. Use browser to test UI flows
2. Check Network tab for API calls
3. Verify data in database

### API Testing
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Get patients (with token)
curl -X GET http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Express.js Documentation](https://expressjs.com/)
- [Wouter (Routing)](https://github.com/molefrog/wouter)
- [Drizzle ORM](https://orm.drizzle.team/)

---

**Last Updated:** November 2024
