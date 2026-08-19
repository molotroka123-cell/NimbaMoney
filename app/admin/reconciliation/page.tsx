"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, SectionTitle, StatsCard } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { reconciliation as initial, invoices } from "@/data/mock/admin";
import { getProviderById } from "@/data/mock/providers";
import { formatGnf, formatGnfCompact } from "@/lib/format";
import type { ReconciliationRow } from "@/types";

/** Daily reconciliation + provider commission billing (Booking-style). */
export default function AdminReconciliationPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const [rows, setRows] = useState<ReconciliationRow[]>(initial);

  const totalCommission = rows.reduce((n, r) => n + r.commissionGnf, 0);
  const totalVolume = rows.reduce((n, r) => n + r.volumeGnf, 0);
  const needsReview = rows.filter((r) => r.status !== "reconciled").length;

  const pill = (s: ReconciliationRow["status"]) =>
    s === "reconciled" ? (
      <Pill tone="green">{t("Réconcilié", "Reconciled")}</Pill>
    ) : s === "needs_review" ? (
      <Pill tone="amber">{t("À vérifier", "Needs review")}</Pill>
    ) : (
      <Pill tone="red">{t("Contesté", "Disputed")}</Pill>
    );

  return (
    <div className="space-y-4">
      <SectionTitle
        title={t("Réconciliation quotidienne", "Daily reconciliation")}
        subtitle={t(
          "18 août 2026 · commissions facturées aux partenaires, jamais aux clients.",
          "18 Aug 2026 · commissions billed to providers, never to customers."
        )}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label={t("Transactions du jour", "Deals for the day")} value={String(rows.reduce((n, r) => n + r.deals, 0))} />
        <StatsCard label={t("Volume", "Volume")} value={formatGnfCompact(totalVolume, lang)} />
        <StatsCard label={t("Commissions dues", "Commission due")} value={formatGnf(totalCommission)} />
        <StatsCard label={t("Écarts à examiner", "Unresolved differences")} value={String(needsReview)} />
      </div>

      <Card>
        <div className="scroll-x">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-line dark:border-night-line">
              <tr>
                <th className="th-cell">{t("Partenaire", "Provider")}</th>
                <th className="th-cell">{t("Transactions", "Deals")}</th>
                <th className="th-cell">{t("Volume", "Volume")}</th>
                <th className="th-cell">{t("Commission", "Commission")}</th>
                <th className="th-cell">{t("Statut", "Status")}</th>
                <th className="th-cell" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-night-line">
              {rows.map((r) => {
                const p = getProviderById(r.providerId);
                return (
                  <tr key={r.id} className="table-row-hover">
                    <td className="td-cell text-xs font-bold">{p?.name}</td>
                    <td className="td-cell text-xs tabular-nums">{r.deals}</td>
                    <td className="td-cell text-xs font-semibold tabular-nums">
                      {formatGnfCompact(r.volumeGnf, lang)}
                    </td>
                    <td className="td-cell text-xs font-semibold tabular-nums">
                      {formatGnf(r.commissionGnf)}
                    </td>
                    <td className="td-cell">{pill(r.status)}</td>
                    <td className="td-cell text-right">
                      {r.status !== "reconciled" && (
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => {
                            setRows((xs) =>
                              xs.map((x) => (x.id === r.id ? { ...x, status: "reconciled" } : x))
                            );
                            toast(t(`${p?.name} : réconcilié ✓`, `${p?.name}: reconciled ✓`));
                          }}
                        >
                          <CheckCircle2 className="h-3 w-3" aria-hidden />
                          {t("Réconcilier", "Reconcile")}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="card-pad">
        <h3 className="text-sm font-bold">{t("Factures partenaires", "Provider invoices")}</h3>
        <ul className="mt-2 divide-y divide-line dark:divide-night-line">
          {invoices.map((inv) => {
            const p = getProviderById(inv.providerId);
            return (
              <li key={inv.id} className="flex flex-wrap items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">
                    {inv.id} · {p?.name}
                  </p>
                  <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                    {inv.period} · {t("commission", "commission")} {formatGnf(inv.commissionGnf)}
                    {inv.subscriptionGnf > 0 &&
                      ` · ${t("abonnement", "subscription")} ${formatGnf(inv.subscriptionGnf)}`}
                  </p>
                </div>
                <span className="text-xs font-extrabold tabular-nums">{formatGnf(inv.totalGnf)}</span>
                {inv.status === "paid" && <Pill tone="green">{t("Payée", "Paid")}</Pill>}
                {inv.status === "due" && <Pill tone="amber">{t("À payer", "Due")}</Pill>}
                {inv.status === "overdue" && <Pill tone="red">{t("En retard", "Overdue")}</Pill>}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
