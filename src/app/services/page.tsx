
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore professional men's grooming services at SalonBook.",
};

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

interface ServicesPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

interface ServiceFilters {
  search: string;
  category: string;
  sort: string;
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

async function getServices(filters: ServiceFilters): Promise<Service[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) return [];

    const query = new URLSearchParams();

    if (filters.search) query.set("search", filters.search);
    if (filters.category) query.set("category", filters.category);

    if (filters.sort) query.set("sort", filters.sort);

    const queryString = query.toString();
    const endpoint = `${apiUrl.replace(/\/+$/, "")}/api/services`;

    const response = await fetch(
      queryString ? `${endpoint}?${queryString}` : endpoint,
      { cache: "no-store" },
    );

    if (!response.ok) return [];

    const result: ServicesResponse = await response.json();

    return result.success && Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

function ServicesLoading() {
  return (
    <div className="rounded-2xl border border-[#e9e1d8] bg-white px-6 py-16 text-center">
      <p className="text-sm text-[#817970]">Loading grooming services...</p>
    </div>
  );
}

async function ServicesContent({
  searchParams,
}: {
  searchParams: ServicesPageProps["searchParams"];
}) {
  await connection();

  const params = await searchParams;

  const filters: ServiceFilters = {
    search: params.search?.trim() ?? "",
    category: SERVICE_CATEGORIES.includes(params.category ?? "")
      ? params.category ?? ""
      : "",
    sort: ["price-asc", "price-desc"].includes(params.sort ?? "")
      ? params.sort ?? ""
      : "",
  };

  const services = await getServices(filters);

  return (
    <>
      <form
        action="/services"
        method="GET"
        className="mb-10 rounded-2xl border border-[#e9e1d8] bg-white p-5 sm:p-6"
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end">
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
              name="search"
              defaultValue={filters.search}
              placeholder="Search by service name..."
              className="w-full rounded-xl border border-[#e9e1d8] bg-[#fdfcfb] px-4 py-3 text-sm text-[#292521] outline-none transition placeholder:text-[#a49b92] focus:border-[#956044] focus:ring-2 focus:ring-[#956044]/10"
            />
          </div>

          <div>
            <label
              htmlFor="service-category"
              className="mb-2 block text-sm font-medium text-[#292521]"
            >
              Category
            </label>
            <select
              id="service-category"
              name="category"
              defaultValue={filters.category}
              className="w-full rounded-xl border border-[#e9e1d8] bg-[#fdfcfb] px-4 py-3 text-sm text-[#292521] outline-none transition focus:border-[#956044] focus:ring-2 focus:ring-[#956044]/10"
            >
              <option value="">All categories</option>
              {SERVICE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
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
              name="sort"
              defaultValue={filters.sort}
              className="w-full rounded-xl border border-[#e9e1d8] bg-[#fdfcfb] px-4 py-3 text-sm text-[#292521] outline-none transition focus:border-[#956044] focus:ring-2 focus:ring-[#956044]/10"
            >
              <option value="">Newest first</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className="flex gap-3 lg:pb-0">
            <button
              type="submit"
              className="flex-1 rounded-full bg-[#956044] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#75472F]"
            >
              Apply
            </button>
            <Link
              href="/services"
              className="flex items-center justify-center rounded-full border border-[#e9e1d8] px-5 py-3 text-sm font-medium text-[#655c54] transition hover:bg-[#f8f5f0]"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-sm text-[#817970]">
          {services.length} {services.length === 1 ? "service" : "services"} found
        </p>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-[#e9e1d8] bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-[#292521]">
            No services found
          </h2>
          <p className="mt-3 text-sm text-[#817970]">
            Try another search term or change your filters to find available
            grooming services.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex rounded-full bg-[#292521] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#956044]"
          >
            View all services
          </Link>
        </div>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  );
}

export default function ServicesPage({ searchParams }: ServicesPageProps) {
  return (
    <main className="min-h-screen bg-[#f8f5f0]">
      <section className="container py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#a16d4e]">
            The SalonBook Experience
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-[#292521] sm:text-5xl">
            Grooming, done your way.
          </h1>

          <p className="mt-5 text-base leading-7 text-[#817970]">
            Discover professional grooming services designed to help you look
            sharp and feel confident.
          </p>
        </div>

        <Suspense fallback={<ServicesLoading />}>
          <ServicesContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
