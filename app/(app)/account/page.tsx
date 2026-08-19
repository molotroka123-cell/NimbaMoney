"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, LifeBuoy } from "lucide-react";
import { Card, Avatar, StatsCard } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { statusPill } from "@/components/requests/status";
import { useI18n } from "@/lib/i18n";
import { requests, completedDeals } from "@/data/mock/requests";
import { getProviderById, providers } from "@/data/mock/providers";
import { formatGnf } from "@/lib/format";

export default function AccountOverviewPage() {
  const { t } = useI18n();
  const saved = providers.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label={t("Demandes actives", "Active requests")} value="1" />
        <StatsCard
          label={t("Transactions terminées", "Completed deals")}
          value={String(completedDeals.length)}
        />
        <StatsCard
          label={t("Vérification", "Verification")}
          value={t("Vérifié", "Verified")}
          sub={t("Compte de démonstration investisseur", "Investor demo account")}
        />
        <StatsCard
          label={t("Support", "Support")}
          value={t("Aucun ticket", "No open tickets")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-pad">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">{t("Demandes récentes", "Recent requests")}</h2>
            <Link href="/marketplace/requests" className="text-2xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300">
              {t("Tout voir →", "View all →")}
            </Link>
          </div>
          <ul className="mt-2 divide-y divide-line dark:divide-night-line">
            {requests.map((r) => {
              const p = getProviderById(r.providerId);
              return (
                <li key={r.id}>
                  <Link
                    href={`/marketplace/request/${r.id}`}
                    className="flex items-center gap-3 py-2.5 hover:bg-surface-sunken/50 dark:hover:bg-night-raised/50"
                  >
                    {p && <Avatar initials={p.logoInitials} hue={p.logoHue} size="sm" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold">{r.id}</p>
                      <p className="truncate text-2xs text-ink-muted dark:text-[#8FA79C]">
                        {p?.name} · {formatGnf(r.receiveGnf)}
                      </p>
                    </div>
                    {statusPill(r.status, t)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="card-pad">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">{t("Partenaires enregistrés", "Saved providers")}</h2>
            <Link href="/account/saved" className="text-2xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300">
              {t("Gérer →", "Manage →")}
            </Link>
          </div>
          <ul className="mt-2 divide-y divide-line dark:divide-night-line">
            {saved.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/marketplace/providers/${p.slug}`}
                  className="flex items-center gap-3 py-2.5"
                >
                  <Avatar initials={p.logoInitials} hue={p.logoHue} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold">{p.name}</p>
                    <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                      {p.locations[0].district} · ~{p.responseMinutes} min
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-ink-faint" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="card-pad flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/60">
            <BadgeCheck className="h-5 w-5 text-brand-600 dark:text-brand-300" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold">
              {t("Compte vérifié", "Verified account")}{" "}
              <Pill tone="green">{t("Démo", "Demo")}</Pill>
            </p>
            <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
              {t(
                "Persona de démonstration : Mohamed Diallo. KYC complet simulé pour le prototype investisseur.",
                "Demo persona: Mohamed Diallo. Simulated full KYC for the investor prototype."
              )}
            </p>
          </div>
        </div>
        <Link href="/verification">
          <Button variant="secondary" size="sm">
            {t("Vérifier mon identité", "Verify my identity")}
          </Button>
        </Link>
      </Card>
    </div>
  );
}
