"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, ShieldCheck, Wallet, Gauge, Users } from "lucide-react";
import { Card, Avatar, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { VerificationBadge, Rating, Pill, StatusBadge } from "@/components/ui/Badge";
import { CreateRequestModal } from "@/components/requests/CreateRequestModal";
import { useI18n } from "@/lib/i18n";
import { enableTier2P2P } from "@/config/product";
import { p2pProviders } from "@/data/mock/providers";
import { formatGnfCompact, formatPct } from "@/lib/format";
import { ServicePair } from "@/lib/rails";
import type { Offer } from "@/lib/marketplace";

/**
 * Tier-2 gated P2P marketplace — behind the enableTier2P2P feature flag.
 * P2P providers are visually distinct from Verified Businesses ("Verified P2P")
 * and never presented as licensed businesses.
 */
export default function P2PPage() {
  const { lang, t } = useI18n();
  const [selected, setSelected] = useState<Offer | null>(null);

  if (!enableTier2P2P) {
    return (
      <div className="mx-auto max-w-xl space-y-4 p-4 py-14 text-center lg:p-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-950/50">
          <Lock className="h-7 w-7 text-violet-600 dark:text-violet-300" aria-hidden />
        </div>
        <h1 className="text-xl font-extrabold">
          {t("Marché P2P vérifié — Niveau 2", "Verified P2P marketplace — Tier 2")}
        </h1>
        <p className="text-sm leading-relaxed text-ink-muted dark:text-[#8FA79C]">
          {t(
            "L'offre P2P ouvrira après la phase pilote, uniquement pour des particuliers et petits agents contrôlés. Ce n'est pas un P2P ouvert : chaque fournisseur passe un KYC complet, verse un dépôt de garantie et opère sous limites strictes.",
            "P2P supply opens after the pilot phase, only for vetted individuals and small agents. This is not open P2P: every provider passes full KYC, posts a security deposit and operates under strict limits."
          )}
        </p>
        <Card className="card-pad text-left">
          <p className="label-xs">{t("Conditions d'admission (Niveau 2)", "Tier-2 onboarding requires")}</p>
          <ul className="space-y-2 text-xs">
            {[
              { Icon: ShieldCheck, label: t("KYC complet + vivacité", "Full KYC + liveness") },
              { Icon: Wallet, label: t("Dépôt de garantie", "Security deposit") },
              { Icon: Gauge, label: t("Limite journalière et par transaction", "Daily and per-deal limits") },
              { Icon: Users, label: t("Niveau de risque évalué et suivi", "Assessed and monitored risk tier") },
            ].map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 shrink-0 text-violet-500" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </Card>
        <p className="text-2xs text-ink-faint">
          {t(
            "Configuration : enableTier2P2P = false (mode pilote). Les partenaires P2P porteront le badge « P2P vérifié », distinct de « Entreprise vérifiée ».",
            "Config: enableTier2P2P = false (pilot mode). P2P providers will carry the “Verified P2P” badge, distinct from “Verified Business”."
          )}
        </p>
        <Link href="/providers" className="inline-block">
          <Button>{t("Voir les entreprises vérifiées", "See verified businesses")}</Button>
        </Link>
      </div>
    );
  }

  // FULL MODE — Tier-2 unlocked
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <SectionTitle
        title={t("Fournisseurs P2P vérifiés", "Verified P2P providers")}
        subtitle={t(
          "Particuliers et petits agents contrôlés — KYC complet, dépôt, limites strictes. Distincts des entreprises vérifiées.",
          "Vetted individuals and small agents — full KYC, deposit, strict limits. Distinct from verified businesses."
        )}
      />
      <Card>
        <div className="scroll-x">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-line dark:border-night-line">
              <tr>
                <th className="th-cell">{t("Fournisseur", "Provider")}</th>
                <th className="th-cell">{t("Méthode", "Method")}</th>
                <th className="th-cell">{t("Frais", "Rate / fee")}</th>
                <th className="th-cell">{t("Limite", "Limit")}</th>
                <th className="th-cell">{t("Disponibilité", "Availability")}</th>
                <th className="th-cell">{t("Complétion", "Completion")}</th>
                <th className="th-cell">{t("Transactions", "Trades")}</th>
                <th className="th-cell" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-night-line">
              {p2pProviders.map((p) =>
                p.services.map((s) => (
                  <tr key={`${p.id}-${s.id}`} className="table-row-hover">
                    <td className="td-cell">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={p.logoInitials} hue={p.logoHue} />
                        <div>
                          <p className="text-[13px] font-bold">{p.name}</p>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <VerificationBadge type="p2p" compact />
                            <Rating value={p.rating} compact />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="td-cell">
                      <ServicePair from={s.from} to={s.to} lang={lang} />
                    </td>
                    <td className="td-cell font-semibold tabular-nums">{formatPct(s.feePct)}</td>
                    <td className="td-cell text-xs tabular-nums">
                      {formatGnfCompact(s.minGnf, lang)}–{formatGnfCompact(s.maxGnf, lang)}
                    </td>
                    <td className="td-cell"><StatusBadge status={p.status} /></td>
                    <td className="td-cell"><Pill tone="violet">{p.successRate}%</Pill></td>
                    <td className="td-cell text-xs tabular-nums">{p.completedDeals}</td>
                    <td className="td-cell text-right">
                      <Button
                        size="sm"
                        onClick={() =>
                          setSelected({ provider: p, service: s, feeGnf: 0, receiveGnf: 0, score: 0 })
                        }
                      >
                        {t("Demander", "Request")}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-2xs text-ink-faint">
        {t(
          "Les fournisseurs P2P ne sont pas des entreprises agréées, sauf indication contraire vérifiée.",
          "P2P providers are not licensed businesses unless verified otherwise."
        )}
      </p>
      {selected && (
        <CreateRequestModal
          offer={selected}
          amountGnf={Math.min(1_000_000, selected.service.maxGnf)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
