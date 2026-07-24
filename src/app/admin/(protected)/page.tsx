import { getSupabaseAdmin } from "@/lib/supabase/server";
import { formatDateShort, formatPrice, formatTime, buildWhatsAppLink } from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { updateAppointmentStatus } from "./actions";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  done: "Atendido",
  cancelled: "Cancelado",
};

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  done: "bg-charcoal/10 text-charcoal-soft",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>;
}) {
  const params = await searchParams;
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("appointments")
    .select("*, service:services(*)")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (params.status) query = query.eq("status", params.status);
  if (params.date) query = query.eq("date", params.date);
  else query = query.gte("date", new Date().toISOString().slice(0, 10));

  const { data: appointments } = await query;
  const list = (appointments ?? []) as Appointment[];

  return (
    <div>
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <h1 className="font-display text-3xl text-charcoal">Agendamentos</h1>
        <form className="flex items-center gap-3 text-sm" method="get">
          <input
            type="date"
            name="date"
            defaultValue={params.date ?? ""}
            className="border border-line rounded-sm px-3 py-2 bg-white"
          />
          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="border border-line rounded-sm px-3 py-2 bg-white"
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="done">Atendido</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <button className="bg-charcoal text-cream px-4 py-2 text-xs tracking-label uppercase">
            Filtrar
          </button>
        </form>
      </div>

      <div className="bg-white border border-line rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-line text-charcoal-soft tracking-label text-[10px] uppercase">
              <th className="px-5 py-4">Data / Hora</th>
              <th className="px-5 py-4">Cliente</th>
              <th className="px-5 py-4">Serviço</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-charcoal-soft">
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            )}
            {list.map((appt) => (
              <tr key={appt.id} className="border-b border-line last:border-0 align-top">
                <td className="px-5 py-4 whitespace-nowrap">
                  {formatDateShort(appt.date)}
                  <br />
                  <span className="text-charcoal-soft">
                    {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {appt.client_name}
                  <br />
                  <a
                    href={buildWhatsAppLink(
                      appt.client_phone,
                      `Olá ${appt.client_name}! Aqui é da Luna Avila Beauty, confirmando seu horário de ${
                        appt.service?.name ?? "serviço"
                      } em ${formatDateShort(appt.date)} às ${formatTime(appt.start_time)}.`
                    )}
                    target="_blank"
                    className="text-clay hover:underline"
                  >
                    {appt.client_phone}
                  </a>
                </td>
                <td className="px-5 py-4">
                  {appt.service?.name}
                  <br />
                  <span className="text-charcoal-soft">
                    {appt.service ? formatPrice(appt.service.price) : ""}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs ${STATUS_STYLE[appt.status]}`}
                  >
                    {STATUS_LABEL[appt.status]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {appt.status !== "confirmed" && appt.status !== "done" && (
                      <StatusButton id={appt.id} status="confirmed" label="Confirmar" />
                    )}
                    {appt.status !== "done" && (
                      <StatusButton id={appt.id} status="done" label="Atendido" />
                    )}
                    {appt.status !== "cancelled" && (
                      <StatusButton id={appt.id} status="cancelled" label="Cancelar" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusButton({
  id,
  status,
  label,
}: {
  id: string;
  status: AppointmentStatus;
  label: string;
}) {
  const action = async () => {
    "use server";
    await updateAppointmentStatus(id, status);
  };
  return (
    <form action={action}>
      <button className="text-xs border border-line px-2.5 py-1.5 rounded-sm hover:border-clay hover:text-clay transition-colors">
        {label}
      </button>
    </form>
  );
}
