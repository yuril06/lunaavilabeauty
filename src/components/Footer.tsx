import { buildWhatsAppLink } from "@/lib/format";

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  return (
    <footer className="bg-charcoal text-cream">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl mb-3">
            Luna Avila <span className="text-gold italic">Beauty</span>
          </p>
          <p className="text-cream/60 text-sm leading-relaxed">
            Design de sobrancelhas e extensão de cílios personalizados.
          </p>
        </div>
        <div>
          <p className="tracking-label text-[10px] uppercase text-gold mb-3">Contato</p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>
              <a
                href="https://www.instagram.com/lunaavilabeauty/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream transition-colors"
              >
                @lunaavilabeauty
              </a>
            </li>
            {whatsapp && (
              <li>
                <a
                  href={buildWhatsAppLink(whatsapp, "Olá! Gostaria de tirar uma dúvida / agendar um horário.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  Fale no WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="tracking-label text-[10px] uppercase text-gold mb-3">Agendamento</p>
          <p className="text-sm text-cream/70 leading-relaxed">
            Agende online e receba a confirmação diretamente pelo WhatsApp.
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Luna Avila Beauty. Todos os direitos reservados.
      </div>
    </footer>
  );
}
