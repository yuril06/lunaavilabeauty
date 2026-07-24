import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ServicesTable from "@/components/ServicesTable";
import LocationMap from "@/components/LocationMap";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

export default async function Home() {
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
      <main className="flex-1">
        <Hero />
        <About />
        <ServicesTable services={services} />
        <LocationMap />
      </main>
      <Footer />
      <WhatsAppFloatingButton phone={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""} />
    </>
  );
}
