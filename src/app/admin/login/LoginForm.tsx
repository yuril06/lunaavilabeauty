"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="password" className="sr-only">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Senha de acesso"
          className="w-full rounded-sm bg-cream/5 border border-cream/20 px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-clay text-center">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-gold text-charcoal py-3 tracking-label text-[11px] uppercase hover:bg-gold/90 transition-colors disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
