"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminToggle({ customerId, isAdmin }) {
  const router = useRouter();
  const [checked, setChecked] = useState(isAdmin);
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    const next = !checked;
    setChecked(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: next }),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
    } catch (err) {
      alert(err.message);
      setChecked(!next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={saving}
      className={`rounded-full px-3 py-1 text-xs font-bold disabled:opacity-50 ${
        checked ? "bg-[#007fad]/10 text-[#007fad]" : "bg-black/[0.06] text-[#6b7c84]"
      }`}
    >
      {checked ? "Admin" : "Customer"}
    </button>
  );
}