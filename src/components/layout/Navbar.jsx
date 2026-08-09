"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu, X, Search, ShoppingCart, ChevronDown, ChevronUp, User, Globe,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import SearchBox from "./SearchBox";
import CartMenu from "./CartMenu";



const NAV_LINKS = [
  { label: "Collections", href: "/collections" },
  { label: "Workplace", href: "/workplace" },
  { label: "Help", href: "/help" },
];

export default function Navbar({ categories = [] }) {
  const router = useRouter();
  const { itemCount } = useCart();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = !!session?.user?.isAdmin;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const productsMenuRef = useRef(null);
  const accountMenuRef = useRef(null);

  const [livePoints, setLivePoints] = useState(session?.user?.points || 0);

  useEffect(() => {
    if (!session?.user) return;

    fetch("/api/customer/points")
      .then((res) => res.json())
      .then((data) => setLivePoints(data.points))
      .catch(() => { });
  }, [session?.user]);

  useEffect(() => {
    if (!productsMenuOpen && !accountMenuOpen) return;
    function handleClickOutside(event) {
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target)) {
        setProductsMenuOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [productsMenuOpen, accountMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setProductsExpanded(false);
  }

  function handleSearchSubmit(term) {
    const trimmed = term.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchTerm("");
    closeMobileMenu();
  }

  function handleAccountClick() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setAccountMenuOpen((prev) => !prev);
  }

  function handleMobileAccountClick() {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push(isAdmin ? "/admin" : "/account");
    }
    closeMobileMenu();
  }

  return (
    <>

      <div className="bg-[#003349] px-4 py-1.5 text-white sm:py-1">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-0.5 sm:flex-row">
          {isAuthenticated ? (
            <Link href="/account" className="text-[11px] underline underline-offset-2 sm:text-sm">
              ⭐ YOU HAVE {livePoints ?? 0} POINTS — REDEEM AT CHECKOUT
            </Link>
          ) : (
            <Link href="/login" className="text-[11px] underline underline-offset-2 sm:text-sm">
              🎁 SIGN UP TODAY &amp; GET 50 POINTS INSTANTLY
            </Link>
          )}

          <div className="flex items-center gap-1.5">
            <Link href="#" className="text-[10px] underline underline-offset-2 sm:text-sm">
              FREE SHIPPING
            </Link>
            <span className="text-[10px] sm:text-sm">+</span>
            <Link href="#" className="text-[10px] underline underline-offset-2 sm:text-sm">
              FREE RETURNS
            </Link>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-2 py-2 sm:px-4 md:min-h-20 md:py-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-center p-2 text-[#007fad] lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>

            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="Vari"
                width={110}
                height={47}
                className="h-auto w-[65px] sm:w-[85px] lg:w-[100px]"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 flex-col gap-1 py-2 pl-8 lg:flex">
            <div className="flex items-center justify-end mb-3">
              <div className="flex items-center gap-6">
                <div ref={accountMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={handleAccountClick}
                    className="flex items-center gap-1.5 text-sm font-medium text-black hover:text-[#007fad]"
                  >
                    <User size={20} className="text-[#007fad]" />
                    {isAuthenticated ? session.user.name : "My Account"}
                  </button>

                  {isAuthenticated && accountMenuOpen && (
                    <div className="absolute right-0 top-full z-20 min-w-[180px] border border-black/10 bg-white py-2 shadow-lg">
                      <Link
                        href={isAdmin ? "/admin" : "/account"}
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-black hover:bg-[#f0f0f0] hover:text-[#007fad]"
                      >
                        {isAdmin ? "Admin Dashboard" : "My Account"}
                      </Link>
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full px-4 py-2 text-left text-sm text-black hover:bg-[#f0f0f0] hover:text-[#007fad]"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-medium text-black hover:text-[#007fad]"
                >
                  <Globe size={20} className="text-[#007fad]" />
                  United States
                  <ChevronDown size={16} />
                </button>

                <span className="text-sm font-semibold text-black">
                  +1 (800) 207-2587
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div ref={productsMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setProductsMenuOpen((prev) => !prev)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-black hover:text-[#007fad]"
                  >
                    Products
                    <ChevronDown size={16} />
                  </button>

                  {productsMenuOpen && (
                    <div className="absolute left-0 top-full z-20 min-w-[220px] border border-black/10 bg-white py-2 shadow-lg">
                      {categories.length === 0 && (
                        <p className="px-4 py-2 text-sm text-black/50">
                          No categories available yet
                        </p>
                      )}
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/products?category=${category.slug}`}
                          onClick={() => setProductsMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-black hover:bg-[#f0f0f0] hover:text-[#007fad]"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-black hover:text-[#007fad]"
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/deals"
                  className="px-3 py-2 text-sm font-semibold text-[#1f8a3d] hover:text-[#166b2f]"
                >
                  Deals
                </Link>
              </div>

              <div className="w-[260px]">
                <div className="flex items-center border-2 border-[#007fad] focus-within:border-[#22aaff]">
                  <SearchBox variant="desktop" />
                </div>
              </div>
            </div>
          </div>

          {/* Cart */}
          <CartMenu className="ml-12" />


        </div>
      </div>

      {/* Mobile Menu (Drawer) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMobileMenu}
          />

          <div className="absolute inset-y-0 left-0 flex w-[280px] flex-col overflow-y-auto bg-white">
            <div className="flex items-center justify-between px-4 py-3">
              <Link href="/" onClick={closeMobileMenu}>
                <Image
                  src="/images/logo.svg"
                  alt="Vari"
                  width={110}
                  height={47}
                  className="h-auto w-20"
                />
              </Link>
              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-4 pb-3">
              <div className="flex items-center border-2 border-[#007fad]">
                <SearchBox variant="mobile" />
              </div>
            </div>

            <hr className="border-black/10" />

            <nav className="flex flex-col">
              <button
                type="button"
                onClick={() => setProductsExpanded((prev) => !prev)}
                className="flex items-center justify-between px-4 py-3 text-left text-[15px] font-medium text-black"
              >
                Products
                {productsExpanded ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {productsExpanded && (
                <div className="flex flex-col bg-[#fafafa]">
                  {categories.length === 0 && (
                    <p className="px-8 py-2 text-sm text-black/50">
                      No categories available yet
                    </p>
                  )}
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/products?category=${category.slug}`}
                      onClick={closeMobileMenu}
                      className="px-8 py-2 text-sm text-black"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="px-4 py-3 text-[15px] font-medium text-black"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/deals"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-[15px] font-semibold text-[#1f8a3d]"
              >
                Deals
              </Link>
            </nav>

            <hr className="border-black/10" />

            <div className="flex flex-col gap-3 px-4 py-3">
              <button
                type="button"
                onClick={handleMobileAccountClick}
                className="flex items-center gap-2.5 text-[15px] font-medium text-black"
              >
                <User size={20} className="text-[#007fad]" />
                {isAuthenticated ? session.user.name : "My Account"}
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    closeMobileMenu();
                  }}
                  className="flex items-center gap-2.5 text-[15px] font-medium text-black"
                >
                  Sign Out
                </button>
              )}

              <button type="button" className="flex items-center gap-2.5 text-[15px] font-medium text-black">
                <Globe size={20} className="text-[#007fad]" />
                United States
              </button>

              <span className="text-[15px] font-semibold text-black">
                +1 (800) 207-2587
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}