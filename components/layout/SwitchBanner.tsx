"use client";

import React from "react";
import Link from "next/link";
import { Users, Store, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Pill } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { classNames } from "@/lib/format";

/**
 * Ecosystem switch shown at the top of both product pages.
 * The active product is highlighted in its own color; the other card
 * links across, keeping user/language/currency context.
 */
export function SwitchBanner({ current }: { current: "p2p" | "marketplace" }) {
  const { t } = useI18n();
  const p2pActive = current === "p2p";

  return (
    <>
      {/* Mobile: compact segmented product switch (~48px) */}
      <div
        className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-white p-1 sm:hidden dark:border-night-line dark:bg-night-card"
        role="tablist"
        aria-label={t("Choisir un produit", "Choose a product")}
      >
        <Link
          href="/p2p"
          role="tab"
          aria-selected={p2pActive}
          className={classNames(
            "flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg text-[13px] font-bold transition-colors",
            p2pActive
              ? "bg-brand-500 text-white shadow-sm"
              : "text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-900/40"
          )}
        >
          <Users className="h-4 w-4" aria-hidden />
          P2P Exchange
        </Link>
        <Link
          href="/marketplace"
          role="tab"
          aria-selected={!p2pActive}
          className={classNames(
            "flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg text-[13px] font-bold transition-colors",
            !p2pActive
              ? "bg-mkt-500 text-white shadow-sm"
              : "text-mkt-600 hover:bg-mkt-50 dark:text-mkt-300 dark:hover:bg-navy-800/60"
          )}
        >
          <Store className="h-4 w-4" aria-hidden />
          Marketplace
        </Link>
      </div>

      {/* Desktop: two product banner cards */}
      <div className="hidden gap-3 sm:grid lg:grid-cols-2">
      <div
        className={classNames(
          "card card-pad flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5",
          p2pActive
            ? "!border-brand-400 ring-1 ring-brand-300 dark:!border-brand-600 dark:ring-brand-800"
            : ""
        )}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white">
          <Users className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-extrabold">
            P2P Exchange
            {p2pActive ? (
              <Pill tone="green">{t("Actif", "Active")}</Pill>
            ) : (
              <Pill tone="green">{t("Direct", "Direct")}</Pill>
            )}
          </p>
          <p className="truncate text-xs text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Tradez directement avec des pairs vérifiés. Meilleurs taux. Support 24/7.",
              "Trade directly with verified peers. Best rates. 24/7 support."
            )}
          </p>
        </div>
        {!p2pActive && (
          <Link href="/p2p" className="shrink-0">
            <Button size="sm">
              {t("Ouvrir le P2P", "Open P2P")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </Link>
        )}
      </div>

      <div
        className={classNames(
          "card card-pad flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5",
          !p2pActive
            ? "!border-mkt-400 ring-1 ring-mkt-300 dark:!border-mkt-600 dark:ring-navy-700"
            : ""
        )}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mkt-500 text-white">
          <Store className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-extrabold">
            Marketplace
            {!p2pActive ? (
              <Pill tone="blue">{t("Actif", "Active")}</Pill>
            ) : (
              <Pill tone="blue">{t("Vérifiés", "Verified")}</Pill>
            )}
          </p>
          <p className="truncate text-xs text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Comparez des échangeurs et fournisseurs vérifiés. Rapides, fiables, professionnels.",
              "Compare verified exchangers and providers. Fast, reliable, professional."
            )}
          </p>
        </div>
        {p2pActive && (
          <Link href="/marketplace" className="shrink-0">
            <Button size="sm" variant="blue">
              {t("Ouvrir le Marketplace", "Open Marketplace")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </Link>
        )}
      </div>
    </div>
    </>
  );
}
