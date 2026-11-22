
"use client";

import { useState, type FormEvent } from "react";
import { Camera, Loader2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const session = useSession();
  const user = session.data?.user;

  if (session.isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#9A6849]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-[#E9DFD5] bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-[#30251F]">
          Please sign in
        </h1>
        <p className="mt-2 text-sm text-[#85776D]">
          Sign in to view and update your profile.
        </p>
      </div>
    );
  }

  return (
    <ProfileForm
      key={user.id}
      user={user}
      refetchSession={session.refetch}
    />
  );
}

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
    phone?: string;
  };
  refetchSession: () => Promise<unknown>;
}

function ProfileForm({ user, refetchSession }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (image.trim()) {
      try {
        new URL(image.trim());
      } catch {
        setError("Please enter a valid profile image URL.");
        return;
      }
    }

    setIsSaving(true);

    try {
      const profileData = {
        name: name.trim(),
        image: image.trim() || null,
        phone: phone.trim(),
      };

      const result = await authClient.updateUser(profileData);

      if (result.error) {
        throw new Error(result.error.message || "Failed to update profile.");
      }

      await refetchSession();

      toast.success("Your profile has been updated successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="space-y-7">
      <div>
        <p className="text-sm font-medium text-[#A0785D]">
          ACCOUNT SETTINGS
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#30251F] sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-[#85776D]">
          Manage your personal information and profile details.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E9DFD5] bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-8 flex flex-col items-center gap-4 border-b border-[#F0E9E2] pb-7 sm:flex-row">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#F3EAE2] text-2xl font-semibold text-[#986B4F]">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              initials || <UserRound size={32} />
            )}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold text-[#30251F]">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-[#85776D]">{user.email}</p>
            <span className="mt-2 inline-block rounded-full bg-[#F5EEE8] px-3 py-1 text-xs font-medium capitalize text-[#91684D]">
              {user.role ?? "Customer"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#30251F]">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-[#85776D]">
              Update the information associated with your account.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-[#493B32]">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-xl border border-[#E7DDD3] bg-[#FFFEFC] px-4 py-3 text-sm text-[#30251F] outline-none transition focus:border-[#A47758] focus:ring-2 focus:ring-[#A47758]/10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#493B32]">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-[#E7DDD3] bg-[#F7F4F0] px-4 py-3 text-sm text-[#91847B]"
            />
            <p className="text-xs text-[#9A8D83]">
              Your registered email address cannot be changed here.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-[#493B32]">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter your phone number"
              className="w-full rounded-xl border border-[#E7DDD3] bg-[#FFFEFC] px-4 py-3 text-sm text-[#30251F] outline-none transition focus:border-[#A47758] focus:ring-2 focus:ring-[#A47758]/10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="image"
              className="flex items-center gap-2 text-sm font-medium text-[#493B32]"
            >
              <Camera size={16} />
              Profile Image URL
            </label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://example.com/profile.jpg"
              className="w-full rounded-xl border border-[#E7DDD3] bg-[#FFFEFC] px-4 py-3 text-sm text-[#30251F] outline-none transition focus:border-[#A47758] focus:ring-2 focus:ring-[#A47758]/10"
            />
            <p className="text-xs text-[#9A8D83]">
              Enter a publicly accessible image URL.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end border-t border-[#F0E9E2] pt-5">
            <button
              type="submit"
              disabled={isSaving}
              className="flex min-w-36 items-center justify-center gap-2 rounded-xl bg-[#946748] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#795238] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <Loader2 size={17} className="animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
