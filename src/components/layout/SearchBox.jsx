"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, Tag } from "lucide-react";
import { urlFor } from "../../sanity/lib/image";

const STATIC_PAGES = [
    { title: "Home", path: "/", keywords: ["home", "homepage", "main"] },
    { title: "All Products", path: "/products", keywords: ["products", "shop", "catalog"] },
    { title: "My Account", path: "/account", keywords: ["account", "profile"] },
    { title: "Shopping Cart", path: "/cart", keywords: ["cart", "bag", "basket"] },
    { title: "Checkout", path: "/checkout", keywords: ["checkout", "payment"] },
    { title: "Login", path: "/login", keywords: ["login", "sign in", "signin"] },
];

function matchingPages(term) {
    const lower = term.toLowerCase();
    return STATIC_PAGES.filter((page) => {
        const title = page.title.toLowerCase();
        const titleWords = title.split(" ");
        const matchesTitle = title.includes(lower) || titleWords.some((w) => w.includes(lower));
        const matchesKeyword = page.keywords.some((k) => k.includes(lower) || lower.includes(k));
        return matchesTitle || matchesKeyword;
    });
}

export default function SearchBox({ variant = "desktop" }) {
    const router = useRouter();
    const [term, setTerm] = useState("");
    const [debounced, setDebounced] = useState("");
    const [results, setResults] = useState({ products: [], categories: [] });

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    const pages = debounced ? matchingPages(debounced) : [];  

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(term.trim()), 250);
        return () => clearTimeout(timer);
    }, [term]);

    useEffect(() => {
        if (!debounced) {
            setResults({ products: [], categories: [] });
            return;
        }
        let cancelled = false;
        setLoading(true);
        fetch(`/api/search?q=${encodeURIComponent(debounced)}`)
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled) setResults(data);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [debounced]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function goToResults(query) {
        const trimmed = query.trim();
        if (!trimmed) return;
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        setTerm("");
        setOpen(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") goToResults(term);
        if (e.key === "Escape") setOpen(false);
    }


    const hasResults = results.products.length > 0 || results.categories.length > 0 || pages.length > 0;
    const showDropdown = open && term.trim().length > 0;

    return (
        <div ref={boxRef} className="relative w-full">
            <div className="flex items-center gap-2 rounded-full border border-black/[0.12] bg-white px-4 py-2">
                <input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#6b7c84]"
                />
                <button type="button" onClick={() => goToResults(term)} aria-label="Search">
                    <Search size={18} className="text-[#007fad]" />
                </button>
            </div>

            {showDropdown && (
                <div
                    className={`absolute left-0 top-[calc(100%+8px)] z-50 max-h-[420px] w-full overflow-y-auto rounded-[16px] border border-black/[0.08] bg-white shadow-[0_8px_24px_rgba(0,51,73,0.12)] ${variant === "mobile" ? "" : "min-w-[360px]"
                        }`}
                >
                    {loading && (
                        <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#6b7c84]">
                            <Loader2 size={16} className="animate-spin" />
                            Searching...
                        </div>
                    )}

                    {!loading && !hasResults && (
                        <p className="px-4 py-8 text-center text-sm text-[#6b7c84]">
                            No results for &quot;{term}&quot;
                        </p>
                    )}

                    {!loading && hasResults && (
                        <>
                            {results.categories.length > 0 && (
                                <div className="p-2">
                                    <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#6b7c84]">
                                        Categories
                                    </p>
                                    {results.categories.map((cat) => (
                                        <Link
                                            key={cat._id}
                                            href={`/products?category=${cat.slug}`}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[#f6f8f9]"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007fad]/10 text-[#007fad]">
                                                <Tag size={16} />
                                            </span>
                                            <span className="text-sm font-semibold text-[#1a2b33]">{cat.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {results.products.length > 0 && (
                                <div className="border-t border-black/[0.06] p-2">
                                    <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#6b7c84]">
                                        Products
                                    </p>
                                    {results.products.map((p) => (
                                        <Link
                                            key={p._id}
                                            href={`/product/${p.slug}`}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[#f6f8f9]"
                                        >
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/[0.06] bg-white">
                                                {p.image && (
                                                    <Image
                                                        src={urlFor(p.image).width(80).url()}
                                                        alt={p.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-[#1a2b33]">{p.name}</p>
                                                <p className="text-xs text-[#6b7c84]">${p.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {pages.length > 0 && (
                                <div className="border-t border-black/[0.06] p-2">
                                    <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#6b7c84]">
                                        Pages
                                    </p>
                                    {pages.map((page) => (
                                        <Link
                                            key={page.path}
                                            href={page.path}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[#f6f8f9]"
                                        >
                                            <span className="text-sm font-semibold text-[#1a2b33]">{page.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => goToResults(term)}
                                className="w-full border-t border-black/[0.06] py-3 text-center text-sm font-bold text-[#007fad] hover:bg-[#f6f8f9]"
                            >
                                See all results for &quot;{term}&quot;
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}