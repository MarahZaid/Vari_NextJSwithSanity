import { client } from "../../../sanity/lib/client";
import { CATEGORY_BY_SLUG_QUERY, PRODUCTS_BY_CATEGORY_QUERY } from "../../../sanity/lib/queries";
import HeroCategory from "../../../components/category/HeroCategory";
import CategoryPageClient from "../../../components/category/CategoryPageClient";
import ContactEmail from "../../../components/home/ContactEmail";

export async function generateMetadata({ searchParams }) {
  const { category: categorySlug } = await searchParams;
  if (!categorySlug) {
    return {
      title: "Products | Vari",
      description: "Browse our full range of products at Vari.",
    };
  }

  const category = await client.fetch(
    CATEGORY_BY_SLUG_QUERY,
    { slug: categorySlug },
    { next: { revalidate: 30 } }
  );

  return {
    title: category ? `${category.name} Products | Vari` : "Products | Vari",
    description: category
      ? `Browse our ${category.name} collection at Vari - quality products at great prices.`
      : "Browse our full range of products at Vari.",
  };
}

export default async function ProductsPage({ searchParams }) {
  const { category: categorySlug } = await searchParams;

  if (!categorySlug) {
    return (
      <div className="px-4 py-16 text-center text-[#666] sm:px-6">
        Choose a category from the &quot;Products&quot; menu to browse
        products.
      </div>
    );
  }

  const category = await client.fetch(
    CATEGORY_BY_SLUG_QUERY,
    { slug: categorySlug },
    { next: { revalidate: 30 } }
  );

  if (!category) {
    return (
      <div className="px-4 py-16 text-center text-[#666] sm:px-6">
       This category does not exist.
      </div>
    );
  }

  const products = await client.fetch(
    PRODUCTS_BY_CATEGORY_QUERY,
    { categoryId: category._id },
    { next: { revalidate: 30 } }
  );

  return (
    <div>
      <HeroCategory category={category} />
      <CategoryPageClient category={category} products={products} />
      <ContactEmail />
    </div>
  );
}