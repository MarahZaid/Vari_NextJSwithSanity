"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RatingStars from "../ui/RatingStars";
import { urlFor } from "../../sanity/lib/image";

export default function ReviewSlider({ reviews }) {
  const sliderRef = useRef(null);
  const imageReviews = reviews.filter((r) => r.image);

  if (!imageReviews.length) return null;

  function scroll(direction) {
    sliderRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <div className="border-t border-black/10 py-20">
      <h2 className="mb-8 text-center text-3xl font-bold">Customer Reviews</h2>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Previos"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:bg-[#f0f0f0]"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={sliderRef}
          className="flex gap-2 overflow-x-auto px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {imageReviews.map((review) => (
            <div
              key={review._id}
              className="group relative h-[200px] w-[200px] shrink-0 overflow-hidden rounded"
            >
              <Image
                src={urlFor(review.image).width(400).height(400).url()}
                alt={
                  review.userName
                    ? `Customer review photo by ${review.userName}`
                    : "Customer review photo"
                }
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-white/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <RatingStars rating={review.rating} size="large" />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Next"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:bg-[#f0f0f0]"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}