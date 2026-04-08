import { getStoreStatus } from "@/lib/store-status";

export const dynamic = "force-dynamic";
import { StoreStatusBanner } from "@/components/public/StoreStatusBanner";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { WhatsAppFab } from "@/components/public/WhatsAppFab";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = await getStoreStatus();
  return (
    <>
      <StoreStatusBanner status={status} />
      <Header status={status} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
