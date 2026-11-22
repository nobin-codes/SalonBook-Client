
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { uploadImage } from "@/lib/upload-image";

const categories = [
  "Haircut & Styling",
  "Beard & Shaving",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Head Massage",
  "Men's Grooming Packages",
];

type ServiceForm = {
  serviceName: string;
  category: string;
  description: string;
  price: string;
  duration: string;
};

export default function AddServicePage() {
  const router = useRouter();
  const previewUrlRef = useRef<string | null>(null);

  const [form, setForm] = useState<ServiceForm>({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    duration: "30",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressMessage, setProgressMessage] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setProgressMessage("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setImageFile(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setImageFile(null);
    setImagePreview("");

    const input = document.getElementById(
      "service-image",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setProgressMessage("");

    if (form.serviceName.trim().length < 2) {
      setError("Service name must contain at least 2 characters.");
      return;
    }

    if (!form.category) {
      setError("Please select a service category.");
      return;
    }

    if (form.description.trim().length < 10) {
      setError("Description must contain at least 10 characters.");
      return;
    }

    const price = Number(form.price);
    const duration = Number(form.duration);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid service price.");
      return;
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      setError("Please enter a valid duration in minutes.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a service image.");
      return;
    }

    try {
      setLoading(true);
      setProgressMessage("Uploading service image...");

      const uploadedImage = await uploadImage(imageFile);

      setProgressMessage("Image uploaded. Saving service...");

      await apiRequest("/api/services", {
        method: "POST",
        authenticated: true,
        body: JSON.stringify({
          serviceName: form.serviceName.trim(),
          category: form.category,
          description: form.description.trim(),
          price,
          duration,
          image: uploadedImage.url,
        }),
      });

      toast.success("Service created successfully!");

      router.push("/dashboard/services");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the service.",
      );
    } finally {
      setLoading(false);
      setProgressMessage("");
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] px-4 py-3 text-sm text-[#292521] outline-none transition placeholder:text-[#a69c91] focus:border-[#b47a57] focus:ring-2 focus:ring-[#b47a57]/10";

  const labelClass = "text-sm font-semibold text-[#39332d]";

  return (
    <section className="mx-auto max-w-4xl space-y-7">
      <div>
        <Link
          href="/dashboard/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#817970] transition hover:text-[#b47a57]"
        >
          <ArrowLeft size={16} />
          Back to Services
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#b47a57]">
          Service management
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#292521]">
          Add New Service
        </h1>

        <p className="mt-2 text-sm text-[#817970]">
          Add a men&apos;s grooming service to your SalonBook collection.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#292521]">
              Service Information
            </h2>
            <p className="mt-1 text-sm text-[#817970]">
              Provide the essential details of your service.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="serviceName" className={labelClass}>
                Service Name *
              </label>

              <input
                id="serviceName"
                name="serviceName"
                value={form.serviceName}
                onChange={handleChange}
                placeholder="e.g. Premium Haircut & Styling"
                maxLength={100}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Category *
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="" disabled>
                  Select a category
                </option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Service Description *
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what's included in this grooming service..."
                rows={5}
                maxLength={1000}
                required
                className={`${inputClass} resize-y`}
              />

              <p className="mt-1 text-right text-xs text-[#a69c91]">
                {form.description.length}/1000 characters
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className={labelClass}>
                  Price (USD) *
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-sm text-[#817970]">
                    $
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="25.00"
                    min="0.01"
                    step="0.01"
                    required
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="duration" className={labelClass}>
                  Duration (Minutes) *
                </label>

                <input
                  id="duration"
                  name="duration"
                  type="number"
                  value={form.duration}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  placeholder="30"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#292521]">
              Service Image
            </h2>
            <p className="mt-1 text-sm text-[#817970]">
              Upload a high-quality image representing this grooming service.
            </p>
          </div>

          {imagePreview ? (
            <div className="relative overflow-hidden rounded-xl border border-[#e9e1d8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Service preview"
                className="h-64 w-full object-cover"
              />

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={loading}
                aria-label="Remove selected image"
                className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-red-600 shadow transition hover:bg-red-50 disabled:opacity-50"
              >
                <X size={18} />
              </button>

              <div className="bg-[#fcfaf7] px-4 py-3">
                <p className="truncate text-sm font-medium text-[#51483f]">
                  {imageFile?.name}
                </p>
                <p className="mt-1 text-xs text-[#817970]">
                  {((imageFile?.size ?? 0) / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <label
              htmlFor="service-image"
              className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d9cbbd] bg-[#fcfaf7] px-5 text-center transition hover:border-[#b47a57] hover:bg-[#f8f5f0]"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#f0e6dc] text-[#b47a57]">
                <ImagePlus size={27} />
              </div>

              <p className="mt-4 text-sm font-semibold text-[#39332d]">
                Choose a service image
              </p>

              <p className="mt-2 text-xs text-[#817970]">
                JPG, PNG or WEBP · Maximum 5 MB
              </p>

              <span className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#e9e1d8] bg-white px-4 py-2.5 text-sm font-semibold text-[#51483f]">
                <Upload size={15} />
                Browse Files
              </span>
            </label>
          )}

          <input
            id="service-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={loading}
            className="sr-only"
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {progressMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] p-4 text-sm text-[#51483f]">
            <LoaderCircle size={18} className="shrink-0 animate-spin text-[#b47a57]" />
            <p>{progressMessage}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/services"
            className="inline-flex items-center justify-center rounded-xl border border-[#e9e1d8] px-6 py-3 text-sm font-semibold text-[#51483f] transition hover:bg-[#f8f5f0]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#292521] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#443a32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Saving Service...
              </>
            ) : (
              <>
                <Upload size={17} />
                Create Service
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
