"use client";

import { useState } from "react";

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export default function Calendar({
  value,
  onChange,
  minISO,
  maxISO,
}: {
  value: string;
  onChange: (iso: string) => void;
  minISO: string;
  maxISO: string;
}) {
  const [minY, minM] = minISO.split("-").map(Number);
  const [maxY, maxM] = maxISO.split("-").map(Number);
  const initial = value ? value.split("-").map(Number) : [minY, minM];

  const [viewYear, setViewYear] = useState(initial[0]);
  const [viewMonth, setViewMonth] = useState(initial[1] - 1);

  const atMin = viewYear === minY && viewMonth === minM - 1;
  const atMax = viewYear === maxY && viewMonth === maxM - 1;

  function goPrev() {
    if (atMin) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goNext() {
    if (atMax) return;
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const total = daysInMonth(viewYear, viewMonth);
  const startWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-cream border border-line rounded-md p-6">
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={goPrev}
          disabled={atMin}
          aria-label="Mês anterior"
          className="w-8 h-8 flex items-center justify-center rounded-full border border-line text-charcoal-soft hover:border-clay hover:text-clay transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          ‹
        </button>
        <p className="font-display text-xl text-charcoal">
          {MONTH_LABELS[viewMonth]} <span className="text-charcoal-soft">{viewYear}</span>
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={atMax}
          aria-label="Próximo mês"
          className="w-8 h-8 flex items-center justify-center rounded-full border border-line text-charcoal-soft hover:border-clay hover:text-clay transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={i}
            className="text-center text-[11px] tracking-label uppercase text-charcoal-soft py-1"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;
          const iso = toISO(viewYear, viewMonth, day);
          const disabled = iso < minISO || iso > maxISO;
          const selected = iso === value;
          const isToday = iso === todayISO;
          return (
            <button
              type="button"
              key={iso}
              disabled={disabled}
              onClick={() => onChange(iso)}
              className={`aspect-square rounded-full text-sm flex items-center justify-center transition-colors relative
                ${selected ? "bg-clay text-cream" : "hover:bg-blush text-charcoal"}
                ${disabled ? "opacity-25 pointer-events-none" : ""}
              `}
            >
              {day}
              {isToday && !selected && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-clay" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
