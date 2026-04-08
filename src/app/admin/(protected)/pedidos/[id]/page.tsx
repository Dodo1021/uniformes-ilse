import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatMxn, formatDate } from "@/lib/format";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export const dynamic = "force-dynamic";

export default async function AdminPedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pedido</h1>
        <p className="text-sm text-slate-500 font-mono">{order.id}</p>
        <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold mb-3">Cliente</h2>
        <div className="text-sm space-y-1">
          <p>
            <span className="text-slate-500">Nombre:</span> {order.customerName}
          </p>
          <p>
            <span className="text-slate-500">Teléfono:</span> {order.phone}
          </p>
          <p>
            <span className="text-slate-500">Email:</span> {order.email}
          </p>
          <p>
            <span className="text-slate-500">Dirección:</span> {order.address}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold mb-3">Productos</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((it) => (
            <li key={it.id} className="flex justify-between gap-4">
              <span>
                {it.product.name} <span className="text-slate-500">· {it.size} · ×{it.quantity}</span>
              </span>
              <span>{formatMxn(it.price * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatMxn(order.total)}</span>
        </div>
        {order.mpPaymentId && (
          <p className="text-xs text-slate-500 mt-3">
            MP Payment ID: <span className="font-mono">{order.mpPaymentId}</span>
          </p>
        )}
      </div>

      <OrderStatusForm
        orderId={order.id}
        status={order.status}
        tracking={order.tracking}
      />
    </div>
  );
}
