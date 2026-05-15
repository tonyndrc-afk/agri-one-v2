"use client";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "./store";
import { I } from "./Icons";
import { personas, type PersonaId } from "../personas";
import type { ReactNode } from "react";

export type NavItem = { label: string; href: string; icon: ReactNode };

export function PersistPersona({ persona }: { persona: PersonaId }) {
  useEffect(() => {
    try { localStorage.setItem("ao-persona", persona); } catch {}
  }, [persona]);
  return null;
}

/* Items marked as the live, working tab. Everything else is mocked → toast. */
const LIVE_LABELS = new Set(["Tableau de bord", "Mes bacs", "Récoltes", "Kits & produits"]);
const isLiveLabel = (label: string) => LIVE_LABELS.has(label);

/* ─────────────────────── Bottom nav ─────────────────────── */

export function MobileNav({ items, active }: { items: NavItem[]; active: string }) {
  const { openAI, toast } = useStore();
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[#E2EEE7] bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(15,122,74,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navigation principale"
    >
      <div className="flex items-stretch justify-between px-1">
        {items.slice(0, 3).map((it) => {
          const isActive = it.label === active;
          const isLive = isLiveLabel(it.label);
          const className =
            "flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2.5";
          const inner = (
            <>
              <span className={isActive ? "text-[#0F7A4A]" : "text-[#A8AAAD]"}>{it.icon}</span>
              <span
                className={`text-[10px] font-semibold leading-tight truncate max-w-full px-1 ${
                  isActive ? "text-[#0F7A4A]" : "text-[#888B8D]"
                }`}
              >
                {it.label}
              </span>
            </>
          );
          return isLive ? (
            <Link key={it.label} href={it.href} className={className} aria-current={isActive ? "page" : undefined}>
              {inner}
            </Link>
          ) : (
            <button
              key={it.label}
              type="button"
              onClick={() => toast({ tone: "info", title: it.label, body: "Section bientôt disponible." })}
              className={className}
            >
              {inner}
            </button>
          );
        })}
        <button
          onClick={openAI}
          className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-1.5"
          aria-label="Ouvrir le copilote IA"
        >
          <span
            className="h-10 w-10 rounded-full grid place-items-center text-white shadow-brand-md"
            style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#2DB866 100%)" }}
          >
            <I.Spark width={20} height={20} />
          </span>
          <span className="text-[10px] font-semibold leading-tight text-[#0F7A4A]">Copilote</span>
        </button>
      </div>
    </nav>
  );
}

/* ─────────────────────── Drawer (burger) ─────────────────────── */

