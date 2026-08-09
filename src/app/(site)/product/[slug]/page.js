import { Suspense } from "react";
import { client } from "../../../../sanity/lib/client";
import { PRODUCT_BY_SLUG_QUERY } from "../../../../sanity/lib/queries";
import ProductBreadcrumb from "../../../../components/product/ProductBreadcrumb";
import ProductPageClient from "../../../../components/product/ProductPageClient";
import ReviewsSection from "../../../../components/product/ReviewsSection";
import ReviewsSkeleton from "../../../../components/skeletons/ReviewsSkeleton";
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

  return {
    title: `${product.name} | Vari`,
    description: product.shortDescription
      ? product.shortDescription
      : `Check out ${product.name} at Vari.`,
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

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
        <ProductBreadcrumb product={product} category={product.category} />

        <ProductPageClient product={product} />

        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewsSection product={product} />
        </Suspense>
      </div>

      <ContactEmail />
    </>
  );
}