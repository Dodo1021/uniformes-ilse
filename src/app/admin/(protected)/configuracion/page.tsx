import { getStoreStatus, getMpAccountEmail } from "@/lib/store-status";
import { getSetting } from "@/lib/settings";
import { maskToken } from "@/lib/mp";
import { MpSetupCard } from "@/components/admin/MpSetupCard";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const [status, email, token] = await Promise.all([
    getStoreStatus(),
    getMpAccountEmail(),
    getSetting("mp_access_token"),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Configuración</h1>
      <MpSetupCard
        initialStatus={status}
        accountEmail={email}
        maskedToken={token ? maskToken(token) : null}
      />
    </div>
  );
}
