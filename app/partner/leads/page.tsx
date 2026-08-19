"use client";

import React, { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { Card, StatsCard, SectionTitle, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { partnerOverview as po } from "@/data/mock/market";
import { formatGnf } from "@/lib/format";

/** MOCK leads — development only. */
const initialLeads = [
  { id: "LD-311", amountGnf: 4_000_000, service: "Orange Money → Espèces", district: "Ratoma", age: "3 min", status: "new" as const },
  { id: "LD-310", amountGnf: 15_000_000, service: "Virement → Espèces", district: "Kaloum", age: "11 min", status: "new" as const },
  { id: "LD-309", amountGnf: 7_500_000, service: "Virement → Espèces", district: "Kaloum", age: "26 min", status: "accepted" as const },
  { id: "LD-306", amountGnf: 2_200_000, service: "MTN MoMo → Espèces", district: "Matam", age: "1 h", status: "expired" as const },
];

export default function LeadsPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [leads, setLeads] = useState(initialLeads);

  const act = (id: string, status: "accepted" | "declined") => {
    setLeads((xs) => xs.map((l) => (l.id === id ? { ...l, status } : l)) as typeof initialLeads);
    toast(
      status === "accepted"
        ? t(`Lead ${id} accepté — le client est notifié.`, `Lead ${id} accepted — the customer is notified.`)
        : t(`Lead ${id} refusé.`, `Lead ${id} declined.`),
      status === "accepted" ? "success" : "info"
    );
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title={t("Leads", "Leads")}
        subtitle={t("30 derniers jours · données de démonstration", "Last 30 days · mock data")}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label={t("Leads reçus", "Leads received")} value={String(po.leads30d)} />
        <StatsCard label={t("Leads acceptés", "Accepted leads")} value={String(po.acceptedLeads30d)} />
        <StatsCard label={t("Transactions conclues", "Completed deals")} value={String(po.completedDeals30d)} />
        <StatsCard label={t("Valeur moyenne d'un lead", "Average lead value")} value={formatGnf(po.avgLeadValueGnf)} />
      </div>

      <Card>
        {leads.length === 0 ? (
          <EmptyState title={t("Aucun lead pour le moment.", "No leads yet.")} />
        ) : (
          <ul className="divide-y divide-line dark:divide-night-line">
            {leads.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-bold">{l.id}</span>
                    {l.status === "new" && <Pill tone="blue">{t("Nouveau", "New")}</Pill>}
                    {l.status === "accepted" && <Pill tone="green">{t("Accepté", "Accepted")}</Pill>}
                    {(l.status as string) === "declined" && <Pill tone="neutral">{t("Refusé", "Declined")}</Pill>}
                    {l.status === "expired" && <Pill tone="amber">{t("Expiré", "Expired")}</Pill>}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                    {formatGnf(l.amountGnf)} · {l.service} · {l.district} ·{" "}
                    <Clock className="inline h-3 w-3" aria-hidden /> {l.age}
                  </p>
                </div>
                {l.status === "new" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => act(l.id, "accepted")}>
                      <Check className="h-3.5 w-3.5" aria-hidden />
                      {t("Accepter", "Accept")}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => act(l.id, "declined")}>
                      <X className="h-3.5 w-3.5" aria-hidden />
                      {t("Refuser", "Decline")}
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
