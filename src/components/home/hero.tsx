
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
    <section className="relative overflow-hidden bg-[#f5f1eb]">
      <div className="container grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:py-20">

        {/* Hero Content */}
        <div className="relative z-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#ded5c9] bg-white/70 px-4 py-2">
            <Sparkles size={14} className="text-[#a8794e]" />

            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#756b60]">
              The art of men's grooming
            </span>
          </div>

          <h1 className="max-w-[650px] text-[48px] font-medium leading-[1.08] tracking-[-2.5px] text-[#292521] sm:text-[64px] lg:text-[76px]">
            Your style.
            <br />

            <span className="font-normal italic text-[#a8794e]">
              Your statement.
            </span>

            <br />

            Own the look.
          </h1>

          <p className="mt-7 max-w-[440px] text-base leading-8 text-[#756b60]">
            From precision haircuts and sharp fades to expert beard care,
            discover grooming experiences crafted exclusively for men.
          </p>

          {/* Action Buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-[#292521] px-7 text-sm font-semibold !text-white transition-all duration-300 hover:bg-[#a8794e]"
            >
              <span className="!text-white">Explore grooming services</span>
              <ArrowRight size={17} className="shrink-0 text-white" />
            </Link>

            <Link
              href="/register"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 px-3 text-sm font-medium text-[#292521] transition-colors hover:text-[#a8794e]"
            >
              Book an appointment
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Brand Details */}
          <div className="mt-16 flex items-center gap-4 border-t border-[#ded5c9] pt-7">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#292521] text-[#d6b18d]">
              <Scissors size={19} strokeWidth={1.6} />
            </div>

            <p className="text-xs leading-5 text-[#756b60]">
              <span className="font-semibold text-[#292521]">
                More than just a haircut.
              </span>
              <br />
              It's your time to look and feel your best.
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mx-auto w-full max-w-[540px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[48%] rounded-b-[12px] bg-[#ded5c9]">
            <Image
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=85"
              alt="Professional barber providing a men's grooming service"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#292521]/20 via-transparent to-transparent" />
          </div>

          {/* Floating Information Card */}
          <div className="absolute -bottom-5 left-3 max-w-[225px] rounded-2xl border border-[#e9e1d8] bg-white p-5 shadow-xl shadow-[#292521]/10 sm:-left-10">
            <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#a8794e]">
              Your style starts here
            </p>

            <p className="mt-2 text-lg font-medium leading-snug tracking-tight text-[#292521]">
              Look sharp.
              <br />
              Feel confident.
            </p>
          </div>

          {/* Decorative Detail */}
          <div className="absolute right-4 top-8 flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/80 backdrop-blur-md">
            <ArrowDown size={20} className="text-[#a8794e]" />
          </div>
        </div>
      </div>
    </section>
  );
}
