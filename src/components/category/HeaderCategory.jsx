"use client";

import Link from "next/link";

const SORT_OPTIONS = [
  { value: "default", label: "FEATURED" },
  { value: "lowToHigh", label: "PRICE: LOW TO HIGH" },
  { value: "highToLow", label: "PRICE: HIGH TO LOW" },
  { value: "aToz", label: "A - Z" },
  { value: "zToa", label: "Z - A" },
];

export default function HeaderCategory({
  category,
  productCount,
  sortValue,
  onSortChange,
}) {
  if (!category) return null;

  return (
    <div className="flex flex-col items-start justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:px-8 lg:px-10">
      <nav className="hidden text-sm md:block" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="text-[#219fc5] hover:underline">
              Home
            </Link>
          </li>
          <li className="text-[#219fc5]">/</li>
          <li>
            <Link href="/products" className="text-[#219fc5] hover:underline">
              Products
            </Link>
          </li>
          <li className="text-[#219fc5]">/</li>
          <li className="font-bold text-[#032f49]">{category.name}</li>
        </ol>
      </nav>

      <div className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row">
        <span className="w-full text-center font-bold text-[#032f49] md:w-auto">
          {productCount} Products
        </span>

        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-14 w-full border border-black/30 bg-white px-3 text-sm md:w-[250px]"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}