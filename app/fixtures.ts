import type { PersonaId } from "./personas";
import type { photos } from "./photos";

export type BacStatus = "ok" | "ready" | "warning" | "danger";

export type Bac = {
  id: string;
  name: string;
  location: string;
  photo: keyof typeof photos;
  progress: number;        // 0–100
  daysToHarvest: number;   // days
  status: BacStatus;
  temp: number;            // °C
  humidity: number;        // %
  ph: number;
  yieldExpected: string;   // human-readable
  plantedOn: string;       // ISO short
};

export type Harvest = {
  id: string;
  date: string;            // ISO date
  bac: string;             // bac id
  name: string;            // crop
  photo: keyof typeof photos;
  weightKg: number;
  destination: string;     // where it went
  valueEUR: number;        // economic value avoided / earned
};

const BACS_BY_PERSONA: Record<PersonaId, Bac[]> = {
  particulier: [
    { id: "B1", name: "Basilic Grand Vert", location: "Cuisine · bac n°1", photo: "basil",           progress: 86, daysToHarvest: 4,  status: "ready",   temp: 23.4, humidity: 71, ph: 6.5, yieldExpected: "≈ 90 g", plantedOn: "2026-04-10" },
    { id: "B2", name: "Menthe poivrée",      location: "Cuisine · bac n°2", photo: "mint",            progress: 62, daysToHarvest: 12, status: "ok",      temp: 22.8, humidity: 68, ph: 6.3, yieldExpected: "≈ 120 g", plantedOn: "2026-04-22" },
    { id: "B3", name: "Tomates cerises",     location: "Balcon · bac n°3",  photo: "cherry-tomatoes", progress: 41, daysToHarvest: 28, status: "warning", temp: 24.6, humidity: 58, ph: 5.9, yieldExpected: "≈ 350 g", plantedOn: "2026-04-30" },
    { id: "B4", name: "Roquette",             location: "Cuisine · bac n°4", photo: "arugula",         progress: 92, daysToHarvest: 2,  status: "ready",   temp: 22.1, humidity: 74, ph: 6.6, yieldExpected: "≈ 70 g",  plantedOn: "2026-04-04" },
    { id: "B5", name: "Coriandre",            location: "Cuisine · bac n°5", photo: "coriander",       progress: 28, daysToHarvest: 21, status: "ok",      temp: 22.4, humidity: 69, ph: 6.4, yieldExpected: "≈ 60 g",  plantedOn: "2026-05-05" },
  ],
  restaurant: [
    { id: "R1", name: "Micro-pousses radis", location: "Garde-manger · n°1", photo: "radish-microgreens", progress: 94, daysToHarvest: 1,  status: "ready",   temp: 22.0, humidity: 75, ph: 6.5, yieldExpected: "≈ 200 g", plantedOn: "2026-05-01" },
    { id: "R2", name: "Basilic Genovese",     location: "Cuisine chaude",     photo: "basil",              progress: 78, daysToHarvest: 5,  status: "ok",      temp: 24.1, humidity: 70, ph: 6.6, yieldExpected: "≈ 150 g", plantedOn: "2026-04-18" },
    { id: "R3", name: "Coriandre",             location: "Garde-manger · n°3", photo: "coriander",          progress: 32, daysToHarvest: 18, status: "warning", temp: 21.4, humidity: 64, ph: 5.8, yieldExpected: "≈ 100 g", plantedOn: "2026-05-06" },
    { id: "R4", name: "Capucines comestibles", location: "Vitrine salle",     photo: "nasturtium",         progress: 88, daysToHarvest: 3,  status: "ready",   temp: 22.6, humidity: 68, ph: 6.5, yieldExpected: "≈ 80 fleurs", plantedOn: "2026-04-12" },
    { id: "R5", name: "Mini-tomates",          location: "Cave climatisée",    photo: "cherry-tomatoes",    progress: 55, daysToHarvest: 16, status: "ok",      temp: 23.8, humidity: 66, ph: 6.2, yieldExpected: "≈ 500 g", plantedOn: "2026-04-25" },
    { id: "R6", name: "Menthe pour cocktails", location: "Bar",                photo: "mint",               progress: 71, daysToHarvest: 8,  status: "ok",      temp: 23.2, humidity: 69, ph: 6.4, yieldExpected: "≈ 180 g", plantedOn: "2026-04-21" },
  ],
  ecole: [
    { id: "E1", name: "Radis (CP)",      location: "Couloir Est",       photo: "radish-microgreens", progress: 48, daysToHarvest: 14, status: "ok",     temp: 22.3, humidity: 67, ph: 6.4, yieldExpected: "≈ 250 g", plantedOn: "2026-05-02" },
    { id: "E2", name: "Fraises (CE1)",    location: "Jardin",            photo: "strawberries",       progress: 71, daysToHarvest: 9,  status: "ok",     temp: 23.4, humidity: 70, ph: 6.5, yieldExpected: "≈ 400 g", plantedOn: "2026-04-15" },
    { id: "E3", name: "Salades (CM2)",    location: "Réfectoire",        photo: "lettuce",            progress: 92, daysToHarvest: 2,  status: "ready",  temp: 22.6, humidity: 72, ph: 6.6, yieldExpected: "≈ 600 g", plantedOn: "2026-04-08" },
    { id: "E4", name: "Aromates cantine", location: "Cuisine centrale", photo: "herb-garden",        progress: 64, daysToHarvest: 10, status: "ok",     temp: 22.9, humidity: 69, ph: 6.5, yieldExpected: "≈ 300 g", plantedOn: "2026-04-20" },
    { id: "E5", name: "Basilic (CM1)",    location: "Salle 4B",         photo: "basil",              progress: 56, daysToHarvest: 12, status: "warning", temp: 24.2, humidity: 60, ph: 6.0, yieldExpected: "≈ 120 g", plantedOn: "2026-04-26" },
  ],
  bureau: [
    { id: "BU1", name: "Aromates café",   location: "Hall libre service",   photo: "herb-garden",        progress: 84, daysToHarvest: 3,  status: "ready",   temp: 22.8, humidity: 60, ph: 6.5, yieldExpected: "≈ 250 g", plantedOn: "2026-04-16" },
    { id: "BU2", name: "Mini-tomates",     location: "Cafétéria",            photo: "cherry-tomatoes",    progress: 58, daysToHarvest: 14, status: "ok",      temp: 23.6, humidity: 55, ph: 6.3, yieldExpected: "≈ 480 g", plantedOn: "2026-04-22" },
    { id: "BU3", name: "Salades mix",      location: "Open-space N+3",       photo: "lettuce",            progress: 73, daysToHarvest: 8,  status: "ok",      temp: 23.0, humidity: 58, ph: 6.5, yieldExpected: "≈ 350 g", plantedOn: "2026-04-19" },
    { id: "BU4", name: "Capucines déco",   location: "Salle réunion C",      photo: "nasturtium",         progress: 46, daysToHarvest: 18, status: "warning", temp: 24.8, humidity: 48, ph: 5.9, yieldExpected: "≈ 60 fleurs", plantedOn: "2026-04-30" },
    { id: "BU5", name: "Micro-pousses",    location: "Lille · hall",         photo: "radish-microgreens", progress: 91, daysToHarvest: 2,  status: "ready",   temp: 22.4, humidity: 62, ph: 6.6, yieldExpected: "≈ 180 g", plantedOn: "2026-05-03" },
  ],
};

