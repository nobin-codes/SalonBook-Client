
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, Clock3, Scissors, Sparkles } from "lucide-react";
import Hero from "@/components/home/hero";

export const metadata: Metadata = {
  title: "SalonBook | Men's Grooming, Simplified",
  description:
    "Discover professional men's grooming services and book your next salon appointment with SalonBook.",
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

async function getServices(endpoint: string): Promise<Service[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) return [];

    const response = await fetch(`${apiUrl}${endpoint}`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const result: ServicesResponse = await response.json();

    return result.success && Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return [];
  }
}

export default async function Home() {
  await connection();

  const [featuredServices, allServices] = await Promise.all([
    getServices("/api/services/featured"),
    getServices("/api/services"),
  ]);

  const services =
    featuredServices.length > 0
      ? featuredServices
      : allServices.slice(0, 6);

  const categoryCounts = allServices.reduce<Record<string, number>>(
    (counts, service) => {
      counts[service.category] = (counts[service.category] || 0) + 1;
      return counts;
    },
    {},
  );

  const categories = Object.entries(categoryCounts);

  return (
    <main>
      <Hero />

      {/* Featured Services */}
      <section className="bg-[#f8f5f0] py-20 sm:py-24">
        <div className="container">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#a16d4e]">
                Curated for you
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-[#292521] sm:text-4xl">
                Grooming that makes a difference.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#817970]">
                Discover our selection of professional grooming services,
                designed to help you look sharp and feel confident.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#956044] transition hover:gap-3"
            >
              Explore all services
              <ArrowRight size={17} />
            </Link>
          </div>

          {services.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((service) => (
                <article
                  key={service._id}
                  className="group overflow-hidden rounded-2xl border border-[#e9e1d8] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link
                    href={`/services/${service._id}`}
                    className="block"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#eee7df]">
                      <img
                        src={service.image}
                        alt={service.serviceName}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#a16d4e]">
                        {service.category}
                      </p>

                      <h3 className="mt-3 text-xl font-semibold text-[#292521]">
                        {service.serviceName}
                      </h3>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#817970]">
                        {service.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-[#e9e1d8] pt-5">
                        <div>
                          <p className="text-xs text-[#817970]">
                            Starting from
                          </p>
                          <p className="mt-1 text-xl font-semibold text-[#292521]">
                            ${service.price}
                          </p>
                        </div>

                        <span className="inline-flex items-center gap-2 rounded-full bg-[#292521] px-5 py-3 text-sm font-medium text-white transition group-hover:bg-[#956044]">
                          View details
                          <ArrowRight size={15} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e9e1d8] bg-white px-6 py-16 text-center">
              <Scissors className="mx-auto text-[#a16d4e]" size={32} />
              <h3 className="mt-4 text-xl font-semibold text-[#292521]">
                Services coming soon
              </h3>
              <p className="mt-2 text-sm text-[#817970]">
                Our grooming services will be available here soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Categories */}
      {categories.length > 0 && (
        <section className="border-y border-[#e9e1d8] bg-white py-20">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#a16d4e]">
                Find your style
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-[#292521] sm:text-4xl">
                Explore grooming categories.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#817970]">
                From a fresh haircut to complete grooming, find the service
                that fits your style.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(([category, count]) => (
                <Link
                  key={category}
                  href="/services"
                  className="group flex items-center justify-between rounded-2xl border border-[#e9e1d8] bg-[#f8f5f0] p-6 transition duration-300 hover:border-[#b47a57] hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#a16d4e] transition group-hover:bg-[#292521] group-hover:text-white">
                      <Scissors size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#292521]">
                        {category}
                      </h3>
                      <p className="mt-1 text-xs text-[#817970]">
                        {count} {count === 1 ? "service" : "services"} available
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={18}
                    className="shrink-0 text-[#a16d4e] transition group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why SalonBook */}
      <section className="bg-[#292521] py-20 text-white sm:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[#d6b18d]">
                <Sparkles size={22} />
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b18d]">
                The SalonBook experience
              </p>

              <h2 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Your time matters. Your style does too.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/65">
                Finding the right grooming service should be simple. Explore
                available services, choose a time that works for you, and
                manage your appointments in one place.
              </p>

              <Link
                href="/services"
                className="mt-8 inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[#b47a57] px-7 text-sm font-semibold text-white transition hover:bg-[#956044]"
              >
                Find your service
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-7">
                <Scissors size={25} className="text-[#d6b18d]" />
                <h3 className="mt-6 text-lg font-semibold">
                  Services for your style
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Explore grooming options that match your needs and
                  preferences.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-7 sm:mt-12">
                <Clock3 size={25} className="text-[#d6b18d]" />
                <h3 className="mt-6 text-lg font-semibold">
                  Booking made simple
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Choose an available appointment slot and keep track of your
                  bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
