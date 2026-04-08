import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  let baseSlug = slugify(body.name);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${baseSlug}-${n}`;
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      description: body.description,
      price: Number(body.price),
      stock: Number(body.stock),
      categoryId: body.categoryId,
      images: body.images ?? [],
      sizes: body.sizes ?? [],
      active: body.active ?? true,
    },
  });

  return NextResponse.json(product);
}
