import Link from "next/link";

export default function ProductBreadcrumb({ product, category }) {
  if (!product) return null;

  return (
    <nav className="mb-6 text-sm" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="text-[#219fc5] hover:underline">
            Home
          </Link>
        </li>
       
        

        {category && (
          <>
            <li className="text-[#219fc5]">/</li>
            <li>
              <Link
                href={`/products?category=${category.slug}`}
                className="text-[#219fc5] hover:underline"
              >
                {category.name || category.plpTitle}
              </Link>
            </li>
          </>
        )}

        <li className="text-[#219fc5]">/</li>
        <li className="font-semibold text-[#032f49]">{product.name}</li>
      </ol>
    </nav>
  );
}