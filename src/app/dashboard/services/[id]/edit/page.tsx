
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
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

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
};

type ServiceForm = {
  serviceName: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  status: "active" | "inactive";
};

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const serviceId = params.id;

  const [service, setService] = useState<Service | null>(null);

  const [form, setForm] = useState<ServiceForm>({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    duration: "",
    status: "active",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchService = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest<Service>(
        `/api/services/manage/${serviceId}`,
        { authenticated: true },
      );

      setService(data);

      setForm({
        serviceName: data.serviceName,
        category: data.category,
        description: data.description,
        price: String(data.price),
        duration: String(data.duration),
        status: data.status,
      });

      setImagePreview(data.image);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load service information.",
      );
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    void fetchService();
  }, [fetchService]);

  useEffect(() => {
    if (!imageFile) return;

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

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
    setSuccess("");

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

    setImageFile(file);
  };

  const handleRemoveNewImage = () => {
    setImageFile(null);

    const input = document.getElementById(
      "service-image",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }

    setImagePreview(service?.image ?? "");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!service) return;

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

    try {
      setSaving(true);

      let imageUrl = service.image;

      if (imageFile) {
        setSuccess("Uploading new service image...");

        const uploadedImage = await uploadImage(imageFile);
        imageUrl = uploadedImage.url;
      }

      setSuccess("Saving service changes...");

      await apiRequest<Service>(`/api/services/${serviceId}`, {
        method: "PATCH",
        authenticated: true,
        body: JSON.stringify({
          serviceName: form.serviceName.trim(),
          category: form.category,
          description: form.description.trim(),
          price,
          duration,
          image: imageUrl,
          status: form.status,
        }),
      });

      setSuccess("Service updated successfully!");

      router.push("/dashboard/services");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update service. Please try again.",
      );
      setSuccess("");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#e9e1d8] bg-[#fcfaf7] px-4 py-3 text-sm text-[#292521] outline-none transition placeholder:text-[#a69c91] focus:border-[#b47a57] focus:ring-2 focus:ring-[#b47a57]/10";

  const labelClass = "text-sm font-semibold text-[#39332d]";

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={27}
            className="mx-auto animate-spin text-[#b47a57]"
          />
          <p className="mt-3 text-sm text-[#817970]">
            Loading service information...
          </p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-[#e9e1d8] bg-white px-6 py-12 text-center">
        <AlertCircle size={30} className="mx-auto text-red-500" />
        <h1 className="mt-4 text-xl font-bold text-[#292521]">
          Service not found
        </h1>
        <p className="mt-2 text-sm text-[#817970]">
          {error || "This service may have been deleted or is unavailable."}
        </p>
        <Link
          href="/dashboard/services"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#292521] px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Back to Services
        </Link>
      </section>
    );
  }

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
          Edit Service
        </h1>

        <p className="mt-2 text-sm text-[#817970]">
          Update the information, pricing and availability of this service.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#292521]">
              Service Information
            </h2>
            <p className="mt-1 text-sm text-[#817970]">
              Modify the details customers see when browsing services.
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
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
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
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className={labelClass}>
                Service Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <p className="mt-2 text-xs text-[#817970]">
                Inactive services are hidden from customers and cannot be booked.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e9e1d8] bg-white p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#292521]">
              Service Image
            </h2>
            <p className="mt-1 text-sm text-[#817970]">
              Keep the existing image or upload a replacement.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-[#e9e1d8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview || service.image}
              alt={service.serviceName}
              className="h-64 w-full bg-[#f1ece5] object-cover"
            />

            {imageFile && (
              <button
                type="button"
                onClick={handleRemoveNewImage}
                disabled={saving}
                aria-label="Cancel image replacement"
                className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-red-600 shadow transition hover:bg-red-50 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            )}

            <div className="bg-[#fcfaf7] px-4 py-3">
              <p className="text-sm font-medium text-[#51483f]">
                {imageFile
                  ? imageFile.name
                  : "Currently saved service image"}
              </p>
              {imageFile && (
                <p className="mt-1 text-xs text-[#817970]">
                  {(
                    imageFile.size /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </p>
              )}
            </div>
          </div>

          <label
            htmlFor="service-image"
            className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#e9e1d8] px-4 py-3 text-sm font-semibold text-[#51483f] transition hover:bg-[#f8f5f0] ${
              saving ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <ImagePlus size={17} />
            Replace Image
          </label>

          <input
            id="service-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={saving}
            className="sr-only"
          />

          <p className="mt-2 text-xs text-[#817970]">
            JPG, PNG or WEBP. Maximum file size: 5 MB.
          </p>
        </div>

        {(error || success) && (
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {error ? (
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            )}
            <p>{error || success}</p>
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
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#292521] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#443a32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Upload size={17} />
                Update Service
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
