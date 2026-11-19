
"use client";

import { apiRequest } from "./api";

export interface UploadedImage {
  url: string;
  displayUrl: string;
}

export const uploadImage = async (
  file: File,
): Promise<UploadedImage> => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WEBP images are allowed.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size must not exceed 5 MB.");
  }

  const formData = new FormData();
  formData.append("image", file);

  return apiRequest<UploadedImage>("/api/uploads/image", {
    method: "POST",
    body: formData,
    authenticated: true,
  });
};
