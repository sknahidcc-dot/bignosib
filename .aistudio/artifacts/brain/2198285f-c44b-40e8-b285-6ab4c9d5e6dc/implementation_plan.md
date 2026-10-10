# BigNosib (বিগনসিব) – Lottery Platform Implementation Plan

BigNosib is a high-security, modern lottery web application featuring transparent prize distributions, manual payment verification (bKash, Nagad, USDT TRC20), automated ticket generation, live countdown draws, printable/downloadable ticket stubs, and an administrative control panel located at `/np/error`.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The database schema and project structure below require your review. Please confirm to begin full-stack development.

- **Frontend & Backend Architecture**: Full-stack Vite + React 19 SPA running with an Express 4 backend server (`server.ts`) for secure server-side admin authentication, session tokens, duplicate transaction checks, and cryptographic draw execution. Direct Supabase client integration for real-time reads and secure client authentication.
- **Language**: English user interface across all user and admin screens, matching the prompt requirements.
- **Prize Distribution Model**: 
  - 1st Prize (1 Winner): **15%** of total ticket sales pool
  - 2nd Prize (2 Winners): **15%** divided equally (**7.5%** each)
  - 3rd Prize (5 Winners): **20%** divided equally (**4%** each)
  - Platform Reserve: **50%** (strictly hidden from user UI, visible only in the Admin Panel)
- **Payment & Approval Pipeline**: Users submit payment proofs (bKash / Nagad / USDT Transaction ID). Status is `pending` until verified in Admin (`/np/error`). Only `approved` orders generate unique ticket numbers (e.g., `BN-2026-849201`) that enter the active draw.
- **Draw Lifecycle**: Scheduled draw countdown timer on Home & Results pages. Admins can run random draws (or manual selection) when the timer expires. Completed draws archive tickets; past tickets cannot roll over.

---

## 1. Overview & Core Concept

BigNosib provides a transparent, exciting, and accessible lottery experience:
- **Target Audience**: Participants purchasing digital lottery tickets via popular mobile banking (bKash, Nagad) or cryptocurrency (USDT TRC20), viewing upcoming prize pools, and tracking transparent draw results.
- **Core Value Proposition**: 
  - Guaranteed unique digital ticket numbers with instant verification.
  - High-converting, trustworthy visual presentation with live countdown timers and transparent prize pool infographics.
  - High security with strict anti-tampering, duplicate transaction rejection, and authenticated admin workflows.

---

## 2. User Experience & Visual Design

### Design System & Aesthetics (per `frontend-design` & `references/2_landing_marketing.md`)
- **Aesthetic Direction**: High-energy yet trustworthy fintech & gaming aesthetic. Deep obsidian navy canvas (`#0A0F1D`), emerald green victory accents (`#10B981`), warm gold prize accents (`#F59E0B`), and crisp typography.
- **Typography**: Display font `Plus Jakarta Sans` for bold, confident headings; Body font `DM Sans` for readable forms and terms; Tabular figures (`tabular-nums font-mono`) for all monetary amounts, countdown clocks, and ticket numbers.
- **Anti-AI Slop Discipline**:
  - No generic purple gradients or pill-badge clutter; clean text dividers (`·`) for metadata.
  - Generous whitespace, subtle 1px hairline borders (`border-slate-800`), and single-level elevation.
  - Top Bar Contract: Clean 3-zone header: Logo wordmark (`BigNosib`) — 4-5 navigation links — Primary Action (`Buy Ticket` / `Account`).

