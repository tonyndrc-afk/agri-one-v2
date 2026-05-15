"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore } from "./store";
import { I } from "./Icons";

const ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  particulier: I.Home,
  restaurant: I.Chef,
  ecole: I.School,
  bureau: I.Office,
};

const STEPS = [
  "Initialisation des capteurs…",
  "Chargement de vos bacs…",
  "Calibrage du copilote IA…",
  "Bienvenue 🌱",
];

export function PersonaTransition() {
  const { transition, endTransition } = useStore();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!transition) return;
    setStep(0);
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 280);
    const done = setTimeout(endTransition, 1300);
    return () => { clearInterval(id); clearTimeout(done); };
  }, [transition, endTransition]);

  const Icon = transition ? ICONS[transition.persona] : null;

  return (
    <AnimatePresence>
      {transition && (
        <motion.div
          className="fixed inset-0 z-[95] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background: `radial-gradient(60% 60% at 50% 40%, ${transition.accent} 0%, #0A1F13 75%, #0A1F13 100%)`,
          }}
          aria-hidden
        >
          {/* Orbiting dots */}
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="absolute h-2.5 w-2.5 rounded-full"
              style={{ background: "rgba(125,217,163,0.7)", left: "50%", top: "50%" }}
              animate={{
                rotate: 360,
                x: Math.cos((i * Math.PI) / 2) * 110,
                y: Math.sin((i * Math.PI) / 2) * 110,
              }}
              transition={{
                rotate: { duration: 2.6, repeat: Infinity, ease: "linear" },
                x: { duration: 0, delay: i * 0.05 },
                y: { duration: 0, delay: i * 0.05 },
              }}
            />
          ))}

          <div className="flex flex-col items-center text-center px-6">
            {/* Persona icon morphs in */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-28 w-28 grid place-items-center"
            >
              <motion.span
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, ${transition.accent} 0%, #42C97A 100%)`,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute inset-0 rounded-3xl border-2 border-white/40"
                animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <motion.span
                className="absolute inset-0 rounded-3xl border-2 border-white/25"
                animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.5 }}
              />
              {Icon && (
                <span className="relative text-white">
                  <Icon width={56} height={56} />
                </span>
              )}
            </motion.div>

            {/* Logo wordmark */}
            <motion.img
              src="/agri-one-logo-mark.png"
              alt=""
              className="absolute top-8 left-8 h-10 w-10 opacity-90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.9, y: 0 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-7 text-white/70 text-[11px] uppercase tracking-[0.3em]"
            >
              Espace
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="font-[var(--font-grotesk)] text-white text-2xl sm:text-3xl font-bold tracking-tight mt-1"
            >
              {transition.label}
            </motion.div>

            {/* Progress bar */}
            <div className="mt-6 w-56 sm:w-64 h-1 rounded-full bg-white/12 overflow-hidden">
              <motion.div
                className="h-full"
                style={{ background: "linear-gradient(90deg,#42C97A,#7DD9A3)" }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mt-3 text-[11px] uppercase tracking-[0.25em] text-white/70"
              >
                {STEPS[step]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
