"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="bg-[var(--color-navy)] text-white p-5 flex flex-col">
      <Link href="/admin" className="flex items-center gap-2 mb-8">
        <span className="w-8 h-8 rounded-full bg-[var(--color-turquoise)] grid place-items-center font-bold">
          U
        </span>
        <span className="font-semibold">Uniformes Ilse</span>
      </Link>

      <nav className="space-y-1 text-sm">
        {NAV.map((n) => {
          const active = n.exact
            ? pathname === n.href
            : pathname?.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`block px-3 py-2 rounded-lg ${
                active
                  ? "bg-white/15 font-semibold"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 space-y-2 text-xs">
        <Link
          href="/"
          className="block text-white/60 hover:text-white"
          target="_blank"
        >
          ↗ Ver tienda pública
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="block text-white/60 hover:text-white"
        >
          ← Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
