
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  Scissors,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function SalonDetailsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const isAuthenticated = Boolean(session?.user);

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isPending, isAuthenticated, router]);

  if (isPending || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5f0]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#e9e1d8] border-t-[#b47a57]" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#f8f5f0]">
      <style>{`
        @keyframes salonFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes salonFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .salon-fade-up {
          animation: salonFadeUp 0.75s ease-out both;
        }

        .salon-fade-in {
          animation: salonFadeIn 1s ease-out both;
        }

        .salon-delay-1 {
          animation-delay: 0.12s;
        }

        .salon-delay-2 {
          animation-delay: 0.24s;
        }

        .salon-delay-3 {
          animation-delay: 0.36s;
        }

        @media (prefers-reduced-motion: reduce) {
          .salon-fade-up,
          .salon-fade-in {
            animation: none !important;
          }
        }
      `}</style>

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[450px] rounded-full bg-[#b47a57]/[0.07] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 size-[400px] rounded-full bg-[#b47a57]/[0.06] blur-3xl"
      />

      <div className="container relative py-8 sm:py-12">
        {/* Back navigation */}
        <div className="salon-fade-in">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-[#e9e1d8] bg-white/70 px-4 py-2.5 text-sm font-medium text-[#817970] shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-[#b47a57]/40 hover:text-[#956044]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Back to Home
          </Link>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <section className="relative py-16 text-center sm:py-20">
            <div className="salon-fade-up">
              <div className="relative mx-auto mb-7 flex size-20 items-center justify-center rounded-[26px] bg-[#292521] shadow-xl shadow-[#292521]/15">
                <Scissors size={32} className="text-[#e9cdb9]" />

                <div className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border-4 border-[#f8f5f0] bg-[#b47a57]">
                  <Sparkles size={12} className="text-white" />
                </div>
              </div>

              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#b47a57]">
                Welcome to
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-[#292521] sm:text-6xl">
                SalonBook
              </h1>

              <div className="my-5 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-[#c9a48b]" />

                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#956044]">
                  Men&apos;s Grooming Studio
                </span>

                <span className="h-px w-10 bg-[#c9a48b]" />
              </div>

              <p className="mx-auto max-w-2xl text-base leading-8 text-[#817970] sm:text-lg">
                Your premier destination for modern men&apos;s grooming.
                Experience precision cuts, classic shaves, and personalized
                service in a refined atmosphere.
              </p>
            </div>
          </section>

          {/* Information cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Booking */}
            <section className="salon-fade-up salon-delay-1 group rounded-3xl border border-[#e9e1d8] bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#c9a48b] hover:shadow-xl hover:shadow-[#292521]/[0.06] sm:p-9">
              <div className="mb-7 flex size-12 items-center justify-center rounded-2xl bg-[#f8f5f0] text-[#b47a57] transition-all duration-300 group-hover:bg-[#292521] group-hover:text-white">
                <Mail size={21} />
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#b47a57]">
                Your next step
              </p>

              <h2 className="mb-5 text-2xl font-bold text-[#292521]">
                Book Your Experience
              </h2>

              <p className="text-sm leading-7 text-[#817970]">
                Explore our grooming services, choose the experience that
                suits you, and manage your appointments through your
                SalonBook account.
              </p>

              <Link
                href="/services"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#292521] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[#956044]"
              >
                <span className="text-white">Explore Services</span>
                <ArrowUpRight size={16} className="text-white" />
              </Link>
            </section>

            {/* About */}
            <section className="salon-fade-up salon-delay-2 group rounded-3xl border border-[#e9e1d8] bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#c9a48b] hover:shadow-xl hover:shadow-[#292521]/[0.06] sm:p-9">
              <div className="mb-7 flex size-12 items-center justify-center rounded-2xl bg-[#f8f5f0] text-[#b47a57] transition-all duration-300 group-hover:bg-[#292521] group-hover:text-white">
                <Scissors size={21} />
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#b47a57]">
                Our story
              </p>

              <h2 className="mb-5 text-2xl font-bold text-[#292521]">
                About Us
              </h2>

              <div className="space-y-4 text-sm leading-7 text-[#817970]">
                <p>
                  At SalonBook, we believe grooming is more than a routine
                  — it&apos;s a ritual. Our experienced barbers combine
                  traditional techniques with modern styles to deliver a
                  personalized experience for every client.
                </p>

                <p>
                  From classic haircuts and hot towel shaves to beard
                  sculpting and facial treatments, every service is tailored
                  to your unique preferences. We use premium products and
                  take the time to understand your needs.
                </p>

                <p>
                  Walk in or book online — your next great look is just an
                  appointment away.
                </p>
              </div>
            </section>
          </div>

          {/* Bottom CTA */}
          <section className="salon-fade-up salon-delay-3 mt-10 overflow-hidden rounded-3xl bg-[#292521] px-6 py-10 text-center shadow-xl shadow-[#292521]/10 sm:px-10 sm:py-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#c39a73]">
              Your next great look starts here
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready for a fresh new look?
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#d0c5bb]">
              Discover our grooming services and find the right experience
              for you.
            </p>

            <Link
              href="/services"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#c39a73] px-7 py-3.5 text-sm font-bold !text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#b47a57]"
            >
              <span className="text-white">
                Explore Our Services
              </span>

              <ArrowUpRight
                size={17}
                className="text-white transition-transform duration-300"
                aria-hidden="true"
              />
            </Link>
          </section>

          {/* Footer */}
          <div className="salon-fade-in mt-10 pb-4 text-center">
            <p className="text-xs font-medium tracking-wide text-[#a49a90]">
              © {new Date().getFullYear()} SalonBook. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
