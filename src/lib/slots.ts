import type { BlockedSlot, BusinessHour, TimeSlot } from "./types";

const STEP_MINUTES = 30;
const LEAD_TIME_MINUTES = 60; // não permite marcar em cima da hora

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

type BookedRange = { start: number; end: number };

export function generateAvailableSlots(params: {
  dateISO: string;
  weekday: number;
  durationMinutes: number;
  businessHours: BusinessHour[];
  blockedSlots: BlockedSlot[];
  bookedRanges: BookedRange[];
  now?: Date;
}): TimeSlot[] {
  const { dateISO, weekday, durationMinutes, businessHours, blockedSlots, bookedRanges } = params;
  const now = params.now ?? new Date();

  const windows = businessHours.filter((h) => h.weekday === weekday && h.active);
  if (windows.length === 0) return [];

  const fullDayBlocked = blockedSlots.some((b) => !b.start_time || !b.end_time);
  if (fullDayBlocked) return [];

  const blockedRanges = blockedSlots
    .filter((b) => b.start_time && b.end_time)
    .map((b) => ({ start: timeToMinutes(b.start_time as string), end: timeToMinutes(b.end_time as string) }));

  const todayISO = now.toISOString().slice(0, 10);
  const isToday = dateISO === todayISO;
  const earliestMinutes = isToday ? now.getHours() * 60 + now.getMinutes() + LEAD_TIME_MINUTES : 0;

  const slots: TimeSlot[] = [];

  for (const window of windows) {
    const windowStart = timeToMinutes(window.start_time);
    const windowEnd = timeToMinutes(window.end_time);

    for (let start = windowStart; start + durationMinutes <= windowEnd; start += STEP_MINUTES) {
      if (start < earliestMinutes) continue;
      const end = start + durationMinutes;

      const blocked = blockedRanges.some((r) => rangesOverlap(start, end, r.start, r.end));
      if (blocked) continue;

      const booked = bookedRanges.some((r) => rangesOverlap(start, end, r.start, r.end));
      if (booked) continue;

      slots.push({ start: minutesToTime(start), end: minutesToTime(end) });
    }
  }

  return slots;
}
