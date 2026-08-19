"use client";

import React, { useState } from "react";
import { Check, Megaphone } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Pill } from "@/components/ui/Badge";
import { PromoteModal } from "@/components/dashboard/PromoteModal";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { plans } from "@/data/mock/market";
import { formatGnf } from "@/lib/format";

export default function SubscriptionPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const [proOpen, setProOpen] = useState(false);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [tier, setTier] = useState<"free" | "pro">("pro");

  return (
    <div className="space-y-4">
      <SectionTitle
        title={t("Abonnement", "Subscription")}
        subtitle={t(
          "Les tarifs affichés sont illustratifs / configurables — pas un engagement commercial.",
          "Displayed prices are illustrative / configurable — not a commercial promise."
        )}
      />

      <p className="rounded-lg bg-amber-50 px-3 py-2 text-2xs font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
        {t(
          "Rappel : PRO ≠ VÉRIFIÉ. L'abonnement n'augmente jamais le niveau de vérification — un partenaire doit d'abord passer la vérification.",
          "Reminder: PRO ≠ VERIFIED. Subscription never raises the verification level — a provider must first pass verification."
        )}
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {/* FREE */}
        <Card className="card-pad">
          <div className="flex items-center justify-between">
            <p className="text-sm font-extrabold">{lang === "fr" ? plans.free.nameFr : plans.free.nameEn}</p>
            {tier === "free" && <Pill tone="green">{t("Plan actuel", "Current plan")}</Pill>}
          </div>
          <p className="mt-2 text-xl font-extrabold">0 GNF</p>
          <ul className="mt-3 space-y-1.5">
            {(lang === "fr" ? plans.free.featuresFr : plans.free.featuresEn).map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
          {tier === "pro" && (
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => {
                setTier("free");
                toast(t("Rétrogradé au plan Gratuit (prototype)", "Downgraded to Free (prototype)"), "info");
              }}
            >
              {t("Revenir au Gratuit", "Switch to Free")}
            </Button>
          )}
        </Card>

        {/* PRO */}
        <Card className="card-pad ring-1 ring-brand-300 dark:ring-brand-700">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-extrabold">
              Pro
              <span className="rounded bg-brand-900 px-1.5 py-0.5 text-2xs font-bold text-brand-100">PRO</span>
            </p>
            {tier === "pro" && <Pill tone="green">{t("Plan actuel", "Current plan")}</Pill>}
          </div>
          <p className="mt-2 text-xl font-extrabold tabular-nums">
            {formatGnf(plans.pro.priceGnf)}
            <span className="text-xs font-medium text-ink-muted dark:text-[#8FA79C]">/{t("mois", "mo")}</span>
          </p>
          <p className="text-2xs text-amber-700 dark:text-amber-300">
            {t("Illustratif / configurable", "Illustrative / configurable")}
          </p>
          <ul className="mt-3 space-y-1.5">
            {(lang === "fr" ? plans.pro.featuresFr : plans.pro.featuresEn).map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
          {tier === "free" && (
            <Button size="sm" className="mt-4" onClick={() => setProOpen(true)}>
              {t("Passer à Pro", "Upgrade to Pro")}
            </Button>
          )}
        </Card>
      </div>

      {/* featured placement */}
      <Card className="card-pad flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold">
            <Megaphone className="h-4 w-4 text-brand-500" aria-hidden />
            {t("Emplacement en vedette", "Featured placement")}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Par quartier et par service, durée au choix — toujours étiqueté « Sponsorisé ».",
              "Per district and service, chosen duration — always labeled “Sponsored”."
            )}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setPromoteOpen(true)}>
          {t("Configurer une campagne", "Set up a campaign")}
        </Button>
      </Card>

      {/* Pro modal */}
      <Modal open={proOpen} onClose={() => setProOpen(false)} title={t("Passer à Pro", "Upgrade to Pro")}>
        <p className="text-xs leading-relaxed text-ink-secondary dark:text-[#B7C9C0]">
          {t(
            "Le plan Pro est facturé mensuellement avec vos commissions. Vous pouvez revenir au plan Gratuit à tout moment — votre niveau de vérification ne change pas.",
            "Pro is billed monthly with your commissions. You can switch back to Free anytime — your verification level does not change."
          )}
        </p>
        <div className="mt-4 rounded-xl border border-line p-3 text-sm dark:border-night-line">
          <div className="flex justify-between">
            <span>{t("Pro mensuel (illustratif)", "Pro monthly (illustrative)")}</span>
            <span className="font-bold tabular-nums">{formatGnf(plans.pro.priceGnf)}</span>
          </div>
        </div>
        <Button
          full
          className="mt-4"
          onClick={() => {
            setTier("pro");
            setProOpen(false);
            toast(t("Bienvenue en Pro 🎉 (prototype)", "Welcome to Pro 🎉 (prototype)"));
          }}
        >
          {t("Confirmer le passage à Pro", "Confirm upgrade")}
        </Button>
      </Modal>

      <PromoteModal open={promoteOpen} onClose={() => setPromoteOpen(false)} />
    </div>
  );
}
