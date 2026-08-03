"use client";

import { useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

export default function ProductPageClient({ product }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const colors = product.colors || [];

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <ProductGallery
        colors={colors}
        selectedColorIndex={selectedColorIndex}
        productName={product.name}
      />

      <ProductInfo
        product={product}
        colors={colors}
        selectedColorIndex={selectedColorIndex}
        onSelectColor={setSelectedColorIndex}
      />
    </div>
  );
}