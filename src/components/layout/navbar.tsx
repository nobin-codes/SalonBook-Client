
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  UserRound,
  X,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/auth-client";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Salon Details", href: "/salon-details" },
];

type NavbarUser = {
  name: string;
  email: string;
  role?: "admin" | "customer";
  image?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user as NavbarUser | undefined;
  const isAdmin = user?.role === "admin";

  const dashboardHref = "/dashboard";
  const dashboardLabel = isAdmin ? "Admin Dashboard" : "My Dashboard";

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await signOut();

      if (result.error) {
        throw new Error(result.error.message || "Sign out failed.");
      }

      setIsMenuOpen(false);
      setIsAccountOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign out. Please try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
  };

  const getInitial = (name?: string) =>
    name?.trim().charAt(0).toUpperCase() || "U";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e1d8] bg-[#f8f5f0]/95 shadow-[0_2px_12px_rgba(41,37,33,0.04)] backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="container flex h-[76px] items-center justify-between"
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[#292521] text-[#f5f1e9] transition-transform duration-300 group-hover:rotate-[-8deg]">
            <Scissors size={19} strokeWidth={1.6} />
          </span>

          <span className="text-[23px] font-semibold tracking-[-1.2px] text-[#292521]">
            Salon<span className="font-normal text-[#b47a57]">Book</span>
          </span>
        </Link>

        <div className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-1 md:flex">
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex h-full items-center px-5 text-[13px] font-semibold transition-colors duration-200 ${
                  active
                    ? "text-[#292521]"
                    : "text-[#746c64] hover:text-[#956044]"
                }`}
              >
                {item.label}

                <span
                  className={`absolute bottom-[19px] left-5 right-5 h-[2px] rounded-full bg-[#956044] transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop account actions */}
        <div className="hidden items-center gap-5 md:flex">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                aria-expanded={isAccountOpen}
                aria-label="Open account menu"
                className={`flex items-center gap-3 rounded-full border px-2.5 py-2 transition-all duration-200 ${
                  isAccountOpen
                    ? "border-[#c39a73] bg-white"
                    : "border-transparent hover:border-[#e5d9cb] hover:bg-white"
                }`}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="size-9 rounded-full border border-[#e9e1d8] object-cover"
                  />
                ) : (
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#292521] text-sm font-semibold text-white">
                    {getInitial(user.name)}
                  </span>
                )}

                <span className="max-w-[115px] text-left">
                  <span className="block truncate text-[13px] font-semibold text-[#292521]">
                    {user.name}
                  </span>
                  <span className="block text-[10px] font-medium text-[#817970]">
                    {isAdmin ? "Administrator" : "Customer"}
                  </span>
                </span>

                <ChevronDown
                  size={15}
                  className={`text-[#746c64] transition-transform duration-200 ${
                    isAccountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 top-[calc(100%+14px)] w-[245px] overflow-hidden rounded-2xl border border-[#e9e1d8] bg-[#fffdf9] p-2 shadow-[0_18px_50px_rgba(41,37,33,0.12)]">
                  <div className="border-b border-[#eee7de] px-3 py-3">
                    <p className="truncate text-sm font-semibold text-[#292521]">
                      {user.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#746c64]">
                      {user.email}
                    </p>
                  </div>

                  <div className="space-y-1 py-2">
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#51483f] transition-colors hover:bg-[#f5f1e9] hover:text-[#956044]"
                    >
                      <LayoutDashboard size={16} />
                      {dashboardLabel}
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#51483f] transition-colors hover:bg-[#f5f1e9] hover:text-[#956044]"
                    >
                      <UserRound size={16} />
                      My Profile
                    </Link>
                  </div>

                  <div className="border-t border-[#eee7de] pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-[#a8322b] transition-colors hover:bg-[#fbefec] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loggingOut ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <LogOut size={16} />
                      )}
                      {loggingOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-semibold text-[#51483f] transition-colors hover:text-[#956044]"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="group inline-flex h-11 items-center gap-3 rounded-full bg-[#956044] px-5 text-[13px] font-semibold !text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#75472F] hover:!text-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#956044]"
              >
                Book an Appointment
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="flex size-10 items-center justify-center rounded-full border border-[#ded3c5] bg-white text-[#292521] transition-colors hover:bg-[#eee7de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#956044] md:hidden"
        >
          {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="border-t border-[#e9e1d8] bg-[#f8f5f0] px-5 pb-6 pt-5 md:hidden">
          <div className="container flex flex-col">
            <div className="space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-[#eee7de] text-[#292521]"
                        : "text-[#51483f] hover:bg-[#eee7de] hover:text-[#292521]"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="size-1.5 rounded-full bg-[#956044]" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 border-t border-[#e9e1d8] pt-5">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e9e1d8] bg-white p-3">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name}
                        className="size-11 rounded-full border border-[#e9e1d8] object-cover"
                      />
                    ) : (
                      <span className="flex size-11 items-center justify-center rounded-full bg-[#292521] text-sm font-semibold text-white">
                        {getInitial(user.name)}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#292521]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#746c64]">
                        {user.email}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#956044]">
                        {isAdmin ? "Administrator" : "Customer"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={closeMenu}
                    className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#51483f] transition-colors hover:bg-[#eee7de]"
                  >
                    <LayoutDashboard size={17} />
                    {dashboardLabel}
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenu}
                    className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#51483f] transition-colors hover:bg-[#eee7de]"
                  >
                    <UserRound size={17} />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[#a8322b] transition-colors hover:bg-[#fbefec] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <LogOut size={17} />
                    )}
                    {loggingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex h-11 items-center justify-center rounded-full border border-[#ded3c5] bg-white text-sm font-semibold text-[#51483f] transition-colors hover:bg-[#eee7de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#956044]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="group flex h-12 items-center justify-center gap-3 rounded-full bg-[#292521] text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-[#956044] hover:!text-white focus-visible:!text-white active:!text-white"
                  >
                    <CalendarDays
                      size={16}
                      className="shrink-0 !text-white"
                    />
                    <span className="!text-white">
                      Book an Appointment
                    </span>
                    <ArrowRight
                      size={15}
                      className="shrink-0 !text-white"
                    />
                  </Link>
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-[10px] font-medium uppercase tracking-[2px] text-[#817970]">
              SalonBook · Your style, your statement
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
