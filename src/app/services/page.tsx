
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

async function getServices(): Promise<Service[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) return [];

    const response = await fetch(`${apiUrl}/api/services`, {
      cache: "no-store",
    });

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

async function ServicesContent() {
  await connection();

  const services = await getServices();

  return (
    <>
      {services.length === 0 ? (
        <div className="rounded-2xl border border-[#e9e1d8] bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-[#292521]">
            No services available yet
          </h2>
          <p className="mt-3 text-sm text-[#817970]">
            New grooming services will appear here soon.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-[#292521] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#956044]"
          >
            Back to home
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

export default function ServicesPage() {
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
          <ServicesContent />
        </Suspense>
      </section>
    </main>
  );
}
