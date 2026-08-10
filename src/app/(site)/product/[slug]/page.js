import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import {
  PRODUCT_BY_SLUG_QUERY,
  REVIEWS_BY_PRODUCT_QUERY,
} from "../../../../sanity/lib/queries";
import ProductBreadcrumb from "../../../../components/product/ProductBreadcrumb";
import ProductPageClient from "../../../../components/product/ProductPageClient";
import RatingBreakdown from "../../../../components/product/RatingBreakdown";
import ReviewSlider from "../../../../components/product/ReviewSlider";
import CustomerReviews from "../../../../components/product/CustomerReviews";
import ContactEmail from "../../../../components/home/ContactEmail";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await client.fetch(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 30 } }
  );

  if (!product) {
    return { title: "Product | Vari" };
  }

  const description = product.shortDescription
    ? product.shortDescription
    : `Check out ${product.name} at Vari.`;

  const image = product.colors?.[0]?.mainImage
    ? urlFor(product.colors[0].mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${product.name} | Vari`,
    description,
    alternates: {
      canonical: `/product/${slug}`,
    },
    openGraph: {
      title: product.name,
      description,
      url: `/product/${slug}`,
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const product = await client.fetch(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 30 } }
  );

  if (!product) {
    return (
      <div className="px-4 py-16 text-center text-[#666] sm:px-6">
        This product could not be found.
      </div>
    );
  }

  const reviews = await client.fetch(
    REVIEWS_BY_PRODUCT_QUERY,
    { productId: product._id },
    { next: { revalidate: 30 } }
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || undefined,
    image: product.colors?.[0]?.mainImage
      ? urlFor(product.colors[0].mainImage).width(1200).height(1200).url()
      : undefined,
    brand: { "@type": "Brand", name: "Vari" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `https://vari-next-j-swith-sanity.vercel.app/product/${slug}`, 
    },
    ...(product.rating && product.reviewsCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewsCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
        <ProductBreadcrumb product={product} category={product.category} />

        <ProductPageClient product={product} />

        <ReviewSlider reviews={reviews} />

        <div className="mx-auto max-w-4xl">
          <RatingBreakdown product={product} />
        </div>
        <div className="mx-auto max-w-7xl">
          <CustomerReviews reviews={reviews} />
        </div>
      </div>

      <ContactEmail />
    </>
  );
}