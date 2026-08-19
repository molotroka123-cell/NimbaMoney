"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, StatsCard, SectionTitle } from "@/components/ui/misc";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { applications, disputes, riskFlags, auditLog } from "@/data/mock/admin";
import { marketOverview as m } from "@/data/mock/market";
import { formatGnfCompact } from "@/lib/format";

export default function AdminDashboardPage() {
  const { lang, t } = useI18n();
  const openApps = applications.filter((a) => a.status === "new" || a.status === "in_review").length;
  const openDisputes = disputes.filter((d) => d.status !== "resolved" && d.status !== "rejected").length;

  return (
    <div className="space-y-4">
      <SectionTitle
        title={t("Tableau de bord", "Dashboard")}
        subtitle={t("État du marché · données de démonstration", "Marketplace state · mock data")}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label={t("Candidatures à traiter", "Applications to review")} value={String(openApps)} />
        <StatsCard label={t("Litiges ouverts", "Open disputes")} value={String(openDisputes)} />
        <StatsCard label={t("Signaux de risque", "Risk flags")} value={String(riskFlags.length)} />
        <StatsCard label={t("Taux de litige", "Dispute rate")} value={`${m.disputeRate}%`} sub={t("cible < 2%", "target < 2%")} />
        <StatsCard label={t("Demandes aujourd'hui", "Requests today")} value={String(m.requestsToday)} />
        <StatsCard label={t("Transactions conclues", "Completed deals")} value={String(m.completedToday)} />
        <StatsCard label={t("Partenaires actifs", "Active providers")} value={String(m.activeProviders)} />
        <StatsCard label={t("Liquidité réseau", "Network liquidity")} value={formatGnfCompact(m.availableLiquidityGnf, lang)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-pad">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">{t("File des candidatures", "Application queue")}</h3>
            <Link href="/admin/providers" className="inline-flex items-center gap-1 text-2xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300">
              {t("Traiter", "Review")} <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
          <ul className="mt-2 divide-y divide-line dark:divide-night-line">
            {applications.slice(0, 4).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">{a.businessName}</p>
                  <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                    {a.id} · {a.district} · {a.submittedAt}
                  </p>
                </div>
                {a.status === "new" && <Pill tone="blue">{t("Nouvelle", "New")}</Pill>}
                {a.status === "in_review" && <Pill tone="amber">{t("En revue", "In review")}</Pill>}
                {a.status === "needs_info" && <Pill tone="amber">{t("Infos requises", "Needs info")}</Pill>}
                {a.status === "rejected" && <Pill tone="red">{t("Rejetée", "Rejected")}</Pill>}
                {a.status === "approved" && <Pill tone="green">{t("Approuvée", "Approved")}</Pill>}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="card-pad">
          <h3 className="text-sm font-bold">{t("Journal d'audit (récent)", "Audit log (recent)")}</h3>
          <ul className="mt-2 space-y-2.5">
            {auditLog.map((e) => (
              <li key={e.id} className="text-xs">
                <p>
                  <span className="font-mono text-2xs font-bold text-brand-700 dark:text-brand-300">
                    {e.action}
                  </span>{" "}
                  — {e.target}
                </p>
                <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                  {e.actor} · {e.at}
                  {e.note && ` · ${e.note}`}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
