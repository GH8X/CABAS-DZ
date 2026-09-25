/**
 * Behavioural test for the store: a unique product must never be sold twice,
 * and admin mutations must keep the catalogue consistent.
 *
 * Run with: bun run scripts/logic-test.tsx
 */

// Minimal browser shim so the store's persistence layer runs for real.
const memory = new Map<string, string>();
const localStorageShim = {
  getItem: (key: string) => (memory.has(key) ? (memory.get(key) as string) : null),
  setItem: (key: string, value: string) => void memory.set(key, value),
  removeItem: (key: string) => void memory.delete(key),
  clear: () => memory.clear(),
};
(globalThis as unknown as { window: unknown }).window = { localStorage: localStorageShim };

const { renderToString } = await import("react-dom/server");
const { MemoryRouter } = await import("react-router-dom");
const { StoreProvider, useStore } = await import("@/lib/store");
const { ToastProvider } = await import("@/components/ui/toast");

interface Outcome {
  label: string;
  ok: boolean;
  detail: string;
}

const outcomes: Outcome[] = [];

function record(label: string, ok: boolean, detail: string) {
  outcomes.push({ label, ok, detail });
}

const TARGET = "p_veste_cuir_marron";

const CUSTOMER_A = {
  fullName: "Amina Belkacem",
  phone: "0661228841",
  wilaya: "16 - Alger",
  commune: "Hydra",
  address: "14 rue des Frères Bouadou",
  items: [{ productId: TARGET }],
};

let probeDone = false;

function Probe() {
  const store = useStore();
  if (probeDone) return null;
  probeDone = true;

  // --- 1. product starts available with quantity 1 -------------------
  const before = store.productById(TARGET);
  record(
    "produit démarre disponible, quantité = 1",
    before?.status === "AVAILABLE" && before?.quantity === 1,
    `status=${before?.status} quantity=${before?.quantity}`,
  );

  const readDb = () =>
    JSON.parse(memory.get("cabas-dz:db:v2") as string) as {
      products: Array<{ id: string; status: string; soldAt?: number }>;
      orders: Array<{ items: Array<{ productId: string }> }>;
    };
  const ordersBefore = readDb().orders.length;

  // --- 2. first order succeeds and sells the product -----------------
  const first = store.placeOrder(CUSTOMER_A);
  record("première commande acceptée", first.ok, first.ok ? first.order.reference : first.error);

  const soldCheck = (() => {
    const db = JSON.parse(memory.get("cabas-dz:db:v2") as string) as {
      products: Array<{ id: string; status: string; soldAt?: number }>;
      orders: Array<{ items: Array<{ productId: string }> }>;
    };
    const product = db.products.find((item) => item.id === TARGET);
    return { status: product?.status, soldAt: product?.soldAt, orders: db.orders.length };
  })();

  record(
    "produit passé en VENDU en base",
    soldCheck.status === "SOLD" && typeof soldCheck.soldAt === "number",
    `status=${soldCheck.status} soldAt=${soldCheck.soldAt ? "défini" : "absent"}`,
  );

  record(
    "une seule commande ajoutée",
    soldCheck.orders === ordersBefore + 1,
    `${soldCheck.orders} commande(s) (avant : ${ordersBefore})`,
  );

  // --- 3. a second customer cannot buy the same unique piece ---------
  const second = store.placeOrder({
    ...CUSTOMER_A,
    fullName: "Yacine Haddad",
    phone: "0770451907",
    wilaya: "31 - Oran",
    commune: "Bir El Djir",
  });
  record(
    "seconde commande refusée",
    !second.ok,
    second.ok ? "ERREUR : double vente possible !" : second.error,
  );

  const ordersAfter = readDb().orders.length;
  record(
    "aucune commande fantôme créée",
    ordersAfter === ordersBefore + 1,
    `${ordersAfter} commande(s) (avant : ${ordersBefore})`,
  );

  // --- 4. adding a sold product to the cart is refused ---------------
  const cartAttempt = store.addToCart(TARGET);
  record("ajout au panier d'un produit vendu refusé", !cartAttempt.ok, cartAttempt.message);

  // --- 5. a reserved product cannot be ordered -----------------------
  const reserved = store.placeOrder({
    ...CUSTOMER_A,
    items: [{ productId: "p_sac_cuir_grane" }],
  });
  record("commande d'un produit réservé refusée", !reserved.ok, reserved.ok ? "ERREUR" : reserved.error);

  // --- 6. admin can restore availability -----------------------------
  store.restoreProduct(TARGET);
  const restored = JSON.parse(memory.get("cabas-dz:db:v2") as string) as {
    products: Array<{ id: string; status: string; soldAt?: number }>;
  };
  const restoredProduct = restored.products.find((item) => item.id === TARGET);
  record(
    "admin peut remettre en vente",
    restoredProduct?.status === "AVAILABLE" && restoredProduct?.soldAt === undefined,
    `status=${restoredProduct?.status}`,
  );

  // --- 7. saving a product always forces quantity 1 -------------------
  const created = store.saveProduct({
    title: "Trouvaille de test — vase ancien",
    price: 3200,
    description: "Pièce créée par le test de comportement.",
    images: ["https://example.com/a.jpg"],
    quantity: 5 as unknown as 1,
  });
  record("quantité forcée à 1 à la création", created.quantity === 1, `quantity=${created.quantity}`);

  // --- 8. deleting removes it from the catalogue ----------------------
  store.deleteProduct(created.id);
  record(
    "suppression d'un produit",
    store.productById(created.id) === undefined ||
      !(JSON.parse(memory.get("cabas-dz:db:v2") as string) as { products: Array<{ id: string }> })
        .products.some((item) => item.id === created.id),
    `id=${created.id}`,
  );

  // --- 9. settings are editable (WhatsApp number, socials) ------------
  store.updateSettings({ whatsappNumber: "+213 700 00 00 00" });
  const settings = (
    JSON.parse(memory.get("cabas-dz:db:v2") as string) as { settings: { whatsappNumber: string } }
  ).settings;
  record(
    "numéro WhatsApp modifiable",
    settings.whatsappNumber === "+213 700 00 00 00",
    settings.whatsappNumber,
  );

  return null;
}

const warnings = console.error;
console.error = () => undefined;
renderToString(
  <MemoryRouter>
    <StoreProvider>
      <ToastProvider>
        <Probe />
      </ToastProvider>
    </StoreProvider>
  </MemoryRouter>,
);
console.error = warnings;

let failures = 0;
for (const outcome of outcomes) {
  if (!outcome.ok) failures += 1;
  console.log(`${outcome.ok ? "PASS" : "FAIL"}  ${outcome.label.padEnd(44)} ${outcome.detail}`);
}
console.log(failures === 0 ? "\nALL BEHAVIOUR TESTS PASSED" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
