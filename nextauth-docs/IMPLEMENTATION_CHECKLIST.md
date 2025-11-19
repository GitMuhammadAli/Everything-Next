# 📋 NextAuth Implementation Checklist

Follow these steps and ask Claude for code/explanation for each step!

---

## Phase 1: Initial Setup ⚙️

### Step 1: Create Next.js Project
- [ ] Create new Next.js 14+ project with App Router
- [ ] Enable TypeScript, Tailwind CSS, and src/ directory
- **Ask Claude:** "Show me the exact command to create the Next.js project"

### Step 2: Install Dependencies
- [ ] Install next-auth
- [ ] Install Prisma and Prisma adapter
- [ ] Initialize Prisma
- **Ask Claude:** "What packages do I need to install?"

### Step 3: Environment Setup
- [ ] Create .env file
- [ ] Generate NEXTAUTH_SECRET
- [ ] Set NEXTAUTH_URL
- **Ask Claude:** "How do I generate a secure secret?"

---

## Phase 2: Database Configuration 🗄️

### Step 4: Prisma Schema
- [ ] Update datasource in schema.prisma
- [ ] Add User model
- [ ] Add Account model
- [ ] Add Session model
- [ ] Add VerificationToken model
- **Ask Claude:** "Show me the complete Prisma schema for NextAuth"

### Step 5: Database Connection
- [ ] Set DATABASE_URL in .env
- [ ] Create Prisma client file
- [ ] Push schema to database
- **Ask Claude:** "How do I create the Prisma client singleton?"

---

## Phase 3: NextAuth Core Setup 🔐

### Step 6: Auth API Route
- [ ] Create /api/auth/[...nextauth]/route.ts
- [ ] Configure authOptions
- [ ] Add at least one provider (Google recommended)
- [ ] Set up JWT callback
- [ ] Set up session callback
- **Ask Claude:** "Show me the NextAuth route.ts file with Google provider"

### Step 7: TypeScript Types
- [ ] Create next-auth.d.ts type definitions
- [ ] Extend Session interface
- [ ] Extend User interface
- [ ] Extend JWT interface
- **Ask Claude:** "Show me the TypeScript type definitions for NextAuth"

### Step 8: Auth Provider Component
- [ ] Create AuthProvider.tsx component
- [ ] Wrap with SessionProvider
- **Ask Claude:** "Show me the AuthProvider wrapper component"

### Step 9: Update Root Layout
- [ ] Import AuthProvider
- [ ] Wrap children with AuthProvider
- **Ask Claude:** "How do I add AuthProvider to my layout?"

---

## Phase 4: OAuth Provider Setup 🌐

### Step 10: Google OAuth (Start Here)
- [ ] Go to Google Cloud Console
- [ ] Create OAuth credentials
- [ ] Add callback URL
- [ ] Copy Client ID and Secret to .env
- **Ask Claude:** "Walk me through Google OAuth setup"

### Step 11: Additional Providers (Optional)
- [ ] GitHub OAuth
- [ ] Facebook OAuth
- [ ] Twitter OAuth
- [ ] Discord OAuth
- **Ask Claude:** "Show me how to add [provider name]"

---

## Phase 5: Sign-In Page 🎨

### Step 12: Custom Sign-In Page
- [ ] Create /auth/signin/page.tsx
- [ ] Add provider buttons
- [ ] Style with Tailwind
- [ ] Handle loading states
- **Ask Claude:** "Show me a beautiful sign-in page component"

### Step 13: Configure Custom Pages
- [ ] Update authOptions with custom pages
- **Ask Claude:** "How do I configure custom sign-in pages?"

---

## Phase 6: Route Protection 🛡️

### Step 14: Middleware Setup
- [ ] Create middleware.ts
- [ ] Configure route protection
- [ ] Set up matcher patterns
- **Ask Claude:** "Show me the middleware file for route protection"

### Step 15: Server-Side Auth Helpers
- [ ] Create lib/auth.ts
- [ ] Add getSession helper
- [ ] Add requireAuth helper
- [ ] Add role checking helpers
- **Ask Claude:** "Show me server-side authentication helper functions"

---

## Phase 7: Protected Pages 📄

### Step 16: Client-Side Protected Page
- [ ] Create /dashboard/page.tsx
- [ ] Use useSession hook
- [ ] Handle loading/unauthenticated states
- [ ] Display user information
- **Ask Claude:** "Show me a client-side protected dashboard page"

### Step 17: Server-Side Protected Page
- [ ] Create /profile/page.tsx
- [ ] Use getServerSession
- [ ] Fetch data from database
- [ ] Display user profile
- **Ask Claude:** "Show me a server-side protected profile page"

---

## Phase 8: Home Page & Navigation 🏠

### Step 18: Home Page
- [ ] Create home page with auth status
- [ ] Add sign-in/sign-out buttons
- [ ] Show different content for authenticated users
- **Ask Claude:** "Show me a home page that handles auth state"

### Step 19: Navigation
- [ ] Add navigation component
- [ ] Show user info when logged in
- [ ] Add links to protected pages
- **Ask Claude:** "How do I create a nav bar with auth?"

---

## Phase 9: Testing & Debugging 🧪

### Step 20: Test Authentication Flow
- [ ] Can access sign-in page
- [ ] Can sign in with provider
- [ ] Session data appears correctly
- [ ] Protected routes work
- [ ] Can sign out
- **Ask Claude:** "What should I test to verify auth is working?"

### Step 21: Handle Errors
- [ ] Check for common errors
- [ ] Verify callback URLs
- [ ] Test with different browsers
- **Ask Claude:** "I'm getting [error], how do I fix it?"

---

## Phase 10: Advanced Features (Optional) 🚀

### Step 22: Role-Based Access
- [ ] Add role field to User model
- [ ] Update JWT callback with role
- [ ] Create admin-only routes
- **Ask Claude:** "Show me how to implement role-based access"

### Step 23: API Route Protection
- [ ] Create protected API route
- [ ] Validate session in API
- [ ] Return appropriate errors
- **Ask Claude:** "How do I protect an API route?"

### Step 24: Custom Callbacks
- [ ] Customize signIn callback
- [ ] Add email domain validation
- [ ] Track sign-in events
- **Ask Claude:** "Show me custom callback examples"

---

## 📝 How to Use This Checklist

1. **Go step by step** - Don't skip steps
2. **Ask Claude for each step** - Get code and explanations
3. **Test after each phase** - Make sure it works before moving on
4. **Take notes** - Document what you learn
5. **Experiment** - Try different approaches

---

## 💬 Example Questions to Ask Claude

**For code:**
- "Show me the code for [step name]"
- "Give me the complete [file name] with comments"
- "What should I put in [specific file]?"

**For understanding:**
- "Explain how [concept] works"
- "Why do we need [specific step]?"
- "What's the difference between [A] and [B]?"

**For troubleshooting:**
- "I'm getting [error], what does it mean?"
- "My [feature] isn't working, how do I debug?"
- "How do I test if [feature] is working?"

---

## 🎯 Your Learning Goals

By completing this checklist, you will:
- ✅ Understand OAuth 2.0 authentication
- ✅ Master NextAuth.js configuration
- ✅ Know how to protect routes
- ✅ Handle sessions (client & server)
- ✅ Implement real-world authentication
- ✅ Deploy production-ready auth

---

**Ready to start? Ask me for Step 1! 🚀**

Say: "Show me Step 1: Create Next.js Project"
