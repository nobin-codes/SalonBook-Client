
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

interface ServicesResponse {
  success: boolean;
  data: Service[];
}

interface ServicesBrowserProps {
  initialServices: Service[];
  initialCategory: string;
}

const SERVICE_CATEGORIES = [
  "Haircut & Styling",
  "Beard & Shaving",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Head Massage",
  "Men's Grooming Packages",
];

export default function ServicesBrowser({
  initialServices,
  initialCategory,
}: ServicesBrowserProps) {
  const [services, setServices] = useState(initialServices);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("Service connection is not configured.");
        }

        const query = new URLSearchParams();

        if (search.trim()) {
          query.set("search", search.trim());
        }

        if (category) {
          query.set("category", category);
        }

        if (sort) {
          query.set("sort", sort);
        }

        const endpoint = `${apiUrl.replace(/\/+$/, "")}/api/services?${query.toString()}`;

        const response = await fetch(endpoint, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load services. Please try again.");
        }

        const result: ServicesResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Unable to load services. Please try again.");
        }

        setServices(result.data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      controller.abort();
    };
  }, [search, category, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setError("");
  };

  return (
    <div>
      <div className="mb-10 rounded-2xl border border-[#e9e1d8] bg-white p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="service-search"
              className="mb-2 block text-sm font-medium text-[#292521]"
            >
              Search services
            </label>

            <input
              id="service-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by service name..."
              className="w-full rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] px-4 py-3 text-sm text-[#292521] outline-none transition placeholder:text-[#a49a90] focus:border-[#956044] focus:ring-2 focus:ring-[#956044]/10"
            />
          </div>

          <div>
            <label
              htmlFor="service-category"
              className="mb-2 block text-sm font-medium text-[#292521]"
            >
              Filter by category
            </label>

            <select
              id="service-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] px-4 py-3 text-sm text-[#292521] outline-none transition focus:border-[#956044] focus:ring-2 focus:ring-[#956044]/10"
            >
              <option value="">All categories</option>

              {SERVICE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="service-sort"
              className="mb-2 block text-sm font-medium text-[#292521]"
            >
              Sort by price
            </label>

            <select
              id="service-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="w-full rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] px-4 py-3 text-sm text-[#292521] outline-none transition focus:border-[#956044] focus:ring-2 focus:ring-[#956044]/10"
            >
              <option value="">Default order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee7df] pt-4">
          <p className="text-sm text-[#817970]" aria-live="polite">
            {loading
              ? "Updating services..."
              : `${services.length} ${services.length === 1 ? "service" : "services"} found`}
          </p>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!search && !category && !sort}
            className="text-sm font-medium text-[#956044] transition hover:text-[#75472f] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear filters
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-6 text-center text-sm text-[#817970]" aria-live="polite">
          Loading services...
        </div>
      )}

      {services.length === 0 && !loading ? (
        <div className="rounded-2xl border border-[#e9e1d8] bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-[#292521]">
            {search || category || sort
              ? "No matching services found"
              : "No services available yet"}
          </h2>

          <p className="mt-3 text-sm text-[#817970]">
            {search || category || sort
              ? "Try changing your search or filters to find available services."
              : "New grooming services will appear here soon."}
          </p>

          {search || category || sort ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex rounded-full bg-[#292521] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#956044]"
            >
              Clear filters
            </button>
          ) : (
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-[#292521] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#956044]"
            >
              Back to home
            </Link>
          )}
        </div>
      ) : (
        <div
          className={`grid gap-7 sm:grid-cols-2 lg:grid-cols-3 ${
            loading ? "opacity-60" : ""
          }`}
        >
          {services.map((service) => (
            <article
              key={service._id}
              className="overflow-hidden rounded-2xl border border-[#e9e1d8] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#eee7df]">
                <img
                  src={service.image}
                  alt={service.serviceName}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-[#a16d4e]">
                  {service.category}
                </p>

                <h2 className="mt-3 text-xl font-semibold text-[#292521]">
                  {service.serviceName}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#817970]">
                  {service.description}
                </p>

                <div className="mt-4 text-sm text-[#817970]">
                  {service.duration} minutes
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#e9e1d8] pt-5">
                  <div>
                    <p className="text-xs text-[#817970]">Starting from</p>
                    <p className="mt-1 text-xl font-semibold text-[#292521]">
                      ${service.price}
                    </p>
                  </div>

                  <Link
                    href={`/services/${service._id}`}
                    className="rounded-full bg-[#956044] px-5 py-3 text-sm font-medium !text-white transition hover:bg-[#75472F] hover:!text-white"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
