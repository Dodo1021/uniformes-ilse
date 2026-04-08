import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");
  return (
    <div className="min-h-screen grid place-items-center bg-[var(--color-cream)] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">
          Panel de administración
        </h1>
        <p className="text-sm text-slate-500 mt-1">Uniformes Ilse</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
