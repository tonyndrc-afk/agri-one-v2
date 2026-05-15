import { AppShell } from "../../components/AppShell";
import { AlertItem, Section } from "../../components/Widgets";
import { I } from "../../components/Icons";
import { LiveStat, LiveSparkCard, QuickActions } from "../../components/live";
import { Reveal, RevealItem } from "../../components/motion";
import { PlantPhotoCard } from "../../components/PlantPhotoCard";
import { OpenCopilotBtn, AISuggestionCard, ActionButton } from "../../components/CopilotInline";

export default function ParticulierApp() {
  return (
    <AppShell persona="particulier" active="Tableau de bord">
      <Reveal className="space-y-8">
        <RevealItem>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="chip">🌱 Aujourd'hui</span>
              <h1 className="t-display-xl mt-2 font-[var(--font-grotesk)]" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Bonjour Camille — votre basilic se porte bien.
              </h1>
              <p className="t-body-md text-[#3D4246]/80 mt-1">
                3 récoltes à venir cette semaine. Tout est piloté en temps réel.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <QuickActions />
              <OpenCopilotBtn>Demander à l'IA</OpenCopilotBtn>
            </div>
          </div>
        </RevealItem>

        <Reveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RevealItem><LiveStat sensor="temp"     label="Température bac"  unit="°C" hint="Optimal · 22–25°" range={[22, 25]} icon={<I.Thermo />} /></RevealItem>
          <RevealItem><LiveStat sensor="humidity" label="Humidité substrat" unit="%"  hint="Bon · 60–75%"    range={[60, 75]} icon={<I.Drop />} /></RevealItem>
          <RevealItem><LiveStat sensor="ph"       label="pH"               decimals={2} hint="Cible 6.5–6.8" range={[6.4, 6.8]} icon={<I.Flask />} /></RevealItem>
          <RevealItem><LiveStat sensor="light"    label="Luminosité"       unit="h/j" hint="LED auto"        range={[12, 16]} icon={<I.Sun />} /></RevealItem>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Section
              title="Mes cultures en temps réel"
              action={<OpenCopilotBtn className="btn btn-secondary btn-sm">Piloter</OpenCopilotBtn>}
            >
              <Reveal className="grid sm:grid-cols-2 gap-4">
                <RevealItem><PlantPhotoCard name="Basilic Grand Vert" variety="Bac n°1 · cuisine"  photoSlug="basil"           progress={86} daysToHarvest={4}  status="ready"   askPrompt="Récolter le basilic grand vert maintenant" /></RevealItem>
                <RevealItem><PlantPhotoCard name="Menthe poivrée"      variety="Bac n°2 · cuisine"  photoSlug="mint"            progress={62} daysToHarvest={12}                  askPrompt="Diagnostic de la menthe poivrée du bac n°2" /></RevealItem>
                <RevealItem><PlantPhotoCard name="Tomates cerises"     variety="Bac n°3 · balcon"   photoSlug="cherry-tomatoes" progress={41} daysToHarvest={28} status="warning" askPrompt="Pourquoi mes tomates cerises ralentissent ?" /></RevealItem>
                <RevealItem><PlantPhotoCard name="Roquette"             variety="Bac n°4 · cuisine"  photoSlug="arugula"         progress={92} daysToHarvest={2}  status="ready"   askPrompt="Récolter la roquette maintenant" /></RevealItem>
              </Reveal>
            </Section>

            <Section title="Suivi en direct">
              <div className="grid sm:grid-cols-2 gap-4">
                <LiveSparkCard title="Humidité bac (live)"    sensor="humidity" unit="%"  accent="#2DB866" />
                <LiveSparkCard title="Température (live)"      sensor="temp"     unit="°C" accent="#0F7A4A" />
              </div>
            </Section>

            <Section title="Économies & impact">
              <div className="card">
                <div className="grid sm:grid-cols-3 gap-6">
                  <Mini label="Eau économisée" value="14.2" unit="L cette semaine" />
                  <Mini label="Trajets évités" value="3.1" unit="km épicerie" />
                  <Mini label="CO₂ évité"      value="0.42" unit="kg" />
                </div>
              </div>
            </Section>
          </div>

          <div className="space-y-6">
            <RevealItem><AISuggestionCard /></RevealItem>

            <Section title="Notifications">
              <div className="card">
                <AlertItem tone="warning" title="pH légèrement bas"     body="Demandez à l'IA de corriger en 1 clic."        time="il y a 2h" />
                <AlertItem tone="success" title="Roquette prête 🌱"     body="Cueillez le matin pour un croquant maximal."   time="aujourd'hui" />
                <AlertItem tone="info"    title="Nouvelle recette IA"   body="3 idées avec votre basilic ce week-end."       time="hier" />
              </div>
            </Section>

            <Section title="Recettes du jour">
              <ul className="space-y-3">
                {[
                  { n: "Pesto express",            t: "10 min · facile", q: "Recette de pesto avec mon basilic" },
                  { n: "Salade roquette parmesan", t: "5 min · facile",  q: "Recette de salade roquette parmesan rapide" },
                  { n: "Infusion menthe fraîche",  t: "3 min · facile",  q: "Préparer une infusion à la menthe fraîche" },
                ].map((r) => (
                  <li key={r.n}>
                    <ActionButton
                      className="card flex items-center justify-between !p-4 w-full text-left hover:shadow-brand-md transition-shadow"
                      prompt={r.q}
                    >
                      <span>
                        <span className="block text-sm font-semibold text-[#0A1F13]">{r.n}</span>
                        <span className="block text-xs text-[#888B8D] mt-0.5">{r.t}</span>
                      </span>
                      <span className="text-[#0F7A4A]"><I.Arrow width={16} height={16} /></span>
                    </ActionButton>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>
      </Reveal>
    </AppShell>
  );
}

function Mini({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="text-xs text-[#888B8D] uppercase tracking-wider">{label}</div>
      <div className="font-mono text-2xl font-bold text-[#0F7A4A] mt-1">{value}</div>
      <div className="text-xs text-[#888B8D]">{unit}</div>
    </div>
  );
}
