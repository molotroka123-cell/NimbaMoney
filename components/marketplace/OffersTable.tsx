"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  SlidersHorizontal,
  Map,
  List,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Card, EmptyState, SkeletonRows, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Modal";
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
import { useToast } from "@/components/ui/Toast";
import { providers } from "@/data/mock/providers";
import {
  buildOffers,
  sortOffers,
  applyQuickFilter,
  type Offer,
  type SearchParams,
  type SortKey,
  type QuickFilter,
} from "@/lib/marketplace";
import {
  classNames,
  formatGnf,
  formatGnfCompact,
  formatPct,
} from "@/lib/format";
import { ServicePair } from "@/lib/rails";

const quickFilters: { id: QuickFilter; fr: string; en: string }[] = [
  { id: "all", fr: "Tous", en: "All" },
  { id: "best_price", fr: "Meilleur prix", en: "Best price" },
  { id: "fastest", fr: "Plus rapide", en: "Fastest" },
  { id: "high_limits", fr: "Gros montants", en: "High limits" },
  { id: "open_now", fr: "Ouvert maintenant", en: "Open now" },
  { id: "verified_pro", fr: "Verified Pro", en: "Verified Pro" },
];

const sortOptions: { id: SortKey; fr: string; en: string }[] = [
  { id: "best", fr: "Meilleure correspondance", en: "Best match" },
  { id: "lowest_fee", fr: "Frais les plus bas", en: "Lowest fee" },
  { id: "highest_rating", fr: "Meilleure note", en: "Highest rating" },
  { id: "fastest", fr: "Réponse la plus rapide", en: "Fastest response" },
  { id: "largest_liquidity", fr: "Plus grande liquidité", en: "Largest liquidity" },
];