const HARVESTS_BY_PERSONA: Record<PersonaId, Harvest[]> = {
  particulier: [
    { id: "H-P-1", date: "2026-05-12", bac: "B6", name: "Basilic",           photo: "basil",          weightKg: 0.08, destination: "Pesto maison",        valueEUR: 3.50 },
    { id: "H-P-2", date: "2026-05-08", bac: "B7", name: "Salade",            photo: "lettuce",        weightKg: 0.12, destination: "Salade du dimanche",  valueEUR: 2.20 },
    { id: "H-P-3", date: "2026-05-03", bac: "B2", name: "Menthe",            photo: "mint",           weightKg: 0.05, destination: "Mojitos",             valueEUR: 1.80 },
    { id: "H-P-4", date: "2026-04-28", bac: "B6", name: "Basilic",           photo: "basil",          weightKg: 0.10, destination: "Pesto + caprese",     valueEUR: 4.10 },
    { id: "H-P-5", date: "2026-04-21", bac: "B1", name: "Fraises balcon",    photo: "strawberries",   weightKg: 0.32, destination: "Tarte aux fraises",   valueEUR: 6.40 },
    { id: "H-P-6", date: "2026-04-14", bac: "B7", name: "Radis",             photo: "radish-microgreens", weightKg: 0.18, destination: "Apéros",          valueEUR: 1.90 },
  ],
  restaurant: [
    { id: "H-R-1", date: "2026-05-13", bac: "R1", name: "Micro-pousses radis", photo: "radish-microgreens", weightKg: 0.18, destination: "Service midi · 22 couverts", valueEUR: 88.0 },
    { id: "H-R-2", date: "2026-05-11", bac: "R4", name: "Capucines",          photo: "nasturtium",          weightKg: 0.04, destination: "Plat signature soir",          valueEUR: 32.0 },
    { id: "H-R-3", date: "2026-05-09", bac: "R2", name: "Basilic Genovese",   photo: "basil",               weightKg: 0.21, destination: "Pesto maison",                  valueEUR: 28.0 },
    { id: "H-R-4", date: "2026-05-05", bac: "R6", name: "Menthe cocktails",   photo: "mint",                weightKg: 0.12, destination: "Bar · 38 cocktails",            valueEUR: 56.0 },
    { id: "H-R-5", date: "2026-05-02", bac: "R5", name: "Mini-tomates",       photo: "cherry-tomatoes",     weightKg: 0.42, destination: "Salades du jour",               valueEUR: 22.0 },
    { id: "H-R-6", date: "2026-04-28", bac: "R3", name: "Coriandre",         photo: "coriander",           weightKg: 0.15, destination: "Service du soir",                valueEUR: 18.0 },
  ],
  ecole: [
    { id: "H-E-1", date: "2026-05-12", bac: "E3", name: "Salade",     photo: "lettuce",            weightKg: 0.55, destination: "Cantine · 110 élèves",   valueEUR: 16.0 },
    { id: "H-E-2", date: "2026-05-07", bac: "E2", name: "Fraises",    photo: "strawberries",       weightKg: 0.40, destination: "Dégustation classe CE1", valueEUR: 12.0 },
    { id: "H-E-3", date: "2026-05-02", bac: "E1", name: "Radis",      photo: "radish-microgreens", weightKg: 0.28, destination: "Atelier cuisine CM2",   valueEUR: 6.0 },
    { id: "H-E-4", date: "2026-04-25", bac: "E4", name: "Aromates",   photo: "herb-garden",        weightKg: 0.32, destination: "Cuisine centrale",      valueEUR: 9.0 },
    { id: "H-E-5", date: "2026-04-18", bac: "E5", name: "Basilic",    photo: "basil",              weightKg: 0.14, destination: "Pesto avec les CM1",    valueEUR: 5.0 },
  ],
  bureau: [
    { id: "H-B-1", date: "2026-05-13", bac: "BU1", name: "Aromates",     photo: "herb-garden",        weightKg: 0.22, destination: "Pause-café 4 sites",     valueEUR: 36.0 },
    { id: "H-B-2", date: "2026-05-09", bac: "BU3", name: "Salades mix",  photo: "lettuce",            weightKg: 0.34, destination: "Cafétéria Paris",        valueEUR: 18.0 },
    { id: "H-B-3", date: "2026-05-05", bac: "BU5", name: "Micro-pousses", photo: "radish-microgreens", weightKg: 0.18, destination: "Lille · atelier RSE",    valueEUR: 28.0 },
    { id: "H-B-4", date: "2026-04-29", bac: "BU2", name: "Mini-tomates", photo: "cherry-tomatoes",    weightKg: 0.46, destination: "Lyon · Part-Dieu",       valueEUR: 22.0 },
    { id: "H-B-5", date: "2026-04-22", bac: "BU4", name: "Capucines",    photo: "nasturtium",         weightKg: 0.06, destination: "Newsletter RSE",         valueEUR: 14.0 },
  ],
};

export const getBacs = (p: PersonaId) => BACS_BY_PERSONA[p];
export const getHarvests = (p: PersonaId) => HARVESTS_BY_PERSONA[p];
