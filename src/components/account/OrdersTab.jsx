import { Package } from "lucide-react";

const STATUS_STYLES = {
  pending: { color: "#b26a00", bg: "#fff4e5" },
  processing: { color: "#0057a3", bg: "#e6f0fa" },
  shipped: { color: "#5e35b1", bg: "#f0eafa" },
  delivered: { color: "#2e7d32", bg: "#eaf6ea" },
  completed: { color: "#2e7d32", bg: "#eaf6ea" },
  cancelled: { color: "#c62828", bg: "#fdecea" },
};

export default function OrdersTab({ orders }) {
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-14">
        <Package size={36} className="text-black/10" />
        <p className="text-[#6b7c84]">You haven&apos;t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-extrabold text-[#003349]">
        Order History
      </h2>

      {orders.map((order) => {
        const style = STATUS_STYLES[order.status] || {
          color: "#6b7c84",
          bg: "#f6f8f9",
        };
        const statusLabel = order.status
          ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
          : "Pending";

        return (
          <div
            key={order._id}
            className="mb-4 rounded-[14px] border border-black/[0.08] p-5 transition-shadow hover:shadow-[0_1px_2px_rgba(0,51,73,0.04),0_8px_24px_rgba(0,51,73,0.06)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-bold text-[#003349]">
                Order #{order._id.slice(-6)}
              </p>
              <span
                className="rounded-lg px-2.5 py-1 text-xs font-bold"
                style={{ color: style.color, backgroundColor: style.bg }}
              >
                {statusLabel}
              </span>
            </div>

            <p className="mb-3 text-sm text-[#6b7c84]">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : ""}
            </p>

            {(order.items || []).map((item, index) => (
              <div key={index} className="flex justify-between py-1 text-sm">
                <span className="text-[#1a2b33]">
                  {item.productName}
                  {item.color ? ` (${item.color})` : ""} × {item.quantity}
                </span>
                <span className="font-semibold text-[#1a2b33]">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <hr className="my-3 border-black/[0.08]" />

            <div className="flex justify-between">
              <span className="font-bold text-[#1a2b33]">Total</span>
              <span className="font-extrabold text-[#003349]">
                ${Number(order.totalAmount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}