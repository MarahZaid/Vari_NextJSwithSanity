"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { urlFor } from "../../sanity/lib/image";

export default function ProductGallery({ colors, selectedColorIndex, productName }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const thumbsRef = useRef(null);
  const imageContainerRef = useRef(null);

  const currentColor = colors[selectedColorIndex] || colors[0];
  const images = currentColor?.images || [];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedColorIndex]);

  if (!images.length) return null;

  function scrollThumbs(direction) {
    thumbsRef.current?.scrollBy({ top: direction * 129, behavior: "smooth" });
  }

  function goToPrevImage() {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function goToNextImage() {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  function handleMouseMove(e) {
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }

  const activeImageUrl = urlFor(images[activeImageIndex]).width(1000).url();
  const zoomImageUrl = urlFor(images[activeImageIndex]).width(2200).url();

  return (
    <div className="flex gap-3">
      {/* الثامبنيلز */}
      <div className="hidden flex-col items-center gap-2 md:flex">
        <button type="button" onClick={() => scrollThumbs(-1)} aria-label="فوق">
          <ChevronUp size={20} />
        </button>

        <div
          ref={thumbsRef}
          className="flex max-h-[560px] flex-col gap-2 overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`h-[90px] w-[90px] shrink-0 border p-1 ${
                index === activeImageIndex ? "border-[#0091ff]" : "border-[#ddd]"
              }`}
            >
              <Image
                src={urlFor(img).width(90).height(90).url()}
                alt={`${productName} ${index + 1}`}
                width={82}
                height={82}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        <button type="button" onClick={() => scrollThumbs(1)} aria-label="تحت">
          <ChevronDown size={20} />
        </button>
      </div>

      {/* الصورة الرئيسية */}
      <div
        ref={imageContainerRef}
        className="relative min-w-0 flex-1 overflow-hidden"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImageUrl}
          alt={productName}
          width={1000}
          height={1100}
          className="w-full object-cover"
        />

        {/* طبقة الزوم - بتظهر بس وقت الهوفر وبتتحرك مع الماوس */}
        {isZooming && (
          <div
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{
              backgroundImage: `url(${zoomImageUrl})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: "220%",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white hover:bg-black/65"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={goToNextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white hover:bg-black/65"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}