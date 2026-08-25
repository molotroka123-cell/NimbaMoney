"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign, MapPin, Navigation, Zap } from "lucide-react";
import { Card, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill, StatusBadge, Rating } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { providers } from "@/data/mock/providers";
import { cashPoints, type CashPoint } from "@/data/mock/cashpoints";
import { formatGnfCompact, classNames } from "@/lib/format";
import type { Provider } from "@/types";

const DISTRICTS = ["Kaloum", "Dixinn", "Matam", "Ratoma", "Matoto"] as const;

interface MapPoint {
  point: CashPoint;
  provider: Provider;
  district: string;
}

/** Status → pin ring color (open = green, busy/closing soon = amber, offline = gray). */
const ringClass: Record<Provider["status"], string> = {
  open: "stroke-emerald-500",
  closing_soon: "stroke-amber-500",
  offline: "stroke-gray-400 dark:stroke-gray-500",
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors max-sm:min-h-[38px]",
        active
          ? "border-mkt-500 bg-mkt-500 text-white shadow-sm"
          : "border-line bg-white text-ink-secondary hover:border-mkt-400 hover:text-mkt-600 dark:border-night-lineStrong dark:bg-night-raised dark:text-[#CBDDD4] dark:hover:text-mkt-300"
      )}
    >
      {children}
    </button>
  );
}

/** Tiny white store glyph drawn at the pin center (local coords). */
function StoreGlyph() {
  return (
    <g aria-hidden>
      {/* awning */}
      <path d="M -4.6 -3.4 L 4.6 -3.4 L 5.6 -0.9 L -5.6 -0.9 Z" className="fill-white" />
      {/* body */}
      <rect x={-4.2} y={-0.9} width={8.4} height={5} rx={0.6} className="fill-white" />
      {/* door */}
      <rect x={-1.1} y={1.1} width={2.2} height={3} rx={0.5} className="fill-mkt-600" />
    </g>
  );
}

