"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Megaphone, ArrowUpRight } from "lucide-react";
import { Card, StatsCard, BarRow, SectionTitle } from "@/components/ui/misc";
import { PromoteModal } from "@/components/dashboard/PromoteModal";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { partnerOverview as po } from "@/data/mock/market";
import { formatGnf, formatGnfCompact } from "@/lib/format";

export default function PartnerOverviewPage() {
  const { lang, t } = useI18n();
  const [promoteOpen, setPromoteOpen] = useState(false);

  const days = lang === "fr"
    ? ["L", "M", "M", "J", "V", "S", "D"]
    : ["M", "T", "W", "T", "F", "S", "S"];
  const max = Math.max(...po.weeklyRequests);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle
          title={t("Aperçu", "Overview")}
          subtitle={t("Aujourd'hui · données de démonstration", "Today · mock data")}
        />
        <Button size="sm" onClick={() => setPromoteOpen(true)}>
          <Megaphone className="h-3.5 w-3.5" aria-hidden />
          {t("Promouvoir ma fiche", "Promote listing")}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard label={t("Nouvelles demandes aujourd'hui", "New requests today")} value={String(po.newRequestsToday)} />
        <StatsCard label={t("Volume traité (jour)", "Matched volume (day)")} value={formatGnfCompact(po.matchedVolumeGnf, lang)} />
        <StatsCard label={t("Conversion des leads", "Lead conversion")} value={`${po.leadConversion}%`} />
        <StatsCard label={t("Temps de réponse moyen", "Avg response time")} value={`${po.avgResponseMinutes} min`} />
        <StatsCard label={t("Taux de complétion", "Completion rate")} value={`${po.completionRate}%`} />
        <StatsCard
          label={t("Commissions estimées dues", "Estimated fees due")}
          value={formatGnf(po.estimatedFeesDueGnf)}
          sub={t("Facturées mensuellement par Nimba", "Billed monthly by Nimba")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* weekly bars */}
        <Card className="card-pad">
          <h3 className="text-sm font-bold">
            {t("Demandes vs transactions conclues (7 j)", "Requests vs completed deals (7 d)")}
          </h3>
          <div className="mt-4 flex h-36 items-end gap-2" role="img" aria-label={t("Histogramme hebdomadaire", "Weekly bar chart")}>
            {po.weeklyRequests.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end justify-center gap-0.5" style={{ height: "120px" }}>
                  <div
                    className="w-1/3 rounded-t bg-brand-200 dark:bg-brand-800"
                    style={{ height: `${(v / max) * 100}%` }}
                    title={`${v}`}
                  />
                  <div
                    className="w-1/3 rounded-t bg-brand-500"
                    style={{ height: `${(po.weeklyCompleted[i] / max) * 100}%` }}
                    title={`${po.weeklyCompleted[i]}`}
                  />
                </div>
                <span className="text-2xs text-ink-muted dark:text-[#8FA79C]">{days[i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-4 text-2xs text-ink-muted dark:text-[#8FA79C]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-brand-200 dark:bg-brand-800" /> {t("Demandes", "Requests")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-brand-500" /> {t("Conclues", "Completed")}
            </span>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="card-pad">
            <h3 className="text-sm font-bold">{t("Sources des leads", "Lead sources")}</h3>
            <div className="mt-3 space-y-3">
              {po.leadSources.map((s) => (
                <BarRow key={s.labelFr} label={lang === "fr" ? s.labelFr : s.labelEn} pct={s.pct} />
              ))}
            </div>
          </Card>
          <Card className="card-pad">
            <h3 className="text-sm font-bold">{t("Demande par quartier", "District demand")}</h3>
            <div className="mt-3 space-y-3">
              {po.districtDemand.map((d) => (
                <BarRow key={d.district} label={d.district} pct={d.pct} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* upgrade box */}
      <Card className="card-pad flex flex-wrap items-center justify-between gap-3 !border-brand-300 dark:!border-brand-700">
        <div>
          <p className="text-sm font-bold">
            {t(
              `Vous avez reçu ${po.leads30d} leads sur les 30 derniers jours.`,
              `You received ${po.leads30d} leads in the last 30 days.`
            )}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Pro : priorité de matching, quartiers étendus, analytique avancée.",
              "Pro: priority matching, expanded districts, advanced analytics."
            )}
          </p>
        </div>
        <Link href="/partner/subscription">
          <Button size="sm">
            {t("Passer à Pro", "Upgrade to Pro")}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </Link>
      </Card>

      <PromoteModal open={promoteOpen} onClose={() => setPromoteOpen(false)} />
    </div>
  );
}
