"use client";

import Link from "next/link";
import { Mail, ArrowLeft, Scissors, Link2 } from "lucide-react";

export default function SalonDetailsPage() {
  const email = "hello@salonbook.com";
  const instagramUrl = "https://www.instagram.com/";

  return (
    <main className="min-h-screen bg-[#f8f5f0]">
      <div className="container py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#817970] transition hover:text-[#b47a57] mb-8"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-[#292521] mb-6">
              <Scissors size={28} className="text-[#e9cdb9]" />
            </div>
            <h1 className="text-4xl font-bold text-[#292521]">SalonBook</h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#b47a57]">
              MEN'S GROOMING STUDIO
            </p>
            <p className="mt-4 text-lg text-[#817970] max-w-xl mx-auto">
              Your premier destination for modern men's grooming. Experience precision
              cuts, classic shaves, and personalized service in a refined atmosphere.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <section className="rounded-2xl border border-[#e9e1d8] bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#292521] mb-6 flex items-center gap-2">
                <Mail size={20} className="text-[#b47a57]" />
                Contact
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-[#b47a57]" />
                  <a
                    href={`mailto:${email}`}
                    className="text-[#817970] hover:text-[#b47a57] transition"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e9e1d8] bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#292521] mb-6 flex items-center gap-2">
                <Scissors size={20} className="text-[#b47a57]" />
                About Us
              </h2>
              <div className="space-y-4 text-[#817970] leading-7">
                <p>
                  At SalonBook, we believe grooming is more than a routine — it's a
                  ritual. Our experienced barbers combine traditional techniques with
                  modern styles to deliver a personalized experience for every client.
                </p>
                <p>
                  From classic haircuts and hot towel shaves to beard sculpting and
                  facial treatments, every service is tailored to your unique
                  preferences. We use premium products and take the time to understand
                  your needs.
                </p>
                <p>
                  Walk in or book online — your next great look is just an appointment
                  away.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e9e1d8]">
                <h3 className="font-semibold text-[#292521] mb-4">Follow Us</h3>
                <div className="flex items-center gap-4">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-10 items-center justify-center rounded-full border border-[#e9e1d8] text-[#817970] hover:bg-[#b47a57] hover:border-[#b47a57] hover:text-white transition"
                    aria-label="Instagram"
                  >
                    <Link2 size={18} />
                  </a>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-[#292521] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#443a32]"
            >
              Explore Our Services
              <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}