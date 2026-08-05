"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

const fieldClass =
  "w-full rounded-[10px] border border-black/[0.08] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#007fad]";

export default function ProfileTab({ customer, onUpdated }) {
  const [name, setName] = useState(customer.name || "");
  const [phone, setPhone] = useState(customer.phone || "");
  const [address, setAddress] = useState(customer.address || "");
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
      body: JSON.stringify({ name, phone, address }),
    });

    if (!res.ok) {
      setError("Something went wrong while saving. Please try again.");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
    onUpdated({ ...customer, name, phone, address });
  }

  return (
    <div className="max-w-[480px]">
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
        className={`${fieldClass} mb-4`}
      />

      <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
        Address
      </label>
      <textarea
        rows={2}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
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

      <h3 className="mb-1 font-bold text-[#003349]">Password</h3>
      <ChangePasswordSection email={customer.email} />
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