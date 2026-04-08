import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStoreStatus } from "@/lib/store-status";
import { ProductDetail } from "@/components/public/ProductDetail";
import { ProductCard } from "@/components/public/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.active) notFound();

  const [related, status] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: { category: true },
    }),
    getStoreStatus(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ProductDetail
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          sizes: product.sizes,
          stock: product.stock,
          categoryName: product.category.name,
        }}
        storeStatus={status}
      />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6">También te puede interesar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
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
      )}
    </div>
  );
}
