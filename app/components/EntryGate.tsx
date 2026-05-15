"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function EntryGate() {
  const router = useRouter();
  useEffect(() => {
    let persona: string | null = null;
    try { persona = localStorage.getItem("ao-persona"); } catch {}
    const target = persona ? `/app/${persona}` : "/profil";
    // Wait a hair past the splash so it's visible.
    const t = setTimeout(() => router.replace(target), 2000);
    return () => clearTimeout(t);
  }, [router]);

  // Solid-fill bg; the splash overlay sits on top.
  return (
    <main
      aria-hidden
      className="min-h-screen w-full"
      style={{ background: "radial-gradient(60% 60% at 50% 40%, #1E8C5A 0%, #0A1F13 70%, #0A1F13 100%)" }}
    />
  );
}
