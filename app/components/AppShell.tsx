import Image from "next/image";
import Link from "next/link";
import { I } from "./Icons";
import { personas, type PersonaId } from "../personas";
import { OpenCopilotBtn, ActionButton } from "./CopilotInline";
import { MobileNav, SidebarDrawerTrigger, PersistPersona, AvatarMenu, AlertsBell, DesktopSidebarNav } from "./MobileNav";
import { PersonaSwitcher } from "./PersonaSwitcher";
import { Breadcrumb } from "./Breadcrumb";
import type { ReactNode } from "react";

type NavItem = { label: string; href: string; icon: ReactNode };

export function AppShell({
  persona,
  active,
  children,
}: {
  persona: PersonaId;
  active: string;
  children: ReactNode;
}) {
  const p = personas.find((x) => x.id === persona)!;
  const nav = navFor(persona);
  const primary: NavItem[] = nav.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F4FAF7] grid lg:grid-cols-[260px_1fr]">
      <PersistPersona persona={persona} />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col bg-white border-r border-[#E2EEE7] sticky top-0 h-screen">
        <Link
          href="/profil"
          className="px-5 h-24 flex items-center gap-3 border-b border-[#E2EEE7] hover:bg-[#F4FAF7] transition-colors"
          aria-label="Agri One — changer d'espace"
        >
          <Image
            src="/agri-one-logo-mark.png"
            alt=""
            width={56}
            height={56}
            priority
            className="drop-shadow-[0_2px_8px_rgba(15,122,74,0.18)]"
          />
          <div className="leading-tight">
            <div className="font-[var(--font-grotesk)] text-xl font-bold text-[#0A1F13] tracking-tight">Agri One</div>
            <div className="text-[10px] italic text-[#888B8D]">De la graine à l'assiette.</div>
          </div>
        </Link>

        <div className="px-3 py-3 border-b border-[#E2EEE7]">
          <PersonaSwitcher current={persona} />
        </div>

        <nav className="px-3 py-4 flex-1 space-y-1 overflow-y-auto">
          <DesktopSidebarNav nav={nav} active={active} />
        </nav>

        <div className="p-4 border-t border-[#E2EEE7]">
          <div className="rounded-2xl bg-grad-cta p-4 text-white">
            <div className="text-xs uppercase tracking-wider opacity-80">Assistant IA</div>
            <div className="text-sm mt-1 leading-snug">Une question sur vos plants ? Demandez-moi.</div>
            <OpenCopilotBtn className="btn btn-sm mt-3 bg-white text-[#0F7A4A] hover:bg-white/90">
              Ouvrir le chat
            </OpenCopilotBtn>
          </div>
        </div>
      </aside>

      <div className="flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-white/90 border-b border-[#E2EEE7]">
          <div className="px-3 sm:px-6 h-16 lg:h-20 flex items-center justify-between gap-3">
            {/* Left cluster */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <SidebarDrawerTrigger persona={persona} active={active} nav={nav} />

              {/* Mobile: big logo, no background */}
              <Link href="/profil" className="lg:hidden flex items-center gap-2 min-w-0" aria-label="Agri One">
                <Image
                  src="/agri-one-logo-mark.png"
                  alt=""
                  width={48}
                  height={48}
                  priority
                  className="drop-shadow-[0_2px_6px_rgba(15,122,74,0.18)]"
                />
                <Image
                  src="/agri-one-logo-full-transparent.png"
                  alt="Agri One"
                  width={130}
                  height={32}
                  className="hidden sm:block"
                  style={{ height: 28, width: "auto" }}
                />
              </Link>

              {/* Desktop: persona switcher + breadcrumb */}
              <div className="hidden lg:flex items-center gap-3 min-w-0">
                <PersonaSwitcher current={persona} />
                <div className="h-6 w-px bg-[#E2EEE7]" />
                <Breadcrumb persona={persona} active={active} />
              </div>

              {/* Mobile: compact switcher */}
              <div className="lg:hidden">
                <PersonaSwitcher current={persona} />
              </div>
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <AlertsBell />
              <span className="hidden md:inline-flex">
                <ActionButton
                  className="btn btn-secondary btn-sm"
                  icon={<I.Plus width={16} height={16} />}
                  toast={{ tone: "success", title: "Nouveau bac initié", body: "Suivez l'assistant pour configurer vos capteurs." }}
                  prompt="Aide-moi à ajouter un nouveau bac de culture"
                >
                  Nouveau bac
                </ActionButton>
              </span>
              <AvatarMenu />
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav items={primary} active={active} />
    </div>
  );
}

function navFor(p: PersonaId): NavItem[] {
  const common: NavItem[] = [
    { label: "Tableau de bord", href: `/app/${p}`,          icon: <I.Home width={18} height={18} /> },
    { label: "Mes bacs",         href: `/app/${p}/bacs`,    icon: <I.Leaf width={18} height={18} /> },
    { label: "Récoltes",         href: `/app/${p}/recoltes`, icon: <I.Calendar width={18} height={18} /> },
    { label: "Kits & produits",  href: `/app/${p}/kits`,    icon: <I.Truck width={18} height={18} /> },
  ];
  const extras: Record<PersonaId, NavItem[]> = {
    particulier: [
      { label: "Recettes",    href: `/app/${p}`, icon: <I.Spark width={18} height={18} /> },
      { label: "Communauté",  href: `/app/${p}`, icon: <I.Users width={18} height={18} /> },
    ],
    restaurant: [
      { label: "Carte & menus", href: `/app/${p}`, icon: <I.Chef width={18} height={18} /> },
      { label: "ROI & marge",   href: `/app/${p}`, icon: <I.Chart width={18} height={18} /> },
      { label: "Co-branding",   href: `/app/${p}`, icon: <I.Spark width={18} height={18} /> },
    ],
    ecole: [
      { label: "Programme péda.", href: `/app/${p}`, icon: <I.School width={18} height={18} /> },
      { label: "Classes & élèves", href: `/app/${p}`, icon: <I.Users width={18} height={18} /> },
      { label: "Reporting mairie", href: `/app/${p}`, icon: <I.Chart width={18} height={18} /> },
    ],
    bureau: [
      { label: "Espaces & sites",   href: `/app/${p}`, icon: <I.Office width={18} height={18} /> },
      { label: "Reporting RSE",     href: `/app/${p}`, icon: <I.Chart width={18} height={18} /> },
      { label: "Animation collab.", href: `/app/${p}`, icon: <I.Users width={18} height={18} /> },
    ],
  };
  return [
    ...common,
    ...extras[p],
    { label: "Réglages",     href: `/app/${p}`, icon: <I.Settings width={18} height={18} /> },
  ];
}
