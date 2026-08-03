"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import RatingStars from "../ui/RatingStars";
import { urlFor } from "../../sanity/lib/image";

const REVIEWS_PER_PAGE = 3;

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

export default function CustomerReviews({ reviews }) {
  const [page, setPage] = useState(1);

  if (!reviews.length) {
    return <p className="py-8 text-[#666]">No reviews yet for this product.</p>;
  }

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const start = (page - 1) * REVIEWS_PER_PAGE;
  const pageReviews = reviews.slice(start, start + REVIEWS_PER_PAGE);

  function handlePageChange(value) {
    setPage(value);
    document
      .querySelector("#customersSay")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div id="customersSay" className="py-8">
      <h2 className="mb-4 text-xl font-bold">Customers say</h2>

      {pageReviews.map((review) => (
        <div
          key={review._id}
          className="grid grid-cols-1 gap-6 border-t border-black/10 py-10 md:grid-cols-12"
        >
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-[55px] w-[55px] items-center justify-center rounded-full bg-[#e0e0e0] text-[#555]">
                {getInitials(review.userName)}
              </div>

              <div>
                <p className="font-semibold">{review.userName}</p>

                {review.verified && (
                  <div className="flex items-center gap-1">
                    <BadgeCheck size={16} className="text-[#003b57]" />
                    <span className="text-xs">Verified Buyer</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="mb-2 flex items-center gap-3">
              <RatingStars rating={review.rating} />
              <span className="font-semibold">{review.title}</span>
            </div>

            <p className="mb-3">{review.comment}</p>

            {review.image && (
              <Image
                src={urlFor(review.image).width(260).url()}
                alt={`Photo from ${review.userName}'s review`}
                width={130}
                height={130}
                className="w-[130px]"
              />
            )}
          </div>

          <div className="text-[#666] md:col-span-2 md:text-right">
            {formatDate(review.createdAt)}
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="mt-2 mb-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const value = i + 1;
            const isActive = value === page;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handlePageChange(value)}
                className={`h-9 w-9 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-[#003b57] text-white"
                    : "bg-[#f6f7f7] text-[#003b57] hover:bg-[#eaeaea]"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}