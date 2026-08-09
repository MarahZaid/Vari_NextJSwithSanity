import { client } from "../../sanity/lib/client";
import { PRODUCTS_BY_CATEGORY_QUERY } from "../../sanity/lib/queries";
import CategoryPageClient from "./CategoryPageClient";

export default async function ProductsSection({ category }) {
  const products = await client.fetch(
    PRODUCTS_BY_CATEGORY_QUERY,
    { categoryId: category._id },
    { next: { revalidate: 30 } }
  );

  return <CategoryPageClient category={category} products={products} />;
}