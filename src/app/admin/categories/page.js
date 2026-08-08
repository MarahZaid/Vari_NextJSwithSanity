import { client } from "../../../sanity/lib/client";
import { ALL_CATEGORIES_QUERY } from "../../../sanity/lib/queries";
import CategoriesManager from "../../../components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await client.fetch(ALL_CATEGORIES_QUERY, {}, { cache: "no-store" });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-[#003349]">Categories</h1>
      <CategoriesManager categories={categories} />
    </div>
  );
}