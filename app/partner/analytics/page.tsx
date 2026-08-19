"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { Card, StatsCard, SectionTitle, BarRow, Sparkline } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { partnerOverview as po, marketOverview } from "@/data/mock/market";
import { formatGnf } from "@/lib/format";

export default function PartnerAnalyticsPage() {
  const { lang, t } = useI18n();

  const funnel = [
    { label: t("Apparitions en recherche", "Search appearances"), value: po.searchAppearances30d, pct: 100 },
    { label: t("Vues du profil", "Profile views"), value: po.profileViews30d, pct: 14 },
    { label: t("Leads reçus", "Leads received"), value: po.leads30d, pct: 4 },
    { label: t("Leads acceptés", "Accepted leads"), value: po.acceptedLeads30d, pct: 3.2 },
    { label: t("Transactions conclues", "Completed deals"), value: po.completedDeals30d, pct: 2.6 },
  ];

  return (
    <div className="space-y-4">
      <SectionTitle
        title={t("Analytique des leads", "Lead analytics")}
        subtitle={t("30 derniers jours · données de démonstration", "Last 30 days · mock data")}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label={t("Vues du profil", "Profile views")} value={po.profileViews30d.toLocaleString("fr-FR")} />
        <StatsCard label={t("Apparitions en recherche", "Search appearances")} value={po.searchAppearances30d.toLocaleString("fr-FR")} />
        <StatsCard label={t("Taux de conversion", "Conversion rate")} value={`${po.leadConversion}%`} />
        <StatsCard label={t("Valeur moyenne d'un lead", "Average lead value")} value={formatGnf(po.avgLeadValueGnf)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-pad">
          <h3 className="text-sm font-bold">{t("Entonnoir de conversion", "Conversion funnel")}</h3>
          <div className="mt-3 space-y-3">
            {funnel.map((f) => (
              <BarRow
                key={f.label}
                label={f.label}
                pct={Math.max(3, f.pct)}
                value={f.value.toLocaleString("fr-FR")}
              />
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="card-pad">
            <h3 className="text-sm font-bold">{t("Activité (14 j)", "Activity (14 d)")}</h3>
            <Sparkline data={marketOverview.activityTrend} className="mt-3 h-16" />
          </Card>

          {/* Free vs Pro comparison */}
          <Card className="card-pad">
            <h3 className="text-sm font-bold">{t("Gratuit vs Pro", "Free vs Pro")}</h3>
            <div className="mt-3 overflow-hidden rounded-lg border border-line dark:border-night-line">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-surface-sunken dark:bg-night-raised">
                    <th className="th-cell">{t("Capacité", "Capability")}</th>
                    <th className="th-cell">{t("Gratuit", "Free")}</th>
                    <th className="th-cell">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line dark:divide-night-line">
                  {[
                    [t("Statistiques de base", "Basic stats"), "✓", "✓"],
                    [t("Entonnoir détaillé", "Detailed funnel"), "—", "✓"],
                    [t("Demande par quartier", "District demand"), "—", "✓"],
                    [t("Priorité de matching", "Priority matching"), "—", "✓"],
                    [t("Quartiers supplémentaires", "Extra districts"), "1", "5"],
                  ].map(([k, a, b]) => (
                    <tr key={k as string}>
                      <td className="td-cell !py-2">{k}</td>
                      <td className="td-cell !py-2 text-ink-muted dark:text-[#8FA79C]">{a}</td>
                      <td className="td-cell !py-2 font-bold text-brand-600 dark:text-brand-300">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href="/partner/subscription" className="mt-3 inline-block">
              <Button size="sm">
                <Lock className="h-3.5 w-3.5" aria-hidden />
                {t("Débloquer avec Pro", "Unlock with Pro")}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
