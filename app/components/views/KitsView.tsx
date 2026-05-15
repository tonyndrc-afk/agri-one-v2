"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Reveal, RevealItem } from "../motion";
import { I } from "../Icons";
import { ActionButton, ToastButton } from "../CopilotInline";
import { useStore } from "../store";
import { getProducts, type Product, type ProductCategory } from "../../catalog";
import type { PersonaId } from "../../personas";

const TABS: { id: ProductCategory; label: string }[] = [
  { id: "kit",        label: "Kits" },
  { id: "saas",       label: "Abonnements" },
  { id: "consumable", label: "Consommables" },
  { id: "accessory",  label: "Accessoires" },
];

const PERSONA_HOOK: Record<PersonaId, { headline: string; subtitle: string }> = {
  particulier: {
    headline: "Le potager qui se pilote tout seul.",
    subtitle: "Tout ce qu'il faut pour cultiver vos herbes et vos légumes à la maison — sans expertise.",
  },
  restaurant: {
    headline: "Une carte ultra-locale signée le matin même.",
    subtitle: "Kits pro, micro-pousses signatures, co-branding et ROI mesurable dès le 7ᵉ mois.",
  },
  ecole: {
    headline: "Apprendre par le vivant, toute l'année.",
    subtitle: "Kits pédagogiques, mode vacances, programme aligné CP – CM2 et reporting mairie.",
  },
  bureau: {
    headline: "Le vivant qui infuse votre RSE.",
    subtitle: "Bien-être collaborateurs, reporting ESG, installation clé en main et co-branding.",
  },
};

