"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import MiniCart from "./MiniCart";

export default function CartMenu() {
  const router = useRouter();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const wrapperRef = useRef(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  }

  function handleIconClick(e) {
    // On small screens, open the drawer instead of navigating.
    if (window.innerWidth < 640) {
      e.preventDefault();
      setOpen(true);
    }
  }

  function goToCart() {
    setOpen(false);
    router.push("/cart");
  }

  // close on outside click (mainly for mobile drawer / touch devices)
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <Link href="/cart" aria-label="Cart" className="relative " onClick={handleIconClick}>
        <ShoppingCart size={26} className="text-[#007fad] ml-12 sm:h-8 sm:w-8" />
        {itemCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#007fad] px-1 text-[10px] font-bold text-white">
            {itemCount}
          </span>
        )}
      </Link>

      {/* Desktop hover popover */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 hidden w-[340px] overflow-hidden rounded-[14px] border border-black/[0.08] bg-white shadow-[0_12px_32px_rgba(0,51,73,0.16)] sm:block">
          <MiniCart onNavigate={goToCart} />
        </div>
      )}

      {/* Mobile bottom drawer */}
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-hidden rounded-t-2xl bg-white">
            <div className="flex items-center justify-between border-b border-black/[0.08] px-4 py-3.5">
              <span className="font-extrabold text-[#003349]">Your Cart</span>
              <button type="button" onClick={() => setOpen(false)}>
                <X size={20} className="text-[#6b7c84]" />
              </button>
            </div>
            <MiniCart onNavigate={goToCart} />
          </div>
        </div>
      )}
    </div>
  );
}