# 🛠️ FixItNow - Home Services Marketplace for Bangladesh

[![Next.js](https://img.shields.io/badge/Next.js-15.5.23-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](#)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](#)

FixItNow is a premium, high-trust on-demand home services marketplace designed to connect Customers with verified local Technicians (plumbers, electricians, cleaners, and AC repair technicians) in Bangladesh. This repository hosts the modern Next.js-based client application.

🔗 **Live Demo URL**: [https://fix-it-now-frontend-three.vercel.app/](https://fix-it-now-frontend-three.vercel.app/)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Dependencies](#dependencies)
- [Installation & Setup](#installation--setup)
- [Folder Structure](#folder-structure)
- [Contributions](#contributions)
- [How to Contribute](#how-to-contribute)
- [License](#license)
- [Contact](#contact)

---

## 📖 About the Project

FixItNow was built to solve the difficulty of finding reliable, professional home maintenance services in Bangladesh. It bridges the gap between home-owners requiring high-quality plumbing, electrical work, deep cleaning, or AC servicing and verified, skilled local technicians. By shifting from informal hiring practices to a secure digital environment, FixItNow brings accountability, transparency, and safety to local service commerce.

---

## 🔍 Project Overview

The client application is built on **Next.js** using the modern **App Router** layout. It serves three distinct user roles:

1. **Customers**: Search for services, compare verified service providers, book specific times, complete secure sandboxed checkouts, and review technicians.
2. **Technicians**: Configure professional profiles (hourly rates, custom bio, skills), manage weekly working hours, accept/decline booking requests, and track total earnings.
3. **Admins**: Approve or block users, verify technician partner profiles for public visibility, manage global service catalogs, and monitor platform-wide booking metrics.

---

## 🚀 Key Features

* **Role-Based Client Views**: Tailored client workflows, sidebars, and private dashboards for Customers, Technicians, and Admin accounts.
* **On-the-Fly Slot Booking**: Dynamically parses technician opening/closing schedules to generate available booking time slots while filtering out conflicting, pre-existing jobs.
* **Secure Payment Integration**: Implements a redirect sequence interfacing with the SSLCommerz sandbox gateway for client-side checkouts.
* **Interactive Reviews**: Post-service feedback loop that updates technician stats and ratings instantly.
* **Middleware Route Protection**: Next.js client-side/server-side route validation guarding dashboard layouts from unauthorized roles.

---

## 💻 Tech Stack

- **Framework**: Next.js (v15.5.23) using the React 19 App Router layout
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v3.4.1) & PostCSS
- **State Management & Form Handling**: React Hook Form

---

## 📦 Dependencies

The frontend application utilizes the following core packages:

| Library | Version | Description |
| :--- | :--- | :--- |
| **`react-hook-form`** | `^7.85.0` | Manage client form inputs and validation states |
| **`zod`** | `^4.4.3` | Define strict validation schemas resolved via `@hookform/resolvers` |
| **`axios`** | `^1.19.0` | Promise-based HTTP client using authorization bearer interceptors |
| **`jose`** | `^6.2.8` | Verify JWT signatures inside Next.js edge Middleware |
| **`lucide-react`** | `^1.31.0` | Clean, modern SVG icon library |
| **`react-hot-toast`** | `^2.6.0` | Responsive user-facing toast notifications |

---

## 🛠️ Installation & Setup

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

## 🤝 Contributions

FixItNow is built and maintained as a modern web application project. Special thanks to all mentors and peer reviewers who assisted in refining the database models, API route design, and frontend component modularity.

---

## 📥 How to Contribute

We welcome contributions to improve the client codebase! To contribute:

1. **Fork** the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "feat: add your descriptive message"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a **Pull Request** detailing the enhancements made.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📬 Contact

For inquiries, support, or feedback regarding the FixItNow application:

* **Email**: support@fixitnow.com
* **GitHub Issues**: Please open an issue in this repository.
