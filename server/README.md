# Voice AI Server

This is the backend server for the Voice AI application using Better Auth for authentication.

## Setup

1. Install dependencies:

```bash
bun install
```

2. Set up environment variables:
   Create a `.env` file in the server directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/voice_ai_db"

# Email Configuration (for email verification and password reset)
EMAIL_FROM="noreply@yourdomain.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Server Configuration
PORT=3000
NODE_ENV="development"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

3. Set up the database:

```bash
# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma migrate dev

# (Optional) Seed the database
bunx prisma db seed
```

4. Start the development server:

```bash
bun run dev
```

## Better Auth Configuration

The server is configured with Better Auth for email and password authentication with the following features:

- ✅ Email and password authentication
- ✅ Email verification
- ✅ Password reset functionality
- ✅ Welcome emails
- ✅ Auto sign-in after registration
- ✅ Session management
- ✅ Protected routes

## API Endpoints

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `POST /api/auth/send-verification-email` - Send email verification
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forget-password` - Initiate password reset
- `POST /api/auth/reset-password` - Complete password reset
- `GET /api/auth/session` - Get current session
- `GET /api/protected` - Protected route example
- `GET /api/user` - Get current user profile

## Email Setup

For email functionality to work, you need to configure SMTP settings:

1. **Gmail**: Use an App Password instead of your regular password
2. **Other providers**: Use your SMTP credentials

The email configuration supports:

- Email verification
- Welcome emails
- Password reset emails
