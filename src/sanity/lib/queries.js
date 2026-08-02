import { defineQuery } from "next-sanity";

export const NAV_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(orderRank asc) {
    _id,
    name,
    "slug": slug.current
  }
`);

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(orderRank asc) {
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    mainImage
  }
`);
