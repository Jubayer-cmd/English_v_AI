# Better Auth Email & Password Setup Guide

This guide covers the complete setup for Better Auth email and password authentication in your Voice AI project.

## ✅ What's Been Fixed

### Server-side Configuration (`server/src/auth.ts`)

- ✅ Enabled email and password authentication
- ✅ Added email verification with SMTP configuration
- ✅ Enabled welcome emails and password reset functionality
- ✅ Configured auto sign-in after registration
- ✅ Added proper session callbacks

### Server Routes (`server/src/index.ts`)

- ✅ Properly mounted Better Auth handlers
- ✅ Added protected route examples
- ✅ Added user profile endpoint
- ✅ Added sign-out endpoint
- ✅ Fixed CORS configuration

### Client Configuration (`client/src/lib/better-auth.ts`)

- ✅ Configured Better Auth client with auto-refresh
- ✅ Exported all necessary auth methods
- ✅ Set up proper base URL connection

### Database Schema (`server/prisma/schema.prisma`)

- ✅ Fixed duplicate fields in models
- ✅ Proper Better Auth model structure
- ✅ Cleaned up verification tokens

### Auth Store (`client/src/lib/auth-store.ts`)

- ✅ Integrated with Better Auth client
- ✅ Added proper session checking
- ✅ Added logout functionality
- ✅ Added error handling

## 🔧 Required Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/voice_ai_db"

# Email Configuration (REQUIRED for email verification)
EMAIL_FROM="noreply@yourdomain.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Server Configuration
PORT=3000
NODE_ENV="development"

# Better Auth Configuration
AUTH_SECRET="your-super-secret-key-here"
```

## 📧 Email Setup Instructions

### For Gmail:

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated password as `SMTP_PASS`

### For Other Email Providers:

Use your SMTP credentials from your email provider.

## 🚀 Setup Steps

1. **Install dependencies:**

   ```bash
   cd server && bun install
   cd ../client && bun install
   ```

2. **Set up environment variables:**

   - Copy the environment variables above to `server/.env`
   - Update with your actual database and email credentials

3. **Set up the database:**

   ```bash
   cd server
   bunx prisma generate
   bunx prisma migrate dev
   ```

4. **Start the servers:**

   ```bash
   # Terminal 1 - Start server
   cd server && bun run dev

   # Terminal 2 - Start client
   cd client && bun run dev
   ```

## 🔐 Authentication Features

Your Better Auth setup now includes:

- **User Registration** - Email/password signup with verification
- **User Login** - Email/password authentication
- **Email Verification** - Required before account activation
- **Password Reset** - Email-based password recovery
- **Welcome Emails** - Sent to new users
- **Session Management** - Automatic session handling
- **Protected Routes** - Server-side route protection
- **Auto Refresh** - Client-side session refresh

## 📡 API Endpoints

### Authentication Endpoints:

- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user
- `POST /auth/signout` - Logout user
- `POST /auth/verify-email` - Verify email address
- `POST /auth/reset-password` - Reset password

### Protected Endpoints:

- `GET /api/protected` - Example protected route
- `GET /api/user` - Get current user profile
- `POST /api/signout` - Sign out endpoint

## 🛠️ Client Usage

### Login:

```typescript
import { signIn } from "../lib/better-auth";

const result = await signIn.emailAndPassword({
  email: "user@example.com",
  password: "password123",
});
```

### Register:

```typescript
import { signUp } from "../lib/better-auth";

const result = await signUp.emailAndPassword({
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
});
```

### Check Session:

```typescript
import { getSession } from "../lib/better-auth";

const session = await getSession();
if (session?.data?.user) {
  // User is authenticated
}
```

## 🔍 Troubleshooting

### Common Issues:

1. **Email not sending:**

   - Check SMTP credentials
   - Verify email provider settings
   - Check firewall/network settings

2. **Database connection errors:**

   - Verify DATABASE_URL format
   - Ensure PostgreSQL is running
   - Check database permissions

3. **CORS errors:**

   - Verify client URL in server CORS config
   - Check credentials setting

4. **Session not persisting:**
   - Check AUTH_SECRET is set
   - Verify cookie settings
   - Check domain configuration

## 📝 Next Steps

1. **Customize email templates** - Better Auth supports custom email templates
2. **Add OAuth providers** - Configure Google, GitHub, etc.
3. **Implement role-based access** - Use the role field for permissions
4. **Add user profile management** - Extend user data and profile pages
5. **Set up production environment** - Configure for deployment

## 🎯 Testing

Test the authentication flow:

1. Register a new user
2. Check email verification
3. Login with credentials
4. Access protected routes
5. Test logout functionality
6. Test password reset

Your Better Auth email and password authentication is now properly configured and ready to use!
