import { client } from "../../sanity/lib/client";
import { REVIEWS_BY_PRODUCT_QUERY } from "../../sanity/lib/queries";
import ReviewSlider from "./ReviewSlider";
import RatingBreakdown from "./RatingBreakdown";
import CustomerReviews from "./CustomerReviews";

export default async function ReviewsSection({ product }) {
  const reviews = await client.fetch(
    REVIEWS_BY_PRODUCT_QUERY,
    { productId: product._id },
    { next: { revalidate: 30 } }
  );

  return (
    <>
      <ReviewSlider reviews={reviews} />

      <div className="mx-auto max-w-4xl">
        <RatingBreakdown product={product} />
      </div>
      <div className="mx-auto max-w-7xl">
        <CustomerReviews reviews={reviews} />
      </div>
    </>
  );
}