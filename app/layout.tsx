import type { Metadata } from "next";
import { Inter, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./components/AppProviders";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"], display: "swap" });
const mono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "Agri One — De la graine à l'assiette",
  description:
    "Agriculture urbaine connectée. Cultivez frais, local et durable — chez vous, au bureau, à l'école ou en restaurant. IoT + IA pour piloter votre potager.",
  icons: { icon: "/agri-one-logo-mark.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
