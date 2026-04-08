import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStoreStatus } from "@/lib/store-status";
import { getPreferenceClient } from "@/lib/mp";

export const runtime = "nodejs";

type IncomingItem = {
  productId: string;
  size: string;
  quantity: number;
};

export async function POST(req: Request) {
  const status = await getStoreStatus();
  if (status !== "valid") {
    return NextResponse.json(
      { error: "La tienda no acepta pagos en este momento" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const customerName = String(body.customerName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const address = String(body.address ?? "").trim();
  const incoming = (body.items ?? []) as IncomingItem[];

  if (!customerName || !phone || !email || !address || incoming.length === 0) {
    return NextResponse.json(
      { error: "Datos incompletos" },
      { status: 400 }
    );
  }

  // Validate items against current product data
  const productIds = incoming.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  const orderItemsData: {
    productId: string;
    size: string;
    quantity: number;
    price: number;
  }[] = [];
  const mpItems: {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }[] = [];

  for (const item of incoming) {
    const p = productMap.get(item.productId);
    if (!p) {
      return NextResponse.json(
        { error: `Producto no disponible: ${item.productId}` },
        { status: 400 }
      );
    }
    const qty = Math.max(1, Math.floor(item.quantity));
    if (p.stock < qty) {
      return NextResponse.json(
        { error: `Stock insuficiente para ${p.name}` },
        { status: 400 }
      );
    }
    total += p.price * qty;
    orderItemsData.push({
      productId: p.id,
      size: item.size,
      quantity: qty,
      price: p.price,
    });
    mpItems.push({
      id: p.id,
      title: `${p.name} (talla ${item.size})`,
      quantity: qty,
      unit_price: p.price,
      currency_id: "MXN",
    });
  }

  const order = await prisma.order.create({
    data: {
      customerName,
      phone,
      email,
      address,
      total,
      status: "pendiente",
      items: { create: orderItemsData },
    },
  });

  const baseUrl =
    process.env.NEXTAUTH_URL ??
    `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host")}`;

  try {
    const preferenceClient = await getPreferenceClient();
    const preference = await preferenceClient.create({
      body: {
        items: mpItems,
        payer: { name: customerName, email },
        external_reference: order.id,
        back_urls: {
          success: `${baseUrl}/pedido/exitoso?order=${order.id}`,
          failure: `${baseUrl}/pedido/fallido?order=${order.id}`,
          pending: `${baseUrl}/pedido/pendiente?order=${order.id}`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/webhooks/mp`,
      },
    });

    return NextResponse.json({
      init_point: preference.init_point,
      orderId: order.id,
    });
  } catch (err) {
    console.error("MP preference error", err);
    return NextResponse.json(
      { error: "No se pudo crear la preferencia de pago" },
      { status: 500 }
    );
  }
}
