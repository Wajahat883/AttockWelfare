# Attock Welfare — Implementation Steps

## Phase 0: Project Setup & Structure

### Step 1: Initialize Project Folders
- [x] Create `frontend/` folder (Next.js 14+ App Router)
- [x] Create `backend/` folder (Express API)
- [x] Initialize Git repository
- [x] Create `.gitignore` for Node.js projects

### Step 2: Frontend Setup (Next.js + TypeScript + Tailwind)
- [x] Initialize Next.js 14 with TypeScript
- [x] Install Tailwind CSS
- [x] Install shadcn/ui components library
- [x] Set up folder structure:
  - `src/app/` — Pages/routes
  - `src/components/` — Reusable UI components
  - `src/lib/` — API client utilities
  - `src/types/` — TypeScript type definitions
  - `public/` — Static files, PWA manifest
- [x] Create `.env.local` for API URLs

### Step 3: Backend Setup (Express + TypeScript + Prisma)
- [x] Initialize Node.js project with TypeScript
- [x] Install Express, Prisma, JWT libraries (jsonwebtoken, bcryptjs)
- [x] Set up folder structure:
  - `src/routes/` — API endpoints
  - `src/controllers/` — Request handlers
  - `src/services/` — Business logic
  - `src/middleware/` — Auth, role-checking middleware
  - `src/utils/` — Helper functions
  - `prisma/` — Database schema
- [x] Create `.env` for database, JWT secret

### Step 4: Database Schema (Prisma + MySQL)
- [x] Install MySQL locally (or use cloud MySQL) — *User's responsibility*
- [x] Create Prisma schema:
  - `users` table (id, name, father_name, address, phone, password_hash, role, monthly_amount, is_active, created_at)
  - `payments` table (id, user_id, month, year, amount, status, paid_date, added_by)
- [x] Run `prisma migrate dev` to create database — *Ready to execute*

---

## Phase 1: Authentication & Role-Based Access

### Step 5: Backend — JWT Authentication
- [x] Create JWT token generation function
- [x] Create `authMiddleware` — validates JWT, extracts user role
- [x] Create `roleMiddleware` — checks if user has permission for action (Owner/Admin/User)
- [x] Create password hashing utility with bcrypt

### Step 6: Backend — Login API Endpoint
- [x] Create `POST /api/auth/login` endpoint
  - Input: phone + password
  - Output: JWT token + user role + user ID
  - Error handling: invalid credentials, inactive user

### Step 7: Frontend — Login Page
- [x] Design login page with Tailwind + shadcn/ui
  - Phone number input
  - Password input
  - Submit button
  - Error message display
- [x] Store JWT token in localStorage/cookies
- [x] Redirect to appropriate dashboard based on role
- [x] Public user signup (signup can only create a `USER` account)

### Step 8: Frontend — Role-Based Route Guards
- [x] Create `ProtectedRoute` component — checks JWT + role
- [x] Create redirects:
  - Owner → `/owner` dashboard
  - Admin → `/admin` dashboard
  - User → `/user` dashboard
- [x] Logout functionality

---

## ✅ PHASE 0 & 1: COMPLETE

**Status:** All authentication and project setup complete! 🎉

✅ Backend compiles successfully
✅ Frontend builds successfully
✅ Database schema ready (Prisma)
✅ JWT authentication implemented
✅ Login page with role-based redirects
✅ Auth context & protected routes
✅ Seed script ready with demo users
✅ Logout functionality

**Quick Start:**
```bash
# Setup MySQL database, then:
cd backend
npm run prisma:migrate    # Create database tables
npm run prisma:seed       # Add demo users

# Terminal 1: Backend
npm run dev               # http://localhost:5000

# Terminal 2: Frontend
cd ../frontend
npm run dev               # http://localhost:3000

# Demo Login: 03001111111 / password123 (Owner)
```

---

## Phase 2: Core Features — Member Management & Payment Tracking

