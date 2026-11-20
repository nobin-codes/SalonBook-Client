# SalonBook Client

**A modern salon appointment booking platform frontend built with Next.js 16, React 19, and Tailwind CSS 4.**

## Overview

SalonBook is a full-stack salon appointment booking platform where customers can explore grooming services, book appointments, and make payments via Stripe. Administrators can manage services, appointments, users, and view transaction history.

This repository contains the **frontend/client** application.

## Features

### Customer Features
- **Browse Services**: View active salon services with search, category filtering, and price sorting
- **Service Details**: View complete service information including images, descriptions, pricing, and duration
- **Appointment Booking**: Book appointments with date/time selection and optional messages
- **Dashboard**: View appointment history, status (pending/confirmed/cancelled), and payment status
- **Stripe Payments**: Secure payment processing for confirmed appointments via Stripe Checkout
- **Profile Management**: Update name, phone number, and profile image URL
- **Authentication**: Email/password registration/login, Google OAuth, JWT-based sessions

### Admin Features
- **Admin Dashboard**: Overview statistics (customers, services, appointments, payments)
- **Service Management**: Full CRUD for services with image upload (ImgBB), categories, pricing, and active/inactive status
- **Appointment Management**: View all appointments, confirm pending, cancel pending/confirmed
- **User Management**: View all users, block/unblock customer accounts
- **Transaction History**: View all payments with customer, service, amount, currency, Stripe session ID, and status

### Technical Features
- **Role-Based Access Control**: Separate customer/admin dashboards and permissions
- **Protected Routes**: Server-side and client-side route protection
- **Blocked User Handling**: Blocked users cannot access protected features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Toast Notifications**: Success/error feedback using Sonner
- **Image Optimization**: Next.js Image optimization with configured remote patterns

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Better Auth (React Client)
- **HTTP Client**: Custom fetch wrapper with JWT token handling
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Image Upload**: ImgBB integration (service images)
- **Payments**: Stripe Checkout (client-side redirect)
- **Linting**: ESLint 9 with Next.js config

## Installation

```bash
# Clone the repository
git clone https://github.com/nobin-codes/SalonBook-Client.git
cd SalonBook-Client

# Install dependencies
npm install

# Copy environment template and configure
cp .env.example .env.local
# Edit .env.local with your values
```

## Environment Variables

Create a `.env.local` file with the following variables (names only - never commit actual values):

```env
# API URL (your deployed backend URL)
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Running Locally

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

The application will be available at `http://localhost:3000`.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` - Your deployed backend API URL
4. Deploy

### Other Platforms

The Next.js application can be deployed to any platform supporting Node.js:
- Build: `npm run build`
- Start: `npm start`
- Ensure `NEXT_PUBLIC_API_URL` is set in environment

## Repository

- **Client**: https://github.com/nobin-codes/SalonBook-Client
- **Server**: https://github.com/nobin-codes/SalonBook-Server

## Live Demo

- **Frontend**: https://salonbook-mu.vercel.app/
- **Backend API**: https://salonbook-server-sooty.vercel.app/

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard routes
│   │   ├── appointments/  # Customer appointment management
│   │   ├── profile/       # User profile
│   │   ├── services/      # Admin service management
│   │   ├── transactions/  # Admin transaction history
│   │   └── users/         # Admin user management
│   ├── services/          # Public service browsing & details
│   ├── login/             # Sign in page
│   ├── register/          # Sign up page
│   ├── payment/           # Stripe success/cancel pages
│   └── salon-details/     # Salon information page
├── components/
│   └── layout/            # Navbar, Footer, SiteShell
├── lib/
│   ├── api.ts             # API client with auth
│   ├── auth-client.ts     # Better Auth client
│   ├── get-access-token.ts # JWT token retrieval
│   └── upload-image.ts    # ImgBB upload helper
└── globals.css            # Global styles
```

## API Integration

The client communicates with the backend REST API at `NEXT_PUBLIC_API_URL`:

- `GET /api/services` - Browse active services (public)
- `GET /api/services/featured` - Featured services for home page
- `GET /api/services/[id]` - Service details (public)
- `POST /api/appointments` - Create appointment (customer)
- `GET /api/appointments` - List appointments (authenticated)
- `PATCH /api/appointments/[id]/status` - Update appointment status
- `POST /api/payments/create-checkout-session` - Create Stripe Checkout session
- `GET /api/payments/transactions` - List transactions (admin)
- `GET /api/users` - List users (admin)
- `PATCH /api/users/[id]/status` - Block/unblock user (admin)
- `POST /api/uploads/image` - Upload image to ImgBB (authenticated)
- `GET /api/services/manage` - Admin service listing
- `POST/PATCH/DELETE /api/services` - Admin service CRUD

## Authentication Flow

1. User registers/logs in via Better Auth (email/password or Google)
2. Better Auth sets secure HTTP-only cookies
3. Client retrieves JWT access token via `authClient.token()`
4. API requests include `Authorization: Bearer <token>` header
5. Server verifies JWT via JWKS endpoint
6. Role and block status checked on each protected request

## License

ISC