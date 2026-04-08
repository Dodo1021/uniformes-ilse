import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatMxn } from "@/lib/format";
import { ClearCartOnMount } from "@/components/public/ClearCartOnMount";

const COPIES = {
  exitoso: {
    icon: "✅",
    title: "¡Gracias por tu compra!",
    body: "Recibimos tu pedido correctamente. Te contactaremos por correo con los detalles del envío.",
  },
  pendiente: {
    icon: "⏳",
    title: "Tu pago está siendo procesado",
    body: "Si elegiste OXXO, recibirás las instrucciones por correo. En cuanto se confirme, te avisaremos.",
  },
  fallido: {
    icon: "⚠️",
    title: "No pudimos procesar tu pago",
    body: "Algo salió mal con la transacción. Puedes intentarlo de nuevo desde tu carrito.",
  },
} as const;

export default async function PedidoStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ status: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { status } = await params;
  const sp = await searchParams;
  if (!(status in COPIES)) notFound();
  const copy = COPIES[status as keyof typeof COPIES];

  const order = sp.order
    ? await prisma.order.findUnique({
        where: { id: sp.order },
        include: { items: { include: { product: true } } },
      })
    : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      {status === "exitoso" && <ClearCartOnMount />}
      <div className="text-6xl">{copy.icon}</div>
      <h1 className="text-3xl font-bold mt-4">{copy.title}</h1>
      <p className="text-slate-600 mt-3">{copy.body}</p>

      {order && (
        <div className="mt-8 text-left border border-slate-200 rounded-2xl p-6">
          <p className="text-sm text-slate-500">Número de pedido</p>
          <p className="font-mono text-sm">{order.id}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map((it) => (
              <li key={it.id} className="flex justify-between gap-4">
                <span>
                  {it.product.name} · {it.size} · ×{it.quantity}
                </span>
                <span>{formatMxn(it.price * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatMxn(order.total)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3 justify-center">
        <Link
          href="/catalogo"
          className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium hover:border-[var(--color-turquoise)]"
        >
          Seguir comprando
        </Link>
        {status === "fallido" && (
          <Link
            href="/carrito"
            className="rounded-full bg-[var(--color-navy)] text-white px-5 py-2 text-sm font-medium"
          >
            Volver al carrito
          </Link>
        )}
      </div>
    </div>
  );
}
