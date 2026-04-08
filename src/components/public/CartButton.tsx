"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import type { StoreStatus } from "@/lib/store-status";

export function CartButton({ storeStatus }: { storeStatus: StoreStatus }) {
  const count = useCart((s) => s.count());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/carrito"
      className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm hover:border-[var(--color-turquoise)]"
      aria-label="Ver carrito"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 3h2l2.4 12.6a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      <span>Carrito</span>
      {mounted && count > 0 && (
        <span className="ml-1 grid place-items-center min-w-5 h-5 rounded-full bg-[var(--color-turquoise)] text-white text-xs px-1">
          {count}
        </span>
      )}
    </Link>
  );
}
