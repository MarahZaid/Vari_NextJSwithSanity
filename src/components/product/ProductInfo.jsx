"use client";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Heart, ChevronDown, ChevronUp } from "lucide-react";
import RatingStars from "../ui/RatingStars";
import { urlFor } from "../../sanity/lib/image";
import { useSession } from "next-auth/react";

function AccordionItem({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-t border-black/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left font-semibold text-[#111]"
      >
        {title}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && <div className="pb-4 text-sm text-[#444]">{children}</div>}
    </div>
  );
}

export default function ProductInfo({
  product,
  colors,
  selectedColorIndex,
  onSelectColor,
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { data: session, status: sessionStatus } = useSession();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openSections, setOpenSections] = useState({ details: true });

  function toggleSection(key) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const details = product.details || {};
  const specs = product.specs || {};
  const warrantyTitle = specs.warranty
    ? `${specs.warranty.toUpperCase()} WARRANTY`
    : "WARRANTY";

  async function handleAddToCart() {
    if (sessionStatus !== "authenticated") {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setAdding(true);

    const selectedColor = colors[selectedColorIndex];
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: (() => {
        const src = selectedColor?.mainImage || selectedColor?.images?.[0];
        return src ? urlFor(src).width(200).url() : null;
      })(),
      color: selectedColor?.name || "Default",
      stock: product.stock,
    });

    await new Promise((resolve) => setTimeout(resolve, 400));
    setAdding(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  }

  return (
    <div className="relative">
      <h1 className="mb-1 text-2xl font-bold sm:text-3xl">{product.name}</h1>

      <p className="mb-3 text-[#666]">{product.shortDescription}</p>

      <div className="mb-4 flex items-center gap-2">
        <RatingStars rating={product.rating} size="medium" />
        <span className="text-sm text-[#555]">
          ({product.reviewsCount || 0} Reviews)
        </span>
      </div>

      <div className="mb-1 flex items-center gap-3">
        <span className="text-2xl font-bold text-[#003b57]">
          ${Number(product.finalPrice ?? product.price).toFixed(2)}
        </span>

        {product.discountPercentage > 0 && (
          <span className="text-[#777] line-through">
            ${Number(product.price).toFixed(2)}
          </span>
        )}
      </div>

      {product.discountPercentage > 0 && (
        <p className="mb-4 font-semibold text-[#1f8a3d]">
          Save {product.discountPercentage}% on this category
        </p>
      )}

      {colors.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 font-semibold">
            Color: {colors[selectedColorIndex]?.name}
          </p>

          <div className="flex flex-wrap gap-3">
            {colors.map((color, index) => {
              const swatchUrl = color.colorImg
                ? urlFor(color.colorImg).width(60).height(60).url()
                : null;
              return (
                <button
                  key={color.name}
                  type="button"
                  title={color.name}
                  onClick={() => onSelectColor(index)}
                  className={`flex h-[42px] w-[42px] items-center justify-center rounded-full border transition-colors ${index === selectedColorIndex ? "border-[#009fe3]" : "border-black"
                    }`}
                >
                  {swatchUrl && (
                    <Image
                      src={swatchUrl}
                      alt={color.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex border border-[#ccc]">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <div className="flex h-11 w-12 items-center justify-center border-x border-[#ccc]">
            {quantity}
          </div>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className="h-11 min-w-[200px] flex-1 bg-[#003b57] font-semibold text-white transition-colors hover:bg-[#007fad] disabled:opacity-70"
        >
          {adding ? "ADDING..." : "ADD TO CART"}
        </button>

        <button
          type="button"
          className="flex items-center gap-2 font-semibold text-[#003b57] hover:underline"
        >
          <Heart size={18} />
          ADD TO LIST
        </button>
      </div>

      <div>
        <AccordionItem
          title="Product Details"
          isOpen={!!openSections.details}
          onToggle={() => toggleSection("details")}
        >
          {details.quote && (
            <p className="mb-2 italic">
              &quot;{details.quote}&quot;{" "}
              <strong>- {details.quoteSource || ""}</strong>
            </p>
          )}
          <ul className="list-disc space-y-1 pl-5">
            {(details.bullets || []).map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </AccordionItem>

        <AccordionItem
          title="Extras In The Box"
          isOpen={!!openSections.extras}
          onToggle={() => toggleSection("extras")}
        >
          {details.extrasInBox || "No extras are included with this product."}
        </AccordionItem>

        <AccordionItem
          title="Shipping"
          isOpen={!!openSections.shipping}
          onToggle={() => toggleSection("shipping")}
        >
          {details.shipping || "Standard shipping rates apply."}
        </AccordionItem>

        <AccordionItem
          title="Quality Certifications"
          isOpen={!!openSections.certifications}
          onToggle={() => toggleSection("certifications")}
        >
          {details.certificationsText || (specs.certifications || []).join(", ")}
        </AccordionItem>

        <AccordionItem
          title={warrantyTitle}
          isOpen={!!openSections.warranty}
          onToggle={() => toggleSection("warranty")}
        >
          {details.warrantyText || ""}
        </AccordionItem>
      </div>

      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded bg-[#003b57] px-5 py-3 text-sm font-medium text-white shadow-lg">
          {product.name} added to cart
        </div>
      )}
    </div>
  );
}