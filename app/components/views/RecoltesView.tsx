"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { I } from "../Icons";
import { Reveal, RevealItem } from "../motion";
import { ActionButton, ToastButton } from "../CopilotInline";
import { useStore } from "../store";
import { photos } from "../../photos";
import { getBacs, getHarvests, type Harvest } from "../../fixtures";
import type { PersonaId } from "../../personas";

export function RecoltesView({ persona }: { persona: PersonaId }) {
  const bacs = getBacs(persona);
  const harvests = getHarvests(persona);
  const { toast, askCopilot } = useStore();
  const [range, setRange] = useState<"7" | "30" | "90">("30");

  /* Upcoming harvests = bacs sorted by daysToHarvest asc */
  const upcoming = useMemo(() => [...bacs].sort((a, b) => a.daysToHarvest - b.daysToHarvest).slice(0, 4), [bacs]);

  /* History filtered by range */
  const days = Number(range);
  const cutoff = Date.now() - days * 86400 * 1000;
  const history = useMemo(
    () => harvests.filter((h) => new Date(h.date).getTime() >= cutoff).sort((a, b) => b.date.localeCompare(a.date)),
    [harvests, cutoff]
  );

  /* KPIs from history */
  const totalKg = history.reduce((acc, h) => acc + h.weightKg, 0);
  const totalEUR = history.reduce((acc, h) => acc + h.valueEUR, 0);
  const waterSaved = Math.round(totalKg * 95);  // ≈ 95 L économisés / kg vs sol industriel
  const co2Saved = (totalKg * 1.7).toFixed(1);  // ≈ 1,7 kg CO₂eq / kg local

  return (
    <Reveal className="space-y-8">
      <RevealItem>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip">{harvests.length} récoltes enregistrées</span>
            <h1 className="t-display-xl mt-2 font-[var(--font-grotesk)]" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
              Mes récoltes
            </h1>
            <p className="t-body-md text-[#3D4246]/80 mt-1">
              Suivez ce qui a été cueilli et ce qui arrive. Les rendements sont calculés par bac.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <RangeSwitch range={range} setRange={setRange} />
            <ToastButton
              className="btn btn-secondary btn-sm"
              icon={<I.Chart width={16} height={16} />}
              toast={{ tone: "info", title: "Export en cours", body: "Le CSV des récoltes arrive sous 10 s." }}
            >
              Export CSV
            </ToastButton>
            <ActionButton
              className="btn btn-primary btn-sm"
              icon={<I.Spark width={16} height={16} />}
              prompt="Analyse mes récoltes et suggère des améliorations"
            >
              Analyse IA
            </ActionButton>
          </div>
        </div>
      </RevealItem>

      {/* KPIs */}
      <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RevealItem><KPI label="Récolté"           value={totalKg.toFixed(2)}     unit="kg"      tone="success" icon={<I.Leaf />} /></RevealItem>
        <RevealItem><KPI label="Valeur générée"    value={Math.round(totalEUR).toString()} unit="€" tone="default" icon={<I.Chart />} /></RevealItem>
        <RevealItem><KPI label="Eau économisée"    value={waterSaved.toString()}  unit="L"       tone="info"    icon={<I.Drop />} /></RevealItem>
        <RevealItem><KPI label="CO₂ évité"          value={co2Saved}              unit="kg"      tone="success" icon={<I.Spark />} /></RevealItem>
      </Reveal>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Récoltes à venir">
            <ul className="space-y-3">
              {upcoming.map((u) => {
                const p = photos[u.photo];
                return (
                  <li
                    key={u.id}
                    className="card flex items-center gap-4 !p-3"
                  >
                    <span className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0">
                      <Image src={p.url} alt={p.slug} fill className="object-cover" sizes="64px" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-[var(--font-grotesk)] font-semibold text-[#0A1F13] truncate">{u.name}</span>
                        {u.status === "ready" && <span className="chip">Aujourd'hui</span>}
                        {u.status === "warning" && <span className="chip chip-warning">À surveiller</span>}
                      </div>
                      <div className="text-xs text-[#888B8D] truncate">{u.location} · rendement estimé {u.yieldExpected}</div>
                      <div className="mt-1.5 progress">
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: `${u.progress}%` }}
                          transition={{ duration: 0.7 }}
                          style={{ display: "block", height: "100%", background: "linear-gradient(90deg,#1E8C5A,#42C97A)" }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-2xl font-bold text-[#0F7A4A] leading-none">{u.daysToHarvest}</div>
                      <div className="text-[10px] uppercase tracking-wider text-[#888B8D] mt-1">jours</div>
                      <button
                        onClick={() =>
                          u.status === "ready"
                            ? toast({ tone: "success", title: `${u.name} récolté ✓`, body: `${u.yieldExpected} ajoutés à votre historique.` })
                            : askCopilot(`Quand récolter le bac ${u.id} (${u.name}) ?`)
                        }
                        className={`btn btn-sm mt-2 !px-2 !text-xs ${u.status === "ready" ? "btn-primary" : "btn-secondary"}`}
                      >
                        {u.status === "ready" ? "Récolter" : "Demander"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Section>

          <Section title="Historique des récoltes" action={<span className="chip chip-neutral">{history.length} entrées</span>}>
            <div className="card overflow-hidden !p-0">
              <ul className="divide-y divide-[#E2EEE7]">
                {history.map((h) => (
                  <HarvestRow key={h.id} h={h} />
                ))}
                {history.length === 0 && (
                  <li className="text-center text-[#888B8D] py-8 text-sm">Aucune récolte sur cette période.</li>
                )}
              </ul>
            </div>
          </Section>
        </div>

        {/* Side */}
        <div className="space-y-6">
          <Section title="Top rendement (kg)">
            <div className="card">
              <ul className="space-y-3">
                {topByYield(history).slice(0, 5).map((r, i) => (
                  <li key={r.name} className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-full bg-[#E8F5EE] text-[#0F7A4A] font-mono font-bold grid place-items-center text-xs">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-[#3D4246]">{r.name}</span>
                    <span className="font-mono font-bold text-[#0F7A4A]">{r.weightKg.toFixed(2)} kg</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section title="Impact environnemental">
            <div
              className="card text-white"
              style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#1E8C5A 60%,#2DB866 100%)" }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider opacity-80">Eau</div>
                  <div className="font-mono text-2xl font-bold">{waterSaved} L</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider opacity-80">CO₂</div>
                  <div className="font-mono text-2xl font-bold">{co2Saved} kg</div>
                </div>
              </div>
              <ToastButton
                className="btn btn-sm w-full mt-4 bg-white text-[#0F7A4A] hover:bg-white/90"
                toast={{ tone: "success", title: "Rapport impact prêt", body: "Téléchargement disponible dans les notifications." }}
              >
                Télécharger le rapport
              </ToastButton>
            </div>
          </Section>

          <Section title="Bientôt">
            <div className="card text-sm text-[#3D4246]/80">
              <p>📅 Programmation des semis sur 90 jours</p>
              <p className="mt-2">🤝 Don de surplus à des associations</p>
              <p className="mt-2">📦 Export comptable HelloBank pour les pros</p>
            </div>
          </Section>
        </div>
      </div>
    </Reveal>
  );
}

/* ───────────────── helpers ───────────────── */

function topByYield(harvests: Harvest[]) {
  const map = new Map<string, number>();
  harvests.forEach((h) => map.set(h.name, (map.get(h.name) ?? 0) + h.weightKg));
  return [...map.entries()].map(([name, weightKg]) => ({ name, weightKg })).sort((a, b) => b.weightKg - a.weightKg);
}

function HarvestRow({ h }: { h: Harvest }) {
  const p = photos[h.photo];
  return (
    <li className="px-4 py-3 flex items-center gap-3 hover:bg-[#F4FAF7] transition-colors">
      <span className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0">
        <Image src={p.url} alt={p.slug} fill className="object-cover" sizes="48px" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[#0A1F13] truncate">{h.name}</div>
        <div className="text-xs text-[#888B8D] truncate">{h.destination}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-mono text-sm font-bold text-[#0F7A4A]">{h.weightKg.toFixed(2)} kg</div>
        <div className="text-[10px] text-[#888B8D]">{formatDate(h.date)} · {h.valueEUR.toFixed(1)} €</div>
      </div>
    </li>
  );
}

function RangeSwitch({
  range,
  setRange,
}: {
  range: "7" | "30" | "90";
  setRange: (r: "7" | "30" | "90") => void;
}) {
  const opts: { id: "7" | "30" | "90"; label: string }[] = [
    { id: "7",  label: "7j" },
    { id: "30", label: "30j" },
    { id: "90", label: "90j" },
  ];
  return (
    <div role="tablist" className="inline-flex rounded-full bg-[#E8F5EE] p-1">
      {opts.map((o) => {
        const active = range === o.id;
        return (
          <motion.button
            key={o.id}
            role="tab"
            aria-selected={active}
            whileTap={{ scale: 0.94 }}
            onClick={() => setRange(o.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              active ? "bg-white text-[#0F7A4A] shadow-brand-sm" : "text-[#3D4246]"
            }`}
          >
            {o.label}
          </motion.button>
        );
      })}
    </div>
  );
}

function KPI({
  label,
  value,
  unit,
  tone,
  icon,
}: {
  label: string;
  value: string;
  unit: string;
  tone: "default" | "success" | "info" | "warning";
  icon: React.ReactNode;
}) {
  const map = {
    default: { ring: "bg-[#E8F5EE] text-[#0F7A4A]" },
    success: { ring: "bg-[#E8F5EE] text-[#0F7A4A]" },
    info:    { ring: "bg-[#E6EEFC] text-[#1E4FB0]" },
    warning: { ring: "bg-[#FFF4E5] text-[#B86E12]" },
  }[tone];
  return (
    <motion.div whileHover={{ y: -2 }} className="card">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[#888B8D]">{label}</span>
        <span className={`h-9 w-9 grid place-items-center rounded-xl ${map.ring}`}>{icon}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-mono text-3xl font-bold text-[#0A1F13]">{value}</span>
        <span className="text-sm text-[#888B8D]">{unit}</span>
      </div>
    </motion.div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}
