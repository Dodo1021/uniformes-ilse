import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const slug = slugify(String(body.slug ?? body.name ?? ""));
  if (!name || !slug)
    return NextResponse.json({ error: "Nombre y slug requeridos" }, { status: 400 });

  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists)
    return NextResponse.json({ error: "Ese slug ya existe" }, { status: 409 });

  const category = await prisma.category.create({ data: { name, slug } });
  return NextResponse.json(category);
}
