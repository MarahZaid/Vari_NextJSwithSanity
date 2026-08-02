import { client } from "../../sanity/lib/client";
import { CATEGORIES_QUERY } from "../../sanity/lib/queries";
import CategoryCard from "../ui/CategoryCard";

export default async function CategoriesSection() {
  const categories = await client
  .fetch(CATEGORIES_QUERY, {}, { next: { revalidate: 30 } })
  .catch(() => []);

  return (
    <section className="bg-[#f0f0f0] px-4 py-16 sm:px-6">
      <h2 className="mx-auto mb-12 max-w-5xl text-center text-xl font-bold text-[#032f49] sm:text-2xl md:text-3xl lg:text-4xl">
        Height-Adjustable Standing Desks &amp; Office Furniture
      </h2>

      {categories.length === 0 && (
        <p className="text-center text-[#4f4f4f]">
          No categories available yet
        </p>
      )}

      <div className="mx-auto grid max-w-8xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <CategoryCard key={category._id} {...category} />
        ))}
      </div>
    </section>
  );
}
