"use client";

import React from "react";
import Link from "next/link";
import {
  Check,
  Info,
  Megaphone,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { Card, Sparkline, Tooltip } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { marketOverview as m, announcements } from "@/data/mock/market";
import { formatGnfCompact } from "@/lib/format";
import { supportWhatsApp } from "@/config/product";

export function MarketOverviewCard() {
  const { lang, t } = useI18n();
  const rows = [
    { label: t("Demandes aujourd'hui", "Requests today"), value: String(m.requestsToday) },
    { label: t("Transactions conclues", "Completed deals"), value: String(m.completedToday) },
    { label: t("Temps de traitement médian", "Median fill time"), value: `${m.medianFillMinutes} min` },
    { label: t("Partenaires actifs", "Active providers"), value: String(m.activeProviders) },
  ];
  return (
    <Card className="card-pad">
      <div className="flex items-center gap-1.5">
        <h3 className="text-sm font-bold">
          {t("Aperçu du marché", "Marketplace overview")}
        </h3>
        <Tooltip
          text={t(
            "Données de démonstration (prototype)",
            "Mock data (prototype)"
          )}
        >
          <Info className="h-3.5 w-3.5 text-ink-faint" aria-label={t("Données de démonstration", "Mock data")} />
        </Tooltip>
      </div>
      <div className="mt-3">
        <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
          {t("Liquidité disponible", "Available liquidity")}
        </p>
        <div className="flex items-end justify-between gap-3">
          <p className="text-xl font-extrabold tabular-nums">
            {formatGnfCompact(m.availableLiquidityGnf, lang)}
          </p>
          <div className="w-28">
            <Sparkline data={m.activityTrend} />
          </div>
        </div>
        <p className="text-2xs text-brand-600 dark:text-brand-300">
          {t("Activité 14 jours", "14-day activity")}
        </p>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-line pt-3 dark:border-night-line">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-2xs text-ink-muted dark:text-[#8FA79C]">{r.label}</dt>
            <dd className="text-sm font-bold tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export function WhyNimbaCard() {
  const { t } = useI18n();
  const items = [
    t("Partenaires vérifiés", "Verified providers"),
    t("Prix affiché avant confirmation", "Pricing visible upfront"),
    t("Règlement direct", "Direct settlement"),
    t("Liquidité locale, quartier par quartier", "Local liquidity, district by district"),
    t("Support en cas de problème", "Support if something goes wrong"),
  ];
  return (
    <Card className="card-pad">
      <h3 className="text-sm font-bold">
        {t("Pourquoi choisir Nimba", "Why users choose Nimba")}
      </h3>
      <ul className="mt-2.5 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-xs">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function NeedHelpCard() {
  const { t } = useI18n();
  const { toast } = useToast();
  return (
    <Card className="card-pad">
      <h3 className="text-sm font-bold">{t("Besoin d'aide ?", "Need help?")}</h3>
      <p className="mt-1 text-xs text-ink-muted dark:text-[#8FA79C]">
        {t("Notre équipe est disponible 7j/7.", "Our team is available 7 days a week.")}
      </p>
      <Button
        variant="secondary"
        full
        size="sm"
        className="mt-3 !text-brand-700 dark:!text-brand-300"
        onClick={() =>
          toast(
            t(
              `Ouverture de WhatsApp — ${supportWhatsApp} (pont opérationnel du pilote)`,
              `Opening WhatsApp — ${supportWhatsApp} (pilot operational bridge)`
            ),
            "info"
          )
        }
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        {t("Support WhatsApp", "WhatsApp Support")}
      </Button>
    </Card>
  );
}

export function AnnouncementsCard() {
  const { lang, t } = useI18n();
  return (
    <Card className="card-pad">
      <div className="flex items-center justify-between">
        <h3 className="inline-flex items-center gap-1.5 text-sm font-bold">
          <Megaphone className="h-4 w-4 text-brand-500" aria-hidden />
          {t("Annonces", "Announcements")}
        </h3>
        <Link
          href="/account/support"
          className="inline-flex items-center gap-0.5 text-2xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
        >
          {t("Tout voir", "View all")}
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
      <ul className="mt-2.5 space-y-2.5">
        {announcements.map((a) => (
          <li key={a.id} className="flex items-start gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" aria-hidden />
            <div>
              <p className="text-xs font-medium">{lang === "fr" ? a.fr : a.en}</p>
              <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                {lang === "fr" ? a.when : a.whenEn}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function RightPanel() {
  return (
    <div className="space-y-4">
      <MarketOverviewCard />
      <WhyNimbaCard />
      <NeedHelpCard />
      <AnnouncementsCard />
    </div>
  );
}
