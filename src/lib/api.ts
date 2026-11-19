
import { getAccessToken } from "./get-access-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiOptions extends RequestInit {
  authenticated?: boolean;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> => {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const { authenticated = false, headers, ...requestOptions } = options;

  const requestHeaders = new Headers(headers);

  if (!(requestOptions.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const token = await getAccessToken();

    if (!token) {
      throw new Error("Authentication required. Please sign in again.");
    }

    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers: requestHeaders,
  });

  const result = (await response.json()) as {
    success?: boolean;
    message?: string;
    data?: T;
  };

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result.data as T;
};
