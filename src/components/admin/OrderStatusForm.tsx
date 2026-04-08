"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pendiente", "pagado", "enviado", "entregado", "fallido"];

export function OrderStatusForm({
  orderId,
  status: initialStatus,
  tracking: initialTracking,
}: {
  orderId: string;
  status: string;
  tracking: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [tracking, setTracking] = useState(initialTracking ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/admin/pedidos/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, tracking: tracking || null }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-semibold mb-3">Estado del pedido</h2>
      <div className="space-y-3">
        <label className="block text-sm">
          <span className="font-medium">Estado</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 capitalize"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        {status === "enviado" && (
          <label className="block text-sm">
            <span className="font-medium">Número de guía</span>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="Ej. ABC123XYZ"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-[var(--color-navy)] text-white px-5 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {saving ? "Guardando…" : saved ? "✓ Guardado" : "Actualizar"}
        </button>
      </div>
    </div>
  );
}
