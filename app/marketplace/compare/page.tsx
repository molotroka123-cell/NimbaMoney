"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Scale, Zap, Check } from "lucide-react";
import { Card, Avatar, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { VerificationBadge, TierBadge, FeaturedBadge, StatusBadge, Rating } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { providers } from "@/data/mock/providers";
import { formatGnfCompact, formatNumber } from "@/lib/format";
import type { Provider } from "@/types";

function CompareInner() {
  const { lang, t } = useI18n();
  const sp = useSearchParams();
  const ids = (sp.get("ids") ?? "").split(",").filter(Boolean);
  const ps = ids
    .map((id) => providers.find((p) => p.id === id))
    .filter((p): p is Provider => Boolean(p))
    .slice(0, 3);

  const minFee = (p: Provider) => Math.min(...p.services.map((s) => s.feePct));

  const metrics: { label: string; render: (p: Provider) => React.ReactNode; best?: (xs: Provider[]) => Provider }[] = [
    {
      label: t("Note", "Rating"),
      render: (p) => <Rating value={p.rating} count={p.reviewCount} compact />,
      best: (xs) => xs.reduce((a, b) => (b.rating > a.rating ? b : a)),
    },
    {
      label: t("Vérification", "Verification"),
      render: (p) => <VerificationBadge type={p.type} level={p.verification.level} compact />,
    },
    {
      label: t("Liquidité disponible", "Available liquidity"),
      render: (p) => (
        <span className="font-bold tabular-nums">{formatGnfCompact(p.liquidity.totalAvailableGnf, lang)}</span>
      ),
      best: (xs) => xs.reduce((a, b) => (b.liquidity.totalAvailableGnf > a.liquidity.totalAvailableGnf ? b : a)),
    },
    {
      label: t("Frais (à partir de)", "Fees (from)"),
      render: (p) => <span className="font-bold tabular-nums">{minFee(p).toFixed(1)}%</span>,
      best: (xs) => xs.reduce((a, b) => (minFee(b) < minFee(a) ? b : a)),
    },
    {
      label: t("Limites (GNF)", "Limits (GNF)"),
      render: (p) => (
        <span className="text-xs tabular-nums">
          {formatGnfCompact(p.limits.minGnf, lang).replace(" GNF", "")} –{" "}
          {formatGnfCompact(p.limits.maxGnf, lang).replace(" GNF", "")}
        </span>
      ),
    },
    {
      label: t("Temps de réponse", "Response time"),
      render: (p) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold">
          <Zap className="h-3 w-3 text-mkt-500" aria-hidden />
          {p.responseMinutes} min
        </span>
      ),
      best: (xs) => xs.reduce((a, b) => (b.responseMinutes < a.responseMinutes ? b : a)),
    },
    {
      label: t("Transactions réalisées", "Completed deals"),
      render: (p) => <span className="font-semibold tabular-nums">{formatNumber(p.completedDeals)}</span>,
      best: (xs) => xs.reduce((a, b) => (b.completedDeals > a.completedDeals ? b : a)),
    },
    {
      label: t("Taux de réussite", "Success rate"),
      render: (p) => <span className="font-semibold tabular-nums">{p.successRate}%</span>,
      best: (xs) => xs.reduce((a, b) => (b.successRate > a.successRate ? b : a)),
    },
    {
      label: t("Lieux", "Locations"),
      render: (p) => (
        <span className="text-xs">{p.locations.map((l) => l.district).join(", ")}</span>
      ),
    },
    {
      label: t("Statut", "Status"),
      render: (p) => <StatusBadge status={p.status} />,
    },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-mkt-600 hover:text-mkt-700 dark:text-mkt-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t("Retour au Marketplace", "Back to Marketplace")}
        </Link>
        <h1 className="mt-2 flex items-center gap-2 text-xl font-extrabold">
          <Scale className="h-5 w-5 text-mkt-500" aria-hidden />
          {t("Comparer les partenaires", "Compare providers")}
        </h1>
        <p className="mt-0.5 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Comparaison côte à côte — la meilleure valeur de chaque ligne est surlignée.",
            "Side-by-side comparison — the best value in each row is highlighted."
          )}
        </p>
      </div>

      {ps.length < 2 ? (
        <Card>
          <EmptyState
            title={t("Sélectionnez au moins 2 partenaires.", "Select at least 2 providers.")}
            hints={[
              t(
                "Cochez les cases « Comparer » dans la liste du Marketplace.",
                "Tick the “Compare” checkboxes in the Marketplace list."
              ),
            ]}
            action={
              <Link href="/marketplace">
                <Button variant="blue">{t("Ouvrir le Marketplace", "Open the Marketplace")}</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <Card>
          <div className="scroll-x">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line dark:border-night-line">
                  <th className="th-cell w-44" />
                  {ps.map((p) => (
                    <th key={p.id} className="th-cell !normal-case">
                      <div className="flex items-center gap-2.5 py-1">
                        <Avatar initials={p.logoInitials} hue={p.logoHue} />
                        <div className="min-w-0 text-left">
                          <Link
                            href={`/marketplace/providers/${p.slug}`}
                            className="block truncate text-[13px] font-bold tracking-normal text-ink hover:text-mkt-600 dark:text-white"
                          >
                            {p.name}
                          </Link>
                          <span className="mt-0.5 flex items-center gap-1">
                            <TierBadge tier={p.subscriptionTier} />
                            {p.isFeatured && <FeaturedBadge />}
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-night-line">
                {metrics.map((m) => {
                  const best = m.best?.(ps);
                  return (
                    <tr key={m.label}>
                      <td className="td-cell text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                        {m.label}
                      </td>
                      {ps.map((p) => (
                        <td
                          key={p.id}
                          className={
                            best && best.id === p.id
                              ? "td-cell bg-mkt-50/60 dark:bg-navy-800/40"
                              : "td-cell"
                          }
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {m.render(p)}
                            {best && best.id === p.id && (
                              <Check className="h-3.5 w-3.5 text-mkt-500" aria-label={t("meilleur", "best")} />
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
                <tr>
                  <td className="td-cell" />
                  {ps.map((p) => (
                    <td key={p.id} className="td-cell">
                      <div className="flex max-w-[180px] flex-col gap-1.5">
                        <Link href={`/marketplace/providers/${p.slug}`}>
                          <Button variant="blueSecondary" size="sm" full>
                            {t("Profil", "Profile")}
                          </Button>
                        </Link>
                        <Link href={`/marketplace/providers/${p.slug}#request`}>
                          <Button variant="blue" size="sm" full disabled={p.status === "offline"}>
                            {t("Demander", "Request")}
                          </Button>
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareInner />
    </Suspense>
  );
}
