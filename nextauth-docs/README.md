# 🔐 Complete NextAuth.js Guide with OAuth Providers

A comprehensive, production-ready NextAuth.js setup with multiple OAuth providers (Google, GitHub, Facebook, Twitter, Discord) for Next.js 14+ with App Router.

## 📚 What You'll Learn

- ✅ Setting up NextAuth.js with App Router
- ✅ Configuring multiple OAuth providers
- ✅ Database integration with Prisma
- ✅ Client-side and server-side authentication
- ✅ Route protection with middleware
- ✅ Custom sign-in pages
- ✅ Session management
- ✅ TypeScript type safety
- ✅ Role-based access control

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or MySQL/MongoDB)
- Accounts with OAuth providers

### 2. Installation

```bash
# Install dependencies
npm install next-auth @next-auth/prisma-adapter @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init
```

### 3. Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Generate a secret:**
```bash
openssl rand -base64 32
```

Put this in `NEXTAUTH_SECRET` in your `.env` file.

### 4. Database Setup

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000/auth/signin` to test authentication!

---

## 🔑 OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy **Client ID** and **Client Secret** to `.env`

**Production:** Add your production domain:
```
https://yourdomain.com/api/auth/callback/google
```

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** Your App Name
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Copy **Client ID** and **Client Secret** to `.env`

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add **Facebook Login** product
4. In Settings → Basic:
   - Copy **App ID** and **App Secret** to `.env`
5. In Facebook Login → Settings:
   - Add OAuth Redirect URI: `http://localhost:3000/api/auth/callback/facebook`
6. Make app **Live** in top bar

### Twitter OAuth 2.0

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project and app
3. In app settings → User authentication settings:
   - Enable OAuth 2.0
   - Set Type: Web App
   - Add callback URL: `http://localhost:3000/api/auth/callback/twitter`
4. Copy **Client ID** and **Client Secret** to `.env`

### Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create **New Application**
3. Go to **OAuth2** section
4. Add redirect:
   ```
   http://localhost:3000/api/auth/callback/discord
   ```
5. Copy **Client ID** and **Client Secret** to `.env`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth configuration
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx              # Custom sign-in page
│   ├── dashboard/
│   │   └── page.tsx                  # Protected dashboard (client)
│   ├── profile/
│   │   └── page.tsx                  # Protected profile (server)
│   └── layout.tsx                    # Root layout with AuthProvider
├── components/
│   └── AuthProvider.tsx              # Session provider wrapper
├── lib/
│   ├── auth.ts                       # Server-side auth utilities
│   └── prisma.ts                     # Prisma client singleton
├── types/
│   └── next-auth.d.ts                # TypeScript type definitions
└── middleware.ts                     # Route protection middleware
```

---

## 💡 Key Concepts Explained

### 1. **Session Strategies**

NextAuth supports two session strategies:

#### JWT Strategy (Recommended)
```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

**Pros:**
- ✅ Stateless (no database queries)
- ✅ Better for serverless
- ✅ Scales easily

**Cons:**
- ❌ Can't invalidate sessions manually
- ❌ Larger cookie size

#### Database Strategy
```typescript
session: {
  strategy: "database",
  maxAge: 30 * 24 * 60 * 60,
}
```

**Pros:**
- ✅ Can invalidate sessions
- ✅ Better control

**Cons:**
- ❌ Requires database query per request
- ❌ Harder to scale

### 2. **Callbacks Explained**

#### JWT Callback
Runs when JWT is created/updated. Add custom data here:

```typescript
jwt({ token, user, account }) {
  if (user) {
    token.id = user.id;
    token.role = user.role;
  }
  return token;
}
```

#### Session Callback
Runs when session is accessed. Pass JWT data to client:

```typescript
session({ session, token }) {
  session.user.id = token.id;
  session.user.role = token.role;
  return session;
}
```

#### Sign In Callback
Control who can sign in:

```typescript
signIn({ user, account }) {
  // Only allow specific domains
  if (user.email.endsWith("@company.com")) {
    return true;
  }
  return false;
}
```

### 3. **Client vs Server Authentication**

#### Client-Side (useSession)
```typescript
"use client";
import { useSession } from "next-auth/react";

export default function ClientComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Not signed in</div>;
  
  return <div>Welcome {session.user.name}</div>;
}
```

**Use when:**
- Building interactive components
- Need real-time session updates
- Client-side navigation

