"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import type { StoreStatus } from "@/lib/store-status";
import { formatMxn } from "@/lib/format";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    sizes: string[];
    stock: number;
    categoryName: string;
  };
  storeStatus: StoreStatus;
};

export function ProductDetail({ product, storeStatus }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);

  const enabled = storeStatus === "valid" && product.stock > 0 && !!size;

  const handleAdd = () => {
    if (!enabled || !size) return;
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? null,
      size,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Galería */}
      <div>
        <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden">
          {product.images[activeImage] ? (
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-slate-400">
              Sin imagen
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActiveImage(i)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  i === activeImage
                    ? "border-[var(--color-turquoise)]"
                    : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {product.categoryName}
        </p>
        <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
        <p className="text-2xl font-semibold text-[var(--color-turquoise-dark)] mt-3">
          {formatMxn(product.price)}
        </p>
        <p className="mt-6 text-slate-600 leading-relaxed">
          {product.description}
        </p>

        {product.sizes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Talla</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    s === size
                      ? "border-[var(--color-turquoise)] bg-[var(--color-turquoise)]/10 font-semibold"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Cantidad</h3>
          <div className="inline-flex items-center border border-slate-300 rounded-lg">
            <button
              type="button"
              className="px-3 py-2 text-lg"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="w-10 text-center">{quantity}</span>
            <button
              type="button"
              className="px-3 py-2 text-lg"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-8 relative group">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!enabled}
            className="w-full md:w-auto px-8 py-3 rounded-full font-semibold text-white bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {added ? "✓ Agregado" : "Agregar al carrito"}
          </button>
          {storeStatus !== "valid" && (
            <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Pagos no disponibles aún. La tienda estará activa pronto.
            </p>
          )}
          {storeStatus === "valid" && product.stock === 0 && (
            <p className="mt-3 text-sm text-red-700">Sin stock por el momento.</p>
          )}
        </div>
      </div>
    </div>
  );
}
