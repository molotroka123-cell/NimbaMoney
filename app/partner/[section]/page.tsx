"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Hammer } from "lucide-react";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

/**
 * Sections of the partner dashboard not yet built in the prototype.
 * Honest "coming soon" — no dead buttons anywhere.
 */
const titles: Record<string, [string, string]> = {
  requests: ["Demandes", "Requests"],
  liquidity: ["Liquidité", "Liquidity"],
  locations: ["Lieux", "Locations"],
  reviews: ["Avis", "Reviews"],
  messages: ["Messages", "Messages"],
  verification: ["Vérification", "Verification"],
  team: ["Équipe", "Team"],
  settings: ["Paramètres", "Settings"],
};

export default function PartnerSectionPage() {
  const { section } = useParams<{ section: string }>();
  const { lang, t } = useI18n();
  const title = titles[section]
    ? lang === "fr"
      ? titles[section][0]
      : titles[section][1]
    : section;

  return (
    <Card className="mx-auto mt-10 max-w-md p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/60">
        <Hammer className="h-6 w-6 text-brand-500" aria-hidden />
      </div>
      <h1 className="mt-3 text-base font-extrabold">{title}</h1>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
        {t(
          "Bientôt disponible. Pendant le pilote, cette section est gérée avec l'équipe Nimba via WhatsApp Business et le tableau de bord opérations.",
          "Coming soon. During the pilot, this section is handled with the Nimba team via WhatsApp Business and the operations dashboard."
        )}
      </p>
      <Link href="/partner" className="mt-5 inline-block">
        <Button variant="secondary" size="sm">
          {t("← Retour à l'aperçu", "← Back to overview")}
        </Button>
      </Link>
    </Card>
  );
}
