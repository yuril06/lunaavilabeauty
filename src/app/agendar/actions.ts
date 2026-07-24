"use server";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import { generateAvailableSlots } from "@/lib/slots";
import type { BlockedSlot, BusinessHour, Service, TimeSlot } from "@/lib/types";

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export async function getAvailableSlotsAction(
  serviceId: string,
  dateISO: string
): Promise<TimeSlot[]> {
  const supabase = getSupabaseAdmin();

  const [{ data: service }, { data: hours }, { data: blocked }, { data: appts }] = await Promise.all([
    supabase.from("services").select("*").eq("id", serviceId).single(),
    supabase.from("business_hours").select("*"),
    supabase.from("blocked_slots").select("*").eq("date", dateISO),
    supabase
      .from("appointments")
      .select("start_time, end_time")
      .eq("date", dateISO)
      .neq("status", "cancelled"),
  ]);

  if (!service) return [];

  const [y, m, d] = dateISO.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).getDay();

  return generateAvailableSlots({
    dateISO,
    weekday,
    durationMinutes: (service as Service).duration_minutes,
    businessHours: (hours ?? []) as BusinessHour[],
    blockedSlots: (blocked ?? []) as BlockedSlot[],
    bookedRanges: (appts ?? []).map((a) => ({
      start: timeToMinutes(a.start_time),
      end: timeToMinutes(a.end_time),
    })),
  });
}

export type CreateAppointmentResult =
  | { ok: true; appointmentId: string }
  | { ok: false; error: string };

export async function createAppointmentAction(input: {
  serviceId: string;
  dateISO: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientPhone: string;
}): Promise<CreateAppointmentResult> {
  const { serviceId, dateISO, startTime, endTime, clientName, clientPhone } = input;

  if (!clientName.trim() || !clientPhone.trim()) {
    return { ok: false, error: "Preencha nome e telefone." };
  }

  const supabase = getSupabaseAdmin();

  // revalida disponibilidade no momento da confirmação, evita corrida entre duas clientes
  const stillAvailable = await getAvailableSlotsAction(serviceId, dateISO);
  const matches = stillAvailable.some((s) => s.start === startTime && s.end === endTime);
  if (!matches) {
    return { ok: false, error: "Esse horário acabou de ser reservado. Escolha outro horário." };
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      service_id: serviceId,
      client_name: clientName.trim(),
      client_phone: clientPhone.trim(),
      date: dateISO,
      start_time: startTime,
      end_time: endTime,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: "Não foi possível confirmar o agendamento. Tente novamente." };
  }

  return { ok: true, appointmentId: data.id };
}
