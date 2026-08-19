"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RadioTower,
  MessageCircle,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Card, StatsCard, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { opsRequests as initialRows } from "@/data/mock/admin";
import { providers, getProviderById } from "@/data/mock/providers";
import { marketOverview as m } from "@/data/mock/market";
import { classNames, formatGnfCompact } from "@/lib/format";
import { railLabel } from "@/lib/rails";
import type { OpsRequestRow } from "@/types";

/**
 * Operations / dispatch dashboard — the pilot marketplace is operated
 * manually at first. Dense, functional, no decoration.
 */
export default function OpsPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const [rows, setRows] = useState<OpsRequestRow[]>(initialRows);
  const [assigning, setAssigning] = useState<OpsRequestRow | null>(null);

  const set = (id: string, patch: Partial<OpsRequestRow>) =>
    setRows((xs) => xs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const unmatched = rows.filter((r) => r.status === "unmatched").length;

  const statusPill = (s: OpsRequestRow["status"]) => {
    const map = {
      unmatched: ["red", t("Non assignée", "Unmatched")],
      assigned: ["blue", t("Assignée", "Assigned")],
      accepted: ["amber", t("Acceptée", "Accepted")],
      completed: ["green", t("Terminée", "Completed")],
      issue: ["red", t("Incident", "Issue")],
    } as const;
    const [tone, label] = map[s];
    return <Pill tone={tone}>{label}</Pill>;
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-night-bg">
      {/* minimal ops header */}
      <header className="sticky top-0 z-40 flex h-12 items-center gap-3 border-b border-line bg-brand-950 px-4 text-white">
        <RadioTower className="h-4 w-4 text-brand-300" aria-hidden />
        <h1 className="text-sm font-bold">NIMBA OPS</h1>
        <span className="text-2xs text-brand-200/60">
          {t("Dispatch · Conakry · pilote", "Dispatch · Conakry · pilot")}
        </span>
        <span className="ml-auto flex items-center gap-2 text-2xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" aria-hidden />
          {t("En direct", "Live")} · {unmatched} {t("à traiter", "to handle")}
        </span>
        <Link href="/" className="text-2xs font-semibold text-brand-300 hover:text-brand-200">
          <ArrowLeft className="mr-1 inline h-3 w-3" aria-hidden />
          {t("Marché", "Marketplace")}
        </Link>
      </header>

      <main className="mx-auto max-w-shell space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatsCard label={t("Demandes entrantes", "Incoming requests")} value={String(m.requestsToday)} />
          <StatsCard label={t("Non assignées", "Unmatched")} value={String(unmatched)} />
          <StatsCard
            label={t("Partenaires en ligne", "Providers online")}
            value={String(providers.filter((p) => p.status === "open").length)}
          />
          <StatsCard
            label={t("Liquidité partenaires", "Provider liquidity")}
            value={formatGnfCompact(m.availableLiquidityGnf, lang)}
          />
          <StatsCard label={t("Temps de réponse médian", "Median response")} value={`${m.medianFillMinutes} min`} />
        </div>

        <Card>
          <div className="scroll-x">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b border-line dark:border-night-line">
                <tr>
                  <th className="th-cell">ID</th>
                  <th className="th-cell">{t("Client", "Customer")}</th>
                  <th className="th-cell">{t("Montant", "Amount")}</th>
                  <th className="th-cell">{t("Méthode", "Method")}</th>
                  <th className="th-cell">{t("Quartier", "District")}</th>
                  <th className="th-cell">{t("Âge", "Age")}</th>
                  <th className="th-cell">{t("Partenaire", "Provider")}</th>
                  <th className="th-cell">{t("Statut", "Status")}</th>
                  <th className="th-cell">{t("Actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-night-line">
                {rows.map((r) => {
                  const p = r.assignedProviderId ? getProviderById(r.assignedProviderId) : undefined;
                  return (
                    <tr key={r.id} className={classNames("table-row-hover", r.status === "unmatched" && r.ageMinutes > 5 && "bg-red-50/50 dark:bg-red-950/20")}>
                      <td className="td-cell font-mono text-xs font-bold">{r.id}</td>
                      <td className="td-cell text-xs">{r.customer}</td>
                      <td className="td-cell text-xs font-semibold tabular-nums">
                        {formatGnfCompact(r.amountGnf, lang)}
                      </td>
                      <td className="td-cell text-xs">
                        {railLabel(r.from, lang)} → {railLabel(r.to, lang)}
                      </td>
                      <td className="td-cell text-xs">{r.district}</td>
                      <td className={classNames("td-cell text-xs tabular-nums", r.ageMinutes > 20 && "font-bold text-danger")}>
                        {r.ageMinutes} min
                      </td>
                      <td className="td-cell text-xs">
                        {p ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Avatar initials={p.logoInitials} hue={p.logoHue} size="sm" />
                            {p.name}
                          </span>
                        ) : (
                          <span className="text-ink-faint">—</span>
                        )}
                      </td>
                      <td className="td-cell">{statusPill(r.status)}</td>
                      <td className="td-cell">
                        <div className="flex gap-1">
                          {r.status === "unmatched" && (
                            <Button size="xs" onClick={() => setAssigning(r)}>
                              <UserPlus className="h-3 w-3" aria-hidden />
                              {t("Assigner", "Assign")}
                            </Button>
                          )}
                          {r.status === "assigned" && (
                            <Button size="xs" variant="secondary" onClick={() => { set(r.id, { status: "accepted" }); toast(t(`${r.id} : acceptée par le partenaire`, `${r.id}: accepted by provider`)); }}>
                              {t("Marquer acceptée", "Mark accepted")}
                            </Button>
                          )}
                          {r.status === "accepted" && (
                            <Button size="xs" variant="secondary" onClick={() => { set(r.id, { status: "completed" }); toast(t(`${r.id} : terminée ✓`, `${r.id}: completed ✓`)); }}>
                              <CheckCircle2 className="h-3 w-3" aria-hidden />
                              {t("Terminer", "Complete")}
                            </Button>
                          )}
                          {(r.status === "assigned" || r.status === "accepted") && (
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => toast(t("Ouverture de WhatsApp Business (prototype)", "Opening WhatsApp Business (prototype)"), "info")}
                              aria-label={t("Message au partenaire", "Message provider")}
                            >
                              <MessageCircle className="h-3 w-3" aria-hidden />
                            </Button>
                          )}
                          {r.status !== "completed" && r.status !== "issue" && (
                            <Button
                              size="xs"
                              variant="ghost"
                              className="!text-warn"
                              onClick={() => { set(r.id, { status: "issue" }); toast(t(`${r.id} : incident ouvert`, `${r.id}: issue opened`), "warn"); }}
                              aria-label={t("Ouvrir un incident", "Open issue")}
                            >
                              <AlertTriangle className="h-3 w-3" aria-hidden />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* providers online */}
        <Card className="card-pad">
          <h2 className="text-sm font-bold">{t("Partenaires en ligne", "Providers online")}</h2>
          <div className="scroll-x mt-3 flex gap-3 pb-1">
            {providers
              .filter((p) => p.status !== "offline")
              .map((p) => (
                <div key={p.id} className="w-52 shrink-0 rounded-xl border border-line p-3 dark:border-night-line">
                  <div className="flex items-center gap-2">
                    <Avatar initials={p.logoInitials} hue={p.logoHue} size="sm" />
                    <p className="truncate text-xs font-bold">{p.name}</p>
                  </div>
                  <dl className="mt-2 space-y-1 text-2xs">
                    <div className="flex justify-between">
                      <dt className="text-ink-muted dark:text-[#8FA79C]">{t("Liquidité", "Liquidity")}</dt>
                      <dd className="font-semibold tabular-nums">{formatGnfCompact(p.liquidity.totalAvailableGnf, lang)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-muted dark:text-[#8FA79C]">{t("Réponse", "Response")}</dt>
                      <dd className="font-semibold">{p.responseMinutes} min</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-muted dark:text-[#8FA79C]">{t("Quartier", "District")}</dt>
                      <dd className="font-semibold">{p.locations[0].district}</dd>
                    </div>
                  </dl>
                </div>
              ))}
          </div>
        </Card>
      </main>

      {/* assign modal */}
      <Modal
        open={!!assigning}
        onClose={() => setAssigning(null)}
        title={t(`Assigner ${assigning?.id ?? ""}`, `Assign ${assigning?.id ?? ""}`)}
      >
        <p className="text-xs text-ink-muted dark:text-[#8FA79C]">
          {assigning &&
            `${formatGnfCompact(assigning.amountGnf, lang)} · ${railLabel(assigning.from, lang)} → ${railLabel(assigning.to, lang)} · ${assigning.district}`}
        </p>
        <ul className="mt-3 space-y-2">
          {providers
            .filter(
              (p) =>
                p.status === "open" &&
                (!assigning || p.liquidity.totalAvailableGnf >= assigning.amountGnf)
            )
            .map((p) => (
              <li key={p.id}>
                <button
                  className="flex w-full items-center gap-3 rounded-xl border border-line p-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50/50 dark:border-night-line dark:hover:bg-brand-900/30"
                  onClick={() => {
                    if (assigning) {
                      set(assigning.id, { status: "assigned", assignedProviderId: p.id });
                      toast(t(`${assigning.id} assignée à ${p.name}`, `${assigning.id} assigned to ${p.name}`));
                    }
                    setAssigning(null);
                  }}
                >
                  <Avatar initials={p.logoInitials} hue={p.logoHue} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold">{p.name}</p>
                    <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                      {p.locations[0].district} · {formatGnfCompact(p.liquidity.totalAvailableGnf, lang)} ·{" "}
                      {p.responseMinutes} min
                    </p>
                  </div>
                </button>
              </li>
            ))}
        </ul>
      </Modal>
    </div>
  );
}
