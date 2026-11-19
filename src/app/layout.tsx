
import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import SiteShell from "@/components/layout/site-shell";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SalonBook | Men's Grooming, Simplified",
    template: "%s | SalonBook",
  },
  description:
    "Discover men's grooming services, explore professional barbershops, and book your next appointment with SalonBook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <Toaster position="top-right" richColors />

        <Suspense fallback={<main className="min-h-screen" />}>
          <SiteShell>{children}</SiteShell>
        </Suspense>
      </body>
    </html>
  );
}
