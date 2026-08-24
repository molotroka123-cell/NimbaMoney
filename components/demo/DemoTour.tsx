"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

const TOUR_KEY = "nimba.tour";
const TOUR_EVENT = "nimba:start-tour";

interface TourStep {
  fr: string;
  en: string;
  href: string;
  ctaFr: string;
  ctaEn: string;
}

/**
 * The 8-step self-guided investor walkthrough: green product first (P2P),
 * then the blue product (Verified Marketplace), then the closing loop.
 */
const steps: TourStep[] = [
  {
    fr: "Bienvenue ! Nimba = un compte, deux produits. Commençons par le P2P.",
    en: "Welcome! Nimba = one account, two products. Let's start with the P2P.",
    href: "/p2p",
    ctaFr: "Ouvrir le P2P",
    ctaEn: "Open P2P Exchange",
  },
  {
    fr: "Voici les offres de traders vérifiés. Cliquez « Acheter » sur la ligne Kaba Trade.",
    en: "These are offers from verified traders. Click “Buy” on the Kaba Trade row.",
    href: "/p2p",
    ctaFr: "J'y suis",
    ctaEn: "I'm there",
  },
  {
    fr: "La salle d'ordre : instructions, compte à rebours, chat. Cliquez « J'ai payé — marquer comme envoyé » et regardez la timeline se compléter.",
    en: "The order room: instructions, countdown, chat. Click “I've paid — mark as sent” and watch the timeline complete.",
    href: "/p2p",
    ctaFr: "Continuer",
    ctaEn: "Continue",
  },
  {
    fr: "Vos ordres et portefeuilles.",
    en: "Your orders and wallets.",
    href: "/p2p/orders",
    ctaFr: "Voir les ordres",
    ctaEn: "View orders",
  },
  {
    fr: "Passons au produit bleu : le Marketplace vérifié.",
    en: "Now for the blue product: the Verified Marketplace.",
    href: "/marketplace",
    ctaFr: "Ouvrir le Marketplace",
    ctaEn: "Open Marketplace",
  },
  {
    fr: "Ici on compare des professionnels : note, vérification, liquidité. Ouvrez le profil de Tymur MrSwap.",
    en: "Here you compare professionals: rating, verification, liquidity. Open Tymur MrSwap's profile.",
    href: "/marketplace/providers/tymur-mrswap",
    ctaFr: "Voir le profil",
    ctaEn: "View profile",
  },
  {
    fr: "Sur le profil : vérification 8 points, services, lieux, avis. Cliquez « Demander de la liquidité ».",
    en: "On the profile: 8-point verification, services, locations, reviews. Click “Request liquidity”.",
    href: "/marketplace/providers/tymur-mrswap",
    ctaFr: "Continuer",
    ctaEn: "Continue",
  },
  {
    fr: "C'est la boucle complète : demande → acceptation → règlement direct → reçu. Merci !",
    en: "That's the full loop: request → acceptance → direct settlement → receipt. Thank you!",
    href: "/",
    ctaFr: "Terminer la visite",
    ctaEn: "Finish the tour",
  },
];

/** Start (or restart) the guided demo tour from step 1, from anywhere. */
export function startDemoTour() {
  window.localStorage.setItem(TOUR_KEY, "0");
  window.dispatchEvent(new Event(TOUR_EVENT));
}

/**
 * Floating "coach card" for the self-guided investor demo. Inactive by
 * default; activates via startDemoTour(), the "nimba:start-tour" event,
 * or a `?tour=1` URL. Progress persists in localStorage.
 */
export function DemoTour() {
  const { t } = useI18n();
  const [step, setStep] = useState<number | null>(null); // null = inactive

  useEffect(() => {
    // resume a tour in progress (e.g. after a full page reload)
    const saved = window.localStorage.getItem(TOUR_KEY);
    if (saved !== null && !Number.isNaN(parseInt(saved, 10))) {
      setStep(Math.min(Math.max(parseInt(saved, 10), 0), steps.length - 1));
    } else if (new URLSearchParams(window.location.search).get("tour") === "1") {
      window.localStorage.setItem(TOUR_KEY, "0");
      setStep(0);
    }

    const onStart = () => setStep(0);
    window.addEventListener(TOUR_EVENT, onStart);
    return () => window.removeEventListener(TOUR_EVENT, onStart);
  }, []);

  const end = useCallback(() => {
    setStep(null);
    window.localStorage.removeItem(TOUR_KEY);
  }, []);

  if (step === null) return null;

  const current = steps[step];
  const goTo = (n: number) => {
    if (n >= steps.length) {
      end();
      return;
    }
    const clamped = Math.max(n, 0);
    setStep(clamped);
    window.localStorage.setItem(TOUR_KEY, String(clamped));
  };

  return (
    <div
      className="fixed z-[70] rounded-xl bg-brand-950/95 p-4 text-white shadow-overlay backdrop-blur max-sm:inset-x-3 max-sm:bottom-20 sm:bottom-6 sm:right-6 sm:w-80"
      role="dialog"
      aria-label={t("Démo guidée", "Guided demo")}
    >
      <button
        onClick={end}
        aria-label={t("Fermer la démo guidée", "Close guided demo")}
        className="absolute right-2 top-2 rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="text-2xs font-bold uppercase tracking-wide text-brand-300">
        {t("Démo guidée", "Guided demo")} · {step + 1}/{steps.length}
      </p>
      <p className="mt-1.5 pr-4 text-xs leading-relaxed text-white/90">
        {t(current.fr, current.en)}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={() => goTo(step - 1)}
          disabled={step === 0}
          className="rounded-control px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("Précédent", "Back")}
        </button>
        <Link href={current.href} onClick={() => goTo(step + 1)}>
          <Button size="sm" variant={step >= 4 && step <= 6 ? "blue" : "primary"}>
            {t(current.ctaFr, current.ctaEn)}
          </Button>
        </Link>
      </div>
    </div>
  );
}
