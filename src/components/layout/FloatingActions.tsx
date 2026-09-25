import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Instagram, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { whatsappLink } from "@/lib/format";

export function FloatingActions() {
  const { settings } = useStore();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waLink = whatsappLink(
    settings.whatsappNumber,
    "Bonjour CABAS DZ, je souhaite des informations sur vos pièces uniques.",
  );

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3 lg:bottom-8 lg:right-8">
      <AnimatePresence>
        {showTop ? (
          <motion.button
            key="top"
            type="button"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="grid h-11 w-11 place-items-center rounded-full border border-border/70 bg-white/90 text-brand-700 shadow-soft backdrop-blur transition-transform hover:-translate-y-0.5"
            aria-label="Remonter en haut"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      {settings.instagramUrl ? (
        <a
          href={settings.instagramUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="group grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-lift transition-transform hover:scale-105"
          aria-label="Suivre CABAS DZ sur Instagram"
        >
          <Instagram className="h-5 w-5" />
        </a>
      ) : null}

      {settings.whatsappNumber ? (
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 font-bold text-white shadow-lift transition-transform hover:scale-[1.03]"
          aria-label="Commander sur WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden text-sm sm:inline">Commander sur WhatsApp</span>
        </a>
      ) : null}
    </div>
  );
}
