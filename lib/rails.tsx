"use client";

import React from "react";
import {
  Banknote,
  Landmark,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { RailId, P2PMethodId } from "@/config/product";
import type { Lang } from "@/types";

export const railMeta: Record<
  P2PMethodId,
  { fr: string; en: string; icon: LucideIcon; tint: string }
> = {
  cash: {
    fr: "Espèces",
    en: "Cash",
    icon: Banknote,
    tint: "text-brand-600 dark:text-brand-300",
  },
  bank: {
    fr: "Virement bancaire",
    en: "Bank transfer",
    icon: Landmark,
    tint: "text-info dark:text-blue-300",
  },
  orange: {
    fr: "Orange Money",
    en: "Orange Money",
    icon: Smartphone,
    tint: "text-orange-600 dark:text-orange-300",
  },
  mtn: {
    fr: "MTN MoMo",
    en: "MTN MoMo",
    icon: Smartphone,
    tint: "text-yellow-600 dark:text-yellow-300",
  },
  // P2P-only rail
  wave: {
    fr: "Wave",
    en: "Wave",
    icon: Smartphone,
    tint: "text-sky-600 dark:text-sky-300",
  },
};

export function railLabel(id: P2PMethodId, lang: Lang): string {
  return lang === "fr" ? railMeta[id].fr : railMeta[id].en;
}

export function RailChip({
  id,
  lang,
  compact,
}: {
  id: P2PMethodId;
  lang: Lang;
  compact?: boolean;
}) {
  const m = railMeta[id];
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <Icon className={`h-3.5 w-3.5 shrink-0 ${m.tint}`} aria-hidden />
      <span className={compact ? "text-xs" : ""}>
        {lang === "fr" ? m.fr : m.en}
      </span>
    </span>
  );
}

/** "Bank → Cash" service label */
export function ServicePair({
  from,
  to,
  lang,
}: {
  from: RailId;
  to: RailId;
  lang: Lang;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium">
      <RailChip id={from} lang={lang} compact />
      <span className="text-ink-faint">→</span>
      <RailChip id={to} lang={lang} compact />
    </span>
  );
}
