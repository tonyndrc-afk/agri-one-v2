"use client";
import { motion } from "framer-motion";
import { useStore } from "./store";
import { I } from "./Icons";
import type { ReactNode } from "react";

export function ActionButton({
  children,
  prompt,
  toast,
  className = "btn btn-secondary btn-sm",
  icon,
  ariaLabel,
}: {
  children?: ReactNode;
  prompt?: string;
  toast?: { tone: "success" | "info" | "warning"; title: string; body?: string };
  className?: string;
  icon?: ReactNode;
  ariaLabel?: string;
}) {
  const store = useStore();
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      className={className}
      aria-label={ariaLabel}
      onClick={() => {
        if (toast) store.toast(toast);
        if (prompt) store.askCopilot(prompt);
      }}
    >
      {icon}
      {children}
    </motion.button>
  );
}

export function ToastButton({
  children,
  toast,
  className = "btn btn-secondary btn-sm",
  icon,
}: {
  children?: ReactNode;
  toast: { tone: "success" | "info" | "warning"; title: string; body?: string };
  className?: string;
  icon?: ReactNode;
}) {
  const { toast: pushToast } = useStore();
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      onClick={() => pushToast(toast)}
      className={className}
    >
      {icon}
      {children}
    </motion.button>
  );
}

export function OpenCopilotBtn({
  children,
  className = "btn btn-primary btn-sm",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { openAI } = useStore();
  return (
    <button onClick={openAI} className={className}>
      <I.Spark width={16} height={16} /> {children ?? "Piloter avec l'IA"}
    </button>
  );
}

export function AISuggestionCard() {
  const { openAI, ai } = useStore();
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card relative overflow-hidden cursor-pointer"
      onClick={openAI}
      style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#1E8C5A 60%,#2DB866 100%)" }}
    >
      <div className="text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
            <motion.span
              className="h-2 w-2 rounded-full bg-[#7DD9A3]"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Assistant IA · {ai.busy ? "réflexion…" : "actif"}
          </div>
          <I.Spark />
        </div>
        <div className="t-display-md mt-3">Diagnostic instantané de vos bacs</div>
        <p className="text-sm text-white/80 mt-1">
          Demandez-moi d'arroser, corriger le pH, planifier une récolte ou créer une recette.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Arroser", "pH +", "Planifier récolte"].map((t) => (
            <span key={t} className="chip" style={{ background: "rgba(255,255,255,0.18)", color: "white" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
