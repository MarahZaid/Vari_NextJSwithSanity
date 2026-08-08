"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Plus } from "lucide-react";

const EMPTY_FORM = { name: "", plpTitle: "", shortDescription: "", description: "" };

export default function CategoriesManager({ categories }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function startEdit(cat) {
    setEditingId(cat._id);
    setShowNew(false);
    setForm({
      name: cat.name || "",
      plpTitle: cat.plpTitle || "",
      shortDescription: cat.shortDescription || "",
      description: cat.description || "",
    });
  }

  function startNew() {
    setShowNew(true);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function cancel() {
    setEditingId(null);
    setShowNew(false);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save category");
      cancel();
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  const isFormOpen = showNew || editingId;

  return (
    <div>
      {!isFormOpen && (
        <button
          type="button"
          onClick={startNew}
          className="mb-4 flex items-center gap-1.5 rounded-[10px] bg-[#007fad] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#00688c]"
        >
          <Plus size={16} /> Add category
        </button>
      )}

      {isFormOpen && (
        <div className="mb-6 rounded-[18px] border border-black/[0.08] bg-white p-5">
          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
            />
            <input
              placeholder="PLP title"
              value={form.plpTitle}
              onChange={(e) => setForm({ ...form, plpTitle: e.target.value })}
              className="rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
            />
          </div>
          <input
            placeholder="Short description"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className="mb-3 w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
          />
          <textarea
            placeholder="Full description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mb-4 w-full rounded-[10px] border border-black/[0.12] px-3 py-2.5 text-sm outline-none focus:border-[#007fad]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !form.name}
              className="rounded-[10px] bg-[#007fad] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-[10px] border border-black/[0.12] px-4 py-2.5 text-sm font-semibold text-[#6b7c84]"
            >
              Cancel
            </button>
          </div>
          <p className="mt-3 text-xs text-[#6b7c84]">
            Images and display order are managed from{" "}
            <a href="/studio" className="text-[#007fad] underline">Studio</a>.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="rounded-[18px] border border-black/[0.08] bg-white p-4"
          >
            <p className="font-bold text-[#003349]">{cat.name}</p>
            <p className="mb-3 line-clamp-2 text-sm text-[#6b7c84]">
              {cat.shortDescription}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(cat)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#007fad] hover:bg-[#007fad]/10"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(cat._id)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}