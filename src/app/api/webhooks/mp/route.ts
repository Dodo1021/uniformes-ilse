import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentClient } from "@/lib/mp";

export const runtime = "nodejs";

function mapStatus(mpStatus: string | undefined): string {
  switch (mpStatus) {
    case "approved":
      return "pagado";
    case "pending":
    case "in_process":
    case "authorized":
      return "pendiente";
    case "rejected":
    case "cancelled":
    case "refunded":
    case "charged_back":
      return "fallido";
    default:
      return "pendiente";
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const queryType = url.searchParams.get("type") ?? url.searchParams.get("topic");
    const queryId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

    let type = queryType;
    let id = queryId;

    const body = await req.json().catch(() => null);
    if (body?.type) type = body.type;
    if (body?.data?.id) id = String(body.data.id);

    if (type !== "payment" || !id) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const paymentClient = await getPaymentClient();
    const payment = await paymentClient.get({ id });

    const externalRef = payment.external_reference;
    if (!externalRef) {
      return NextResponse.json({ ok: true, noRef: true });
    }

    const newStatus = mapStatus(payment.status);

    await prisma.order.update({
      where: { id: externalRef },
      data: {
        status: newStatus,
        mpPaymentId: String(payment.id ?? id),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error", err);
    // Return 200 anyway so MP doesn't retry forever; logs will show the issue
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
