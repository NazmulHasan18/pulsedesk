import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiError } from "@/lib/fetcher";
import { refreshSession } from "@/lib/session-refresh";

// Errors go into the Redux store, so they must be plain objects: an Error
// instance isn't serializable (Redux warns, and devtools can't show it).
export interface RequestError {
  message: string;
  status?: number;
}

/** Shared RTK Query instance. Domain endpoints are added in `endpoints/`. */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery<RequestError>(),
  tagTypes: ["Agents", "Companies", "MyCompany", "Dashboard", "Inbox", "Conversation"],
  endpoints: () => ({}),
});

export async function runRequest<Result>(operation: Promise<Result>) {
  try {
    return { data: await operation };
  } catch (error) {
    if (error instanceof ApiError) {
      // Expired access token: refresh the session. The new token reaches the
      // components, their query args change, and RTK Query refetches.
      if (error.status === 401) void refreshSession();
      return { error: { message: error.message, status: error.status } satisfies RequestError };
    }
    const message = error instanceof Error ? error.message : "Something went wrong";
    return { error: { message } satisfies RequestError };
  }
}
