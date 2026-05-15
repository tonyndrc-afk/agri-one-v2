"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";

export type SensorKey = "temp" | "humidity" | "ph" | "light" | "co2";
type Sensors = Record<SensorKey, number>;
type History = Record<SensorKey, number[]>;

export type ChatMsg = { id: string; role: "user" | "ai"; text: string; ts: number };
export type Toast = { id: number; tone: "success" | "info" | "warning"; title: string; body?: string };
export type Transition = { persona: string; label: string; accent: string };

type Store = {
  sensors: Sensors;
  history: History;
  isLive: boolean;
  ai: {
    open: boolean;
    busy: boolean;
    messages: ChatMsg[];
  };
  toasts: Toast[];
  transition: Transition | null;
  // sensor actions
  perform: (action: "water" | "ph-up" | "ph-down" | "light-on" | "harvest") => void;
  // ai actions
  openAI: () => void;
  closeAI: () => void;
  toggleAI: () => void;
  sendMessage: (text: string) => void;
  askCopilot: (prompt: string) => void;
  // ui feedback
  toast: (t: Omit<Toast, "id">) => void;
  // persona switch transition
  startTransition: (t: Transition) => void;
  endTransition: () => void;
};

const StoreCtx = createContext<Store | null>(null);

const HISTORY_LEN = 24;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function jitter(v: number, range: number, min: number, max: number) {
  return clamp(v + (Math.random() - 0.5) * range, min, max);
}

