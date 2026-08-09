"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, Package, X } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const BRAND = { navy: "#003349", teal: "#007fad", ink: "#1a2b33", subtle: "#6b7c84" };

export default function CartPage() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const { items, setQuantity, removeItem, subtotal, itemCount, loaded } = useCart();
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
        router.push("/login?redirect=/cart");
    }
}, [sessionStatus, router]);

if (sessionStatus !== "authenticated") return null;

  const shipping = subtotal > 0 && subtotal < 200 ? 15 : 0;
  const total = subtotal + shipping;

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#f6f8f9] px-6 py-16">
        <div className="max-w-[380px] text-center">
          <div className="mx-auto mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#007fad]/[0.08]">
            <ShoppingCart size={40} className="text-[#007fad]" />
          </div>
          <h1 className="mb-2 text-2xl font-extrabold text-[#003349]">Your cart is empty</h1>
          <p className="mb-6 text-[#6b7c84]">
            Looks like you haven't added anything yet. Let's find something you'll love.
          </p>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="rounded-[10px] bg-[#003349] px-8 py-3 font-semibold text-white hover:bg-[#001f2e]"
          >
            Browse products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f9] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-[1080px]">
        <Link
          href="/products"
          className="mb-4 flex w-fit items-center gap-1.5 text-sm font-semibold text-[#6b7c84] hover:text-[#003349]"
        >
          <ArrowLeft size={18} /> Continue shopping
        </Link>

        <div className="mb-6 flex items-baseline gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#003349]">Your Cart</h1>
          <span className="text-[#6b7c84]">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex flex-col items-start gap-6 md:flex-row">
          {/* Items */}
          <div className="w-full overflow-hidden rounded-[18px] border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,51,73,0.04),0_8px_24px_rgba(0,51,73,0.06)] md:flex-1">
            {items.map((item, index) => (
              <div key={item.key}>
                <div className="flex flex-col gap-3 p-5 transition-colors hover:bg-[#f6f8f9] sm:flex-row sm:items-center sm:gap-5">
                  <div className="flex flex-1 gap-4">
                    <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl border border-black/[0.08] bg-white">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#c8d2d6]">
                          <Package size={32} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#003349]">{item.name}</p>
                      <p className="mt-0.5 text-sm text-[#6b7c84]">Color: {item.color}</p>
                      <p className="mt-1 font-semibold text-[#1a2b33]">${item.price}</p>

                      <button
                        type="button"
                        onClick={() => setItemToRemove(item)}
                        className="-ml-1 mt-1 inline-flex items-center gap-1 rounded-lg px-1 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 sm:hidden"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                    <div className="flex items-center gap-1 rounded-full border border-black/[0.08] bg-[#f6f8f9] px-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                        className="rounded-full p-1.5 text-[#003349] hover:bg-white"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-6 text-center font-bold text-[#1a2b33]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                        className="rounded-full p-1.5 text-[#003349] hover:bg-white"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <p className="min-w-[76px] text-right font-bold text-[#003349]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() => setItemToRemove(item)}
                      className="hidden rounded-lg p-1.5 text-red-700 hover:bg-red-50 sm:inline-flex"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
                {index < items.length - 1 && <div className="border-t border-black/[0.06]" />}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full shrink-0 rounded-[18px] border border-black/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(0,51,73,0.04),0_8px_24px_rgba(0,51,73,0.06)] md:sticky md:top-6 md:w-[320px]">
            <p className="mb-4 font-extrabold text-[#003349]">Order Summary</p>

            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7c84]">Subtotal</span>
                <span className="font-semibold text-[#1a2b33]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7c84]">Shipping</span>
                {shipping === 0 ? (
                  <span className="rounded-md bg-[#eaf6ea] px-2 py-0.5 text-xs font-bold text-[#2e7d32]">
                    Free
                  </span>
                ) : (
                  <span className="font-semibold text-[#1a2b33]">${shipping.toFixed(2)}</span>
                )}
              </div>
              {shipping > 0 && (
                <p className="rounded-lg bg-[#f6f8f9] px-3 py-2 text-xs text-[#6b7c84]">
                  Add ${(200 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>

            <div className="mb-4 border-t border-black/[0.08] pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-[#003349]">Total</span>
                <span className="text-lg font-extrabold text-[#003349]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="w-full rounded-[10px] bg-[#003349] py-3.5 font-bold text-white hover:bg-[#001f2e]"
            >
              Checkout
            </button>
            <p className="mt-3 text-center text-xs text-[#6b7c84]">Taxes calculated at checkout</p>
          </div>
        </div>
      </div>

      {itemToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-xl font-extrabold text-[#003349]">Remove item?</h2>
              <button
                type="button"
                onClick={() => setItemToRemove(null)}
                className="rounded-lg p-1 text-[#6b7c84] hover:bg-[#f6f8f9]"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-6 text-[#3d4a50]">
              Are you sure you want to remove &quot;{itemToRemove.name}&quot; from your cart?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setItemToRemove(null)}
                className="rounded-[10px] px-5 py-2.5 text-sm font-bold text-[#003349] hover:bg-[#f6f8f9]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  removeItem(itemToRemove.key);
                  setItemToRemove(null);
                }}
                className="rounded-[10px] bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}