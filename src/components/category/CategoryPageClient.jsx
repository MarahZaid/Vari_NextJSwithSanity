"use client";

import { useMemo, useState } from "react";
import HeaderCategory from "./HeaderCategory";
import FiltersSidebar from "./FiltersSidebar";
import MobileFilters from "./MobileFilters";
import ProductsGrid from "./ProductsGrid";

const emptyFilters = {
  finish: [],
  warranty: [],
  price: [],
  certifications: [],
  depth: [],
};

function matchesFilters(product, filters) {
  const specs = product.specs || {};

  if (
    filters.finish.length > 0 &&
    !specs.finish?.some((f) => filters.finish.includes(f))
  ) {
    return false;
  }

  if (filters.warranty.length > 0 && !filters.warranty.includes(specs.warranty)) {
    return false;
  }

  if (
    filters.certifications.length > 0 &&
    !specs.certifications?.some((c) => filters.certifications.includes(c))
  ) {
    return false;
  }

  if (filters.depth.length > 0 && !filters.depth.includes(specs.desktopDepth)) {
    return false;
  }

  if (filters.price.length > 0) {
    const inRange = filters.price.some((range) => {
      const [min, max] = range.split("-").map(Number);
      return product.price >= min && product.price <= max;
    });
    if (!inRange) return false;
  }

  return true;
}

function sortProducts(products, sortValue) {
  const sorted = [...products];
  switch (sortValue) {
    case "lowToHigh":
      return sorted.sort((a, b) => a.price - b.price);
    case "highToLow":
      return sorted.sort((a, b) => b.price - a.price);
    case "aToz":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "zToa":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}

export default function CategoryPageClient({ category, products }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [sortValue, setSortValue] = useState("default");

  function handleToggleFilter(filterType, value) {
    setFilters((prev) => {
      const current = prev[filterType];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterType]: next };
    });
  }

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((p) => matchesFilters(p, filters));
    return sortProducts(filtered, sortValue);
  }, [products, filters, sortValue]);

  return (
    <>
      <HeaderCategory
        category={category}
        productCount={visibleProducts.length}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />

      <div className="mx-auto max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-10">
        <MobileFilters filters={filters} onToggle={handleToggleFilter} />

        <div className="flex gap-6">
          <FiltersSidebar filters={filters} onToggle={handleToggleFilter} />
          <div className="flex-1">
            <ProductsGrid products={visibleProducts} />
          </div>
        </div>
      </div>
    </>
  );
}