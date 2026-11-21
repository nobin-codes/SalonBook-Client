import Link from "next/link";
import { ArrowUpRight, Scissors } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#e9e1d8] bg-[#292521] text-white">
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

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold">Get in touch</h3>

            <p className="mt-6 text-sm leading-7 text-white/55">
              Need help with a booking or have a question about our grooming
              services? We&apos;d be happy to help.
            </p>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Email
                </p>
                <a
                  href="mailto:hello@salonbook.com"
                  className="text-[#d6a989] transition-colors hover:text-white"
                >
                  hello@salonbook.com
                </a>
                <p className="mt-1 text-xs text-white/35">
                  Demo contact address
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Address
                </p>
                <p className="text-white/55">
                  Address details coming soon.
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Opening Hours
                </p>
                <p className="text-white/55">
                  Business hours to be announced.
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Phone
                </p>
                <p className="text-white/55">
                  Contact number coming soon.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                Follow us
              </p>
              <p className="text-sm text-white/55">
                Social media profiles coming soon.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SalonBook. All rights reserved.</p>
          <p>Made for men who take pride in their style.</p>
        </div>
      </div>
    </footer>
  );
}