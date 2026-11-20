
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import {
  ArrowRight,
  Clock3,
  Scissors,
  Sparkles,
  CalendarDays,
  MoveUpRight,
} from "lucide-react";
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
    <main className="overflow-hidden bg-[#f5f1e9] text-[#24241f]">
      <style>{`
        @keyframes salon-reveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .salon-reveal {
          animation: salon-reveal .7s cubic-bezier(.2,.7,.2,1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .salon-reveal {
            animation: none !important;
          }
        }
      `}</style>

      <Hero />

      {/* Featured services */}
      <section className="relative bg-[#f5f1e9] py-24 sm:py-32">
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#c39a73]/10 blur-[110px]" />

        <div className="container relative">
          <div className="mb-14 flex flex-col justify-between gap-8 lg:mb-16 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-9 bg-[#a8794e]" />
                <p className="text-[10px] font-bold uppercase tracking-[3px] text-[#a8794e]">
                  Curated for you
                </p>
              </div>

              <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-2px] sm:text-5xl lg:text-[64px]">
                Good grooming.
                <br />
                <span className="font-normal italic text-[#a8794e]">
                  Great feeling.
                </span>
              </h2>
            </div>

            <div className="flex max-w-sm flex-col items-start gap-5">
              <p className="text-sm leading-7 text-[#77746c]">
                The right details make all the difference. Explore
                professional grooming services and find what works for your
                style.
              </p>

              <Link
                href="/services"
                className="group inline-flex items-center gap-3 border-b border-[#b88961] pb-2 text-sm font-semibold transition-colors hover:text-[#a8794e]"
              >
                Explore all services
                <MoveUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </div>

          {services.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
              {services.slice(0, 6).map((service, index) => {
                const isFeatured = index === 0;

                return (
                  <article
                    key={service._id}
                    style={{ animationDelay: `${index * 90}ms` }}
                    className={`salon-reveal group self-start ${
                      isFeatured ? "lg:col-span-7" : "lg:col-span-5"
                    }`}
                  >
                    <Link
                      href={`/services/${service._id}`}
                      className="relative block overflow-hidden rounded-[24px] border border-[#e3dbcf] bg-[#fffdf9] transition-all duration-500 hover:-translate-y-1 hover:border-[#c39a73]/70 hover:shadow-[0_24px_55px_rgba(40,35,27,0.10)]"
                    >
                      <div
                        className={`relative overflow-hidden bg-[#ded6c9] ${
                          isFeatured
                            ? "aspect-[4/3] lg:aspect-[1.12/1]"
                            : "aspect-[4/3]"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service.image}
                          alt={service.serviceName}
                          loading={index < 2 ? "eager" : "lazy"}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#171815]/85 via-[#171815]/10 to-transparent" />

                        <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-[#171815]/45 px-4 py-2 text-[9px] font-semibold uppercase tracking-[1.8px] text-white backdrop-blur-md">
                          {service.category}
                        </span>

                        <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#c39a73] group-hover:text-[#171815]">
                          <ArrowRight size={17} />
                        </span>

                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                          {isFeatured && (
                            <p className="mb-3 text-[9px] font-bold uppercase tracking-[2.5px] text-[#e0bd98]">
                              Editor&apos;s pick
                            </p>
                          )}

                          <h3
                            className={`max-w-lg font-semibold leading-tight text-white ${
                              isFeatured
                                ? "text-3xl sm:text-4xl lg:text-[42px]"
                                : "text-2xl"
                            }`}
                          >
                            {service.serviceName}
                          </h3>

                          <p className="mt-3 max-w-md line-clamp-2 text-sm leading-6 text-white/75">
                            {service.description}
                          </p>

                          <div className="mt-6 flex items-center justify-between border-t border-white/25 pt-5">
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-[1.8px] text-white/60">
                                Service price
                              </p>
                              <p className="mt-1 text-xl font-semibold text-white">
                                ${service.price.toFixed(2)}
                              </p>
                            </div>

                            <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-medium text-white backdrop-blur-sm">
                              <Clock3 size={14} className="text-[#e0bd98]" />
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[24px] border border-[#e3dbcf] bg-[#fffdf9] px-6 py-20 text-center">
              <Scissors className="mx-auto text-[#a8794e]" size={34} />
              <h3 className="mt-5 text-2xl font-semibold">
                Something good is on its way.
              </h3>
              <p className="mt-3 text-sm text-[#77746c]">
                Our grooming services will be available here soon.
              </p>
            </div>
          )}

          {services.length > 0 && (
            <div className="mt-10 flex justify-center">
              <Link
                href="/services"
                className="group inline-flex min-h-[52px] items-center gap-4 rounded-full border border-[#d8cbbb] px-7 text-sm font-semibold transition-all duration-300 hover:border-[#292a25] hover:bg-[#292a25] hover:text-white"
              >
                Discover every service
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="relative overflow-hidden border-y border-[#e2d9cc] bg-[#ebe5da] py-24 sm:py-28">
          <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-white/60 blur-[110px]" />

          <div className="container relative">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-9 bg-[#a8794e]" />
                  <p className="text-[10px] font-bold uppercase tracking-[3px] text-[#a8794e]">
                    Find your signature
                  </p>
                </div>

                <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-1.7px] sm:text-5xl">
                  Your style.
                  <br />
                  <span className="font-normal italic text-[#a8794e]">
                    Your rules.
                  </span>
                </h2>
              </div>

              <p className="max-w-md text-sm leading-8 text-[#77746c] lg:justify-self-end">
                From everyday essentials to a fresh new look, explore our
                service categories and find the right fit for your routine.
              </p>
            </div>

            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(([category, count], index) => (
                <Link
                  key={category}
                  href="/services"
                  style={{ animationDelay: `${index * 70}ms` }}
                  className="salon-reveal group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-2xl border border-[#d9d0c2] bg-[#f7f3ec]/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#a8794e] hover:bg-[#fffdf9] hover:shadow-[0_16px_35px_rgba(40,35,27,0.07)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium tabular-nums text-[#a8794e]">
                      0{index + 1}
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-[#a8794e] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-[#292a25]">
                      {category}
                    </h3>
                    <p className="mt-2 text-xs text-[#858075]">
                      {count} {count === 1 ? "service" : "services"} available
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand experience */}
      <section className="relative overflow-hidden bg-[#191a17] py-24 text-[#f5f0e8] sm:py-32">
        <div className="pointer-events-none absolute -right-48 -top-48 h-[560px] w-[560px] rounded-full border border-white/[0.07]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full border border-white/[0.07]" />
        <div className="pointer-events-none absolute -left-48 bottom-0 h-[500px] w-[500px] rounded-full bg-[#a8794e]/10 blur-[130px]" />

        <div className="container relative">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-24">
            <div>
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-[#c39a73]/40 text-[#d5ad86]">
                <Sparkles size={21} strokeWidth={1.5} />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[3px] text-[#c39a73]">
                More than a haircut
              </p>

              <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.12] tracking-[-1.7px] sm:text-5xl lg:text-[62px]">
                Look sharp.
                <br />
                <span className="font-normal italic text-[#c39a73]">
                  Feel like yourself.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-sm leading-8 text-[#aaa99f]">
                Good grooming starts with making time for yourself. Find a
                service that suits you, choose your appointment, and leave
                the rest to SalonBook.
              </p>

              <Link
                href="/services"
                className="group mt-9 inline-flex min-h-[54px] items-center gap-5 rounded-full bg-[#c39a73] px-7 text-sm font-semibold text-[#191a17] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d5b18b]"
              >
                Find your service
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[30px] border border-white/[0.07]" />

              <div className="relative divide-y divide-white/10 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035]">
                <div className="flex gap-6 p-7 sm:p-9">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c39a73]/10 text-[#d5ad86]">
                    <Scissors size={21} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#c39a73]">
                      01 / Find your style
                    </p>
                    <h3 className="mt-3 text-xl font-semibold">
                      Services that fit you.
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#aaa99f]">
                      Explore grooming options and choose what suits your
                      style and preferences.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 p-7 sm:p-9">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c39a73]/10 text-[#d5ad86]">
                    <CalendarDays size={21} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#c39a73]">
                      02 / Make it yours
                    </p>
                    <h3 className="mt-3 text-xl font-semibold">
                      A time that works.
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#aaa99f]">
                      Select an available appointment slot and send your
                      booking request in a few simple steps.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-5 p-7 sm:p-9">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#c39a73]">
                      Your grooming journey
                    </p>
                    <p className="mt-2 text-sm text-[#aaa99f]">
                      Starts with one good decision.
                    </p>
                  </div>
                  <Link
                    href="/services"
                    aria-label="Explore SalonBook services"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c39a73]/50 text-[#d5ad86] transition-all hover:bg-[#c39a73] hover:text-[#191a17]"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
            <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#96948c]">
              SalonBook · Men&apos;s grooming studio
            </p>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-xs font-semibold text-[#c39a73] transition-colors hover:text-[#e0bd98]"
            >
              Discover your next look
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
