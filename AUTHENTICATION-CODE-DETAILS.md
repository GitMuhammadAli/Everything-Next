# Complete Authentication Code Details

This document provides a comprehensive, line-by-line explanation of the entire production-ready NextAuth authentication system.

---

## Table of Contents

1. [NextAuth Configuration](#1-nextauth-configuration)
2. [NextAuth Route Handler](#2-nextauth-route-handler)
3. [Server Session Helper](#3-server-session-helper)
4. [Sign Up API Route](#4-sign-up-api-route)
5. [Email Verification Route](#5-email-verification-route)
6. [Forgot Password Route](#6-forgot-password-route)
7. [Reset Password Route](#7-reset-password-route)
8. [Auth Utilities](#8-auth-utilities)
9. [Prisma Client](#9-prisma-client)
10. [Email Service](#10-email-service)
11. [Database Schema](#11-database-schema)
12. [Sign In Page](#12-sign-in-page)
13. [Sign Up Page](#13-sign-up-page)
14. [TypeScript Types](#14-typescript-types)

---

## 1. NextAuth Configuration

**File:** `app/api/auth/[...nextauth]/config.ts`

### Complete Code:

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      // Update user email verification status for OAuth providers
      if (account?.provider !== "credentials" && user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: { emailVerified: new Date() },
        });
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
};
```

### Line-by-Line Explanation:

- **Line 1:** `import { NextAuthOptions } from "next-auth";`

  - **Purpose:** Imports the TypeScript type for NextAuth configuration options.

- **Line 2:** `import CredentialsProvider from "next-auth/providers/credentials";`

  - **Purpose:** Imports the provider for email/password authentication.

- **Lines 3-6:** OAuth provider imports

  - **Purpose:** Imports OAuth providers for social login (Google, GitHub, Facebook, Twitter).

- **Line 7:** `import { PrismaAdapter } from "@next-auth/prisma-adapter";`

  - **Purpose:** Imports the adapter to connect NextAuth with Prisma/database.

- **Line 8:** `import { prisma } from "@/lib/prisma";`

  - **Purpose:** Imports the Prisma client instance for database operations.

- **Line 9:** `import { verifyPassword } from "@/lib/auth";`

  - **Purpose:** Imports the function to verify passwords against hashed values.

- **Line 11:** `export const authOptions: NextAuthOptions = {`

  - **Purpose:** Exports the NextAuth configuration object with TypeScript typing.

- **Line 12:** `adapter: PrismaAdapter(prisma),`

  - **Purpose:** Connects NextAuth to the database using Prisma.

- **Line 13:** `providers: [`

  - **Purpose:** Starts the array of authentication providers.

- **Lines 14-49:** CredentialsProvider configuration

  - **Purpose:** Sets up email/password authentication with validation, password verification, and email verification check.

- **Lines 51-67:** OAuth providers configuration

  - **Purpose:** Configures Google, GitHub, Facebook, and Twitter OAuth with environment variables.

- **Line 69:** `secret: process.env.NEXTAUTH_SECRET,`

  - **Purpose:** Sets the secret key for encrypting JWT tokens.

- **Lines 70-73:** Session configuration

  - **Purpose:** Configures JWT-based sessions with 30-day expiration.

- **Lines 74-78:** Custom pages configuration

  - **Purpose:** Sets custom page routes for authentication flows.

- **Lines 79-94:** Callbacks

  - **Purpose:** Adds user ID to session and stores access tokens in JWT.

- **Lines 96-105:** Events

  - **Purpose:** Auto-verifies email for OAuth sign-ins.

- **Line 107:** `debug: process.env.NODE_ENV === "development",`
  - **Purpose:** Enables debug logging only in development mode.

---

## 2. NextAuth Route Handler

**File:** `app/api/auth/[...nextauth]/route.ts`

### Complete Code:

```typescript
import NextAuth from "next-auth";
import { authOptions } from "./config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### Line-by-Line Explanation:

- **Line 1:** `import NextAuth from "next-auth";`

  - **Purpose:** Imports the main NextAuth function.

- **Line 2:** `import { authOptions } from "./config";`

  - **Purpose:** Imports the configuration we defined.

- **Line 4:** `const handler = NextAuth(authOptions);`

  - **Purpose:** Creates the NextAuth handler with our configuration.

- **Line 6:** `export { handler as GET, handler as POST };`
  - **Purpose:** Exports the handler as both GET and POST for Next.js API routes.

---

## 3. Server Session Helper

**File:** `app/api/auth/[...nextauth]/auth.ts`

### Complete Code:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "./config";

export async function getSession() {
  return await getServerSession(authOptions);
}
```

### Line-by-Line Explanation:

- **Line 1:** `import { getServerSession } from "next-auth";`

  - **Purpose:** Imports function to get session on the server side.

- **Line 2:** `import { authOptions } from "./config";`

  - **Purpose:** Imports the auth configuration.

- **Lines 4-6:** `getSession` function
  - **Purpose:** Exports a helper function to get the current session in server components.

---

## 4. Sign Up API Route

**File:** `app/api/auth/signup/route.ts`

### Complete Code:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createUser, getUserByEmail } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { randomBytes } from "crypto";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(
      validatedData.email,
      validatedData.password,
      validatedData.name
    );

    // Generate verification token
    const token = randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours

    await prisma.verificationToken.create({
      data: {
        token,
        identifier: validatedData.email,
        expires,
        userId: user.id,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(
        validatedData.email,
        token,
        validatedData.name
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the signup if email fails, but log it
    }

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to verify your account.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user. Please try again." },
      { status: 500 }
    );
  }
}
```

### Line-by-Line Explanation:

- **Line 1:** `import { NextRequest, NextResponse } from "next/server";`

  - **Purpose:** Imports Next.js types for API route request/response.

- **Line 2:** `import { z } from "zod";`

  - **Purpose:** Imports Zod for schema validation.

- **Lines 3-6:** Utility imports

  - **Purpose:** Imports database client, auth helpers, email utility, and crypto for token generation.

- **Lines 8-12:** Validation schema

  - **Purpose:** Defines validation rules for signup data (email, password min 8 chars, optional name).

- **Line 14:** `export async function POST(request: NextRequest) {`

  - **Purpose:** Exports POST handler for the signup endpoint.

- **Line 16:** `const body = await request.json();`

  - **Purpose:** Reads and parses the JSON request body.

- **Line 17:** `const validatedData = signupSchema.parse(body);`

  - **Purpose:** Validates the body against the schema, throws if invalid.

- **Lines 20-26:** User existence check

  - **Purpose:** Checks if user already exists and returns error if found.

- **Lines 29-33:** User creation

  - **Purpose:** Creates new user with hashed password.

- **Line 36:** `const token = randomBytes(32).toString("hex");`

  - **Purpose:** Generates a random 64-character hex token.

- **Lines 37-38:** Token expiration

  - **Purpose:** Sets token expiration to 24 hours from now.

- **Lines 40-47:** Token storage

  - **Purpose:** Saves the verification token in the database.

- **Lines 50-55:** Email sending

  - **Purpose:** Sends verification email, logs error but doesn't fail signup if email fails.

- **Lines 57-63:** Success response

  - **Purpose:** Returns success response with user ID.

- **Lines 64-77:** Error handling
  - **Purpose:** Handles validation errors and other errors with appropriate responses.

---

## 5. Email Verification Route

**File:** `app/api/auth/verify-email/route.ts`

### Complete Code:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Verify the user's email
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Redirect to sign in page with success message
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("verified", "true");
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
      { status: 500 }
    );
  }
}
```

### Line-by-Line Explanation:

- **Line 4:** `export async function GET(request: NextRequest) {`

  - **Purpose:** Exports GET handler (called when user clicks email link).

- **Lines 5-6:** Token extraction

  - **Purpose:** Extracts the token from the URL query parameters.

- **Lines 8-10:** Token validation

  - **Purpose:** Returns error if token is missing.

- **Lines 13-16:** Token lookup

  - **Purpose:** Finds the verification token in database with related user.

- **Lines 18-20:** Token existence check

  - **Purpose:** Returns error if token doesn't exist.

- **Lines 22-27:** Expiration check

  - **Purpose:** Checks if token expired, deletes it, and returns error.

- **Lines 30-33:** Email verification

  - **Purpose:** Updates user's emailVerified field to current date/time.

- **Lines 36-38:** Token cleanup

  - **Purpose:** Deletes the token after successful verification (one-time use).

- **Lines 41-43:** Redirect
  - **Purpose:** Redirects to sign-in page with success parameter.

---

## 6. Forgot Password Route

**File:** `app/api/auth/forgot-password/route.ts`

### Complete Code:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { randomBytes } from "crypto";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    const user = await getUserByEmail(validatedData.email);

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return NextResponse.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const token = randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour

    // Delete any existing reset tokens for this user
    await prisma.resetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new reset token
    await prisma.resetToken.create({
      data: {
        token,
        expires,
        userId: user.id,
      },
    });

    // Send reset email
    try {
      await sendPasswordResetEmail(
        validatedData.email,
        token,
        user.name || undefined
      );
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}
```

### Line-by-Line Explanation:

- **Lines 8-10:** Validation schema

  - **Purpose:** Only validates email address.

- **Line 17:** User lookup

  - **Purpose:** Finds user by email.

- **Lines 19-23:** Security practice

  - **Purpose:** Returns same message whether user exists or not (prevents email enumeration).

- **Lines 26-28:** Token generation

  - **Purpose:** Generates reset token with 1-hour expiration.

- **Lines 31-34:** Token cleanup

  - **Purpose:** Removes old reset tokens for this user (only one active token).

- **Lines 37-43:** Token storage

  - **Purpose:** Saves new reset token in database.

- **Lines 46-54:** Email sending
  - **Purpose:** Sends password reset email with token link.

---

## 7. Reset Password Route

**File:** `app/api/auth/reset-password/route.ts`

### Complete Code:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    const resetToken = await prisma.resetToken.findUnique({
      where: { token: validatedData.token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    if (resetToken.expires < new Date()) {
      await prisma.resetToken.delete({
        where: { token: validatedData.token },
      });
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    if (resetToken.used) {
      return NextResponse.json(
        { error: "Token has already been used" },
        { status: 400 }
      );
    }

    // Update password
    const hashedPassword = await hashPassword(validatedData.password);
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.resetToken.update({
      where: { token: validatedData.token },
      data: { used: true },
    });

    return NextResponse.json({
      message:
        "Password has been reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
```

### Line-by-Line Explanation:

- **Lines 6-9:** Validation schema

  - **Purpose:** Validates token and new password (min 8 characters).

- **Lines 16-19:** Token lookup

  - **Purpose:** Finds reset token with related user.

- **Lines 21-23:** Token existence check

  - **Purpose:** Returns error if token doesn't exist.

- **Lines 25-30:** Expiration check

  - **Purpose:** Checks expiration and deletes expired token.

- **Lines 32-34:** Token reuse prevention

  - **Purpose:** Prevents token reuse.

- **Lines 37-41:** Password update

  - **Purpose:** Hashes new password and updates user's password.

- **Lines 44-47:** Token marking
  - **Purpose:** Marks token as used to prevent reuse.

---

## 8. Auth Utilities

**File:** `lib/auth.ts`

### Complete Code:

```typescript
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createUser(
  email: string,
  password: string,
  name?: string
) {
  const hashedPassword = await hashPassword(password);

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: true,
    },
  });
}
```

### Line-by-Line Explanation:

- **Line 1:** `import bcrypt from "bcryptjs";`

  - **Purpose:** Imports bcrypt for password hashing.

- **Line 4-6:** `hashPassword` function

  - **Purpose:** Hashes password with 12 salt rounds (secure).

- **Line 8-10:** `verifyPassword` function

  - **Purpose:** Compares plain password with hash, returns true if match.

- **Lines 12-22:** `createUser` function

  - **Purpose:** Creates user with hashed password in database.

- **Lines 24-28:** `getUserByEmail` function

  - **Purpose:** Finds user by email address.

- **Lines 30-36:** `getUserById` function
  - **Purpose:** Finds user by ID and includes OAuth accounts.

---

## 9. Prisma Client

**File:** `lib/prisma.ts`

### Complete Code:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Line-by-Line Explanation:

- **Line 1:** `import { PrismaClient } from "@prisma/client";`

  - **Purpose:** Imports Prisma client type.

- **Lines 3-5:** Global type definition

  - **Purpose:** Creates type for global Prisma instance (prevents multiple instances in dev).

- **Lines 7-11:** Prisma instance creation

  - **Purpose:** Reuses existing Prisma instance or creates new one with logging in dev.

- **Line 13:** Global storage
  - **Purpose:** Stores Prisma instance globally in development to prevent multiple connections.

---

## 10. Email Service

**File:** `lib/email.ts`

### Complete Code:

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Verify your email address",
    html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h1>Welcome${name ? `, ${name}` : ""}!</h1>
				<p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
				<a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
					Verify Email
				</a>
				<p>Or copy and paste this URL into your browser:</p>
				<p style="word-break: break-all; color: #666;">${verificationUrl}</p>
				<p>This link will expire in 24 hours.</p>
				<p>If you didn't create an account, you can safely ignore this email.</p>
			</div>
		`,
  };

  return await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name?: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your password",
    html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h1>Password Reset Request</h1>
				<p>Hi${name ? ` ${name}` : ""},</p>
				<p>We received a request to reset your password. Click the link below to reset it:</p>
				<a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
					Reset Password
				</a>
				<p>Or copy and paste this URL into your browser:</p>
				<p style="word-break: break-all; color: #666;">${resetUrl}</p>
				<p>This link will expire in 1 hour.</p>
				<p>If you didn't request a password reset, you can safely ignore this email.</p>
			</div>
		`,
  };

  return await transporter.sendMail(mailOptions);
}
```

### Line-by-Line Explanation:

- **Line 1:** `import nodemailer from "nodemailer";`

  - **Purpose:** Imports nodemailer for sending emails.

- **Lines 3-11:** Transporter configuration

  - **Purpose:** Creates email transporter with SMTP configuration from environment variables.

- **Line 13:** `sendVerificationEmail` function

  - **Purpose:** Sends email verification email with token link.

- **Line 14:** URL creation

  - **Purpose:** Creates verification URL with token.

- **Lines 16-33:** Email options

  - **Purpose:** Creates email with HTML content and sends it.

- **Line 38:** `sendPasswordResetEmail` function

  - **Purpose:** Sends password reset email with token link.

- **Line 39:** Reset URL creation
  - **Purpose:** Creates password reset URL with token.

---

## 11. Database Schema

**File:** `prisma/schema.prisma`

### Complete Code:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // Change to "mysql" or "sqlite" if needed
  url      = env("DATABASE_URL")
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
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String? // Hashed password for credentials provider
  accounts      Account[]
  sessions      Session[]
  verificationTokens VerificationToken[]
  resetTokens   ResetToken[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model VerificationToken {
  id         String   @id @default(cuid())
  identifier String
  token      String   @unique
  expires    DateTime
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
}

model ResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  expires   DateTime
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  used      Boolean  @default(false)

  @@unique([token])
  @@index([userId])
}
```

### Line-by-Line Explanation:

- **Lines 4-6:** Generator configuration

  - **Purpose:** Tells Prisma to generate JavaScript client.

- **Lines 8-11:** Datasource configuration

  - **Purpose:** Configures database connection (PostgreSQL, MySQL, or SQLite).

- **Lines 13-31:** Account model

  - **Purpose:** Stores OAuth account links; deletes when user is deleted.

- **Lines 33-41:** Session model

  - **Purpose:** Stores NextAuth sessions.

- **Lines 43-56:** User model

  - **Purpose:** Defines User with unique email, optional password, and verification status.

- **Lines 58-68:** VerificationToken model

  - **Purpose:** Stores email verification tokens with expiration.

- **Lines 70-80:** ResetToken model
  - **Purpose:** Stores password reset tokens with used flag.

---

## 12. Sign In Page

**File:** `app/auth/signin/page.tsx`

### Complete Code:

```typescript
"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setMessage("Email verified successfully! You can now sign in.");
    }
    if (searchParams.get("error")) {
      setError(searchParams.get("error") || "");
    }
  }, [searchParams]);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setError("");
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleCredentialsSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuthSignIn("google")}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Google</span>
              Google
            </button>
            <button
              onClick={() => handleOAuthSignIn("github")}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with GitHub</span>
              GitHub
            </button>
            <button
              onClick={() => handleOAuthSignIn("facebook")}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Facebook</span>
              Facebook
            </button>
            <button
              onClick={() => handleOAuthSignIn("twitter")}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Twitter</span>
              Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Key Features:

- **Line 1:** `"use client";` - Marks as client component
- **Lines 11-15:** State management for form and messages
- **Lines 17-24:** useEffect to check URL parameters for verification success
- **Lines 26-49:** Credentials sign-in handler
- **Lines 51-54:** OAuth sign-in handler
- **Lines 83-139:** Email/password form
- **Lines 141-180:** OAuth provider buttons

---

## 13. Sign Up Page

**File:** `app/auth/signup/page.tsx`

### Complete Code:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded">
            <h2 className="text-xl font-bold mb-2">
              Account Created Successfully!
            </h2>
            <p>
              We've sent a verification email to {formData.email}. Please check
              your inbox and click the verification link to activate your
              account.
            </p>
            <p className="mt-2 text-sm">
              Redirecting to sign in page in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name (optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password (min. 8 characters)"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### Key Features:

- **Lines 9-14:** Form state management
- **Lines 19-31:** Client-side validation (password match, length)
- **Lines 36-46:** API call to signup endpoint
- **Lines 48-53:** Error handling
- **Lines 55-59:** Success state with redirect
- **Lines 66-83:** Success message display
- **Lines 106-171:** Signup form with all fields

---

## 14. TypeScript Types

**File:** `types/next-auth.d.ts`

### Complete Code:

```typescript
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
```

### Line-by-Line Explanation:

- **Line 1:** `import "next-auth";`

  - **Purpose:** Imports NextAuth types to extend them.

- **Lines 3-12:** Session interface extension

  - **Purpose:** Extends Session type to include user ID in the user object.

- **Lines 14-16:** User interface extension

  - **Purpose:** Extends User type to include id field.

- **Lines 18-22:** JWT interface extension
  - **Purpose:** Extends JWT type to include user ID.

---

## Summary

This authentication system provides:

1. **Multiple Authentication Methods:**

   - Email/Password (Credentials)
   - Google OAuth
   - GitHub OAuth
   - Facebook OAuth
   - Twitter OAuth

2. **Security Features:**

   - Password hashing with bcrypt (12 rounds)
   - Email verification required
   - Secure token generation
   - Token expiration
   - One-time use tokens

3. **User Management:**

   - User registration
   - Email verification
   - Password reset
   - Session management

4. **Database Integration:**

   - Prisma ORM
   - User, Account, Session models
   - Verification and reset tokens

5. **Email Service:**
   - Verification emails
   - Password reset emails
   - HTML email templates

All code is production-ready and follows security best practices.
