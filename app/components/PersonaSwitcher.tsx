"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { I } from "./Icons";
import { useStore } from "./store";
import { personas, type PersonaId } from "../personas";

const ICONS = {
  particulier: I.Home,
  restaurant: I.Chef,
  ecole: I.School,
  bureau: I.Office,
} as const;

export function PersonaSwitcher({ current }: { current: PersonaId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useStore();
  const cur = personas.find((p) => p.id === current)!;
  const CurIcon = ICONS[current];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const { startTransition } = useStore();
  const switchTo = (id: PersonaId) => {
    if (id === current) { setOpen(false); return; }
    try { localStorage.setItem("ao-persona", id); } catch {}
    const p = personas.find((x) => x.id === id)!;
    // Preserve the current section: /app/<old>/<sub> → /app/<new>/<sub>
    const tail = (pathname || "").replace(/^\/app\/[^/]+/, "");
    const target = `/app/${id}${tail || ""}`;
    setOpen(false);
    startTransition({ persona: id, label: p.label, accent: p.accent });
    setTimeout(() => router.push(target), 250);
    // Toast lands after the dashboard mounts; the overlay covers the transition.
    setTimeout(() => toast({ tone: "success", title: `Espace ${p.label}`, body: "Votre tableau de bord est prêt." }), 1400);
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 sm:gap-2.5 rounded-xl pl-1.5 pr-2.5 sm:pl-2 sm:pr-3 py-1.5 bg-[#E8F5EE] hover:bg-[#D9EFE0] transition-colors text-left"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Espace actuel : ${cur.label}. Cliquer pour changer d'espace.`}
      >
        <span
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg grid place-items-center text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${cur.accent} 0%, #42C97A 100%)` }}
        >
          <CurIcon width={16} height={16} />
        </span>
        <span className="hidden sm:flex flex-col leading-tight min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-[#888B8D]">Espace</span>
          <span className="text-sm font-semibold text-[#0F7A4A] truncate">{cur.label}</span>
        </span>
        <span className="sm:hidden text-sm font-semibold text-[#0F7A4A]">{cur.label}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
          className="text-[#0F7A4A] shrink-0"
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 mt-2 w-[300px] max-w-[calc(100vw-1rem)] bg-white border border-[#E2EEE7] rounded-2xl shadow-brand-lg overflow-hidden z-[70]"
          >
            <div className="px-4 py-3 border-b border-[#E2EEE7] flex items-center justify-between bg-[#F4FAF7]">
              <span className="text-[10px] uppercase tracking-wider text-[#888B8D] font-semibold">Changer d'espace</span>
              <span className="chip chip-neutral">{personas.length} profils</span>
            </div>

            <ul className="p-1.5">
              {personas.map((p) => {
                const Icon = ICONS[p.id];
                const isCurrent = p.id === current;
                return (
                  <li key={p.id}>
                    <button
                      role="menuitem"
                      onClick={() => switchTo(p.id)}
                      className={`group w-full flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors ${
                        isCurrent ? "bg-[#E8F5EE]" : "hover:bg-[#F4FAF7]"
                      }`}
                    >
                      <span
                        className="h-10 w-10 rounded-xl grid place-items-center text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${p.accent} 0%, #42C97A 100%)` }}
                      >
                        <Icon width={20} height={20} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-[#0A1F13] truncate">{p.label}</span>
                        <span className="block text-xs text-[#888B8D] truncate">{p.hero}</span>
                      </span>
                      {isCurrent ? (
                        <span className="chip">Actif</span>
                      ) : (
                        <span className="text-[#A8AAAD] group-hover:text-[#0F7A4A] transition-colors">
                          <I.Arrow width={16} height={16} />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="px-3 pb-3 pt-1 border-t border-[#E2EEE7] bg-white">
              <button
                onClick={() => { setOpen(false); router.push("/profil"); }}
                className="btn btn-ghost btn-sm w-full !text-[#0F7A4A]"
              >
                Ouvrir la page de sélection complète →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
