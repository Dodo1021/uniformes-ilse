import Link from "next/link";
import Image from "next/image";
import { formatMxn } from "@/lib/format";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  categoryName?: string;
};

export function ProductCard({ p }: { p: ProductCardData }) {
  return (
    <Link
      href={`/producto/${p.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-[var(--color-turquoise)] hover:shadow-md transition"
    >
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        {p.image ? (
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-slate-400 text-sm">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-4">
        {p.categoryName && (
          <p className="text-xs text-slate-500 uppercase tracking-wide">
            {p.categoryName}
          </p>
        )}
        <h3 className="font-medium text-[var(--color-navy)] line-clamp-2 mt-1">
          {p.name}
        </h3>
        <p className="mt-2 font-semibold text-[var(--color-turquoise-dark)]">
          {formatMxn(p.price)}
        </p>
      </div>
    </Link>
  );
}
