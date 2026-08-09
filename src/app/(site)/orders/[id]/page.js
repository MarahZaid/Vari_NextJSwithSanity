import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Package, MapPin, Receipt } from "lucide-react";
import { auth } from "../../../../auth";
import { client } from "../../../../sanity/lib/client";
import { ORDER_BY_ID_QUERY } from "../../../../sanity/lib/queries";

const STATUS_STYLES = {
  pending: { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  processing: { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  shipped: { badge: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  delivered: { badge: "bg-teal-100 text-teal-700", dot: "bg-teal-500" },
  completed: { badge: "bg-green-100 text-green-700", dot: "bg-green-500" },
  cancelled: { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

const PROGRESS_STEPS = ["pending", "processing", "shipped", "delivered"];

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) redirect(`/login?redirect=/orders/${id}`);

  const order = await client.fetch(ORDER_BY_ID_QUERY, { id }, { cache: "no-store" });
  if (!order) notFound();

  const isOwner = order.customerEmail === session.user.email;
  if (!isOwner && !session.user.isAdmin) redirect("/");

  const statusStyle = STATUS_STYLES[order.status] || {
    badge: "bg-gray-100 text-gray-700",
    dot: "bg-gray-400",
  };
  const isCancelled = order.status === "cancelled";
  const currentStepIndex = PROGRESS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#f6f8f9] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-[720px]">
        {/* Success header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#007fad]/10">
            <CheckCircle2 size={32} className="text-[#007fad]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#003349] sm:text-3xl">
            Order confirmed
          </h1>
          <p className="mt-1 text-sm text-[#6b7c84]">
            Order #{order._id.slice(-8).toUpperCase()} · Thank you for your purchase
          </p>
        </div>

        {/* Status progress */}
        <div className="mb-5 rounded-[18px] border border-black/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(0,51,73,0.04),0_8px_24px_rgba(0,51,73,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#6b7c84]">Order status</span>
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {order.status}
            </span>
          </div>

          {!isCancelled && (
            <div className="flex items-center">
              {PROGRESS_STEPS.map((step, index) => {
                const reached = index <= currentStepIndex;
                const isLast = index === PROGRESS_STEPS.length - 1;
                return (
                  <div key={step} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                          reached
                            ? "bg-[#007fad] text-white"
                            : "bg-[#eef1f2] text-[#a6b1b6]"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-[11px] font-medium capitalize ${
                          reached ? "text-[#003349]" : "text-[#a6b1b6]"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`mx-1.5 mb-4 h-[2px] flex-1 ${
                          index < currentStepIndex ? "bg-[#007fad]" : "bg-[#eef1f2]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="mb-5 overflow-hidden rounded-[18px] border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,51,73,0.04),0_8px_24px_rgba(0,51,73,0.06)]">
          <div className="flex items-center gap-2 border-b border-black/[0.06] px-6 py-4">
            <Package size={17} className="text-[#007fad]" />
            <p className="font-bold text-[#003349]">Items</p>
          </div>

          {order.items.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-semibold text-[#1a2b33]">{item.productName}</p>
                  <p className="text-sm text-[#6b7c84]">
                    Color: {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-[#003349]">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              {index < order.items.length - 1 && (
                <div className="border-t border-black/[0.06]" />
              )}
            </div>
          ))}
        </div>

        {/* Payment summary */}
        <div className="mb-5 rounded-[18px] border border-black/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(0,51,73,0.04),0_8px_24px_rgba(0,51,73,0.06)]">
          <div className="mb-4 flex items-center gap-2">
            <Receipt size={17} className="text-[#007fad]" />
            <p className="font-bold text-[#003349]">Payment summary</p>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6b7c84]">Subtotal</span>
              <span className="font-semibold text-[#1a2b33]">
                ${order.subtotal?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7c84]">Shipping</span>
              <span className="font-semibold text-[#1a2b33]">
                {order.shippingFee ? `$${order.shippingFee.toFixed(2)}` : "Free"}
              </span>
            </div>
            {order.pointsDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#6b7c84]">Points discount</span>
                <span className="font-semibold text-[#2e7d32]">
                  -${order.pointsDiscount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-black/[0.08] pt-4">
            <span className="text-lg font-bold text-[#003349]">Total</span>
            <span className="text-xl font-extrabold text-[#003349]">
              ${order.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="rounded-[18px] border border-black/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(0,51,73,0.04),0_8px_24px_rgba(0,51,73,0.06)]">
          <div className="mb-3 flex items-center gap-2">
            <MapPin size={17} className="text-[#007fad]" />
            <p className="font-bold text-[#003349]">Shipping address</p>
          </div>
          <p className="text-sm text-[#1a2b33]">{order.shippingAddress}</p>
          {order.phone && (
            <p className="mt-1 text-sm text-[#6b7c84]">{order.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
}