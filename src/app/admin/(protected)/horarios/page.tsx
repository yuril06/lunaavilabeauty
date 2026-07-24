import { getSupabaseAdmin } from "@/lib/supabase/server";
import { formatDateShort, formatTime } from "@/lib/format";
import type { BlockedSlot, BusinessHour } from "@/lib/types";
import { addBlockedSlot, removeBlockedSlot, updateBusinessHour } from "../actions";

const WEEKDAY_LABEL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default async function HorariosPage() {
  const supabase = getSupabaseAdmin();

  const [{ data: hours }, { data: blocked }] = await Promise.all([
    supabase.from("business_hours").select("*").order("weekday"),
    supabase
      .from("blocked_slots")
      .select("*")
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date"),
  ]);

  const businessHours = (hours ?? []) as BusinessHour[];
  const blockedSlots = (blocked ?? []) as BlockedSlot[];

  const byWeekday = new Map(businessHours.map((h) => [h.weekday, h]));

  return (
    <div className="space-y-14">
      <section>
        <h1 className="font-display text-3xl text-charcoal mb-2">Horário de funcionamento</h1>
        <p className="text-charcoal-soft text-sm mb-6">
          Define os horários semanais em que os agendamentos ficam disponíveis para as clientes.
        </p>

        <div className="bg-white border border-line rounded-sm divide-y divide-line">
          {WEEKDAY_LABEL.map((label, weekday) => {
            const h = byWeekday.get(weekday);
            const action = async (formData: FormData) => {
              "use server";
              const active = formData.get("active") === "on";
              const start = String(formData.get("start_time") ?? "09:00");
              const end = String(formData.get("end_time") ?? "18:00");
              await updateBusinessHour(weekday, active, start, end);
            };
            return (
              <form
                key={weekday}
                action={action}
                className="flex flex-wrap items-center gap-4 px-5 py-4"
              >
                <span className="w-28 text-sm font-medium">{label}</span>
                <label className="flex items-center gap-2 text-sm text-charcoal-soft">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={h?.active ?? false}
                    className="accent-clay"
                  />
                  Aberto
                </label>
                <input
                  type="time"
                  name="start_time"
                  defaultValue={h?.start_time?.slice(0, 5) ?? "09:00"}
                  className="border border-line rounded-sm px-3 py-1.5 text-sm"
                />
                <span className="text-charcoal-soft text-sm">até</span>
                <input
                  type="time"
                  name="end_time"
                  defaultValue={h?.end_time?.slice(0, 5) ?? "18:00"}
                  className="border border-line rounded-sm px-3 py-1.5 text-sm"
                />
                <button className="ml-auto text-xs border border-line px-3 py-1.5 rounded-sm hover:border-clay hover:text-clay transition-colors">
                  Salvar
                </button>
              </form>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl text-charcoal mb-2">Bloquear datas e horários</h2>
        <p className="text-charcoal-soft text-sm mb-6">
          Feche um dia inteiro (folga, feriado) ou apenas um intervalo específico.
        </p>

        <form
          action={addBlockedSlot}
          className="bg-white border border-line rounded-sm p-5 flex flex-wrap items-end gap-4 mb-6"
        >
          <div>
            <label className="block text-xs text-charcoal-soft mb-1">Data</label>
            <input
              type="date"
              name="date"
              required
              className="border border-line rounded-sm px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-charcoal-soft pb-2">
            <input type="checkbox" name="whole_day" className="accent-clay" />
            Dia inteiro
          </label>
          <div>
            <label className="block text-xs text-charcoal-soft mb-1">Das</label>
            <input type="time" name="start_time" className="border border-line rounded-sm px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-charcoal-soft mb-1">Até</label>
            <input type="time" name="end_time" className="border border-line rounded-sm px-3 py-2 text-sm" />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-charcoal-soft mb-1">Motivo (opcional)</label>
            <input
              type="text"
              name="reason"
              placeholder="Ex: Folga, feriado..."
              className="w-full border border-line rounded-sm px-3 py-2 text-sm"
            />
          </div>
          <button className="bg-charcoal text-cream px-5 py-2.5 text-xs tracking-label uppercase">
            Bloquear
          </button>
        </form>

        <div className="bg-white border border-line rounded-sm divide-y divide-line">
          {blockedSlots.length === 0 && (
            <p className="px-5 py-6 text-sm text-charcoal-soft">Nenhum bloqueio futuro cadastrado.</p>
          )}
          {blockedSlots.map((b) => {
            const action = async () => {
              "use server";
              await removeBlockedSlot(b.id);
            };
            return (
              <div key={b.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span>
                  {formatDateShort(b.date)}
                  {" — "}
                  {b.start_time && b.end_time
                    ? `${formatTime(b.start_time)} às ${formatTime(b.end_time)}`
                    : "Dia inteiro"}
                  {b.reason && <span className="text-charcoal-soft"> · {b.reason}</span>}
                </span>
                <form action={action}>
                  <button className="text-xs text-clay hover:underline">Remover</button>
                </form>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
