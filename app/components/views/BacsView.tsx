"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { I } from "../Icons";
import { LiveDot } from "../live";
import { Reveal, RevealItem } from "../motion";
import { ActionButton, ToastButton } from "../CopilotInline";
import { useStore } from "../store";
import { photos } from "../../photos";
import { getBacs, type Bac, type BacStatus } from "../../fixtures";
import type { PersonaId } from "../../personas";

const STATUS_LABEL: Record<BacStatus, string> = {
  ok: "En croissance",
  ready: "Prêt à récolter",
  warning: "À surveiller",
  danger: "Alerte capteur",
};

const STATUS_CHIP: Record<BacStatus, string> = {
  ok: "chip",
  ready: "chip",
  warning: "chip chip-warning",
  danger: "chip chip-danger",
};

const FILTERS: { id: BacStatus | "all"; label: string }[] = [
  { id: "all",     label: "Tous" },
  { id: "ready",   label: "Prêts à récolter" },
  { id: "warning", label: "À surveiller" },
  { id: "ok",      label: "En croissance" },
];

export function BacsView({ persona }: { persona: PersonaId }) {
  const all = getBacs(persona);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const { askCopilot, toast } = useStore();

  const bacs = useMemo(() => (filter === "all" ? all : all.filter((b) => b.status === filter)), [all, filter]);
  const counts = useMemo(() => {
    const c = { all: all.length, ready: 0, warning: 0, ok: 0, danger: 0 };
    all.forEach((b) => { c[b.status]++; });
    return c;
  }, [all]);

  return (
    <Reveal className="space-y-8">
      <RevealItem>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip">{all.length} bac{all.length > 1 ? "s" : ""} actifs</span>
            <h1 className="t-display-xl mt-2 font-[var(--font-grotesk)]" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
              Mes bacs de culture
            </h1>
            <p className="t-body-md text-[#3D4246]/80 mt-1">
              Pilotez chaque bac individuellement. L'IA peut intervenir à votre place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ToastButton
              className="btn btn-secondary btn-sm"
              icon={<I.Calendar width={16} height={16} />}
              toast={{ tone: "info", title: "Planning bacs", body: "Vue calendaire bientôt disponible." }}
            >
              Planning
            </ToastButton>
            <ActionButton
              className="btn btn-primary btn-sm"
              icon={<I.Plus width={16} height={16} />}
              prompt="Aide-moi à ajouter un nouveau bac de culture"
              toast={{ tone: "success", title: "Nouveau bac", body: "L'assistant ouvre l'onboarding capteurs." }}
            >
              Ajouter un bac
            </ActionButton>
          </div>
        </div>
      </RevealItem>

      {/* Summary cards */}
      <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RevealItem><Summary label="Total bacs"          value={String(counts.all)}      tone="default" /></RevealItem>
        <RevealItem><Summary label="Prêts à récolter"    value={String(counts.ready)}    tone="success" /></RevealItem>
        <RevealItem><Summary label="En croissance"        value={String(counts.ok)}       tone="info" /></RevealItem>
        <RevealItem><Summary label="À surveiller"         value={String(counts.warning)}  tone="warning" /></RevealItem>
      </Reveal>

      {/* Filters */}
      <RevealItem>
        <div role="tablist" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isActive = filter === f.id;
            return (
              <motion.button
                key={f.id}
                role="tab"
                aria-selected={isActive}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilter(f.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-[#0F7A4A] text-white shadow-brand-sm"
                    : "bg-[#E8F5EE] text-[#0F7A4A] hover:bg-[#D9EFE0]"
                }`}
              >
                {f.label}
                <span className={`text-[11px] font-mono px-1.5 rounded-full ${isActive ? "bg-white/20" : "bg-white"}`}>
                  {f.id === "all" ? all.length : (counts as Record<string, number>)[f.id] ?? 0}
                </span>
              </motion.button>
            );
          })}
        </div>
      </RevealItem>

      {/* Bacs list */}
      <Reveal className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {bacs.map((b) => (
          <RevealItem key={b.id}>
            <BacCard
              bac={b}
              onAsk={() => askCopilot(`Donne-moi un diagnostic complet du bac ${b.id} (${b.name})`)}
              onWater={() => toast({ tone: "success", title: `${b.name} arrosé`, body: "Humidité substrat → +9 %" })}
              onHarvest={() => toast({ tone: "success", title: `${b.name} récolté`, body: `Rendement estimé : ${b.yieldExpected}` })}
            />
          </RevealItem>
        ))}
        {bacs.length === 0 && (
          <div className="card col-span-full text-center text-[#888B8D] py-12">
            Aucun bac dans cette catégorie.
          </div>
        )}
      </Reveal>
    </Reveal>
  );
}

function Summary({ label, value, tone }: { label: string; value: string; tone: "default" | "success" | "info" | "warning" }) {
  const map = {
    default: { bg: "bg-white", color: "text-[#0A1F13]", dot: "bg-[#A8AAAD]" },
    success: { bg: "bg-[#E8F5EE]", color: "text-[#0F7A4A]", dot: "bg-[#2DB866]" },
    info:    { bg: "bg-[#E6EEFC]", color: "text-[#1E4FB0]", dot: "bg-[#3B82F6]" },
    warning: { bg: "bg-[#FFF4E5]", color: "text-[#B86E12]", dot: "bg-[#F5A623]" },
  }[tone];
  return (
    <div className={`card ${map.bg}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#888B8D]">
        <motion.span className={`h-2 w-2 rounded-full ${map.dot}`} animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        {label}
      </div>
      <div className={`font-mono text-3xl font-bold mt-2 ${map.color}`}>{value}</div>
    </div>
  );
}

function BacCard({
  bac,
  onAsk,
  onWater,
  onHarvest,
}: {
  bac: Bac;
  onAsk: () => void;
  onWater: () => void;
  onHarvest: () => void;
}) {
  const photo = photos[bac.photo];
  return (
    <motion.article whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 280, damping: 22 }} className="card !p-0 overflow-hidden">
      <div className="relative h-44 w-full overflow-hidden bg-[#E8F5EE]">
        <Image src={photo.url} alt={photo.slug} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={STATUS_CHIP[bac.status]}>{STATUS_LABEL[bac.status]}</span>
        </div>
        <div className="absolute top-3 right-3"><LiveDot label={bac.id} /></div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-[var(--font-grotesk)] font-bold text-lg leading-tight drop-shadow">{bac.name}</h3>
          <div className="text-xs opacity-90">{bac.location}</div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Mini icon={<I.Thermo />} label="T°"      value={bac.temp.toFixed(1)}    unit="°C" />
          <Mini icon={<I.Drop />}   label="Humid."  value={String(Math.round(bac.humidity))} unit="%" />
          <Mini icon={<I.Flask />}  label="pH"      value={bac.ph.toFixed(2)}      unit="" />
        </div>

        <div className="text-xs flex justify-between mb-1">
          <span className="text-[#888B8D]">Croissance</span>
          <span className="font-mono font-bold text-[#0F7A4A]">{bac.progress}%</span>
        </div>
        <div className="progress">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: `${bac.progress}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ display: "block", height: "100%", background: "linear-gradient(90deg,#1E8C5A,#42C97A)" }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#888B8D]">
          <span>Planté le <strong className="text-[#3D4246]">{formatDate(bac.plantedOn)}</strong></span>
          <span>Récolte dans <strong className="font-mono text-[#0F7A4A]">{bac.daysToHarvest}j</strong></span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <motion.button whileTap={{ scale: 0.96 }} onClick={onWater} className="btn btn-secondary btn-sm !px-2 !text-xs">
            <I.Drop width={14} height={14} /> Arroser
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onHarvest}
            disabled={bac.status !== "ready"}
            className={`btn btn-sm !px-2 !text-xs ${bac.status === "ready" ? "btn-primary" : "btn-secondary opacity-50 cursor-not-allowed"}`}
          >
            <I.Leaf width={14} height={14} /> Récolter
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={onAsk} className="btn btn-ghost btn-sm !px-2 !text-xs">
            <I.Spark width={14} height={14} /> IA
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

function Mini({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl bg-[#F4FAF7] border border-[#E2EEE7] p-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-[#888B8D]">{label}</span>
        <span className="text-[#0F7A4A]">{icon}</span>
      </div>
      <div className="font-mono text-sm font-bold text-[#0F7A4A] mt-0.5">
        {value}<span className="text-[10px] text-[#888B8D] ml-0.5">{unit}</span>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}
