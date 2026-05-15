import type { ReactNode } from "react";
import { I } from "./Icons";

export function StatCard({
  label,
  value,
  unit,
  hint,
  tone = "default",
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  tone?: "default" | "warning" | "danger" | "info" | "success";
  icon?: ReactNode;
}) {
  const ring = {
    default: "text-[#0F7A4A] bg-[#E8F5EE]",
    success: "text-[#0F7A4A] bg-[#E8F5EE]",
    warning: "text-[#B86E12] bg-[#FFF4E5]",
    danger: "text-[#B12525] bg-[#FFEBEB]",
    info: "text-[#1E4FB0] bg-[#E6EEFC]",
  }[tone];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[#888B8D]">{label}</span>
        {icon && <span className={`h-9 w-9 grid place-items-center rounded-xl ${ring}`}>{icon}</span>}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-mono text-3xl font-bold text-[#0A1F13]">{value}</span>
        {unit && <span className="text-sm text-[#888B8D]">{unit}</span>}
      </div>
      {hint && <div className="text-xs text-[#888B8D] mt-1">{hint}</div>}
    </div>
  );
}

export function PlantCard({
  name,
  variety,
  emoji,
  progress,
  daysToHarvest,
  status = "ok",
}: {
  name: string;
  variety: string;
  emoji: string;
  progress: number;
  daysToHarvest: number;
  status?: "ok" | "warning" | "danger" | "ready";
}) {
  const chip = {
    ok: <span className="chip">En croissance</span>,
    warning: <span className="chip chip-warning">À surveiller</span>,
    danger: <span className="chip chip-danger">Alerte capteur</span>,
    ready: <span className="chip">Prêt à récolter</span>,
  }[status];

  return (
    <article className="card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[#E8F5EE] grid place-items-center text-2xl">{emoji}</div>
          <div>
            <h3 className="t-display-md">{name}</h3>
            <div className="text-xs text-[#888B8D]">{variety}</div>
          </div>
        </div>
        {chip}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-[#888B8D] mb-1.5">
          <span>Croissance</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-[#3D4246]">
          Récolte dans <strong className="font-mono text-[#0F7A4A]">{daysToHarvest}j</strong>
        </span>
        <button className="btn btn-ghost btn-sm">Détails <I.Arrow width={14} height={14} /></button>
      </div>
    </article>
  );
}

export function AlertItem({
  title,
  body,
  tone = "info",
  time,
}: {
  title: string;
  body: string;
  tone?: "info" | "warning" | "danger" | "success";
  time: string;
}) {
  const bg = {
    info: "bg-[#E6EEFC] text-[#1E4FB0]",
    warning: "bg-[#FFF4E5] text-[#B86E12]",
    danger: "bg-[#FFEBEB] text-[#B12525]",
    success: "bg-[#E8F5EE] text-[#0F7A4A]",
  }[tone];
  return (
    <div className="flex gap-3 py-3 border-b border-[#E2EEE7] last:border-0">
      <span className={`h-9 w-9 grid place-items-center rounded-full ${bg} shrink-0`}>
        <I.Bell width={16} height={16} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-[#0A1F13] truncate">{title}</h4>
          <span className="text-[10px] uppercase tracking-wider text-[#888B8D] whitespace-nowrap">{time}</span>
        </div>
        <p className="text-sm text-[#3D4246]/80 mt-0.5">{body}</p>
      </div>
    </div>
  );
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="t-display-md">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function SparkBars({ values, accent = "#2DB866" }: { values: number[]; accent?: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md"
          style={{ height: `${(v / max) * 100}%`, background: `linear-gradient(180deg, ${accent} 0%, #42C97A 100%)`, opacity: 0.85 }}
          title={String(v)}
        />
      ))}
    </div>
  );
}
