import { buildWhatsAppLink } from "@/lib/format";

export default function WhatsAppFloatingButton({ phone }: { phone: string }) {
  if (!phone) return null;

  const href = buildWhatsAppLink(
    phone,
    "Olá! Gostaria de tirar uma dúvida / agendar um horário na Luna Avila Beauty."
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-3.5 pr-3.5 py-3.5 rounded-full shadow-lg hover:bg-[#1ebe5b] transition-colors sm:hover:pr-5"
    >
      <svg viewBox="0 0 32 32" className="w-5 h-5 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M16.02 3C9.4 3 4 8.37 4 14.98c0 2.13.56 4.15 1.62 5.95L3 29l8.28-2.57a12.9 12.9 0 0 0 4.74.9h.01c6.62 0 12.02-5.37 12.02-11.98C28.05 8.75 22.65 3 16.02 3Zm0 21.87h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-4.9 1.52 1.55-4.78-.24-.37a9.85 9.85 0 0 1-1.5-5.19c0-5.47 4.47-9.92 9.98-9.92 2.67 0 5.17 1.04 7.06 2.92a9.86 9.86 0 0 1 2.92 7.02c0 5.47-4.48 9.92-9.99 9.92Zm5.47-7.43c-.3-.15-1.78-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47a9 9 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.24-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.5 1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.78-.72 2.03-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
      <span className="hidden sm:inline max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[8rem] group-hover:opacity-100 transition-all duration-300 text-[11px] tracking-label uppercase">
        WhatsApp
      </span>
    </a>
  );
}
