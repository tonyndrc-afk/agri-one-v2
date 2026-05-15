import { AppShell } from "../../components/AppShell";
import { AlertItem, Section, SparkBars } from "../../components/Widgets";
import { I } from "../../components/Icons";
import { LiveStat, LiveSparkCard, QuickActions } from "../../components/live";
import { Reveal, RevealItem } from "../../components/motion";
import { PlantPhotoCard } from "../../components/PlantPhotoCard";
import { OpenCopilotBtn, AISuggestionCard, ActionButton, ToastButton } from "../../components/CopilotInline";
import Image from "next/image";
import { photos } from "../../photos";

export default function BureauApp() {
  return (
    <AppShell persona="bureau" active="Tableau de bord">
      <Reveal className="space-y-8">
        <RevealItem>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="chip">Siège Paris · 3<sup>e</sup> étage</span>
              <h1 className="t-display-xl mt-2 font-[var(--font-grotesk)]" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                5 kits, 3 sites — <span className="text-[#0F7A4A]">+12 % bien-être</span> ce trimestre.
              </h1>
              <p className="t-body-md text-[#3D4246]/80 mt-1">Atelier collaborateurs jeudi 16 mai : 24 inscrits.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <QuickActions />
              <ToastButton
                className="btn btn-secondary btn-sm"
                icon={<I.Chart width={16} height={16} />}
                toast={{ tone: "info", title: "Export ESG initié", body: "Le rapport CSV+PDF arrive sous 30s." }}
              >
                Export ESG
              </ToastButton>
              <ActionButton
                className="btn btn-primary btn-sm"
                icon={<I.Calendar width={16} height={16} />}
                prompt="Aide-moi à organiser l'atelier collaborateurs de jeudi"
              >
                Animer un atelier
              </ActionButton>
            </div>
          </div>
        </RevealItem>

        <Reveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RevealItem><LiveStat sensor="temp"     label="Open-space · T°"    unit="°C" range={[20, 24]}   icon={<I.Thermo />} hint="Confort" /></RevealItem>
          <RevealItem><LiveStat sensor="humidity" label="Hygrométrie"        unit="%"  range={[40, 60]}   icon={<I.Drop />} hint="OMS · 40–60%" /></RevealItem>
          <RevealItem><LiveStat sensor="co2"      label="CO₂ open-space"     unit="ppm" range={[400, 800]} icon={<I.Spark />} hint="Aération auto" /></RevealItem>
          <RevealItem><LiveStat sensor="light"    label="Éclairage bacs"     unit="h/j" range={[12, 16]}  icon={<I.Sun />} hint="LED biomimétique" /></RevealItem>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Section title="Sites & espaces">
              <div className="card divide-y divide-[#E2EEE7]">
                {[
                  { s: "Paris · Saint-Lazare", k: "2 kits Pro · open-space",    h: "98 %", t: "ok" as const },
                  { s: "Lyon · Part-Dieu",     k: "1 kit Pro · cafétéria",      h: "92 %", t: "ok" as const },
                  { s: "Lille · Euralille",    k: "2 kits Enterprise · hall",   h: "74 %", t: "warning" as const },
                ].map((row) => (
                  <div key={row.s} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="h-11 w-11 rounded-2xl bg-[#E8F5EE] grid place-items-center text-[#0F7A4A]"><I.Office /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#0A1F13]">{row.s}</div>
                      <div className="text-xs text-[#888B8D]">{row.k}</div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="font-mono font-bold text-[#0F7A4A]">{row.h}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#888B8D]">Santé bacs</span>
                    </div>
                    {row.t === "warning" ? <span className="chip chip-warning">À visiter</span> : <span className="chip">Stable</span>}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Bacs partagés du siège">
              <Reveal className="grid sm:grid-cols-2 gap-4">
                <RevealItem><PlantPhotoCard name="Aromates café"  variety="Hall · libre service" photoSlug="herb-garden"     progress={84} daysToHarvest={3}  status="ready" /></RevealItem>
                <RevealItem><PlantPhotoCard name="Mini-tomates"   variety="Cafétéria"            photoSlug="cherry-tomatoes" progress={58} daysToHarvest={14} /></RevealItem>
                <RevealItem><PlantPhotoCard name="Salades mix"    variety="Open-space N+3"       photoSlug="lettuce"         progress={73} daysToHarvest={8} /></RevealItem>
                <RevealItem><PlantPhotoCard name="Capucines déco" variety="Salle réunion C"      photoSlug="nasturtium"      progress={46} daysToHarvest={18} status="warning" /></RevealItem>
              </Reveal>
            </Section>

            <Section title="Live · qualité de l'air">
              <div className="grid sm:grid-cols-2 gap-4">
                <LiveSparkCard title="CO₂ open-space" sensor="co2"      unit="ppm" accent="#42C97A" />
                <LiveSparkCard title="Hygrométrie"     sensor="humidity" unit="%"  accent="#1E8C5A" />
              </div>
            </Section>
          </div>

          <div className="space-y-6">
            <RevealItem><AISuggestionCard /></RevealItem>

            <Section title="Bien-être au bureau">
              <div className="card !p-0 overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image src={photos["office-plants"].url} alt="Open-space avec plantes" fill className="object-cover" sizes="400px" />
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-wider text-[#888B8D]">eNPS Agri One</div>
                  <div className="t-display-md mt-1">+54 — collaborateurs engagés</div>
                  <p className="text-sm text-[#3D4246]/80 mt-2">Animation jeudi : pause-récolte + atelier pesto.</p>
                </div>
              </div>
            </Section>

            <Section title="Reporting RSE / ESG">
              <div className="card">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <Mini label="CO₂ évité YTD" value="118" unit="kg" />
                  <Mini label="Eau économisée" value="2 410" unit="L" />
                </div>
                <div className="text-xs text-[#888B8D] mb-2">Engagement collaborateurs (6 mois)</div>
                <SparkBars values={[42, 51, 58, 62, 65, 68]} accent="#42C97A" />
                <ToastButton
                  className="btn btn-secondary btn-sm w-full mt-5"
                  toast={{ tone: "success", title: "Rapport ESG exporté", body: "Téléchargement disponible dans le centre de notifications." }}
                >
                  Exporter rapport ESG
                </ToastButton>
              </div>
            </Section>

            <Section title="Animations & RH">
              <div className="card">
                <AlertItem tone="success" title="Atelier jeudi 16/05" body="24 inscrits — formateur Agri One confirmé." time="J-2" />
                <AlertItem tone="info"    title="Newsletter interne" body="« La récolte du mois » prête à publier."     time="prêt" />
                <AlertItem tone="warning" title="Lille · bac hall"   body="Humidité instable — visite technique."       time="à planifier" />
              </div>
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
