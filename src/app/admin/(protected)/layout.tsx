import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr] bg-[var(--color-cream)]">
      <AdminSidebar />
      <div className="min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between">
          <h2 className="font-semibold text-[var(--color-navy)]">Admin</h2>
          <div className="text-sm text-slate-500">{session.user.email}</div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
