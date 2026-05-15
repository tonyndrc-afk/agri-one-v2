"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { personas, type PersonaId } from "../personas";

export function Breadcrumb({ persona, active }: { persona: PersonaId; active: string }) {
  const p = personas.find((x) => x.id === persona)!;
  // Map active section to its href (only the live ones — others are visual only)
  const sectionHref: Record<string, string | undefined> = {
    "Tableau de bord": `/app/${persona}`,
    "Mes bacs":         `/app/${persona}/bacs`,
    "Récoltes":         `/app/${persona}/recoltes`,
    "Kits & produits":  `/app/${persona}/kits`,
  };
  const href = sectionHref[active];

  return (
    <motion.nav
      aria-label="Fil d'Ariane"
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="hidden md:flex items-center gap-1.5 text-sm min-w-0"
    >
      <Link href="/profil" className="text-[#888B8D] hover:text-[#0F7A4A] transition-colors truncate">
        Espaces
      </Link>
      <Chevron />
      <Link
        href={`/app/${persona}`}
        className="text-[#3D4246] hover:text-[#0F7A4A] transition-colors font-medium truncate"
      >
        {p.label}
      </Link>
      {active !== "Tableau de bord" && (
        <>
          <Chevron />
          {href ? (
            <Link href={href} className="text-[#0F7A4A] font-semibold truncate" aria-current="page">
              {active}
            </Link>
          ) : (
            <span className="text-[#0F7A4A] font-semibold truncate" aria-current="page">{active}</span>
          )}
        </>
      )}
    </motion.nav>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A8AAAD] shrink-0">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
