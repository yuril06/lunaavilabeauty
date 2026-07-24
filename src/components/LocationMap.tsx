const ADDRESS = "Rua Macahuba, 539 - Campanário, Diadema - SP, 09931-270";

export default function LocationMap() {
  const query = encodeURIComponent(ADDRESS);
  return (
    <section id="local" className="bg-cream-deep">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
          <div className="w-16 h-px bg-gold mb-6" />
          <p className="tracking-label text-[11px] uppercase text-clay mb-4">Onde estamos</p>
          <h2 className="font-display text-4xl text-charcoal mb-6">
            Campanário, Diadema
          </h2>
          <p className="text-charcoal-soft leading-relaxed mb-4">{ADDRESS}</p>
          <p className="text-charcoal-soft leading-relaxed">
            Atendimento com hora marcada. Confirme sua chegada pelo WhatsApp após o
            agendamento.
          </p>
          <a
            href="https://maps.app.goo.gl/Gm4mjpeBLSgguuA59"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-[11px] tracking-label uppercase text-clay hover:text-clay-dark transition-colors"
          >
            Abrir no Google Maps →
          </a>
        </div>
        <div className="md:col-span-3">
          <div className="aspect-[16/10] w-full border border-line overflow-hidden">
            <iframe
              title="Localização Luna Avila Beauty"
              src={`https://www.google.com/maps?q=${query}&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
