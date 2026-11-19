
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Scissors,
  CalendarDays,
  Clock3,
  CheckCircle2,
  CreditCard,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

interface DashboardUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  isBlocked?: boolean;
}

interface DashboardService {
  _id: string;
  serviceName: string;
  status: "active" | "inactive";
}

interface DashboardAppointment {
  _id: string;
  appointmentDate: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "paid" | "unpaid";
  servicePrice: number;
  customer?: {
    name?: string;
    email?: string;
  } | null;
  service?: {
    serviceName?: string;
  } | null;
}

interface DashboardStats {
  customers: number;
  activeServices: number;
  appointments: number;
  pending: number;
  confirmed: number;
  successfulPayments: number;
}

function extractArray<T>(value: unknown, keys: string[] = []): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    for (const key of keys) {
      if (Array.isArray(record[key])) {
        return record[key] as T[];
      }
    }
  }

  return [];
}

function formatDate(date: string) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  href,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[#e9e1d8] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#817970]">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#292521]">
            {value}
          </p>
          <p className="mt-2 text-xs text-[#817970]">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end text-xs font-semibold text-[#a16d4e]">
        View details
        <ArrowUpRight
          size={14}
          className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();

  const [stats, setStats] = useState<DashboardStats>({
    customers: 0,
    activeServices: 0,
    appointments: 0,
    pending: 0,
    confirmed: 0,
    successfulPayments: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState<
    DashboardAppointment[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const [usersResult, servicesResult, appointmentsResult] =
      await Promise.allSettled([
        apiRequest<unknown>("/api/users", {
          authenticated: true,
        }),
        apiRequest<unknown>("/api/services/manage", {
          authenticated: true,
        }),
        apiRequest<unknown>("/api/appointments", {
          authenticated: true,
        }),
      ]);

    const failedRequests: string[] = [];

    let users: DashboardUser[] = [];
    let services: DashboardService[] = [];
    let appointments: DashboardAppointment[] = [];

    if (usersResult.status === "fulfilled") {
      users = extractArray<DashboardUser>(usersResult.value, [
        "users",
        "customers",
      ]);
    } else {
      failedRequests.push("customers");
    }

    if (servicesResult.status === "fulfilled") {
      services = extractArray<DashboardService>(servicesResult.value, [
        "services",
      ]);
    } else {
      failedRequests.push("services");
    }

    if (appointmentsResult.status === "fulfilled") {
      appointments = extractArray<DashboardAppointment>(
        appointmentsResult.value,
        ["appointments"],
      );
    } else {
      failedRequests.push("appointments");
    }

    setStats({
      customers: users.filter(
        (user) => user.role?.toLowerCase() !== "admin",
      ).length,
      activeServices: services.filter(
        (service) => service.status === "active",
      ).length,
      appointments: appointments.length,
      pending: appointments.filter(
        (appointment) => appointment.status === "pending",
      ).length,
      confirmed: appointments.filter(
        (appointment) => appointment.status === "confirmed",
      ).length,
      successfulPayments: appointments.filter(
        (appointment) => appointment.paymentStatus === "paid",
      ).length,
    });

    const sortedAppointments = [...appointments].sort(
      (a, b) =>
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime(),
    );

    setRecentAppointments(sortedAppointments.slice(0, 5));

    if (failedRequests.length > 0) {
      setError(
        `Some dashboard information could not be loaded: ${failedRequests.join(", ")}. Check the relevant API permissions and routes.`,
      );
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (session?.user) {
      void loadDashboard();
    }
  }, [session?.user, loadDashboard]);

  const cards = [
    {
      title: "Total customers",
      value: stats.customers,
      description: "Registered customer accounts",
      icon: Users,
      color: "bg-blue-50 text-blue-700",
      href: "/dashboard/users",
    },
    {
      title: "Active services",
      value: stats.activeServices,
      description: "Services available for booking",
      icon: Scissors,
      color: "bg-purple-50 text-purple-700",
      href: "/dashboard/services",
    },
    {
      title: "Total appointments",
      value: stats.appointments,
      description: "All customer bookings",
      icon: CalendarDays,
      color: "bg-orange-50 text-orange-700",
      href: "/dashboard/appointments",
    },
    {
      title: "Pending appointments",
      value: stats.pending,
      description: "Waiting for admin confirmation",
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
      href: "/dashboard/appointments",
    },
    {
      title: "Confirmed appointments",
      value: stats.confirmed,
      description: "Approved customer bookings",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
      href: "/dashboard/appointments",
    },
    {
      title: "Successful payments",
      value: stats.successfulPayments,
      description: "Appointments with paid status",
      icon: CreditCard,
      color: "bg-green-50 text-green-700",
      href: "/dashboard/transactions",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#b47a57]">
            Salon operations
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#292521]">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-[#817970]">
            Monitor your salon activity, appointments, customers, and payments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadDashboard()}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-full border border-[#e9e1d8] bg-white px-4 text-sm font-medium text-[#746c64] transition hover:bg-[#f4ece5] disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            size={15}
            className={isLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <StatCard
            key={card.title}
            {...card}
            value={isLoading ? "—" : card.value}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e9e1d8] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9e1d8] px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-[#292521]">
              Recent appointments
            </h2>
            <p className="mt-1 text-sm text-[#817970]">
              The latest customer bookings
            </p>
          </div>

          <Link
            href="/dashboard/appointments"
            className="text-sm font-semibold text-[#a16d4e] transition hover:text-[#292521]"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-[#817970]">
            Loading recent appointments...
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CalendarDays
              size={28}
              className="mx-auto text-[#b47a57]"
            />
            <p className="mt-3 text-sm font-medium text-[#292521]">
              No appointments yet
            </p>
            <p className="mt-1 text-sm text-[#817970]">
              Customer bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0ebe5]">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#292521]">
                    {appointment.service?.serviceName ??
                      "Salon appointment"}
                  </p>

                  <p className="mt-1 text-xs text-[#817970]">
                    {appointment.customer?.name ??
                      appointment.customer?.email ??
                      "Customer"}{" "}
                    · {formatDate(appointment.appointmentDate)}
                  </p>

                  <p className="mt-1 text-xs text-[#817970]">
                    {appointment.timeSlot}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      appointment.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : appointment.status === "cancelled"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {appointment.status}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      appointment.paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {appointment.paymentStatus}
                  </span>

                  <p className="min-w-16 text-sm font-semibold text-[#292521] sm:text-right">
                    ${Number(appointment.servicePrice || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/services/add"
          className="flex items-center justify-between rounded-2xl bg-[#292521] p-5 text-white transition hover:bg-[#403932]"
        >
          <div>
            <p className="font-semibold">Add a new service</p>
            <p className="mt-1 text-sm text-white/65">
              Expand your salon service menu
            </p>
          </div>
          <ArrowUpRight size={20} />
        </Link>

        <Link
          href="/dashboard/appointments"
          className="flex items-center justify-between rounded-2xl border border-[#e9e1d8] bg-white p-5 text-[#292521] transition hover:border-[#b47a57]"
        >
          <div>
            <p className="font-semibold">Manage appointments</p>
            <p className="mt-1 text-sm text-[#817970]">
              Review and respond to booking requests
            </p>
          </div>
          <ArrowUpRight size={20} className="text-[#b47a57]" />
        </Link>
      </div>
    </section>
  );
}
