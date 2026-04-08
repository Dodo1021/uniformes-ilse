import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set([
  "pendiente",
  "pagado",
  "enviado",
  "entregado",
  "fallido",
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const data: { status?: string; tracking?: string | null } = {};
  if (body.status) {
    if (!ALLOWED.has(body.status))
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    data.status = body.status;
  }
  if ("tracking" in body) {
    data.tracking = body.tracking || null;
  }

  const order = await prisma.order.update({ where: { id }, data });
  return NextResponse.json(order);
}
