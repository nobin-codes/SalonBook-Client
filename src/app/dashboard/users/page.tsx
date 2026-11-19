
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  LoaderCircle,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "admin" | "customer";
  isBlocked: boolean;
  phone?: string;
  createdAt?: string;
}

type UserFilter = "all" | "customers" | "admins" | "active" | "blocked";

export default function ManageUsersPage() {
  const { data: session } = useSession();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<UserFilter>("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  const currentUserId = session?.user?.id ?? "";

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest<ManagedUser[]>("/api/users", {
        authenticated: true,
      });

      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      let filterMatch = true;

      if (filter === "customers") filterMatch = user.role === "customer";
      if (filter === "admins") filterMatch = user.role === "admin";
      if (filter === "active") {
        filterMatch = user.role === "customer" && !user.isBlocked;
      }
      if (filter === "blocked") {
        filterMatch = user.role === "customer" && user.isBlocked;
      }

      return searchMatch && filterMatch;
    });
  }, [users, search, filter]);

  const stats = useMemo(() => {
    const customers = users.filter((user) => user.role === "customer");

    return {
      total: users.length,
      customers: customers.length,
      active: customers.filter((user) => !user.isBlocked).length,
      blocked: customers.filter((user) => user.isBlocked).length,
    };
  }, [users]);

  const updateUserStatus = async () => {
    if (!selectedUser) return;

    const user = selectedUser;
    const nextStatus = !user.isBlocked;

    setUpdating(true);
    setError("");
    setFeedback("");

    try {
      await apiRequest<{ id: string; isBlocked: boolean }>(
        `/api/users/${user.id}/status`,
        {
          method: "PATCH",
          authenticated: true,
          body: JSON.stringify({ isBlocked: nextStatus }),
        },
      );

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item.id === user.id
            ? { ...item, isBlocked: nextStatus }
            : item,
        ),
      );

      setFeedback(
        nextStatus
          ? `${user.name}'s account has been blocked.`
          : `${user.name}'s account has been unblocked.`,
      );

      setSelectedUser(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update the account status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Not available";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filters: { label: string; value: UserFilter }[] = [
    { label: "All users", value: "all" },
    { label: "Customers", value: "customers" },
    { label: "Administrators", value: "admins" },
    { label: "Active", value: "active" },
    { label: "Blocked", value: "blocked" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a77a5d]">
            Administration
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#292521]">
            Manage Users
          </h1>
          <p className="mt-2 text-sm text-[#827970]">
            Manage customer accounts and monitor platform access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadUsers()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#e9e1d8] bg-white px-4 py-2.5 text-sm font-medium text-[#51463e] transition hover:bg-[#f8f5f0] disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {feedback && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 size={18} className="shrink-0" />
          <p>{feedback}</p>
          <button
            type="button"
            onClick={() => setFeedback("")}
            className="ml-auto"
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={stats.total}
          icon={<Users size={19} />}
        />
        <StatCard
          label="Customers"
          value={stats.customers}
          icon={<UserRound size={19} />}
        />
        <StatCard
          label="Active customers"
          value={stats.active}
          icon={<CheckCircle2 size={19} />}
        />
        <StatCard
          label="Blocked customers"
          value={stats.blocked}
          icon={<Ban size={19} />}
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-[#e9e1d8] bg-white">
        <div className="space-y-4 border-b border-[#eee8e1] p-5">
          <div>
            <h2 className="text-lg font-semibold text-[#292521]">
              User directory
            </h2>
            <p className="mt-1 text-sm text-[#827970]">
              View registered users and manage customer account status.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a49a91]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-[#e9e1d8] bg-[#fdfcfb] py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#aaa098] focus:border-[#b47a57]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    filter === item.value
                      ? "bg-[#292521] text-white"
                      : "border border-[#e9e1d8] bg-white text-[#756b63] hover:bg-[#f8f5f0]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#827970]">
            <LoaderCircle size={20} className="animate-spin" />
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <Users size={30} className="mb-3 text-[#b8aaa0]" />
            <h3 className="font-semibold text-[#39322c]">
              No users found
            </h3>
            <p className="mt-1 text-sm text-[#827970]">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#faf8f5] text-[11px] uppercase tracking-wider text-[#8a7f75]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">Role</th>
                    <th className="px-5 py-4 font-semibold">Joined</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0ebe5]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-[#fdfcfb]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eee4da] text-sm font-semibold text-[#805b43]">
                            {getInitials(user.name || "U")}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#39322c]">
                              {user.name}
                            </p>
                            <p className="mt-0.5 text-xs text-[#8a7f75]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1ece6] px-3 py-1.5 text-xs font-medium text-[#76583f]">
                            <ShieldCheck size={13} />
                            Administrator
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f1ed] px-3 py-1.5 text-xs font-medium text-[#686057]">
                            <UserRound size={13} />
                            Customer
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#756b63]">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusLabel isBlocked={user.isBlocked} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        {user.role === "customer" &&
                        user.id !== currentUserId ? (
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              user.isBlocked
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-red-50 text-red-700 hover:bg-red-100"
                            }`}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        ) : (
                          <span className="text-xs text-[#a49a91]">
                            Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#f0ebe5] md:hidden">
              {filteredUsers.map((user) => (
                <div key={user.id} className="space-y-4 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#eee4da] text-sm font-semibold text-[#805b43]">
                      {getInitials(user.name || "U")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#39322c]">
                        {user.name}
                      </p>
                      <p className="mt-1 break-all text-xs text-[#8a7f75]">
                        {user.email}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusLabel isBlocked={user.isBlocked} />
                        <span className="text-xs text-[#8a7f75]">
                          {user.role === "admin" ? "Administrator" : "Customer"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-[#f0ebe5] pt-3">
                    <span className="text-xs text-[#8a7f75]">
                      Joined {formatDate(user.createdAt)}
                    </span>

                    {user.role === "customer" &&
                    user.id !== currentUserId ? (
                      <button
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                          user.isBlocked
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.isBlocked ? "Unblock account" : "Block account"}
                      </button>
                    ) : (
                      <span className="text-xs text-[#a49a91]">
                        Protected account
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="border-t border-[#eee8e1] px-5 py-4 text-xs text-[#8a7f75]">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </section>

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={() => !updating && setSelectedUser(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-status-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div
                className={`flex size-11 items-center justify-center rounded-full ${
                  selectedUser.isBlocked
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {selectedUser.isBlocked ? (
                  <CheckCircle2 size={21} />
                ) : (
                  <Ban size={21} />
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                disabled={updating}
                className="rounded-lg p-2 text-[#8a7f75] transition hover:bg-[#f5f2ee]"
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <h2
              id="user-status-title"
              className="text-xl font-semibold text-[#292521]"
            >
              {selectedUser.isBlocked ? "Unblock customer?" : "Block customer?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#827970]">
              {selectedUser.isBlocked
                ? `This will restore ${selectedUser.name}'s access to protected customer features.`
                : `This will prevent ${selectedUser.name} from accessing protected features of SalonBook.`}
            </p>

            <div className="mt-4 rounded-lg bg-[#faf8f5] p-4">
              <p className="font-medium text-[#39322c]">
                {selectedUser.name}
              </p>
              <p className="mt-1 break-all text-sm text-[#827970]">
                {selectedUser.email}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={updating}
                onClick={() => setSelectedUser(null)}
                className="rounded-lg border border-[#e9e1d8] px-4 py-2.5 text-sm font-medium text-[#51463e] transition hover:bg-[#f8f5f0] disabled:opacity-50"
              >
                Keep account
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() => void updateUserStatus()}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${
                  selectedUser.isBlocked
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-red-700 hover:bg-red-800"
                }`}
              >
                {updating && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {updating
                  ? "Updating..."
                  : selectedUser.isBlocked
                    ? "Unblock account"
                    : "Block account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e9e1d8] bg-white p-4 sm:p-5">
      <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-[#f4eee8] text-[#9a7052]">
        {icon}
      </div>
      <p className="text-2xl font-semibold tabular-nums text-[#292521]">
        {value}
      </p>
      <p className="mt-1 text-xs text-[#827970] sm:text-sm">{label}</p>
    </div>
  );
}

function StatusLabel({ isBlocked }: { isBlocked: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
        isBlocked
          ? "bg-red-50 text-red-700"
          : "bg-green-50 text-green-700"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isBlocked ? "bg-red-600" : "bg-green-600"
        }`}
      />
      {isBlocked ? "Blocked" : "Active"}
    </span>
  );
}
