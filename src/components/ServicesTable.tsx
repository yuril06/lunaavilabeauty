import Link from "next/link";
import type { Service } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ServicesTable({ services }: { services: Service[] }) {
  return (
    <section id="servicos" className="bg-cream">
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <p className="tracking-label text-[11px] uppercase text-clay mb-4">
            Tabela de serviços
          </p>
          <h2 className="font-display text-4xl text-charcoal">Serviços &amp; preços</h2>
        </div>

        <div className="border-t border-line">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-baseline justify-between gap-6 py-5 border-b border-line"
            >
              <div>
                <p className="font-display text-xl text-charcoal">{service.name}</p>
                <p className="text-charcoal-soft text-sm">{service.duration_minutes} min</p>
              </div>
              <div className="flex-1 border-b border-dotted border-line translate-y-[-6px] mx-2 hidden sm:block" />
              <p className="text-clay text-lg whitespace-nowrap">{formatPrice(service.price)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/agendar"
            className="inline-block bg-charcoal text-cream px-8 py-4 text-[11px] tracking-label uppercase hover:bg-clay transition-colors"
          >
            Agendar horário
          </Link>
        </div>
      </div>
    </section>
  );
}
