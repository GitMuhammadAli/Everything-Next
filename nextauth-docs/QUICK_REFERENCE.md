# 🚀 NextAuth.js Quick Reference

## 📦 Installation

```bash
npm install next-auth @next-auth/prisma-adapter @prisma/client
npm install -D prisma
npx prisma init
```

## 🔧 Essential Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start production server

# Database
npx prisma db push            # Update database schema
npx prisma generate           # Generate Prisma Client
npx prisma studio             # Open database GUI

# Utilities
openssl rand -base64 32       # Generate secret
```

## 🔑 Environment Variables

```bash
NEXTAUTH_SECRET=              # Generate with: openssl rand -base64 32
NEXTAUTH_URL=                 # http://localhost:3000 (dev)
DATABASE_URL=                 # Your database connection string

# Provider Credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
# ... other providers
```

## 📝 Common Code Snippets

### Client-Side: Get Session

```typescript
"use client";
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Not signed in</div>;
  
  return <div>Hello {session.user.name}</div>;
}
```

### Server-Side: Get Session

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Component() {
  const session = await getServerSession(authOptions);
  
  if (!session) return <div>Not signed in</div>;
  
  return <div>Hello {session.user.name}</div>;
}
```

### Sign In

```typescript
import { signIn } from "next-auth/react";

// Sign in with redirect
signIn("google");

// Sign in with callback URL
signIn("google", { callbackUrl: "/dashboard" });

// Sign in without redirect
signIn("google", { redirect: false });
```

### Sign Out

```typescript
import { signOut } from "next-auth/react";

// Sign out with redirect
signOut();

// Sign out with callback URL
signOut({ callbackUrl: "/" });

// Sign out without redirect
signOut({ redirect: false });
```

### Protect API Route

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  return Response.json({ data: "Protected data" });
}
```

## 🎯 Callbacks Cheat Sheet

### JWT Callback - Add Data to Token

```typescript
jwt({ token, user, account }) {
  if (user) {
    token.id = user.id;
    token.role = user.role;
  }
  if (account) {
    token.accessToken = account.access_token;
  }
  return token;
}
```

### Session Callback - Pass to Client

```typescript
session({ session, token }) {
  session.user.id = token.id;
  session.user.role = token.role;
  return session;
}
```

### Sign In Callback - Control Access

```typescript
signIn({ user, account }) {
  // Only allow specific domain
  if (user.email.endsWith("@company.com")) {
    return true;
  }
  return false;
}
```

### Redirect Callback - Control Navigation

```typescript
redirect({ url, baseUrl }) {
  if (url.startsWith("/")) return `${baseUrl}${url}`;
  if (new URL(url).origin === baseUrl) return url;
  return baseUrl;
}
```

## 🛡️ Route Protection

### Middleware Protection

```typescript
// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
```

### Component-Level Protection

```typescript
// Client
const { data: session } = useSession({
  required: true,
  onUnauthenticated() {
    redirect("/auth/signin");
  },
});

// Server
const session = await requireAuth(); // Custom helper
```

## 🗂️ Prisma Schema Template

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("user")
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

## 🔐 Provider Setup URLs

| Provider | Setup URL |
|----------|-----------|
| Google | https://console.cloud.google.com/ |
| GitHub | https://github.com/settings/developers |
| Facebook | https://developers.facebook.com/ |
| Twitter | https://developer.twitter.com/ |
| Discord | https://discord.com/developers/applications |

## ⚡ Common Patterns

### Get User ID

```typescript
// Client
const { data: session } = useSession();
const userId = session?.user?.id;

// Server
const session = await getServerSession(authOptions);
const userId = session?.user?.id;
```

### Check User Role

```typescript
const session = await getServerSession(authOptions);
const isAdmin = session?.user?.role === "admin";
```

### Access Provider Token

```typescript
// In JWT callback
jwt({ token, account }) {
  if (account) {
    token.accessToken = account.access_token;
  }
  return token;
}

// Later use
const session = await getServerSession(authOptions);
const accessToken = session.accessToken;
```

## 🚨 Troubleshooting

### Issue: "Invalid callback URL"
```bash
# Check callback URL is exactly:
http://localhost:3000/api/auth/callback/[provider]
# No trailing slash, correct provider name
```

### Issue: Session not updating
```typescript
import { useSession } from "next-auth/react";
const { update } = useSession();
await update(); // Force refresh
```

### Issue: TypeScript errors
```bash
# Restart TS server
# In VS Code: Ctrl+Shift+P → "Restart TS Server"
```

### Issue: Prisma errors
```bash
npx prisma generate
npx prisma db push
```

## 📱 Testing Checklist

- [ ] Can access sign-in page
- [ ] Can sign in with provider
- [ ] Session data appears correctly
- [ ] Protected routes redirect when not authenticated
- [ ] Can access protected routes when authenticated
- [ ] Can sign out successfully
- [ ] Middleware protects routes
- [ ] TypeScript has no errors

## 🎯 File Locations Quick Reference

```
Configuration:    src/app/api/auth/[...nextauth]/route.ts
Sign-in Page:     src/app/auth/signin/page.tsx
Middleware:       src/middleware.ts
Auth Helpers:     src/lib/auth.ts
Prisma Client:    src/lib/prisma.ts
Type Definitions: src/types/next-auth.d.ts
Auth Provider:    src/components/AuthProvider.tsx
Root Layout:      src/app/layout.tsx
Environment:      .env
Database Schema:  prisma/schema.prisma
```

## 🔗 Quick Links

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Provider List](https://next-auth.js.org/providers/)
- [Callbacks](https://next-auth.js.org/configuration/callbacks)
- [Session Strategy](https://next-auth.js.org/configuration/options#session)
- [Prisma Adapter](https://next-auth.js.org/adapters/prisma)

---

**Keep this file handy for quick reference! 📌**
