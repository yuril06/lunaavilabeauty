"use client";

import { useMemo, useState, useTransition } from "react";
import type { Service, TimeSlot } from "@/lib/types";
import { formatDateLong, formatPrice, formatTime, buildWhatsAppLink } from "@/lib/format";
import { createAppointmentAction, getAvailableSlotsAction } from "@/app/agendar/actions";
import Calendar from "./Calendar";

type Step = "service" | "date" | "time" | "info" | "done";

const STEPS: { key: Step; label: string }[] = [
  { key: "service", label: "Serviço" },
  { key: "date", label: "Data" },
  { key: "time", label: "Horário" },
  { key: "info", label: "Seus dados" },
];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function maxDateISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().slice(0, 10);
}

export default function BookingWizard({
  services,
  whatsappNumber,
}: {
  services: Service[];
  whatsappNumber: string;
}) {
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [appointmentId, setAppointmentId] = useState("");

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const confirmMessage = useMemo(() => {
    if (!service || !date || !slot) return "";
    return `Olá! Meu agendamento na Luna Avila Beauty:\n\nServiço: ${service.name}\nData: ${formatDateLong(
      date
    )}\nHorário: ${formatTime(slot.start)}\nNome: ${name}\n\nAguardo a confirmação, obrigada!`;
  }, [service, date, slot, name]);

  async function handlePickDate(value: string) {
    setDate(value);
    setSlot(null);
    setSlots([]);
    if (!service || !value) return;
    setLoadingSlots(true);
    const available = await getAvailableSlotsAction(service.id, value);
    setSlots(available);
    setLoadingSlots(false);
    setStep("time");
  }

  function handleConfirm() {
    if (!service || !date || !slot) return;
    setError("");
    startTransition(async () => {
      const result = await createAppointmentAction({
        serviceId: service.id,
        dateISO: date,
        startTime: slot.start,
        endTime: slot.end,
        clientName: name,
        clientPhone: phone,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setAppointmentId(result.appointmentId);
      setStep("done");
    });
  }

  return (
    <div>
      {step !== "done" && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-12">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-colors ${
                    i <= stepIndex
                      ? "bg-clay text-cream border-clay"
                      : "border-line text-charcoal-soft"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`hidden sm:block text-[10px] tracking-label uppercase ${
                    i <= stepIndex ? "text-clay" : "text-charcoal-soft/60"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-12 h-px mb-5 ${i < stepIndex ? "bg-clay" : "bg-line"}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {step === "service" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setService(s);
                setStep("date");
              }}
              className="text-left bg-cream border border-line rounded-sm p-5 hover:border-clay transition-colors"
            >
              <p className="font-display text-xl text-charcoal mb-1">{s.name}</p>
              <p className="text-charcoal-soft text-sm mb-3">{s.duration_minutes} minutos</p>
              <p className="text-clay">{formatPrice(s.price)}</p>
            </button>
          ))}
        </div>
      )}

      {step === "date" && service && (
        <div className="max-w-md mx-auto text-center">
          <p className="text-charcoal-soft text-sm mb-6">
            Serviço selecionado: <span className="text-charcoal">{service.name}</span>
          </p>
          <Calendar
            value={date}
            minISO={todayISO()}
            maxISO={maxDateISO()}
            onChange={handlePickDate}
          />
          <BackLink onClick={() => setStep("service")} />
        </div>
      )}

      {step === "time" && service && (
        <div className="max-w-lg mx-auto">
          <p className="text-charcoal-soft text-sm text-center mb-6">
            {formatDateLong(date)}
          </p>
          {loadingSlots && (
            <p className="text-center text-charcoal-soft">Carregando horários...</p>
          )}
          {!loadingSlots && slots.length === 0 && (
            <p className="text-center text-charcoal-soft">
              Não há horários disponíveis nesta data. Escolha outro dia.
            </p>
          )}
          {!loadingSlots && slots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {slots.map((s) => (
                <button
                  key={s.start}
                  onClick={() => {
                    setSlot(s);
                    setStep("info");
                  }}
                  className="border border-line rounded-sm py-2.5 text-sm hover:border-clay hover:text-clay transition-colors"
                >
                  {formatTime(s.start)}
                </button>
              ))}
            </div>
          )}
          <BackLink onClick={() => setStep("date")} />
        </div>
      )}

      {step === "info" && service && slot && (
        <div className="max-w-sm mx-auto">
          <div className="bg-cream border border-line rounded-sm p-5 mb-6 text-sm space-y-1">
            <p>
              <span className="text-charcoal-soft">Serviço: </span>
              {service.name}
            </p>
            <p>
              <span className="text-charcoal-soft">Data: </span>
              {formatDateLong(date)}
            </p>
            <p>
              <span className="text-charcoal-soft">Horário: </span>
              {formatTime(slot.start)}
            </p>
            <p>
              <span className="text-charcoal-soft">Valor: </span>
              {formatPrice(service.price)}
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-line rounded-sm px-4 py-3"
            />
            <input
              type="tel"
              placeholder="WhatsApp (DDD + número)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-line rounded-sm px-4 py-3"
            />
            {error && <p className="text-sm text-clay">{error}</p>}
            <button
              onClick={handleConfirm}
              disabled={pending || !name.trim() || !phone.trim()}
              className="w-full bg-clay text-cream py-3 tracking-label text-[11px] uppercase hover:bg-clay-dark transition-colors disabled:opacity-50"
            >
              {pending ? "Confirmando..." : "Confirmar agendamento"}
            </button>
          </div>
          <BackLink onClick={() => setStep("time")} />
        </div>
      )}

      {step === "done" && service && slot && (
        <div className="max-w-sm mx-auto text-center">
          <p className="tracking-label text-[11px] uppercase text-clay mb-4">
            Agendamento reservado
          </p>
          <h2 className="font-display text-3xl text-charcoal mb-4">Quase lá, {name.split(" ")[0]}</h2>
          <p className="text-charcoal-soft mb-8 leading-relaxed">
            Sua vaga para <strong className="text-charcoal">{service.name}</strong> em{" "}
            {formatDateLong(date)} às {formatTime(slot.start)} foi reservada. Confirme pelo
            WhatsApp para garantir seu atendimento.
          </p>
          {whatsappNumber ? (
            <a
              href={buildWhatsAppLink(whatsappNumber, confirmMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-charcoal text-cream px-8 py-3.5 tracking-label text-[11px] uppercase hover:bg-clay transition-colors"
            >
              Confirmar no WhatsApp
            </a>
          ) : (
            <p className="text-sm text-charcoal-soft">
              Agendamento nº {appointmentId.slice(0, 8)} recebido. Em breve entraremos em contato.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-6 text-xs tracking-label uppercase text-charcoal-soft hover:text-clay transition-colors"
    >
      ← Voltar
    </button>
  );
}
