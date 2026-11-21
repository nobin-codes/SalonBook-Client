# SalonBook - Salon Appointment Booking Platform

## 1. Project Name and Description

**SalonBook** is a salon appointment booking platform where customers can explore salon services, view service details, and request appointments online.

Customers can register, sign in, manage their appointments, track booking statuses, and pay for confirmed appointments through Stripe.

Administrators can manage salon services, appointments, registered customers, and payment transactions through a role-based dashboard.

This repository contains the **frontend/client application**, built with Next.js, React, and TypeScript.

## 2. Important Features

### Authentication
- Customer registration and login.
- Email and password authentication.
- Google OAuth sign-in.
- Profile image support.
- Role-based customer and admin access.
- Protected routes and dashboard navigation.

### Service Browsing
- Browse available salon services.
- View featured services on the homepage.
- Search services by name.
- Filter services by category.
- Sort services by price.
- View detailed service information.

### Appointment Booking
- Book available salon services.
- Select appointment dates and time slots.
- View appointment details and status.
- Cancel pending appointments.
- Manage appointments through the customer dashboard.

### Payment
- Stripe Checkout integration.
- Pay for confirmed appointments.
- Payment success and cancellation pages.
- View payment status and transaction history.

### Customer Dashboard
- Overview of account activity.
- My Appointments.
- My Profile.
- Update profile information.

### Admin Dashboard
- Dashboard overview.
- Manage salon services.
- Add and update services.
- Manage appointment requests.
- Manage registered customers.
- Block and unblock customer accounts.
- View payment transactions.
- Manage profile information.

### User Experience
- Responsive design for desktop, tablet, and mobile.
- Loading and error states.
- Toast notifications.
- Reusable components and organized page structure.
- User-friendly navigation and dashboard layouts.

## 3. Technology Stack

- **Framework:** Next.js 16
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Authentication:** Better Auth
- **API Integration:** REST API
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Image and Content Presentation:** Next.js Image and Swiper
- **Backend Integration:** Express.js REST API

## 4. Installation Instructions

Make sure Node.js and npm are installed on your computer.

Clone the client repository:

```bash
git clone https://github.com/nobin-codes/SalonBook-Client.git
```

Navigate to the project directory:

```bash
cd SalonBook-Client
```

Install the dependencies:

```bash
npm install
```

Create a `.env.local` file in the client root directory and configure the required environment variable listed below.

## 5. How to Run the Project Locally

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

`http://localhost:3000`

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 6. Required Environment Variables

Create a `.env.local` file in the client root directory.

Configure the following environment variable with your local or deployed backend API URL:

```env
NEXT_PUBLIC_API_URL
```

**Security:** Never commit `.env.local` files or sensitive credentials to GitHub.

## 7. Live Website Link

- **Live Website:** https://salonbook-mu.vercel.app/
- **Backend API:** https://salonbook-server-sooty.vercel.app/

## 8. Client and Server Repository Links

- **Client Repository:** https://github.com/nobin-codes/SalonBook-Client
- **Server Repository:** https://github.com/nobin-codes/SalonBook-Server