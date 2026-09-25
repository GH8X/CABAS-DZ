import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createSeedDatabase } from "./seed";
import type {
  AdminUser,
  CartLine,
  Customer,
  Database,
  MediaAsset,
  Order,
  OrderStatus,
  Product,
  ProductStatus,
  SiteSettings,
} from "./types";
import { normalizePhone, orderReference, uid } from "./format";

const DB_KEY = "cabas-dz:db:v2";
const CART_KEY = "cabas-dz:cart:v1";
const SESSION_KEY = "cabas-dz:session:v1";

/* ------------------------------------------------------------------ *
 * Persistence helpers
 *
 * The database lives in localStorage and every mutation goes through a
 * synchronous read → validate → write cycle, so the stored record (not
 * component state) is the single source of truth for availability.
 * ------------------------------------------------------------------ */

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadDb(): Database {
  if (typeof window === "undefined") return createSeedDatabase();
  const stored = safeParse<Database | null>(window.localStorage.getItem(DB_KEY), null);
  if (!stored || !Array.isArray(stored.products) || stored.products.length === 0) {
    const seeded = createSeedDatabase();
    persistDb(seeded);
    return seeded;
  }
  return { ...createSeedDatabase(), ...stored, products: stored.products };
}

function persistDb(db: Database) {
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* quota exceeded — state stays in memory for this session */
  }
}

function loadCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  const lines = safeParse<CartLine[]>(window.localStorage.getItem(CART_KEY), []);
  return Array.isArray(lines) ? lines : [];
}

