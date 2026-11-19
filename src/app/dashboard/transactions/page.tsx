
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  CalendarDays,
  CreditCard,
  RefreshCw,
  Search,
  Receipt,
  UserRound,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

type TransactionStatus = "paid" | "failed";

interface Transaction {
  _id: string;
  appointmentId: string;
  customerId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: TransactionStatus;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  } | null;
  appointment?: {
    _id: string;
    appointmentDate: string;
    timeSlot: string;
    status: string;
    paymentStatus: string;
  } | null;
  service?: {
    _id: string;
    serviceName: string;
    category: string;
  } | null;
}

type StatusFilter = "all" | TransactionStatus;

const statusStyles: Record<TransactionStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
};

// Appointment dates are stored as YYYY-MM-DD.
// Parse them as UTC to prevent timezone-related date shifts.
const formatAppointmentDate = (date: string) => {
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

export default function TransactionsPage() {
  const { data: session } = useSession();

  const user = session?.user as
    | { role?: "admin" | "customer" }
    | undefined;

  const isAdmin = user?.role === "admin";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest<Transaction[]>(
        "/api/payments/transactions",
        { authenticated: true },
      );

      setTransactions(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load transactions.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user && isAdmin) {
      void loadTransactions();
    } else if (session?.user && !isAdmin) {
      setIsLoading(false);
    }
  }, [session?.user, isAdmin, loadTransactions]);

  const paidTransactions = transactions.filter(
    (transaction) => transaction.status === "paid",
  );

  const failedTransactions = transactions.filter(
    (transaction) => transaction.status === "failed",
  );

  const totalRevenue = paidTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const formatAmount = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Dhaka",
    });

  const filteredTransactions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesStatus =
        statusFilter === "all" ||
        transaction.status === statusFilter;

      const searchableText = [
        transaction.customer?.name,
        transaction.customer?.email,
        transaction.service?.serviceName,
        transaction.stripeSessionId,
        transaction.appointmentId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        (!searchValue || searchableText.includes(searchValue))
      );
    });
  }, [transactions, statusFilter, search]);

  if (!session?.user && isLoading) {
    return (
      <section className="rounded-2xl border border-[#e9e1d8] bg-white py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e9e1d8] border-t-[#b47a57]" />
        <p className="mt-4 text-sm text-[#817970]">
          Loading transactions...
        </p>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="rounded-2xl border border-[#e9e1d8] bg-white px-6 py-16 text-center">
        <CreditCard size={32} className="mx-auto text-[#b47a57]" />
        <h1 className="mt-4 text-xl font-semibold text-[#292521]">
          Access restricted
        </h1>
        <p className="mt-2 text-sm text-[#817970]">
          Only administrators can view transaction records.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#b47a57]">
            Financial overview
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#292521]">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-[#817970]">
            Monitor customer payments and review transaction history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadTransactions()}
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

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#817970]">Total transactions</p>
            <Receipt size={18} className="text-[#b47a57]" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-[#292521]">
            {isLoading ? "—" : transactions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#817970]">Successful payments</p>
            <CreditCard size={18} className="text-emerald-600" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-emerald-600">
            {isLoading ? "—" : paidTransactions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#817970]">Failed payments</p>
            <Receipt size={18} className="text-red-500" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-red-600">
            {isLoading ? "—" : failedTransactions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#817970]">Successful revenue</p>
            <ArrowDownToLine size={18} className="text-[#b47a57]" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-[#292521]">
            {isLoading
              ? "—"
              : formatAmount(
                  totalRevenue,
                  paidTransactions[0]?.currency || "USD",
                )}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void loadTransactions()}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#292521]">
            Payment history
            <span className="ml-2 text-sm font-normal text-[#817970]">
              ({filteredTransactions.length})
            </span>
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a39a90]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions..."
              className="h-10 w-full rounded-xl border border-[#e9e1d8] bg-white pl-9 pr-3 text-sm text-[#292521] outline-none placeholder:text-[#a39a90] focus:border-[#b47a57] sm:w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="h-10 rounded-xl border border-[#e9e1d8] bg-white px-3 text-sm text-[#292521] outline-none focus:border-[#b47a57]"
            aria-label="Filter transactions by status"
          >
            <option value="all">All transactions</option>
            <option value="paid">Successful</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-[#e9e1d8] bg-white py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e9e1d8] border-t-[#b47a57]" />
          <p className="mt-4 text-sm text-[#817970]">
            Loading transactions...
          </p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="rounded-2xl border border-[#e9e1d8] bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f5f0] text-[#b47a57]">
            <CreditCard size={24} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-[#292521]">
            {transactions.length === 0
              ? "No transactions yet"
              : "No matching transactions"}
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#817970]">
            {transactions.length === 0
              ? "Customer payment records will appear here after Stripe processes payments."
              : "Try another search term or transaction status."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <article
              key={transaction._id}
              className="overflow-hidden rounded-2xl border border-[#e9e1d8] bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f8f5f0] text-[#b47a57]">
                      <CreditCard size={21} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[transaction.status]}`}
                        >
                          {transaction.status === "paid"
                            ? "Successful"
                            : "Failed"}
                        </span>

                        <span className="text-xs text-[#a39a90]">
                          {formatDate(transaction.createdAt)}
                        </span>
                      </div>

                      <h3 className="mt-2 text-lg font-semibold text-[#292521]">
                        {transaction.service?.serviceName ??
                          "Service information unavailable"}
                      </h3>

                      {transaction.service?.category && (
                        <p className="mt-1 text-sm text-[#817970]">
                          {transaction.service.category}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-2xl font-semibold text-[#292521]">
                      {formatAmount(
                        transaction.amount,
                        transaction.currency,
                      )}
                    </p>
                    <p className="mt-1 text-xs text-[#817970]">
                      Transaction amount
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 rounded-xl bg-[#f8f5f0] p-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <UserRound
                      size={17}
                      className="mt-0.5 shrink-0 text-[#b47a57]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-[#817970]">Customer</p>
                      <p className="mt-1 break-words text-sm font-semibold text-[#292521]">
                        {transaction.customer?.name ?? "Unavailable"}
                      </p>
                      <p className="mt-1 break-all text-xs text-[#817970]">
                        {transaction.customer?.email ??
                          transaction.customerId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDays
                      size={17}
                      className="mt-0.5 shrink-0 text-[#b47a57]"
                    />
                    <div>
                      <p className="text-xs text-[#817970]">
                        Appointment
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#292521]">
                        {transaction.appointment
                          ? formatAppointmentDate(
                              transaction.appointment.appointmentDate,
                            )
                          : "Unavailable"}
                      </p>
                      <p className="mt-1 text-xs text-[#817970]">
                        {transaction.appointment?.timeSlot ?? ""}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-[#817970]">
                      Stripe session
                    </p>
                    <p
                      title={transaction.stripeSessionId}
                      className="mt-1 break-all text-xs font-medium text-[#746c64]"
                    >
                      {transaction.stripeSessionId}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
