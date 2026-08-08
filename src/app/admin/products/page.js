import Link from "next/link";
import { client } from "../../../sanity/lib/client";
import { ALL_PRODUCTS_QUERY } from "../../../sanity/lib/queries";
import ProductsTable from "../../../components/admin/ProductsTable";

export default async function AdminProductsPage() {
  const products = await client.fetch(ALL_PRODUCTS_QUERY, {}, { cache: "no-store" });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#003349]">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-[10px] bg-[#007fad] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#00688c]"
        >
          + Add product
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}