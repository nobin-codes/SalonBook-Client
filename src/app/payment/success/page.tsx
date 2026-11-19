
import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#FAF7F3] px-4 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-[#E9DFD5] bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-11 w-11 text-green-600" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-[#A0785D]">
          SalonBook Payments
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#30251F]">
          Thank you!
        </h1>

        <p className="mt-3 text-[#85776D]">
          Your checkout process has been completed. Your payment confirmation
          is being verified securely.
        </p>

        <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#F8F3EE] p-4 text-left">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#946748]" />
          <p className="text-sm leading-6 text-[#75675D]">
            Your appointment payment status will update after Stripe confirms
            the payment through our secure webhook. Please check your
            appointments shortly.
          </p>
        </div>

        <Link
          href="/dashboard/appointments"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#946748] px-6 py-3 font-semibold text-white transition hover:bg-[#795238]"
        >
          View My Appointments
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
