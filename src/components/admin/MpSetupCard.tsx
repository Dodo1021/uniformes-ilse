"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MpTutorial } from "./MpTutorial";
import type { StoreStatus } from "@/lib/store-status";

type Props = {
  initialStatus: StoreStatus;
  accountEmail: string | null;
  maskedToken: string | null;
};

export function MpSetupCard({
  initialStatus,
  accountEmail,
  maskedToken,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<StoreStatus>(initialStatus);
  const [email, setEmail] = useState<string | null>(accountEmail);
  const [masked, setMasked] = useState<string | null>(maskedToken);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/mp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("valid");
        setEmail(data.email ?? null);
        setMasked(data.maskedToken ?? null);
        setToken("");
        setEditing(false);
        router.refresh();
      } else {
        setStatus("invalid");
        setError(data.error ?? "Error al verificar");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setVerifying(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("¿Desconectar MercadoPago? La tienda volverá a modo catálogo."))
      return;
    setVerifying(true);
    try {
      await fetch("/api/admin/mp/disconnect", { method: "POST" });
      setStatus("unconfigured");
      setEmail(null);
      setMasked(null);
      router.refresh();
    } finally {
      setVerifying(false);
    }
  };

  const showForm = status !== "valid" || editing;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Pagos con MercadoPago</h2>
          <div className="mt-2">
            {status === "valid" && (
              <Badge color="emerald">
                🟢 Pagos activos — e-commerce habilitado
              </Badge>
            )}
            {status === "unconfigured" && (
              <Badge color="red">
                🔴 Pagos no configurados — la tienda está en modo catálogo
              </Badge>
            )}
            {status === "invalid" && (
              <Badge color="red">🔴 Token inválido</Badge>
            )}
          </div>
        </div>
      </div>

      {status === "valid" && !editing && (
        <div className="text-sm space-y-2">
          {email && (
            <p>
              <span className="text-slate-500">Cuenta:</span>{" "}
              <span className="font-medium">{email}</span>
            </p>
          )}
          {masked && (
            <p>
              <span className="text-slate-500">Token:</span>{" "}
              <span className="font-mono">{masked}</span>
            </p>
          )}
          <div className="pt-3 flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="rounded-full border border-slate-300 px-4 py-1.5 text-sm hover:border-[var(--color-turquoise)]"
            >
              Actualizar token
            </button>
            <button
              onClick={handleDisconnect}
              disabled={verifying}
              className="rounded-full border border-red-300 text-red-700 px-4 py-1.5 text-sm hover:bg-red-50"
            >
              Desconectar
            </button>
          </div>
        </div>
      )}

      {status !== "valid" && (
        <p className="text-sm text-slate-600">
          Para activar el e-commerce debes conectar tu cuenta de MercadoPago.
          Mientras no lo hagas, los clientes pueden ver tus productos pero no
          pueden comprar.
        </p>
      )}

      {showForm && (
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="font-medium">Access Token de Producción</span>
            <div className="mt-1 flex gap-2">
              <input
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="APP_USR-..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:outline-none focus:border-[var(--color-turquoise)]"
              />
              <button
                type="button"
                onClick={() => setShowToken((s) => !s)}
                className="px-3 rounded-lg border border-slate-300 text-sm"
                aria-label={showToken ? "Ocultar" : "Mostrar"}
              >
                {showToken ? "🙈" : "👁"}
              </button>
            </div>
          </label>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
              {status === "invalid" && (
                <>
                  {" "}
                  Asegúrate de usar el Access Token de{" "}
                  <strong>PRODUCCIÓN</strong>, no el de pruebas.
                </>
              )}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleVerify}
              disabled={verifying || !token.trim()}
              className="rounded-full bg-[var(--color-navy)] text-white px-5 py-2 text-sm font-semibold hover:bg-[var(--color-navy-light)] disabled:opacity-50"
            >
              {verifying ? "Verificando…" : "Verificar y activar pagos"}
            </button>
            {editing && (
              <button
                onClick={() => {
                  setEditing(false);
                  setToken("");
                  setError(null);
                }}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}

      {status !== "valid" && (
        <MpTutorial defaultOpen={status === "invalid"} />
      )}
    </div>
  );
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "emerald" | "red";
}) {
  const cls =
    color === "emerald"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-red-50 text-red-800 border-red-200";
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}
