import { client } from "../../../../sanity/lib/client";
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

  const reviews = await client.fetch(
    REVIEWS_BY_PRODUCT_QUERY,
    { productId: product._id },
    { next: { revalidate: 30 } }
  );

  return (
    <>
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