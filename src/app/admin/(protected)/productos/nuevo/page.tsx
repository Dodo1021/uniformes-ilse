import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Nuevo producto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
