"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Tag,
  ListChecks,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Analytics", icon: LayoutDashboard, href: "/admin" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Categories", icon: Tag, href: "/admin/categories" },
  { label: "Orders", icon: ListChecks, href: "/admin/orders" },
  { label: "Customers", icon: BarChart3, href: "/admin/customers" },
];

const SIDEBAR_BG = "#04374f";
const ACCENT = "#22aaff";

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      style={{ backgroundColor: SIDEBAR_BG }}
      className={`sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden text-white transition-[width] duration-300 ${
        open ? "w-[260px]" : "w-[90px]"
      }`}
    >
      {/* toggle button */}
      <div className="flex justify-end p-3 pb-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* logo */}
      <div className="flex flex-col items-center px-4 pb-4 text-center">
        <span
          className={`font-extrabold tracking-wide text-white transition-all ${
            open ? "text-2xl" : "text-lg"
          }`}
        >
          Vari
        </span>
      </div>

      <div className="mx-4 my-2 border-t border-white/[0.13]" />

      {/* nav */}
      <nav className={`flex-1 overflow-y-auto ${open ? "px-3" : "px-2"}`}>
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`mb-1 flex items-center gap-3 rounded-[14px] py-3 transition-colors ${
                open ? "justify-start px-3" : "justify-center px-1"
              } ${active ? "text-white" : "text-white/75 hover:bg-white/[0.06]"}`}
              style={active ? { backgroundColor: "rgba(34,170,255,0.16)" } : undefined}
            >
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-white/[0.08]">
                <Icon size={19} />
              </span>
              {open && <span className="text-[0.9rem] text-white/80">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* admin + logout */}
      <div
        className={`mx-3 mb-3 flex items-center rounded-[14px] bg-white/[0.05] p-3 ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: ACCENT, color: SIDEBAR_BG }}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full font-bold"
          >
            A
          </div>
          {open && (
            <div className="overflow-hidden">
              <p className="text-[0.85rem] font-semibold text-white">Admin</p>
              <p className="text-[0.72rem] text-white/60">Site Administrator</p>
            </div>
          )}
        </div>

        {open && (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <LogOut size={17} />
          </button>
        )}
      </div>
    </aside>
  );
}