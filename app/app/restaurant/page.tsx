import { AppShell } from "../../components/AppShell";
import { AlertItem, Section, SparkBars } from "../../components/Widgets";
import { I } from "../../components/Icons";
import { LiveStat, LiveSparkCard, QuickActions } from "../../components/live";
import { Reveal, RevealItem } from "../../components/motion";
import { PlantPhotoCard } from "../../components/PlantPhotoCard";
import { OpenCopilotBtn, AISuggestionCard, ActionButton, ToastButton } from "../../components/CopilotInline";
import Image from "next/image";
import { photos } from "../../photos";

export default function RestaurantApp() {
  return (
    <AppShell persona="restaurant" active="Tableau de bord">
      <Reveal className="space-y-8">
        <RevealItem>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="chip">Service du soir · 19h30</span>
              <h1 className="t-display-xl mt-2 font-[var(--font-grotesk)]" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
                Bonsoir Chef Bertrand — <span className="bg-gradient-to-r from-[#0F7A4A] to-[#42C97A] bg-clip-text text-transparent">4 micro-pousses prêtes</span>.
              </h1>
              <p className="t-body-md text-[#3D4246]/80 mt-1">Récolte recommandée maintenant pour le service de 20h.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <QuickActions />
              <ToastButton
                className="btn btn-secondary btn-sm"
                icon={<I.Calendar width={16} height={16} />}
                toast={{ tone: "info", title: "Carte planifiée", body: "Vos micro-pousses sont liées au menu du soir." }}
              >
                Planifier carte
              </ToastButton>
              <ActionButton
                className="btn btn-primary btn-sm"
                icon={<I.Spark width={16} height={16} />}
                prompt="Suggère-moi un plat signature à partir de mes herbes du jour"
              >
                Suggérer un plat
              </ActionButton>
            </div>
          </div>
        </RevealItem>

        <Reveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RevealItem><LiveStat sensor="temp"     label="Température cave"   unit="°C" hint="Stable" range={[19, 23]}   icon={<I.Thermo />} /></RevealItem>
          <RevealItem><LiveStat sensor="humidity" label="Humidité bacs"      unit="%"  hint="Cible 70%" range={[65, 78]} icon={<I.Drop />} /></RevealItem>
          <RevealItem><LiveStat sensor="ph"       label="pH solution"        decimals={2} hint="Cible 6.5" range={[6.3, 6.7]} icon={<I.Flask />} /></RevealItem>
          <RevealItem><LiveStat sensor="co2"      label="CO₂ cuisine"        unit="ppm" hint="Air sain" range={[400, 600]} icon={<I.Spark />} /></RevealItem>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Section title="ROI temps réel" action={<span className="chip chip-info">Kit Pro · récupéré en 6,2 mois</span>}>
              <div className="card">
                <div className="grid sm:grid-cols-3 gap-6">
                  <Mini label="Économies herbes" value="218" unit="€/mois" />
                  <Mini label="CA storytelling" value="+644" unit="€/mois" />
                  <Mini label="Coût SaaS" value="−149" unit="€/mois" />
                </div>
                <div className="mt-6">
                  <div className="text-xs text-[#888B8D] mb-2">Marge nette cumulée (12 mois projetés)</div>
                  <SparkBars values={[100, 280, 480, 720, 980, 1240, 1560, 1880, 2240, 2620, 3020, 3460]} accent="#0F7A4A" />
                </div>
                <div className="mt-5 rounded-xl bg-[#E8F5EE] p-4 text-sm text-[#0F7A4A]">
                  💡 Kit + 12 mois SaaS rentabilisé dès le 7<sup>e</sup> mois.
                </div>
              </div>
            </Section>

            <Section title="Bacs de production">
              <Reveal className="grid sm:grid-cols-2 gap-4">
                <RevealItem><PlantPhotoCard name="Micro-pousses radis" variety="Bac n°1 · garde-manger" photoSlug="radish-microgreens" progress={94} daysToHarvest={1} status="ready" /></RevealItem>
                <RevealItem><PlantPhotoCard name="Basilic Genovese"    variety="Bac n°2 · cuisine"      photoSlug="basil"               progress={78} daysToHarvest={5} /></RevealItem>
                <RevealItem><PlantPhotoCard name="Coriandre"            variety="Bac n°3 · garde-manger" photoSlug="coriander"           progress={32} daysToHarvest={18} status="warning" /></RevealItem>
                <RevealItem><PlantPhotoCard name="Capucines"            variety="Bac n°4 · vitrine"      photoSlug="nasturtium"          progress={88} daysToHarvest={3} status="ready" /></RevealItem>
              </Reveal>
            </Section>

            <Section title="Live cuisine">
              <div className="grid sm:grid-cols-2 gap-4">
                <LiveSparkCard title="CO₂ cuisine" sensor="co2" unit="ppm" accent="#1E8C5A" />
                <LiveSparkCard title="Humidité bacs" sensor="humidity" unit="%" accent="#0F7A4A" />
              </div>
            </Section>
          </div>

          <div className="space-y-6">
            <RevealItem><AISuggestionCard /></RevealItem>

            <Section title="Plat signature du jour">
              <div className="card !p-0 overflow-hidden">
                <div className="relative h-44 w-full">
                  <Image src={photos["chef-herbs"].url} alt="Plat signature" fill className="object-cover" sizes="400px" />
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-wider text-[#888B8D]">Storytelling auto</div>
                  <div className="t-display-md mt-1">Tartare aux herbes de la maison</div>
                  <p className="text-sm text-[#3D4246]/80 mt-2">QR menu prêt à imprimer + post Instagram généré.</p>
                  <div className="mt-4 flex gap-2">
                    <ToastButton
                      className="btn btn-primary btn-sm"
                      toast={{ tone: "success", title: "PDF généré", body: "Le QR menu est prêt à imprimer." }}
                    >
                      PDF
                    </ToastButton>
                    <ActionButton
                      className="btn btn-secondary btn-sm"
                      prompt="Donne-moi une variante créative de ce plat signature"
                    >
                      Variante IA
                    </ActionButton>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Service">
              <div className="card">
                <AlertItem tone="warning" title="Bac n°3 · pH" body="Ajustez +0,3 pH avant 20h." time="il y a 12 min" />
                <AlertItem tone="success" title="Récolte conseillée" body="Radis + capucines → assiette du service." time="prêt" />
                <AlertItem tone="info" title="Réassort auto" body="Substrat & graines livrés sous 3j." time="programmé" />
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
