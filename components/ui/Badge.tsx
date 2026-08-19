"use client";

import React from "react";
import {
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Clock,
  CircleDot,
} from "lucide-react";
import { classNames } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import type { ProviderStatus, ProviderType, VerificationLevel } from "@/types";

/** Verification badge — distinct from subscription tier. PRO ≠ VERIFIED. */
export function VerificationBadge({
  type,
  level,
  compact,
}: {
  type: ProviderType;
  level?: VerificationLevel;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const isP2P = type === "p2p";
  const label = isP2P
    ? t("P2P vérifié", "Verified P2P")
    : level === "enhanced"
      ? t("Nimba Vérifié", "Nimba Verified")
      : t("Entreprise vérifiée", "Verified Business");
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap",
        compact ? "px-1.5 py-0.5 text-2xs max-sm:text-xs" : "px-2 py-0.5 text-2xs max-sm:text-xs",
        isP2P
          ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-800"
          : "bg-brand-50 text-brand-800 ring-1 ring-brand-200 dark:bg-brand-900/60 dark:text-brand-200 dark:ring-brand-700"
      )}
      title={t("Vérification examinée par Nimba", "Verification reviewed by Nimba")}
    >
      <BadgeCheck className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

/** Subscription tier badge — commercial, separate from verification. */
export function TierBadge({ tier }: { tier: "free" | "pro" }) {
  if (tier !== "pro") return null;
  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-2xs font-bold tracking-wide bg-brand-900 text-brand-100 dark:bg-brand-200 dark:text-brand-950">
      PRO
    </span>
  );
}

/** Paid placement — always explicit, never disguised as organic. */
export function FeaturedBadge() {
  const { t } = useI18n();
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-2xs font-semibold text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800"
      title={t("Emplacement payant — clairement identifié", "Paid placement — clearly identified")}
    >
      <Sparkles className="h-3 w-3" aria-hidden />
      {t("Sponsorisé", "Sponsored")}
    </span>
  );
}

export function StatusBadge({ status }: { status: ProviderStatus }) {
  const { t } = useI18n();
  const map: Record<ProviderStatus, { label: string; cls: string; Icon: typeof CircleDot }> = {
    open: {
      label: t("Ouvert", "Open now"),
      cls: "bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-900/60 dark:text-brand-300 dark:ring-brand-700",
      Icon: CircleDot,
    },
    closing_soon: {
      label: t("Ferme bientôt", "Closing soon"),
      cls: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800",
      Icon: Clock,
    },
    offline: {
      label: t("Hors ligne", "Offline"),
      cls: "bg-gray-100 text-gray-500 ring-gray-200 dark:bg-night-raised dark:text-[#8FA79C] dark:ring-night-lineStrong",
      Icon: CircleDot,
    },
  };
  const { label, cls, Icon } = map[status];
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold ring-1 whitespace-nowrap max-sm:text-xs",
        cls
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

/** Generic pill used across dashboards. */
export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "green" | "amber" | "red" | "blue" | "violet";
  children: React.ReactNode;
}) {
  const tones = {
    neutral:
      "bg-gray-100 text-gray-600 ring-gray-200 dark:bg-night-raised dark:text-[#B7C9C0] dark:ring-night-lineStrong",
    green:
      "bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-900/60 dark:text-brand-300 dark:ring-brand-700",
    amber:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800",
    red: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-900",
    blue: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-900",
    violet:
      "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-800",
  } as const;
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold ring-1 whitespace-nowrap max-sm:text-xs",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Rating({
  value,
  count,
  compact,
}: {
  value: number;
  count?: number;
  compact?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <Star
        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
        aria-hidden
      />
      <span className={classNames("font-semibold", compact ? "text-xs" : "text-sm")}>
        {value.toFixed(value >= 4.95 ? 2 : 1)}
      </span>
      {count !== undefined && (
        <span className="text-2xs text-ink-muted dark:text-[#8FA79C]">({count})</span>
      )}
    </span>
  );
}

/** Small liquidity meter. */
export function LiquidityIndicator({ availableGnf, label }: { availableGnf: number; label: string }) {
  // relative scale against 500M for the meter only
  const pct = Math.min(100, Math.round((availableGnf / 500_000_000) * 100));
  return (
    <div className="min-w-[90px]">
      <div className="text-xs font-semibold tabular-nums">{label}</div>
      <div className="mt-1 h-1 w-full rounded-full bg-line dark:bg-night-lineStrong" aria-hidden>
        <div
          className="h-1 rounded-full bg-brand-500"
          style={{ width: `${Math.max(8, pct)}%` }}
        />
      </div>
    </div>
  );
}

export { ShieldCheck };
