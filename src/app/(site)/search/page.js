import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { client } from "../../../sanity/lib/client";
import { SEARCH_PRODUCTS_QUERY, SEARCH_CATEGORIES_QUERY } from "../../../sanity/lib/queries";
import ProductsGrid from "../../../components/category/ProductsGrid";

const STATIC_PAGES = [
  { title: "Home", path: "/", keywords: ["home", "homepage", "main"] },
  { title: "All Products", path: "/products", keywords: ["products", "shop", "catalog"] },
  { title: "My Account", path: "/account", keywords: ["account", "profile"] },
  { title: "Shopping Cart", path: "/cart", keywords: ["cart", "bag", "basket"] },
  { title: "Checkout", path: "/checkout", keywords: ["checkout", "payment"] },
  { title: "Login", path: "/login", keywords: ["login", "sign in", "signin"] },
];

function matchingPages(term) {
  const lower = term.toLowerCase();
  return STATIC_PAGES.filter((page) => {
    const title = page.title.toLowerCase();
    const titleWords = title.split(" ");

    const matchesTitle = title.includes(lower) || titleWords.some((w) => w.includes(lower));
    const matchesKeyword = page.keywords.some(
      (k) => k.includes(lower) || lower.includes(k)
    );

    return matchesTitle || matchesKeyword;
  });
}

export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  return { title: q ? `"${q}" | Search Results | Vari` : "Search | Vari" };
}

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const term = (q || "").trim();

  if (!term) {
    return (
      <div className="px-4 py-16 text-center text-[#6b7c84] sm:px-6">
        Type something in the search bar to find products.
      </div>
    );
  }

  const [products, categories] = await Promise.all([
    client.fetch(SEARCH_PRODUCTS_QUERY, { term: `${term}*` }, { cache: "no-store" }),
    client.fetch(SEARCH_CATEGORIES_QUERY, { term: `${term}*` }, { cache: "no-store" }),
  ]);

  const pages = matchingPages(term);
  const noResults = products.length === 0 && categories.length === 0 && pages.length === 0;
  const hasSidebar = categories.length > 0 || pages.length > 0;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-[#003349]">Search Results</h1>
      <p className="mb-6 text-[#6b7c84]">for: &quot;{term}&quot;</p>

      {noResults && (
        <p className="py-8 text-[#6b7c84]">No matching results found. Try a different search term.</p>
      )}

      {!noResults && (
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* Products */}
          {products.length > 0 && (
            <div className={hasSidebar ? "w-full lg:flex-[2]" : "w-full"}>
              <h2 className="mb-4 text-lg font-semibold text-[#003349]">
                Products ({products.length})
              </h2>
              <ProductsGrid products={products} />
            </div>
          )}

          {/* Sidebar */}
          {hasSidebar && (
            <aside className="w-full shrink-0 rounded-2xl border border-black/[0.08] bg-white p-5 lg:w-[300px]">
              {categories.length > 0 && (
                <div className={pages.length > 0 ? "mb-6" : ""}>
                  <h2 className="mb-2 text-lg font-semibold text-[#003349]">
                    Categories ({categories.length})
                  </h2>
                  <div>
                    {categories.map((cat, idx) => (
                      <Link
                        key={cat._id}
                        href={`/products?category=${cat.slug}`}
                        className={`flex items-center justify-between rounded-lg px-1 py-2.5 text-[0.9rem] font-medium text-[#003349] hover:bg-[#007fad]/[0.06] ${
                          idx < categories.length - 1 ? "border-b border-black/[0.06]" : ""
                        }`}
                      >
                        {cat.name}
                        <ChevronRight size={17} className="text-[#c8d2d6]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {pages.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-semibold text-[#003349]">
                    Pages ({pages.length})
                  </h2>
                  <div>
                    {pages.map((page, idx) => (
                      <Link
                        key={page.path}
                        href={page.path}
                        className={`flex items-center justify-between rounded-lg px-1 py-2.5 text-[0.9rem] font-medium text-[#003349] hover:bg-[#007fad]/[0.06] ${
                          idx < pages.length - 1 ? "border-b border-black/[0.06]" : ""
                        }`}
                      >
                        {page.title}
                        <ChevronRight size={17} className="text-[#c8d2d6]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      )}
    </div>
  );
}