import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/public/ProductCard";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  categoria?: string;
  orden?: string;
  pagina?: string;
}>;

const PAGE_SIZE = 12;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const categoria = sp.categoria;
  const orden = sp.orden ?? "nuevo";
  const pagina = Math.max(1, parseInt(sp.pagina ?? "1", 10) || 1);

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const where = {
    active: true,
    ...(categoria
      ? { category: { slug: categoria } }
      : {}),
  } as const;

  const orderBy =
    orden === "precio-asc"
      ? { price: "asc" as const }
      : orden === "precio-desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
      skip: (pagina - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Catálogo</h1>
      <p className="text-slate-600 mb-8">
        {total} {total === 1 ? "producto" : "productos"}
      </p>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar filtros */}
        <aside className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-slate-500">
              Categoría
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/catalogo"
                  className={!categoria ? "font-semibold text-[var(--color-turquoise-dark)]" : "hover:underline"}
                >
                  Todas
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/catalogo?categoria=${c.slug}`}
                    className={
                      categoria === c.slug
                        ? "font-semibold text-[var(--color-turquoise-dark)]"
                        : "hover:underline"
                    }
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-slate-500">
              Ordenar
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { v: "nuevo", label: "Más nuevo" },
                { v: "precio-asc", label: "Precio: menor a mayor" },
                { v: "precio-desc", label: "Precio: mayor a menor" },
              ].map((o) => {
                const params = new URLSearchParams();
                if (categoria) params.set("categoria", categoria);
                params.set("orden", o.v);
                return (
                  <li key={o.v}>
                    <Link
                      href={`/catalogo?${params.toString()}`}
                      className={
                        orden === o.v
                          ? "font-semibold text-[var(--color-turquoise-dark)]"
                          : "hover:underline"
                      }
                    >
                      {o.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Grid productos */}
        <div>
          {products.length === 0 ? (
            <p className="text-slate-500">No hay productos para mostrar.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={{
                      id: p.id,
                      slug: p.slug,
                      name: p.name,
                      price: p.price,
                      image: p.images[0] ?? null,
                      categoryName: p.category.name,
                    }}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex gap-2 justify-center mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => {
                      const params = new URLSearchParams();
                      if (categoria) params.set("categoria", categoria);
                      if (orden) params.set("orden", orden);
                      params.set("pagina", String(n));
                      return (
                        <Link
                          key={n}
                          href={`/catalogo?${params.toString()}`}
                          className={`w-9 h-9 grid place-items-center rounded-full border text-sm ${
                            n === pagina
                              ? "bg-[var(--color-navy)] text-white border-[var(--color-navy)]"
                              : "border-slate-300 hover:border-[var(--color-turquoise)]"
                          }`}
                        >
                          {n}
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
