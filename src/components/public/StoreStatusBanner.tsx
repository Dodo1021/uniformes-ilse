import type { StoreStatus } from "@/lib/store-status";

export function StoreStatusBanner({ status }: { status: StoreStatus }) {
  if (status === "valid") return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 text-center">
        🔧 Tienda en configuración — el catálogo ya está disponible, los pagos
        estarán activos pronto.
      </div>
    </div>
  );
}
