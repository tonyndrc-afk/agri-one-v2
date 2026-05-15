"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { I } from "../components/Icons";
import { useStore } from "../components/store";
import { personas, type PersonaId } from "../personas";

export default function ProfilPage() {
  const router = useRouter();
  const { startTransition } = useStore();

  const pick = (id: PersonaId) => {
    try { localStorage.setItem("ao-persona", id); } catch {}
    const p = personas.find((x) => x.id === id)!;
    startTransition({ persona: id, label: p.label, accent: p.accent });
    // Give the overlay a beat to fade in before the route change.
    setTimeout(() => router.push(`/app/${id}`), 250);
  };

  return (
    <main className="min-h-screen bg-grad-soft">
      <header className="mx-auto max-w-6xl px-4 sm:px-6 h-16 sm:h-20 flex items-center gap-3">
        <Image src="/agri-one-logo-mark.png" alt="" width={44} height={44} priority />
        <Image src="/agri-one-logo-full-transparent.png" alt="Agri One" width={130} height={36} className="hidden sm:block" style={{ height: 32, width: "auto" }} />
      </header>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="chip">Étape 1 / 1 · Choisir mon espace</span>
          <h1
            className="font-[var(--font-grotesk)] mt-4 tracking-tight text-[#0A1F13] font-bold"
            style={{ fontSize: "clamp(28px,5vw,52px)", lineHeight: 1.1 }}
          >
            Pour qui cultivez-vous&nbsp;?
          </h1>
          <p className="t-body-md sm:t-body-lg mt-4 text-[#3D4246]/80">
            On adapte le tableau de bord, les capteurs et le copilote IA à votre contexte.
          </p>
        </div>

        <ol className="mt-8 sm:mt-10 grid sm:grid-cols-2 gap-4 sm:gap-5">
          {personas.map((p, idx) => {
            const Icon =
              p.id === "particulier" ? I.Home :
              p.id === "restaurant" ? I.Chef :
              p.id === "ecole" ? I.School : I.Office;
            return (
              <li key={p.id}>
                <button
                  onClick={() => pick(p.id)}
                  className="card text-left w-full h-full flex flex-col hover:shadow-brand-md transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                      style={{ background: `linear-gradient(135deg, ${p.accent} 0%, #42C97A 100%)` }}
                    >
                      <Icon width={26} height={26} />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-[#888B8D]">0{idx + 1}</span>
                  </div>
                  <h2 className="t-display-lg mt-5">{p.label}</h2>
                  <p className="t-body-md text-[#3D4246]/80 mt-2">{p.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2 text-xs">
                    <span className="chip chip-neutral">{p.kit}</span>
                    <span className="chip">{p.saas}</span>
                  </div>
                  <div className="mt-6 pt-5 border-t border-dashed border-[#E2EEE7] flex items-center justify-between">
                    <span className="t-body-sm text-[#888B8D]">{p.hero}</span>
                    <span className="text-[#0F7A4A] font-semibold inline-flex items-center gap-2">
                      Ouvrir <I.Arrow width={16} height={16} />
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
