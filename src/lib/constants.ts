import type {
  CategoryId,
  Condition,
  CountryCode,
  OrderStatus,
  ProductStatus,
} from "./types";

export interface CountryMeta {
  code: CountryCode;
  name: string;
  flag: string;
  /** Simplified stripe colours used by the CSS-free mini flag component. */
  stripes: string[];
}

export const COUNTRIES: Record<CountryCode, CountryMeta> = {
  FR: { code: "FR", name: "France", flag: "🇫🇷", stripes: ["#0055A4", "#FFFFFF", "#EF4135"] },
  DE: { code: "DE", name: "Allemagne", flag: "🇩🇪", stripes: ["#000000", "#DD0000", "#FFCE00"] },
  ES: { code: "ES", name: "Espagne", flag: "🇪🇸", stripes: ["#AA151B", "#F1BF00", "#AA151B"] },
  IT: { code: "IT", name: "Italie", flag: "🇮🇹", stripes: ["#008C45", "#F4F5F0", "#CD212A"] },
  BE: { code: "BE", name: "Belgique", flag: "🇧🇪", stripes: ["#000000", "#FAE042", "#ED2939"] },
  NL: { code: "NL", name: "Pays-Bas", flag: "🇳🇱", stripes: ["#AE1C28", "#FFFFFF", "#21468B"] },
  EU: { code: "EU", name: "Autres pays européens", flag: "🇪🇺", stripes: ["#003399", "#FFCC00"] },
};

export const COUNTRY_LIST: CountryMeta[] = Object.values(COUNTRIES);

/** Countries highlighted on the homepage discovery banner. */
export const FEATURED_COUNTRIES: CountryCode[] = ["FR", "DE", "ES"];

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  emoji: string;
  blurb: string;
  image: string;
}

const u = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "vetements",
    label: "Vêtements",
    emoji: "👕",
    blurb: "Pièces vintage d'Europe",
    image: u("1489987707025-afc232f7ea0f"),
  },
  {
    id: "sacs",
    label: "Sacs",
    emoji: "👜",
    blurb: "Cuir & pièces rares",
    image: u("1584917865442-de89df76afd3"),
  },
  {
    id: "chaussures",
    label: "Chaussures",
    emoji: "👟",
    blurb: "Baskets & cuir",
    image: u("1549298916-b41d501d3772"),
  },
  {
    id: "jouets",
    label: "Jouets",
    emoji: "🧸",
    blurb: "Jouets anciens",
    image: u("1513475382585-d06e58bcb0e0"),
  },
  {
    id: "antiquites",
    label: "Antiquités",
    emoji: "🏺",
    blurb: "Objets de brocante",
    image: u("1578749556568-bc2c40e68b61"),
  },
  {
    id: "accessoires",
    label: "Accessoires",
    emoji: "🎒",
    blurb: "Détails qui comptent",
    image: u("1553062407-98eeb64c6a62"),
  },
  {
    id: "decoration",
    label: "Décoration",
    emoji: "🏠",
    blurb: "Intérieur & objets",
    image: u("1490312278390-ab64016e0aa9"),
  },
  {
    id: "collectibles",
    label: "Collectibles",
    emoji: "🎁",
    blurb: "Pour collectionneurs",
    image: u("1522771739844-6a9f6d5f14af"),
  },
  {
    id: "trouvailles",
    label: "Trouvailles",
    emoji: "✨",
    blurb: "Les plus inattendues",
    image: u("1513519245088-0e12902e5a38"),
  },
];

export const CATEGORY_BY_ID: Record<CategoryId, CategoryMeta> = CATEGORIES.reduce(
  (acc, category) => {
    acc[category.id] = category;
    return acc;
  },
  {} as Record<CategoryId, CategoryMeta>,
);

export const categoryLabel = (id: CategoryId) => CATEGORY_BY_ID[id]?.label ?? id;

export const CONDITIONS: Condition[] = [
  "Comme neuf",
  "Très bon état",
  "Bon état",
  "Vintage patiné",
];

export const CONDITION_STYLES: Record<Condition, string> = {
  "Comme neuf": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Très bon état": "bg-brand-50 text-brand-700 border-brand-200",
  "Bon état": "bg-gold-50 text-gold-700 border-gold-200",
  "Vintage patiné": "bg-cream-200 text-ink-soft border-cream-300",
};

export const STATUS_LABELS: Record<ProductStatus, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Réservé",
  SOLD: "Vendu",
};

export const STATUS_STYLES: Record<ProductStatus, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RESERVED: "bg-gold-50 text-gold-700 border-gold-200",
  SOLD: "bg-rose-50 text-rose-700 border-rose-200",
};

export const ORDER_STATUSES: OrderStatus[] = [
  "NOUVELLE",
  "CONFIRMEE",
  "EXPEDIEE",
  "LIVREE",
  "ANNULEE",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NOUVELLE: "Nouvelle commande",
  CONFIRMEE: "Confirmée",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  NOUVELLE: "bg-brand-50 text-brand-700 border-brand-200",
  CONFIRMEE: "bg-sky-50 text-sky-700 border-sky-200",
  EXPEDIEE: "bg-indigo-50 text-indigo-700 border-indigo-200",
  LIVREE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ANNULEE: "bg-rose-50 text-rose-700 border-rose-200",
};

export const SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "Unique",
];

/** The 58 Algerian wilayas, used by the checkout and the order dashboard. */
export const WILAYAS = [
  "01 - Adrar",
  "02 - Chlef",
  "03 - Laghouat",
  "04 - Oum El Bouaghi",
  "05 - Batna",
  "06 - Béjaïa",
  "07 - Biskra",
  "08 - Béchar",
  "09 - Blida",
  "10 - Bouira",
  "11 - Tamanrasset",
  "12 - Tébessa",
  "13 - Tlemcen",
  "14 - Tiaret",
  "15 - Tizi Ouzou",
  "16 - Alger",
  "17 - Djelfa",
  "18 - Jijel",
  "19 - Sétif",
  "20 - Saïda",
  "21 - Skikda",
  "22 - Sidi Bel Abbès",
  "23 - Annaba",
  "24 - Guelma",
  "25 - Constantine",
  "26 - Médéa",
  "27 - Mostaganem",
  "28 - M'Sila",
  "29 - Mascara",
  "30 - Ouargla",
  "31 - Oran",
  "32 - El Bayadh",
  "33 - Illizi",
  "34 - Bordj Bou Arreridj",
  "35 - Boumerdès",
  "36 - El Tarf",
  "37 - Tindouf",
  "38 - Tissemsilt",
  "39 - El Oued",
  "40 - Khenchela",
  "41 - Souk Ahras",
  "42 - Tipaza",
  "43 - Mila",
  "44 - Aïn Defla",
  "45 - Naâma",
  "46 - Aïn Témouchent",
  "47 - Ghardaïa",
  "48 - Relizane",
  "49 - Timimoun",
  "50 - Bordj Badji Mokhtar",
  "51 - Ouled Djellal",
  "52 - Béni Abbès",
  "53 - In Salah",
  "54 - In Guezzam",
  "55 - Touggourt",
  "56 - Djanet",
  "57 - El M'Ghair",
  "58 - El Meniaa",
];

export const SORT_OPTIONS = [
  { value: "recent", label: "Plus récentes" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "az", label: "A → Z" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const PRICE_BOUNDS = { min: 0, max: 30000 };
