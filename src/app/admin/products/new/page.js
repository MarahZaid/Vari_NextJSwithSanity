import { client } from "../../../../sanity/lib/client";
import { ALL_CATEGORIES_QUERY } from "../../../../sanity/lib/queries";
import ProductForm from "../../../../components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await client.fetch(ALL_CATEGORIES_QUERY, {}, { cache: "no-store" });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-[#003349]">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}