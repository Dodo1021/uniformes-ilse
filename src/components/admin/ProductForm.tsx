"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  sizes: string[];
  stock: number;
  active: boolean;
};

const SIZE_PRESETS: Record<string, string[]> = {
  uniformes: ["XS", "S", "M", "L", "XL", "XXL"],
  zapatos: ["22", "23", "24", "24.5", "25", "25.5", "26", "27"],
};

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? categories[0]?.id ?? ""
  );
  const [active, setActive] = useState(product?.active ?? true);
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const sizeOptions =
    (selectedCategory && SIZE_PRESETS[selectedCategory.slug]) ?? [];

  const toggleSize = (s: string) => {
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (data.url) uploaded.push(data.url);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
  };

  const moveImage = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    [next[from], next[to]] = [next[to], next[from]];
    setImages(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId,
        sizes,
        images,
        active,
      };
      const res = await fetch(
        isEdit ? `/api/admin/productos/${product!.id}` : "/api/admin/productos",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al guardar");
      }
      router.push("/admin/productos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer."))
      return;
    setSubmitting(true);
    const res = await fetch(`/api/admin/productos/${product.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/productos");
      router.refresh();
    } else {
      setError("No se pudo eliminar");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border border-slate-200 rounded-2xl p-6"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block text-sm md:col-span-2">
          <span className="font-medium">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="font-medium">Descripción</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Precio (MXN)</span>
          <input
            type="number"
            min={0}
            step="1"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Stock</span>
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="font-medium">Categoría</span>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSizes([]);
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Tallas disponibles</h3>
        {sizeOptions.length === 0 ? (
          <p className="text-xs text-slate-500">
            La categoría seleccionada no tiene tallas predefinidas.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleSize(s)}
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  sizes.includes(s)
                    ? "border-[var(--color-turquoise)] bg-[var(--color-turquoise)]/10 font-semibold"
                    : "border-slate-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Imágenes</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group"
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 grid place-items-center gap-1 transition">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(i, -1)}
                    disabled={i === 0}
                    className="bg-white text-xs rounded px-2 py-0.5 disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    disabled={i === images.length - 1}
                    className="bg-white text-xs rounded px-2 py-0.5 disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="bg-red-600 text-white text-xs rounded px-2 py-0.5"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 grid place-items-center text-slate-500 text-xs cursor-pointer hover:border-[var(--color-turquoise)]">
            {uploading ? "Subiendo…" : "+ Agregar"}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        <span>Producto activo (visible en la tienda)</span>
      </label>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[var(--color-navy)] text-white px-6 py-2 font-semibold disabled:opacity-50"
        >
          {submitting ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="rounded-full border border-red-300 text-red-700 px-6 py-2 font-semibold hover:bg-red-50"
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
}
