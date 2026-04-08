import { getStoreStatus } from "@/lib/store-status";
import { CartView } from "@/components/public/CartView";

export default async function CarritoPage() {
  const status = await getStoreStatus();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Tu carrito</h1>
      <CartView storeStatus={status} />
    </div>
  );
}
