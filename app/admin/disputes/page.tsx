"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { disputes as initial } from "@/data/mock/admin";
import { getProviderById } from "@/data/mock/providers";
import type { Dispute, DisputeReason } from "@/types";

const reasonLabels: Record<DisputeReason, [string, string]> = {
  no_response: ["Partenaire sans réponse", "Provider did not respond"],
  payment_not_received: ["Paiement non reçu", "Payment not received"],
  wrong_amount: ["Montant incorrect", "Wrong amount"],
  different_terms: ["Conditions différentes", "Different terms"],
  other: ["Autre", "Other"],
};

export default function AdminDisputesPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const [rows, setRows] = useState<Dispute[]>(initial);

  const resolve = (id: string, status: "resolved" | "rejected") => {
    setRows((xs) => xs.map((d) => (d.id === id ? { ...d, status } : d)));
    toast(
      status === "resolved"
        ? t(`${id} résolu — les deux parties sont notifiées.`, `${id} resolved — both parties notified.`)
        : t(`${id} rejeté après examen.`, `${id} rejected after review.`),
      status === "resolved" ? "success" : "info"
    );
  };

  const pill = (s: Dispute["status"]) =>
    s === "open" ? (
      <Pill tone="red">{t("Ouvert", "Open")}</Pill>
    ) : s === "reviewing" ? (
      <Pill tone="amber">{t("En examen", "Reviewing")}</Pill>
    ) : s === "resolved" ? (
      <Pill tone="green">{t("Résolu", "Resolved")}</Pill>
    ) : (
      <Pill tone="neutral">{t("Rejeté", "Rejected")}</Pill>
    );

  return (
    <div className="space-y-4">
      <SectionTitle
        title={t("Litiges", "Disputes")}
        subtitle={t(
          "Objectif pilote : taux de litige < 2 %, résolution < 24 h ouvrées.",
          "Pilot target: dispute rate < 2%, resolution < 24 business hours."
        )}
      />
      <Card>
        <ul className="divide-y divide-line dark:divide-night-line">
          {rows.map((d) => {
            const p = getProviderById(d.providerId);
            return (
              <li key={d.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-bold">{d.id}</span>
                    {pill(d.status)}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                    {lang === "fr" ? reasonLabels[d.reason][0] : reasonLabels[d.reason][1]} ·{" "}
                    <span className="font-semibold">{d.requestId}</span>{" "}
                    · {p?.name} · {d.openedAt}
                  </p>
                </div>
                {(d.status === "open" || d.status === "reviewing") && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => resolve(d.id, "resolved")}>
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      {t("Résoudre", "Resolve")}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => resolve(d.id, "rejected")}>
                      <XCircle className="h-3.5 w-3.5" aria-hidden />
                      {t("Rejeter", "Reject")}
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
