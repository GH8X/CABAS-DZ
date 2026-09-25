/**
 * The main destinations of the storefront. Keeping them in one place means a
 * landing-page call to action and the route it points at can never drift apart.
 */
export const ctas = {
  shop: "/boutique",
  unique: "/unique",
  newArrivals: "/nouveautes",
  sold: "/vendus",
  cart: "/panier",
  checkout: "/commande",
  about: "/a-propos",
  contact: "/contact",
  admin: "/admin",
  auth: "/auth",
} as const;
