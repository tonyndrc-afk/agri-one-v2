"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useStore } from "./store";
import { I } from "./Icons";

const SUGGESTIONS = [
  "Arroser le bac n°1",
  "Diagnostiquer mon pH",
  "Planifier la récolte",
  "Optimiser la lumière",
];

export function CopilotFab() {
  const { toggleAI, ai } = useStore();
  return (
    <motion.button
      onClick={toggleAI}
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 16 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="hidden lg:grid fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full place-items-center text-white shadow-brand-lg"
      style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#2DB866 100%)" }}
      aria-label="Ouvrir le copilote IA"
    >
      <motion.span
        animate={ai.busy ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 1.4, repeat: ai.busy ? Infinity : 0, ease: "linear" }}
      >
        <I.Spark width={22} height={22} />
      </motion.span>
      {ai.busy && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 0 0 rgba(45,184,102,0.6)" }}
          animate={{ boxShadow: ["0 0 0 0 rgba(45,184,102,0.6)", "0 0 0 14px rgba(45,184,102,0)"] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

export function CopilotPanel() {
  const { ai, closeAI, sendMessage, perform } = useStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [ai.messages, ai.busy]);

  return (
    <AnimatePresence>
      {ai.open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAI}
          />
          <motion.aside
            key="panel"
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-brand-lg flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            {/* Header */}
            <header className="px-5 py-4 flex items-center justify-between border-b border-[#E2EEE7]">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl grid place-items-center text-white"
                  style={{ background: "linear-gradient(135deg,#0F7A4A 0%,#2DB866 100%)" }}
                >
                  <I.Spark />
                </div>
                <div>
                  <div className="font-[var(--font-grotesk)] font-bold text-[#0A1F13]">Copilote Agri One</div>
                  <div className="text-xs text-[#888B8D] flex items-center gap-2">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-[#2DB866]"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                    {ai.busy ? "Analyse en cours…" : "Prêt à piloter vos cultures"}
                  </div>
                </div>
              </div>
              <button onClick={closeAI} className="btn btn-ghost btn-sm" aria-label="Fermer">✕</button>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#F4FAF7]">
              {ai.messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : ""}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-grad-cta text-white rounded-br-sm"
                        : "bg-white text-[#0A1F13] rounded-bl-sm shadow-card"
                    }`}
                  >
                    {m.text || (
                      <motion.span
                        className="inline-flex gap-1"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#A8AAAD]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#A8AAAD]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#A8AAAD]" />
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}
              {ai.busy && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[85%]">
                  <div className="rounded-2xl px-4 py-2.5 bg-white shadow-card inline-flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-[#A8AAAD]"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggestions + actions */}
            <div className="px-5 pt-3 border-t border-[#E2EEE7] bg-white">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="chip hover:bg-[#D9EFE0] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                <ActionBtn label="Eau" icon={<I.Drop />} onClick={() => perform("water")} />
                <ActionBtn label="pH+"  icon={<I.Flask />} onClick={() => perform("ph-up")} />
                <ActionBtn label="LED" icon={<I.Sun />} onClick={() => perform("light-on")} />
                <ActionBtn label="Récolte" icon={<I.Leaf />} onClick={() => perform("harvest")} />
              </div>

              <form
                className="flex items-center gap-2 pb-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!input.trim()) return;
                  sendMessage(input.trim());
                  setInput("");
                }}
              >
                <input
                  className="input !h-12"
                  placeholder="Posez une question à votre potager…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary !h-12 !px-4" aria-label="Envoyer">
                  <I.Arrow />
                </button>
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ActionBtn({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#F4FAF7] hover:bg-[#E8F5EE] py-2.5 text-[11px] text-[#0F7A4A] font-semibold"
    >
      <span>{icon}</span>
      {label}
    </motion.button>
  );
}
