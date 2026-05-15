"use client";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { Counter, HoverLift } from "./motion";
import { useStore, type SensorKey } from "./store";
import { I } from "./Icons";

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function LiveDot({ label = "Live" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#0F7A4A] font-semibold">
      <motion.span
        className="h-2 w-2 rounded-full bg-[#2DB866]"
        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.45, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      {label}
    </span>
  );
}

const TONES: Record<string, { ring: string; accent: string }> = {
  default: { ring: "bg-[#E8F5EE] text-[#0F7A4A]", accent: "#2DB866" },
  warning: { ring: "bg-[#FFF4E5] text-[#B86E12]", accent: "#F5A623" },
  danger:  { ring: "bg-[#FFEBEB] text-[#B12525]", accent: "#E84040" },
  info:    { ring: "bg-[#E6EEFC] text-[#1E4FB0]", accent: "#3B82F6" },
};

export function LiveStat({
  label,
  sensor,
  unit,
  decimals = 1,
  hint,
  icon,
  tone = "default",
  range,
}: {
  label: string;
  sensor: SensorKey;
  unit?: string;
  decimals?: number;
  hint?: string;
  icon?: ReactNode;
  tone?: keyof typeof TONES;
  range?: [number, number]; // optimal range
}) {
  const mounted = useMounted();
  const { sensors, history } = useStore();
  const value = sensors[sensor];
  const series = history[sensor];
  const t = TONES[tone];
  if (!mounted) {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#888B8D]">{label}</span>
          <span className={`h-9 w-9 grid place-items-center rounded-xl ${t.ring}`}>{icon}</span>
        </div>
        <div className="mt-3 font-mono text-3xl font-bold text-[#0A1F13]">{value.toFixed(decimals)}{unit && <span className="text-sm text-[#888B8D] ml-1">{unit}</span>}</div>
        {hint && <div className="text-xs text-[#888B8D] mt-1">{hint}</div>}
      </div>
    );
  }

  const inRange = range ? value >= range[0] && value <= range[1] : true;
  const statusTone = inRange ? "default" : "warning";
  const sCol = TONES[statusTone];

  return (
    <HoverLift className="card relative overflow-hidden">
      <div className="absolute inset-x-0 -bottom-1 opacity-50 pointer-events-none">
        <Sparkline values={series} accent={t.accent} height={48} />
      </div>
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-[#888B8D]">{label}</span>
          <span className={`h-9 w-9 grid place-items-center rounded-xl ${t.ring}`}>{icon}</span>
        </div>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-mono text-3xl font-bold text-[#0A1F13]">
            <Counter value={value} decimals={decimals} />
          </span>
          {unit && <span className="text-sm text-[#888B8D]">{unit}</span>}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-xs text-[#888B8D]">{hint}</span>
          <LiveDot label={inRange ? "Stable" : "À surveiller"} />
        </div>
      </div>
    </HoverLift>
  );
}

export function Sparkline({
  values,
  accent = "#2DB866",
  height = 80,
  showFill = true,
}: {
  values: number[];
  accent?: string;
  height?: number;
  showFill?: boolean;
}) {
  if (values.length < 2) return null;
  const w = 200;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(0.001, max - min);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = height - ((v - min) / span) * (height - 6) - 3;
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${d} L${w},${height} L0,${height} Z`;
  const gid = `g-${accent.slice(1)}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" width="100%" height={height} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showFill && <motion.path d={area} fill={`url(#${gid})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />}
      <motion.path
        d={d}
        stroke={accent}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        key={d}
      />
      <motion.circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r={3.5}
        fill={accent}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function LiveSparkCard({
  title,
  sensor,
  unit,
  accent = "#2DB866",
}: {
  title: string;
  sensor: SensorKey;
  unit?: string;
  accent?: string;
}) {
  const mounted = useMounted();
  const { history, sensors } = useStore();
  if (!mounted) {
    return (
      <div className="card">
        <div className="text-xs text-[#888B8D] uppercase tracking-wider">{title}</div>
        <div className="font-mono text-2xl font-bold text-[#0F7A4A] mt-1">
          {sensors[sensor].toFixed(1)}{unit && <span className="text-sm text-[#888B8D] ml-1">{unit}</span>}
        </div>
        <div className="h-16" />
      </div>
    );
  }
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-[#888B8D] uppercase tracking-wider">{title}</div>
          <div className="font-mono text-2xl font-bold text-[#0F7A4A] mt-1">
            <Counter value={sensors[sensor]} decimals={1} />
            {unit && <span className="text-sm text-[#888B8D] ml-1">{unit}</span>}
          </div>
        </div>
        <LiveDot />
      </div>
      <div className="mt-3">
        <Sparkline values={history[sensor]} accent={accent} height={64} />
      </div>
    </div>
  );
}

export function QuickActions() {
  const { perform } = useStore();
  const actions: { id: Parameters<ReturnType<typeof useStore>["perform"]>[0]; label: string; icon: ReactNode }[] = [
    { id: "water",    label: "Arroser",       icon: <I.Drop /> },
    { id: "ph-up",    label: "Corriger pH",   icon: <I.Flask /> },
    { id: "light-on", label: "Booster LED",   icon: <I.Sun /> },
    { id: "harvest",  label: "Planifier récolte", icon: <I.Leaf /> },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <motion.button
          key={a.id}
          onClick={() => perform(a.id)}
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1 }}
          className="btn btn-secondary btn-sm"
        >
          {a.icon} {a.label}
        </motion.button>
      ))}
    </div>
  );
}
