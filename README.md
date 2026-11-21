# SalonBook Client

**A modern salon appointment booking platform frontend built with Next.js 16, React 19, and Tailwind CSS 4.**

## Overview

SalonBook is a full-stack salon appointment booking platform where customers can explore grooming services, book appointments, and make payments via Stripe. Administrators can manage services, appointments, users, and view transaction history.

This repository contains the **frontend/client** application.

## Features

### Customer Features
- **Browse Services**: View active salon services with search, category filtering, and price sorting.
- **Service Details**: View complete service information including images, descriptions, pricing, and duration.
- **Appointment Booking**: Book appointments with date/time selection and optional messages.
- **Dashboard**: View appointment history, status (pending/confirmed/cancelled), and payment status.
- **Stripe Payments**: Secure payment processing for confirmed appointments via Stripe Checkout.
- **Profile Management**: Update name, phone number, and profile image.
- **Authentication**: Email/password registration/login, Google OAuth, and JWT-based API authentication.

### Admin Features
- **Admin Dashboard**: Overview statistics for customers, services, appointments, and payments.
- **Service Management**: Full CRUD for services with image upload (ImgBB), categories, pricing, and active/inactive status.
- **Appointment Management**: View all appointments, confirm pending appointments, and cancel pending or confirmed appointments.
- **User Management**: View users and block/unblock customer accounts.
- **Transaction History**: View payments with customer, service, amount, currency, Stripe session ID, and status.

### Technical Features
- **Role-Based Access Control**: Separate customer/admin dashboards and permissions.
- **Protected Routes**: Server-side and client-side route protection.
- **Blocked User Handling**: Blocked users cannot access protected features.
- **Responsive Design**: Works on desktop, tablet, and mobile.
- **Toast Notifications**: Success/error feedback using Sonner.
- **Image Optimization**: Next.js Image optimization with configured remote patterns.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Better Auth (React Client)
- **HTTP Client**: Custom fetch wrapper with JWT token handling
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Image Upload**: ImgBB integration for service images
- **Payments**: Stripe Checkout
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

Create a `.env.local` file with the following variable. Never commit actual secret values.

```env
# Deployed backend API URL
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Running Locally

```bash
# Development server
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

1. Push the client repository to GitHub.
2. Import the repository into Vercel.
3. Configure the environment variable in the Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` - Your deployed backend API URL.
4. Deploy the application.

### Other Platforms

The Next.js application can be deployed to any platform supporting Node.js.

- Build: `npm run build`
- Start: `npm start`
- Ensure `NEXT_PUBLIC_API_URL` is configured.

## Repository

- **Client**: https://github.com/nobin-codes/SalonBook-Client
- **Server**: https://github.com/nobin-codes/SalonBook-Server

## Live Demo

- **Frontend**: https://salonbook-mu.vercel.app/
- **Backend API**: https://salonbook-server-sooty.vercel.app/

## Project Structure

```text
src/
|-- app/
|   |-- dashboard/
|   |   |-- appointments/
|   |   |-- profile/
|   |   |-- services/
|   |   |   |-- add/
|   |   |   |-- [id]/
|   |   |       |-- edit/
|   |   |-- transactions/
|   |   |-- users/
|   |-- services/
|   |   |-- [id]/
|   |-- login/
|   |-- register/
|   |-- payment/
|   |-- salon-details/
|-- components/
|   |-- layout/
|   |-- home/
|   |-- services/
|-- lib/
|   |-- api.ts
|   |-- auth-client.ts
|   |-- get-access-token.ts
|   |-- upload-image.ts
|-- globals.css
```

## API Integration

The client communicates with the backend REST API through `NEXT_PUBLIC_API_URL`.

### Services
- `GET /api/services` - Browse active services with search, category filtering, and price sorting (public).
- `GET /api/services/featured` - Get featured services for the homepage (public).
- `GET /api/services/:id` - Get service details (public).
- `GET /api/services/manage` - List services for administration (admin).
- `GET /api/services/manage/:id` - Get a service for editing (admin).
- `POST /api/services` - Create a service (admin).
- `PATCH /api/services/:id` - Update a service (admin).
- `DELETE /api/services/:id` - Delete or deactivate a service (admin).

### Appointments
- `POST /api/appointments` - Create an appointment (customer).
- `GET /api/appointments` - List appointments (authenticated).
- `GET /api/appointments/:id` - Get appointment details (authorized user/admin).
- `PATCH /api/appointments/:id/status` - Update appointment status (authorized user/admin).

### Payments
- `POST /api/payments/create-checkout-session` - Create a Stripe Checkout session (customer).
- `GET /api/payments/transactions` - List transactions (admin).

### Users
- `GET /api/users` - List users (admin).
- `PATCH /api/users/:id/status` - Block or unblock a user (admin).

### Image Upload
- `POST /api/uploads/image` - Upload a service image to ImgBB (admin only).

## Authentication Flow

1. Users register or log in through Better Auth using email/password or Google.
2. Better Auth manages the authentication session using secure HTTP-only cookies.
3. The client retrieves a JWT access token through `authClient.token()`.
4. Authenticated API requests include an `Authorization: Bearer <token>` header.
5. The backend verifies the JWT through its JWKS endpoint.
6. The backend checks the user's role and blocked status for protected requests.

## License

ISC