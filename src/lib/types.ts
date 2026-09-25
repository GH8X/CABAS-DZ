export type ProductStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export type CountryCode = "FR" | "DE" | "ES" | "IT" | "BE" | "NL" | "EU";

export type CategoryId =
  | "vetements"
  | "sacs"
  | "chaussures"
  | "jouets"
  | "antiquites"
  | "accessoires"
  | "decoration"
  | "collectibles"
  | "trouvailles";

export type Condition =
  | "Comme neuf"
  | "Très bon état"
  | "Bon état"
  | "Vintage patiné";

export type OrderStatus =
  | "NOUVELLE"
  | "CONFIRMEE"
  | "EXPEDIEE"
  | "LIVREE"
  | "ANNULEE";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: CategoryId;
  brand: string;
  country: CountryCode;
  city?: string;
  condition: Condition;
  era?: string;
  size?: string;
  measurements?: string;
  material?: string;
  images: string[];
  tags: string[];
  /** Unique-product store: always exactly 1. */
  quantity: 1;
  status: ProductStatus;
  featured?: boolean;
  createdAt: number;
  updatedAt: number;
  soldAt?: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  country: CountryCode;
  condition: Condition;
}

export interface Order {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  note?: string;
  items: OrderItem[];
  total: number;
  paymentMethod: "Paiement à la livraison";
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address?: string;
  createdAt: number;
  ordersCount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  /** Demo-only credential store. In production this must live server-side & hashed. */
  password: string;
  role: "admin";
}

export interface SiteSettings {
  siteName: string;
  logoText: string;
  logoUrl?: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  uniqueTitle: string;
  uniqueSubtitle: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  email: string;
  phone: string;
  address: string;
  deliveryInfo: string;
  aboutText: string;
  storyText: string;
  footerText: string;
  announcement: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size?: number;
  createdAt: number;
}

export interface Database {
  version: number;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  adminUsers: AdminUser[];
  settings: SiteSettings;
  mediaAssets: MediaAsset[];
}

export interface CartLine {
  productId: string;
  addedAt: number;
}
