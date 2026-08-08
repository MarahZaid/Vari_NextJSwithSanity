import { Package, Tag, ListChecks, DollarSign, AlertTriangle } from "lucide-react";
import { client } from "../../sanity/lib/client";
import {
  ALL_PRODUCTS_QUERY,
  ALL_CATEGORIES_QUERY,
  ALL_ORDERS_QUERY,
  ALL_CUSTOMERS_QUERY,
} from "../../sanity/lib/queries";
import StatCard from "../../components/admin/StatCard";
import SalesChart from "../../components/admin/SalesChart";
import TopProductsChart from "../../components/admin/TopProductsChart";

const LOW_STOCK_THRESHOLD = 20;

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

export default async function AdminDashboardPage() {
  const [products, categories, orders, customers] = await Promise.all([
    client.fetch(ALL_PRODUCTS_QUERY, {}, { cache: "no-store" }),
    client.fetch(ALL_CATEGORIES_QUERY, {}, { cache: "no-store" }),
    client.fetch(ALL_ORDERS_QUERY, {}, { cache: "no-store" }),
    client.fetch(ALL_CUSTOMERS_QUERY, {}, { cache: "no-store" }),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Sales this week
  const last7Days = getLast7Days();
  const salesData = last7Days.map((day) => {
    const dayLabel = day.toLocaleDateString("en-US", { weekday: "short" });
    const dayTotal = orders
      .filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === day.toDateString();
      })
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return { day: dayLabel, total: dayTotal };
  });

  // Top selling products (by quantity across all orders)
  const productSales = {};
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const name = item.productName || "Unknown";
      productSales[name] = (productSales[name] || 0) + (item.quantity || 0);
    });
  });
  const topProducts = Object.entries(productSales)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Low stock
  const lowStockProducts = products
    .filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  return (
    <div>
      <h1 className="mb-1 text-3xl font-extrabold text-[#003349]">Analytics</h1>
      <p className="mb-6 text-sm text-[#6b7c84]">An overview of your store's performance</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Products" value={products.length} icon={Package} color="#007fad" />
        <StatCard label="Categories" value={categories.length} icon={Tag} color="#22aaff" />
        <StatCard label="Orders" value={orders.length} icon={ListChecks} color="#6b7c84" />
        <StatCard
          label="Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="#2e9e5b"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#eee] bg-white p-5">
          <p className="mb-4 font-bold text-[#003349]">Sales This Week</p>
          <SalesChart data={salesData} />
        </div>

        <div className="rounded-2xl border border-[#eee] bg-white p-5">
          <p className="mb-4 font-bold text-[#003349]">Top Selling Products</p>
          <TopProductsChart data={topProducts} />
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mt-6 rounded-2xl border border-[#eee] bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <p className="font-bold text-[#003349]">Low Stock Alert</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lowStockProducts.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between rounded-xl border border-[#eee] px-4 py-3"
              >
                <span className="text-sm font-semibold text-[#1a2b33]">{p.name}</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}