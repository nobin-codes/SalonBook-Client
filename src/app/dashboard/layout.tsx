
"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  Scissors,
  Users,
  Receipt,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

type DashboardUser = {
  name: string;
  email: string;
  image?: string | null;
  role?: "admin" | "customer";
  isBlocked?: boolean;
};

type NavigationItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const customerNavigation: NavigationItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Appointments",
    href: "/dashboard/appointments",
    icon: CalendarDays,
  },
  {
    label: "My Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
];

const adminNavigation: NavigationItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Services",
    href: "/dashboard/services",
    icon: Scissors,
  },
  {
    label: "Appointments",
    href: "/dashboard/appointments",
    icon: CalendarDays,
  },
  {
    label: "Manage Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: Receipt,
  },
  {
    label: "My Profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user as DashboardUser | undefined;
  const role = user?.role ?? "customer";
  const isAdmin = role === "admin";

  const navigation = isAdmin
    ? adminNavigation
    : customerNavigation;

  const isAdminRoute =
    pathname.startsWith("/dashboard/services") ||
    pathname.startsWith("/dashboard/users") ||
    pathname.startsWith("/dashboard/transactions");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const currentUser = session.user as DashboardUser;

    if (currentUser.isBlocked) {
      void signOut().finally(() => {
        router.replace("/login");
      });
      return;
    }

    if (
      currentUser.role !== "admin" &&
      isAdminRoute
    ) {
      router.replace("/dashboard");
    }
  }, [isPending, session, isAdminRoute, router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5f0]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#b47a57] border-t-transparent" />
          <p className="text-sm text-[#817970]">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (user?.isBlocked || (isAdminRoute && !isAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5f0]">
        <p className="text-sm text-[#817970]">
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#292521]">
      <div className="min-h-screen lg:flex">
        <aside className="hidden w-[270px] shrink-0 flex-col border-r border-[#e9e1d8] bg-white lg:flex">
          <div className="border-b border-[#e9e1d8] px-7 py-7">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight"
            >
              Salon<span className="text-[#b47a57]">Book.</span>
            </Link>
            <p className="mt-1 text-xs tracking-wide text-[#817970]">
              MEN'S GROOMING STUDIO
            </p>
          </div>

          <div className="flex-1 px-4 py-7">
            <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a39a91]">
              Workspace
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-[#f4ece5] text-[#956044]"
                        : "text-[#746c64] hover:bg-[#f8f5f0] hover:text-[#292521]"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-[#e9e1d8] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e5dc] text-sm font-semibold text-[#956044]">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs text-[#817970]">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#817970] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              <LogOut size={18} />
              {loggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#e9e1d8] bg-white/95 px-5 backdrop-blur sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg p-2 text-[#292521] hover:bg-[#f8f5f0] lg:hidden"
                aria-label="Toggle navigation"
              >
                {menuOpen ? (
                  <X size={21} />
                ) : (
                  <Menu size={21} />
                )}
              </button>

              <div>
                <p className="text-sm font-semibold">
                  {isAdmin ? "Admin Workspace" : "My Dashboard"}
                </p>
                <p className="hidden text-xs text-[#817970] sm:block">
                  Welcome back, {user?.name || "there"}
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium text-[#817970] transition hover:text-[#956044]"
            >
              Visit website
              <ArrowUpRight size={15} />
            </Link>
          </header>

          {menuOpen && (
            <div className="fixed inset-0 top-[72px] z-20 bg-black/20 lg:hidden">
              <nav className="border-b border-[#e9e1d8] bg-white p-4 shadow-lg">
                <div className="mb-4 flex items-center gap-3 border-b border-[#e9e1d8] pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e5dc] font-semibold text-[#956044]">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-[#817970]">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {navigation.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                        active
                          ? "bg-[#f4ece5] text-[#956044]"
                          : "text-[#746c64] hover:bg-[#f8f5f0]"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </button>
              </nav>
            </div>
          )}

          <main className="mx-auto w-full max-w-[1500px] p-5 sm:p-8 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
