"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  BadgeCheck,
  TrendingUp,
  Star,
  BarChart3,
  MapPin,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/marketplace/BelowFold";
import { useI18n } from "@/lib/i18n";
import { plans } from "@/data/mock/market";
import { formatGnf } from "@/lib/format";

export default function BusinessPage() {
  const { lang, t } = useI18n();

  const benefits = [
    { Icon: Users, title: t("Plus de clients", "More customers"), text: t("Des demandes qualifiées, dans vos quartiers.", "Qualified requests, in your districts.") },
    { Icon: BadgeCheck, title: t("Profil vérifié", "Verified profile"), text: t("Une fiche publique qui inspire confiance.", "A public listing that builds trust.") },
    { Icon: TrendingUp, title: t("Génération de leads", "Lead generation"), text: t("Chaque recherche pertinente devient un lead.", "Every relevant search becomes a lead.") },
    { Icon: Star, title: t("Réputation de marché", "Marketplace reputation"), text: t("Notes et avis liés à des transactions vérifiées.", "Ratings tied to verified deals.") },
    { Icon: BarChart3, title: t("Analytique", "Analytics"), text: t("Vues, apparitions, conversion — en un coup d'œil.", "Views, appearances, conversion — at a glance.") },
    { Icon: MapPin, title: t("Plusieurs lieux", "Multiple locations"), text: t("Gérez tous vos points de service.", "Manage all your service points.") },
    { Icon: Zap, title: t("Priorité avec Pro", "Priority matching with Pro"), text: t("Passez devant dans la file de matching.", "Move up the matching queue.") },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* hero — compact, product-first */}
      <section className="overflow-hidden rounded-card bg-gradient-to-br from-brand-900 to-brand-950 p-6 text-white sm:p-10">
        <div className="max-w-xl">
          <p className="text-2xs font-bold uppercase tracking-widest text-brand-300">
            {t("Espace partenaires", "For providers")}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight">
            {t(
              "Développez votre activité de liquidité avec Nimba",
              "Grow your liquidity business with Nimba"
            )}
          </h1>
          <p className="mt-2 text-sm text-brand-100/80">
            {t(
              "Recevez des demandes clients vérifiées et gérez votre liquidité depuis un seul tableau de bord.",
              "Receive verified customer leads and manage your liquidity from one dashboard."
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/business/apply">
              <Button size="lg" className="!bg-white !text-brand-900 hover:!bg-brand-50">
                {t("Devenir partenaire", "Apply as provider")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <Link href="/partner">
              <Button size="lg" variant="dark" className="!bg-white/10 ring-1 ring-white/20 hover:!bg-white/20">
                {t("Voir le tableau de bord", "See the dashboard")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title={t("Ce que vous obtenez", "What you get")} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {benefits.map(({ Icon, title, text }) => (
            <Card key={title} className="card-pad">
              <Icon className="h-5 w-5 text-brand-500" aria-hidden />
              <p className="mt-2 text-[13px] font-bold">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* monetization tiers — honest framing */}
      <section>
        <SectionTitle
          title={t("Trois façons d'être présent", "Three ways to be listed")}
          subtitle={t(
            "La vérification est toujours obligatoire — payer n'augmente jamais le niveau de confiance affiché.",
            "Verification is always required — paying never raises the displayed trust level."
          )}
        />
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="card-pad">
            <p className="text-sm font-extrabold">{t("Gratuit", "Free")}</p>
            <p className="mt-1 text-xs text-ink-muted dark:text-[#8FA79C]">
              {t("Soyez listé.", "Get listed.")}
            </p>
            <ul className="mt-3 space-y-1.5">
              {(lang === "fr" ? plans.free.featuresFr : plans.free.featuresEn).map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="card-pad ring-1 ring-brand-300 dark:ring-brand-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold">Pro</p>
              <span className="rounded bg-brand-900 px-1.5 py-0.5 text-2xs font-bold text-brand-100">
                PRO
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted dark:text-[#8FA79C]">
              {t("Plus d'outils et de visibilité.", "Get more tools and visibility.")}
            </p>
            <p className="mt-2 text-lg font-extrabold tabular-nums">
              {formatGnf(plans.pro.priceGnf)}
              <span className="text-xs font-medium text-ink-muted dark:text-[#8FA79C]">
                /{t("mois", "mo")}
              </span>
            </p>
            <p className="text-2xs text-amber-700 dark:text-amber-300">
              {t("Tarif illustratif / configurable", "Illustrative / configurable pricing")}
            </p>
            <ul className="mt-3 space-y-1.5">
              {(lang === "fr" ? plans.pro.featuresFr : plans.pro.featuresEn).map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="card-pad">
            <p className="text-sm font-extrabold">{t("En vedette", "Featured")}</p>
            <p className="mt-1 text-xs text-ink-muted dark:text-[#8FA79C]">
              {t("Mettez en avant certains services.", "Promote selected services.")}
            </p>
            <ul className="mt-3 space-y-1.5 text-xs">
              {[
                t("Haut des résultats par quartier", "Top of search per district"),
                t("Toujours étiqueté « Sponsorisé »", "Always labeled “Sponsored”"),
                t("Budget et durée au choix", "Choose budget and duration"),
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <Card className="card-pad flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold">
            {t("Prêt à rejoindre le réseau ?", "Ready to join the network?")}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Candidature en 10 étapes, reprise possible à tout moment.",
              "10-step application, save and continue anytime."
            )}
          </p>
        </div>
        <Link href="/business/apply">
          <Button size="lg">
            {t("Commencer la candidature", "Start application")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Link>
      </Card>

      <Footer />
    </div>
  );
}
