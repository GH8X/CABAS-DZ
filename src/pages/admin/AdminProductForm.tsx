import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  Save,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { StarGlyph } from "@/components/brand/Stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import {
  CATEGORIES,
  CONDITIONS,
  COUNTRY_LIST,
  SIZES,
} from "@/lib/constants";
import { ACCEPTED_IMAGE_ATTR, fileToOptimizedDataUrl, isAcceptedImage } from "@/lib/images";
import { useStore } from "@/lib/store";
import type { CategoryId, Condition, CountryCode, Product, ProductStatus } from "@/lib/types";

interface FormState {
  title: string;
  description: string;
  price: string;
  compareAtPrice: string;
  category: CategoryId;
  brand: string;
  country: CountryCode;
  city: string;
  condition: Condition;
  era: string;
  size: string;
  measurements: string;
  material: string;
  tags: string;
  status: ProductStatus;
  featured: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  price: "",
  compareAtPrice: "",
  category: "vetements",
  brand: "",
  country: "FR",
  city: "",
  condition: "Très bon état",
  era: "",
  size: "",
  measurements: "",
  material: "",
  tags: "",
  status: "AVAILABLE",
  featured: false,
};

function toForm(product: Product): FormState {
  return {
    title: product.title,
    description: product.description,
    price: String(product.price),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
    category: product.category,
    brand: product.brand,
    country: product.country,
    city: product.city ?? "",
    condition: product.condition,
    era: product.era ?? "",
    size: product.size ?? "",
    measurements: product.measurements ?? "",
    material: product.material ?? "",
    tags: product.tags.join(", "),
    status: product.status,
    featured: Boolean(product.featured),
  };
}

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productById, saveProduct, addMediaAsset } = useStore();

  const editing = useMemo(() => (id ? productById(id) : undefined), [id, productById]);
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(editing ? toForm(editing) : EMPTY_FORM);
  const [images, setImages] = useState<string[]>(editing?.images ?? []);
  const [urlInput, setUrlInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const replaceIndex = useRef<number | null>(null);

  useEffect(() => {
    if (editing) {
      setForm(toForm(editing));
      setImages(editing.images);
    }
  }, [editing]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const handleFiles = async (files: FileList | null, mode: "append" | "replace" = "append") => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const accepted = Array.from(files).filter(isAcceptedImage);
      if (accepted.length === 0) {
        toast({
          title: "Format non supporté",
          description: "Utilisez un fichier JPG, PNG ou WEBP.",
          tone: "error",
        });
        return;
      }

      const encoded = await Promise.all(accepted.map((file) => fileToOptimizedDataUrl(file)));

      if (mode === "replace" && replaceIndex.current !== null) {
        const target = replaceIndex.current;
        setImages((current) => current.map((image, index) => (index === target ? encoded[0] : image)));
        replaceIndex.current = null;
      } else {
        setImages((current) => [...current, ...encoded]);
      }

      encoded.forEach((url, index) =>
        addMediaAsset({ name: accepted[index]?.name ?? "image", url, size: accepted[index]?.size }),
      );

      toast({
        title: `${encoded.length} image${encoded.length > 1 ? "s" : ""} ajoutée${
          encoded.length > 1 ? "s" : ""
        }`,
        description: "Optimisées automatiquement pour le web.",
        tone: "success",
      });
    } finally {
      setUploading(false);
      if (uploadRef.current) uploadRef.current.value = "";
      if (replaceRef.current) replaceRef.current.value = "";
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const makeMain = (index: number) => {
    setImages((current) => {
      const next = [...current];
      const [picked] = next.splice(index, 1);
      return [picked, ...next];
    });
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, position) => position !== index));
  };

  const addByUrl = () => {
    const value = urlInput.trim();
    if (!value) return;
    if (!/^https?:\/\//i.test(value)) {
      toast({ title: "URL invalide", description: "L'adresse doit commencer par http.", tone: "error" });
      return;
    }
    setImages((current) => [...current, value]);
    addMediaAsset({ name: "image externe", url: value });
    setUrlInput("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (form.title.trim().length < 3) nextErrors.title = "Le titre est obligatoire.";
    if (!form.price || Number(form.price) <= 0) nextErrors.price = "Indiquez un prix valide.";
    if (form.description.trim().length < 10)
      nextErrors.description = "Ajoutez une description d'au moins 10 caractères.";
    if (images.length === 0) nextErrors.images = "Ajoutez au moins une image.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast({ title: "Formulaire incomplet", description: "Corrigez les champs en rouge.", tone: "error" });
      return;
    }

    const payload: Partial<Product> & { title: string } = {
      id: editing?.id,
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      category: form.category,
      brand: form.brand.trim(),
      country: form.country,
      city: form.city.trim() || undefined,
      condition: form.condition,
      era: form.era.trim() || undefined,
      size: form.size || undefined,
      measurements: form.measurements.trim() || undefined,
      material: form.material.trim() || undefined,
      images,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: form.status,
      featured: form.featured,
      quantity: 1,
    };

    const saved = saveProduct(payload);
    toast({
      title: isEdit ? "Produit mis à jour" : "Produit ajouté",
      description: saved.title,
      tone: "success",
    });
    navigate("/admin/produits");
  };

  if (isEdit && !editing) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[32px] border border-dashed border-border bg-white py-20 text-center">
        <StarGlyph className="h-6 w-6 text-gold-400" />
        <p className="font-display text-xl font-black text-brand-900">Produit introuvable</p>
        <Button asChild variant="outline">
          <Link to="/admin/produits">Retour aux produits</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm" aria-label="Retour">
            <Link to="/admin/produits">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-black text-brand-900">
              {isEdit ? "Modifier le produit" : "Ajouter un produit"}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Quantité fixée à 1 — chaque fiche correspond à une pièce physique unique.
            </p>
          </div>
        </div>
        <Button type="submit" disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Enregistrer" : "Créer le produit"}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-6">
          {/* main info */}
          <section className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft">
            <h2 className="font-display text-lg font-black text-brand-900">
              Informations principales
            </h2>

            <div className="mt-5 grid gap-5">
              <Field label="Titre du produit" required error={errors.title}>
                <Input
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  placeholder="Ex. Veste en cuir véritable — Camel patiné"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Prix (DA)" required error={errors.price}>
                  <Input
                    value={form.price}
                    onChange={(event) => update("price", event.target.value.replace(/[^\d]/g, ""))}
                    placeholder="2900"
                    inputMode="numeric"
                  />
                </Field>
                <Field label="Prix barré (optionnel)">
                  <Input
                    value={form.compareAtPrice}
                    onChange={(event) =>
                      update("compareAtPrice", event.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder="4200"
                    inputMode="numeric"
                  />
                </Field>
              </div>

              <Field label="Description" required error={errors.description}>
                <Textarea
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                  placeholder="Décrivez la pièce, son histoire, son état réel…"
                  className="min-h-[150px]"
                />
              </Field>

              <Field label="Tags (séparés par des virgules)">
                <Input
                  value={form.tags}
                  onChange={(event) => update("tags", event.target.value)}
                  placeholder="cuir, vintage, français"
                />
              </Field>
            </div>
          </section>

          {/* images */}
          <section className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-black text-brand-900">
                  Images du produit
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG ou WEBP · la première image est l’image principale.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => uploadRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="h-3.5 w-3.5" />
                )}
                Téléverser
              </Button>
            </div>

            <input
              ref={uploadRef}
              type="file"
              accept={ACCEPTED_IMAGE_ATTR}
              multiple
              className="hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleFiles(event.target.files)}
            />
            <input
              ref={replaceRef}
              type="file"
              accept={ACCEPTED_IMAGE_ATTR}
              className="hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleFiles(event.target.files, "replace")
              }
            />

            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                handleFiles(event.dataTransfer.files);
              }}
              className="mt-5 flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50/40 px-6 py-8 text-center"
            >
              <ImagePlus className="h-7 w-7 text-brand-400" />
              <p className="text-sm font-bold text-brand-800">
                Glissez vos images ici
              </p>
              <p className="text-xs text-muted-foreground">
                Elles sont automatiquement redimensionnées et compressées.
              </p>
            </div>

            {errors.images ? (
              <p className="mt-3 text-xs font-semibold text-rose-600">{errors.images}</p>
            ) : null}

            {images.length > 0 ? (
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((image, index) => (
                  <li
                    key={`${image.slice(0, 32)}-${index}`}
                    className="group relative overflow-hidden rounded-3xl border border-border/70 bg-cream-100"
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </div>

                    {index === 0 ? (
                      <Badge variant="gold" className="absolute left-2 top-2">
                        <StarGlyph className="h-2.5 w-2.5" />
                        Principale
                      </Badge>
                    ) : null}

                    <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1 rounded-2xl bg-white/95 p-1 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <div className="flex gap-0.5">
                        <IconAction
                          label="Déplacer à gauche"
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </IconAction>
                        <IconAction
                          label="Déplacer à droite"
                          onClick={() => move(index, 1)}
                          disabled={index === images.length - 1}
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </IconAction>
                      </div>
                      <div className="flex gap-0.5">
                        {index !== 0 ? (
                          <IconAction label="Définir comme principale" onClick={() => makeMain(index)}>
                            <Star className="h-3.5 w-3.5 text-gold-600" />
                          </IconAction>
                        ) : null}
                        <IconAction
                          label="Remplacer l'image"
                          onClick={() => {
                            replaceIndex.current = index;
                            replaceRef.current?.click();
                          }}
                        >
                          <UploadCloud className="h-3.5 w-3.5" />
                        </IconAction>
                        <IconAction label="Supprimer l'image" onClick={() => removeImage(index)}>
                          <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                        </IconAction>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-2xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                Aucune image pour le moment.
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Input
                value={urlInput}
                onChange={(event) => setUrlInput(event.target.value)}
                placeholder="…ou collez une URL d'image (https://…)"
              />
              <Button type="button" variant="outline" onClick={addByUrl}>
                Ajouter l’URL
              </Button>
            </div>
          </section>
        </div>

        {/* sidebar */}
        <div className="flex flex-col gap-6">
          <section className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft">
            <h2 className="font-display text-lg font-black text-brand-900">
              Statut & disponibilité
            </h2>
            <div className="mt-5 flex flex-col gap-5">
              <Field label="Statut">
                <Select
                  value={form.status}
                  onChange={(event) => update("status", event.target.value as ProductStatus)}
                  options={[
                    { value: "AVAILABLE", label: "Disponible" },
                    { value: "RESERVED", label: "Réservé" },
                    { value: "SOLD", label: "Vendu" },
                  ]}
                />
              </Field>

              <div className="rounded-3xl border border-brand-100 bg-brand-50/60 px-4 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                  Quantité
                </p>
                <p className="mt-1 font-display text-2xl font-black text-brand-900">1</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Fixée automatiquement : produit unique.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-3xl border border-border/70 bg-cream-100 px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => update("featured", event.target.checked)}
                  className="h-4 w-4 accent-brand-800"
                />
                <span className="text-sm font-semibold text-brand-900">
                  Mettre en avant sur l’accueil
                </span>
              </label>
            </div>
          </section>

          <section className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft">
            <h2 className="font-display text-lg font-black text-brand-900">
              Classement & origine
            </h2>
            <div className="mt-5 grid gap-5">
              <Field label="Catégorie">
                <Select
                  value={form.category}
                  onChange={(event) => update("category", event.target.value as CategoryId)}
                  options={CATEGORIES.map((item) => ({
                    value: item.id,
                    label: `${item.emoji} ${item.label}`,
                  }))}
                />
              </Field>

              <Field label="Pays d'origine">
                <Select
                  value={form.country}
                  onChange={(event) => update("country", event.target.value as CountryCode)}
                  options={COUNTRY_LIST.map((item) => ({
                    value: item.code,
                    label: `${item.flag} ${item.name}`,
                  }))}
                />
              </Field>

              <Field label="Ville d'origine (optionnel)">
                <Input
                  value={form.city}
                  onChange={(event) => update("city", event.target.value)}
                  placeholder="Ex. Lyon"
                />
              </Field>

              <Field label="Marque">
                <Input
                  value={form.brand}
                  onChange={(event) => update("brand", event.target.value)}
                  placeholder="Ex. Adidas"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                <Field label="État">
                  <Select
                    value={form.condition}
                    onChange={(event) => update("condition", event.target.value as Condition)}
                    options={CONDITIONS.map((item) => ({ value: item, label: item }))}
                  />
                </Field>
                <Field label="Taille">
                  <Select
                    value={form.size}
                    onChange={(event) => update("size", event.target.value)}
                    placeholder="Non applicable"
                    options={SIZES.map((item) => ({ value: item, label: item }))}
                  />
                </Field>
              </div>

              <Field label="Époque">
                <Input
                  value={form.era}
                  onChange={(event) => update("era", event.target.value)}
                  placeholder="Ex. Années 90"
                />
              </Field>

              <Field label="Matière">
                <Input
                  value={form.material}
                  onChange={(event) => update("material", event.target.value)}
                  placeholder="Ex. 100% coton"
                />
              </Field>

              <Field label="Mesures">
                <Textarea
                  value={form.measurements}
                  onChange={(event) => update("measurements", event.target.value)}
                  placeholder="Épaules 46 cm · Poitrine 56 cm · Longueur 68 cm"
                  className="min-h-[90px]"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-[32px] border border-border/70 bg-cream-100 p-6">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <MiniFlag code={form.country} className="h-3.5 w-5" />
              Aperçu
            </p>
            <p className="mt-3 line-clamp-2 font-display text-base font-bold text-brand-900">
              {form.title || "Titre du produit"}
            </p>
            <p className="mt-1 font-display text-xl font-black text-brand-800">
              {form.price ? `${Number(form.price).toLocaleString("fr-FR")} DA` : "0 DA"}
            </p>
            <Badge variant="gold" className="mt-3">
              <StarGlyph className="h-2.5 w-2.5" />
              Unique Produit · 1 exemplaire
            </Badge>
          </section>

          <div className="flex flex-col gap-2">
            <Button type="submit" size="lg" disabled={uploading}>
              <Save className="h-4 w-4" />
              {isEdit ? "Enregistrer les modifications" : "Créer le produit"}
            </Button>
            <Button asChild type="button" variant="ghost" size="sm">
              <Link to="/admin/produits">
                <X className="h-3.5 w-3.5" />
                Annuler
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  required,
  error,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <Label className="mb-2 block">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </Label>
      {children}
      {error ? <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p> : null}
    </div>
  );
}

function IconAction({
  children,
  label,
  onClick,
  disabled,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-7 w-7 place-items-center rounded-xl text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
