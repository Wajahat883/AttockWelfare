# Attock Welfare — Monthly Contribution Management App

## Project Plan, Roadmap & Suggestions (Web + Mobile via PWA)

> **Version 2.0** — Updated tech stack: **Next.js + TypeScript + MySQL**, separate `frontend/` and `backend/` folders, deployed on **Hostinger VPS**.

---

## 1. Project Overview

A **monthly welfare fund (chanda/contribution) management system** for a community or organization. Members pay a fixed monthly amount, and the system tracks who paid and who did not. If a member misses a payment, a **WhatsApp reminder** can be sent directly from the app.

- **Web Application** — works in any browser (desktop + mobile).
- **Mobile** — handled via **PWA (Progressive Web App)**: the same website can be "installed" on Android/iPhone home screen and works like a real app. No separate mobile codebase needed.

---

## 2. User Roles & Permissions

Three roles, each with its own separate dashboard/screen.

### 2.1 Owner (Super Admin)
- Full control over the entire application.
- Can **add / remove Admins** and **add / remove Users**.
- Can add, edit, or delete **any data** (payments, members, records).
- Views reports, defaulter lists, and payment history.
- **Cannot be removed by anyone.** Only one Owner exists.

### 2.2 Admin (5–6 people)
- Can **add/edit Users** and their data.
- Can **add payment records** (name, father name, address, phone, monthly amount).
- Can **remove Users** (optional — can be restricted by Owner).
- **Cannot remove the Owner. Cannot manage other Admins.**

### 2.3 User (Member)
- Can **only view their own profile** and payment history (paid/unpaid months).
- Can **search** their own record.
- Cannot see other members' data. Read-only access.

### Permission Matrix

| Action | Owner | Admin | User |
|---|---|---|---|
| Add/Edit/Remove User | ✅ | ✅ (add/edit, optional remove) | ❌ |
| Remove Admin | ✅ | ❌ | ❌ |
| Remove Owner | ❌ | ❌ | ❌ |
| Add Payment Record | ✅ | ✅ | ❌ |
| View All Members | ✅ | ✅ | ❌ |
| View Own Profile Only | ✅ | ✅ | ✅ |
| Send WhatsApp Reminder | ✅ | ✅ (optional) | ❌ |
| View Reports / Defaulters | ✅ | ✅ (optional) | ❌ |

---

## 3. Core Features

1. **Authentication** — Secure login with JWT tokens + role detection (Owner/Admin/User).
2. **Member Management** — Name, Father Name, Address, Phone Number, Monthly Amount.
3. **Payment Tracking** — Month-by-month status (Paid / Unpaid / Partial).
4. **Dynamic Month/Year System** — Everything is date-driven and automatic (see section 3.1 below).
5. **Defaulter Detection** — Automatic list of members who haven't paid the current month.
6. **WhatsApp Notification** — One-tap WhatsApp message to defaulters via `wa.me` link with a pre-filled message (free, no API needed). Automatic sending via WhatsApp Cloud API can be added later.
7. **Search** — Fast search by name, father name, or phone number.
8. **Reports** — Monthly + yearly collection reports, total collected, total pending.
9. **Role-Based Dashboards** — Separate screens for Owner, Admin, and User.

### 3.1 Dynamic Month/Year/Date System (Everything Automatic)

Nothing is typed manually for dates — the system reads the **server's current date** and handles everything dynamically:

