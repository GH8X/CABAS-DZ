import { KeyRound, LogIn, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { StarField, StarRow } from "@/components/brand/Stars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { AUTH_DEMO_CREDENTIALS } from "@/lib/copy";
import { ctas } from "@/lib/ctas";
import { useStore } from "@/lib/store";

/** Where a signed-in admin lands when no explicit destination was requested. */
const DEFAULT_REDIRECT = ctas.admin;

export default function Auth() {
  const { signIn, session } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const returnTo = params.get("returnTo") || params.get("redirectAfterAuth") || DEFAULT_REDIRECT;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) navigate(returnTo, { replace: true });
  }, [session, navigate, returnTo]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = signIn(email, password);
    if (!result.ok) {
      setError(result.error ?? "Connexion impossible.");
      return;
    }
    toast({ title: "Bienvenue !", description: "Accès au tableau de bord accordé.", tone: "success" });
    navigate(returnTo, { replace: true });
  };

  const fillDemo = () => {
    setEmail(AUTH_DEMO_CREDENTIALS.email);
    setPassword(AUTH_DEMO_CREDENTIALS.password);
    setError(null);
  };

  return (
    <div className="container py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[36px] border border-border/70 bg-white shadow-lift lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-brand-900 p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-eu-radial" aria-hidden="true" />
          <StarField />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-200">
              Espace privé
            </span>
            <h1 className="mt-6 font-display text-3xl font-black leading-tight">
              Administration CABAS DZ
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100/80">
              Gérez vos pièces uniques, suivez les commandes, changez les statuts et mettez à
              jour WhatsApp, Instagram et le contenu du site.
            </p>
          </div>

          <div className="relative mt-10 space-y-3">
            {[
              "Ajouter / modifier / supprimer une pièce",
              "Marquer une pièce comme vendue",
              "Suivre les commandes par wilaya",
              "Modifier le numéro WhatsApp du site",
            ].map((item) => (
              <p key={item} className="flex items-center gap-2.5 text-sm text-brand-100/85">
                <ShieldCheck className="h-4 w-4 shrink-0 text-gold-300" />
                {item}
              </p>
            ))}
          </div>

          <StarRow className="relative mt-10 justify-start" />
        </div>

        <div className="p-8 sm:p-10">
          <div className="lg:hidden">
            <StarRow className="justify-start" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-black text-brand-900 lg:mt-0">
            Connexion administrateur
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cette page n’est pas accessible aux visiteurs de la boutique.
          </p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
            <div>
              <Label className="mb-2 block">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                  placeholder="admin@cabasdz.com"
                  autoComplete="email"
                  className="pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Mot de passe</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pl-11"
                  required
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" variant="default" className="w-full">
              <LogIn className="h-4 w-4" />
              Accéder au tableau de bord
            </Button>
          </form>

          <div className="mt-6 rounded-3xl border border-dashed border-brand-200 bg-brand-50/60 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
              Accès démonstration
            </p>
            <p className="mt-1.5 text-xs text-ink-soft">
              {AUTH_DEMO_CREDENTIALS.email} · {AUTH_DEMO_CREDENTIALS.password}
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={fillDemo} type="button">
              Pré-remplir les identifiants
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="font-semibold text-brand-700 hover:underline">
              ← Retour à la boutique
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
