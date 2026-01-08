// src/lib/api-client.ts
import { getSession } from "./session";

const BASE_URL = "http://localhost:8080/api";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  const token = session?.accessToken;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Falls der Server gar nichts zurückgibt (leerer Body)
  const contentType = response.headers.get("content-type");
  let result = null;

  if (contentType && contentType.includes("application/json")) {
    result = await response.json();
  }

  if (!response.ok) {
    // Jetzt werfen wir einen detaillierteren Fehler
    const errorMessage =
      result?.message ||
      `API Fehler: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return result; // Das ist dein ApiResponse { data: ... }
}
