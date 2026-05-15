export type PersonaId = "particulier" | "restaurant" | "ecole" | "bureau";

export const personas: {
  id: PersonaId;
  label: string;
  tagline: string;
  description: string;
  kit: string;
  saas: string;
  hero: string;
  accent: string;
  cta: string;
}[] = [
  {
    id: "particulier",
    label: "Particuliers",
    tagline: "Cultivez vos herbes & légumes à la maison.",
    description:
      "Vous voulez cuisiner ce que vous faites pousser, sans tuer un autre basilic. On automatise tout — vous récoltez.",
    kit: "Kit Starter — 299 €",
    saas: "App Basic — 49 €/mois",
    hero: "Famille, foodie, éco-curieux",
    accent: "#2DB866",
    cta: "Démarrer mon potager",
  },
  {
    id: "restaurant",
    label: "Restaurateurs",
    tagline: "Frais, signature, raconté à vos clients.",
    description:
      "Une carte ultra-locale, un storytelling fort, un ROI clair. Vos herbes & micro-pousses récoltées le matin même, à 0,5 m² au sol.",
    kit: "Kit Pro — 999 €",
    saas: "App Pro — 149 €/mois",
    hero: "Chefs, bistrots, gastronomie",
    accent: "#0F7A4A",
    cta: "Calculer mon ROI",
  },
  {
    id: "ecole",
    label: "Écoles & Collectivités",
    tagline: "Faites pousser la pédagogie.",
    description:
      "Un outil éducatif clé en main, autonome pendant les vacances, conforme HACCP. Subventions Plan Eau & mairies mobilisables.",
    kit: "Kit Enterprise — 2 500 €",
    saas: "App Enterprise — 299 €/mois",
    hero: "Écoles, collèges, mairies",
    accent: "#1E8C5A",
    cta: "Demander un dossier",
  },
  {
    id: "bureau",
    label: "Bureaux & Entreprises",
    tagline: "Du vivant qui infuse votre RSE.",
    description:
      "Bien-être employés, reporting ESG, différenciation des espaces. Installation, maintenance et reporting inclus.",
    kit: "Kit Pro ou Enterprise",
    saas: "App Pro / Enterprise",
    hero: "RH, RSE, office managers",
    accent: "#42C97A",
    cta: "Réserver une démo",
  },
];

export const getPersona = (id: PersonaId) => personas.find((p) => p.id === id)!;
