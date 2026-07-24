import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (isValidSessionToken(token)) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-charcoal px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="tracking-label text-[11px] uppercase text-gold mb-3">
            Painel administrativo
          </p>
          <h1 className="font-display text-4xl text-cream">Luna Avila Beauty</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