### Key Views & User Flows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Home Page (Hero + Live Countdown + Prize Distribution + Recent Winners)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│ 2. Lottery Buy Page           │             │ 3. Results & Archive Page     │
│ - Select ticket count         │             │ - Active draw countdown clock │
│ - bKash / Nagad / USDT guides │             │ - Past winning tickets & tiers│
│ - Submit Txn ID & Sender Phone│             │ - Masked winner details       │
└───────────────┬───────────────┘             └───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│ 4. Account & Profile          │             │ 5. Admin Panel (/np/error)    │
│ - Profile edit & avatar       │             │ - Secure auth with credentials│
│ - Order status (Pending/Appr) │             │ - Approve/Reject Txn IDs      │
│ - View & Download Tickets     │◄────────────┤ - Run / Finalize Draw         │
│   (Styled PNG / PDF stub)     │             │ - Settings & Financial Reports│
└───────────────────────────────┘             └───────────────────────────────┘
```

1. **Home Page**:
   - Marquee banner announcing current jackpot pool and next draw date.
   - Interactive Prize Breakdown diagram showcasing the 8 total winners (1st: 15%, 2nd: 15%, 3rd: 20%).
   - Live real-time countdown timer to the scheduled draw.
   - Verified recent winners wall with masked phone numbers (`01712*****`) and masked emails.
   - Step-by-step "How It Works" guide (Pick numbers -> Pay via bKash/Nagad/USDT -> Admin approves -> Win).
2. **Lottery Buy Page (Protected)**:
   - Dynamic price calculator (`Quantity × ৳50 + Extra Charge`).
   - Payment tabs: bKash Personal/Merchant, Nagad Personal/Merchant, USDT TRC20 Wallet Address (with one-click copy buttons and QR/instruction cards).
   - Clean verification form: Sender phone/wallet, Amount paid, Transaction ID (validated for format and duplicates).
3. **Account & Ticket Wallet (Protected)**:
   - User profile management: Avatar (under 200KB or letter initials fallback), Full Name, Username, Phone, Email, Country, Full Address.
   - Interactive Ticket Wallet: Displays pending orders and approved active/past tickets.
   - **Ticket Card Generator**: Printable/downloadable ticket with barcode pattern, unique number (`BN-2026-XXXXX`), buyer initials, draw date, and security seal.
4. **Draw & Results Page**:
   - Current draw countdown or live drawing simulation.
   - Historical draw archive with winning numbers, tiers, prize amounts, and masked winners.
5. **Admin Panel (`/np/error`)**:
   - Isolated security gate (Username `sknahid.cc`, Password `Sknahid@652391`).
   - Tab 1: **Pending Orders**: Searchable, filterable list of incoming payments. One-click Approve (generates ticket number and adds to draw pool) or Reject (with predefined or custom reason).
   - Tab 2: **Draw Management**: Set draw date/time, trigger secure random winner selection, preview winners, or enter manual winners; finalize draw to archive tickets.
   - Tab 3: **Settings**: Update ticket price (default ৳50), extra charge fee, bKash/Nagad/USDT numbers & addresses, announcement text.
   - Tab 4: **Financial Reports & Analytics**: Total pool collected, company revenue (50%), paid prizes, weekly/monthly/yearly filters.

---

## 3. Database Schema (Supabase / PostgreSQL)

The schema will be provisioned directly via Supabase / PostgreSQL:

```sql
-- 1. Profiles Table (Extends Supabase Auth or Standalone User Registry)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  password_hash TEXT NOT NULL,
  country VARCHAR(100) DEFAULT 'Bangladesh',
  address TEXT NOT NULL,
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user', -- 'user' | 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lottery Draws Table
CREATE TABLE IF NOT EXISTS draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_number INT GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(150) NOT NULL DEFAULT 'Weekly Mega Draw',
  draw_date TIMESTAMPTZ NOT NULL,
  total_tickets_sold INT DEFAULT 0,
  total_pool_amount NUMERIC(12, 2) DEFAULT 0.00,
  first_prize_pool NUMERIC(12, 2) DEFAULT 0.00,
  second_prize_pool NUMERIC(12, 2) DEFAULT 0.00,
  third_prize_pool NUMERIC(12, 2) DEFAULT 0.00,
  company_share NUMERIC(12, 2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'active', -- 'active' | 'drawing' | 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 3. Ticket Orders Table (Payment Submissions)
CREATE TABLE IF NOT EXISTS ticket_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  draw_id UUID REFERENCES draws(id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
  extra_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL, -- 'bkash' | 'nagad' | 'usdt'
  transaction_id VARCHAR(100) UNIQUE NOT NULL, -- Duplicate check enforced
  sender_number VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tickets Table (Created upon Admin Approval)
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. 'BN-2026-92841'
  order_id UUID REFERENCES ticket_orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  draw_id UUID REFERENCES draws(id) ON DELETE RESTRICT,
  is_winner BOOLEAN DEFAULT FALSE,
  prize_tier VARCHAR(20), -- '1st' | '2nd' | '3rd' | NULL
  prize_amount NUMERIC(10, 2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'valid', -- 'valid' | 'expired'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Draw Winners Table
CREATE TABLE IF NOT EXISTS draw_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prize_tier VARCHAR(20) NOT NULL, -- '1st' | '2nd' | '3rd'
  prize_amount NUMERIC(10, 2) NOT NULL,
  masked_phone VARCHAR(20) NOT NULL,
  masked_email VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  announced_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id INT PRIMARY KEY DEFAULT 1,
  ticket_price NUMERIC(10, 2) DEFAULT 50.00,
  extra_charge_name VARCHAR(50) DEFAULT 'Gateway Processing Fee',
  extra_charge_amount NUMERIC(10, 2) DEFAULT 0.00,
  bkash_number VARCHAR(50) DEFAULT '01700000000 (Personal)',
  nagad_number VARCHAR(50) DEFAULT '01800000000 (Personal)',
  usdt_address VARCHAR(100) DEFAULT 'TX1234567890ABCDEFTRC20',
  usdt_network VARCHAR(50) DEFAULT 'TRC20',
  next_draw_time TIMESTAMPTZ,
  banner_announcement TEXT DEFAULT 'Mega Draw is live! Buy your ticket now for ৳50.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Technical Architecture & File Organization

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Client (Browser)                              │
│  React 19 + Tailwind CSS + Lucide Icons + HTML5 Canvas Ticket Download │
└─────────────────────────────┬──────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌───────────────────────────────┐   ┌────────────────────────────────────┐
│ Express Server (/api/*)       │   │ Supabase Direct Client             │
│ - Admin Auth (/api/admin/*)   │   │ - Public Read: Current Draw &      │
│ - Secure Session Cookies      │   │   Winners Archive                  │
│ - Order Approval / Rejection  │   │ - Real-time Data Sync              │
│ - Cryptographic Draw Engine   │   │ - Profile Storage & Auth           │
│ - Duplicate Txn ID checks     │   │                                    │
└───────────────┬───────────────┘   └─────────────────┬──────────────────┘
                │                                     │
                └───────────────────┬─────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Supabase Cloud PostgreSQL Database                   │
│   (Profiles, Draws, Orders, Tickets, Winners, System Settings)         │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Modules & Responsibilities
- `server.ts`: Express backend handling `/api/admin/login`, `/api/admin/orders`, `/api/admin/draw`, `/api/admin/settings`, and `/api/orders/submit`.
- `src/lib/supabase.ts`: Supabase client initialization with fallback mock/offline persistence resilience.
- `src/lib/auth.ts`: Authentication state manager (persistent token, session user storage, phone+password check).
- `src/lib/lottery.ts`: Ticket number formatting, prize calculations (15%, 15%, 20%, 50%), and draw randomizers.
- `src/components/Navbar.tsx`: Strict 3-zone header, responsive mobile drawer, user session indicators.
- `src/components/Footer.tsx`: Clean legal links, copyright, support info, responsible gaming notice.
- `src/components/TicketCard.tsx`: High-resolution digital lottery stub with download as image/print action.
- `src/views/HomeView.tsx`: Marquee, hero, prize diagram, countdown timer, recent winners, FAQ.
- `src/views/LotteryBuyView.tsx`: Ticket order form, payment method instructions, transaction ID verification.
- `src/views/AccountView.tsx`: Profile editor with avatar upload, order tracking, downloadable ticket cards.
- `src/views/DrawResultsView.tsx`: Live countdown, winners roster, past draw history.
- `src/views/AdminView.tsx`: Secure route (`/np/error`), approval queue, draw executor, settings editor, revenue dashboard.
- `src/views/AuthViews.tsx`: Login (phone+password), Register, Forgot/Reset Password.
- `src/views/StaticPages.tsx`: About Us, Terms & Conditions, 404 Not Found.

---

## 5. Security & Verification Plan

1. **Transaction Integrity**: Unique constraint on `transaction_id` prevents duplicate submissions.
2. **Hidden Company Share**: The 50% company reserve is computed and stored on the server/admin tier only; never exposed on public client endpoints or user pages.
3. **Secure Admin Authentication**: Dedicated credentials verified against server-side hashed password and secure session tokens with rate-limiting.
4. **Data Privacy**: Public winner boards mask phone numbers (showing only first 5 digits, e.g. `01712*****`) and emails (`sk***@gmail.com`).
5. **Compilation & Linting**: Verified via `compile_applet` before deployment.
