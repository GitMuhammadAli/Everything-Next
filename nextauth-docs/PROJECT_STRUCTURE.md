# 🏗️ Project Structure Guide

## What You're Going to Build

A complete authentication system with:
- 🔐 Multiple OAuth providers (Google, GitHub, etc.)
- 📱 Beautiful sign-in page
- 🛡️ Protected routes
- 👤 User dashboard and profile
- 🔒 Secure session management

---

## Final File Structure

```
your-project/
│
├── 📁 src/
│   │
│   ├── 📁 app/
│   │   │
│   │   ├── 📁 api/
│   │   │   └── 📁 auth/
│   │   │       └── 📁 [...nextauth]/
│   │   │           └── 📄 route.ts              ← Main NextAuth config (THE BRAIN)
│   │   │
│   │   ├── 📁 auth/
│   │   │   └── 📁 signin/
│   │   │       └── 📄 page.tsx                  ← Custom sign-in page
│   │   │
│   │   ├── 📁 dashboard/
│   │   │   └── 📄 page.tsx                      ← Protected dashboard (client-side)
│   │   │
│   │   ├── 📁 profile/
│   │   │   └── 📄 page.tsx                      ← Protected profile (server-side)
│   │   │
│   │   ├── 📄 layout.tsx                        ← Root layout (wraps app with auth)
│   │   ├── 📄 page.tsx                          ← Home page
│   │   └── 📄 globals.css                       ← Global styles
│   │
│   ├── 📁 components/
│   │   └── 📄 AuthProvider.tsx                  ← Session provider wrapper
│   │
│   ├── 📁 lib/
│   │   ├── 📄 auth.ts                           ← Server-side helpers
│   │   └── 📄 prisma.ts                         ← Database client
│   │
│   ├── 📁 types/
│   │   └── 📄 next-auth.d.ts                    ← TypeScript types
│   │
│   └── 📄 middleware.ts                         ← Route protection (THE GUARD)
│
├── 📁 prisma/
│   └── 📄 schema.prisma                         ← Database schema
│
├── 📄 .env                                       ← Environment variables (secrets)
├── 📄 .env.example                              ← Template for .env
├── 📄 package.json                              ← Dependencies
├── 📄 tsconfig.json                             ← TypeScript config
├── 📄 tailwind.config.ts                        ← Tailwind config
├── 📄 next.config.js                            ← Next.js config
└── 📄 .gitignore                                ← Git ignore file
```

---

## 🧩 How Components Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     HOME PAGE (page.tsx)                     │
│  Shows: Sign In button if not authenticated                  │
│  Shows: User info + links if authenticated                   │
└─────────────────────────────────────────────────────────────┘
                              │
                 User clicks "Sign In" ───────┐
                              │               │
                              ▼               ▼
┌──────────────────────────────────┐  ┌─────────────────────┐
│  SIGN-IN PAGE (/auth/signin)     │  │   MIDDLEWARE.TS     │
│  Shows all OAuth providers       │  │  (Route Guard)      │
│  (Google, GitHub, etc.)          │  │  Protects pages     │
└──────────────────────────────────┘  └─────────────────────┘
                              │
          User picks provider (e.g. Google)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│          NEXTAUTH ROUTE (api/auth/[...nextauth])            │
│  - Redirects to OAuth provider (Google)                     │
│  - Handles OAuth callback                                    │
│  - Creates JWT token                                         │
│  - Saves user to database                                    │
│  - Creates session                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   OAUTH PROVIDER (Google)                    │
│  User logs in with their Google account                     │
└─────────────────────────────────────────────────────────────┘
                              │
               Redirects back to app
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SESSION CREATED                         │
│  User is now authenticated!                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────┐  ┌─────────────────────┐
│  DASHBOARD (/dashboard)          │  │ PROFILE (/profile)  │
│  Client-side protected           │  │ Server-side protect │
│  Uses: useSession()              │  │ Uses: getSession()  │
└──────────────────────────────────┘  └─────────────────────┘
```

---

## 🔄 Authentication Flow

### 1. Sign In Flow
```
User clicks "Sign in with Google"
    ↓
signIn("google") is called
    ↓
NextAuth redirects to Google
    ↓
User logs in with Google
    ↓
Google redirects back: /api/auth/callback/google
    ↓
NextAuth verifies with Google
    ↓
JWT callback runs → Add custom data to token
    ↓
signIn callback runs → Check if user is allowed
    ↓
User saved/updated in database (via Prisma)
    ↓
