"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore } from "./store";
import { Counter } from "./motion";
import { LiveDot, Sparkline } from "./live";
import { I } from "./Icons";
import { photos } from "../photos";

export function HeroLivePreview() {
  const { sensors, history } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="rounded-3xl bg-white h-[520px] shadow-brand-md" aria-hidden />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="relative leaf-ring rounded-3xl bg-white p-5 shadow-brand-lg overflow-hidden"
    >
      {/* Tilted card stack illusion */}
      <div className="absolute -top-2 right-6 chip" style={{ background: "#FFEBEB", color: "#B12525" }}>
        <I.Bell width={12} height={12} /> pH bas
      </div>

      {/* Mock app header */}
      <div className="flex items-center gap-3 mb-4">
        <Image src="/agri-one-logo-mark.png" alt="" width={44} height={44} priority />
        <div>
          <div className="font-[var(--font-grotesk)] font-bold text-[#0A1F13]">Bonjour Camille</div>
          <div className="text-xs text-[#888B8D] flex items-center gap-2">
            <LiveDot label="3 bacs · live" />
          </div>
        </div>
      </div>

      {/* Plant hero */}
      <div className="relative h-40 rounded-2xl overflow-hidden">
        <Image
          src={photos.basil.url}
          alt="Basilic frais"
          fill
          sizes="500px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-xs uppercase tracking-wider opacity-80">Bac n°1</div>
          <div className="font-[var(--font-grotesk)] font-bold leading-tight">Basilic Grand Vert</div>
          <div className="mt-1 progress" style={{ background: "rgba(255,255,255,0.25)" }}>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "86%" }}
              transition={{ duration: 1, delay: 0.6 }}
              style={{ display: "block", height: "100%", background: "linear-gradient(90deg,#42C97A,#7DD9A3)" }}
            />
          </div>
        </div>
      </div>

      {/* Sensor mini grid */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <MiniSensor icon={<I.Thermo />} value={sensors.temp}     unit="°C" label="Temp."    accent="#0F7A4A" series={history.temp} />
        <MiniSensor icon={<I.Drop />}   value={sensors.humidity} unit="%"  label="Humid."   accent="#2DB866" series={history.humidity} />
        <MiniSensor icon={<I.Flask />}  value={sensors.ph}       unit="pH" label="pH"       accent="#1E8C5A" series={history.ph} decimals={2} />
      </div>

      {/* AI bubble */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.4 }}
        className="mt-4 rounded-xl p-3 flex items-start gap-3 text-white"
        style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#1E8C5A 100%)" }}
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="rounded-full bg-white/20 p-2"
        >
          <I.Spark width={16} height={16} />
        </motion.div>
        <div>
          <div className="text-[10px] uppercase tracking-wider opacity-80">Copilote IA</div>
          <div className="text-sm leading-snug">Votre basilic sera prêt à récolter dans 4 jours 🌱</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MiniSensor({
  icon,
  value,
  unit,
  label,
  accent,
  series,
  decimals = 1,
}: {
  icon: React.ReactNode;
  value: number;
  unit: string;
  label: string;
  accent: string;
  series: number[];
  decimals?: number;
}) {
  return (
    <div className="rounded-xl bg-[#F4FAF7] border border-[#E2EEE7] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-[#888B8D]">{label}</span>
        <span className="text-[#0F7A4A]">{icon}</span>
      </div>
      <div className="font-mono text-lg font-bold text-[#0F7A4A] mt-0.5 leading-none">
        <Counter value={value} decimals={decimals} />
        <span className="text-[10px] text-[#888B8D] ml-0.5">{unit}</span>
      </div>
      <div className="mt-1 -mx-0.5">
        <Sparkline values={series.slice(-12)} accent={accent} height={20} showFill={false} />
      </div>
    </div>
  );
}
