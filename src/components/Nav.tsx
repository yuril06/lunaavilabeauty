import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl text-charcoal">
          Luna Avila <span className="text-clay italic">Beauty</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm tracking-label uppercase text-[11px] text-charcoal-soft">
          <Link href="/#servicos" className="hover:text-clay transition-colors">
            Serviços
          </Link>
          <Link href="/#sobre" className="hover:text-clay transition-colors">
            Sobre
          </Link>
          <Link href="/#local" className="hover:text-clay transition-colors">
            Localização
          </Link>
        </nav>
        <Link
          href="/agendar"
          className="bg-charcoal text-cream px-5 py-2.5 text-[11px] tracking-label uppercase hover:bg-clay transition-colors"
        >
          Agendar
        </Link>
      </div>
    </header>
  );
}
