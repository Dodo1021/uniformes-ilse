"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatMxn } from "@/lib/format";

export function CheckoutForm() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      customerName: formData.get("customerName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      items: items.map((i) => ({
        productId: i.productId,
        size: i.size,
        quantity: i.quantity,
      })),
    };

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data.error ?? "No se pudo iniciar el pago");
      }
      window.location.href = data.init_point;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-slate-600">
        Tu carrito está vacío.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Field name="customerName" label="Nombre completo" required />
        <Field name="phone" label="Teléfono" required />
        <Field name="email" label="Email" type="email" required className="md:col-span-2" />
        <Field name="address" label="Dirección completa" required className="md:col-span-2" textarea />
      </div>

      <div className="border border-slate-200 rounded-2xl p-6">
        <h2 className="font-semibold mb-3">Resumen del pedido</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li
              key={i.productId + i.size}
              className="flex justify-between gap-4"
            >
              <span>
                {i.name} <span className="text-slate-500">· {i.size} · ×{i.quantity}</span>
              </span>
              <span>{formatMxn(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatMxn(total)}</span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-[var(--color-navy)] text-white px-6 py-3 font-semibold hover:bg-[var(--color-navy-light)] disabled:opacity-50"
      >
        {submitting ? "Redirigiendo a MercadoPago…" : "Pagar con MercadoPago"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
  className = "",
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="font-medium text-[var(--color-navy)]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:border-[var(--color-turquoise)]"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:border-[var(--color-turquoise)]"
        />
      )}
    </label>
  );
}
