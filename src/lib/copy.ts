import { BadgeCheck, SprayCan, Truck, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CANNOT_MISS_NOTE = "Il n'y en a qu'un — et il ne reviendra pas.";

export const SCARCITY_LINE =
  "Tu le vois → Tu l'aimes → Tu le prends → Il disparaît.";

export interface PromiseItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const PROMISES: PromiseItem[] = [
  {
    icon: BadgeCheck,
    title: "Pièces authentiques",
    text: "Chinées une par une dans les brocantes européennes.",
  },
  {
    icon: SprayCan,
    title: "Nettoyées & vérifiées",
    text: "Contrôle qualité et nettoyage avant la mise en ligne.",
  },
  {
    icon: Wallet,
    title: "Paiement à la livraison",
    text: "Vous payez seulement quand la pièce arrive chez vous.",
  },
  {
    icon: Truck,
    title: "Livraison 58 wilayas",
    text: "Expédition partout en Algérie en 24 à 96 heures.",
  },
];

export const AUTH_DEMO_CREDENTIALS = {
  email: "admin@cabasdz.com",
  password: "cabas2026",
};
