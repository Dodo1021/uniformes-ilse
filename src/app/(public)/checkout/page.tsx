import { redirect } from "next/navigation";
import { getStoreStatus } from "@/lib/store-status";
import { CheckoutForm } from "@/components/public/CheckoutForm";

export default async function CheckoutPage() {
  const status = await getStoreStatus();
  if (status !== "valid") redirect("/catalogo");

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-slate-600 mb-8">
        Completa tus datos para continuar con el pago.
      </p>
      <CheckoutForm />
    </div>
  );
}
