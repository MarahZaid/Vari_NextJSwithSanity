import { client } from "../../../sanity/lib/client";
import { ALL_ORDERS_QUERY } from "../../../sanity/lib/queries";
import OrderStatusSelect from "../../../components/admin/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await client.fetch(ALL_ORDERS_QUERY, {}, { cache: "no-store" });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-[#003349]">Orders</h1>

      <div className="overflow-x-auto rounded-[18px] border border-black/[0.08] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/[0.08] bg-[#f6f8f9] text-left text-[#6b7c84]">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-black/[0.04]">
                <td className="px-4 py-3 font-semibold text-[#1a2b33]">{o.customerName}</td>
                <td className="px-4 py-3 text-[#6b7c84]">{o.customerEmail}</td>
                <td className="px-4 py-3 text-[#003349]">${o.totalAmount?.toFixed(2)}</td>
                <td className="px-4 py-3 text-[#6b7c84]">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={o._id} currentStatus={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}