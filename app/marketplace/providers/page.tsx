"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Card, Avatar, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import {
  VerificationBadge,
  TierBadge,
  FeaturedBadge,
  StatusBadge,
  Rating,
  LiquidityIndicator,
} from "@/components/ui/Badge";
import { CreateRequestModal } from "@/components/requests/CreateRequestModal";
import { useI18n } from "@/lib/i18n";
import { providers } from "@/data/mock/providers";
import { districts, paymentRails, type RailId } from "@/config/product";
import {
  classNames,
  formatAmountInput,
  formatGnfCompact,
  formatPct,
  parseAmount,
} from "@/lib/format";
import { ServicePair } from "@/lib/rails";
import type { Provider } from "@/types";
import type { Offer } from "@/lib/marketplace";

type DirSort =
  | "best"
  | "lowest_fee"
  | "highest_rating"
  | "fastest"
  | "largest_liquidity";

export default function ProvidersPage() {
  const { lang, t } = useI18n();
  const [have, setHave] = useState<RailId>("bank");
  const [need, setNeed] = useState<RailId>("cash");
  const [amount, setAmount] = useState("10 000 000");
  const [district, setDistrict] = useState<string>("Tous les quartiers");
  const [sort, setSort] = useState<DirSort>("best");
  const [selected, setSelected] = useState<Offer | null>(null);

  const amountGnf = parseAmount(amount) || 10_000_000;

  const results = useMemo(() => {
    let xs = providers.filter((p) => {
      const hasService = p.services.some(
        (s) => s.from === have && s.to === need
      );
      const inDistrict =
        district === "Tous les quartiers" ||
        p.locations.some((l) => l.district === district);
      return hasService && inDistrict;
    });
    const feeOf = (p: Provider) =>
      Math.min(
        ...p.services
          .filter((s) => s.from === have && s.to === need)
          .map((s) => s.feePct)
      );
    switch (sort) {
      case "lowest_fee":
        xs = [...xs].sort((a, b) => feeOf(a) - feeOf(b));
        break;
      case "highest_rating":
        xs = [...xs].sort((a, b) => b.rating - a.rating);
        break;
      case "fastest":
        xs = [...xs].sort((a, b) => a.responseMinutes - b.responseMinutes);
        break;
      case "largest_liquidity":
        xs = [...xs].sort(
          (a, b) =>
            b.liquidity.totalAvailableGnf - a.liquidity.totalAvailableGnf
        );
        break;
      default:
        xs = [...xs].sort(
          (a, b) =>
            b.rating * b.completedDeals - a.rating * a.completedDeals
        );
    }
    // Featured pinned first — always labeled Sponsored
    return [...xs.filter((p) => p.isFeatured), ...xs.filter((p) => !p.isFeatured)];
  }, [have, need, district, sort]);

  const requestDeal = (p: Provider) => {
    const s =
      p.services.find((x) => x.from === have && x.to === need) ?? p.services[0];
    setSelected({
      provider: p,
      service: s,
      feeGnf: Math.round((amountGnf * s.feePct) / 100),
      receiveGnf: amountGnf - Math.round((amountGnf * s.feePct) / 100),
      score: 0,
    });
  };

  const sortOptions: { id: DirSort; fr: string; en: string }[] = [
    { id: "best", fr: "Meilleure correspondance", en: "Best match" },
    { id: "lowest_fee", fr: "Frais les plus bas", en: "Lowest fee" },
    { id: "highest_rating", fr: "Meilleure note", en: "Highest rating" },
    { id: "fastest", fr: "Réponse la plus rapide", en: "Fastest response" },
    { id: "largest_liquidity", fr: "Plus grande liquidité", en: "Largest liquidity" },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-extrabold">
          {t("Partenaires de liquidité vérifiés", "Verified liquidity providers")}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Comparez des partenaires de confiance par prix, lieu, limites et réputation.",
            "Compare trusted providers by price, location, limits and reputation."
          )}
        </p>
      </div>

      {/* horizontal search */}
      <Card className="card-pad">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="label-xs" htmlFor="dir-amount">
              {t("J'ai", "I have")}
            </label>
            <div className="relative">
              <input
                id="dir-amount"
                inputMode="numeric"
                className="input-base pr-12 font-semibold tabular-nums"
                value={amount}
                onChange={(e) => setAmount(formatAmountInput(e.target.value))}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-2xs font-bold text-ink-muted">
                GNF
              </span>
            </div>
          </div>
          <div>
            <label className="label-xs" htmlFor="dir-have">
              {t("Source", "Source")}
            </label>
            <select
              id="dir-have"
              className="input-base"
              value={have}
              onChange={(e) => setHave(e.target.value as RailId)}
            >
              {paymentRails.map((r) => (
                <option key={r.id} value={r.id}>
                  {lang === "fr" ? r.labelFr : r.labelEn}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-xs" htmlFor="dir-need">
              {t("J'ai besoin de", "I need")}
            </label>
            <select
              id="dir-need"
              className="input-base"
              value={need}
              onChange={(e) => setNeed(e.target.value as RailId)}
            >
              {paymentRails.map((r) => (
                <option key={r.id} value={r.id}>
                  {lang === "fr" ? r.labelFr : r.labelEn}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-xs" htmlFor="dir-city">
              {t("Ville", "City")}
            </label>
            <select id="dir-city" className="input-base" defaultValue="Conakry">
              <option>Conakry</option>
            </select>
          </div>
          <div>
            <label className="label-xs" htmlFor="dir-district">
              {t("Quartier", "District")}
            </label>
            <select
              id="dir-district"
              className="input-base"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === "Tous les quartiers" && lang === "en" ? "All districts" : d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* sort bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted dark:text-[#8FA79C]">
          {results.length}{" "}
          {t("partenaires correspondent", "providers match")}
        </p>
        <label className="flex items-center gap-2 text-xs font-medium">
          {t("Trier :", "Sort:")}
          <select
            className="input-base !w-auto !py-1.5"
            value={sort}
            onChange={(e) => setSort(e.target.value as DirSort)}
          >
            {sortOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {lang === "fr" ? s.fr : s.en}
              </option>
            ))}
          </select>
        </label>
      </div>

      {results.length === 0 ? (
        <Card>
          <EmptyState
            title={t(
              "Aucun partenaire pour ce service dans ce quartier.",
              "No providers offer this service in this district."
            )}
            hints={[
              t("Changez de quartier", "Change district"),
              t("Essayez un autre service", "Try another service"),
            ]}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((p) => (
            <ProviderDirectoryCard
              key={p.id}
              provider={p}
              have={have}
              need={need}
              onRequest={() => requestDeal(p)}
            />
          ))}
        </div>
      )}

      {selected && (
        <CreateRequestModal
          offer={selected}
          amountGnf={amountGnf}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function ProviderDirectoryCard({
  provider: p,
  have,
  need,
  onRequest,
}: {
  provider: Provider;
  have: RailId;
  need: RailId;
  onRequest: () => void;
}) {
  const { lang, t } = useI18n();
  const matched = p.services.find((s) => s.from === have && s.to === need);
  const loc = p.locations[0];
  return (
    <Card
      className={classNames(
        "card-pad",
        p.isFeatured && "ring-1 ring-amber-200 dark:ring-amber-800"
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        {/* identity */}
        <div className="flex min-w-[220px] flex-1 items-start gap-3">
          <Avatar initials={p.logoInitials} hue={p.logoHue} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <Link
                href={`/marketplace/providers/${p.slug}`}
                className="text-sm font-bold hover:text-mkt-600"
              >
                {p.name}
              </Link>
              <TierBadge tier={p.subscriptionTier} />
              {p.isFeatured && <FeaturedBadge />}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <VerificationBadge type={p.type} level={p.verification.level} compact />
              <Rating value={p.rating} compact />
              <span className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                {p.completedDeals.toLocaleString("fr-FR")}{" "}
                {t("transactions", "matched deals")} · {p.monthsOnNimba}{" "}
                {t("mois sur Nimba", "months on Nimba")}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-2xs text-ink-secondary dark:text-[#B7C9C0]">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-brand-500" aria-hidden />
                {loc.district}, {loc.city}
              </span>
              <StatusBadge status={p.status} />
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 text-ink-faint" aria-hidden />
                {t("Réponse", "Response")} ~{p.responseMinutes} min
              </span>
            </div>
          </div>
        </div>

        {/* services */}
        <div className="min-w-[180px]">
          <p className="label-xs">{t("Services", "Services")}</p>
          <ul className="space-y-1">
            {p.services.slice(0, 3).map((s) => (
              <li key={s.id}>
                <ServicePair from={s.from} to={s.to} lang={lang} />
              </li>
            ))}
          </ul>
        </div>

        {/* numbers */}
        <div className="grid min-w-[220px] grid-cols-3 gap-3">
          <div>
            <p className="label-xs">{t("Frais", "Fee")}</p>
            <p className="text-sm font-bold tabular-nums">
              {matched
                ? formatPct(matched.feePct)
                : `${formatPct(Math.min(...p.services.map((s) => s.feePct)))}–${formatPct(
                    Math.max(...p.services.map((s) => s.feePct))
                  )}`}
            </p>
          </div>
          <div>
            <p className="label-xs">{t("Limites", "Limits")}</p>
            <p className="text-xs font-semibold tabular-nums">
              {formatGnfCompact(p.limits.minGnf, lang)}–
              {formatGnfCompact(p.limits.maxGnf, lang)}
            </p>
          </div>
          <div>
            <p className="label-xs">{t("Liquidité", "Liquidity")}</p>
            <LiquidityIndicator
              availableGnf={p.liquidity.totalAvailableGnf}
              label={formatGnfCompact(p.liquidity.totalAvailableGnf, lang)}
            />
          </div>
        </div>

        {/* actions */}
        <div className="flex w-full flex-row gap-2 sm:w-auto sm:flex-col lg:ml-auto">
          <Link href={`/marketplace/providers/${p.slug}`} className="flex-1 sm:flex-none">
            <Button variant="secondary" size="sm" full>
              {t("Voir le profil", "View provider")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </Link>
          <Button
            variant="blue"
            size="sm"
            full
            className="flex-1 sm:flex-none"
            onClick={onRequest}
            disabled={p.status === "offline"}
          >
            {t("Demander", "Request deal")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
