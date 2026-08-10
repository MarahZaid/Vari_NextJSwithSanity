"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "../../../context/CartContext";
import { Plus } from "lucide-react";
import { useLivePoints } from "../../../hooks/useLivePoints";

const POINTS_PER_DOLLAR = 100;

export default function CheckoutPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { items, subtotal, clearCart, loaded } = useCart();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressKey, setSelectedAddressKey] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", fullAddress: "", phone: "" });
  const [savingAddress, setSavingAddress] = useState(false);
  const [phone, setPhone] = useState("");
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login?redirect=/checkout");
    }
  }, [sessionStatus, router]);

  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (loaded && items.length === 0 && !placing && !orderPlaced) {
      router.push("/cart");
    }
  }, [loaded, items, placing, orderPlaced, router]);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    fetch("/api/customer/addresses")
      .then((res) => res.json())
      .then((data) => {
        const list = data.addresses || [];
        setSavedAddresses(list);

        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        if (defaultAddr) {
          setSelectedAddressKey(defaultAddr._key);
        } else {
          setShowNewAddressForm(true);
        }
      })
      .catch(() => setShowNewAddressForm(true));
  }, [sessionStatus]);

  if (!loaded || sessionStatus !== "authenticated") return null;

  const pointsBalance = useLivePoints();
  const shipping = subtotal > 0 && subtotal < 200 ? 15 : 0;
  const total = subtotal + shipping;
  const maxRedeemable = Math.min(pointsBalance, Math.floor(total * POINTS_PER_DOLLAR));
  const pointsDiscount = pointsToRedeem / POINTS_PER_DOLLAR;
  const finalTotal = Math.max(total - pointsDiscount, 0);

  const selectedAddress = savedAddresses.find((a) => a._key === selectedAddressKey);
  const finalAddress = selectedAddress?.fullAddress || "";
  const finalPhone = selectedAddress?.phone || "";

  function validate() {
    const next = {};
    if (!finalAddress.trim()) next.address = "Please select or add a shipping address";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSaveNewAddress() {
    if (!newAddress.fullAddress.trim()) return;

    setSavingAddress(true);
    try {
      const res = await fetch("/api/customer/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });
      if (!res.ok) throw new Error("Failed to save address");

      const { address } = await res.json();
      setSavedAddresses((prev) => [...prev, address]);
      setSelectedAddressKey(address._key);
      setShowNewAddressForm(false);
      setNewAddress({ label: "", fullAddress: "", phone: "" });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSavingAddress(false);
    }
  }

  async function handlePlaceOrder() {
    if (!validate()) return;
    setPlacing(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: finalAddress,
          phone: finalPhone,
          paymentMethod: "cash",
          pointsToRedeem,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order");
      }

      const { orderId } = await res.json();
      setOrderPlaced(true);   // امنع الـ redirect لـ /cart
      clearCart();
      router.push(`/orders/${orderId}`);

    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8f9] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-[1080px]">
        <h1 className="mb-6 text-3xl font-extrabold text-[#003349]">Checkout</h1>

        <div className="flex flex-col items-start gap-6 md:flex-row">
          {/* Form */}
          <div className="w-full space-y-4 md:flex-1">
            <div className="rounded-[18px] border border-black/[0.08] bg-white p-6">
              <p className="mb-4 font-bold text-[#003349]">Shipping details</p>

              {savedAddresses.length > 0 && (
                <div className="mb-4 space-y-2">
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr._key}
                      className={`flex cursor-pointer items-start gap-3 rounded-[10px] border px-4 py-3 ${selectedAddressKey === addr._key
                          ? "border-[#007fad] bg-[#007fad]/[0.06]"
                          : "border-black/[0.12]"
                        }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressKey === addr._key}
                        onChange={() => {
                          setSelectedAddressKey(addr._key);
                          setShowNewAddressForm(false);
                        }}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold text-[#003349]">
                          {addr.label} {addr.isDefault && <span className="text-xs text-[#007fad]">(Default)</span>}
                        </p>
                        <p className="text-sm text-[#6b7c84]">{addr.fullAddress}</p>
                        {addr.phone && <p className="text-xs text-[#6b7c84]">{addr.phone}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {!showNewAddressForm ? (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#007fad] hover:underline"
                >
                  <Plus size={16} /> Add a new address
                </button>
              ) : (
                <div className="rounded-[10px] border border-black/[0.12] p-4">
                  <label className="mb-3 block">
                    <span className="mb-1.5 block text-sm font-semibold text-[#003349]">Label (optional)</span>
                    <input
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      placeholder="e.g. Home, Work"
                      className="w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
                    />
                  </label>

                  <label className="mb-3 block">
                    <span className="mb-1.5 block text-sm font-semibold text-[#003349]">Delivery address</span>
                    <input
                      value={newAddress.fullAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                      className={`w-full rounded-[10px] border px-3 py-2.5 text-sm outline-none focus:border-[#007fad] ${errors.address ? "border-red-500" : "border-black/[0.12]"
                        }`}
                    />
                    {errors.address && <span className="mt-1 block text-xs text-red-600">{errors.address}</span>}
                  </label>

                  <label className="mb-4 block">
                    <span className="mb-1.5 block text-sm font-semibold text-[#003349]">Phone (optional)</span>
                    <input
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
                    />
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveNewAddress}
                      disabled={savingAddress || !newAddress.fullAddress.trim()}
                      className="rounded-[10px] bg-[#007fad] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {savingAddress ? "Saving..." : "Save address"}
                    </button>
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="rounded-[10px] border border-black/[0.12] px-4 py-2.5 text-sm font-semibold text-[#6b7c84]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[18px] border border-black/[0.08] bg-white p-6">
              <p className="mb-4 font-bold text-[#003349]">Payment method</p>
              <label className="flex items-center gap-2 rounded-[10px] border border-[#007fad] bg-[#007fad]/[0.06] px-4 py-3">
                <input type="radio" checked readOnly />
                <span className="font-semibold text-[#003349]">Cash on delivery</span>
              </label>
            </div>

            {pointsBalance > 0 && (
              <div className="rounded-[18px] border border-black/[0.08] bg-white p-6">
                <p className="mb-1 font-bold text-[#003349]">Use your points</p>
                <p className="mb-3 text-sm text-[#6b7c84]">
                  You have {pointsBalance} points (${(pointsBalance / POINTS_PER_DOLLAR).toFixed(2)} available)
                </p>
                <input
                  type="range"
                  min={0}
                  max={maxRedeemable}
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                  className="w-full accent-[#007fad]"
                />
                <p className="mt-1 text-sm font-semibold text-[#003349]">
                  Using {pointsToRedeem} points
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="w-full shrink-0 rounded-[18px] border border-black/[0.08] bg-white p-6 md:sticky md:top-6 md:w-[320px]">
            <p className="mb-4 font-bold text-[#003349]">Order Summary</p>

            <div className="mb-4 max-h-[220px] space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-black/[0.08] bg-white">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-contain" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#1a2b33]">{item.name}</p>
                    <p className="text-xs text-[#6b7c84]">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#003349]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-black/[0.08] pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7c84]">Subtotal</span>
                <span className="font-semibold text-[#1a2b33]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7c84]">Shipping</span>
                <span className="font-semibold text-[#1a2b33]">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {pointsToRedeem > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#6b7c84]">Points discount</span>
                  <span className="font-semibold text-[#2e7d32]">-${pointsDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="my-4 flex justify-between border-t border-black/[0.08] pt-4">
              <span className="text-lg font-bold text-[#003349]">Total</span>
              <span className="text-lg font-extrabold text-[#003349]">${finalTotal.toFixed(2)}</span>
            </div>

            {submitError && (
              <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </p>
            )}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full rounded-[10px] bg-[#003349] py-3.5 font-bold text-white hover:bg-[#001f2e] disabled:opacity-50"
            >
              {placing ? "Placing order..." : "Place order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}