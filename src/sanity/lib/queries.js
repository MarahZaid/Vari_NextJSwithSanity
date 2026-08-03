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

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    plpTitle,
    description,
    heroImage
  }
`);

export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "product" && references($categoryId)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    price,
    oldPrice,
    discountLabel,
    rating,
    reviewsCount,
    hasVideo,
    video,
    specs,
    colors[] {
      name,
      colorImg,
      mainImage,
      hoverImage,
      images
    }
  }
`);