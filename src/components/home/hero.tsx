
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Scissors,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#171815] text-[#f5f0e8]">
      <style>{`
        @keyframes salon-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes salon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes salon-glow {
          0%, 100% { opacity: .35; }
          50% { opacity: .7; }
        }
        .salon-hero-reveal {
          animation: salon-fade-up .9s cubic-bezier(.2,.7,.2,1) both;
        }
        .salon-hero-delay-1 { animation-delay: .15s; }
        .salon-hero-delay-2 { animation-delay: .3s; }
        .salon-hero-delay-3 { animation-delay: .45s; }
        .salon-hero-float { animation: salon-float 6s ease-in-out infinite; }
        .salon-hero-glow { animation: salon-glow 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .salon-hero-reveal, .salon-hero-float, .salon-hero-glow {
            animation: none !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute -left-48 top-20 h-[500px] w-[500px] rounded-full bg-[#a8754c]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#a8754c]/10 blur-[120px]" />

      <div className="container relative grid min-h-[690px] items-center gap-14 py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:py-24">
        <div className="relative z-10">
          <div className="salon-hero-reveal inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 backdrop-blur-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b88961]/20 text-[#d5ad86]">
              <Sparkles size={13} />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#d7c9b7]">
              The modern grooming experience
            </span>
          </div>

          <h1 className="salon-hero-reveal salon-hero-delay-1 mt-9 max-w-[700px] text-[52px] font-semibold leading-[1.04] tracking-[-3px] sm:text-[68px] lg:text-[82px]">
            A sharper look.
            <br />
            <span className="font-normal italic text-[#c39a73]">
              A stronger
            </span>
            <br />
            impression.
          </h1>

          <p className="salon-hero-reveal salon-hero-delay-2 mt-8 max-w-[470px] text-sm leading-8 text-[#b7b2a8] sm:text-base">
            Great grooming is more than a routine. Discover professional
            haircuts, beard care, and grooming experiences designed around
            your personal style.
          </p>

          <div className="salon-hero-reveal salon-hero-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="group inline-flex min-h-[56px] items-center justify-center gap-4 rounded-full bg-[#c39a73] px-7 text-sm font-semibold text-[#171815] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d4b18e] hover:shadow-[0_12px_35px_rgba(195,154,115,0.2)]"
            >
              Explore services
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/register"
              className="group inline-flex min-h-[56px] items-center gap-3 rounded-full border border-white/20 px-6 text-sm font-medium text-[#f5f0e8] transition-all duration-300 hover:border-[#c39a73] hover:bg-white/[0.06]"
            >
              Book an appointment
              <ArrowDown
                size={15}
                className="rotate-[-45deg] text-[#c39a73] transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="salon-hero-reveal salon-hero-delay-3 mt-16 flex items-center gap-4 border-t border-white/10 pt-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c39a73]/40 bg-[#c39a73]/10 text-[#c39a73]">
              <Scissors size={21} strokeWidth={1.5} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#f5f0e8]">
                More than just a haircut.
              </p>
              <p className="mt-1 text-xs text-[#96948c]">
                Your time. Your style. Your statement.
              </p>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
          <div className="salon-hero-glow pointer-events-none absolute -inset-5 rounded-[48%] bg-[#b88961]/10 blur-3xl" />

          <div className="salon-hero-reveal salon-hero-delay-2 relative">
            <div className="absolute -inset-3 rounded-t-[48%] rounded-b-[18px] border border-[#c39a73]/25" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[48%] rounded-b-[18px] bg-[#34342e]">
              <Image
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=85"
                alt="Professional barber working in a stylish grooming studio"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#171815]/90 via-transparent to-[#171815]/10" />

              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-8 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#d5ad86]">
                  The SalonBook standard
                </p>
                <p className="mt-3 max-w-[300px] text-2xl font-medium leading-tight text-white sm:text-3xl">
                  Confidence is in the details.
                </p>
              </div>
            </div>

            <div className="absolute right-0 top-10 z-10 flex h-[62px] w-[62px] items-center justify-center rounded-full border border-white/30 bg-[#171815]/60 text-[#d5ad86] shadow-xl backdrop-blur-md sm:-right-5">
              <ArrowDown size={22} />
            </div>
          </div>

          {/* Separate card: never overlaps the image or caption */}
          <div className="salon-hero-float relative z-20 ml-4 mt-6 w-[215px] rounded-2xl border border-[#e8dfd2] bg-[#f5f0e8] p-5 text-[#24251f] shadow-2xl shadow-black/20 sm:-ml-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#24251f] text-[#d5ad86]">
              <Sparkles size={17} />
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[2px] text-[#9c714d]">
              Make it personal
            </p>
            <p className="mt-2 text-lg font-semibold leading-snug">
              Look sharp.
              <br />
              Feel confident.
            </p>
          </div>

          <p className="absolute -right-4 top-1/2 hidden -translate-y-1/2 rotate-90 text-[9px] font-semibold uppercase tracking-[4px] text-white/40 xl:block">
            Grooming • Style • Confidence
          </p>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#aaa69d]">
            Designed around your style
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#c39a73]">
            Discover · Choose · Book
          </p>
        </div>
      </div>
    </section>
  );
}
