"use client";

import Image from "next/image";
import { ShoppingCart, Package } from "lucide-react";
import { useCart } from "../../context/CartContext";

const BRAND = { navy: "#003349", teal: "#007fad", subtle: "#6b7c84" };

export default function MiniCart({ onNavigate }) {
  const { items, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <ShoppingCart size={28} className="mx-auto mb-2 text-[#007fad]" />
        <p className="text-sm text-[#6b7c84]">Your cart is empty</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-h-[240px] overflow-y-auto sm:max-h-[300px]">
        {items.map((item) => (
          <div key={item.key} className="flex gap-3 p-3 hover:bg-[#f6f8f9]">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-black/[0.08] bg-white">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-contain" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#c8d2d6]">
                  <Package size={20} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-bold text-[#003349]">{item.name}</p>
              <p className="text-[0.78rem] text-[#6b7c84]">
                {item.color} · Qty {item.quantity}
              </p>
              <p className="text-[0.85rem] font-semibold text-[#003349]">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-black/[0.08] p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-bold text-[#003349]">Subtotal ({itemCount})</span>
          <span className="font-extrabold text-[#003349]">${subtotal.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={onNavigate}
          className="w-full rounded-lg bg-[#003349] py-2.5 text-sm font-bold text-white hover:bg-[#001f2e]"
        >
          View Cart
        </button>
      </div>
    </>
  );
}