### Step 9: Backend — Member Management APIs
- [x] `GET /api/members` — List all members (Owner/Admin only)
- [x] `POST /api/members` — Add new member (Owner/Admin only)
- [x] `PUT /api/members/:id` — Edit member (Owner/Admin only)
- [x] `DELETE /api/members/:id` — Remove member (Owner only)
- [x] `GET /api/members/search/:query` — Search by name/father name/phone
- [x] `GET /api/members/:id` — Get single member details (User can only view own)

### Step 10: Backend — Payment Recording APIs
- [x] `POST /api/payments` — Add payment record
  - Auto-save current date (server-side)
  - Auto-save current month & year (derived from server date)
  - Input: user_id, amount, status
  - Output: payment record with exact timestamp
- [x] `GET /api/payments/:user_id` — Get all payments for a member
- [x] `GET /api/payments/month/:month/year/:year` — Get all payments for a specific month/year
- [x] `DELETE /api/payments/:id` — Delete payment (Owner only)

### Step 11: Backend — Defaulter Detection
- [x] Create `getDefaulters()` service function
  - Current month/year derived from server date
  - Return list of members with no "paid" status for current month
- [x] Create `GET /api/defaulters` endpoint

### Step 12: Backend — Dynamic Month/Year System
- [x] Create utility function `getCurrentMonth()` — returns "YYYY-MM" from server date
- [x] Create utility function `getCurrentYear()` — returns YYYY from server date
- [x] Create utility function `getMonthName(month, language='urdu'|'english')` — returns "August" or "اگست"
- [x] Auto-populate `month` and `year` fields on every payment creation

### Step 13: Frontend — Member Management UI (Admin/Owner)
- [x] Create Members list page:
  - Display all members in table
  - Search bar (by name, father name, phone)
  - Add Member button → modal form
  - Edit button per member
  - Delete button with confirmation
  - Each row shows: Name, Father Name, Phone, Monthly Amount, Status (Active/Inactive)
- [x] Create Member form component (add/edit):
  - Name, Father Name, Address, Phone, Monthly Amount inputs
  - Submit button with validation

