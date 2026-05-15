"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { I } from "./Icons";
import { LiveDot } from "./live";
import { useStore } from "./store";
import { photos } from "../photos";

type Status = "ok" | "warning" | "danger" | "ready";

export function PlantPhotoCard({
  name,
  variety,
  photoSlug,
  progress,
  daysToHarvest,
  status = "ok",
  askPrompt,
}: {
  name: string;
  variety: string;
  photoSlug: keyof typeof photos;
  progress: number;
  daysToHarvest: number;
  status?: Status;
  askPrompt?: string;
}) {
  const photo = photos[photoSlug];
  const { askCopilot } = useStore();
  const handle = () =>
    askCopilot(askPrompt || `Donne-moi le diagnostic du bac "${name}" (${variety})`);

  const chip = {
    ok: <span className="chip">En croissance</span>,
    warning: <span className="chip chip-warning">À surveiller</span>,
    danger: <span className="chip chip-danger">Alerte capteur</span>,
    ready: <span className="chip">Prêt à récolter</span>,
  }[status];

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="card !p-0 overflow-hidden group cursor-pointer focus-within:ring-2 focus-within:ring-[#2DB866]/40"
      onClick={handle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handle();
        }
      }}
    >
      <div className="relative h-40 w-full overflow-hidden bg-[#E8F5EE]">
        <Image
          src={photo.url}
          alt={photo.slug}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
        <div className="absolute top-3 left-3">{chip}</div>
        <div className="absolute top-3 right-3"><LiveDot label="Live" /></div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-[var(--font-grotesk)] font-bold text-lg leading-tight drop-shadow">{name}</h3>
          <div className="text-xs opacity-90">{variety}</div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#888B8D]">Croissance</span>
          <span className="font-mono font-bold text-[#0F7A4A]">{progress}%</span>
        </div>
        <div className="progress">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ display: "block", height: "100%", background: "linear-gradient(90deg,#1E8C5A,#42C97A)" }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-[#3D4246]">
            Récolte dans <strong className="font-mono text-[#0F7A4A]">{daysToHarvest}j</strong>
          </span>
          <span className="btn btn-ghost btn-sm pointer-events-none">
            Piloter <I.Arrow width={14} height={14} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
