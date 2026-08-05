"use client";

import { signOut } from "next-auth/react";
import { User, Receipt, Star, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "orders", label: "Orders", icon: Receipt },
  { key: "points", label: "My Points", icon: Star },
];

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AccountSidebar({ customer, activeTab, onTabChange }) {
  return (
    <div className="w-full flex-shrink-0 rounded-[18px] border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,51,73,0.04),0_8px_24px_rgba(0,51,73,0.06)] md:sticky md:top-6 md:w-[260px]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#007fad]/10 font-bold text-[#003349]">
          {initials(customer.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-[#1a2b33]">
            {customer.name || "My Account"}
          </p>
          <p className="truncate text-xs text-[#6b7c84]">{customer.email}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onTabChange(key)}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-sm transition-colors ${
                active
                  ? "bg-[#007fad]/[0.08] font-bold text-[#003349]"
                  : "font-medium text-[#6b7c84] hover:bg-[#f6f8f9]"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      <hr className="my-4 border-black/[0.08]" />

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
      >
        <LogOut size={18} />
        Log out
      </button>
    </div>
  );
}