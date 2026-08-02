export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

function assertValue(v, errorMessage) {
  if (v === undefined || v === "") {
    // We don't throw during build so the app can still boot before
    // a real Sanity project is connected. The client call itself
    // will fail loudly instead once someone tries to fetch data.
    console.warn(errorMessage);
    return v ?? "";
  }
  return v;
}
