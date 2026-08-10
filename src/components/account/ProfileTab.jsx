"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Star, Trash2 } from "lucide-react";

const fieldClass =
  "w-full rounded-[10px] border border-black/[0.08] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#007fad]";

export default function ProfileTab({ customer, onUpdated }) {
  const [name, setName] = useState(customer.name || "");
  const [phone, setPhone] = useState(customer.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/account/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    if (!res.ok) {
      setError("Something went wrong while saving. Please try again.");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
    onUpdated({ ...customer, name, phone });
  }

  return (
    <div >
      <h2 className="mb-6 text-lg font-extrabold text-[#003349]">
        Profile Information
      </h2>

      {saved && (
        <div className="mb-5 rounded-[10px] bg-[#eaf6ea] px-4 py-3 text-sm text-[#2e7d32]">
          Your information was updated.
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
        Email
      </label>
      <input
        value={customer.email || ""}
        disabled
        className={`${fieldClass} mb-1 cursor-not-allowed bg-[#f6f8f9] text-[#6b7c84]`}
      />
      <p className="mb-4 text-xs text-[#6b7c84]">
        Your email is linked to your login and can&apos;t be changed here.
      </p>

      <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
        Full Name
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`${fieldClass} mb-4`}
      />

      <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
        Phone
      </label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={`${fieldClass} mb-5`}
      />

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="flex items-center gap-2 rounded-[10px] bg-[#003349] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#001f2e] disabled:opacity-70"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        {saving ? "Saving..." : "Save changes"}
      </button>

      <hr className="my-8 border-black/[0.08]" />

      <h3 className="mb-4 font-bold text-[#003349]">Saved Addresses</h3>
      <AddressesSection />

      <hr className="my-8 border-black/[0.08]" />

      <h3 className="mb-1 font-bold text-[#003349]">Password</h3>
      <ChangePasswordSection email={customer.email} />
    </div>
  );
}

function AddressesSection() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", fullAddress: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [busyKey, setBusyKey] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customer/addresses")
      .then((res) => res.json())
      .then((data) => setAddresses(data.addresses || []))
      .catch(() => setError("Could not load your addresses."))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!form.fullAddress.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/customer/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save address");
      const { address } = await res.json();
      setAddresses((prev) => [...prev, address]);
      setForm({ label: "", fullAddress: "", phone: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSetDefault(key) {
    setBusyKey(key);
    try {
      const res = await fetch(`/api/customer/addresses/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setDefault: true }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const { addresses: updated } = await res.json();
      setAddresses(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyKey(null);
    }
  }

  async function handleDelete(key) {
    setBusyKey(key);
    try {
      const res = await fetch(`/api/customer/addresses/${key}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setAddresses((prev) => prev.filter((a) => a._key !== key));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyKey(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-[#6b7c84]">Loading addresses...</p>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {addresses.length > 0 && (
        <div className="mb-4 space-y-2">
          {addresses.map((addr) => (
            <div
              key={addr._key}
              className="flex items-start justify-between gap-3 rounded-[10px] border border-black/[0.08] px-4 py-3"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-semibold text-[#003349]">
                  {addr.label || "Address"}
                  {addr.isDefault && (
                    <span className="rounded-full bg-[#007fad]/10 px-2 py-0.5 text-[10px] font-bold text-[#007fad]">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-sm text-[#6b7c84]">{addr.fullAddress}</p>
                {addr.phone && <p className="text-xs text-[#6b7c84]">{addr.phone}</p>}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {!addr.isDefault && (
                  <button
                    type="button"
                    disabled={busyKey === addr._key}
                    onClick={() => handleSetDefault(addr._key)}
                    title="Set as default"
                    className="rounded-lg p-1.5 text-[#6b7c84] hover:bg-[#f6f8f9] hover:text-[#007fad] disabled:opacity-50"
                  >
                    <Star size={16} />
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyKey === addr._key}
                  onClick={() => handleDelete(addr._key)}
                  title="Delete"
                  className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#007fad] hover:underline"
        >
          <Plus size={16} /> Add a new address
        </button>
      ) : (
        <div className="rounded-[10px] border border-black/[0.08] p-4">
          <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
            Label (optional)
          </label>
          <input
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="e.g. Home, Work"
            className={`${fieldClass} mb-3`}
          />

          <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
            Full address
          </label>
          <input
            value={form.fullAddress}
            onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
            className={`${fieldClass} mb-3`}
          />

          <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
            Phone (optional)
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`${fieldClass} mb-4`}
          />

          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving || !form.fullAddress.trim()}
              onClick={handleAdd}
              className="rounded-[10px] bg-[#007fad] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save address"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-[10px] border border-black/[0.08] px-5 py-2.5 text-sm font-semibold text-[#6b7c84]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChangePasswordSection({ email }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendReset() {
    setSending(true);
    await fetch("/api/auth/reset-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setSending(false);
  }

  if (sent) {
    return (
      <div className="rounded-[10px] bg-[#eaf6ea] px-4 py-3 text-sm text-[#2e7d32]">
        If an account exists for {email}, we&apos;ve sent instructions to
        reset your password.
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-[#6b7c84]">
        We&apos;ll send a secure link to your email to set a new password.
      </p>
      <button
        type="button"
        disabled={sending}
        onClick={handleSendReset}
        className="flex items-center gap-2 rounded-[10px] border border-black/[0.08] px-5 py-2.5 text-sm font-semibold text-[#003349] transition-colors hover:border-[#003349] hover:bg-black/[0.03] disabled:opacity-70"
      >
        {sending && <Loader2 size={16} className="animate-spin" />}
        {sending ? "Sending..." : "Send reset link"}
      </button>
    </div>
  );
}