1. **Current Month & Year Auto-Detection** — Dashboards always show the live current month and year (e.g., *"August 2026"*). When the calendar changes to a new month, the app automatically switches — no admin action needed.
2. **Exact Payment Date Saved** — Every payment stores the **exact date** it was made (e.g., *"Paid on 14 August 2026"*), not just the month. Full date-time is recorded automatically at the moment the payment is added.
3. **Auto Month Rollover** — On the 1st of every new month, the defaulter list automatically resets: everyone becomes "Unpaid" for the new month until their payment is recorded.
4. **Month & Year Filters** — Every list and report can be filtered by any month + year (e.g., view *"March 2026"* records anytime). Past history is never lost.
5. **Month-Wise Payment Grid** — Each member's profile shows a grid of all 12 months of the running year with ✅ Paid / ❌ Unpaid badges, so one glance shows the whole year.
6. **Year-Wise View** — Switch between years (2025 / 2026 / 2027...) to see old records. Reports work per year too (e.g., *"Total collected in 2026"*).
7. **WhatsApp Message Includes Month Name Dynamically** — The reminder message automatically inserts the current month name, e.g.: *"Dear Ali, your contribution for August 2026 is pending..."*
8. **Urdu + English Month Names** — Month names display in the selected language (e.g., August / اگست).

---

## 4. Tech Stack (Final)

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | **Next.js 14+ (App Router) + TypeScript** | Modern, fast, SEO-friendly, huge ecosystem |
| **UI Styling** | **Tailwind CSS + shadcn/ui** | Beautiful, professional components, fast to build |
| **Backend** | **Node.js + Express + TypeScript** (REST API) | Simple, clean, separate from frontend |
| **Database** | **MySQL** | Reliable, supported by Hostinger, user preference |
| **ORM** | **Prisma** | Type-safe database access, easy migrations |
| **Auth** | **JWT (JSON Web Tokens) + bcrypt** | Secure, industry standard, no third-party dependency |
| **Mobile** | **PWA** (the Next.js app itself, installable) | One codebase → web + mobile-like experience |
| **WhatsApp** | `wa.me` deep link → Cloud API later | Free to start |
| **Hosting** | **Hostinger VPS** | Full control for Node.js + MySQL |

### Why This Architecture Is Good

- **Separate `frontend/` and `backend/` folders** → code never mixes, easy to maintain.
- Backend is a **pure REST API** → if you later want a real native mobile app (React Native), it can use the **same backend API** without any changes.
- **TypeScript on both sides** → fewer bugs, easier teamwork.
- **Prisma** → database changes are versioned and safe.

---

## 5. Project Folder Structure (Planned)

```
AttockWelfare/
│
├── frontend/                  # Next.js + TypeScript (UI only)
│   ├── src/
│   │   ├── app/               # Pages/routes
│   │   │   ├── login/         # Login page
│   │   │   ├── owner/         # Owner dashboard screens
│   │   │   ├── admin/         # Admin dashboard screens
│   │   │   └── user/          # User dashboard screens
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # API client (talks to backend)
│   │   └── types/             # TypeScript types
│   ├── public/                # Images, PWA manifest, icons
│   └── package.json
│
├── backend/                   # Express + TypeScript (API only)
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Auth + role-check middleware
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma      # MySQL models (users, payments)
│   └── package.json
│
└── PROJECT_PLAN.md            # This document
```

**Rule:** Frontend never contains business logic or database code. Backend never contains UI. They communicate only through HTTP API calls (JSON).

---

## 6. Database Design (MySQL — via Prisma)

### `users` table
| Column | Type | Notes |
|---|---|---|
| id | INT (auto increment) | Primary key |
| name | VARCHAR | Member name |
| father_name | VARCHAR | Father name |
| address | VARCHAR | Address |
| phone | VARCHAR (unique) | Used for login + WhatsApp |
| password_hash | VARCHAR | bcrypt hashed (NULL for users if needed) |
| role | ENUM('owner','admin','user') | Role-based access |
| monthly_amount | DECIMAL | Fixed monthly contribution |
| is_active | BOOLEAN | Soft delete flag |
| created_at | DATETIME | — |

### `payments` table
| Column | Type | Notes |
|---|---|---|
| id | INT | Primary key |
| user_id | INT | Foreign key → users.id |
| month | VARCHAR (e.g. "2026-08") | Payment month — **auto-filled from server date**, never typed manually |
| year | INT (e.g. 2026) | **Auto-filled** — enables fast year-wise filtering and reports |
| amount | DECIMAL | Amount paid |
| status | ENUM('paid','unpaid','partial') | — |
| paid_date | DATETIME | **Exact date + time of payment, saved automatically** (e.g., 2026-08-14 10:30) |
| added_by | INT | Which admin/owner added it |

