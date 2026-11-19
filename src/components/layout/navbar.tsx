
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Menu,
  Scissors,
  X,
  LogOut,
  LayoutDashboard,
  UserRound,
  LoaderCircle,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
];

type NavbarUser = {
  name: string;
  email: string;
  role?: "admin" | "customer";
  image?: string | null;
};

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user as NavbarUser | undefined;
  const isAdmin = user?.role === "admin";

  const dashboardHref = "/dashboard";
  const dashboardLabel = isAdmin ? "Admin Dashboard" : "My Dashboard";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setIsMenuOpen(false);

      await signOut();

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  const getInitial = (name?: string) =>
    name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e1d8] bg-[#f8f5f0]/95 backdrop-blur-md">
      <nav className="container flex h-[76px] items-center justify-between">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#292521] text-white">
            <Scissors size={19} strokeWidth={1.7} />
          </span>

          <span className="text-[23px] font-semibold tracking-[-1px]">
            Salon<span className="font-normal text-[#b47a57]">Book</span>
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#817970] transition-colors hover:text-[#b47a57]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          {isPending ? (
            <LoaderCircle
              size={19}
              className="animate-spin text-[#b47a57]"
            />
          ) : user ? (
            <>
              <Link
                href={dashboardHref}
                className="flex items-center gap-2 text-sm font-medium text-[#51483f] transition-colors hover:text-[#b47a57]"
              >
                <LayoutDashboard size={17} />
                {dashboardLabel}
              </Link>

              <div className="flex items-center gap-3 border-l border-[#e9e1d8] pl-5">
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

                <div className="max-w-[130px]">
                  <p className="truncate text-sm font-semibold text-[#292521]">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-[#817970]">
                    {isAdmin ? "Administrator" : "Customer"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 text-sm font-medium text-[#817970] transition-colors hover:text-red-600 disabled:opacity-50"
              >
                {loggingOut ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} />
                )}
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium transition-colors hover:text-[#b47a57]"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="flex h-11 items-center gap-2 rounded-full bg-[#292521] px-5 text-sm font-medium !text-white transition-colors hover:bg-[#b47a57]"
              >
                <span className="!text-white">Book an Appointment</span>
                <ArrowRight size={15} className="text-white" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e9e1d8] md:hidden"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-[#e9e1d8] bg-[#f8f5f0] px-6 py-6 md:hidden">
          <div className="container flex flex-col gap-5">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="text-sm font-medium text-[#817970]"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex flex-col gap-4 border-t border-[#e9e1d8] pt-5">
              {isPending ? (
                <div className="flex justify-center py-2">
                  <LoaderCircle
                    size={20}
                    className="animate-spin text-[#b47a57]"
                  />
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name}
                        className="size-10 rounded-full border border-[#e9e1d8] object-cover"
                      />
                    ) : (
                      <span className="flex size-10 items-center justify-center rounded-full bg-[#292521] text-sm font-semibold text-white">
                        {getInitial(user.name)}
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#292521]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#817970]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={closeMenu}
                    className="flex h-11 items-center gap-2 text-sm font-medium text-[#51483f]"
                  >
                    <LayoutDashboard size={17} />
                    {dashboardLabel}
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenu}
                    className="flex h-11 items-center gap-2 text-sm font-medium text-[#51483f]"
                  >
                    <UserRound size={17} />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex h-11 items-center gap-2 text-left text-sm font-medium text-red-600 disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <LogOut size={17} />
                    )}
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="text-sm font-medium"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#292521] text-sm font-medium !text-white"
                  >
                    <span className="!text-white">
                      Book an Appointment
                    </span>
                    <ArrowRight size={15} className="text-white" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