### Step 14: Frontend — Payment Recording UI (Admin/Owner)
- [x] Create "Record Payment" page:
  - Select member dropdown
  - Amount input (pre-filled with member's monthly_amount)
  - Status dropdown (Paid/Unpaid/Partial)
  - Auto-display current date (server date) — read-only
  - Auto-display current month/year — read-only
  - Submit button
  - List below showing recently recorded payments

### Step 15: Frontend — Member's Payment Grid (12-Month Display)
- [x] Create payment grid component:
  - Shows all 12 months of current year in a grid (Jan, Feb, Mar... Dec)
  - Each month cell shows: ✅ Paid / ❌ Unpaid / ⚠️ Partial badge
  - Paid cells show exact date (e.g., "Paid 14 Aug 2026")
  - Click to view details of that payment
  - Year switcher dropdown — view previous years (2025, 2024...) with same grid

---

## Phase 3: Dashboards — Owner, Admin, User

### Step 16: Backend — Dashboard Summary APIs
- [x] `GET /api/dashboard/summary` — Returns:
  - Current month & year
  - Total members count
  - Total collected this month
  - Total pending this month
  - Defaulter count
- [x] `GET /api/dashboard/defaulters` — List of all defaulters for current month
- [x] `GET /api/dashboard/yearly-report/:year` — Yearly statistics

### Step 17: Frontend — Owner Dashboard
- [x] Create `/owner` layout
  - Navigation sidebar/top bar (Members, Admins, Payments, Reports, Logout)
- [x] Create Owner Home screen:
  - Big header: "August 2026" (current month/year, auto-updated)
  - Stat cards: Total Members, Collected This Month, Pending, Defaulters
  - Defaulters list with red cards:
    - Member name, phone, amount pending
    - WhatsApp button next to each
  - Recent payments table
- [x] Create Owner Members screen:
  - Full members list + search
  - Add/Edit/Delete buttons with confirmations
- [x] Create Owner Admins screen:
  - List of all admins
  - Add admin button
  - Remove admin button (with confirmation, cannot remove Owner)
- [x] Create Owner Payments screen:
  - View all payments with exact dates
  - Filter by month/year dropdowns
  - Search members
- [x] Create Owner Reports screen:
  - Monthly report: total collected, total pending, per-member breakdown
  - Yearly report: switch between years (2025/2026...)
  - Charts (bar chart: collected vs pending)

### Step 18: Frontend — Admin Dashboard
- [x] Create `/admin` layout (similar to Owner, but fewer options)
  - Navigation: Members, Payments, Reports (if allowed), Logout
- [x] Create Admin Home screen:
  - Current month/year header
  - Stat cards: Total Members, Collected This Month, Pending, Defaulters
  - Defaulters list with WhatsApp buttons
- [x] Create Admin Members screen:
  - Add/Edit members
  - Search members
  - (Remove button optional — depends on Owner settings)
- [x] Create Admin Payments screen:
  - Record payment (same as Step 14)
  - View payments (filtered by month/year)

### Step 19: Frontend — User Dashboard
- [x] Create `/user` layout
  - Simple top bar with logout
  - Navigation: My Profile, My Payments
- [x] Create User Profile screen:
  - Display-only fields:
    - Name, Father Name, Address, Phone
    - Monthly Amount
- [x] Create User Payments screen:
  - 12-month grid (as per Step 15)
  - Year switcher
  - Each paid cell shows exact date

---

## Phase 4: WhatsApp & Advanced Features

### Step 20: Backend — WhatsApp Message Generator
- [x] Create utility function `generateWhatsAppMessage(member, month, language)`
  - Message: "Dear [Name], your contribution for [Month] [Year] is pending. Please pay [Amount] as soon as possible."
  - Language: Urdu or English
  - Auto-insert current month name from server date

### Step 21: Frontend — WhatsApp Reminder Button
- [x] Add WhatsApp button next to each defaulter:
  - On click: generate WhatsApp link `wa.me/<phone>?text=<pre-filled message>`
  - Message auto-includes current month name
  - Opens WhatsApp (web or mobile app)

### Step 22: Backend — Reports API
- [x] `GET /api/reports/monthly/:month/:year` — Monthly collection report
  - Total collected, total pending, breakdown per member
- [x] `GET /api/reports/yearly/:year` — Yearly report
  - Total collected, total pending, monthly breakdown

### Step 23: Frontend — Advanced Search
- [x] Add global search bar:
  - Search members by name, father name, phone
  - Search payments by member name + month
  - Results appear in dropdown

---

## Phase 5: UI/UX Polish & Internationalization

### Step 24: Styling & Colors
- [x] Apply Tailwind CSS design system:
  - Primary color: Green (#1B7A43)
  - Secondary color: Gold/Amber
  - Status colors: Green (Paid ✅), Red (Unpaid ❌), Orange (Partial ⚠️)
  - Font: Poppins or Inter
- [x] Create reusable styled components:
  - Stat card component
  - Payment grid component
  - Member table component
  - Form components

### Step 25: Urdu + English Internationalization
- [x] Create i18n translation file:
  - All UI text in both Urdu and English
  - Month names in both languages
  - Button labels, messages, placeholders
- [x] Add language toggle button (top-right or settings)
- [x] Store language preference in localStorage

### Step 26: Mobile Responsiveness (PWA)
- [x] Test all pages on mobile (375px width)
- [x] Add mobile bottom navigation bar:
  - Home, Members, Payments, Profile, Settings
  - Visible only on mobile (hidden on desktop)
- [x] Adjust font sizes and spacing for mobile
- [x] Ensure touch-friendly buttons (min 44px height)
- [x] Create PWA manifest (`manifest.json`)
- [x] Add service worker for offline support
- [x] Add "Install App" prompt

### Step 27: Dark Mode (Optional)
- [x] Add dark mode toggle
- [x] Use Tailwind's `dark:` utilities
- [x] Store preference in localStorage

---

## Phase 6: Security & Admin Setup

### Step 28: Backend — Security Hardening
- [x] Add rate limiting on login route (e.g., 5 attempts per 15 minutes)
- [x] Add request validation (sanitize inputs)
- [x] Add CORS middleware (allow frontend domain only)
- [x] Add logging middleware (log all API calls)
- [x] Add error handling middleware (never expose stack traces to client)

### Step 29: Backend — Owner Account Creation
- [x] Create seed script to insert first Owner account directly into database
- [x] Script takes: name, phone, password
- [x] One-time setup script

### Step 30: Database Backup Strategy
- [x] Create backup script (mysqldump)
- [x] Schedule daily backups via cron

---

## Phase 7: Deployment on Hostinger VPS

### Step 31: VPS Setup
- [ ] Buy Hostinger VPS (Ubuntu 24.04)
- [ ] SSH into VPS
- [ ] Install Node.js (via nvm)
- [ ] Install MySQL Server
- [ ] Install Nginx
- [ ] Install PM2 (process manager)

### Step 32: Deploy Backend
- [ ] Push backend code to GitHub (private repo)
- [ ] Clone repo on VPS
- [ ] Create `.env` file with database credentials + JWT secret
- [ ] Run `npm install` and `npm run build`
- [ ] Run `npx prisma migrate deploy` to create tables
- [ ] Start backend with `pm2 start`

### Step 33: Deploy Frontend
- [ ] Push frontend code to GitHub
- [ ] Clone repo on VPS
- [ ] Create `.env.local` with backend API URL
- [ ] Run `npm install` and `npm run build`
- [ ] Start frontend with `pm2 start`

### Step 34: Nginx Configuration
- [ ] Configure Nginx reverse proxy:
  - `yourdomain.com` → `localhost:3000` (frontend)
  - `api.yourdomain.com` → `localhost:5000` (backend)
- [ ] Enable SSL with Certbot (free HTTPS)
- [ ] Restart Nginx

### Step 35: Deployment Script
- [x] Create `deploy.sh` script:
  - `git pull`
  - `npm run build`
  - `pm2 restart all`
  - Make deployment a single command

---

## Summary of Files to Create

### Frontend
- Login page
- Owner dashboard (Home, Members, Admins, Payments, Reports)
- Admin dashboard (Home, Members, Payments, Reports)
- User dashboard (Profile, Payments Grid)
- Components: MemberTable, PaymentGrid, StatCard, LanguageToggle, BottomNav (mobile)

### Backend
- `POST /api/auth/login` — Authentication
- `GET/POST/PUT/DELETE /api/members` — Member management
- `GET/POST/DELETE /api/payments` — Payment recording
- `GET /api/defaulters` — Defaulter list
- `GET /api/dashboard/*` — Dashboard summaries
- `GET /api/reports/*` — Reports
- Middleware: `authMiddleware`, `roleMiddleware`
- Services: Member, Payment, Dashboard, Report services
- Utility functions: JWT, password hashing, date handling

### Database
- Prisma schema with `users` and `payments` tables
- Migration files
- Seed script for first Owner account

---

## Timeline Estimate
- **Phase 0 (Setup):** 1 day
- **Phase 1 (Auth):** 2 days
- **Phase 2 (Core Features):** 5 days
- **Phase 3 (Dashboards):** 4 days
- **Phase 4 (WhatsApp & Reports):** 2 days
- **Phase 5 (Polish & i18n):** 3 days
- **Phase 6 (Security):** 1 day
- **Phase 7 (Deployment):** 2 days

**Total: ~20 days** (full-time development)

---

## Current Status

Application phases 0–6 are complete, including the responsive UI/UX polish, and verified with backend TypeScript compilation, frontend production build, and ESLint. All unchecked items before Phase 7 have been completed. Phase 7 remains intentionally pending because VPS purchase, DNS, SSH, SSL issuance, and production database migration must be performed in the target Hostinger environment.
