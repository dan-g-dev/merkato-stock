// ================================================================
// Small fetch wrapper for talking to the Express API. Every dashboard
// page goes through `apiRequest` so auth headers and error handling
// live in exactly one place.
// ================================================================

const TOKEN_STORAGE_KEY = "merkatoStock.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`/api${path}`, { ...options, headers });

  if (response.status === 204) return undefined as T;

  const isCsv = response.headers.get("content-type")?.includes("text/csv");
  if (isCsv) return (await response.text()) as unknown as T;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message || "Something went wrong. Please try again.", response.status);
  }
  return data as T;
}

export const api = {
  get: <T = any>(path: string) => apiRequest<T>(path),
  post: <T = any>(path: string, body?: unknown) => apiRequest<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T = any>(path: string, body?: unknown) => apiRequest<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T = any>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};

// Triggers a browser download for a CSV response fetched via api.get().
export function downloadCsv(csvText: string, filename: string) {
  const blob = new Blob([csvText], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
