const DAY = 86_400_000;

export function formatDA(value: number): string {
  const rounded = Math.round(value);
  return `${rounded.toLocaleString("fr-DZ", {
    maximumFractionDigits: 0,
  })} DA`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("fr-FR");
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "à l'instant";
  if (diff < 3_600_000) return `il y a ${Math.floor(diff / 60_000)} min`;
  if (diff < DAY) return `il y a ${Math.floor(diff / 3_600_000)} h`;
  const days = Math.floor(diff / DAY);
  if (days === 1) return "hier";
  if (days < 30) return `il y a ${days} jours`;
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  return `il y a ${Math.floor(months / 12)} an(s)`;
}

export function isNewArrival(ts: number, days = 14): boolean {
  return Date.now() - ts < days * DAY;
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now()
    .toString(36)
    .slice(-4)}`;
}

export function orderReference(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `CDZ-${new Date().getFullYear()}-${n}`;
}

export function normalizePhone(input: string): string {
  return input.replace(/[^\d+]/g, "");
}

/** Builds a wa.me link from a possibly locally formatted Algerian number. */
export function whatsappLink(rawNumber: string, message: string): string {
  const digits = rawNumber.replace(/\D/g, "");
  const international = digits.startsWith("213")
    ? digits
    : digits.startsWith("0")
      ? `213${digits.slice(1)}`
      : `213${digits}`;
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`;
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count > 1 ? (plural ?? `${singular}s`) : singular;
}
