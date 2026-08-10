import { client } from "../../../sanity/lib/client";
import { urlFor } from "../../../sanity/lib/image";
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
      alternates: { canonical: "/products" },
    };
  }

  const category = await client.fetch(
    CATEGORY_BY_SLUG_QUERY,
    { slug: categorySlug },
    { next: { revalidate: 30 } }
  );

  if (!category) {
    return {
      title: "Products | Vari",
      description: "Browse our full range of products at Vari.",
    };
  }

  const description = `Browse our ${category.name} collection at Vari - quality products at great prices.`;
  const image = category.heroImage || category.mainImage
    ? urlFor(category.heroImage || category.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${category.name} Products | Vari`,
    description,
    alternates: {
      canonical: `/products?category=${categorySlug}`,
    },
    openGraph: {
      title: `${category.name} | Vari`,
      description,
      url: `/products?category=${categorySlug}`,
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Vari`,
      description,
      images: image ? [image] : undefined,
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://vari-next-j-swith-sanity.vercel.app/product/${p.slug}`, 
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroCategory category={category} />
      <CategoryPageClient category={category} products={products} />
      <ContactEmail />
    </div>
  );
}