export function KitsView({ persona }: { persona: PersonaId }) {
  const [tab, setTab] = useState<ProductCategory>("kit");
  const { askCopilot, toast } = useStore();
  const hook = PERSONA_HOOK[persona];

  const recommended = useMemo(() => getProducts({ category: "kit", persona }), [persona]);
  const allOfTab = useMemo(() => getProducts({ category: tab }), [tab]);
  const recommendedForPersona = useMemo(() => allOfTab.filter((p) => p.targetPersonas.includes(persona)), [allOfTab, persona]);
  const otherInTab = useMemo(() => allOfTab.filter((p) => !p.targetPersonas.includes(persona)), [allOfTab, persona]);

  return (
    <Reveal className="space-y-10">
      {/* Hero pitch */}
      <RevealItem>
        <div className="relative rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#1E8C5A 60%,#2DB866 100%)" }}
          />
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 p-6 sm:p-10 items-center">
            <div className="text-white max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-wider">
                <I.Spark width={12} height={12} /> Catalogue 2026
              </span>
              <h1 className="font-[var(--font-grotesk)] mt-4 font-bold leading-[1.05]" style={{ fontSize: "clamp(28px,4.2vw,46px)" }}>
                {hook.headline}
              </h1>
              <p className="mt-3 text-white/85 max-w-xl">{hook.subtitle}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <ActionButton
                  className="btn btn-sm bg-white text-[#0F7A4A] hover:bg-white/90"
                  prompt={`Quel kit Agri One choisir pour mon profil ${persona} ?`}
                  icon={<I.Spark width={16} height={16} />}
                >
                  Conseil IA
                </ActionButton>
                <ToastButton
                  className="btn btn-sm bg-transparent border border-white/40 text-white hover:bg-white/10"
                  toast={{ tone: "info", title: "Rappel programmé", body: "Un conseiller vous rappelle sous 24h." }}
                  icon={<I.Users width={16} height={16} />}
                >
                  Être rappelé
                </ToastButton>
              </div>
            </div>

            {/* Mini bundle preview */}
            <div className="hidden lg:flex flex-col gap-2 min-w-[280px]">
              {recommended.slice(0, 2).map((k) => (
                <Link
                  key={k.id}
                  href={`/app/${persona}/kits/${k.slug}`}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur p-2.5 hover:bg-white/15 transition-colors text-white"
                >
                  <span className="relative h-16 w-24 rounded-xl overflow-hidden bg-white/20 shrink-0">
                    <Image src={k.hero} alt="" fill className="object-cover" sizes="96px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] uppercase tracking-wider opacity-80">Recommandé</span>
                    <span className="block text-sm font-semibold truncate">{k.name}</span>
                    <span className="block text-xs opacity-80">{k.priceEUR} € · {k.recurring?.priceEUR}€/mo</span>
                  </span>
                  <I.Arrow width={16} height={16} className="opacity-80" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </RevealItem>

      {/* Tabs */}
      <RevealItem>
        <div role="tablist" className="flex flex-wrap gap-2 sticky top-16 lg:top-20 z-10 bg-[#F4FAF7]/80 backdrop-blur py-2 -mx-1 px-1">
          {TABS.map((t) => {
            const isActive = tab === t.id;
            const count = getProducts({ category: t.id }).length;
            return (
              <motion.button
                key={t.id}
                role="tab"
                aria-selected={isActive}
                whileTap={{ scale: 0.96 }}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors ${
                  isActive ? "bg-[#0F7A4A] text-white shadow-brand-sm" : "bg-white text-[#3D4246] hover:bg-[#E8F5EE]"
                }`}
              >
                {t.label}
                <span className={`text-[11px] font-mono px-1.5 rounded-full ${isActive ? "bg-white/20" : "bg-[#E8F5EE]"}`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </RevealItem>

      {/* Recommended for persona */}
      {recommendedForPersona.length > 0 && (
        <section>
          <div className="flex items-end justify-between flex-wrap gap-2 mb-4">
            <h2 className="t-display-md flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2DB866]" /> Recommandés pour vous
            </h2>
            <span className="chip">{recommendedForPersona.length}</span>
          </div>
          <Reveal className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {recommendedForPersona.map((p) => (
              <RevealItem key={p.id}><ProductCard product={p} persona={persona} highlight /></RevealItem>
            ))}
          </Reveal>
        </section>
      )}

      {otherInTab.length > 0 && (
        <section>
          <div className="flex items-end justify-between flex-wrap gap-2 mb-4">
            <h2 className="t-display-md">Aussi disponible</h2>
            <span className="chip chip-neutral">{otherInTab.length}</span>
          </div>
          <Reveal className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {otherInTab.map((p) => (
              <RevealItem key={p.id}><ProductCard product={p} persona={persona} /></RevealItem>
            ))}
          </Reveal>
        </section>
      )}

      {/* Trust band */}
      <RevealItem>
        <div className="card grid sm:grid-cols-3 gap-6 !p-6 bg-white">
          {[
            { i: <I.Truck />,    t: "Livraison sous 5 j",    s: "Partout en France métropolitaine." },
            { i: <I.Spark />,    t: "Garantie 14 jours",      s: "Satisfait ou intégralement remboursé." },
            { i: <I.Settings />, t: "Installation possible",   s: "Service technique inclus dès le Pro Duo." },
          ].map((x) => (
            <div key={x.t} className="flex items-start gap-3">
              <span className="h-10 w-10 rounded-xl bg-[#E8F5EE] text-[#0F7A4A] grid place-items-center shrink-0">{x.i}</span>
              <div>
                <div className="font-semibold text-[#0A1F13]">{x.t}</div>
                <div className="text-sm text-[#3D4246]/80">{x.s}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealItem>
    </Reveal>
  );
}

/* ─────────────────────── ProductCard ─────────────────────── */

function ProductCard({ product, persona, highlight }: { product: Product; persona: PersonaId; highlight?: boolean }) {
  const { toast } = useStore();
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`card !p-0 overflow-hidden flex flex-col h-full ${highlight ? "leaf-ring" : ""}`}
    >
      <Link href={`/app/${persona}/kits/${product.slug}`} className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#F4FAF7] block group">
        <Image src={product.hero} alt={product.name} fill sizes="(max-width:768px) 100vw, 400px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        {product.badge && (
          <span
            className="absolute top-3 left-3 chip text-white"
            style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#2DB866 100%)" }}
          >
            {product.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 chip chip-neutral !bg-white/90">
          ★ {product.rating} <span className="opacity-60">({product.reviews})</span>
        </span>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-[10px] uppercase tracking-wider text-[#888B8D]">{categoryLabel(product.category)}</div>
        <Link href={`/app/${persona}/kits/${product.slug}`} className="t-display-md mt-1 hover:text-[#0F7A4A] transition-colors leading-tight">
          {product.name}
        </Link>
        <div className="text-sm text-[#3D4246]/80 mt-1">{product.subtitle}</div>

        <ul className="mt-3 space-y-1.5 text-sm text-[#3D4246]">
          {product.features.slice(0, 3).map((f) => (
            <li key={f.title} className="flex items-start gap-2">
              <span className="mt-0.5 text-[#2DB866]"><I.Check width={14} height={14} /></span>
              <span><strong className="font-semibold text-[#0A1F13]">{f.title}</strong> · {f.body}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5 flex items-end justify-between border-t border-dashed border-[#E2EEE7] mt-5">
          <div>
            <div className="font-mono text-2xl font-bold text-[#0A1F13]">
              {product.priceEUR.toLocaleString("fr-FR")} €
              <span className="text-xs text-[#888B8D] ml-1">{product.priceUnit ?? ""}</span>
            </div>
            {product.recurring && (
              <div className="text-xs text-[#0F7A4A] font-medium">
                + {product.recurring.priceEUR} € / {product.recurring.period}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => toast({ tone: "success", title: `${product.name} ajouté au panier`, body: "Retrouvez-le dans votre commande." })}
              className="btn btn-primary btn-sm"
            >
              <I.Plus width={16} height={16} /> Ajouter
            </button>
            <Link href={`/app/${persona}/kits/${product.slug}`} className="btn btn-ghost btn-sm">
              Détails <I.Arrow width={14} height={14} />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function categoryLabel(c: ProductCategory) {
  return c === "kit" ? "Kit" : c === "saas" ? "Abonnement" : c === "consumable" ? "Consommable" : "Accessoire";
}
