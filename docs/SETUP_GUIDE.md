# Konnekt My City - Complete Setup Guide

This guide will walk you through setting up Konnekt My City on your local machine step by step.

## Step 1: Install Prerequisites

### Install Node.js

1. Download Node.js 18 or higher from [nodejs.org](https://nodejs.org/)
2. Verify installation:
   \`\`\`bash
   node --version
   npm --version
   \`\`\`

### Install pnpm (Recommended)

\`\`\`bash
npm install -g pnpm
\`\`\`

## Step 2: Create a Supabase Project

### 2.1 Sign Up for Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

### 2.2 Create New Project

1. Click "New Project" in your dashboard
2. Fill in the details:
   - **Organization**: Select or create one
   - **Name**: `konnekt-my-city`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Select `Cape Town` (closest to South Africa)
   - **Pricing Plan**: Free tier is fine for development
3. Click "Create new project"
4. Wait 2-3 minutes for project setup

### 2.3 Collect Your Credentials

#### Get API Keys

1. In your project dashboard, click the **Settings** gear icon (bottom left)
2. Click **API** in the Configuration section
3. You'll see:
   - **Project URL**: Copy this (e.g., `https://abcdefgh.supabase.co`)
   - **API Keys**:
     - **anon public**: Copy this
     - **service_role**: Copy this (keep secret!)
   - **JWT Settings**:
     - **JWT Secret**: Copy this

#### Get Database Connection Strings

1. Still in Settings, click **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab and copy:
   - **Connection pooling** string (for POSTGRES_URL)
   - Toggle to **Session mode** and copy (for POSTGRES_URL_NON_POOLING)
4. Select **Prisma** tab and copy the connection string

#### Get Database Credentials

1. Still in Database settings, scroll to **Connection info**
2. Copy:
   - **Host**
   - **Database name**
   - **Port**
   - **User**
   - **Password** (the one you created earlier)

## Step 3: Set Up Your Local Project

### 3.1 Clone and Install

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd konnekt-my-city

# Install dependencies
pnpm install
\`\`\`

### 3.2 Configure Environment Variables

1. Copy the example file:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. Open `.env.local` in your text editor

3. Replace each placeholder with your actual values from Step 2.3:

\`\`\`env
# From API settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters

# From Database connection strings
POSTGRES_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres?pgbouncer=true
POSTGRES_PRISMA_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
POSTGRES_URL_NON_POOLING=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres

# From Database credentials
POSTGRES_HOST=db.xxx.supabase.co
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_database_password
POSTGRES_DATABASE=postgres

# Local development URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

4. Save the file

## Step 4: Set Up the Database Schema

You need to run 4 SQL scripts to create all the tables and data.

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query** button

#### Run Script 1: Create Database Schema

1. Open `scripts/001_create_database_schema.sql` in your code editor
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Ctrl/Cmd + Enter)
5. You should see "Success. No rows returned"

#### Run Script 2: Seed Initial Data

1. Open `scripts/002_seed_initial_data.sql`
2. Copy and paste into SQL Editor
3. Click **Run**
4. Should see "Success. No rows returned"

#### Run Script 3: Create Profile Trigger

1. Open `scripts/003_create_profile_trigger.sql`
2. Copy and paste into SQL Editor
3. Click **Run**
4. Should see "Success. No rows returned"

#### Run Script 4: Add All Municipalities

1. Open `scripts/004_add_all_municipalities.sql`
2. Copy and paste into SQL Editor
3. Click **Run**
4. Should see "Success. No rows returned"

### Method 2: Using psql Command Line

If you have PostgreSQL installed locally:

\`\`\`bash
# Set your connection string
export DATABASE_URL="your_postgres_url_here"

# Run each script
psql $DATABASE_URL -f scripts/001_create_database_schema.sql
psql $DATABASE_URL -f scripts/002_seed_initial_data.sql
psql $DATABASE_URL -f scripts/003_create_profile_trigger.sql
psql $DATABASE_URL -f scripts/004_add_all_municipalities.sql
\`\`\`

## Step 5: Verify Database Setup

1. In Supabase dashboard, click **Table Editor**
2. You should see these tables:
   - municipalities (257 rows)
   - profiles
   - issue_categories (6 rows)
   - issues
   - issue_updates
   - issue_votes

## Step 6: Start the Development Server

\`\`\`bash
pnpm dev
\`\`\`

You should see:

\`\`\`
▲ Next.js 16.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
\`\`\`

## Step 7: Test Your Setup

### 7.1 Run Diagnostics

1. Open your browser to [http://localhost:3000/diagnostics](http://localhost:3000/diagnostics)
2. All checks should show ✅ green:
   - Environment Variables Configured
   - Supabase Connection
   - Authentication Service
   - Database Connection
   - Municipalities Loaded

### 7.2 Create Your First Account

1. Go to [http://localhost:3000/auth/sign-up](http://localhost:3000/auth/sign-up)
2. Fill in:
   - Email
   - Password
   - Full Name
   - Search and select your municipality
   - Select role (citizen or municipal_official)
3. Click "Create Account"
4. Check your email for verification link
5. Click the verification link

### 7.3 Report Your First Issue

1. After logging in, click "Report Issue"
2. Fill in the form:
   - Title
   - Description
   - Category
   - Location (use "Get Current Location" or enter manually)
   - Upload a photo (optional)
3. Click "Submit Report"
4. You should see a success message

### 7.4 View the Issues Map

1. Click "View Issues" in the navigation
2. You should see an interactive map with your reported issue
3. Click on the marker to see issue details

## Troubleshooting

### Issue: "Failed to fetch" error

**Solution:**
- Double-check your `.env.local` file has correct values
- Make sure there are no extra spaces or quotes around values
- Verify your Supabase project is active (not paused)
- Run diagnostics at `/diagnostics`

### Issue: "Table does not exist" error

**Solution:**
- You haven't run all the SQL scripts
- Go back to Step 4 and run each script in order
- Verify tables exist in Supabase Table Editor

### Issue: Municipality search shows no results

**Solution:**
- Run script 4: `scripts/004_add_all_municipalities.sql`
- Check in Supabase Table Editor that municipalities table has 257 rows

### Issue: Can't sign up - email not sending

**Solution:**
- In Supabase dashboard, go to Authentication > Settings
- Scroll to "Email Templates"
- Make sure "Confirm signup" is enabled
- Check your spam folder
- For development, you can disable email confirmation:
  - Go to Authentication > Settings
  - Disable "Enable email confirmations"

### Issue: Port 3000 already in use

**Solution:**
\`\`\`bash
# Use a different port
pnpm dev -p 3001

# Or kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
\`\`\`

## Next Steps

- Explore the municipal dashboard at `/municipal`
- Check out the setup guide in the app at `/setup`
- Read the main README.md for more features
- Start customizing the app for your needs!

## Getting Help

If you're stuck:

1. Check the diagnostics page: `/diagnostics`
2. Review the error messages carefully
3. Check the browser console (F12) for detailed errors
4. Verify all environment variables are set correctly
5. Make sure all SQL scripts ran successfully

---

Happy coding! 🚀