export default function CashPointsMapPage() {
  const { lang, t } = useI18n();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openNow, setOpenNow] = useState(false);
  const [usdOnly, setUsdOnly] = useState(false);
  const [district, setDistrict] = useState<string>("all");
  const detailRef = useRef<HTMLDivElement>(null);

  const allPoints: MapPoint[] = useMemo(
    () =>
      cashPoints
        .map((point) => {
          const provider = providers.find((p) => p.id === point.providerId);
          if (!provider) return null;
          return { point, provider, district: provider.locations[0]?.district ?? "Conakry" };
        })
        .filter((mp): mp is MapPoint => mp !== null),
    []
  );

  const filtered = allPoints.filter(
    (mp) =>
      (!openNow || mp.provider.status === "open") &&
      (!usdOnly || mp.point.hasUsdCash) &&
      (district === "all" || mp.district === district)
  );

  // Selection is only shown while the selected pin passes the active filters.
  const selected = filtered.find((mp) => mp.provider.id === selectedId) ?? null;

  const select = (id: string, scroll: boolean) => {
    setSelectedId(id);
    if (scroll && typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      // Mobile: the detail card sits below the map — bring it into view.
      window.setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  };

  return (
    <div className="space-y-4 p-4 lg:p-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-mkt-600 hover:text-mkt-700 dark:text-mkt-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t("Retour au Marketplace", "Back to Marketplace")}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="flex items-center gap-2 text-xl font-extrabold">
            <MapPin className="h-5 w-5 text-mkt-500" aria-hidden />
            {t("Points cash à Conakry", "Cash points in Conakry")}
          </h1>
          <Pill tone="blue">
            {t(`${allPoints.length} points vérifiés`, `${allPoints.length} verified points`)}
          </Pill>
        </div>
        <p className="mt-0.5 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Trouvez un partenaire vérifié près de chez vous — dépôt et retrait d'espèces en GNF et en USD.",
            "Find a verified partner nearby — cash-in and cash-out in GNF and USD."
          )}
        </p>
      </div>

      {/* ── Filters ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={openNow} onClick={() => setOpenNow((v) => !v)}>
          <span
            className={classNames(
              "h-1.5 w-1.5 rounded-full",
              openNow ? "bg-white" : "bg-emerald-500"
            )}
            aria-hidden
          />
          {t("Ouvert maintenant", "Open now")}
        </Chip>
        <Chip active={usdOnly} onClick={() => setUsdOnly((v) => !v)}>
          <DollarSign className="h-3.5 w-3.5" aria-hidden />
          {t("Cash USD", "USD cash")}
        </Chip>
        <label className="inline-flex items-center gap-2 text-xs font-semibold text-ink-secondary dark:text-[#CBDDD4]">
          <span className="sr-only">{t("Commune", "District")}</span>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-secondary outline-none focus:border-mkt-400 dark:border-night-lineStrong dark:bg-night-raised dark:text-[#CBDDD4] max-sm:min-h-[38px]"
            aria-label={t("Filtrer par commune", "Filter by district")}
          >
            <option value="all">{t("Toutes les communes", "All districts")}</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <span className="text-xs text-ink-muted dark:text-[#8FA79C]">
          {t(
            `${filtered.length} point${filtered.length > 1 ? "s" : ""} affiché${filtered.length > 1 ? "s" : ""}`,
            `${filtered.length} point${filtered.length > 1 ? "s" : ""} shown`
          )}
        </span>
      </div>

      {/* ── Map + detail ───────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Map card */}
        <Card className="overflow-hidden">
          <svg
            viewBox="0 0 800 520"
            className="h-auto w-full"
            role="group"
            aria-label={t(
              "Carte schématique des points cash à Conakry",
              "Schematic map of cash points in Conakry"
            )}
          >
            <defs>
              <clipPath id="peninsula-clip">
                <path d="M 105 435 C 140 393, 200 348, 280 313 C 380 273, 500 243, 620 227 C 690 218, 760 211, 800 208 L 800 462 C 720 459, 620 453, 520 452 C 420 451, 315 452, 240 468 C 188 479, 138 466, 105 435 Z" />
              </clipPath>
            </defs>

            {/* Water */}
            <rect x="0" y="0" width="800" height="520" className="fill-mkt-100/70 dark:fill-navy-950" />

            {/* Îles de Loos */}
            <g aria-hidden>
              <ellipse cx="58" cy="468" rx="26" ry="12" className="fill-surface-sunken stroke-mkt-300/70 dark:fill-night-raised dark:stroke-navy-700" strokeWidth="1.5" />
              <ellipse cx="108" cy="496" rx="18" ry="9" className="fill-surface-sunken stroke-mkt-300/70 dark:fill-night-raised dark:stroke-navy-700" strokeWidth="1.5" />
              <text x="60" y="445" textAnchor="middle" className="fill-ink-faint dark:fill-[#5F7A6E]" fontSize="9" fontStyle="italic">
                {t("Îles de Loos", "Loos Islands")}
              </text>
            </g>

            {/* Peninsula landmass */}
            <path
              d="M 105 435 C 140 393, 200 348, 280 313 C 380 273, 500 243, 620 227 C 690 218, 760 211, 800 208 L 800 462 C 720 459, 620 453, 520 452 C 420 451, 315 452, 240 468 C 188 479, 138 466, 105 435 Z"
              className="fill-surface-sunken stroke-mkt-300 dark:fill-night-raised dark:stroke-navy-700"
              strokeWidth="2"
            />

            {/* District areas (clipped to the peninsula) */}
            <g clipPath="url(#peninsula-clip)" aria-hidden>
              <rect x="0" y="200" width="232" height="320" className="fill-mkt-500/10" />
              <rect x="232" y="150" width="150" height="235" className="fill-emerald-500/10" />
              <rect x="232" y="385" width="150" height="135" className="fill-amber-500/10" />
              <rect x="382" y="150" width="418" height="188" className="fill-violet-500/10" />
              <rect x="382" y="338" width="418" height="182" className="fill-rose-500/10" />
              {/* soft district boundaries */}
              <path
                d="M 232 200 L 232 520 M 382 150 L 382 520 M 232 385 L 382 385 M 382 338 L 800 338"
                className="stroke-ink-faint/40 dark:stroke-night-lineStrong"
                strokeWidth="1"
                strokeDasharray="4 4"
                fill="none"
              />
            </g>

            {/* District labels */}
            <g className="fill-ink-muted dark:fill-[#8FA79C]" fontSize="10" fontWeight="700" letterSpacing="1.5" aria-hidden>
              <text x="155" y="460">KALOUM</text>
              <text x="262" y="320">DIXINN</text>
              <text x="300" y="438">MATAM</text>
              <text x="452" y="262">RATOMA</text>
              <text x="618" y="438">MATOTO</text>
            </g>

            {/* Main road — flavor only */}
            <g aria-hidden>
              <polyline
                points="128,432 210,402 310,378 430,348 560,325 700,308 800,300"
                fill="none"
                className="stroke-amber-400/80 dark:stroke-amber-500/50"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x="420" y="368" className="fill-ink-faint dark:fill-[#5F7A6E]" fontSize="9" fontStyle="italic" transform="rotate(-9 420 368)">
                {t("Autoroute Fidel Castro", "Fidel Castro Highway")}
              </text>
            </g>

            {/* North arrow + schema note */}
            <g aria-hidden>
              <line x1="758" y1="58" x2="758" y2="26" className="stroke-ink-muted dark:stroke-[#8FA79C]" strokeWidth="2" strokeLinecap="round" />
              <path d="M 758 20 L 752 32 L 764 32 Z" className="fill-ink-muted dark:fill-[#8FA79C]" />
              <text x="758" y="74" textAnchor="middle" className="fill-ink-muted dark:fill-[#8FA79C]" fontSize="11" fontWeight="700">
                N
              </text>
              <text x="792" y="508" textAnchor="end" className="fill-ink-faint dark:fill-[#5F7A6E]" fontSize="9" fontStyle="italic">
                {t("Schéma (démo) — positions indicatives", "Schema (demo) — indicative positions")}
              </text>
            </g>

            {/* Provider pins */}
            {filtered.map(({ point, provider, district: d }) => {
              const isSel = provider.id === selected?.provider.id;
              return (
                <g
                  key={provider.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${provider.name} — ${d}`}
                  aria-pressed={isSel}
                  onClick={() => select(provider.id, false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      select(provider.id, false);
                    }
                  }}
                  transform={`translate(${point.x} ${point.y})${isSel ? " scale(1.3)" : ""}`}
                  className="cursor-pointer outline-none"
                >
                  {isSel && (
                    <circle
                      r={17}
                      className="animate-ping fill-mkt-500/40"
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      aria-hidden
                    />
                  )}
                  <circle
                    r={12}
                    strokeWidth={3}
                    className={classNames(
                      "fill-white dark:fill-night-card",
                      ringClass[provider.status]
                    )}
                  />
                  <circle
                    r={8.5}
                    className={provider.status === "offline" ? "fill-gray-400 dark:fill-gray-500" : "fill-mkt-500"}
                  />
                  <StoreGlyph />
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line px-4 py-2.5 text-2xs text-ink-muted dark:border-night-line dark:text-[#8FA79C]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-emerald-500 bg-white dark:bg-night-card" aria-hidden />
              {t("Ouvert", "Open")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-amber-500 bg-white dark:bg-night-card" aria-hidden />
              {t("Occupé / ferme bientôt", "Busy / closing soon")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-gray-400 bg-white dark:bg-night-card" aria-hidden />
              {t("Hors ligne", "Offline")}
            </span>
          </div>
        </Card>

        {/* Detail card */}
        <div ref={detailRef} className="scroll-mt-4">
          {selected ? (
            <Card className="card-pad space-y-3">
              <div className="flex items-start gap-3">
                <Avatar initials={selected.provider.logoInitials} hue={selected.provider.logoHue} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{selected.provider.name}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <Rating value={selected.provider.rating} count={selected.provider.reviewCount} compact />
                    <StatusBadge status={selected.provider.status} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-line pt-3 text-xs dark:border-night-line">
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-mkt-500" aria-hidden />
                  <span className="font-semibold">{selected.district}</span>
                  <span className="text-ink-muted dark:text-[#8FA79C]">
                    · {t("Commune de", "Commune of")} {selected.provider.locations[0]?.commune ?? selected.district}
                  </span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-mkt-500" aria-hidden />
                  <span className="tabular-nums">{selected.point.hours}</span>
                  {selected.provider.status === "open" && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                      {t("Ouvert maintenant", "Open now")}
                    </span>
                  )}
                </p>
                <p className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 shrink-0 text-mkt-500" aria-hidden />
                  {t("Répond en", "Responds in")}{" "}
                  <span className="font-semibold tabular-nums">~{selected.provider.responseMinutes} min</span>
                </p>
                <div className="flex items-center justify-between rounded-lg bg-surface-sunken px-3 py-2 dark:bg-night-raised">
                  <span className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                    {t("Liquidité", "Liquidity")}
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    {formatGnfCompact(selected.provider.liquidity.totalAvailableGnf, lang)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <Pill tone="green">{t("Cash GNF", "GNF cash")}</Pill>
                  {selected.point.hasUsdCash && <Pill tone="blue">{t("Cash USD", "USD cash")}</Pill>}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Link href={`/marketplace/providers/${selected.provider.slug}`}>
                  <Button variant="blueSecondary" size="sm" full>
                    {t("Voir le profil", "View profile")}
                  </Button>
                </Link>
                <a
                  href={`https://maps.google.com/?q=Conakry+${encodeURIComponent(selected.district)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="blue" size="sm" full>
                    <Navigation className="h-3.5 w-3.5" aria-hidden />
                    {t("Itinéraire", "Directions")}
                  </Button>
                </a>
              </div>
            </Card>
          ) : (
            <Card className="card-pad">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mkt-50 dark:bg-navy-800/60">
                  <MapPin className="h-6 w-6 text-mkt-500" aria-hidden />
                </div>
                <p className="text-sm font-semibold">
                  {t("Touchez un point sur la carte", "Tap a point on the map")}
                </p>
                <p className="mt-1 text-xs text-ink-muted dark:text-[#8FA79C]">
                  {t(
                    "Sélectionnez un point cash pour voir ses horaires, sa liquidité et l'itinéraire.",
                    "Select a cash point to see its hours, liquidity and directions."
                  )}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ── Compact list ───────────────────────────────────────────── */}
      <Card>
        <div className="border-b border-line px-4 py-3 dark:border-night-line">
          <h2 className="text-base font-bold leading-tight">{t("Tous les points", "All points")}</h2>
          <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Liste des points cash correspondant aux filtres.",
              "Cash points matching the current filters."
            )}
          </p>
        </div>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Aucun point ne correspond aux filtres. Élargissez votre recherche.",
              "No point matches the filters. Widen your search."
            )}
          </p>
        ) : (
          <ul className="divide-y divide-line dark:divide-night-line">
            {filtered.map(({ point, provider, district: d }) => {
              const isSel = provider.id === selected?.provider.id;
              return (
                <li
                  key={provider.id}
                  className={classNames(
                    "flex items-center gap-3 px-4 py-2.5",
                    isSel && "bg-mkt-50/60 dark:bg-navy-800/40"
                  )}
                >
                  <Avatar initials={provider.logoInitials} hue={provider.logoHue} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{provider.name}</p>
                    <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">{d} · {point.hours}</p>
                  </div>
                  <div className="hidden items-center gap-1.5 sm:flex">
                    {point.hasUsdCash && <Pill tone="blue">USD</Pill>}
                    <StatusBadge status={provider.status} />
                  </div>
                  <Button variant="blueSecondary" size="xs" onClick={() => select(provider.id, true)}>
                    {t("Voir", "View")}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