Session callback runs → Create session object
    ↓
User redirected to dashboard
    ↓
✅ User is authenticated!
```

### 2. Accessing Protected Pages
```
User visits /dashboard
    ↓
Middleware checks if user is authenticated
    ↓
If NO → Redirect to /auth/signin
If YES → Allow access
    ↓
Page loads and calls useSession()
    ↓
Session data is available in the page
    ↓
Display user information
```

### 3. API Protection
```
Client makes request to /api/protected
    ↓
API route calls getServerSession()
    ↓
Check if session exists
    ↓
If NO → Return 401 Unauthorized
If YES → Process request and return data
```

---

## 📝 Key Files Explained

### 1. route.ts - The Configuration Hub
**Purpose:** Configure all authentication settings
**Contains:**
- OAuth provider credentials
- Session strategy (JWT/Database)
- Callbacks (jwt, session, signIn)
- Pages (custom sign-in page)
- Events (logging)

### 2. middleware.ts - The Security Guard
**Purpose:** Protect routes before they load
**Contains:**
- Route matching patterns
- Authorization logic
- Redirect rules

### 3. AuthProvider.tsx - The Context Provider
**Purpose:** Make session available throughout app
**Contains:**
- SessionProvider wrapper
- Used in layout.tsx

### 4. lib/auth.ts - Server Helpers
**Purpose:** Utility functions for server components
**Contains:**
- getSession()
- requireAuth()
- getCurrentUser()
- hasRole()

### 5. schema.prisma - Database Schema
**Purpose:** Define database structure
**Contains:**
- User model
- Account model (OAuth connections)
- Session model
- VerificationToken model

### 6. next-auth.d.ts - Type Definitions
**Purpose:** TypeScript type safety
**Contains:**
- Extended Session interface
- Extended User interface
- Extended JWT interface

---

## 🎯 File Creation Order

Follow this order when implementing:

1. ✅ Install dependencies
2. ✅ Create `.env` file
3. ✅ Create `prisma/schema.prisma`
4. ✅ Create `src/lib/prisma.ts`
5. ✅ Create `src/types/next-auth.d.ts`
6. ✅ Create `src/app/api/auth/[...nextauth]/route.ts`
7. ✅ Create `src/components/AuthProvider.tsx`
8. ✅ Update `src/app/layout.tsx`
9. ✅ Create `src/app/auth/signin/page.tsx`
10. ✅ Create `src/middleware.ts`
11. ✅ Create `src/lib/auth.ts`
12. ✅ Create `src/app/dashboard/page.tsx`
13. ✅ Create `src/app/profile/page.tsx`
14. ✅ Update `src/app/page.tsx`

---

## 🔍 Where Data Lives

### Environment Variables (.env)
```
NEXTAUTH_SECRET          → Encryption key
NEXTAUTH_URL            → Your app URL
DATABASE_URL            → Database connection
GOOGLE_CLIENT_ID        → Google OAuth ID
GOOGLE_CLIENT_SECRET    → Google OAuth secret
```

### Database (Prisma)
```
User table              → name, email, image
Account table           → OAuth connections, tokens
Session table           → Active sessions (if using DB strategy)
VerificationToken       → For magic links
```

### JWT Token (Cookie)
```
Stored in browser cookie
Contains:
- User ID
- Role
- Provider info
- Custom data
```

---

## 🎨 Pages You'll Create

### Public Pages
- **/** (Home) - Welcome page with sign-in button
- **/auth/signin** - Beautiful sign-in page with provider buttons

### Protected Pages (Need Authentication)
- **/dashboard** - User dashboard with session info
- **/profile** - User profile with database data

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         Layer 1: Middleware             │
│  Checks auth before page loads          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Layer 2: Server Components         │
│  Validates session on server            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Layer 3: Client Components         │
│  Checks auth in browser                 │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Layer 4: API Routes                │
│  Validates every API request            │
└─────────────────────────────────────────┘
```

---

## 📦 What Each Package Does

```
next-auth                    → Main authentication library
@next-auth/prisma-adapter   → Connects NextAuth to database
@prisma/client              → Database ORM client
prisma                      → Database toolkit (dev)
```

---

## 🚀 Ready to Build?

Now you understand:
- ✅ What you're building
- ✅ How files are organized
- ✅ How authentication flows
- ✅ Where each piece fits

**Next:** Open `IMPLEMENTATION_CHECKLIST.md` and start with Step 1!

Ask me: "Show me Step 1: Create Next.js Project"
