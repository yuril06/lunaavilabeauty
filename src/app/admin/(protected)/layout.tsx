import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/auth";
import { logoutAction } from "./actions";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream-deep">
      <header className="bg-charcoal text-cream">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="tracking-label text-[10px] uppercase text-gold mb-1">
              Painel administrativo
            </p>
            <p className="font-display text-2xl">Luna Avila Beauty</p>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/admin" className="hover:text-gold transition-colors">
              Agendamentos
            </Link>
            <Link href="/admin/horarios" className="hover:text-gold transition-colors">
              Horários
            </Link>
            <Link href="/admin/servicos" className="hover:text-gold transition-colors">
              Serviços
            </Link>
            <form action={logoutAction}>
              <button className="text-cream/60 hover:text-clay transition-colors">
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
