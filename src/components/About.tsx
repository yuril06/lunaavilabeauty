export default function About() {
  return (
    <section id="sobre" className="bg-cream-deep">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
          <div className="w-16 h-px bg-gold mb-6" />
          <p className="tracking-label text-[11px] uppercase text-clay mb-4">Sobre a Luna</p>
          <h2 className="font-display text-4xl text-charcoal">
            Cuidado e técnica em cada atendimento
          </h2>
        </div>
        <div className="md:col-span-3">
          <p className="text-charcoal-soft text-lg leading-relaxed mb-6">
            Atuando na área da beleza há mais de 5 anos, a Luna é especialista em
            design de sobrancelhas e extensão de cílios, unindo técnica apurada a um
            olhar cuidadoso para as características de cada rosto.
          </p>
          <p className="text-charcoal-soft text-lg leading-relaxed">
            Cada atendimento é pensado para realçar a beleza natural da cliente, em um
            ambiente acolhedor no Campanário, Diadema.
          </p>
        </div>
      </div>
    </section>
  );
}
