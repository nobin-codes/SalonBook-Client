
"use client";

import { authClient } from "./auth-client";

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      console.error("Failed to retrieve access token:", error);
      return null;
    }

    return data.token;
  } catch (error) {
    console.error("Access token error:", error);
    return null;
  }
};
