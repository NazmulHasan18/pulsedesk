import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

/** Shared RTK Query instance. Domain endpoints are added in `endpoints/`. */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery<Error>(),
  tagTypes: ["Agents", "Companies", "MyCompany", "Dashboard"],
  endpoints: () => ({}),
});

export async function runRequest<Result>(operation: Promise<Result>) {
  try {
    return { data: await operation };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error("Something went wrong") };
  }
}