export function SidebarDrawerTrigger({
  persona,
  active,
  nav,
}: {
  persona: PersonaId;
  active: string;
  nav: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const p = personas.find((x) => x.id === persona)!;
  const { toast } = useStore();

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const drawer = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-[#0A1F13]/60 backdrop-blur-sm z-[80] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="drawer"
            className="fixed top-0 left-0 bottom-0 z-[90] w-[86%] max-w-[340px] bg-white shadow-brand-lg flex flex-col lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 290, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
          >
            <div
              className="relative px-5 pt-5 pb-6 text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#1E8C5A 60%,#2DB866 100%)" }}
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 grid place-items-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <Image
                  src="/agri-one-logo-mark.png"
                  alt=""
                  width={64}
                  height={64}
                  className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
                />
                <div>
                  <div className="font-[var(--font-grotesk)] text-2xl font-bold leading-tight">Agri One</div>
                  <div className="text-xs italic text-white/80">De la graine à l'assiette.</div>
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-[#7DD9A3]" />
                Espace · <strong className="font-semibold">{p.label}</strong>
              </div>
            </div>

            <nav className="px-3 py-3 flex-1 min-h-0 overflow-y-auto space-y-0.5 bg-white">
              {nav.map((n) => {
                const isActive = n.label === active;
                const isLive = isLiveLabel(n.label);
                const itemClass = `flex items-center gap-3 rounded-xl px-3 py-3 transition-colors w-full text-left ${
                  isActive
                    ? "bg-[#E8F5EE] text-[#0F7A4A]"
                    : "text-[#3D4246] active:bg-[#F4FAF7] hover:bg-[#F4FAF7]"
                }`;
                const inner = (
                  <>
                    <span
                      className={`h-9 w-9 grid place-items-center rounded-xl ${
                        isActive ? "bg-white text-[#0F7A4A] shadow-brand-sm" : "bg-[#F4FAF7] text-[#0F7A4A]"
                      }`}
                    >
                      {n.icon}
                    </span>
                    <span className={`text-[15px] ${isActive ? "font-semibold" : "font-medium"}`}>
                      {n.label}
                    </span>
                    {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-[#2DB866]" />}
                  </>
                );
                return isLive ? (
                  <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className={itemClass}>
                    {inner}
                  </Link>
                ) : (
                  <button
                    key={n.label}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      toast({ tone: "info", title: n.label, body: "Section bientôt disponible dans cette démo." });
                    }}
                    className={itemClass}
                  >
                    {inner}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#E2EEE7] space-y-2 shrink-0 bg-white">
              <Link
                href="/profil"
                onClick={() => setOpen(false)}
                className="btn btn-secondary btn-sm w-full"
              >
                <I.Users width={16} height={16} /> Changer d'espace
              </Link>
              <button
                type="button"
                onClick={() => {
                  try { localStorage.removeItem("ao-persona"); } catch {}
                  setOpen(false);
                  window.location.href = "/";
                }}
                className="btn btn-ghost btn-sm w-full text-[#888B8D]"
              >
                Quitter l'app
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.92 }}
        className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F5EE] text-[#0F7A4A] active:bg-[#D9EFE0]"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </motion.button>
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}

/* ─────────────────────── Alerts bell ─────────────────────── */

export function AlertsBell() {
  const { toast } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const alerts = [
    { t: "pH bac n°1 légèrement bas", body: "Correction recommandée", tone: "warning" as const },
    { t: "Roquette prête à récolter", body: "Bac n°4 · niveau optimal",  tone: "success" as const },
    { t: "Réassort substrat",         body: "Livraison sous 3 jours",     tone: "info" as const    },
  ];

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#3D4246] hover:bg-[#E8F5EE]"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <I.Bell />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E84040] ring-2 ring-white" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-[320px] max-w-[calc(100vw-1rem)] bg-white border border-[#E2EEE7] rounded-2xl shadow-brand-lg overflow-hidden z-[70]"
          >
            <div className="px-4 py-3 border-b border-[#E2EEE7] flex items-center justify-between">
              <span className="font-[var(--font-grotesk)] font-bold text-[#0A1F13]">Notifications</span>
              <span className="chip">3 nouvelles</span>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto">
              {alerts.map((a, i) => (
                <li
                  key={i}
                  className="px-4 py-3 hover:bg-[#F4FAF7] cursor-pointer border-b border-[#E2EEE7] last:border-0"
                  onClick={() => {
                    toast({ tone: a.tone, title: a.t, body: a.body });
                    setOpen(false);
                  }}
                >
                  <div className="flex gap-3">
                    <span
                      className={`h-2 w-2 mt-2 rounded-full shrink-0 ${
                        a.tone === "warning" ? "bg-[#F5A623]" : a.tone === "success" ? "bg-[#2DB866]" : "bg-[#3B82F6]"
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#0A1F13]">{a.t}</div>
                      <div className="text-xs text-[#888B8D]">{a.body}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-3 bg-[#F4FAF7] border-t border-[#E2EEE7]">
              <button
                onClick={() => {
                  toast({ tone: "success", title: "Toutes les alertes marquées comme lues" });
                  setOpen(false);
                }}
                className="btn btn-ghost btn-sm w-full"
              >
                Tout marquer comme lu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────── Avatar menu ─────────────────────── */

export function AvatarMenu() {
  const { toast } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 rounded-full text-white grid place-items-center font-semibold text-sm shadow-brand-sm"
        style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#2DB866 100%)" }}
        aria-label="Mon profil"
      >
        TH
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-60 bg-white border border-[#E2EEE7] rounded-2xl shadow-brand-lg overflow-hidden z-[70]"
          >
            <div className="px-4 py-3 border-b border-[#E2EEE7]">
              <div className="font-semibold text-[#0A1F13]">Tony Ha</div>
              <div className="text-xs text-[#888B8D]">tony@agri-one.fr</div>
            </div>
            <ul className="py-1 text-sm">
              {[
                { l: "Mon profil",     t: "Profil",      body: "Vos préférences sont à jour." as string | undefined },
                { l: "Préférences",    t: "Préférences", body: "Notifications · langue · unités." },
                { l: "Aide & support", t: "Support",     body: "Notre équipe revient sous 24h." },
              ].map((m) => (
                <li key={m.l}>
                  <button
                    onClick={() => {
                      toast({ tone: "info", title: m.t, body: m.body });
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#F4FAF7] text-[#3D4246]"
                  >
                    {m.l}
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-[#E2EEE7]">
              <Link
                href="/profil"
                onClick={() => setOpen(false)}
                className="block w-full text-left px-4 py-2.5 hover:bg-[#F4FAF7] text-[#0F7A4A] font-semibold text-sm"
              >
                Changer d'espace →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────── Desktop sidebar nav items ─────────────────────── */

export function DesktopSidebarNav({ nav, active }: { nav: NavItem[]; active: string }) {
  const { toast } = useStore();
  return (
    <>
      {nav.map((n) => {
        const isActive = n.label === active;
        const isLive = isLiveLabel(n.label);
        const cls = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors w-full text-left ${
          isActive
            ? "bg-[#E8F5EE] text-[#0F7A4A] font-semibold"
            : "text-[#3D4246] hover:bg-[#F4FAF7]"
        }`;
        const content = (
          <>
            <span className={isActive ? "text-[#0F7A4A]" : "text-[#A8AAAD]"}>{n.icon}</span>
            {n.label}
            {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-[#2DB866]" />}
          </>
        );
        return isLive ? (
          <Link key={n.label} href={n.href} className={cls}>{content}</Link>
        ) : (
          <button
            key={n.label}
            type="button"
            onClick={() => toast({ tone: "info", title: n.label, body: "Section bientôt disponible dans cette démo." })}
            className={cls}
          >
            {content}
          </button>
        );
      })}
    </>
  );
}
