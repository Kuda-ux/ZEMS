# ZEMS — Zimbabwe Education Management System

A **national-scale school management platform** for Zimbabwe, designed for government schools, private schools, and Ministry-level oversight.

Built with Next.js 16, Tailwind CSS, ShadCN UI, and Supabase.

---

## Features

| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time metrics, charts, and alerts per role |
| **Student Management** | Full CRUD with ZEMS national ID, search/filter, profiles |
| **Attendance** | Daily marking with click-to-toggle, bulk actions, reports |
| **Fees & Finance** | Invoicing, payment recording (EcoCash, BEAM, bank), receipts |
| **Academics** | Classes, streams, subjects, academic year/term management |
| **Exams & Results** | Exam creation, mark entry, grade sheets, rankings |
| **Staff Management** | Teaching & non-teaching staff profiles and tracking |
| **Discipline** | Incident logging with severity, actions, parent notification |
| **Communications** | Announcements, SMS log (simulated), notifications |
| **Timetable** | Weekly schedule viewer per class with subject colour coding |
| **Welfare & Inclusion** | BEAM, OVC, feeding programme, special needs tracking |
| **Inventory & Assets** | Asset register with categories, conditions, values |
| **Reports & Analytics** | Enrollment, attendance, financial, welfare reports with charts |
| **Audit Logs** | Full action trail — create, update, delete, login events |
| **Settings** | School profile, user account, notifications, role switcher |
| **RBAC** | 8 roles: Super Admin → Ministry → Provincial → District → School Admin → Bursar → Teacher → Parent |

### Zimbabwe-Specific Features
- All 10 provinces and districts
- BEAM (Basic Education Assistance Module) tracking
- EcoCash, InnBucks, OneMoney payment methods
- ZIMSEC curriculum alignment
- Shona/Ndebele language support
- OVC (Orphan & Vulnerable Children) welfare tracking

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + ShadCN UI v4 |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context + useState |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd zems

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

### Demo Accounts

| Email | Role |
|-------|------|
| `admin@zems.gov.zw` | School Admin |
| `ministry@zems.gov.zw` | Ministry Admin |
| `teacher@school.co.zw` | Teacher |
| `bursar@school.co.zw` | Bursar |
| `parent@gmail.com` | Parent |

Password: any value (demo mode).

---

## Project Structure

```
zems/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── login/                # Login page
│   │   ├── dashboard/            # Protected dashboard
│   │   │   ├── students/         # Student management + [id] profile
│   │   │   ├── attendance/       # Attendance marking
│   │   │   ├── fees/             # Finance module
│   │   │   ├── academics/        # Classes & subjects
│   │   │   ├── exams/            # Exams & results
│   │   │   ├── staff/            # Staff management
│   │   │   ├── discipline/       # Incident tracking
│   │   │   ├── communications/   # Announcements & SMS
│   │   │   ├── timetable/        # Schedule viewer
│   │   │   ├── welfare/          # Vulnerable children
│   │   │   ├── inventory/        # Asset register
│   │   │   ├── reports/          # Analytics & charts
│   │   │   ├── audit-logs/       # Activity trail
│   │   │   └── settings/         # Configuration
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Redirect to /login
│   │   └── globals.css           # Zimbabwe green/gold theme
│   ├── components/
│   │   ├── ui/                   # ShadCN UI components
│   │   ├── layout/               # Sidebar, Topbar, MobileNav
│   │   ├── dashboard/            # StatCard
│   │   └── shared/               # PageHeader
│   ├── lib/
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── constants.ts          # Provinces, grades, subjects, nav
│   │   ├── mock-data.ts          # Demo data (120 students, etc.)
│   │   └── utils.ts              # cn() utility
│   └── providers/
│       └── auth-provider.tsx     # Authentication context
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Full database schema + seeds
├── SYSTEM_PLAN.md                # Complete architecture document
└── .env.local                    # Environment variables
```

---

## Database

The full PostgreSQL schema is in `supabase/migrations/001_initial_schema.sql` and includes:

- **30+ tables** with proper foreign keys and constraints
- **Row Level Security** policies for school-scoped data isolation
- **Seed data** for provinces, roles, grades, and subjects
- **Indexes** on all frequently queried columns

### Connecting to Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration SQL in the Supabase SQL editor
3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Deployment (Vercel)

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

Set environment variables in Vercel dashboard under Project Settings → Environment Variables.

---

## Design System

| Token | Value |
|-------|-------|
| Primary (Green) | `#166534` — Zimbabwe national colour |
| Accent (Gold) | `#CA8A04` — Zimbabwe flag gold |
| Alert (Red) | `#DC2626` — Warnings and destructive |
| Sidebar | Dark green with gold accents |
| Cards | White with subtle shadows |
| Font | Geist (Inter-like, professional) |
| Border Radius | 10px (modern, soft) |

---

## License

This project is developed for the Ministry of Primary and Secondary Education, Republic of Zimbabwe.

---

*Built with precision for national-scale education management.*
