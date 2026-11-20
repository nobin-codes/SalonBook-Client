
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Scissors,
  X,
  Check,
  RefreshCw,
  UserRound,
  Mail,
  Phone,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

type AppointmentStatus = "pending" | "confirmed" | "cancelled";
type PaymentStatus = "unpaid" | "paid";
type StatusFilter = "all" | AppointmentStatus;

interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description?: string;
  price: number;
  duration: number;
  image: string;
  status?: string;
}

interface Appointment {
  _id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  servicePrice: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  message?: string;
  createdAt: string;
  customer?: {
    id?: string;
    name: string;
    email: string;
    image?: string;
    phone?: string;
  } | null;
  service?: Service | null;
}

interface AppointmentItem {
  appointment: Appointment;
  service: Service | null;
}

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

// Appointment dates are stored as YYYY-MM-DD.
// Parse them as UTC to prevent timezone-related date shifts.
const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);

  if (
    !year ||
    !month ||
    !day ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return date;
  }

  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatCreatedDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

export default function AppointmentsPage() {
  const { data: session } = useSession();

  const user = session?.user as
    | { role?: "admin" | "customer" }
    | undefined;

  const isAdmin = user?.role === "admin";

  const [items, setItems] = useState<AppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [paymentProcessingId, setPaymentProcessingId] =
    useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    status: "confirmed" | "cancelled";
  } | null>(null);

  const loadAppointments = useCallback(async () => {
    try {
      const appointments = await apiRequest<Appointment[]>(
        "/api/appointments",
        { authenticated: true },
      );

      const results: AppointmentItem[] = appointments.map(
        (appointment) => ({
          appointment,
          service: appointment.service ?? null,
        }),
      );

      setItems(results);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load appointments.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial appointments without triggering synchronous
  // state updates directly from the effect.
  useEffect(() => {
    if (!session?.user) {
      return;
    }

    let isActive = true;

    const fetchInitialAppointments = async () => {
      try {
        const appointments = await apiRequest<Appointment[]>(
          "/api/appointments",
          { authenticated: true },
        );

        if (!isActive) {
          return;
        }

        const results: AppointmentItem[] = appointments.map(
          (appointment) => ({
            appointment,
            service: appointment.service ?? null,
          }),
        );

        setItems(results);
        setError("");
      } catch (err) {
        if (!isActive) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load appointments.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchInitialAppointments();

    return () => {
      isActive = false;
    };
  }, [session?.user]);

  const handleRefresh = () => {
    setIsLoading(true);
    setError("");
    void loadAppointments();
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    status: "confirmed" | "cancelled",
  ) => {
    setProcessingId(appointmentId);
    setError("");
    setActionMessage("");

    try {
      const result = await apiRequest<{ message: string }>(
        `/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          authenticated: true,
          body: JSON.stringify({ status }),
        },
      );

      setConfirmAction(null);
      setActionMessage(
        result.message || `Appointment ${status} successfully.`,
      );

      setIsLoading(true);
      await loadAppointments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update appointment.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handlePayment = async (appointmentId: string) => {
    setPaymentProcessingId(appointmentId);
    setError("");
    setActionMessage("");

    try {
      const result = await apiRequest<{ checkoutUrl: string }>(
        "/api/payments/create-checkout-session",
        {
          method: "POST",
          authenticated: true,
          body: JSON.stringify({ appointmentId }),
        },
      );

      if (!result.checkoutUrl) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.assign(result.checkoutUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment. Please try again.",
      );

      setPaymentProcessingId(null);
    }
  };

  const totalAppointments = items.length;

  const pendingAppointments = items.filter(
    (item) => item.appointment.status === "pending",
  ).length;

  const confirmedAppointments = items.filter(
    (item) => item.appointment.status === "confirmed",
  ).length;

  const cancelledAppointments = items.filter(
    (item) => item.appointment.status === "cancelled",
  ).length;

  const paidAppointments = items.filter(
    (item) => item.appointment.paymentStatus === "paid",
  ).length;

  const filteredItems = items.filter(
    (item) =>
      statusFilter === "all" ||
      item.appointment.status === statusFilter,
  );

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#b47a57]">
            {isAdmin ? "Salon operations" : "Your grooming schedule"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#292521]">
            {isAdmin ? "Manage Appointments" : "My Appointments"}
          </h1>

          <p className="mt-2 text-sm text-[#817970]">
            {isAdmin
              ? "Review customer bookings and manage appointment requests."
              : "Manage your bookings and keep track of your upcoming visits."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
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

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <p className="text-sm text-[#817970]">Total appointments</p>
          <p className="mt-3 text-3xl font-semibold text-[#292521]">
            {isLoading ? "—" : totalAppointments}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <p className="text-sm text-[#817970]">Pending</p>
          <p className="mt-3 text-3xl font-semibold text-amber-600">
            {isLoading ? "—" : pendingAppointments}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <p className="text-sm text-[#817970]">Confirmed</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-600">
            {isLoading ? "—" : confirmedAppointments}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <p className="text-sm text-[#817970]">
            {isAdmin ? "Paid appointments" : "Cancelled"}
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#817970]">
            {isLoading
              ? "—"
              : isAdmin
                ? paidAppointments
                : cancelledAppointments}
          </p>
        </div>
      </div>

      {actionMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {actionMessage}
        </div>
      )}

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={handleRefresh}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#292521]">
          {isAdmin ? "All bookings" : "Booking history"}
          <span className="ml-2 text-sm font-normal text-[#817970]">
            ({filteredItems.length})
          </span>
        </h2>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as StatusFilter)
          }
          className="h-10 rounded-xl border border-[#e9e1d8] bg-white px-3 text-sm text-[#292521] outline-none focus:border-[#b47a57]"
          aria-label="Filter appointments by status"
        >
          <option value="all">All appointments</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-[#e9e1d8] bg-white py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e9e1d8] border-t-[#b47a57]" />
          <p className="mt-4 text-sm text-[#817970]">
            Loading appointments...
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-[#e9e1d8] bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f5f0] text-[#b47a57]">
            <Scissors size={23} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-[#292521]">
            {items.length === 0
              ? "No appointments yet"
              : "No matching appointments"}
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#817970]">
            {items.length === 0
              ? isAdmin
                ? "Customer bookings will appear here."
                : "Your next great grooming experience starts with a booking."
              : "Try selecting another appointment status."}
          </p>

          {!isAdmin && items.length === 0 && (
            <Link
  href="/services"
  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#292521] px-6 text-sm font-medium text-white transition-colors hover:bg-[#b47a57]"
>
  Explore services
</Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(({ appointment, service }) => (
            <article
              key={appointment._id}
              className="overflow-hidden rounded-2xl border border-[#e9e1d8] bg-white"
            >
              <div className="flex flex-col gap-5 p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f8f5f0]">
                    {service?.image ? (
                      <img
                        src={service.image}
                        alt={service.serviceName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Scissors
                        size={26}
                        className="text-[#b47a57]"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[appointment.status]}`}
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
                        {appointment.paymentStatus === "paid"
                          ? "Paid"
                          : "Unpaid"}
                      </span>
                    </div>

                    <h2 className="mt-3 text-lg font-semibold text-[#292521]">
                      {service?.serviceName ?? "Service unavailable"}
                    </h2>

                    {service?.category && (
                      <p className="mt-1 text-sm text-[#817970]">
                        {service.category}
                        {service.duration
                          ? ` · ${service.duration} minutes`
                          : ""}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#817970]">
                      <span className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-[#b47a57]"
                        />
                        {formatDate(appointment.appointmentDate)}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3
                          size={16}
                          className="text-[#b47a57]"
                        />
                        {appointment.timeSlot}
                      </span>
                    </div>

                    {appointment.message && (
                      <p className="mt-3 text-sm leading-6 text-[#817970]">
                        Note: {appointment.message}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <p className="text-xl font-semibold text-[#292521]">
                      ${appointment.servicePrice.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-[#817970]">
                      Service price
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex flex-col gap-3 rounded-xl bg-[#f8f5f0] p-4 sm:flex-row sm:items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#956044]">
                      <UserRound size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#292521]">
                        {appointment.customer?.name ??
                          "Customer information unavailable"}
                      </p>

                      <p className="mt-1 flex items-center gap-2 break-all text-xs text-[#817970]">
                        <Mail size={13} className="shrink-0" />
                        {appointment.customer?.email ??
                          appointment.customerId}
                      </p>

                      {appointment.customer?.phone && (
                        <p className="mt-1 flex items-center gap-2 text-xs text-[#817970]">
                          <Phone size={13} />
                          {appointment.customer.phone}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[#817970]">
                      Booked {formatCreatedDate(appointment.createdAt)}
                    </p>
                  </div>
                )}

                {(isAdmin
                  ? appointment.status === "pending" ||
                    appointment.status === "confirmed"
                  : appointment.status === "pending" ||
                    (appointment.status === "confirmed" &&
                      appointment.paymentStatus === "unpaid")) && (
                  <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#e9e1d8] pt-4">
                    {confirmAction?.id === appointment._id ? (
                      <>
                        <p className="mr-auto text-xs text-[#817970]">
                          {confirmAction.status === "confirmed"
                            ? "Confirm this appointment?"
                            : "Cancel this appointment?"}
                        </p>

                        <button
                          type="button"
                          disabled={processingId === appointment._id}
                          onClick={() => setConfirmAction(null)}
                          className="rounded-full border border-[#e9e1d8] px-4 py-2 text-xs font-semibold text-[#817970] hover:bg-[#f8f5f0] disabled:opacity-50"
                        >
                          Keep
                        </button>

                        <button
                          type="button"
                          disabled={processingId === appointment._id}
                          onClick={() =>
                            void handleStatusUpdate(
                              appointment._id,
                              confirmAction.status,
                            )
                          }
                          className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {processingId === appointment._id
                            ? "Processing..."
                            : "Confirm action"}
                        </button>
                      </>
                    ) : (
                      <>
                        {isAdmin &&
                          appointment.status === "pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmAction({
                                  id: appointment._id,
                                  status: "confirmed",
                                })
                              }
                              className="flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
                            >
                              <Check size={14} />
                              Confirm appointment
                            </button>
                          )}

                        {!isAdmin &&
                          appointment.status === "confirmed" &&
                          appointment.paymentStatus === "unpaid" && (
                            <button
                              type="button"
                              disabled={
                                paymentProcessingId === appointment._id
                              }
                              onClick={() =>
                                void handlePayment(appointment._id)
                              }
                              className="flex items-center gap-2 rounded-full bg-[#292521] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#b47a57] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {paymentProcessingId === appointment._id
                                ? "Redirecting..."
                                : `Pay Now · $${appointment.servicePrice.toFixed(2)}`}
                            </button>
                          )}

                        {(isAdmin ||
                          appointment.status === "pending") && (
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmAction({
                                id: appointment._id,
                                status: "cancelled",
                              })
                            }
                            className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <X size={14} />
                            Cancel appointment
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