> **Defaulter logic:** A member is a defaulter for month `X` if no row with `status='paid'` exists for that month. The "current month" is always derived from the server's live date — fully dynamic.

---

## 7. Screen Design (Three Dashboards)

### 7.1 Owner Dashboard (`/owner`)
- **Home:** Big header showing **current month + year live** (e.g., "August 2026"), total members, collected this month, pending, defaulter count (stat cards).
- **Members:** Full list + search + add/edit/remove.
- **Admins:** Manage admins (add/remove).
- **Payments:** View/verify all entries, each showing **exact paid date** (e.g., "14 Aug 2026"), filterable by any month/year.
- **Reports:** Monthly + **yearly** reports with charts, switchable between years.
- **WhatsApp button** next to each defaulter (message auto-includes current month name).

### 7.2 Admin Dashboard (`/admin`)
- **Home:** Current month + year header, this month's summary + defaulter list.
- **Members:** Add/edit member, record payment (date auto-saved).
- **WhatsApp reminder** button (if Owner allows).
- No option to manage Admins or Owner.

### 7.3 User Dashboard (`/user`)
- **My Profile:** Name, father name, address, phone.
- **My Payments:** **12-month grid of the running year** with ✅ Paid / ❌ Unpaid badges, each paid cell showing the **exact date** the money was given. Year switcher to view past years.
- Search own record. Fully read-only.

---

## 8. UI/UX Design Suggestions

- **Style:** Clean, modern, minimal using **Tailwind CSS + shadcn/ui** components.
- **Primary color:** Green (trust, welfare, money) — e.g., `#1B7A43`. Secondary: soft gold/amber.
- **Status colors:** Paid = Green ✅, Unpaid = Red ❌, Partial = Orange ⚠️.
- **Font:** Poppins or Inter (clean, Urdu/English-friendly).
- **UX principles:**
  1. Big buttons, clear labels — many users won't be tech experts.
  2. **Urdu + English toggle** — very important for local users.
  3. Bottom navigation on mobile (Home, Members, Payments, Profile).
  4. One-tap actions: "Mark as Paid", "Send WhatsApp Reminder".
  5. Search bar on top of every list.
  6. Defaulters highlighted in red cards.
  7. Confirmation dialog before any delete ("Are you sure?").
  8. Responsive design — must look perfect on mobile screens.
  9. Dark mode (optional).

---

## 9. Implementation Roadmap

### Phase 0 — Planning & Design (Week 1)
- Finalize requirements, design wireframes in Figma, finalize colors/logo.

### Phase 1 — Foundation (Weeks 2–3)
- Create `frontend/` (Next.js + TypeScript + Tailwind) and `backend/` (Express + TypeScript + Prisma) folders.
- Set up MySQL database + Prisma schema (users, payments).
- JWT login system + role middleware (owner/admin/user).
- Login page + role-based redirect to correct dashboard.

### Phase 2 — Core Features (Weeks 4–6)
- Member management API + UI (add/edit/list/search/remove).
- Payment recording API + UI (mark month as paid, **auto-save exact date/month/year from server**).
- **Dynamic month/year engine** — current month auto-detection, auto rollover on the 1st, month/year filters, 12-month member grid.
- Owner, Admin, User dashboards with full role-based protection (backend middleware + frontend guards).

### Phase 3 — WhatsApp & Reports (Week 7)
- Defaulter list API + screen.
- WhatsApp reminder button (`wa.me/<phone>?text=<pre-filled message>`).
- Monthly summary report screen.

### Phase 4 — PWA + Polish (Week 8)
- Add PWA manifest + service worker → installable on phones.
- UI polish, Urdu translations, mobile responsiveness, testing.

