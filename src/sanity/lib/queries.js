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
  *[_type == "product" && category._ref == $categoryId] | order(_createdAt asc) {
    _id,
    name,
    "slug": slug.current,
    price,
    "discountPercentage": category->discountPercentage,
    "finalPrice": select(
      category->discountPercentage > 0 => round(price - (price * category->discountPercentage / 100), 2),
      price
    ),
    rating,
    reviewsCount,
    hasVideo,
    video,
    colors,
    specs
  }
`);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    price,
    oldPrice,
    discountLabel,
    hasVideo,
    video,
    rating,
    reviewsCount,
    reviewsBreakdown,
    specs,
    details,
    colors[] {
      name,
      colorImg,
      mainImage,
      hoverImage,
      images
    },
    "category": category-> {
      _id,
      name,
      plpTitle,
      "slug": slug.current
    },
    "discountPercentage": category->discountPercentage,
"finalPrice": select(
  category->discountPercentage > 0 => round(price - (price * category->discountPercentage / 100), 2),
  price
),
  }
`);

export const REVIEWS_BY_PRODUCT_QUERY = defineQuery(`
  *[_type == "review" && references($productId)] | order(createdAt desc) {
    _id,
    userName,
    rating,
    title,
    comment,
    image,
    verified,
    createdAt
  }
`);

export const CUSTOMER_BY_EMAIL_QUERY = defineQuery(`
  *[_type == "customer" && email == $email][0] {
    _id,
    name,
    email,
    passwordHash,
    isAdmin,
    points
  }
`);

export const CUSTOMER_BY_ID_QUERY = defineQuery(`
  *[_type == "customer" && _id == $id][0] {
    _id,
    name,
    email,
    phone,
    address,
    points
  }
`);

export const ORDERS_BY_EMAIL_QUERY = defineQuery(`
  *[_type == "order" && customerEmail == $email] | order(createdAt desc) {
    _id,
    customerName,
    customerEmail,
    items,
    status,
    subtotal,
    shippingFee,
    pointsRedeemed,
    pointsDiscount,
    totalAmount,
    paymentMethod,
    shippingAddress,
    createdAt
  }
`);
export const ORDER_BY_ID_QUERY = defineQuery(`
  *[_type == "order" && _id == $id][0]{
    ...,
    "items": items[]{..., "product": product->{_id, "slug": slug.current}}
  }
`);

export const POINTS_HISTORY_BY_CUSTOMER_QUERY = defineQuery(`
  *[_type == "pointsHistoryEntry" && references($customerId)] | order(createdAt desc) {
    _id,
    amount,
    type,
    "orderId": order->_id,
    createdAt
  }
`);

// ---- Admin queries ----

export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    oldPrice,
    stock,
    "category": category->{_id, name},
    "mainImage": colors[0].mainImage
  }
`);

export const PRODUCT_BY_ID_QUERY = defineQuery(`
  *[_type == "product" && _id == $id][0]{
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    price,
    oldPrice,
    discountLabel,
    stock,
    "category": category->{_id, name}
  }
`);

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(orderRank asc) {
    _id,
    name,
    plpTitle,
    "slug": slug.current,
    shortDescription,
    description,
    mainImage,
    discountPercentage,
    orderRank
  }
`);

export const ALL_ORDERS_QUERY = defineQuery(`
  *[_type == "order"] | order(createdAt desc) {
    _id,
    customerName,
    customerEmail,
    items,
    status,
    subtotal,
    shippingFee,
    pointsDiscount,
    totalAmount,
    paymentMethod,
    shippingAddress,
    createdAt
  }
`);

export const ALL_CUSTOMERS_QUERY = defineQuery(`
  *[_type == "customer"] | order(createdAt desc) {
    _id,
    name,
    email,
    phone,
    points,
    isAdmin,
    createdAt
  }
`);

export const SEARCH_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && name match $term] | order(name asc) {
    _id,
    name,
    "slug": slug.current
  }
`);

export const SEARCH_PREVIEW_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && name match $term] | order(name asc) [0...5] {
    _id,
    name,
    "slug": slug.current,
    price,
    "image": colors[0].mainImage
  }
`);

export const SEARCH_PREVIEW_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && name match $term] | order(name asc) [0...4] {
    _id,
    name,
    "slug": slug.current
  }
`);

export const SEARCH_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && (name match $term || shortDescription match $term)] | order(name asc) {
    _id, name, "slug": slug.current, price, oldPrice, rating, reviewsCount, hasVideo, video, colors
  }
`);