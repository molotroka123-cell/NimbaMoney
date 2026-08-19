"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, Avatar, EmptyState } from "@/components/ui/misc";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { orders, getTrader } from "@/data/mock/p2p";
import { classNames, formatGnf } from "@/lib/format";
import { railLabel } from "@/lib/rails";
import type { P2POrderStatus } from "@/types";

type Tab = "all" | "active" | "completed" | "cancelled";

export default function P2POrdersPage() {
  const { lang, t } = useI18n();
  const [tab, setTab] = useState<Tab>("all");

  const isActive = (s: P2POrderStatus) =>
    !["completed", "cancelled"].includes(s);

  const rows = orders.filter((o) =>
    tab === "all"
      ? true
      : tab === "active"
        ? isActive(o.status)
        : tab === "completed"
          ? o.status === "completed"
          : o.status === "cancelled"
  );

  const pill = (s: P2POrderStatus) =>
    s === "completed" ? (
      <Pill tone="green">{t("Terminé", "Completed")}</Pill>
    ) : s === "cancelled" ? (
      <Pill tone="neutral">{t("Annulé", "Cancelled")}</Pill>
    ) : s === "disputed" ? (
      <Pill tone="red">{t("En litige", "Disputed")}</Pill>
    ) : (
      <Pill tone="amber">{t("En cours", "In progress")}</Pill>
    );

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-extrabold">{t("Mes ordres P2P", "My P2P orders")}</h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Les ordres P2P sont séparés de vos demandes Marketplace.",
            "P2P orders are kept separate from your Marketplace requests."
          )}
        </p>
      </div>

      <div className="flex gap-2" role="tablist">
        {(
          [
            ["all", t("Tous", "All")],
            ["active", t("En cours", "Active")],
            ["completed", t("Terminés", "Completed")],
            ["cancelled", t("Annulés", "Cancelled")],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={classNames("chip", tab === id && "chip-active")}
          >
            {label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <Card>
          <EmptyState title={t("Aucun ordre dans cette catégorie.", "No orders in this category.")} />
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((o) => {
            const tr = getTrader(o.traderId)!;
            return (
              <Link key={o.id} href={`/p2p/order/${o.id}`} className="block">
                <Card className="card-pad transition-shadow hover:shadow-raised">
                  <div className="flex flex-wrap items-center gap-3">
                    <Avatar initials={tr.initials} hue={tr.hue} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] font-bold">{o.id}</span>
                        <Pill tone={o.side === "buy" ? "green" : "red"}>
                          {o.side === "buy" ? t("Achat", "Buy") : t("Vente", "Sell")}
                        </Pill>
                        {pill(o.status)}
                      </div>
                      <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                        {tr.name} · {railLabel(o.method, lang)} · {o.createdAt}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold tabular-nums text-brand-700 dark:text-brand-300">
                        {o.amountUsdt.toLocaleString("fr-FR")} USDT
                      </p>
                      <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">{formatGnf(o.amountGnf)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-ink-faint" aria-hidden />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
