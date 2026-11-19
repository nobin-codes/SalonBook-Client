
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Scissors,
  Clock3,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
};

const categories = [
  "All Categories",
  "Haircut & Styling",
  "Beard & Shaving",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Head Massage",
  "Men's Grooming Packages",
];

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const data = await apiRequest<Service[]>("/api/services/manage", {
        authenticated: true,
      });

      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load services.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchServices();
  }, [fetchServices]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.serviceName
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        category === "All Categories" || service.category === category;

      const matchesStatus =
        statusFilter === "all" || service.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, search, category, statusFilter]);

  const activeCount = services.filter(
    (service) => service.status === "active",
  ).length;

  const inactiveCount = services.filter(
    (service) => service.status === "inactive",
  ).length;

  const handleStatusChange = async (service: Service) => {
    const nextStatus =
      service.status === "active" ? "inactive" : "active";

    try {
      setActionId(service._id);

      await apiRequest<Service>(`/api/services/${service._id}`, {
        method: "PATCH",
        authenticated: true,
        body: JSON.stringify({ status: nextStatus }),
      });

      setServices((current) =>
        current.map((item) =>
          item._id === service._id
            ? { ...item, status: nextStatus }
            : item,
        ),
      );

      toast.success(
        `${service.serviceName} ${
          nextStatus === "active" ? "activated" : "deactivated"
        } successfully.`,
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update service status.",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    const service = serviceToDelete;

    try {
      setActionId(service._id);

      await apiRequest<void>(`/api/services/${service._id}`, {
        method: "DELETE",
        authenticated: true,
      });

      setServices((current) =>
        current.map((item) =>
          item._id === service._id
            ? { ...item, status: "inactive" }
            : item,
        ),
      );

      setServiceToDelete(null);

      toast.success(
        `${service.serviceName} removed from active services.`,
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove service.",
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b47a57]">
            Service management
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#292521]">
            Manage Services
          </h1>
          <p className="mt-2 text-sm text-[#817970]">
            Manage your men's grooming services and pricing.
          </p>
        </div>

        <Link
          href="/dashboard/services/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#292521] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#443a32]"
        >
          <Plus size={18} />
          Add New Service
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <p className="text-sm text-[#817970]">Total Services</p>
          <p className="mt-2 text-3xl font-bold text-[#292521]">
            {services.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <p className="text-sm text-[#817970]">Active Services</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
          <p className="text-sm text-[#817970]">Inactive Services</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">
            {inactiveCount}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_170px_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#817970]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search services..."
              className="w-full rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#b47a57]"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] px-3 py-3 text-sm outline-none focus:border-[#b47a57]"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] px-3 py-3 text-sm outline-none focus:border-[#b47a57]"
          >
            <option value="active">Active Services</option>
            <option value="inactive">Inactive Services</option>
            <option value="all">All Statuses</option>
          </select>

          <button
            type="button"
            onClick={() => void fetchServices()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e9e1d8] px-4 py-3 text-sm font-medium text-[#51483f] transition hover:bg-[#f8f5f0] disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#e9e1d8] bg-white">
          <div className="text-center">
            <RefreshCw
              size={25}
              className="mx-auto animate-spin text-[#b47a57]"
            />
            <p className="mt-3 text-sm text-[#817970]">
              Loading services...
            </p>
          </div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d9cbbd] bg-white px-6 py-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f8f5f0] text-[#b47a57]">
            <Scissors size={25} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#292521]">
            {services.length === 0
              ? "No services added yet"
              : statusFilter === "active"
                ? "No active services"
                : "No matching services"}
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#817970]">
            {services.length === 0
              ? "Start building your service collection by adding your first men's grooming service."
              : statusFilter === "active"
                ? "There are no active services right now. You can activate an existing service from the inactive services filter."
                : "Try changing your search or filters to find a service."}
          </p>

          {services.length === 0 && (
            <Link
              href="/dashboard/services/add"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#292521] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#443a32]"
            >
              <Plus size={17} />
              Add First Service
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <article
              key={service._id}
              className="overflow-hidden rounded-2xl border border-[#e9e1d8] bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-52 bg-[#f1ece5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image}
                  alt={service.serviceName}
                  className="h-full w-full object-cover"
                />

                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    service.status === "active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {service.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-medium text-[#b47a57]">
                    {service.category}
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-[#292521]">
                    {service.serviceName}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#817970]">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#eee8e1] pt-4">
                  <p className="text-xl font-bold text-[#292521]">
                    ${service.price.toFixed(2)}
                  </p>

                  <span className="flex items-center gap-1.5 text-sm text-[#817970]">
                    <Clock3 size={15} />
                    {service.duration} min
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href={`/dashboard/services/${service._id}/edit`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e9e1d8] px-2 py-2.5 text-xs font-semibold text-[#51483f] transition hover:bg-[#f8f5f0]"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleStatusChange(service)}
                    disabled={actionId === service._id}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e9e1d8] px-2 py-2.5 text-xs font-semibold text-[#51483f] transition hover:bg-[#f8f5f0] disabled:opacity-50"
                  >
                    {service.status === "active" ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                    {service.status === "active" ? "Disable" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceToDelete(service)}
                    disabled={actionId === service._id}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-100 px-2 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && filteredServices.length > 0 && (
        <p className="text-sm text-[#817970]">
          Showing {filteredServices.length} of {services.length} services
        </p>
      )}

      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-service-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={23} />
            </div>

            <h2
              id="delete-service-title"
              className="mt-5 text-xl font-bold text-[#292521]"
            >
              Remove this service?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#817970]">
              Remove{" "}
              <strong className="text-[#292521]">
                {serviceToDelete.serviceName}
              </strong>{" "}
              from active services? It will be hidden from customers, but
              existing appointment history will be preserved. You can
              reactivate it later.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={actionId === serviceToDelete._id}
                onClick={() => setServiceToDelete(null)}
                className="rounded-xl border border-[#e9e1d8] px-4 py-2.5 text-sm font-semibold text-[#51483f] hover:bg-[#f8f5f0] disabled:opacity-50"
              >
                Keep Service
              </button>

              <button
                type="button"
                disabled={actionId === serviceToDelete._id}
                onClick={() => void handleDelete()}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionId === serviceToDelete._id
                  ? "Removing..."
                  : "Remove Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
