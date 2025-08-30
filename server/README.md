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

## Cloudflare R2 Storage Functions

The server includes Cloudflare R2 storage functions for file management:

- `uploadFile(file, options)` - Upload a file
- `updateFile(fileKey, file, userId)` - Update/replace a file
- `deleteFile(fileKey, userId)` - Delete a file
- `getFileInfo(fileKey)` - Get file information
- `listFiles(folder, limit)` - List files in a folder
- `getDownloadUrl(fileKey, expiresIn)` - Generate download URL for a file

### Usage Example

```typescript
import {
  uploadFile,
  deleteFile,
  getFileInfo,
  getDownloadUrl,
} from "./src/modules/storage/storage.service";

// Upload a file
const uploadResult = await uploadFile(fileInput.files[0], {
  folder: "uploads",
  userId: "user123",
});

if (uploadResult.success) {
  console.log("File uploaded:", uploadResult.url);
  console.log("File key:", uploadResult.key);
} else {
  console.error("Upload failed:", uploadResult.error);
}

// Get file information
const infoResult = await getFileInfo("uploads/1234567890-abc123.jpg");
if (infoResult.success) {
  console.log("File info:", infoResult.data);
}

// Delete a file
const deleteResult = await deleteFile(
  "uploads/1234567890-abc123.jpg",
  "user123",
);
if (deleteResult.success) {
  console.log("File deleted successfully");
} else {
  console.error("Delete failed:", deleteResult.error);
}

// Get download URL for a file
const downloadResult = await getDownloadUrl(
  "uploads/1234567890-abc123.jpg",
  3600,
); // 1 hour expiry
if (downloadResult.success) {
  console.log("Download URL:", downloadResult.data.url);
  console.log("Expires at:", downloadResult.data.expiresAt);
} else {
  console.error("Failed to generate download URL:", downloadResult.error);
}
```
