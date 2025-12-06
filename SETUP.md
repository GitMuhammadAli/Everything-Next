# Setup Guide

This guide will help you set up and run the Next.js 15 application with PostgreSQL.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running (local or remote)
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/everything_next?schema=public"

# NextAuth (if using authentication)
NEXTAUTH_URL="http://localhost:6600"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Email (for password reset, etc.)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="your-email@gmail.com"

# Optional: Base URL for API calls
NEXT_PUBLIC_BASE_URL="http://localhost:6600"
```

### PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed)
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create a database:**
   ```sql
   CREATE DATABASE everything_next;
   ```

3. **Update DATABASE_URL** in your `.env` file with your PostgreSQL credentials.

## Step 3: Set Up the Database

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Push the schema to the database:**
   ```bash
   npm run db:push
   ```
   
   Or create a migration:
   ```bash
   npm run db:migrate
   ```

3. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:6600`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## Project Structure

- `app/` - Next.js 15 App Router pages and routes
- `app/api/` - API routes
- `lib/` - Utility functions and configurations
- `prisma/` - Database schema and migrations
- `public/` - Static assets

## Features

- **SSG (Static Site Generation)** - Pre-rendered at build time
- **SSR (Server-Side Rendering)** - Rendered on each request
- **CSR (Client-Side Rendering)** - Rendered in the browser
- **ISR (Incremental Static Regeneration)** - Static with background updates
- **News Articles** - Database-driven articles with PostgreSQL
- **Modern UI** - Beautiful, responsive design with Tailwind CSS

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct
- Check database credentials and permissions

### Port Already in Use

If port 6600 is already in use, you can change it in `package.json` or use:
```bash
PORT=3000 npm run dev
```

### Prisma Client Not Generated

Run `npm run db:generate` after installing dependencies or updating the schema.

## Next Steps

1. Explore the different rendering modes (SSG, SSR, CSR, ISR)
2. Check out the News section to see database integration
3. Review the code to understand Next.js 15 best practices
4. Customize the application for your needs

