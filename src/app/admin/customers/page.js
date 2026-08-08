import { client } from "../../../sanity/lib/client";
import { ALL_CUSTOMERS_QUERY } from "../../../sanity/lib/queries";
import AdminToggle from "../../../components/admin/AdminToggle";

export default async function AdminCustomersPage() {
  const customers = await client.fetch(ALL_CUSTOMERS_QUERY, {}, { cache: "no-store" });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-[#003349]">Customers</h1>

      <div className="overflow-x-auto rounded-[18px] border border-black/[0.08] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/[0.08] bg-[#f6f8f9] text-left text-[#6b7c84]">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Points</th>
              <th className="px-4 py-3 font-medium">Admin?</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b border-black/[0.04]">
                <td className="px-4 py-3 font-semibold text-[#1a2b33]">{c.name}</td>
                <td className="px-4 py-3 text-[#6b7c84]">{c.email}</td>
                <td className="px-4 py-3 text-[#003349]">{c.points || 0}</td>
                <td className="px-4 py-3">
                  <AdminToggle customerId={c._id} isAdmin={c.isAdmin} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}