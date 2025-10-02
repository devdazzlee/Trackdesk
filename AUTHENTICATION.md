# Trackdesk Authentication System

This document outlines the professional cookie-based authentication system implemented for the Trackdesk affiliate management platform.

## Overview

The authentication system provides:

- **Secure cookie-based token storage** with HTTP-only cookies
- **User data persistence** in client-side accessible cookies
- **Role-based access control** (ADMIN, MANAGER, AFFILIATE)
- **Professional logout functionality** with proper cookie clearing
- **Server-side and client-side authentication** support
- **Next.js middleware integration** for route protection

## Architecture

### Backend Components

#### 1. Authentication Middleware (`backend/src/middleware/auth.ts`)

- **Token validation** from both Authorization headers and cookies
- **Cookie utility functions** for setting and clearing authentication cookies
- **Role-based middleware** (requireRole, requireAdmin, requireAffiliate)
- **Optional authentication** for public routes

#### 2. Authentication Controller (`backend/src/controllers/AuthController.ts`)

- **Login/Register endpoints** with automatic cookie setting
- **Logout endpoint** with cookie clearing
- **Profile management** endpoints
- **2FA support** (setup, verify, disable)

#### 3. Authentication Service (`backend/src/services/AuthService.ts`)

- **User registration** with automatic profile creation
- **Secure password hashing** with bcrypt
- **JWT token generation** with configurable expiration
- **Activity logging** for security audit trails

### Frontend Components

#### 1. Authentication Utilities (`frontend/lib/auth.ts`)

- **Client-side authentication** singleton class
- **Cookie management** utilities
- **Server-side authentication** helpers
- **Role-based access control** functions

#### 2. Authentication Context (`frontend/contexts/AuthContext.tsx`)

- **React Context** for global authentication state
- **Authentication hooks** (useAuth, useRole)
- **Higher-order components** for route protection
- **Automatic state synchronization** with cookies

#### 3. Next.js Middleware (`frontend/middleware.ts`)

- **Route protection** for authenticated pages
- **Automatic redirects** based on authentication status
- **Role-based access control** for admin routes
- **Redirect preservation** for login flow

## Cookie Configuration

### Security Features

- **HTTP-only cookies** for access tokens (prevents XSS)
- **Secure flag** in production (HTTPS only)
- **SameSite=strict** (prevents CSRF)
- **Configurable expiration** (7 days default)

### Cookie Structure

```typescript
// Access Token Cookie (HTTP-only)
accessToken: "jwt_token_here";

// User Data Cookie (Client accessible)
userData: '{"id":"user_id","email":"user@example.com","role":"AFFILIATE",...}';
```

## Usage Examples

### Client-Side Authentication

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password, rememberMe);
      // User is now authenticated and cookies are set
    } catch (error) {
      // Handle login error
    }
  };

  const handleLogout = async () => {
    await logout();
    // User is logged out and cookies are cleared
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.firstName}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Server-Side Authentication

```typescript
import { requireAuth, requireRole } from "@/lib/auth";

// Protect a page route
export default async function ProtectedPage() {
  const user = await requireAuth(); // Redirects to login if not authenticated

  return <div>Welcome, {user.firstName}!</div>;
}

// Protect an admin route
export default async function AdminPage() {
  const user = await requireRole(["ADMIN", "MANAGER"]);

  return <div>Admin panel</div>;
}
```

### Route Protection

```typescript
import { withAuth } from "@/contexts/AuthContext";

// Protect a component with authentication
const ProtectedComponent = withAuth(MyComponent);

// Protect with specific roles
const AdminComponent = withAuth(AdminPanel, ["ADMIN", "MANAGER"]);
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - User login with cookie setting
- `POST /api/auth/register` - User registration with cookie setting
- `POST /api/auth/logout` - User logout with cookie clearing
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change user password

### Security Features

- **Rate limiting** on authentication endpoints
- **Input validation** with Zod schemas
- **Password strength requirements** (minimum 8 characters)
- **Activity logging** for security monitoring
- **2FA support** for enhanced security

## Environment Configuration

### Backend Environment Variables

```env
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
NODE_ENV=production
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NODE_ENV=development
```

## Security Best Practices

### Implemented Security Measures

1. **HTTP-only cookies** for token storage
2. **Secure cookie flags** in production
3. **SameSite protection** against CSRF
4. **Password hashing** with bcrypt
5. **JWT token expiration** management
6. **Rate limiting** on auth endpoints
7. **Input validation** and sanitization
8. **Activity logging** for audit trails

### Additional Recommendations

1. **Enable HTTPS** in production
2. **Implement 2FA** for admin accounts
3. **Regular security audits** of authentication flows
4. **Monitor failed login attempts** for brute force protection
5. **Implement session management** for concurrent sessions

## Testing the Authentication System

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Test Authentication Flow

1. Navigate to `http://localhost:3000`
2. You should be redirected to `/auth/login`
3. Create a new account or login with existing credentials
4. You should be redirected to `/dashboard` with authentication cookies set
5. Test logout functionality to ensure cookies are cleared

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS is configured with credentials: true
2. **Cookie not set**: Check if cookie-parser middleware is installed and configured
3. **Authentication loops**: Verify middleware configuration and route patterns
4. **Token expiration**: Check JWT_SECRET and JWT_EXPIRES_IN configuration

### Debug Mode

Enable debug logging by setting `LOG_LEVEL=debug` in your backend environment.

## Contributing

When making changes to the authentication system:

1. **Test all authentication flows** thoroughly
2. **Update security documentation** if adding new features
3. **Ensure backward compatibility** with existing sessions
4. **Add appropriate error handling** for new endpoints
5. **Update environment configuration** as needed
