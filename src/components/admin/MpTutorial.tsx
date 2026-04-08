"use client";

export function MpTutorial({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <details
      open={defaultOpen}
      className="rounded-2xl border border-slate-200 bg-[var(--color-cream)] open:bg-white"
    >
      <summary className="cursor-pointer select-none px-5 py-4 font-semibold text-[var(--color-navy)]">
        📋 Cómo obtener tu Access Token de MercadoPago
      </summary>
      <div className="px-5 pb-5 space-y-6 text-sm">
        <Step
          n={1}
          title="Crea tu cuenta"
          body={
            <>
              Ve a{" "}
              <a
                href="https://www.mercadopago.com.mx"
                target="_blank"
                rel="noopener"
                className="underline font-medium"
              >
                mercadopago.com.mx
              </a>{" "}
              y crea una cuenta si aún no tienes. Necesitarás verificarla con tu
              RFC o CURP para recibir pagos.
            </>
          }
          imageLabel="Pantalla de registro de MercadoPago"
        />

        <Step
          n={2}
          title="Accede a tus credenciales"
          body={
            <>
              Una vez dentro, ve a:{" "}
              <strong>Configuración → Credenciales</strong>. O directamente:{" "}
              <a
                href="https://www.mercadopago.com.mx/developers/panel/app"
                target="_blank"
                rel="noopener"
                className="underline font-medium"
              >
                panel de desarrolladores
              </a>
              .
            </>
          }
          imageLabel="Menú de configuración"
        />

        <Step
          n={3}
          title="Copia el Access Token de PRODUCCIÓN"
          body={
            <>
              Verás dos tipos de credenciales:{" "}
              <strong>"Pruebas"</strong> y <strong>"Producción"</strong>.{" "}
              <span className="text-amber-700 font-medium">
                ⚠️ Usa SIEMPRE las de Producción para recibir pagos reales.
              </span>{" "}
              Copia el campo "Access Token" (empieza con{" "}
              <code className="font-mono">APP_USR-...</code>).
            </>
          }
          imageLabel="Panel de credenciales"
        />

        <Step
          n={4}
          title="Pégalo aquí y activa tu tienda"
          body={
            <>
              Regresa a esta página, pega el token en el campo de arriba y haz
              clic en <strong>"Verificar y activar pagos"</strong>. Si todo está
              bien, tu tienda quedará activa inmediatamente.
            </>
          }
        />

        <div className="rounded-xl border border-[var(--color-turquoise)]/30 bg-[var(--color-turquoise)]/5 p-4">
          <p className="font-semibold text-[var(--color-navy)] mb-1">
            💡 Comisiones de MercadoPago
          </p>
          <ul className="space-y-0.5 text-slate-700">
            <li>• Tarjeta de crédito: ~3.49% + IVA</li>
            <li>• Tarjeta de débito: ~2.10% + IVA</li>
            <li>• OXXO: $11 MXN por transacción</li>
            <li>• Meses sin intereses: 3, 6, 12 MSI disponibles</li>
            <li>• El dinero llega a tu cuenta en 1-2 días hábiles</li>
          </ul>
        </div>
      </div>
    </details>
  );
}

function Step({
  n,
  title,
  body,
  imageLabel,
}: {
  n: number;
  title: string;
  body: React.ReactNode;
  imageLabel?: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-navy)] text-white grid place-items-center font-bold">
        {n}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-[var(--color-navy)]">{title}</h4>
        <p className="text-slate-700 mt-1">{body}</p>
        {imageLabel && (
          <div className="mt-3 rounded-lg bg-slate-100 border border-dashed border-slate-300 aspect-[16/7] grid place-items-center text-xs text-slate-500">
            Imagen: {imageLabel}
          </div>
        )}
      </div>
    </div>
  );
}
