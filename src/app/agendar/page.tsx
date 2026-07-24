import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";
import BookingWizard from "@/components/booking/BookingWizard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default async function AgendarPage() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  const services = (data ?? []) as Service[];

  return (
    <>
      <Nav />
      <main className="flex-1 bg-cream">
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <p className="tracking-label text-[11px] uppercase text-clay mb-4 text-center">
            Agendamento online
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-center text-charcoal mb-4">
            Escolha seu horário
          </h1>
          <p className="text-charcoal-soft text-center mb-14 max-w-lg mx-auto">
            Selecione o serviço, a data e o horário disponível. Sua vaga fica reservada
            imediatamente após a confirmação.
          </p>
          <BookingWizard
            services={services}
            whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
