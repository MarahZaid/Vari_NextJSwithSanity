"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";

export default function ProductsTable({ products }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-[18px] border border-black/[0.08] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/[0.08] bg-[#f6f8f9] text-left text-[#6b7c84]">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-black/[0.04]">
              <td className="px-4 py-3 font-semibold text-[#1a2b33]">{p.name}</td>
              <td className="px-4 py-3 text-[#6b7c84]">{p.category?.name}</td>
              <td className="px-4 py-3 text-[#003349]">${p.price}</td>
              <td className="px-4 py-3 text-[#6b7c84]">{p.stock}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/products/${p._id}`}
                    className="rounded-lg p-1.5 text-[#007fad] hover:bg-[#007fad]/10"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === p._id}
                    onClick={() => handleDelete(p._id)}
                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}