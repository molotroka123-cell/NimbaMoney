"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Store,
  ArrowRight,
  MessageSquare,
  Bookmark,
  FileText,
  ArrowLeftRight,
  BadgeCheck,
  Scale,
} from "lucide-react";
import { Card, Avatar, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill, VerificationBadge, Rating } from "@/components/ui/Badge";
import { statusPill } from "@/components/requests/status";
import { Footer } from "@/components/marketplace/BelowFold";
import { ActivityFeed } from "@/components/home/ActivityFeed";
import { useI18n } from "@/lib/i18n";
import { providers, getProvider, getProviderById } from "@/data/mock/providers";
import { offers, orders, getTrader } from "@/data/mock/p2p";
import { requests } from "@/data/mock/requests";
import { threads } from "@/data/mock/messages";
import { formatGnf, formatNumber } from "@/lib/format";
import { railLabel } from "@/lib/rails";

/**
 * Shared ecosystem entry point. One Nimba account, two products:
 * P2P Exchange (green) and Verified Marketplace (blue).
 */
export default function HomePage() {
  const { lang, t } = useI18n();

  const activeOffers = offers.length;
  const activeProviders = providers.filter((p) => p.status !== "offline").length;
  const lastOrder = orders[0];
  const lastOrderTrader = getTrader(lastOrder.traderId)!;
  const lastRequest = requests[0];
  const savedProvider = getProvider("kaba-trade")!;
  const unread = threads.reduce((n, th) => n + th.unread, 0);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-extrabold">
          {t("Bon retour, Mohamed 👋", "Welcome back, Mohamed 👋")}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Un compte Nimba, deux façons d'échanger.",
            "One Nimba account, two ways to exchange."
          )}
        </p>
      </div>

      {/* the two products */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* P2P — GREEN */}
        <Card className="card-pad relative overflow-hidden !border-brand-300 ring-1 ring-brand-200 dark:!border-brand-700 dark:ring-brand-800">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white">
              <Users className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-extrabold">P2P Exchange</h2>
                <Pill tone="green">{t("Actif", "Active")}</Pill>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
                {t(
                  "Tradez directement avec des pairs vérifiés. GNF ↔ USDT · Orange Money · MTN · Wave · Banque · Espèces.",
                  "Trade directly with verified peers. GNF ↔ USDT · Orange Money · MTN · Wave · Bank · Cash."
                )}
              </p>
              <p className="mt-2 text-xs font-semibold text-brand-700 dark:text-brand-300">
                {formatNumber(activeOffers)}{" "}
                {t("offres actives correspondant à vos préférences", "active offers matching your preferences")}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3.5 dark:border-night-line">
            <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
              {t(
                "Je choisis l'offre d'un autre trader et je traite directement.",
                "I pick another trader's offer and trade directly."
              )}
            </p>
            <Link href="/p2p">
              <Button size="sm">
                {t("Ouvrir le P2P", "Open P2P Exchange")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </Link>
          </div>
        </Card>

        {/* MARKETPLACE — BLUE */}
        <Card className="card-pad relative overflow-hidden !border-mkt-300 ring-1 ring-mkt-200 dark:!border-mkt-700 dark:ring-navy-700">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mkt-500 text-white">
              <Store className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-extrabold">
                  {t("Marketplace vérifié", "Verified Marketplace")}
                </h2>
                <Pill tone="blue">{t("Actif", "Active")}</Pill>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
                {t(
                  "Comparez des échangeurs professionnels, fournisseurs de liquidité et bureaux de change vérifiés.",
                  "Compare professional exchangers, liquidity providers and verified exchange businesses."
                )}
              </p>
              <p className="mt-2 text-xs font-semibold text-mkt-600 dark:text-mkt-300">
                {activeProviders}+ {t("partenaires vérifiés disponibles", "verified providers available")}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3.5 dark:border-night-line">
            <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
              {t(
                "Je compare des professionnels vérifiés et je choisis qui exécute ma demande.",
                "I compare verified professionals and choose who executes my request."
              )}
            </p>
            <Link href="/marketplace">
              <Button size="sm" variant="blue">
                {t("Ouvrir le Marketplace", "Open Marketplace")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* recents */}
      <section>
        <SectionTitle
          title={t("Reprendre où vous en étiez", "Pick up where you left off")}
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {/* recent P2P order */}
          <Link href={`/p2p/order/${lastOrder.id}`}>
            <Card className="card-pad h-full transition-shadow hover:shadow-raised">
              <p className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">
                <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden />
                {t("Ordre P2P récent", "Recent P2P order")}
              </p>
              <p className="mt-2 text-sm font-bold">{lastOrder.id}</p>
              <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                {lastOrderTrader.name} · {formatGnf(lastOrder.amountGnf)} →{" "}
                {lastOrder.amountUsdt.toFixed(2)} USDT
              </p>
              <p className="mt-2">
                {lastOrder.status === "completed" ? (
                  <Pill tone="green">{t("Terminé", "Completed")}</Pill>
                ) : lastOrder.status === "cancelled" ? (
                  <Pill tone="neutral">{t("Annulé", "Cancelled")}</Pill>
                ) : lastOrder.status === "disputed" ? (
                  <Pill tone="red">{t("En litige", "Disputed")}</Pill>
                ) : (
                  <Pill tone="amber">{t("Paiement en attente", "Payment pending")}</Pill>
                )}
              </p>
            </Card>
          </Link>
          {/* recent marketplace request */}
          <Link href={`/marketplace/request/${lastRequest.id}`}>
            <Card className="card-pad h-full transition-shadow hover:shadow-raised">
              <p className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide text-mkt-600 dark:text-mkt-300">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                {t("Demande Marketplace récente", "Recent Marketplace request")}
              </p>
              <p className="mt-2 text-sm font-bold">{lastRequest.id}</p>
              <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                {getProviderById(lastRequest.providerId)?.name} · {railLabel(lastRequest.from, lang)} →{" "}
                {railLabel(lastRequest.to, lang)} · {formatGnf(lastRequest.receiveGnf)}
              </p>
              <p className="mt-2">{statusPill(lastRequest.status, t)}</p>
            </Card>
          </Link>
          {/* saved provider */}
          <Link href={`/marketplace/providers/${savedProvider.slug}`}>
            <Card className="card-pad h-full transition-shadow hover:shadow-raised">
              <p className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                <Bookmark className="h-3.5 w-3.5" aria-hidden />
                {t("Partenaire enregistré", "Saved provider")}
              </p>
              <div className="mt-2 flex items-center gap-2.5">
                <Avatar initials={savedProvider.logoInitials} hue={savedProvider.logoHue} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{savedProvider.name}</p>
                  <Rating value={savedProvider.rating} compact />
                </div>
              </div>
              <p className="mt-2">
                <VerificationBadge
                  type={savedProvider.type}
                  level={savedProvider.verification.level}
                  compact
                />
              </p>
            </Card>
          </Link>
          {/* messages */}
          <Link href="/messages">
            <Card className="card-pad h-full transition-shadow hover:shadow-raised">
              <p className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                Messages
              </p>
              <p className="mt-2 text-sm font-bold">
                {unread} {t("non lus", "unread")}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                {t(
                  "Kaba Trade vous a envoyé les instructions de règlement.",
                  "Kaba Trade sent you settlement instructions."
                )}
              </p>
              <p className="mt-2">
                <Pill tone="green">{t("Répondre", "Reply")}</Pill>
              </p>
            </Card>
          </Link>
        </div>
      </section>

      {/* live ecosystem activity (demo) */}
      <ActivityFeed />

      {/* how the ecosystem fits together */}
      <section>
        <SectionTitle
          title={t("Deux produits, une confiance", "Two products, one trust layer")}
        />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              Icon: Users,
              tint: "text-brand-600 bg-brand-50 dark:bg-brand-900/60 dark:text-brand-300",
              title: "P2P Exchange",
              text: t(
                "Offres de traders vérifiés, ordre direct, chat intégré et protection Nimba (démo) pendant l'ordre.",
                "Verified trader offers, direct orders, built-in chat and Nimba protection (demo) during the order."
              ),
            },
            {
              Icon: Scale,
              tint: "text-mkt-600 bg-mkt-50 dark:bg-navy-800 dark:text-mkt-300",
              title: t("Marketplace vérifié", "Verified Marketplace"),
              text: t(
                "Comparaison de professionnels : réputation, liquidité, lieux, limites. Règlement direct avec le partenaire.",
                "Compare professionals: reputation, liquidity, locations, limits. Direct settlement with the provider."
              ),
            },
            {
              Icon: BadgeCheck,
              tint: "text-brand-600 bg-brand-50 dark:bg-brand-900/60 dark:text-brand-300",
              title: t("Un seul compte Nimba", "One Nimba account"),
              text: t(
                "KYC, messages, notifications et support partagés. Vos ordres P2P et vos demandes Marketplace restent séparés.",
                "Shared KYC, messages, notifications and support. Your P2P orders and Marketplace requests stay separate."
              ),
            },
          ].map(({ Icon, tint, title, text }) => (
            <Card key={title} className="card-pad">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tint}`}>
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </div>
              <p className="mt-2.5 text-[13px] font-bold">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
                {text}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
