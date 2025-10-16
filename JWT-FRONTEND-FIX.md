# JWT Frontend Authentication Fix 🎉

## The Problem

Your backend was working perfectly, but the frontend couldn't authenticate because of a **response structure mismatch**.

### Backend Response Structure
The backend wraps all API responses in a `data` object:

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "username": "testuser",
      "email": "test@example.com",
      "rating": 1200
    }
  }
}
```

### Frontend Expected Structure
But your frontend code was expecting:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "username": "testuser",
    "email": "test@example.com",
    "rating": 1200
  }
}
```

### What Was Happening
1. ✅ User registers/logs in
2. ✅ Backend returns `{ data: { accessToken, user } }`
3. ❌ Frontend tries to access `data.accessToken` but gets `undefined`
4. ❌ Frontend tries to access `data.user` but gets `undefined`
5. ❌ Token never gets stored in localStorage
6. ❌ Subsequent API calls fail with 401 Unauthorized

## The Fix Applied ✅

Updated **`src/services/api.ts`** to unwrap the backend responses:

### Auth API Functions
```typescript
export const authAPI = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', credentials);
    // Unwrap: backend returns { data: { accessToken, user } }
    return data.data || data; // ✅ Now returns { accessToken, user }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    // Unwrap: backend returns { data: { accessToken, user } }
    return data.data || data; // ✅ Now returns { accessToken, user }
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile');
    // Unwrap: backend returns { data: { user } }
    return data.data || data; // ✅ Now returns user object
  },
};
```

### Games API Functions
All game-related functions also unwrap responses:
- `createGame` - returns Game object
- `getActiveGames` - returns Game[] array
- `getGame` - returns Game object
- `getUserGames` - returns Game[] array
- `joinGame` - returns Game object
- `makeMove` - returns Game object
- `abandonGame` - returns Game object

### Users API Functions
User-related functions unwrap responses:
- `getUser` - returns User object
- `getAllUsers` - returns User[] array

## How It Works Now

### Registration Flow
1. User fills registration form
2. `authAPI.register()` sends request to backend
3. Backend responds: `{ data: { accessToken: "...", user: {...} } }`
4. Frontend unwraps: `data.data` → `{ accessToken: "...", user: {...} }`
5. `login(data.accessToken, data.user)` works correctly ✅
6. Token stored in localStorage ✅
7. User redirected to `/games` ✅

### Login Flow
1. User fills login form
2. `authAPI.login()` sends request to backend
3. Backend responds: `{ data: { accessToken: "...", user: {...} } }`
4. Frontend unwraps: `data.data` → `{ accessToken: "...", user: {...} }`
5. `login(data.accessToken, data.user)` works correctly ✅
6. Token stored in localStorage ✅
7. WebSocket connects with token ✅
8. User redirected to `/games` ✅

### Protected Routes
1. User makes API request (e.g., `gamesAPI.getActiveGames()`)
2. Axios interceptor adds: `Authorization: Bearer <token>`
3. Backend validates token ✅
4. Backend responds: `{ data: [ games ] }`
5. Frontend unwraps: `data.data` → `[ games ]`
6. Games displayed to user ✅

## Fallback Safety

The fix uses `data.data || data` which means:
- If backend wraps response → unwraps it ✅
- If backend doesn't wrap → uses as-is ✅
- Backwards compatible with both structures ✅

## Testing the Fix

### 1. Test Registration
```bash
# Open browser console (F12)
# Navigate to http://localhost:5173/register
# Register a new account

# Check localStorage:
localStorage.getItem('token')
# Should return: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Test Login
```bash
# Navigate to http://localhost:5173/login
# Login with existing account

# Check localStorage:
localStorage.getItem('token')
# Should return the JWT token
```

### 3. Test Protected Routes
```bash
# After login, navigate to /games
# Games page should load successfully
# Check Network tab → Headers should show:
# Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Test Token Expiration
```bash
# Clear localStorage:
localStorage.clear()

# Try accessing /games
# Should redirect to /login ✅
```

## Files Modified

- ✅ `src/services/api.ts` - Added response unwrapping to all API functions

## Files That Didn't Need Changes

- ✅ `src/store/authStore.ts` - Already correct
- ✅ `src/pages/RegisterPage.tsx` - Already correct
- ✅ `src/pages/LoginPage.tsx` - Already correct
- ✅ `src/services/socket.ts` - Already correct

## Authentication Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. POST /auth/register
       │    { username, email, password }
       ▼
┌─────────────────────────────────────┐
│         Backend API                 │
│  ✅ JWT verification working        │
└──────┬──────────────────────────────┘
       │
       │ 2. Response (wrapped)
       │    { data: { accessToken, user } }
       ▼
┌─────────────────────────────────────┐
│    Frontend api.ts (FIXED)          │
│  ✅ Unwraps: data.data → { ... }    │
└──────┬──────────────────────────────┘
       │
       │ 3. Returns unwrapped data
       │    { accessToken, user }
       ▼
┌─────────────────────────────────────┐
│    RegisterPage.tsx                 │
│  ✅ login(data.accessToken, ...)    │
└──────┬──────────────────────────────┘
       │
       │ 4. Store token
       ▼
┌─────────────────────────────────────┐
│    authStore (Zustand)              │
│  ✅ localStorage.setItem('token')   │
└──────┬──────────────────────────────┘
       │
       │ 5. All future requests
       │    Authorization: Bearer <token>
       ▼
┌─────────────────────────────────────┐
│    Protected API Calls              │
│  ✅ Token sent automatically        │
│  ✅ Backend validates token         │
│  ✅ Returns data                    │
└─────────────────────────────────────┘
```

## Summary

✅ **Problem Identified**: Backend wraps responses in `{ data: {...} }` but frontend expected direct structure

✅ **Solution Applied**: Updated all API functions to unwrap responses with `data.data || data`

✅ **Backwards Compatible**: Works with both wrapped and unwrapped responses

✅ **Ready to Test**: Start your dev server and test registration/login flow

## Next Steps

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open browser to `http://localhost:5173`

3. Test registration → login → access games page

4. Verify token in localStorage and Authorization headers

Your JWT authentication should now work perfectly! 🎉
