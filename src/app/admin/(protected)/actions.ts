"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/types";

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateBusinessHour(
  weekday: number,
  active: boolean,
  startTime: string,
  endTime: string
) {
  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("business_hours")
    .select("id")
    .eq("weekday", weekday)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("business_hours")
      .update({ active, start_time: startTime, end_time: endTime })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("business_hours")
      .insert({ weekday, active, start_time: startTime, end_time: endTime });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/horarios");
}

export async function addBlockedSlot(formData: FormData) {
  const date = String(formData.get("date") ?? "");
  const wholeDay = formData.get("whole_day") === "on";
  const startTime = wholeDay ? null : String(formData.get("start_time") ?? "") || null;
  const endTime = wholeDay ? null : String(formData.get("end_time") ?? "") || null;
  const reason = String(formData.get("reason") ?? "") || null;

  if (!date) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("blocked_slots")
    .insert({ date, start_time: startTime, end_time: endTime, reason });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/horarios");
}

export async function removeBlockedSlot(id: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/horarios");
}

export async function updateService(
  id: string,
  fields: { name: string; price: number; duration_minutes: number; active: boolean }
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("services").update(fields).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/servicos");
  revalidatePath("/");
  revalidatePath("/agendar");
}
