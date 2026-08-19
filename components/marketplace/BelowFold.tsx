"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Search, Scale, Handshake } from "lucide-react";
import { Card, Avatar, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { VerificationBadge, Rating, TierBadge } from "@/components/ui/Badge";
import { LogoMark } from "@/components/layout/Sidebar";
import { useI18n } from "@/lib/i18n";
import { providers } from "@/data/mock/providers";
import { formatGnfCompact } from "@/lib/format";

export function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    {
      Icon: Search,
      title: t("Dites-nous ce qu'il vous faut", "Tell us what you need"),
      text: t(
        "Indiquez le montant, le moyen de paiement et le lieu.",
        "Enter amount, method and location."
      ),
    },
    {
      Icon: Scale,
      title: t("Comparez les partenaires vérifiés", "Compare verified providers"),
      text: t(
        "Frais, limites, disponibilité et notes — tout est visible.",
        "See fees, limits, availability and ratings."
      ),
    },
    {
      Icon: Handshake,
      title: t("Concluez directement avec le partenaire", "Complete directly with the provider"),
      text: t(
        "Nimba enregistre la transaction et reste disponible pour le support.",
        "Nimba logs the transaction and remains available for support."
      ),
    },
  ];
  return (
    <section>
      <SectionTitle
        title={t("Comment ça marche", "How it works")}
        subtitle={t("Trois étapes, moins de 20 secondes.", "Three steps, under 20 seconds.")}
      />
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map(({ Icon, title, text }, i) => (
          <Card key={title} className="card-pad">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-sm font-extrabold text-brand-200">
                {i + 1}
              </div>
              <Icon className="h-4 w-4 text-brand-500" aria-hidden />
            </div>
            <p className="mt-2.5 text-[13px] font-bold">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
              {text}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function TopProviders() {
  const { lang, t } = useI18n();
  const top = [...providers]
    .filter((p) => p.status !== "offline")
    .sort((a, b) => b.completedDeals - a.completedDeals)
    .slice(0, 4);
  return (
    <section>
      <SectionTitle
        title={t("Meilleurs partenaires vérifiés", "Top verified providers")}
        subtitle={t(
          "Classés par historique de transactions réussies.",
          "Ranked by completed-deal history."
        )}
        right={
          <Link
            href="/marketplace/providers"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
          >
            {t("Voir l'annuaire", "View directory")}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {top.map((p) => (
          <Link key={p.id} href={`/marketplace/providers/${p.slug}`}>
            <Card className="card-pad h-full transition-shadow hover:shadow-raised">
              <div className="flex items-center gap-2.5">
                <Avatar initials={p.logoInitials} hue={p.logoHue} />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-[13px] font-bold">
                    {p.name} <TierBadge tier={p.subscriptionTier} />
                  </p>
                  <Rating value={p.rating} count={p.reviewCount} compact />
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <VerificationBadge type={p.type} level={p.verification.level} compact />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-2.5 text-2xs dark:border-night-line">
                <div>
                  <dt className="text-ink-muted dark:text-[#8FA79C]">
                    {t("Transactions", "Deals")}
                  </dt>
                  <dd className="font-bold tabular-nums">
                    {p.completedDeals.toLocaleString("fr-FR")}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted dark:text-[#8FA79C]">
                    {t("Liquidité", "Liquidity")}
                  </dt>
                  <dd className="font-bold tabular-nums">
                    {formatGnfCompact(p.liquidity.totalAvailableGnf, lang)}
                  </dd>
                </div>
              </dl>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function BecomeProviderCTA() {
  const { t } = useI18n();
  return (
    <section className="overflow-hidden rounded-card bg-gradient-to-br from-brand-900 to-brand-950 p-6 text-white sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-lg">
          <h2 className="text-lg font-extrabold">
            {t(
              "Développez votre activité de liquidité avec Nimba",
              "Grow your liquidity business with Nimba"
            )}
          </h2>
          <p className="mt-1.5 text-sm text-brand-100/80">
            {t(
              "Recevez des demandes clients vérifiées et gérez votre liquidité depuis un seul tableau de bord.",
              "Receive verified customer leads and manage your liquidity from one dashboard."
            )}
          </p>
        </div>
        <Link href="/business">
          <Button
            size="lg"
            className="!bg-white !text-brand-900 hover:!bg-brand-50"
          >
            {t("Devenir partenaire", "Apply as provider")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  const cols = [
    {
      title: t("Produit", "Product"),
      links: [
        { href: "/marketplace", label: t("Marketplace vérifié", "Verified Marketplace") },
        { href: "/p2p", label: t("Échange P2P", "P2P Exchange") },
        { href: "/verification", label: t("Vérification", "Verification") },
      ],
    },
    {
      title: t("Business", "Business"),
      links: [
        { href: "/business", label: t("Devenir partenaire", "Become a provider") },
        { href: "/partner", label: t("Tableau de bord", "Provider dashboard") },
        { href: "/partner/subscription", label: t("Tarifs", "Pricing") },
      ],
    },
    {
      title: t("Support", "Support"),
      links: [
        { href: "/account/support", label: t("Centre d'aide", "Help center") },
        { href: "/verification", label: t("Comment ça marche", "How it works") },
        { href: "/account/support", label: t("Litiges", "Disputes") },
      ],
    },
  ];
  return (
    <footer className="mt-2 border-t border-line pt-6 dark:border-night-line">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark className="h-5 w-8 text-brand-600 dark:text-brand-300" />
            <span className="text-sm font-extrabold tracking-tight">
              NIMBA <span className="text-brand-600 dark:text-brand-300">MONEY</span>
            </span>
          </div>
          <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Le marché de confiance où la Guinée trouve sa liquidité.",
              "The trusted marketplace where Guinea finds liquidity."
            )}
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-2xs font-bold uppercase tracking-wider text-ink-muted dark:text-[#8FA79C]">
              {c.title}
            </p>
            <ul className="mt-2 space-y-1.5">
              {c.links.map((l, i) => (
                <li key={i}>
                  <Link
                    href={l.href}
                    className="text-xs font-medium text-ink-secondary hover:text-brand-600 dark:text-[#B7C9C0] dark:hover:text-brand-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 border-t border-line py-4 text-2xs text-ink-muted dark:border-night-line dark:text-[#8FA79C]">
        © 2026 Nimba Money ·{" "}
        {t(
          "Prototype produit — données de démonstration. Aucune allégation réglementaire.",
          "Product prototype — demonstration data. No regulatory claims."
        )}
      </p>
    </footer>
  );
}
