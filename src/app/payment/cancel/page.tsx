
import Link from "next/link";
import { XCircle, RefreshCw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#FAF7F3] px-4 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-[#E9DFD5] bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-11 w-11 text-red-500" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-[#A0785D]">
          SalonBook Payments
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#30251F]">
          Payment Cancelled
        </h1>

        <p className="mt-3 leading-7 text-[#85776D]">
          Your checkout was cancelled or was not completed. No successful
          payment has been recorded by SalonBook.
        </p>

        <div className="mt-7 rounded-2xl bg-[#F8F3EE] p-4 text-left text-sm leading-6 text-[#75675D]">
          Your appointment remains available in your account. You can return
          to your appointments and try paying again if the appointment is
          still confirmed and unpaid.
        </div>

        <Link
          href="/dashboard/appointments"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#946748] px-6 py-3 font-semibold text-white transition hover:bg-[#795238]"
        >
          <RefreshCw size={17} />
          Return to Appointments
        </Link>

        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-[#946748] hover:underline"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