const SCRIPTED: Record<string, string[]> = {
  default: [
    "Je passe en revue vos capteurs… ",
    "Tout semble dans la norme côté température et humidité. ",
    "Petite alerte : votre pH est légèrement bas. ",
    "Je peux corriger maintenant si vous le souhaitez. 🌱",
  ],
  water: [
    "Cycle d'arrosage lancé pour 12 secondes. ",
    "Humidité substrat ciblée : 72 %. ",
    "Je vous notifie quand le bac est saturé.",
  ],
  ph: [
    "Diagnostic : pH à 6.2, cible 6.5–6.8. ",
    "Je dose 2 ml de correcteur pH+. ",
    "Stabilisation prévue dans 4 minutes. ✅",
  ],
  harvest: [
    "Vos micro-pousses radis sont au pic aromatique. ",
    "Je planifie la récolte demain matin 7h. ",
    "Vous voulez la lier au menu du service ? 🍽️",
  ],
  light: [
    "LED ajustées à 14h/j (cycle floraison). ",
    "Spectre rouge +12 % pour favoriser la fructification.",
  ],
};

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [sensors, setSensors] = useState<Sensors>({
    temp: 23.4,
    humidity: 68,
    ph: 6.2,
    light: 14,
    co2: 480,
  });
  const [history, setHistory] = useState<History>({
    // Deterministic seed (no Math.random()) — avoids SSR/client hydration drift.
    temp:     Array.from({ length: HISTORY_LEN }, (_, i) => 23 + Math.sin(i / 3) * 1.2),
    humidity: Array.from({ length: HISTORY_LEN }, (_, i) => 68 + Math.cos(i / 4) * 4),
    ph:       Array.from({ length: HISTORY_LEN }, (_, i) => 6.2 + Math.sin(i / 5) * 0.2),
    light:    Array.from({ length: HISTORY_LEN }, (_, i) => 13 + (i % 12 < 6 ? 1 : 0)),
    co2:      Array.from({ length: HISTORY_LEN }, (_, i) => 480 + Math.sin(i / 4) * 40),
  });
  const [aiOpen, setAiOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "init",
      role: "ai",
      ts: 0,
      text: "Bonjour 👋  Je suis votre copilote Agri One. Je peux arroser, ajuster le pH, planifier vos récoltes…",
    },
  ]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const toast = useCallback<Store["toast"]>((t) => {
    const id = ++toastIdRef.current;
    setToasts((arr) => [...arr, { ...t, id }]);
    setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== id)), 3800);
  }, []);

  const [transition, setTransition] = useState<Transition | null>(null);
  const startTransition = useCallback<Store["startTransition"]>((t) => setTransition(t), []);
  const endTransition   = useCallback<Store["endTransition"]>(() => setTransition(null), []);

  // Ticker
  useEffect(() => {
    const id = setInterval(() => {
      setSensors((s) => {
        const next: Sensors = {
          temp: jitter(s.temp, 0.3, 21, 26),
          humidity: jitter(s.humidity, 1.6, 55, 82),
          ph: jitter(s.ph, 0.06, 5.7, 7.1),
          light: jitter(s.light, 0.2, 10, 18),
          co2: jitter(s.co2, 18, 380, 720),
        };
        setHistory((h) => ({
          temp:    [...h.temp.slice(1), next.temp],
          humidity:[...h.humidity.slice(1), next.humidity],
          ph:      [...h.ph.slice(1), next.ph],
          light:   [...h.light.slice(1), next.light],
          co2:     [...h.co2.slice(1), next.co2],
        }));
        return next;
      });
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const idRef = useRef(0);
  const newId = () => `m${++idRef.current}_${Date.now()}`;

  const streamAI = useCallback(async (chunks: string[]) => {
    setBusy(true);
    const id = newId();
    setMessages((m) => [...m, { id, role: "ai", text: "", ts: Date.now() }]);
    for (const c of chunks) {
      await new Promise((r) => setTimeout(r, 380 + Math.random() * 280));
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, text: x.text + c } : x)));
    }
    setBusy(false);
  }, []);

  const perform = useCallback<Store["perform"]>(
    (action) => {
      setAiOpen(true);
      setSensors((s) => {
        switch (action) {
          case "water":    return { ...s, humidity: clamp(s.humidity + 9, 0, 95) };
          case "ph-up":    return { ...s, ph: clamp(s.ph + 0.4, 5, 8) };
          case "ph-down":  return { ...s, ph: clamp(s.ph - 0.4, 5, 8) };
          case "light-on": return { ...s, light: clamp(s.light + 2, 0, 24) };
          case "harvest":  return s;
        }
      });
      const key =
        action === "water" ? "water" :
        action === "ph-up" || action === "ph-down" ? "ph" :
        action === "harvest" ? "harvest" :
        "light";
      streamAI(SCRIPTED[key]);
    },
    [streamAI]
  );

  const sendMessage = useCallback<Store["sendMessage"]>(
    (text) => {
      const id = newId();
      setMessages((m) => [...m, { id, role: "user", text, ts: Date.now() }]);
      const lower = text.toLowerCase();
      const chunks =
        lower.includes("arros") ? SCRIPTED.water :
        lower.includes("ph") ? SCRIPTED.ph :
        lower.includes("récolt") || lower.includes("recolt") ? SCRIPTED.harvest :
        lower.includes("lumi") || lower.includes("led") ? SCRIPTED.light :
        SCRIPTED.default;
      streamAI(chunks);
    },
    [streamAI]
  );

  const askCopilot = useCallback<Store["askCopilot"]>(
    (prompt) => {
      setAiOpen(true);
      sendMessage(prompt);
    },
    [sendMessage]
  );

  const value = useMemo<Store>(
    () => ({
      sensors,
      history,
      isLive: true,
      ai: { open: aiOpen, busy, messages },
      toasts,
      transition,
      perform,
      openAI: () => setAiOpen(true),
      closeAI: () => setAiOpen(false),
      toggleAI: () => setAiOpen((x) => !x),
      sendMessage,
      askCopilot,
      toast,
      startTransition,
      endTransition,
    }),
    [sensors, history, aiOpen, busy, messages, toasts, transition, perform, sendMessage, askCopilot, toast, startTransition, endTransition]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside AppStoreProvider");
  return ctx;
}
