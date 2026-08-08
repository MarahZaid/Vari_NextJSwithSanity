import { notFound } from "next/navigation";
import { client } from "../../../../sanity/lib/client";
import { PRODUCT_BY_ID_QUERY, ALL_CATEGORIES_QUERY } from "../../../../sanity/lib/queries";
import ProductForm from "../../../../components/admin/ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    client.fetch(PRODUCT_BY_ID_QUERY, { id }, { cache: "no-store" }),
    client.fetch(ALL_CATEGORIES_QUERY, {}, { cache: "no-store" }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-[#003349]">Edit product</h1>
      <ProductForm categories={categories} initialData={product} productId={id} />
    </div>
  );
}