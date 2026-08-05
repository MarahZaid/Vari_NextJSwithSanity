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
  *[_type == "product" && references($categoryId)] | order(_createdAt asc) {
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

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
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
    }
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

export const POINTS_HISTORY_BY_CUSTOMER_QUERY = defineQuery(`
  *[_type == "pointsHistoryEntry" && references($customerId)] | order(createdAt desc) {
    _id,
    amount,
    type,
    "orderId": order->_id,
    createdAt
  }
`);