"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Reveal, RevealItem } from "../motion";
import { I } from "../Icons";
import { ActionButton, ToastButton } from "../CopilotInline";
import { useStore } from "../store";
import { getProduct, getProducts, type Product } from "../../catalog";
import type { PersonaId } from "../../personas";

const FEATURE_ICONS = {
  leaf:      I.Leaf,
  sensor:    I.Spark,
  ai:        I.Spark,
  led:       I.Sun,
  watering:  I.Drop,
  support:   I.Users,
  warranty:  I.Check,
  school:    I.School,
  esg:       I.Chart,
} as const;

export function ProductView({ persona, slug }: { persona: PersonaId; slug: string }) {
  const product = getProduct(slug);
  const { toast, askCopilot } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [withSaaS, setWithSaaS] = useState(true);

  const crossSell = useMemo(
    () => (product?.crossSell ?? []).map((s) => getProduct(s)).filter(Boolean) as Product[],
    [product]
  );
  const complementary = useMemo(
    () => (product?.complementary ?? []).map((s) => getProduct(s)).filter(Boolean) as Product[],
    [product]
  );
  const similar = useMemo(
    () => product ? getProducts({ category: product.category }).filter((p) => p.id !== product.id).slice(0, 3) : [],
    [product]
  );

  if (!product) {
    return (
      <div className="card text-center py-16">
        <p className="t-display-md">Produit introuvable</p>
        <Link href={`/app/${persona}/kits`} className="btn btn-primary mt-6 inline-flex">← Catalogue</Link>
      </div>
    );
  }

  const saasMonthly = product.recurring?.priceEUR ?? 0;
  const totalToday = product.priceEUR * qty;
  const totalMonthly = withSaaS ? saasMonthly * qty : 0;
  const annualROI = persona === "restaurant" ? Math.round((218 + 644 - 149) * 12) : null;

  return (
    <Reveal className="space-y-10">
      {/* Breadcrumb mini */}
      <RevealItem>
        <div className="flex items-center gap-2 text-sm text-[#888B8D]">
          <Link href={`/app/${persona}/kits`} className="hover:text-[#0F7A4A]">Catalogue</Link>
          <I.Arrow width={12} height={12} className="rotate-0" />
          <span className="text-[#3D4246]">{product.name}</span>
        </div>
      </RevealItem>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
        {/* Gallery */}
        <RevealItem className="space-y-3">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-[#E8F5EE]">
            <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="absolute inset-0">
              <Image src={product.gallery[activeImg] ?? product.hero} alt={product.name} fill sizes="(max-width:1024px) 100vw, 700px" className="object-cover" priority />
            </motion.div>
            {product.badge && (
              <span className="absolute top-4 left-4 chip text-white" style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#2DB866 100%)" }}>
                {product.badge}
              </span>
            )}
            <span className="absolute top-4 right-4 chip chip-neutral !bg-white/90 font-mono">
              ★ {product.rating} · {product.reviews} avis
            </span>
          </div>
          {product.gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.gallery.map((g, i) => (
                <button
                  key={g + i}
                  onClick={() => setActiveImg(i)}
                  className={`relative h-16 w-24 rounded-xl overflow-hidden shrink-0 transition-all ${
                    i === activeImg ? "ring-2 ring-[#2DB866]" : "opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Image ${i + 1}`}
                >
                  <Image src={g} alt="" fill sizes="100px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </RevealItem>

        {/* Sticky purchase column */}
        <RevealItem>
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="card">
              <div className="text-[10px] uppercase tracking-wider text-[#888B8D]">{categoryLabel(product.category)}</div>
              <h1 className="font-[var(--font-grotesk)] mt-1 text-2xl sm:text-3xl font-bold text-[#0A1F13] leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-[#3D4246]/80 mt-1">{product.subtitle}</p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold text-[#0A1F13]">{product.priceEUR.toLocaleString("fr-FR")} €</span>
                <span className="text-sm text-[#888B8D]">{product.priceUnit}</span>
              </div>
              {product.recurring && (
                <label className={`mt-3 flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-colors ${
                  withSaaS ? "border-[#2DB866] bg-[#E8F5EE]" : "border-[#E2EEE7] bg-white"
                }`}>
                  <input
                    type="checkbox"
                    checked={withSaaS}
                    onChange={(e) => setWithSaaS(e.target.checked)}
                    className="h-5 w-5 accent-[#0F7A4A]"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-[#0A1F13]">Inclure l'abonnement App</span>
                    <span className="block text-xs text-[#888B8D]">Copilote IA + analytics · sans engagement.</span>
                  </span>
                  <span className="font-mono font-bold text-[#0F7A4A]">+{product.recurring.priceEUR}€</span>
                </label>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-[#888B8D]">Quantité</span>
                <div className="inline-flex items-center rounded-full bg-[#E8F5EE]">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-9 w-9 grid place-items-center text-[#0F7A4A] font-bold text-lg" aria-label="Diminuer">−</button>
                  <span className="font-mono font-bold text-[#0A1F13] w-8 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="h-9 w-9 grid place-items-center text-[#0F7A4A] font-bold text-lg" aria-label="Augmenter">+</button>
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 rounded-xl bg-[#F4FAF7] p-3 flex items-center justify-between text-sm">
                <div>
                  <div className="text-[#888B8D]">Aujourd'hui</div>
                  <div className="font-mono font-bold text-[#0A1F13]">{totalToday.toLocaleString("fr-FR")} €</div>
                </div>
                {totalMonthly > 0 && (
                  <div className="text-right">
                    <div className="text-[#888B8D]">Puis chaque mois</div>
                    <div className="font-mono font-bold text-[#0F7A4A]">{totalMonthly.toLocaleString("fr-FR")} € / {product.recurring!.period}</div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  onClick={() => toast({ tone: "success", title: `${product.name} ajouté au panier`, body: `${qty} unité${qty > 1 ? "s" : ""} · ${totalToday.toLocaleString("fr-FR")} €` })}
                  className="btn btn-primary"
                >
                  <I.Plus width={16} height={16} /> Ajouter au panier · {totalToday.toLocaleString("fr-FR")} €
                </motion.button>
                <ActionButton
                  className="btn btn-secondary"
                  icon={<I.Spark width={16} height={16} />}
                  prompt={`Aide-moi à configurer le ${product.name} pour mon profil ${persona}`}
                >
                  Configurer avec l'IA
                </ActionButton>
              </div>

              {/* Trust mini band */}
              <ul className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-[#888B8D]">
                <li className="flex items-center gap-1.5"><I.Truck width={14} height={14} /> Livraison 5 j</li>
                <li className="flex items-center gap-1.5"><I.Check width={14} height={14} /> Garantie 14 j</li>
                <li className="flex items-center gap-1.5"><I.Spark width={14} height={14} /> Paiement 3x</li>
              </ul>
            </div>

            {annualROI && (
              <div
                className="card text-white !p-4"
                style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#1E8C5A 60%,#2DB866 100%)" }}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-80">Estimation ROI restaurant</div>
                <div className="font-mono text-2xl font-bold mt-1">+{annualROI.toLocaleString("fr-FR")} € / an</div>
                <div className="text-xs opacity-85 mt-1">Économies herbes + valeur storytelling — données moyennes pilotes 2025.</div>
              </div>
            )}
          </div>
        </RevealItem>
      </div>

      {/* Pitch + features */}
      <RevealItem>
        <div className="card">
          <p className="t-body-lg text-[#0A1F13]">{product.longPitch}</p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.features.map((f) => {
              const Icon = FEATURE_ICONS[f.icon] ?? I.Leaf;
              return (
                <div key={f.title} className="rounded-2xl bg-[#F4FAF7] p-4">
                  <span className="h-10 w-10 grid place-items-center rounded-xl bg-white text-[#0F7A4A]"><Icon /></span>
                  <div className="mt-3 font-semibold text-[#0A1F13]">{f.title}</div>
                  <div className="text-sm text-[#3D4246]/80 mt-1">{f.body}</div>
                </div>
              );
            })}
          </div>
        </div>
      </RevealItem>

      {/* Included + Specs */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RevealItem>
          <div className="card">
            <h2 className="t-display-md">Ce qui est inclus</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#3D4246]">
              {product.includes.map((it) => (
                <li key={it} className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#2DB866]"><I.Check width={16} height={16} /></span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="card">
            <h2 className="t-display-md">Spécifications</h2>
            <dl className="mt-4 divide-y divide-[#E2EEE7] text-sm">
              {product.specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2.5">
                  <dt className="text-[#888B8D]">{s.label}</dt>
                  <dd className="font-mono text-[#0A1F13] font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </RevealItem>
      </div>

      {/* Cross-sell */}
      {crossSell.length > 0 && (
        <section>
          <div className="flex items-end justify-between flex-wrap gap-2 mb-4">
            <h2 className="t-display-md">Souvent achetés ensemble</h2>
            <span className="chip">Économisez 8 % avec le pack</span>
          </div>
          <BundleStrip main={product} extras={crossSell} persona={persona} />
        </section>
      )}

      {/* Complementary */}
      {complementary.length > 0 && (
        <section>
          <h2 className="t-display-md mb-4">Pour aller plus loin</h2>
          <Reveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {complementary.map((c) => (
              <RevealItem key={c.id}><MiniCard product={c} persona={persona} /></RevealItem>
            ))}
          </Reveal>
        </section>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <section>
          <h2 className="t-display-md mb-4">Autres {categoryLabel(product.category)}s</h2>
          <Reveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similar.map((c) => (
              <RevealItem key={c.id}><MiniCard product={c} persona={persona} /></RevealItem>
            ))}
          </Reveal>
        </section>
      )}
    </Reveal>
  );
}

/* ─────────── Mini card (for cross-sell / complementary) ─────────── */

function MiniCard({ product, persona }: { product: Product; persona: PersonaId }) {
  const { toast } = useStore();
  return (
    <motion.article whileHover={{ y: -2 }} className="card !p-3 flex gap-3 items-center">
      <Link href={`/app/${persona}/kits/${product.slug}`} className="relative h-20 w-20 rounded-xl overflow-hidden shrink-0 bg-[#F4FAF7]">
        <Image src={product.hero} alt={product.name} fill sizes="80px" className="object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-[#888B8D]">{categoryLabel(product.category)}</div>
        <Link href={`/app/${persona}/kits/${product.slug}`} className="block text-sm font-semibold text-[#0A1F13] truncate hover:text-[#0F7A4A]">
          {product.name}
        </Link>
        <div className="font-mono text-sm font-bold text-[#0F7A4A] mt-0.5">
          {product.priceEUR} €<span className="text-[10px] text-[#888B8D] font-sans ml-1">{product.priceUnit}</span>
        </div>
      </div>
      <button
        onClick={() => toast({ tone: "success", title: `${product.name} ajouté`, body: "Vérifiez votre panier." })}
        className="btn btn-ghost btn-sm !px-2"
        aria-label={`Ajouter ${product.name} au panier`}
      >
        <I.Plus width={16} height={16} />
      </button>
    </motion.article>
  );
}

/* ─────────── Bundle strip (frequently bought together) ─────────── */

function BundleStrip({ main, extras, persona }: { main: Product; extras: Product[]; persona: PersonaId }) {
  const { toast } = useStore();
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(extras.map((e) => [e.id, true]))
  );
  const subtotal = main.priceEUR + extras.reduce((acc, e) => acc + (selected[e.id] ? e.priceEUR : 0), 0);
  const bundleDiscount = Math.round(subtotal * 0.08);
  const total = subtotal - bundleDiscount;

  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-3">
        <Tile product={main} persona={persona} required />
        {extras.map((e) => (
          <>
            <span key={`plus-${e.id}`} className="text-[#A8AAAD] font-bold text-xl shrink-0">+</span>
            <Tile
              key={e.id}
              product={e}
              persona={persona}
              checked={selected[e.id]}
              onToggle={() => setSelected((s) => ({ ...s, [e.id]: !s[e.id] }))}
            />
          </>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-[#F4FAF7] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs text-[#888B8D]">Pack complet</div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[#0F7A4A]">{total.toLocaleString("fr-FR")} €</span>
            <span className="text-sm text-[#888B8D] line-through">{subtotal.toLocaleString("fr-FR")} €</span>
            <span className="chip">−{bundleDiscount} €</span>
          </div>
        </div>
        <button
          onClick={() => toast({ tone: "success", title: "Pack ajouté au panier", body: `${total.toLocaleString("fr-FR")} € · économisez ${bundleDiscount} €.` })}
          className="btn btn-primary btn-sm"
        >
          <I.Plus width={16} height={16} /> Ajouter le pack
        </button>
      </div>
    </div>
  );
}

function Tile({
  product, persona, required, checked = true, onToggle,
}: {
  product: Product; persona: PersonaId; required?: boolean; checked?: boolean; onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={required}
      onClick={onToggle}
      className={`flex-1 min-w-[160px] flex flex-col items-stretch rounded-2xl overflow-hidden border-2 transition-all text-left ${
        required
          ? "border-[#0F7A4A] bg-[#E8F5EE] cursor-default"
          : checked
            ? "border-[#2DB866]"
            : "border-[#E2EEE7] opacity-60 hover:opacity-100"
      }`}
    >
      <span className="relative aspect-[5/3] bg-[#F4FAF7]">
        <Image src={product.hero} alt={product.name} fill sizes="200px" className="object-cover" />
        {required && <span className="absolute top-2 left-2 chip bg-[#0F7A4A] text-white">Ce produit</span>}
      </span>
      <span className="p-2.5">
        <span className="block text-[10px] uppercase tracking-wider text-[#888B8D]">{product.category}</span>
        <span className="block text-sm font-semibold text-[#0A1F13] truncate">{product.name}</span>
        <span className="block font-mono text-sm font-bold text-[#0F7A4A]">{product.priceEUR} €</span>
      </span>
    </button>
  );
}

function categoryLabel(c: Product["category"]) {
  return c === "kit" ? "Kit" : c === "saas" ? "Abonnement" : c === "consumable" ? "Consommable" : "Accessoire";
}
