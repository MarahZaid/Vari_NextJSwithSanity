"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { urlFor } from "../../sanity/lib/image";

export default function ProductCard({ product }) {
  const {
    slug,
    name,
    price,
    oldPrice,
    rating = 0,
    reviewsCount = 0,
    colors,
    hasVideo,
    video,
  } = product;

  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const mainImageUrl = selectedColor.mainImage
    ? urlFor(selectedColor.mainImage).width(600).url()
    : selectedColor.images?.[0]
      ? urlFor(selectedColor.images[0]).width(600).url()
      : null;

  const hoverImageUrl = selectedColor.hoverImage
    ? urlFor(selectedColor.hoverImage).width(600).url()
    : null;

  return (
    <div className="flex h-full flex-col">
      <div className="group relative overflow-hidden">
        {hasVideo && video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="block w-full transition-opacity duration-300 group-hover:opacity-0"
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          mainImageUrl && (
            <Image
              src={mainImageUrl}
              alt={name}
              width={600}
              height={600}
              className="block w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            />
          )
        )}

        {hoverImageUrl && (
          <Image
            src={hoverImageUrl}
            alt={name}
            width={600}
            height={600}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {colors.map((color) => {
            const swatchUrl = color.colorImg
              ? urlFor(color.colorImg).width(60).height(60).url()
              : null;
            const isSelected = selectedColor.name === color.name;

            return (
              <button
                key={color.name}
                type="button"
                title={color.name}
                onClick={() => setSelectedColor(color)}
                className={`h-[34px] w-[34px] shrink-0 rounded-full bg-white p-[2px] transition-colors ${
                  isSelected
                    ? "border-[1.7px] border-[#007fad]"
                    : "border-[1.5px] border-black hover:border-[#999]"
                }`}
              >
                {swatchUrl && (
                  <Image
                    src={swatchUrl}
                    alt={color.name}
                    width={28}
                    height={28}
                    className="h-full w-full rounded-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>

        <h3 className="mb-3 font-semibold text-[#111]">{name}</h3>

        <div className="mb-2 flex items-center gap-3">
          {oldPrice && (
            <span className="text-[#666] line-through">${oldPrice}</span>
          )}
          <span className="font-semibold text-[#1f8a3d]">${price}</span>
        </div>

        <div className="mb-4 flex items-center gap-1.5">
          <div className="flex text-[#ffc107]">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={16}
                fill={i <= Math.round(rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-sm text-[#555]">({reviewsCount} Reviews)</span>
        </div>

        <Link
          href={`/product/${slug}`}
          className="mt-auto border-2 border-[#003349] bg-white py-2.5 text-center text-sm font-bold uppercase text-[#003349] transition-colors hover:border-[#007fad] hover:text-[#007fad]"
        >
          Select Options
        </Link>
      </div>
    </div>
  );
}