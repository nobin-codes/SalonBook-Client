
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  UserRound,
} from "lucide-react";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
};

type SessionUser = {
  name: string;
  email: string;
  role?: "admin" | "customer";
  isBlocked?: boolean;
};

type ServiceResult = {
  data: Service | null;
  error: string;
};

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
];

const getDhakaDate = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
};

const getDhakaMinutes = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const hour = Number(
    parts.find((part) => part.type === "hour")?.value ?? 0,
  );
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0,
  );

  return hour * 60 + minute;
};

const getSlotStartMinutes = (slot: string) => {
  const start = slot.split(" - ")[0];
  const match = start.match(/^(\d{2}):(\d{2}) (AM|PM)$/);

  if (!match) return 0;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3];

  if (period === "AM" && hour === 12) hour = 0;
  if (period === "PM" && hour !== 12) hour += 12;

  return hour * 60 + minute;
};

export default function ServiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const serviceId = params.id;
  const user = session?.user as SessionUser | undefined;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const today = getDhakaDate();

  const fetchService = useCallback(async (): Promise<ServiceResult> => {
    try {
      const data = await apiRequest<Service>(
        `/api/services/${serviceId}`,
      );

      return {
        data,
        error: "",
      };
    } catch (err) {
      return {
        data: null,
        error:
          err instanceof Error
            ? err.message
            : "Unable to load this service.",
      };
    }
  }, [serviceId]);

  useEffect(() => {
    let isActive = true;

    const loadService = async () => {
      const result = await fetchService();

      if (!isActive) return;

      setService(result.data);
      setError(result.error);
      setLoading(false);
    };

    void loadService();

    return () => {
      isActive = false;
    };
  }, [fetchService]);

  const availableTimeSlots = timeSlots.filter((slot) => {
    if (appointmentDate !== today) return true;

    return getSlotStartMinutes(slot) > getDhakaMinutes();
  });

  const handleBooking = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setBookingError("");
    setBookingSuccess("");

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.isBlocked) {
      setBookingError("Your account is blocked. Please contact support.");
      return;
    }

    if (user.role === "admin") {
      setBookingError(
        "Admin accounts cannot book appointments. Please use a customer account.",
      );
      return;
    }

    if (!service || service.status !== "active") {
      setBookingError("This service is currently unavailable.");
      return;
    }

    if (!appointmentDate || appointmentDate < today) {
      setBookingError("Please select a valid appointment date.");
      return;
    }

    if (!timeSlot || !timeSlots.includes(timeSlot)) {
      setBookingError("Please select an appointment time.");
      return;
    }

    if (
      appointmentDate === today &&
      getSlotStartMinutes(timeSlot) <= getDhakaMinutes()
    ) {
      setBookingError("This time slot has already passed. Choose another.");
      return;
    }

    if (message.trim().length > 500) {
      setBookingError("Your message cannot exceed 500 characters.");
      return;
    }

    try {
      setBooking(true);

      await apiRequest("/api/appointments", {
        method: "POST",
        authenticated: true,
        body: JSON.stringify({
          serviceId: service._id,
          appointmentDate,
          timeSlot,
          message: message.trim(),
        }),
      });

      setBookingSuccess("Your appointment request was submitted!");

      router.push("/dashboard/appointments");
      router.refresh();
    } catch (err) {
      setBookingError(
        err instanceof Error
          ? err.message
          : "Unable to create your appointment. Please try again.",
      );
    } finally {
      setBooking(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] px-4 py-3 text-sm text-[#292521] outline-none transition focus:border-[#b47a57] focus:ring-2 focus:ring-[#b47a57]/10";

  if (loading) {
    return (
      <main className="container flex min-h-[65vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            size={30}
            className="mx-auto animate-spin text-[#b47a57]"
          />
          <p className="mt-3 text-sm text-[#817970]">
            Loading service details...
          </p>
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="container flex min-h-[65vh] items-center justify-center">
        <div className="max-w-md text-center">
          <AlertCircle size={36} className="mx-auto text-[#b47a57]" />
          <h1 className="mt-4 text-2xl font-bold text-[#292521]">
            Service not found
          </h1>
          <p className="mt-2 text-sm text-[#817970]">
            {error || "This service may no longer be available."}
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#292521] px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Browse Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5f0] pb-20">
      <div className="container pt-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#817970] transition hover:text-[#b47a57]"
        >
          <ArrowLeft size={16} />
          Back to Services
        </Link>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-2xl border border-[#e9e1d8] bg-white">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.serviceName}
                className="h-[300px] w-full object-cover sm:h-[440px]"
              />

              <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#51483f] shadow-sm">
                {service.category}
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b47a57]">
                The SalonBook Experience
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#292521] sm:text-4xl">
                {service.serviceName}
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#817970]">
                {service.description}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-4 border-t border-[#e9e1d8] pt-6">
                <div>
                  <p className="text-xs text-[#817970]">Service price</p>
                  <p className="mt-1 text-2xl font-bold text-[#292521]">
                    ${service.price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#817970]">Duration</p>
                  <p className="mt-1 flex items-center gap-2 text-xl font-bold text-[#292521]">
                    <Clock3 size={19} className="text-[#b47a57]" />
                    {service.duration} min
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e9e1d8] bg-white p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b47a57]">
                Reserve your visit
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#292521]">
                Book an Appointment
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#817970]">
                Choose a date and time that works for you. Your appointment
                will be submitted for confirmation.
              </p>
            </div>

            {sessionLoading ? (
              <div className="mt-8 flex items-center gap-3 text-sm text-[#817970]">
                <LoaderCircle size={18} className="animate-spin" />
                Checking your account...
              </div>
            ) : !user ? (
              <div className="mt-7 rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] p-5">
                <UserRound size={23} className="text-[#b47a57]" />
                <h3 className="mt-3 font-semibold text-[#292521]">
                  Sign in to book
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#817970]">
                  You need a customer account to reserve this service.
                </p>
                <Link
                  href="/login"
                  className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#292521] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[#443a32] hover:!text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#e9e1d8] px-5 py-3 text-sm font-semibold text-[#51483f] transition hover:bg-[#f8f5f0]"
                >
                  Create Customer Account
                </Link>
              </div>
            ) : user.role === "admin" ? (
              <div className="mt-7 rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] p-5">
                <AlertCircle size={23} className="text-[#b47a57]" />
                <h3 className="mt-3 font-semibold text-[#292521]">
                  Admin account
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#817970]">
                  Admin accounts manage services and appointments. Please
                  sign in with a customer account to make a booking.
                </p>
              </div>
            ) : user.isBlocked ? (
              <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                Your account is blocked. You cannot create appointments.
              </div>
            ) : (
              <form onSubmit={handleBooking} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="appointmentDate"
                    className="text-sm font-semibold text-[#39332d]"
                  >
                    Appointment Date *
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-[#817970]"
                    />
                    <input
                      id="appointmentDate"
                      type="date"
                      min={today}
                      value={appointmentDate}
                      onChange={(event) => {
                        setAppointmentDate(event.target.value);
                        setTimeSlot("");
                        setBookingError("");
                      }}
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="timeSlot"
                    className="text-sm font-semibold text-[#39332d]"
                  >
                    Available Time *
                  </label>
                  <select
                    id="timeSlot"
                    value={timeSlot}
                    onChange={(event) => setTimeSlot(event.target.value)}
                    required
                    className={inputClass}
                  >
                    <option value="">Select a time slot</option>
                    {availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>

                  {appointmentDate === today &&
                    availableTimeSlots.length === 0 && (
                      <p className="mt-2 text-xs text-[#817970]">
                        No remaining time slots today. Please choose another
                        date.
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-[#39332d]"
                  >
                    Additional Message
                    <span className="ml-1 font-normal text-[#a69c91]">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Any preferences or details we should know?"
                    className={`${inputClass} resize-y`}
                  />
                  <p className="mt-1 text-right text-xs text-[#a69c91]">
                    {message.length}/500
                  </p>
                </div>

                <div className="rounded-xl bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#817970]">Selected service</span>
                    <span className="font-semibold text-[#292521]">
                      {service.serviceName}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#e9e1d8] pt-3">
                    <span className="text-sm text-[#817970]">
                      Total price
                    </span>
                    <span className="text-xl font-bold text-[#292521]">
                      ${service.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {(bookingError || bookingSuccess) && (
                  <div
                    className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                      bookingError
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-800"
                    }`}
                  >
                    {bookingError ? (
                      <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    ) : (
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    )}
                    <p>{bookingError || bookingSuccess}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={booking || availableTimeSlots.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#292521] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#443a32] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {booking ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Request Appointment"
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-[#a69c91]">
                  Your appointment will remain pending until an admin
                  confirms it. Payment is not collected at this stage.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
