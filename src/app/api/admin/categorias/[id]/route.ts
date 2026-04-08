import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0)
    return NextResponse.json(
      { error: "No se puede eliminar: la categoría tiene productos" },
      { status: 409 }
    );

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
