import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStoreStatus, getMpAccountEmail } from "@/lib/store-status";
import { formatMxn } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    ordersCount,
    revenueAgg,
    pendingShipping,
    lowStock,
    mpStatus,
    mpEmail,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, status: "pagado" },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: "pagado" } }),
    prisma.product.count({ where: { stock: { lt: 5 }, active: true } }),
    getStoreStatus(),
    getMpAccountEmail(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {mpStatus !== "valid" && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">
            ⚠️ MercadoPago no está configurado
          </p>
          <p className="text-sm text-amber-800 mt-1">
            La tienda está en modo catálogo. Los clientes pueden ver tus
            productos pero no comprar.
          </p>
          <Link
            href="/admin/configuracion"
            className="inline-block mt-3 text-sm font-semibold text-amber-900 underline"
          >
            Configurar pagos →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pedidos del mes" value={String(ordersCount)} />
        <StatCard
          label="Ingresos del mes"
          value={formatMxn(revenueAgg._sum.total ?? 0)}
        />
        <StatCard
          label="Por enviar"
          value={String(pendingShipping)}
        />
        <StatCard label="Stock bajo" value={String(lowStock)} accent={lowStock > 0} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold mb-2">Estado de MercadoPago</h2>
        {mpStatus === "valid" ? (
          <p className="text-sm text-emerald-700">
            🟢 Pagos activos {mpEmail && `· ${mpEmail}`}
          </p>
        ) : (
          <p className="text-sm text-red-700">
            🔴 No configurado — la tienda está en modo catálogo
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 bg-white ${
        accent ? "border-amber-300" : "border-slate-200"
      }`}
    >
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1 text-[var(--color-navy)]">
        {value}
      </p>
    </div>
  );
}