export function OffersTable({
  params,
  title,
  subtitle,
  compact,
}: {
  params: SearchParams;
  title: string;
  subtitle: string;
  /** Compact mode (homepage): fewer columns so the table fits beside both side panels. */
  compact?: boolean;
}) {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const [filter, setFilter] = useState<QuickFilter>("all");
  const [sort, setSort] = useState<SortKey>("best");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Offer | null>(null);

  const offers = useMemo(() => buildOffers(providers, params), [params]);
  const filtered = useMemo(
    () => sortOffers(applyQuickFilter(offers, filter), sort),
    [offers, filter, sort]
  );
  // Sponsored placements surface at the top but are ALWAYS labeled.
  const featured = filtered.filter((o) => o.provider.isFeatured);
  const organic = filtered.filter((o) => !o.provider.isFeatured);
  const rows = [...featured, ...organic];

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast(t("Offres actualisées", "Offers refreshed"), "info");
    }, 700);
  };

  return (
    <section aria-label={title}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-lg font-extrabold leading-tight">{title}</h1>
          <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(true)}>
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            {t("Filtres", "Filters")}
          </Button>
          <Button variant="secondary" size="sm" onClick={refresh}>
            <RefreshCw
              className={classNames("h-3.5 w-3.5", loading && "animate-spin")}
              aria-hidden
            />
            {t("Actualiser", "Refresh")}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setView(view === "list" ? "map" : "list")}
            aria-pressed={view === "map"}
          >
            {view === "list" ? (
              <Map className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <List className="h-3.5 w-3.5" aria-hidden />
            )}
            {view === "list" ? t("Carte", "Map") : t("Liste", "List")}
          </Button>
        </div>
      </div>

      {/* quick filter chips */}
      <div className="scroll-x mb-3 flex gap-2 pb-1" role="tablist" aria-label={t("Filtres rapides", "Quick filters")}>
        {quickFilters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={classNames("chip shrink-0", filter === f.id && "chip-active")}
          >
            {lang === "fr" ? f.fr : f.en}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <SkeletonRows rows={6} />
        ) : view === "map" ? (
          <MapPlaceholder count={rows.length} />
        ) : rows.length === 0 ? (
          <EmptyState
            title={t(
              "Aucun partenaire ne correspond à cette demande.",
              "No providers match this request."
            )}
            hints={[
              t("Élargissez le quartier", "Increase the radius / change district"),
              t("Modifiez le montant", "Change the amount"),
              t("Essayez un autre moyen de paiement", "Try another payment method"),
            ]}
            action={
              <Button
                variant="secondary"
                onClick={() =>
                  toast(
                    t(
                      "Demande envoyée à l'équipe Nimba — nous cherchons un partenaire pour vous.",
                      "Sent to the Nimba team — we are finding a provider for you."
                    )
                  )
                }
              >
                {t("Demander un matching manuel", "Ask Nimba to find a provider")}
              </Button>
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="scroll-x hidden md:block">
              <table
                className={classNames(
                  "w-full border-collapse text-sm",
                  compact ? "min-w-[480px]" : "min-w-[860px]"
                )}
              >
                <thead className="border-b border-line dark:border-night-line">
                  <tr>
                    <th className="th-cell">{t("Partenaire", "Provider")}</th>
                    {!compact && <th className="th-cell">{t("Méthode", "Method")}</th>}
                    <th className="th-cell">{t("Vous recevez", "You receive")}</th>
                    <th className="th-cell">{t("Frais", "Fee")}</th>
                    {!compact && (
                      <>
                        <th className="th-cell">{t("Limites", "Limits")}</th>
                        <th className="th-cell">{t("Disponible", "Available")}</th>
                        <th className="th-cell">{t("Délai", "Time")}</th>
                      </>
                    )}
                    <th className="th-cell" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line dark:divide-night-line">
                  {rows.map((o) => (
                    <OfferRowDesktop
                      key={`${o.provider.id}-${o.service.id}`}
                      offer={o}
                      onSelect={() => setSelected(o)}
                      compact={compact}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <ul className="divide-y divide-line md:hidden dark:divide-night-line">
              {rows.map((o) => (
                <OfferCardMobile
                  key={`${o.provider.id}-${o.service.id}`}
                  offer={o}
                  onSelect={() => setSelected(o)}
                />
              ))}
            </ul>
          </>
        )}
      </Card>

      {/* Sort / filter drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={t("Trier et filtrer", "Sort & filter")}
      >
        <div className="space-y-5">
          <fieldset>
            <legend className="label-xs">{t("Trier par", "Sort by")}</legend>
            <div className="space-y-1.5">
              {sortOptions.map((s) => (
                <label
                  key={s.id}
                  className={classNames(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium",
                    sort === s.id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/50"
                      : "border-line dark:border-night-line"
                  )}
                >
                  <input
                    type="radio"
                    name="sort"
                    className="accent-brand-500"
                    checked={sort === s.id}
                    onChange={() => setSort(s.id)}
                  />
                  {lang === "fr" ? s.fr : s.en}
                </label>
              ))}
            </div>
          </fieldset>
          <p className="rounded-lg bg-surface-sunken p-3 text-2xs leading-relaxed text-ink-muted dark:bg-night-raised dark:text-[#8FA79C]">
            {t(
              "Le classement « Meilleure correspondance » combine frais, note, temps de réponse, liquidité et historique. Les emplacements sponsorisés sont toujours identifiés et ne modifient jamais ce classement.",
              "“Best match” ranking combines fee, rating, response time, liquidity and history. Sponsored placements are always labeled and never alter this ranking."
            )}
          </p>
          <Button full onClick={() => setDrawerOpen(false)}>
            {t("Appliquer", "Apply")}
          </Button>
        </div>
      </Drawer>

      {selected && (
        <CreateRequestModal
          offer={selected}
          amountGnf={params.amountGnf}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}

function OfferRowDesktop({
  offer,
  onSelect,
  compact,
}: {
  offer: Offer;
  onSelect: () => void;
  compact?: boolean;
}) {
  const { lang, t } = useI18n();
  const { provider: p, service: s } = offer;
  return (
    <tr className="table-row-hover">
      <td className="td-cell">
        <div className="flex items-center gap-2.5">
          <Avatar initials={p.logoInitials} hue={p.logoHue} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/providers/${p.slug}`}
                className="truncate text-[13px] font-bold hover:text-brand-600"
              >
                {p.name}
              </Link>
              <TierBadge tier={p.subscriptionTier} />
              {p.isFeatured && <FeaturedBadge />}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <VerificationBadge type={p.type} level={p.verification.level} compact />
              <span className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                <Rating value={p.rating} compact /> · {p.completedDeals.toLocaleString("fr-FR")}{" "}
                {t("transactions", "deals")}
              </span>
            </div>
            {compact && (
              <p className="mt-1 flex items-center gap-1.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
                <ServicePair from={s.from} to={s.to} lang={lang} />
                <span>· {p.locations[0].district}</span>
              </p>
            )}
          </div>
        </div>
      </td>
      {!compact && (
        <td className="td-cell">
          <ServicePair from={s.from} to={s.to} lang={lang} />
          <p className="mt-0.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
            {p.locations[0].district}
          </p>
        </td>
      )}
      <td className="td-cell">
        <span className="text-[13px] font-extrabold tabular-nums text-brand-700 dark:text-brand-300">
          {formatGnf(offer.receiveGnf)}
        </span>
      </td>
      <td className="td-cell">
        <span className="font-semibold tabular-nums">{formatPct(s.feePct)}</span>
        {compact && (
          <p className="mt-0.5 whitespace-nowrap text-2xs text-ink-muted dark:text-[#8FA79C]">
            {s.estimatedMinutes[0]}–{s.estimatedMinutes[1]} min
          </p>
        )}
      </td>
      {!compact && (
        <>
          <td className="td-cell text-xs tabular-nums text-ink-secondary dark:text-[#B7C9C0]">
            {formatGnfCompact(s.minGnf, lang)} – {formatGnfCompact(s.maxGnf, lang)}
          </td>
          <td className="td-cell">
            <LiquidityIndicator
              availableGnf={s.availableGnf}
              label={formatGnfCompact(s.availableGnf, lang)}
            />
          </td>
          <td className="td-cell">
            <span className="inline-flex items-center gap-1 text-xs text-ink-secondary dark:text-[#B7C9C0]">
              <Clock className="h-3 w-3 text-ink-faint" aria-hidden />
              {s.estimatedMinutes[0]}–{s.estimatedMinutes[1]} min
            </span>
          </td>
        </>
      )}
      <td className="td-cell text-right">
        <Button size="sm" onClick={onSelect}>
          {compact ? t("Choisir", "Select") : t("Sélectionner", "Select")}
        </Button>
      </td>
    </tr>
  );
}

function OfferCardMobile({
  offer,
  onSelect,
}: {
  offer: Offer;
  onSelect: () => void;
}) {
  const { lang, t } = useI18n();
  const { provider: p, service: s } = offer;
  return (
    <li className="p-4">
      <div className="flex items-start gap-3">
        <Avatar initials={p.logoInitials} hue={p.logoHue} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/providers/${p.slug}`}
              className="truncate text-[13px] font-bold"
            >
              {p.name}
            </Link>
            <TierBadge tier={p.subscriptionTier} />
            {p.isFeatured && <FeaturedBadge />}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <VerificationBadge type={p.type} level={p.verification.level} compact />
            <Rating value={p.rating} compact />
            <StatusBadge status={p.status} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div>
              <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                {t("Vous recevez", "You receive")} · {t("frais", "fee")}{" "}
                {formatPct(s.feePct)}
              </p>
              <p className="text-sm font-extrabold tabular-nums text-brand-700 dark:text-brand-300">
                {formatGnf(offer.receiveGnf)}
              </p>
              <p className="mt-0.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
                {p.locations[0].district} · {s.estimatedMinutes[0]}–
                {s.estimatedMinutes[1]} min
              </p>
            </div>
            <Button size="sm" onClick={onSelect}>
              {t("Choisir", "Select")}
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

function MapPlaceholder({ count }: { count: number }) {
  const { t } = useI18n();
  return (
    <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-b-card bg-brand-50 dark:bg-night-raised">
      {/* stylized map grid */}
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
        <defs>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path
              d="M 36 0 L 0 0 0 36"
              fill="none"
              stroke="#008A58"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {[
        { top: "28%", left: "32%" },
        { top: "52%", left: "48%" },
        { top: "38%", left: "62%" },
        { top: "64%", left: "30%" },
      ]
        .slice(0, Math.max(1, Math.min(4, count)))
        .map((pos, i) => (
          <span
            key={i}
            className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-2xs font-bold text-white shadow-raised"
            style={pos}
          >
            {i + 1}
          </span>
        ))}
      <div className="relative rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold text-ink-secondary shadow-card dark:bg-night-card/90 dark:text-[#B7C9C0]">
        {t(
          `Aperçu carte — ${count} partenaire(s) à Conakry (prototype)`,
          `Map preview — ${count} provider(s) in Conakry (prototype)`
        )}
      </div>
    </div>
  );
}
