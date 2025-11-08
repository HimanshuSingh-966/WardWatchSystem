# Ward Watch - Frontend & Backend Communication Guide

## Overview
Ward Watch is a full-stack web application built with React (frontend) and Express (backend). The application follows a **schema-first** approach where all data models are defined in `shared/schema.ts` using Zod, ensuring type safety and validation across the entire stack.

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
│  React Query    │                              │   Storage Layer │
│  (Cache/State)  │                              │   (Interface)   │
└─────────────────┘                              └─────────────────┘
                                                          │
                                                          ▼
                                                  ┌─────────────────┐
                                                  │   PostgreSQL    │
                                                  │    Database     │
                                                  └─────────────────┘
```

## Project Structure

```
ward-watch/
├── client/                   # Frontend code
│   └── src/
│       ├── pages/           # Page components (Routes)
│       ├── components/      # Reusable UI components
│       ├── lib/
│       │   └── queryClient.ts  # React Query config & apiRequest
│       └── contexts/        # React contexts (Auth)
├── server/                  # Backend code
│   ├── index.ts            # Express server entry point
│   ├── routes.ts           # API routes (thin controllers)
│   ├── storage.ts          # Storage interface + implementation
│   ├── auth.ts             # JWT authentication middleware
│   └── db/
│       └── schema.sql      # PostgreSQL schema
└── shared/                  # Shared between frontend & backend
    └── schema.ts           # Zod schemas & TypeScript types
```

## Core Principles

### 1. Schema-First Development
All data models are defined once in `shared/schema.ts` using Zod:
- Frontend uses the types for TypeScript
- Backend uses them for validation
- Database schema mirrors the structure

### 2. Storage Abstraction Layer
The backend uses a storage interface (`IStorage`) that abstracts database operations:
- Routes stay thin (just validation and response formatting)
- All database logic is in the storage layer
- Easy to swap storage implementations (in-memory, PostgreSQL, etc.)

### 3. Automatic Authentication
React Query is configured with default headers that automatically include JWT tokens:
- No need to manually add auth headers to every request
- 401 responses automatically handled

## How Frontend & Backend Communicate

### 1. Authentication Flow

**Login Process:**
```typescript
// Frontend: client/src/contexts/AuthContext.tsx
const login = async (username: string, password: string) => {
  // Manual fetch for login (no auth token yet)
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  const data = await response.json();
  setAdmin(data.admin);
  setToken(data.token);
  localStorage.setItem('auth_token', data.token);
};

// Backend: server/routes.ts
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  const admin = await storage.getAdminByUsername(username);
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ adminId: admin.admin_id }, JWT_SECRET, {
    expiresIn: '24h',
  });
  
  res.json({ token, admin });
});
```

**Auth Token Management:**
All subsequent API calls automatically include the auth token via React Query's default configuration:
```typescript
// client/src/lib/queryClient.ts
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// This is used automatically by React Query for ALL requests
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),  // Auto-adds auth headers
    },
  },
});
```

### 2. Data Fetching with React Query

The queryKey automatically becomes the URL thanks to the default `queryFn`:

**Frontend Pattern:**
```typescript
// client/src/pages/AdminDashboard.tsx
import { useQuery } from "@tanstack/react-query";
import type { Patient } from "@shared/schema";

// Query key IS the URL - auth headers added automatically!
const { data: patients = [], isLoading, isError } = useQuery<Patient[]>({
  queryKey: ['/api/patients'],  // This becomes the fetch URL
});

// With query parameters
const { data: activePatients = [] } = useQuery<Patient[]>({
  queryKey: ['/api/patients?discharged=false'],
});
```

**Why this works:**
```typescript
// client/src/lib/queryClient.ts - Default queryFn
export const getQueryFn: <T>(options: { on401: UnauthorizedBehavior }) => 
  QueryFunction<T> = ({ on401 }) => async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
      headers: getAuthHeaders(),  // Automatically adds Bearer token!
    });
    
    if (on401 === "returnNull" && res.status === 401) {
      return null;
    }
    
    await throwIfResNotOk(res);
    return await res.json();
  };
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

// authenticateToken middleware from server/auth.ts
// - Verifies JWT token from Authorization header
// - Adds admin info to req.admin
// - Returns 401 if invalid
```

### 3. Creating/Updating Data

Mutations use `apiRequest` which automatically adds auth headers and handles errors:

**Frontend Pattern:**
```typescript
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { InsertPatient } from "@shared/schema";

const addPatientMutation = useMutation({
  mutationFn: async (data: InsertPatient) => {
    // apiRequest automatically adds Authorization header
    const res = await apiRequest('POST', '/api/patients', data);
    return await res.json();
  },
  onSuccess: () => {
    // Invalidate cache to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
    toast({ title: "Success", description: "Patient added" });
  },
  onError: (error: Error) => {
    toast({ 
      variant: "destructive", 
      description: error.message 
    });
  }
});

// Using the mutation
addPatientMutation.mutate({
  ipd_number: "IPD2024001",
  patient_name: "John Doe",
  age: 45,
  gender: "M",
  bed_number: "101",
  ward: "General Ward",
  diagnosis: "Fever",
  admission_date: "2024-11-08",
});
```

**apiRequest Helper:**
```typescript
// client/src/lib/queryClient.ts
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),  // Adds Bearer token automatically
    ...(data ? { "Content-Type": "application/json" } : {}),
  };
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  
  await throwIfResNotOk(res);  // Throws on non-2xx
  return res;
}
```

**Backend Pattern with Validation:**
```typescript
import { insertPatientSchema } from "@shared/schema";

app.post('/api/patients', authenticateToken, async (req, res) => {
  try {
    // Validate request body using Zod schema
    const validatedData = insertPatientSchema.parse(req.body);
    
    // Storage layer handles database interaction
    const newPatient = await storage.createPatient(validatedData);
    
    res.status(201).json(newPatient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Failed to create patient' });
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
