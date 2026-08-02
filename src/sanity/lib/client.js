import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // "published" data is cached on Sanity's CDN — fast, but can lag a
  // few seconds after an edit in the Studio. Turn it off in dev so we
  // always see fresh content while we're building.
  useCdn: process.env.NODE_ENV === "production",
});
