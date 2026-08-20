# FixItNow - Home Services Marketplace for Bangladesh

FixItNow is a premium, high-trust on-demand home services marketplace designed to connect Customers with verified local Technicians (plumbers, electricians, cleaners, and AC repair technicians) in Bangladesh.

---

## Live Demo
Live Demo URL: `[ADD DEPLOYED URL HERE]`

---

## Tech Stack

### Frontend Core & Libraries
* **Framework**: Next.js (v15.5.23) using the React 19 App Router layout
* **Language**: TypeScript
* **State & Forms**: React Hook Form (v7.85.0) with `@hookform/resolvers` and Zod (v4.4.3)
* **HTTP Client**: Axios (v1.19.0) with automatic interceptors for bearer tokens
* **Styling**: Tailwind CSS (v3.4.1) & PostCSS
* **Icons**: Lucide React (v1.31.0)
* **Notifications**: React Hot Toast (v2.6.0)
* **Auth helpers**: Jose (v6.2.8) for cryptographic signature checks of tokens on Middleware

---

## Features by Role

### 🌍 Public / Guest
* **Browse Categories & Services**: Sleek landing page and directory showcasing cleaning, plumbing, electrical, and AC services.
* **Browse & Search Technicians**: Access verified technician profiles with their hourly rates, ratings, and reviews.
* **Authentication**: Multi-role registration (Customer/Technician selection) and login.

### 👤 Customer
* **Profile Management**: Update user profile details (name, phone) and change password securely.
* **Slot-Based Booking**: Book verified technicians by choosing a service, checking live hourly slot availability calculated from the technician's working hours, and inputting booking details (date, address, notes).
* **Booking Track & Control**: Track service requests; cancel bookings that are pending (`REQUESTED`) or accepted (`ACCEPTED`) but not yet paid.
* **SSLCommerz Sandbox Payment**: Pay for accepted bookings securely via redirect to the SSLCommerz payment gateway.
* **Ratings & Reviews**: Rate technicians (1-5 stars) and write comments upon booking completion, automatically recalculating the technician's global metrics.

### 🔧 Technician
* **Profile Configuration**: Set bio details, specialized skills list, and customized hourly rate (BDT).
* **Service Selection**: Bind/unbind the services they offer from the admin's global catalog.
* **Availability Toggle**: Set status between Available (Online) and Busy (Offline).
* **Working Hours Configuration**: Customize opening and closing hours for each day of the week to generate booking time slots dynamically.
* **Booking Response & Workflow**: Accept/decline booking requests, transition accepted paid jobs to `IN_PROGRESS`, and mark active tasks as `COMPLETED`.
* **Earnings Overview**: View total accumulated earnings computed from paid, in-progress, and completed bookings.

### 👑 Admin
* **System Metrics Dashboard**: View key statistics including counts of users, bookings, active categories, revenue, and recent platform bookings.
* **User & Partner Operations**: Block/unblock users (both customers and technicians) and verify technicians to enable public catalog searches.
* **Category CRUD**: Create, view, edit, and delete categories (deletions fail if there are linked services).
* **Service CRUD**: Manage base prices, descriptions, and categories for individual service types (deletions fail if there are active bookings).
* **Global Bookings**: Search and inspect details of all platform bookings.

---

## Setup & Local Installation

### 1. Prerequisites & Cloning
```bash
git clone <repository-url>
cd fixitnow
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env`:
   * `DATABASE_URL`: Connection string for PostgreSQL database
   * `JWT_SECRET` & `JWT_REFRESH_SECRET`: Cryptographic keys for signing JSON Web Tokens
   * `ADMIN_EMAIL` & `ADMIN_PASSWORD`: Default superuser credentials
   * `SSLCOMMERZ_STORE_ID` & `SSLCOMMERZ_STORE_PASSWORD`: Sandbox store credentials
   * `SSLCOMMERZ_IS_LIVE`: Set to `false` for Sandbox mode
   * `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: (Optional) Image hosting credentials

5. Generate the Prisma client & sync migrations to your database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
6. Seed default system categories, services, and the admin user:
   ```bash
   npx prisma db seed
   ```
7. Start the backend development server:
   ```bash
   npm run dev
   ```
   * *Default backend port: `5000` (`http://localhost:5000/api/v1`)*

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables in `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   JWT_REFRESH_SECRET=dd6e494c1774fea23c7408e5273763e85d59c7caa78edc2a203903a4f35d2760
   ```
   > [!IMPORTANT]
   > The `JWT_REFRESH_SECRET` must match the value configured in the backend's `.env` for Next.js middleware token checks to succeed.
4. Run the frontend development server:
   ```bash
   npm run dev
   ```
   * *Default frontend port: `3000` (`http://localhost:3000`)*

---

## Test & Demo Credentials
You can use these pre-configured test credentials to log in without registering a new account:

* **System Admin**:
  * Email: `admin@fixitnow.com`
  * Password: `fixitnow!3432134`
* **Test Customer**:
  * Email: `tasif.customer@test.com`
  * Password: `testpassword123`
* **Test Technician**:
  * Email: `fahad.technician@test.com`
  * Password: `testpassword123`

---

## Folder Structure (Frontend app layout)

```text
frontend/src/app/
├── auth/               # Auth pages (login, registration)
│   ├── layout.tsx
│   ├── login/
│   └── register/
├── dashboard/          # Private dashboards by role
│   ├── admin/          # Admin CRUDs, user approvals & stats
│   ├── customer/       # Customer profile & booking logs
│   └── technician/     # Technician settings, bookings, schedules & earnings
├── payment/            # Payment gateway redirects
│   ├── success/
│   ├── failed/
│   └── cancelled/
├── services/           # Public service catalogs
│   ├── page.tsx
│   └── [id]/
├── technicians/        # Public technician profiles
│   ├── page.tsx
│   └── [id]/
├── layout.tsx
└── page.tsx            # Landing page
```

---

## Known Limitations & Gaps
* **No Forgot/Reset Password Route**: Users can change their password when logged in via profile page, but there is no email-based forgot password/reset flow.
* **Notification System**: State updates (such as payment receipts or technician job confirmations) require manual page refreshes or route changes. Real-time push notifications/WebSockets are not integrated.
* **Manual Refund Mechanism**: Refunds for cancelled paid appointments must be manually processed in the SSLCommerz merchant console.
* **Profile Picture Upload UI**: The backend supports file uploads via Cloudinary, but the current frontend form only updates profile text values.
