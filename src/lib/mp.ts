import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { getSetting } from "./settings";

export type VerifyResult =
  | { ok: true; email: string | null }
  | { ok: false; error: string; reason: "invalid" | "network" };

/**
 * Verifies a MercadoPago access token by hitting /users/me.
 * Returns the account email on success.
 */
export async function verifyToken(token: string): Promise<VerifyResult> {
  if (!token || !token.trim()) {
    return { ok: false, error: "Token vacío", reason: "invalid" };
  }

  try {
    const res = await fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: "Token inválido", reason: "invalid" };
    }

    if (!res.ok) {
      return {
        ok: false,
        error: `MercadoPago respondió con ${res.status}`,
        reason: "network",
      };
    }

    const data = (await res.json()) as { email?: string };
    return { ok: true, email: data.email ?? null };
  } catch {
    return {
      ok: false,
      error: "No se pudo conectar con MercadoPago",
      reason: "network",
    };
  }
}

/**
 * Returns a configured MercadoPago client using the token saved in DB.
 * Throws if no token is configured — callers must check getStoreStatus() first.
 */
export async function getMpClient(): Promise<MercadoPagoConfig> {
  const token = await getSetting("mp_access_token");
  if (!token) {
    throw new Error("MercadoPago no está configurado");
  }
  return new MercadoPagoConfig({ accessToken: token });
}

export async function getPreferenceClient(): Promise<Preference> {
  const client = await getMpClient();
  return new Preference(client);
}

export async function getPaymentClient(): Promise<Payment> {
  const client = await getMpClient();
  return new Payment(client);
}

export function maskToken(token: string): string {
  if (token.length <= 8) return "•".repeat(token.length);
  return "•".repeat(Math.max(0, token.length - 8)) + token.slice(-8);
}
