export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

type FetchOptions = RequestInit & {
  token?: string;
};

// Carries the HTTP status, so callers can tell "token expired" (401) from
// other failures. Still an Error, so `err instanceof Error` keeps working.
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new ApiError(error?.message || "Something went wrong", response.status);
  }

  return response.json();
}
