"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { providers } from "@/data/mock/providers";
import { classNames, formatGnfCompact, formatPct } from "@/lib/format";
import { ServicePair } from "@/lib/rails";

export default function PartnerServicesPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const me = providers[0]; // Kaba Trade operates this demo dashboard
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(me.services.map((s) => [s.id, true]))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle
          title={t("Services", "Services")}
          subtitle={t(
            "Frais, limites et liquidité affichés aux clients avant confirmation.",
            "Fees, limits and liquidity shown to customers before they confirm."
          )}
        />
        <Button
          size="sm"
          onClick={() =>
            toast(
              t(
                "Nouveau service : validé par l'équipe Nimba avant publication (prototype).",
                "New service: reviewed by the Nimba team before publishing (prototype)."
              ),
              "info"
            )
          }
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          {t("Ajouter un service", "Add a service")}
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {me.services.map((s) => (
          <Card key={s.id} className="card-pad">
            <div className="flex items-center justify-between gap-2">
              <ServicePair from={s.from} to={s.to} lang={lang} />
              {enabled[s.id] ? (
                <Pill tone="green">{t("Actif", "Active")}</Pill>
              ) : (
                <Pill tone="neutral">{t("En pause", "Paused")}</Pill>
              )}
            </div>
            <dl className="mt-3 space-y-2 text-xs">
              {(
                [
                  [t("Frais", "Fee"), formatPct(s.feePct)],
                  [t("Limites", "Limits"), `${formatGnfCompact(s.minGnf, lang)} – ${formatGnfCompact(s.maxGnf, lang)}`],
                  [t("Liquidité allouée", "Allocated liquidity"), formatGnfCompact(s.availableGnf, lang)],
                  [t("Délai estimé", "Estimated time"), `${s.estimatedMinutes[0]}–${s.estimatedMinutes[1]} min`],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <dt className="text-ink-muted dark:text-[#8FA79C]">{k}</dt>
                  <dd className="font-semibold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 flex gap-2 border-t border-line pt-3 dark:border-night-line">
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  toast(t("Modification des frais/limites (prototype)", "Editing fee/limits (prototype)"), "info")
                }
              >
                {t("Modifier", "Edit")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={classNames(!enabled[s.id] && "!text-brand-600")}
                onClick={() => {
                  setEnabled((e) => ({ ...e, [s.id]: !e[s.id] }));
                  toast(
                    enabled[s.id]
                      ? t("Service mis en pause — retiré des résultats.", "Service paused — removed from results.")
                      : t("Service réactivé.", "Service reactivated."),
                    enabled[s.id] ? "warn" : "success"
                  );
                }}
              >
                {enabled[s.id] ? t("Mettre en pause", "Pause") : t("Réactiver", "Resume")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
