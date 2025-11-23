# 🎯 Step-by-Step Setup Guide

Follow these steps exactly to get your NextAuth application running!

## ✅ Step 1: Create Next.js Project (If Starting Fresh)

```bash
# Create a new Next.js app
npx create-next-app@latest my-nextauth-app

# When prompted, select:
# ✅ TypeScript: Yes
# ✅ ESLint: Yes
# ✅ Tailwind CSS: Yes
# ✅ src/ directory: Yes
# ✅ App Router: Yes
# ✅ Import alias: Yes (@/*)

cd my-nextauth-app
```

## ✅ Step 2: Install Required Packages

```bash
npm install next-auth @next-auth/prisma-adapter @prisma/client
npm install -D prisma
```

## ✅ Step 3: Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

## ✅ Step 4: Set Up Database

### Option A: PostgreSQL (Recommended)

1. Install PostgreSQL locally or use a cloud service:
   - [Vercel Postgres](https://vercel.com/storage/postgres) (Free tier)
   - [Supabase](https://supabase.com/) (Free tier)
   - [Railway](https://railway.app/) (Free tier)

2. Get your database URL and add to `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/nextauth_db"
   ```

### Option B: MySQL

```bash
DATABASE_URL="mysql://user:password@localhost:3306/nextauth_db"
```

### Option C: SQLite (Development Only)

In `prisma/schema.prisma`, change:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## ✅ Step 5: Copy Project Files

Copy all the files from this guide to your project:

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts
│   ├── auth/signin/page.tsx
│   ├── dashboard/page.tsx
│   ├── profile/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── AuthProvider.tsx
├── lib/
│   ├── auth.ts
│   └── prisma.ts
├── types/
│   └── next-auth.d.ts
└── middleware.ts

prisma/
└── schema.prisma

Root files:
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## ✅ Step 6: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Generate a secret:
   ```bash
   openssl rand -base64 32
   ```

3. Add to `.env`:
   ```
   NEXTAUTH_SECRET=your-generated-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

## ✅ Step 7: Set Up OAuth Providers

You need at least ONE provider to test. Let's start with Google (easiest):

### Google OAuth Setup (5 minutes)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project**
   - Click "Select a project" → "New Project"
   - Name: "NextAuth Test"
   - Click "Create"

3. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" → Click "Create"
   - Fill in:
     - App name: "NextAuth Test"
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip "Scopes" → "Save and Continue"
   - Add test users (your email) → "Save and Continue"

4. **Create Credentials**
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "NextAuth App"
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click "Create"

5. **Copy Credentials to .env**
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### GitHub OAuth Setup (3 minutes)

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/developers

2. **Create OAuth App**
   - Click "OAuth Apps" → "New OAuth App"
   - Fill in:
     - Application name: "NextAuth Test"
     - Homepage URL: `http://localhost:3000`
     - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - Click "Register application"

3. **Copy Credentials**
   - Copy Client ID to `.env`
   - Click "Generate a new client secret"
   - Copy secret to `.env`
   ```
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

**Note:** You can add more providers later!

## ✅ Step 8: Push Database Schema

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

You should see:
```
✔ Generated Prisma Client
```

## ✅ Step 9: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000/auth/signin

You should see the sign-in page with provider buttons!

## ✅ Step 10: Test Authentication

1. **Click "Continue with Google"** (or your configured provider)
2. **Sign in with your account**
3. **You should be redirected to the dashboard!**

## 🎉 Success Checklist

- [ ] Can see sign-in page at `/auth/signin`
- [ ] Can click a provider button
- [ ] Can sign in successfully
- [ ] Can see dashboard at `/dashboard` with your info
- [ ] Can see profile at `/profile`
- [ ] Can sign out successfully

---

## 🐛 Troubleshooting

### "Invalid callback URL"

**Problem:** OAuth provider rejects the callback URL

**Solution:** 
- Make sure you added EXACTLY: `http://localhost:3000/api/auth/callback/[provider]`
- No trailing slash
- Correct provider name (google, github, etc.)
- Check for typos

### "Prisma Client not found"

**Problem:** Prisma client not generated

**Solution:**
```bash
npx prisma generate
```

### "Cannot connect to database"

**Problem:** Database URL is wrong or database not running

**Solution:**
- Check `DATABASE_URL` in `.env`
- Make sure database is running
- Test connection: `npx prisma db push`

### "NEXTAUTH_SECRET must be provided"

**Problem:** Missing or invalid secret

**Solution:**
```bash
openssl rand -base64 32
```
Copy output to `NEXTAUTH_SECRET` in `.env`

### Sign-in works but redirects to error page

**Problem:** Database tables not created

**Solution:**
```bash
npx prisma db push
```

### TypeScript errors

**Problem:** Type definitions not recognized

**Solution:**
- Make sure `src/types/next-auth.d.ts` exists
- Restart TypeScript server in VS Code: `Ctrl+Shift+P` → "Restart TS Server"

---

## 📚 What to Learn Next

Now that authentication works, explore:

1. **Add More Providers**
   - Follow the guide in README.md for Facebook, Twitter, Discord

2. **Customize the Sign-In Page**
   - Edit `src/app/auth/signin/page.tsx`
   - Add your logo and branding

3. **Add User Roles**
   - Modify `prisma/schema.prisma`
   - Update callbacks in `route.ts`

4. **Create Protected API Routes**
   - See examples in README.md

5. **Deploy to Production**
   - See deployment guide in README.md

---

## 🆘 Still Having Issues?

1. **Check the main README.md** for detailed explanations
2. **Review NextAuth.js docs**: https://next-auth.js.org/
3. **Double-check all environment variables**
4. **Make sure database is running**
5. **Clear browser cookies and try again**

---

**Remember:** Authentication is complex! Don't get discouraged if it doesn't work immediately. Follow each step carefully, and you'll get it working! 💪

---

## 🚀 Quick Commands Reference

```bash
# Start development server
npm run dev

# Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset

# View database in browser
npx prisma studio

# Generate Prisma Client (after schema changes)
npx prisma generate

# Check for TypeScript errors
npm run build
```

---

**Good luck! 🎉**
