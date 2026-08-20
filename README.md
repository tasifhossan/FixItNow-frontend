# 🛠️ FixItNow - Home Services Marketplace for Bangladesh

FixItNow is a premium, high-trust on-demand home services marketplace designed to connect Customers with verified local Technicians (plumbers, electricians, cleaners, and AC repair technicians) in Bangladesh. This repository hosts the modern Next.js-based client application.

🔗 **Live Demo URL**: [https://fix-it-now-frontend-three.vercel.app/](https://fix-it-now-frontend-three.vercel.app/)

---

## 📋 Table of Contents
1. [Tech Stack](#-tech-stack)
2. [Key Features](#-key-features)
3. [Folder Structure](#-folder-structure)
4. [Getting Started & Local Setup](#-getting-started--local-setup)
5. [Environment Configuration](#-environment-configuration)

---

## 💻 Tech Stack

### Framework & Core
![Next.js](https://img.shields.io/badge/Next.js-15.5.23-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

### Styling & UI
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-1.31-pink?style=for-the-badge)

### Libraries & Utilities
* **Forms Management**: React Hook Form (v7.85.0)
* **Schema Validation**: Zod (v4.4.3) with `@hookform/resolvers`
* **API Client**: Axios (v1.19.0) with automatic bearer-token request interceptors
* **Server-side Security**: Jose (v6.2.8) for checking JWT signatures inside Edge Middleware
* **Alert Notifications**: React Hot Toast (v2.6.0)

---

## 🚀 Key Features

* **Role-Based Views**: Tailored client workflows, sidebars, and private dashboards for Customers, Technicians, and Admin accounts.
* **On-the-Fly Slot Booking**: Dynamically parses technician opening/closing schedules to generate available booking time slots while filtering out conflicting, pre-existing jobs.
* **Secure Payment Integration**: Implements a redirect sequence interfacing with the SSLCommerz sandbox gateway for client-side checkouts.
* **Interactive Reviews**: Post-service feedback loop that updates technician stats and ratings instantly.
* **Middleware Route Protection**: Next.js client-side/server-side route validation guarding dashboard layouts from unauthorized roles.

---

## 📁 Folder Structure

```text
frontend/src/app/
├── auth/               # Access forms (login, registration)
│   ├── layout.tsx
│   ├── login/
│   └── register/
├── dashboard/          # Private panels by role
│   ├── admin/          # User status, verify technicians, CRUD catalogs
│   ├── customer/       # Booking logs & feedback reviews
│   └── technician/     # Working hours, job status, earnings
├── payment/            # Payment gateway callback redirects
│   ├── success/
│   ├── failed/
│   └── cancelled/
├── services/           # Services catalog and details
│   ├── page.tsx
│   └── [id]/
├── technicians/        # Technician list and profiles
│   ├── page.tsx
│   └── [id]/
├── layout.tsx
└── page.tsx            # Main landing page
```

---

## ⚙️ Getting Started & Local Setup

To run this frontend client application locally:

### 1. Install Dependencies
Run the installation command inside the `frontend` root folder:
```bash
npm install
```

### 2. Configure Environment Variables
Create a file named `.env.local` inside the `frontend/` root directory and declare the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
JWT_REFRESH_SECRET=dd6e494c1774fea23c7408e5273763e85d59c7caa78edc2a203903a4f35d2760
```

> [!IMPORTANT]
> The `JWT_REFRESH_SECRET` key must match the secret key on your running backend server so the Next.js cryptographic token verification succeeds.

### 3. Launch Development Server
```bash
npm run dev
```
Once started, open [http://localhost:3000](http://localhost:3000) in your web browser.