### Phase 5 — Deployment on Hostinger (Week 9)
- See section 10 below.

**Total estimated time: ~8–9 weeks** for v1.0.

---

## 10. Hostinger Deployment Plan (IMPORTANT)

### ⚠️ Critical Requirement: You Need a VPS, NOT Shared Hosting

Hostinger's cheap **shared hosting does NOT support Node.js/Next.js**. You must buy a **Hostinger VPS plan** (KVM 1 is enough to start — ~$5-6/month). A VPS gives you a full Linux server where Node.js and MySQL both run.

### Deployment Architecture

```
Internet
   │
   ▼
Nginx (on VPS) — handles SSL + routing
   ├── yourdomain.com        → Next.js frontend (port 3000)
   └── api.yourdomain.com    → Express backend  (port 5000)
                                    │
                                    ▼
                              MySQL (on same VPS)
```

### Step-by-Step (High Level)

1. **Buy Hostinger VPS** (Ubuntu 24.04). Point your domain's DNS (A record) to the VPS IP.
2. **Install on VPS:** Node.js (via nvm), MySQL Server, Nginx, PM2 (process manager).
3. **Push code to GitHub** (private repo) → `git clone` on the VPS.
4. **Backend setup:** `npm install` → create `.env` (DB credentials, JWT secret) → `npx prisma migrate deploy` → start with `pm2 start`.
5. **Frontend setup:** `npm install` → `npm run build` → start with `pm2 start`.
6. **Nginx config:** reverse proxy `yourdomain.com` → `localhost:3000`, `api.yourdomain.com` → `localhost:5000`.
7. **Free SSL:** install Certbot → `sudo certbot --nginx` → HTTPS enabled automatically.
8. **Create Owner account** directly in the database (one-time seed script).

### Easy Future Updates (deployment in 3 commands)

```bash
git pull          # get latest code
npm run build     # rebuild frontend
pm2 restart all   # restart both apps
```

> **My suggestion for maximum ease:** We will also add a simple `deploy.sh` script later so updating the live site becomes a single command.

### Backups (critical — this is money data)
- Daily automatic `mysqldump` via cron job → backup file stored on VPS (and optionally emailed/downloaded weekly).

---

## 11. Security Suggestions

1. **Role enforcement in backend middleware** — never trust the frontend; every API checks the JWT role.
2. **Owner protection** — backend hard-blocks any request that tries to delete/modify the Owner's role or account.
3. **Users can only read their own record** — enforced by user ID in JWT, not by what the frontend asks for.
4. **bcrypt password hashing** — passwords never stored in plain text.
5. **Rate limiting** on the login route (prevent brute-force attacks).
6. **`.env` files** for secrets — never committed to Git.
7. **HTTPS only** — via Certbot SSL.
8. **Daily database backups.**

---

## 12. Future Enhancements (v2.0+)

- Automatic WhatsApp messages via **WhatsApp Business Cloud API** (Meta).
- Native mobile app (React Native) using the **same backend API**.
- Online payments: JazzCash / EasyPaisa / bank transfer.
- PDF receipts for each payment.
- Expense tracking (where welfare money is spent).
- Push notifications.
- Yearly analytics and charts.

---

## 13. Final Suggestions

1. **Start with the MVP:** Login → Member list → Add payment → Defaulter list → WhatsApp reminder. Everything else comes after.
2. **Buy Hostinger VPS (KVM 1)** — shared hosting will not work for Next.js/Node.js. This is the most important infrastructure decision.
3. **Keep the frontend/backend separation strict** — it will make deployment and future mobile app development much easier.
4. **PWA first** — you get "mobile app" behavior for free; a real native app can come in v2.0.
5. **Design in Figma before coding** — approve screens first, saves rework.
6. **Daily MySQL backups** — this is financial data; never skip backups.

---

*Document version: 2.0 — Tech stack updated to Next.js + TypeScript + MySQL + Hostinger VPS, per project owner decision.*
