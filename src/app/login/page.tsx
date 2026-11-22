
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Scissors,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: loginError } = await authClient.signIn.email({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message || "Unable to sign in. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const { error: googleError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "https://salonbook-mu.vercel.app/dashboard",
      });

      if (googleError) {
        setError(googleError.message || "Google sign-in failed.");
        setGoogleLoading(false);
      }
    } catch {
      setError("Unable to sign in with Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5f0]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-16 sm:px-12 lg:px-16">
          <div className="w-full max-w-[440px]">
            <Link href="/" className="mb-12 inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#292521] text-[#e9cdb9]">
                <Scissors size={21} />
              </span>
              <span className="text-xl font-semibold tracking-tight text-[#292521]">
                SalonBook
              </span>
            </Link>

            <div className="mb-9">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#a16d4e]">
                Welcome back
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#292521] sm:text-4xl">
                Good to see you again.
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#817970]">
                Sign in to manage your appointments and keep your grooming
                routine on track.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e2d9cf] bg-white px-5 py-3.5 text-sm font-medium text-[#292521] transition hover:border-[#b47a57] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.66 17.74 9.5 24 9.5Z"
                  transform="translate(0 4)"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.4-4.55H24v9.02h12.91c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.39 38.02 46.98 31.9 46.98 24.55Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
                  transform="translate(0 0)"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.45-4.88 2.3-8.17 2.3-6.26 0-11.57-4.16-13.46-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
                />
              </svg>
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e5ddd4]" />
              <span className="text-xs text-[#a39a90]">OR CONTINUE WITH EMAIL</span>
              <div className="h-px flex-1 bg-[#e5ddd4]" />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#292521]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#e2d9cf] bg-white px-4 py-3.5 text-sm text-[#292521] outline-none transition placeholder:text-[#b3aaa0] focus:border-[#a16d4e] focus:ring-2 focus:ring-[#a16d4e]/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#292521]"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#e2d9cf] bg-white px-4 py-3.5 pr-12 text-sm text-[#292521] outline-none transition placeholder:text-[#b3aaa0] focus:border-[#a16d4e] focus:ring-2 focus:ring-[#a16d4e]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#817970] transition hover:text-[#292521]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#292521] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#956044] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#817970]">
              New to SalonBook?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#956044] transition hover:text-[#292521]"
              >
                Create an account
              </Link>
            </p>

            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-[#a39a90]">
              <ShieldCheck size={15} />
              Your account is protected and secure
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-[#292521] lg:flex lg:flex-col lg:justify-between lg:p-14">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=85')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-[#292521]/55 to-[#292521]/25" />

          <div className="relative z-10 flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-[#e9cdb9]">
            <Scissors size={18} />
            THE GENTLEMAN&apos;S STANDARD
          </div>

          <div className="relative z-10 max-w-lg">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#d4a887]">
              More than a haircut
            </p>
            <h2 className="text-5xl font-semibold leading-[1.15] tracking-tight text-white xl:text-6xl">
              Make time for the way you present yourself.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/65">
              Find your barber, choose your service, and book a time that works
              for you. Your grooming routine, made simpler.
            </p>
          </div>

          <p className="relative z-10 text-xs tracking-wide text-white/40">
            SALONBOOK · YOUR STYLE, YOUR TIME
          </p>
        </section>
      </div>
    </main>
  );
}
