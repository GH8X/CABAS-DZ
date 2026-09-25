# CABAS DZ

Boutique e-commerce algérienne de **pièces uniques d'occasion importées d'Europe**.

Concept central : **« Unique Produit — قطعة واحدة فقط »**. Chaque produit existe en **un seul
exemplaire**. Dès qu'une commande est confirmée, la pièce passe automatiquement en **VENDU**, est
retirée de la boutique et ne peut plus jamais être achetée.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** (palette bleu européen / jaune doré) + composants shadcn/ui
- **Framer Motion** (animations douces, fade-in au scroll, étoiles EU flottantes)
- **React Router 6**

## Démarrage

```bash
bun install     # ou npm install
bun run dev     # http://localhost:5173
bun tsc -b --noEmit   # vérification des types
```

## Architecture

```
src/
  lib/          types, constantes (catégories, pays, wilayas), données de démo,
                store applicatif (produits, commandes, panier, paramètres)
  components/   ui/ (primitives), brand/ (étoiles EU, drapeaux, logo),
                layout/ (header, footer, nav mobile, panier, recherche),
                product/ (carte produit, grille)
  pages/        accueil, boutique, nouveautés, unique, vendus, produit,
                panier, commande, à-propos, contact, auth
  pages/admin/  tableau de bord, produits, éditeur produit, commandes, paramètres
```

## Modèle de données

`products`, `categories`, `orders`, `customers`, `admin_users`, `site_settings`, `media_assets`.

Un produit contient au minimum : `id`, `title`, `description`, `price`, `category`, `brand`,
`country`, `condition`, `size`, `measurements`, `images`, `status`, `created_at`, `updated_at`
et une `quantity` figée à **1**.

Statuts produit : `AVAILABLE` · `RESERVED` · `SOLD`
Statuts commande : `NOUVELLE` · `CONFIRMEE` · `EXPEDIEE` · `LIVREE` · `ANNULEE`

### Disponibilité

La disponibilité est décidée par l'enregistrement stocké, jamais par l'état du composant : chaque
commande relit la base, vérifie que **toutes** les pièces sont `AVAILABLE`, puis écrit le passage en
`SOLD` dans la même opération. Deux clients ne peuvent donc pas acheter la même pièce unique.

## Espace administrateur

Route protégée `/admin` (redirection vers `/auth?returnTo=…`).

Accès de démonstration :

```
admin@cabasdz.com  /  cabas2026
```

L'admin peut gérer les produits (création, édition, suppression, statuts, upload multi-images avec
réorganisation / remplacement / suppression), suivre les commandes, et modifier **toutes** les
informations du site (WhatsApp, Instagram, Facebook, TikTok, livraison, textes, hero, footer).
