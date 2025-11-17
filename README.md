# Konnekt My City

A comprehensive civic engagement platform connecting South African citizens with their municipalities for infrastructure issue reporting and resolution.

## Features

- 🏛️ **Citizen Portal**: Report infrastructure issues (potholes, water leaks, power outages, etc.)
- 🗺️ **Live Issues Map**: Interactive map displaying all reported issues with real-time updates
- 👨‍💼 **Municipal Dashboard**: Portal for officials to manage and respond to citizen reports
- ✅ **Community Verification**: Citizens can vote on issues to verify legitimacy
- 📊 **Status Tracking**: Complete timeline view of issue lifecycle from submission to resolution

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Supabase** - PostgreSQL database, authentication, and real-time subscriptions
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern styling
- **shadcn/ui** - High-quality UI components
- **Leaflet** - Interactive mapping with OpenStreetMap

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **pnpm** package manager (or npm/yarn)
- A **Supabase account** (free tier works fine)

## Local Development Setup

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd konnekt-my-city
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pnpm install
# or
npm install
# or
yarn install
\`\`\`

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Konnekt My City
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to South Africa (e.g., Cape Town)
4. Click "Create new project" and wait for setup to complete

#### Get Your API Keys

1. In your Supabase project dashboard, go to **Project Settings** (gear icon)
2. Click on **API** in the left sidebar
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)
   - **JWT Secret**

#### Get Database Connection Strings

1. In your Supabase project dashboard, go to **Project Settings**
2. Click on **Database** in the left sidebar
3. Scroll down to **Connection string** section
4. Copy the connection strings for:
   - **URI** (Pooling mode)
   - **URI** (Session mode / Non-pooling)
   - **Prisma** connection string

### 4. Configure Environment Variables

1. Copy the example environment file:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

2. Open `.env.local` and replace all placeholder values with your actual Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
# ... etc
\`\`\`

### 5. Set Up the Database

Run the SQL scripts in order to create the database schema:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each script file in order:
   - `scripts/001_create_database_schema.sql`
   - `scripts/002_seed_initial_data.sql`
   - `scripts/003_create_profile_trigger.sql`
   - `scripts/004_add_all_municipalities.sql`
5. Click **Run** for each script

#### Option B: Using the App (After Starting Dev Server)

1. Start the development server (see step 6)
2. Navigate to `http://localhost:3000/setup`
3. Follow the instructions to run each script

### 6. Start the Development Server

\`\`\`bash
pnpm dev
# or
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Test the Setup

1. Navigate to [http://localhost:3000/diagnostics](http://localhost:3000/diagnostics)
2. This page will test your Supabase connection and show any issues
3. All checks should be green ✅

## Project Structure

\`\`\`
konnekt-my-city/
├── app/                      # Next.js App Router pages
│   ├── auth/                # Authentication pages (login, signup)
│   ├── dashboard/           # User dashboard
│   ├── issues/              # Issues map and detail pages
│   ├── municipal/           # Municipal official dashboard
│   ├── report/              # Issue reporting page
│   ├── setup/               # Database setup guide
│   └── diagnostics/         # Connection diagnostics
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── issue-detail.tsx     # Issue detail component
│   ├── issues-map.tsx       # Interactive map component
│   └── municipal-dashboard.tsx
├── lib/                     # Utility functions
│   ├── supabase/           # Supabase client configuration
│   └── utils.ts            # Helper functions
├── scripts/                 # SQL database scripts
│   ├── 001_create_database_schema.sql
│   ├── 002_seed_initial_data.sql
│   ├── 003_create_profile_trigger.sql
│   └── 004_add_all_municipalities.sql
└── public/                  # Static assets
\`\`\`

## Usage

### For Citizens

1. **Sign Up**: Create an account and select your municipality
2. **Report Issues**: Navigate to "Report Issue" and fill in details with photos and location
3. **Track Issues**: View your reported issues on the dashboard
4. **Vote on Issues**: Verify community issues by upvoting legitimate reports
5. **View Map**: See all issues in your area on the interactive map

### For Municipal Officials

1. **Sign Up**: Create an account with role "municipal_official"
2. **Access Dashboard**: Navigate to `/municipal` to see all issues
3. **Manage Issues**: Update status, add official comments, and track resolution
4. **View Analytics**: See statistics and trends in your municipality

## Database Schema

The application uses the following main tables:

- **municipalities** - South African municipalities (257 total)
- **profiles** - User profiles linked to Supabase auth
- **issue_categories** - Types of issues (potholes, water leaks, etc.)
- **issues** - Reported infrastructure issues
- **issue_updates** - Status updates and comments on issues
- **issue_votes** - Community votes on issues

All tables have Row Level Security (RLS) policies enabled for data protection.

## Troubleshooting

### "Failed to fetch" Error

- Check that your `.env.local` file has correct Supabase credentials
- Verify your Supabase project is active and accessible
- Run the diagnostics page at `/diagnostics`

### Database Connection Issues

- Ensure all SQL scripts have been run in order
- Check that RLS policies are enabled
- Verify your database connection strings are correct

### Municipality Search Not Working

- Make sure you've run `scripts/004_add_all_municipalities.sql`
- Check that the municipalities table has 257 entries

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for South African communities
