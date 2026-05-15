"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "./store";
import { I } from "./Icons";

const TONE = {
  success: { ring: "bg-[#E8F5EE] text-[#0F7A4A]", border: "border-[#B8E0C7]", icon: <I.Check /> },
  info:    { ring: "bg-[#E6EEFC] text-[#1E4FB0]", border: "border-[#BAD0F2]", icon: <I.Bell /> },
  warning: { ring: "bg-[#FFF4E5] text-[#B86E12]", border: "border-[#F2D9AE]", icon: <I.Bell /> },
};

export function Toaster() {
  const { toasts } = useStore();
  return (
    <div
      className="fixed z-[120] left-1/2 -translate-x-1/2 bottom-24 lg:bottom-6 lg:left-auto lg:right-6 lg:translate-x-0 flex flex-col items-stretch gap-2 pointer-events-none w-[min(380px,calc(100vw-2rem))]"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const k = TONE[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={`pointer-events-auto rounded-2xl bg-white border ${k.border} shadow-brand-md p-3 flex items-start gap-3`}
              role="status"
            >
              <span className={`h-9 w-9 grid place-items-center rounded-xl shrink-0 ${k.ring}`}>{k.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#0A1F13] leading-snug">{t.title}</div>
                {t.body && <div className="text-xs text-[#3D4246]/80 mt-0.5">{t.body}</div>}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
