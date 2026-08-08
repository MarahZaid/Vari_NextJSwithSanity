import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { client } from "../../../../sanity/lib/client";
import { ORDER_BY_ID_QUERY } from "../../../../sanity/lib/queries";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-teal-100 text-teal-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) redirect(`/login?redirect=/orders/${id}`);

  const order = await client.fetch(ORDER_BY_ID_QUERY, { id }, { cache: "no-store" });
  if (!order) notFound();

  const isOwner = order.customerEmail === session.user.email;
  if (!isOwner && !session.user.isAdmin) redirect("/");

  return (
    <div className="min-h-screen bg-[#f6f8f9] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-[720px]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#003349]">Order confirmed</h1>
            <p className="text-sm text-[#6b7c84]">Order #{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
              STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="mb-4 overflow-hidden rounded-[18px] border border-black/[0.08] bg-white">
          {order.items.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between p-5">
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
              {index < order.items.length - 1 && <div className="border-t border-black/[0.06]" />}
            </div>
          ))}
        </div>

        <div className="mb-4 rounded-[18px] border border-black/[0.08] bg-white p-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6b7c84]">Subtotal</span>
              <span className="font-semibold text-[#1a2b33]">${order.subtotal?.toFixed(2)}</span>
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
          <div className="mt-4 flex justify-between border-t border-black/[0.08] pt-4">
            <span className="text-lg font-bold text-[#003349]">Total</span>
            <span className="text-lg font-extrabold text-[#003349]">
              ${order.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="rounded-[18px] border border-black/[0.08] bg-white p-6">
          <p className="mb-2 font-bold text-[#003349]">Shipping address</p>
          <p className="text-sm text-[#1a2b33]">{order.shippingAddress}</p>
          {order.phone && <p className="mt-1 text-sm text-[#6b7c84]">{order.phone}</p>}
        </div>
      </div>
    </div>
  );
}