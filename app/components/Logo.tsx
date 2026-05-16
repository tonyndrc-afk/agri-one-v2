/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { assetPath } from "../lib/assetPath";

export function Logo({ variant = "full", size = 36 }: { variant?: "full" | "mark"; size?: number }) {
  const src = variant === "full" ? "/agri-one-logo-full-transparent.png" : "/agri-one-logo-mark.png";
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Agri One — accueil">
      <img src={assetPath(src)} alt="Agri One" style={{ height: `${size}px`, width: "auto" }} />
    </Link>
  );
}
