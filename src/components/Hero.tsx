import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="tracking-label text-[11px] uppercase text-clay mb-5">
            Diadema · Campanário
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.08] text-charcoal mb-6">
            Sobrancelhas &amp;
            <br />
            cílios com <span className="italic text-clay">precisão</span>
          </h1>
          <p className="text-charcoal-soft text-lg leading-relaxed max-w-md mb-10">
            Design de sobrancelhas e extensão de cílios personalizados para realçar
            sua beleza natural, com mais de 5 anos de experiência.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/agendar"
              className="bg-charcoal text-cream px-8 py-4 text-[11px] tracking-label uppercase hover:bg-clay transition-colors"
            >
              Agendar horário
            </Link>
            <a
              href="https://www.instagram.com/lunaavilabeauty/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-label uppercase text-charcoal-soft hover:text-clay transition-colors"
            >
              @lunaavilabeauty
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 border border-gold/40 rounded-full hidden md:block" />
          <div className="relative aspect-[4/5] rounded-full overflow-hidden border border-line mx-auto max-w-sm">
            <Image
              src="/images/luna.jpg"
              alt="Luna, especialista em design de sobrancelhas e cílios"
              fill
              sizes="(min-width: 768px) 384px, 320px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
