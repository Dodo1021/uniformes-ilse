import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMxn, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUSES = ["pendiente", "pagado", "enviado", "entregado", "fallido"];

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const orders = await prisma.order.findMany({
    where: estado ? { status: estado } : {},
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pedidos</h1>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin/pedidos"
          className={`px-3 py-1 rounded-full border ${
            !estado
              ? "bg-[var(--color-navy)] text-white border-[var(--color-navy)]"
              : "border-slate-300 hover:border-[var(--color-turquoise)]"
          }`}
        >
          Todos
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?estado=${s}`}
            className={`px-3 py-1 rounded-full border capitalize ${
              estado === s
                ? "bg-[var(--color-navy)] text-white border-[var(--color-navy)]"
                : "border-slate-300 hover:border-[var(--color-turquoise)]"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(o.createdAt)}
                </td>
                <td className="px-4 py-3 font-medium">{o.customerName}</td>
                <td className="px-4 py-3 text-slate-600">{o.items.length}</td>
                <td className="px-4 py-3">{formatMxn(o.total)}</td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/pedidos/${o.id}`}
                    className="text-[var(--color-turquoise-dark)] hover:underline"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                  No hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
