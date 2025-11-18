# Production-Ready NextAuth Setup

This is a complete, production-ready authentication system built with NextAuth.js v4, featuring:

## Features

- ✅ **Multiple OAuth Providers**: Google, GitHub, Facebook, Twitter
- ✅ **Email/Password Authentication**: Credentials-based sign in
- ✅ **User Registration**: Sign up with email verification
- ✅ **Password Reset**: Forgot password flow with email reset links
- ✅ **Email Verification**: Required for new accounts
- ✅ **Database Integration**: Prisma ORM with PostgreSQL/MySQL/SQLite support
- ✅ **Secure Password Hashing**: bcryptjs with salt rounds
- ✅ **Session Management**: JWT-based sessions with 30-day expiration
- ✅ **Type Safety**: Full TypeScript support with extended types

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Option A: PostgreSQL (Recommended for Production)

1. Create a PostgreSQL database
2. Update `DATABASE_URL` in `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
   ```

#### Option B: MySQL

1. Create a MySQL database
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `DATABASE_URL` in `.env.local`:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/dbname"
   ```

#### Option C: SQLite (Development Only)

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in `.env.local`:
   ```
   DATABASE_URL="file:./dev.db"
   ```

### 3. Run Database Migrations

```bash
npx prisma generate
npx prisma db push
# Or for production:
# npx prisma migrate dev
```

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

#### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

#### OAuth Provider Setup

**Google:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:6600/api/auth/callback/google`

**GitHub:**
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:6600/api/auth/callback/github`

**Facebook:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs: `http://localhost:6600/api/auth/callback/facebook`

**Twitter:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Set Callback URL: `http://localhost:6600/api/auth/callback/twitter`

#### Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in `SMTP_PASSWORD`

For other providers, adjust `SMTP_HOST` and `SMTP_PORT` accordingly.

### 5. Start Development Server

```bash
npm run dev
```

## API Routes

### Authentication

- `POST /api/auth/signup` - Create a new account
- `GET /api/auth/verify-email?token=...` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### NextAuth Routes (Automatic)

- `GET/POST /api/auth/[...nextauth]` - NextAuth handler
- `GET /api/auth/callback/[provider]` - OAuth callbacks
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

## Pages

- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password?token=...` - Reset password
- `/auth/error` - Authentication error page

## Usage Examples

### Server Component

```typescript
import { getSession } from "@/app/api/auth/[...nextauth]/auth";

export default async function ServerComponent() {
  const session = await getSession();
  
  if (!session) {
    return <div>Not authenticated</div>;
  }
  
  return <div>Hello, {session.user.email}</div>;
}
```

### Client Component

```typescript
"use client";
import { useSession } from "next-auth/react";

export default function ClientComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;
  
  return <div>Hello, {session.user.email}</div>;
}
```

### Protected API Route

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  return NextResponse.json({ data: "Protected data" });
}
```

## Security Features

- Password hashing with bcryptjs (12 salt rounds)
- Email verification required for new accounts
- Secure token generation for password resets
- JWT session tokens with expiration
- CSRF protection (built into NextAuth)
- OAuth state parameter validation
- Rate limiting recommended for production

## Production Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Use HTTPS in production (`NEXTAUTH_URL` should be HTTPS)
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting
- [ ] Use environment-specific database
- [ ] Configure proper email service (SendGrid, AWS SES, etc.)
- [ ] Set up monitoring and error tracking
- [ ] Review and adjust session expiration
- [ ] Enable database connection pooling
- [ ] Set up backup strategy for database

## Troubleshooting

### Email not sending
- Check SMTP credentials
- Verify firewall/network settings
- Check spam folder
- For Gmail, ensure App Password is used (not regular password)

### OAuth not working
- Verify redirect URIs match exactly
- Check client ID and secret
- Ensure OAuth app is approved/published (for some providers)

### Database connection errors
- Verify `DATABASE_URL` format
- Check database server is running
- Ensure database user has proper permissions
- Run `npx prisma generate` after schema changes

## License

This authentication setup is production-ready and can be integrated into any Next.js project.

