import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/public/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[var(--color-navy)] via-[#26395C] to-[var(--color-turquoise-dark)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[var(--color-turquoise)] uppercase tracking-widest text-xs font-semibold mb-3">
              Hecho en México
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Uniformes quirúrgicos y zapatos de hospital
            </h1>
            <p className="mt-4 text-white/80 max-w-md">
              Calidad profesional para personal médico. Telas antifluidos,
              calzado antiderrapante y entregas a todo México.
            </p>
            <Link
              href="/catalogo"
              className="inline-block mt-8 rounded-full bg-[var(--color-turquoise)] hover:bg-[var(--color-turquoise-dark)] text-white px-8 py-3 font-semibold"
            >
              Ver catálogo
            </Link>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur" />
            <div className="aspect-square rounded-2xl bg-white/5 backdrop-blur translate-y-8" />
            <div className="aspect-square rounded-2xl bg-white/5 backdrop-blur" />
            <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur translate-y-8" />
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Nuestras categorías
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalogo?categoria=${c.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-[var(--color-turquoise)] aspect-[16/7] bg-gradient-to-br from-slate-100 to-slate-200 grid place-items-center"
            >
              <h3 className="text-2xl font-semibold text-[var(--color-navy)] group-hover:text-[var(--color-turquoise-dark)] transition">
                {c.name} →
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Productos destacados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((p) => (
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
      </section>

      {/* Trust bar */}
      <section className="bg-[var(--color-cream)] mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl">🚚</div>
            <h4 className="font-semibold mt-2">Envíos a todo México</h4>
            <p className="text-sm text-slate-600">
              Recibe en 2-5 días hábiles según tu ubicación.
            </p>
          </div>
          <div>
            <div className="text-3xl">🧵</div>
            <h4 className="font-semibold mt-2">Calidad profesional</h4>
            <p className="text-sm text-slate-600">
              Telas antifluidos y costuras reforzadas.
            </p>
          </div>
          <div>
            <div className="text-3xl">🔒</div>
            <h4 className="font-semibold mt-2">Pagos seguros</h4>
            <p className="text-sm text-slate-600">
              Procesados por MercadoPago: tarjeta, OXXO y MSI.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
