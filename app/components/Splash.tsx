"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STEPS = [
  "Connexion aux capteurs IoT…",
  "Synchronisation des cultures…",
  "Chargement du copilote IA…",
  "Prêt à pousser 🌱",
];

export function SplashGate() {
  const pathname = usePathname();
  const isEntry = pathname === "/";
  const [visible, setVisible] = useState(isEntry);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isEntry) {
      setVisible(false);
      return;
    }
    setVisible(true);
    setStep(0);
    const stepId = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 480);
    // Hide just AFTER the entry-gate redirect — so the splash covers the route transition.
    const done = setTimeout(() => setVisible(false), 2200);
    return () => { clearInterval(stepId); clearTimeout(done); };
  }, [pathname, isEntry]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, #1E8C5A 0%, #0A1F13 70%, #0A1F13 100%)",
          }}
          aria-hidden
        >
          {/* Floating sparks */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{
                left: `${10 + i * 14}%`,
                top: `${20 + (i % 3) * 24}%`,
                background: "rgba(125,217,163,0.5)",
                filter: "blur(0.5px)",
              }}
              animate={{ y: [-6, 12, -6], opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}

          <div className="flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-36 w-36 grid place-items-center"
            >
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(125,217,163,0.45) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute h-36 w-36 rounded-full border-2 border-[#42C97A]/40"
                animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <motion.img
                src="/agri-one-logo-mark.png"
                alt="Agri One"
                className="relative h-28 w-28 drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 font-[var(--font-grotesk)] text-white text-3xl sm:text-4xl font-bold tracking-tight"
            >
              Agri One
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#7DD9A3] text-sm italic mt-1"
            >
              De la graine à l'assiette.
            </motion.div>

            <div className="mt-8 w-56 sm:w-64 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full"
                style={{ background: "linear-gradient(90deg,#42C97A,#7DD9A3)" }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.0, ease: "easeInOut" }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="mt-4 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-white/70"
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
