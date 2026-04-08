"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Cat = { id: string; name: string; slug: string; productCount: number };

export function CategoriasManager({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    setBusy(false);
    if (res.ok) {
      setName("");
      setSlug("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error al crear");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    const res = await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "No se pudo eliminar");
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={create}
        className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3"
      >
        <h2 className="font-semibold">Nueva categoría</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-url"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
          />
        </div>
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="rounded-full bg-[var(--color-navy)] text-white px-4 py-1.5 text-sm font-semibold disabled:opacity-50"
        >
          Crear
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {initial.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 font-mono text-slate-600">{c.slug}</td>
                <td className="px-4 py-3">{c.productCount}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => remove(c.id)}
                    disabled={c.productCount > 0}
                    className="text-red-700 hover:underline disabled:text-slate-400 disabled:no-underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