function persistCart(lines: CartLine[]) {
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ *
 * Context shape
 * ------------------------------------------------------------------ */

export interface CheckoutInput {
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  note?: string;
  items: { productId: string }[];
}

export type CheckoutResult =
  | { ok: true; order: Order }
  | { ok: false; error: string };

export interface StoreValue {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  settings: SiteSettings;
  adminUsers: AdminUser[];
  mediaAssets: MediaAsset[];

  productById: (id: string) => Product | undefined;
  availableProducts: Product[];
  soldProducts: Product[];
  reservedProducts: Product[];
  newArrivals: Product[];

  cart: CartLine[];
  cartProducts: Product[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string) => { ok: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  session: AdminUser | null;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;

  saveProduct: (input: Partial<Product> & { title: string }) => Product;
  deleteProduct: (id: string) => void;
  setProductStatus: (id: string, status: ProductStatus) => void;
  restoreProduct: (id: string) => void;

  placeOrder: (input: CheckoutInput) => CheckoutResult;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;

  updateSettings: (patch: Partial<SiteSettings>) => void;
  addMediaAsset: (asset: Omit<MediaAsset, "id" | "createdAt">) => MediaAsset;
  removeMediaAsset: (id: string) => void;

  resetDemoData: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database>(() => loadDb());
  const [cart, setCart] = useState<CartLine[]>(() => loadCart());
  const [session, setSession] = useState<AdminUser | null>(() => {
    if (typeof window === "undefined") return null;
    return safeParse<AdminUser | null>(window.localStorage.getItem(SESSION_KEY), null);
  });

  useEffect(() => {
    persistDb(db);
  }, [db]);

  useEffect(() => {
    persistCart(cart);
  }, [cart]);

  useEffect(() => {
    try {
      if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, [session]);

  const commit = useCallback((next: Database) => {
    persistDb(next);
    setDb(next);
  }, []);

  const productById = useCallback(
    (id: string) => db.products.find((product) => product.id === id),
    [db.products],
  );

  const availableProducts = useMemo(
    () =>
      db.products
        .filter((product) => product.status === "AVAILABLE")
        .sort((a, b) => b.createdAt - a.createdAt),
    [db.products],
  );

  const soldProducts = useMemo(
    () =>
      db.products
        .filter((product) => product.status === "SOLD")
        .sort((a, b) => (b.soldAt ?? b.updatedAt) - (a.soldAt ?? a.updatedAt)),
    [db.products],
  );

  const reservedProducts = useMemo(
    () => db.products.filter((product) => product.status === "RESERVED"),
    [db.products],
  );

  const newArrivals = useMemo(
    () =>
      db.products
        .filter((product) => product.status !== "SOLD")
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 8),
    [db.products],
  );

  /* ---------------------------- cart ---------------------------- */

  const cartProducts = useMemo(
    () =>
      cart
        .map((line) => db.products.find((product) => product.id === line.productId))
        .filter((product): product is Product => Boolean(product)),
    [cart, db.products],
  );

  const cartTotal = useMemo(
    () => cartProducts.reduce((sum, product) => sum + product.price, 0),
    [cartProducts],
  );

  const addToCart = useCallback<StoreValue["addToCart"]>(
    (productId) => {
      const fresh = loadDb();
      const product = fresh.products.find((item) => item.id === productId);
      if (!product) return { ok: false, message: "Produit introuvable." };
      if (product.status === "SOLD")
        return {
          ok: false,
          message: "Cette pièce vient d'être vendue — elle est unique !",
        };
      if (product.status === "RESERVED")
        return { ok: false, message: "Cette pièce est déjà réservée." };

      setCart((current) => {
        if (current.some((line) => line.productId === productId)) return current;
        return [...current, { productId, addedAt: Date.now() }];
      });
      return { ok: true, message: "Ajoutée au panier." };
    },
    [],
  );

  const removeFromCart = useCallback<StoreValue["removeFromCart"]>((productId) => {
    setCart((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  /* --------------------------- admin auth --------------------------- */

  const signIn = useCallback<StoreValue["signIn"]>((email, password) => {
    const fresh = loadDb();
    const user = fresh.adminUsers.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!user || user.password !== password)
      return { ok: false, error: "Email ou mot de passe incorrect." };
    setSession(user);
    return { ok: true };
  }, []);

  const signOut = useCallback(() => setSession(null), []);

  /* --------------------------- products --------------------------- */

  const saveProduct = useCallback<StoreValue["saveProduct"]>((input) => {
    const fresh = loadDb();
    const now = Date.now();

    if (input.id) {
      const index = fresh.products.findIndex((product) => product.id === input.id);
      if (index >= 0) {
        const merged: Product = {
          ...fresh.products[index],
          ...input,
          id: fresh.products[index].id,
          quantity: 1,
          updatedAt: now,
        };
        merged.soldAt = merged.status === "SOLD" ? (merged.soldAt ?? now) : undefined;
        fresh.products[index] = merged;
        commit(fresh);
        return merged;
      }
    }

    const created: Product = {
      id: input.id ?? uid("p"),
      title: input.title,
      description: input.description ?? "",
      price: input.price ?? 0,
      compareAtPrice: input.compareAtPrice,
      category: input.category ?? "trouvailles",
      brand: input.brand ?? "",
      country: input.country ?? "FR",
      city: input.city,
      condition: input.condition ?? "Très bon état",
      era: input.era,
      size: input.size,
      measurements: input.measurements,
      material: input.material,
      images: input.images?.length ? input.images : [],
      tags: input.tags ?? [],
      quantity: 1,
      status: input.status ?? "AVAILABLE",
      featured: input.featured ?? false,
      createdAt: now,
      updatedAt: now,
      soldAt: input.status === "SOLD" ? now : undefined,
    };
    fresh.products = [created, ...fresh.products];
    commit(fresh);
    return created;
  }, [commit]);

  const deleteProduct = useCallback<StoreValue["deleteProduct"]>(
    (id) => {
      const fresh = loadDb();
      fresh.products = fresh.products.filter((product) => product.id !== id);
      commit(fresh);
      setCart((current) => current.filter((line) => line.productId !== id));
    },
    [commit],
  );

  const setProductStatus = useCallback<StoreValue["setProductStatus"]>(
    (id, status) => {
      const fresh = loadDb();
      fresh.products = fresh.products.map((product) =>
        product.id === id
          ? {
              ...product,
              status,
              updatedAt: Date.now(),
              soldAt: status === "SOLD" ? Date.now() : undefined,
            }
          : product,
      );
      commit(fresh);
      if (status !== "AVAILABLE")
        setCart((current) => current.filter((line) => line.productId !== id));
    },
    [commit],
  );

  const restoreProduct = useCallback<StoreValue["restoreProduct"]>(
    (id) => setProductStatus(id, "AVAILABLE"),
    [setProductStatus],
  );

  /* ---------------------------- orders ---------------------------- */

  const placeOrder = useCallback<StoreValue["placeOrder"]>(
    (input) => {
      // Read the freshest record so availability is decided by the database,
      // never by possibly stale component state.
      const fresh = loadDb();
      const wanted = input.items
        .map((item) => fresh.products.find((product) => product.id === item.productId))
        .filter((product): product is Product => Boolean(product));

      if (wanted.length === 0)
        return { ok: false, error: "Votre panier est vide." };

      const unavailable = wanted.filter((product) => product.status !== "AVAILABLE");
      if (unavailable.length > 0) {
        const blocked = unavailable[0];
        const reason =
          blocked.status === "SOLD"
            ? "vient d'être vendue"
            : "est déjà réservée par un autre client";
        return {
          ok: false,
          error: `« ${blocked.title} » ${reason}. Chaque pièce est unique — elle ne peut plus être commandée.`,
        };
      }

      const now = Date.now();
      const phone = normalizePhone(input.phone);
      let customer = fresh.customers.find((item) => normalizePhone(item.phone) === phone);
      if (!customer) {
        customer = {
          id: uid("cust"),
          fullName: input.fullName.trim(),
          phone,
          wilaya: input.wilaya,
          commune: input.commune,
          address: input.address,
          createdAt: now,
          ordersCount: 0,
        };
        fresh.customers = [customer, ...fresh.customers];
      } else {
        fresh.customers = fresh.customers.map((item) =>
          item.id === customer!.id
            ? { ...item, fullName: input.fullName.trim(), wilaya: input.wilaya, commune: input.commune, address: input.address }
            : item,
        );
      }

      const items = wanted.map((product) => ({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] ?? "",
        country: product.country,
        condition: product.condition,
      }));

      const order: Order = {
        id: uid("ord"),
        reference: orderReference(),
        customerId: customer.id,
        customerName: input.fullName.trim(),
        phone,
        wilaya: input.wilaya,
        commune: input.commune,
        address: input.address,
        note: input.note,
        items,
        total: items.reduce((sum, item) => sum + item.price, 0),
        paymentMethod: "Paiement à la livraison",
        status: "NOUVELLE",
        createdAt: now,
        updatedAt: now,
      };

      const soldIds = new Set(items.map((item) => item.productId));
      fresh.products = fresh.products.map((product) =>
        soldIds.has(product.id)
          ? { ...product, status: "SOLD" as const, soldAt: now, updatedAt: now }
          : product,
      );

      fresh.orders = [order, ...fresh.orders];
      fresh.customers = fresh.customers.map((item) =>
        item.id === customer!.id ? { ...item, ordersCount: item.ordersCount + 1 } : item,
      );

      commit(fresh);
      setCart((current) => current.filter((line) => !soldIds.has(line.productId)));
      return { ok: true, order };
    },
    [commit],
  );

  const updateOrderStatus = useCallback<StoreValue["updateOrderStatus"]>(
    (id, status) => {
      const fresh = loadDb();
      fresh.orders = fresh.orders.map((order) =>
        order.id === id ? { ...order, status, updatedAt: Date.now() } : order,
      );
      commit(fresh);
    },
    [commit],
  );

  const deleteOrder = useCallback<StoreValue["deleteOrder"]>(
    (id) => {
      const fresh = loadDb();
      fresh.orders = fresh.orders.filter((order) => order.id !== id);
      commit(fresh);
    },
    [commit],
  );

  /* --------------------------- settings --------------------------- */

  const updateSettings = useCallback<StoreValue["updateSettings"]>(
    (patch) => {
      const fresh = loadDb();
      fresh.settings = { ...fresh.settings, ...patch };
      commit(fresh);
    },
    [commit],
  );

  const addMediaAsset = useCallback<StoreValue["addMediaAsset"]>(
    (asset) => {
      const fresh = loadDb();
      const created: MediaAsset = { ...asset, id: uid("media"), createdAt: Date.now() };
      fresh.mediaAssets = [created, ...fresh.mediaAssets];
      commit(fresh);
      return created;
    },
    [commit],
  );

  const removeMediaAsset = useCallback<StoreValue["removeMediaAsset"]>(
    (id) => {
      const fresh = loadDb();
      fresh.mediaAssets = fresh.mediaAssets.filter((asset) => asset.id !== id);
      commit(fresh);
    },
    [commit],
  );

  const resetDemoData = useCallback(() => {
    const seeded = createSeedDatabase();
    setCart([]);
    commit(seeded);
  }, [commit]);

  const value = useMemo<StoreValue>(
    () => ({
      products: db.products,
      orders: db.orders,
      customers: db.customers,
      settings: db.settings,
      adminUsers: db.adminUsers,
      mediaAssets: db.mediaAssets,
      productById,
      availableProducts,
      soldProducts,
      reservedProducts,
      newArrivals,
      cart,
      cartProducts,
      cartCount: cartProducts.length,
      cartTotal,
      addToCart,
      removeFromCart,
      clearCart,
      session,
      signIn,
      signOut,
      saveProduct,
      deleteProduct,
      setProductStatus,
      restoreProduct,
      placeOrder,
      updateOrderStatus,
      deleteOrder,
      updateSettings,
      addMediaAsset,
      removeMediaAsset,
      resetDemoData,
    }),
    [
      db,
      productById,
      availableProducts,
      soldProducts,
      reservedProducts,
      newArrivals,
      cart,
      cartProducts,
      cartTotal,
      addToCart,
      removeFromCart,
      clearCart,
      session,
      signIn,
      signOut,
      saveProduct,
      deleteProduct,
      setProductStatus,
      restoreProduct,
      placeOrder,
      updateOrderStatus,
      deleteOrder,
      updateSettings,
      addMediaAsset,
      removeMediaAsset,
      resetDemoData,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside <StoreProvider>");
  return context;
}