#### Server-Side (getServerSession)
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ServerComponent() {
  const session = await getServerSession(authOptions);
  
  if (!session) redirect("/auth/signin");
  
  return <div>Welcome {session.user.name}</div>;
}
```

**Use when:**
- Server Components (default in App Router)
- API Routes
- Better performance (no loading states)
- SEO important

### 4. **Route Protection**

#### Method 1: Middleware (Best for multiple routes)
```typescript
// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"]
};
```

#### Method 2: Component-level
```typescript
// In your component
const session = await requireAuth(); // Server
const { data: session } = useSession({ required: true }); // Client
```

---

## 🎯 Common Use Cases

### 1. Protect API Route

```typescript
// app/api/protected/route.ts
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

### 2. Role-Based Access Control

```typescript
// In your authOptions callbacks
jwt({ token, user }) {
  if (user) {
    token.role = user.role || "user";
  }
  return token;
}

// In middleware
if (req.nextUrl.pathname.startsWith("/admin")) {
  if (token?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
}
```

### 3. Custom Sign-In Page

Already included in `/app/auth/signin/page.tsx`!

Key points:
- Use `signIn()` function with provider name
- Set `callbackUrl` for post-login redirect
- Customize styling to match your brand

### 4. Access Token Usage

```typescript
// Store access token in JWT callback
jwt({ token, account }) {
  if (account) {
    token.accessToken = account.access_token;
  }
  return token;
}

// Use it later
const session = await getServerSession(authOptions);
const accessToken = session.accessToken;

// Call provider API
const response = await fetch("https://api.provider.com/data", {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});
```

---

## 🔧 Advanced Configuration

### Adding More Providers

```typescript
import LinkedInProvider from "next-auth/providers/linkedin";
import SpotifyProvider from "next-auth/providers/spotify";

providers: [
  LinkedInProvider({
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
  }),
  SpotifyProvider({
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  }),
  // ... other providers
]
```

### Custom User Model

Add fields to Prisma schema:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("user")
  
  // Custom fields
  bio           String?
  website       String?
  company       String?
  location      String?
  
  accounts      Account[]
  sessions      Session[]
}
```

Then run:
```bash
npx prisma db push
npx prisma generate
```

### Email Provider (Magic Links)

```typescript
import EmailProvider from "next-auth/providers/email";

providers: [
  EmailProvider({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
  }),
]
```

---

## 🚨 Common Issues & Solutions

### Issue: "Invalid callback URL"
**Solution:** Make sure your callback URL in provider settings exactly matches:
```
http://localhost:3000/api/auth/callback/[provider]
```

### Issue: Session not updating
**Solution:** Clear browser cookies or use:
```typescript
import { useSession } from "next-auth/react";
const { update } = useSession();
await update(); // Force session refresh
```

### Issue: TypeScript errors
**Solution:** Make sure you have the type definitions file at `src/types/next-auth.d.ts`

### Issue: Prisma errors
**Solution:** 
```bash
npx prisma generate
npx prisma db push
```

---

## 🔒 Security Best Practices

1. **NEVER commit `.env` to version control**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   ```

2. **Use strong NEXTAUTH_SECRET in production**
   ```bash
   openssl rand -base64 32
   ```

3. **Enable HTTPS in production**
   ```typescript
   cookies: {
     secure: process.env.NODE_ENV === "production",
   }
   ```

4. **Validate email domains**
   ```typescript
   signIn({ user }) {
     const allowedDomains = ["company.com"];
     return allowedDomains.some(domain => 
       user.email.endsWith(domain)
     );
   }
   ```

5. **Rate limit authentication attempts**
   Use tools like `express-rate-limit` or Vercel's rate limiting

---

## 📦 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Update OAuth callback URLs to use production domain
5. Deploy!

### Environment Variables for Production
```bash
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=[generate-new-secret]
DATABASE_URL=[production-database-url]
# ... all provider credentials
```

---

## 📖 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OAuth 2.0 Simplified](https://www.oauth.com/)

---

## 🤝 Need Help?

- Check the [NextAuth.js Discussions](https://github.com/nextauthjs/next-auth/discussions)
- Review example projects in the [NextAuth.js Examples](https://github.com/nextauthjs/next-auth/tree/main/apps/examples)
- Read the [Migration Guide](https://next-auth.js.org/getting-started/upgrade-v4) for upgrading

---

## 🎓 Learning Checkpoints

After completing this guide, you should understand:

- ✅ How OAuth 2.0 authentication works
- ✅ Difference between JWT and database sessions
- ✅ How to protect routes in Next.js
- ✅ Client-side vs server-side authentication
- ✅ How to customize authentication flow
- ✅ How to add custom user data
- ✅ How to implement role-based access control
- ✅ Production deployment considerations

---

## 📝 License

This guide is free to use for learning and production projects.

---

**Happy Coding! 🚀**

If you found this guide helpful, consider giving it a ⭐️
