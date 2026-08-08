"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ categories, initialData, productId }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData?.name || "",
    categoryId: initialData?.category?._id || categories[0]?._id || "",
    shortDescription: initialData?.shortDescription || "",
    price: initialData?.price || "",
    oldPrice: initialData?.oldPrice || "",
    discountLabel: initialData?.discountLabel || "",
    stock: initialData?.stock ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(productId);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[560px] rounded-[18px] border border-black/[0.08] bg-white p-6"
    >
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-[#003349]">Name</span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
        />
      </label>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-[#003349]">Category</span>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          className="w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
        >
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-[#003349]">
          Short description
        </span>
        <textarea
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
        />
      </label>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#003349]">Price</span>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#003349]">Old price</span>
          <input
            type="number"
            name="oldPrice"
            value={form.oldPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
          />
        </label>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#003349]">
            Discount label
          </span>
          <input
            name="discountLabel"
            value={form.discountLabel}
            onChange={handleChange}
            className="w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#003349]">Stock</span>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min="0"
            className="w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-[10px] bg-[#007fad] py-3 text-sm font-bold text-white hover:bg-[#00688c] disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Save changes" : "Create product"}
      </button>

      {isEdit && (
        <p className="mt-3 text-center text-xs text-[#6b7c84]">
          Need to add/edit images or colors? Do that from{" "}
          <a href="/studio" className="text-[#007fad] underline">
            Sanity Studio
          </a>
          .
        </p>
      )}
    </form>
  );
}