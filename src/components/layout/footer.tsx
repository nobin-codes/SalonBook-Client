
import Link from "next/link";
import { ArrowUpRight, Scissors } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#e9e1d8] bg-[#292521] text-white">
      <style>{`
        @keyframes nobinShine {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .nobin-credit {
          background: linear-gradient(
            90deg,
            #d6a989,
            #ffffff,
            #c39a73,
            #ffffff,
            #d6a989
          );
          background-size: 250% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: nobinShine 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .nobin-credit {
            animation: none;
          }
        }
      `}</style>

      <div className="container py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b47a57]">
                <Scissors size={19} />
              </span>

              <span className="text-[23px] font-semibold tracking-[-1px]">
                SalonBook
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
              Your grooming, your style. Discover trusted men&apos;s haircuts,
              beard care, and grooming services with SalonBook.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#d6a989] transition-colors hover:text-white"
            >
              Explore grooming services
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/55">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <Link href="/services" className="transition hover:text-white">
                All Services
              </Link>
              <Link href="/login" className="transition hover:text-white">
                Sign In
              </Link>
              <Link href="/register" className="transition hover:text-white">
                Create Account
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold">Account</h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/55">
              <Link href="/dashboard" className="transition hover:text-white">
                Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                className="transition hover:text-white"
              >
                My Profile
              </Link>
              <Link
                href="/dashboard/appointments"
                className="transition hover:text-white"
              >
                My Appointments
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold">Need a hand?</h3>

            <p className="mt-6 text-sm leading-7 text-white/55">
              Looking for your next grooming service? Explore our services or
              sign in to manage your appointments.
            </p>

            <div className="mt-6 flex flex-col items-start gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#d6a989] transition-colors hover:text-white"
              >
                Browse services
                <ArrowUpRight size={15} />
              </Link>

              <Link
                href="/dashboard/appointments"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#d6a989] transition-colors hover:text-white"
              >
                Manage appointments
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-7 text-center text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} SalonBook. All rights reserved.</p>
          <p>Made for men who take pride in their style.</p>
        </div>

        {/* Creator credit */}
        <div className="mt-7 flex justify-center border-t border-white/[0.06] pt-6">
          <p className="text-center text-xs tracking-wide text-white/45 sm:text-sm">
            Designed & developed with love by{" "}
            <span className="nobin-credit inline-block font-semibold tracking-wider">
              Nobin
            </span>
            <span className="ml-1.5 text-[#b47a57]">✦</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
