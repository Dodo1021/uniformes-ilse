import Link from "next/link";
import type { StoreStatus } from "@/lib/store-status";
import { CartButton } from "./CartButton";

export function Header({ status }: { status: StoreStatus }) {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[var(--color-turquoise)] grid place-items-center text-white font-bold">
            U
          </span>
          <span className="font-semibold tracking-tight text-[var(--color-navy)]">
            Uniformes Ilse
          </span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link
            href="/catalogo"
            className="hover:text-[var(--color-turquoise-dark)]"
          >
            Catálogo
          </Link>
          <Link
            href="/catalogo?categoria=uniformes"
            className="hover:text-[var(--color-turquoise-dark)]"
          >
            Uniformes
          </Link>
          <Link
            href="/catalogo?categoria=zapatos"
            className="hover:text-[var(--color-turquoise-dark)]"
          >
            Zapatos
          </Link>
        </nav>
        <CartButton storeStatus={status} />
      </div>
    </header>
  );
}
