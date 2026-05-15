import { AppShell } from "../../components/AppShell";
import { AlertItem, Section, SparkBars } from "../../components/Widgets";
import { I } from "../../components/Icons";
import { LiveStat, LiveSparkCard, QuickActions } from "../../components/live";
import { Reveal, RevealItem } from "../../components/motion";
import { PlantPhotoCard } from "../../components/PlantPhotoCard";
import { OpenCopilotBtn, AISuggestionCard, ActionButton, ToastButton } from "../../components/CopilotInline";
import Image from "next/image";
import { photos } from "../../photos";

export default function EcoleApp() {
  return (
    <AppShell persona="ecole" active="Tableau de bord">
      <Reveal className="space-y-8">
        <RevealItem>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="chip">École Jean-Moulin · Bordeaux</span>
              <h1 className="t-display-xl mt-2 font-[var(--font-grotesk)]" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Aujourd'hui à 14h — <span className="text-[#0F7A4A]">CM1 plante en classe</span>.
              </h1>
              <p className="t-body-md text-[#3D4246]/80 mt-1">Mode autonomie vacances activé jusqu'au 22 mai.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <QuickActions />
              <ToastButton
                className="btn btn-secondary btn-sm"
                icon={<I.Calendar width={16} height={16} />}
                toast={{ tone: "success", title: "Mode vacances activé", body: "Arrosage auto jusqu'au 22 mai." }}
              >
                Mode vacances
              </ToastButton>
              <ActionButton
                className="btn btn-primary btn-sm"
                icon={<I.Spark width={16} height={16} />}
                prompt="Prépare la séance pédagogique de cet après-midi pour les CM1"
              >
                Préparer la séance
              </ActionButton>
            </div>
          </div>
        </RevealItem>

        <Reveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RevealItem><LiveStat sensor="temp"     label="Classe · Température" unit="°C" range={[19, 24]} icon={<I.Thermo />} hint="Confort élèves" /></RevealItem>
          <RevealItem><LiveStat sensor="humidity" label="Bacs · Humidité"      unit="%"  range={[60, 80]} icon={<I.Drop />} hint="Croissance" /></RevealItem>
          <RevealItem><LiveStat sensor="co2"      label="Air classe (CO₂)"    unit="ppm" range={[400, 800]} icon={<I.Spark />} hint="Aération auto" /></RevealItem>
          <RevealItem><LiveStat sensor="light"    label="LED bacs"             unit="h/j" range={[12, 16]} icon={<I.Sun />} hint="Cycle scolaire" /></RevealItem>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Section title="Programme pédagogique">
              <div className="card divide-y divide-[#E2EEE7]">
                {[
                  { c: "CP", t: "Reconnaître graines & semis", d: "Lundi 14 mai · 10h", b: <span className="chip">En cours</span> },
                  { c: "CE2", t: "Mesurer pH & température",   d: "Mardi 15 mai · 14h",  b: <span className="chip chip-info">Préparé</span> },
                  { c: "CM1", t: "Cycle de l'eau & IoT",       d: "Aujourd'hui · 14h",   b: <span className="chip chip-warning">Aujourd'hui</span> },
                  { c: "CM2", t: "Récolter & cuisiner",        d: "Vendredi 17 mai · 11h", b: <span className="chip">Planifié</span> },
                ].map((s) => (
                  <div key={s.c + s.t} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="h-11 w-11 rounded-2xl bg-[#E8F5EE] grid place-items-center font-bold text-[#0F7A4A]">{s.c}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#0A1F13] truncate">{s.t}</div>
                      <div className="text-xs text-[#888B8D]">{s.d}</div>
                    </div>
                    {s.b}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Bacs des classes">
              <Reveal className="grid sm:grid-cols-2 gap-4">
                <RevealItem><PlantPhotoCard name="Radis (CP)"        variety="Couloir Est"    photoSlug="radish-microgreens" progress={48} daysToHarvest={14} /></RevealItem>
                <RevealItem><PlantPhotoCard name="Fraises (CE1)"      variety="Jardin"         photoSlug="strawberries"        progress={71} daysToHarvest={9} /></RevealItem>
                <RevealItem><PlantPhotoCard name="Salades (CM2)"      variety="Réfectoire"     photoSlug="lettuce"             progress={92} daysToHarvest={2} status="ready" /></RevealItem>
                <RevealItem><PlantPhotoCard name="Aromates (cantine)" variety="Cuisine centrale" photoSlug="herb-garden"        progress={64} daysToHarvest={10} /></RevealItem>
              </Reveal>
            </Section>

            <Section title="Live classe · CO₂ et humidité">
              <div className="grid sm:grid-cols-2 gap-4">
                <LiveSparkCard title="CO₂ classe"     sensor="co2"      unit="ppm" accent="#1E8C5A" />
                <LiveSparkCard title="Humidité bacs"  sensor="humidity" unit="%"   accent="#42C97A" />
              </div>
            </Section>
          </div>

          <div className="space-y-6">
            <RevealItem><AISuggestionCard /></RevealItem>

            <Section title="Séance du jour">
              <div className="card !p-0 overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image src={photos["children-gardening"].url} alt="Enfants au potager" fill className="object-cover" sizes="400px" />
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-wider text-[#888B8D]">CM1 · 14h00</div>
                  <div className="t-display-md mt-1">Le cycle de l'eau, du capteur à la plante</div>
                  <p className="text-sm text-[#3D4246]/80 mt-2">Fiche pédago + activité 45 min générées par l'IA.</p>
                  <div className="mt-4 flex gap-2">
                    <ToastButton
                      className="btn btn-primary btn-sm"
                      toast={{ tone: "success", title: "Séance lancée", body: "Mode présentation actif sur le tableau." }}
                    >
                      Lancer la séance
                    </ToastButton>
                    <ActionButton
                      className="btn btn-secondary btn-sm"
                      prompt="Adapte la séance d'aujourd'hui au niveau CM1"
                    >
                      Adapter au niveau
                    </ActionButton>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Reporting mairie">
              <div className="card">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <Mini label="CO₂ évité" value="42" unit="kg / an" />
                  <Mini label="Heures péda." value="138" unit="h cumulées" />
                </div>
                <div className="text-xs text-[#888B8D] mb-2">Participation par classe</div>
                <SparkBars values={[82, 91, 88, 95, 76, 92]} accent="#1E8C5A" />
                <ToastButton
                  className="btn btn-secondary btn-sm w-full mt-5"
                  toast={{ tone: "info", title: "Rapport en préparation", body: "Le PDF arrive dans quelques secondes…" }}
                >
                  Générer rapport PDF
                </ToastButton>
              </div>
            </Section>

            <Section title="Alertes">
              <div className="card">
                <AlertItem tone="success" title="Mode vacances OK"  body="Arrosage auto jusqu'au 22 mai."             time="actif" />
                <AlertItem tone="info"    title="Subvention reçue"  body="Mairie · dossier accepté (+ 2 400 €)."      time="mardi" />
                <AlertItem tone="warning" title="Bac couloir Est"   body="Lumière faible — replanifier 10h–16h."     time="hier" />
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
