export type AppointmentStatus = "pending" | "confirmed" | "done" | "cancelled";

export type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  sort_order: number;
  active: boolean;
};

export type BusinessHour = {
  id: string;
  weekday: number; // 0 = domingo ... 6 = sábado
  start_time: string; // "09:00:00"
  end_time: string; // "18:00:00"
  active: boolean;
};

export type BlockedSlot = {
  id: string;
  date: string; // "2026-07-23"
  start_time: string | null; // null = dia inteiro
  end_time: string | null;
  reason: string | null;
};

export type Appointment = {
  id: string;
  service_id: string;
  client_name: string;
  client_phone: string;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  service?: Service;
};

export type TimeSlot = {
  start: string; // "09:00"
  end: string; // "09:30"
};
