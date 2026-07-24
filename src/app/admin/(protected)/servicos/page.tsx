import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";
import { updateService } from "../actions";

export default async function ServicosPage() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("services").select("*").order("sort_order");
  const services = (data ?? []) as Service[];

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal mb-2">Serviços e preços</h1>
      <p className="text-charcoal-soft text-sm mb-6">
        Altere nomes, preços, duração ou desative um serviço temporariamente.
      </p>

      <div className="bg-white border border-line rounded-sm divide-y divide-line">
        {services.map((service) => {
          const action = async (formData: FormData) => {
            "use server";
            await updateService(service.id, {
              name: String(formData.get("name") ?? service.name),
              price: Number(formData.get("price") ?? service.price),
              duration_minutes: Number(formData.get("duration_minutes") ?? service.duration_minutes),
              active: formData.get("active") === "on",
            });
          };
          return (
            <form
              key={service.id}
              action={action}
              className="flex flex-wrap items-center gap-4 px-5 py-4"
            >
              <input
                type="text"
                name="name"
                defaultValue={service.name}
                className="flex-1 min-w-[180px] border border-line rounded-sm px-3 py-2 text-sm"
              />
              <div className="flex items-center gap-1">
                <span className="text-charcoal-soft text-sm">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  defaultValue={service.price}
                  className="w-24 border border-line rounded-sm px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="5"
                  step="5"
                  name="duration_minutes"
                  defaultValue={service.duration_minutes}
                  className="w-20 border border-line rounded-sm px-3 py-2 text-sm"
                />
                <span className="text-charcoal-soft text-sm">min</span>
              </div>
              <label className="flex items-center gap-2 text-sm text-charcoal-soft">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={service.active}
                  className="accent-clay"
                />
                Ativo
              </label>
              <button className="ml-auto text-xs border border-line px-3 py-1.5 rounded-sm hover:border-clay hover:text-clay transition-colors">
                Salvar
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
