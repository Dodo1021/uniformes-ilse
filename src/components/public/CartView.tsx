"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatMxn } from "@/lib/format";
import type { StoreStatus } from "@/lib/store-status";

export function CartView({ storeStatus }: { storeStatus: StoreStatus }) {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const total = useCart((s) => s.total());

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="text-slate-500">Cargando…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 mb-6">Tu carrito está vacío.</p>
        <Link
          href="/catalogo"
          className="inline-block rounded-full bg-[var(--color-navy)] text-white px-6 py-3 font-semibold"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-4">
        {items.map((i) => (
          <div
            key={i.productId + i.size}
            className="flex gap-4 border border-slate-200 rounded-2xl p-4"
          >
            <div className="relative w-24 h-24 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
              {i.image && (
                <Image src={i.image} alt={i.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--color-navy)] line-clamp-2">
                {i.name}
              </h3>
              <p className="text-sm text-slate-500">Talla: {i.size}</p>
              <p className="text-sm font-semibold mt-1">{formatMxn(i.price)}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="inline-flex items-center border border-slate-300 rounded-lg">
                  <button
                    className="px-2 py-1"
                    onClick={() =>
                      setQuantity(i.productId, i.size, i.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{i.quantity}</span>
                  <button
                    className="px-2 py-1"
                    onClick={() =>
                      setQuantity(i.productId, i.size, i.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => remove(i.productId, i.size)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="border border-slate-200 rounded-2xl p-6 h-fit sticky top-24">
        <h2 className="font-semibold mb-4">Resumen</h2>
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Subtotal</span>
          <span>{formatMxn(total)}</span>
        </div>
        <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatMxn(total)}</span>
        </div>

        {storeStatus === "valid" ? (
          <Link
            href="/checkout"
            className="mt-6 block text-center w-full rounded-full bg-[var(--color-navy)] text-white px-6 py-3 font-semibold hover:bg-[var(--color-navy-light)]"
          >
            Proceder al pago
          </Link>
        ) : (
          <div className="mt-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Esta tienda aún no tiene pagos configurados. Vuelve pronto.
          </div>
        )}
      </aside>
    </div>
  );
}
