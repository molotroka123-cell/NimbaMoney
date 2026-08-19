"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  Bookmark,
  Share2,
  Flag,
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  CalendarCheck,
} from "lucide-react";
import { Card, Avatar, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import {
  VerificationBadge,
  TierBadge,
  FeaturedBadge,
  StatusBadge,
  Rating,
  Pill,
} from "@/components/ui/Badge";
import { CreateRequestModal } from "@/components/requests/CreateRequestModal";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { getProvider } from "@/data/mock/providers";
import { reviewsFor } from "@/data/mock/reviews";
import {
  classNames,
  formatGnf,
  formatGnfCompact,
  formatPct,
} from "@/lib/format";
import { ServicePair } from "@/lib/rails";
import type { ProviderService, Review } from "@/types";
import type { Offer } from "@/lib/marketplace";

export default function ProviderProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const provider = getProvider(slug);
  const [saved, setSaved] = useState(false);
  const [service, setService] = useState<ProviderService | null>(null);
  const [reviewTab, setReviewTab] = useState<"all" | "positive" | "neutral" | "dispute">("all");

  const allReviews = useMemo(
    () => (provider ? reviewsFor(provider.id) : []),
    [provider]
  );

  if (!provider) return notFound();
  const p = provider;
  const v = p.verification;

  const reviews = allReviews.filter((r) =>
    reviewTab === "all" ? true : r.sentiment === reviewTab
  );

  const offer: Offer | null = service
    ? {
        provider: p,
        service,
        feeGnf: 0,
        receiveGnf: 0,
        score: 0,
      }
    : null;

  const verifChecks: { label: string; ok: boolean }[] = [
    { label: t("Identité du propriétaire", "Owner identity"), ok: v.ownerIdentity },
    { label: t("Registre de commerce", "Business registration"), ok: v.businessRegistration },
    { label: t("Adresse du business", "Business address"), ok: v.businessAddress },
    { label: t("Téléphone", "Phone"), ok: v.phone },
    { label: t("Lieu d'exploitation", "Operating location"), ok: v.operatingLocation },
    { label: t("Compte de règlement", "Settlement account ownership"), ok: v.settlementAccount },
    { label: t("Revue conformité", "Compliance review"), ok: v.complianceReview },
    ...(v.securityDeposit !== undefined
      ? [{ label: t("Dépôt de garantie", "Security deposit"), ok: !!v.securityDeposit }]
      : []),
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      {/* breadcrumbs */}
      <nav className="text-2xs text-ink-muted dark:text-[#8FA79C]" aria-label="Breadcrumb">
        <Link href="/providers" className="hover:text-brand-600">
          {t("Partenaires", "Providers")}
        </Link>{" "}
        / <span className="font-semibold text-ink dark:text-white">{p.name}</span>
      </nav>

      {/* profile header */}
      <Card className="card-pad">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar initials={p.logoInitials} hue={p.logoHue} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold">{p.name}</h1>
              <VerificationBadge type={p.type} level={v.level} />
              <TierBadge tier={p.subscriptionTier} />
              {p.isFeatured && <FeaturedBadge />}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-secondary dark:text-[#B7C9C0]">
              <Rating value={p.rating} count={p.reviewCount} />
              <span>
                {p.completedDeals.toLocaleString("fr-FR")}{" "}
                {t("transactions", "deals")}
              </span>
              <span>
                {p.successRate}% {t("de réussite", "success rate")}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarCheck className="h-3.5 w-3.5 text-brand-500" aria-hidden />
                {t("Membre depuis", "Joined")}{" "}
                {new Date(p.joinedAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            {p.about && (
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
                {p.about}
              </p>
            )}
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <Button
              onClick={() => setService(p.services[0])}
              disabled={p.status === "offline"}
            >
              {t("Demander de la liquidité", "Request liquidity")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSaved(!saved);
                toast(
                  saved
                    ? t("Retiré des favoris", "Removed from saved")
                    : t("Partenaire enregistré", "Provider saved")
                );
              }}
              aria-pressed={saved}
            >
              <Bookmark
                className={classNames("h-4 w-4", saved && "fill-brand-500 text-brand-500")}
                aria-hidden
              />
              {saved ? t("Enregistré", "Saved") : t("Enregistrer", "Save")}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast(t("Lien du profil copié", "Profile link copied"), "info")
              }
            >
              <Share2 className="h-4 w-4" aria-hidden />
              {t("Partager", "Share")}
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                toast(
                  t(
                    "Signalement envoyé à l'équipe conformité.",
                    "Report sent to the compliance team."
                  ),
                  "warn"
                )
              }
            >
              <Flag className="h-4 w-4" aria-hidden />
              {t("Signaler", "Report")}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {/* services */}
          <Card className="card-pad">
            <h2 className="text-sm font-bold">{t("Services", "Services")}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {p.services.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-line p-3.5 dark:border-night-line"
                >
                  <div className="flex items-center justify-between gap-2">
                    <ServicePair from={s.from} to={s.to} lang={lang} />
                    <Pill tone="green">{formatPct(s.feePct)}</Pill>
                  </div>
                  <dl className="mt-2.5 grid grid-cols-3 gap-2 text-2xs">
                    <div>
                      <dt className="text-ink-muted dark:text-[#8FA79C]">
                        {t("Limites", "Limits")}
                      </dt>
                      <dd className="mt-0.5 font-semibold tabular-nums">
                        {formatGnfCompact(s.minGnf, lang)}–{formatGnfCompact(s.maxGnf, lang)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-muted dark:text-[#8FA79C]">
                        {t("Disponible", "Available")}
                      </dt>
                      <dd className="mt-0.5 font-semibold tabular-nums">
                        {formatGnfCompact(s.availableGnf, lang)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-muted dark:text-[#8FA79C]">
                        {t("Délai", "Time")}
                      </dt>
                      <dd className="mt-0.5 font-semibold">
                        {s.estimatedMinutes[0]}–{s.estimatedMinutes[1]} min
                      </dd>
                    </div>
                  </dl>
                  <Button
                    size="sm"
                    variant="secondary"
                    full
                    className="mt-3"
                    onClick={() => setService(s)}
                    disabled={p.status === "offline"}
                  >
                    {t("Demander ce service", "Request this service")}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* locations */}
          <Card className="card-pad">
            <h2 className="text-sm font-bold">{t("Lieux", "Locations")}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {p.locations.map((l) => (
                <div
                  key={l.id}
                  className="overflow-hidden rounded-xl border border-line dark:border-night-line"
                >
                  {/* map preview */}
                  <div className="relative h-24 bg-brand-50 dark:bg-night-raised">
                    <svg className="absolute inset-0 h-full w-full opacity-50" aria-hidden>
                      <defs>
                        <pattern id={`g-${l.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
                          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#008A58" strokeOpacity="0.2" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#g-${l.id})`} />
                    </svg>
                    <MapPin
                      className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-full text-brand-600"
                      aria-hidden
                    />
                    <div className="absolute right-2 top-2">
                      <StatusBadge status={l.status} />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold">
                      {l.district} · {l.commune}, {l.city}
                    </p>
                    <p className="mt-0.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
                      {l.address}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-2xs text-ink-secondary dark:text-[#B7C9C0]">
                      <Clock className="h-3 w-3" aria-hidden />
                      {l.openingHours}
                    </p>
                    <Button
                      size="xs"
                      variant="secondary"
                      className="mt-2"
                      onClick={() =>
                        toast(
                          t("Ouverture de l'itinéraire (prototype)", "Opening directions (prototype)"),
                          "info"
                        )
                      }
                    >
                      <Navigation className="h-3 w-3" aria-hidden />
                      {t("Itinéraire", "Get directions")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* reviews */}
          <Card className="card-pad">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold">
                {t("Avis", "Reviews")}{" "}
                <span className="font-normal text-ink-muted dark:text-[#8FA79C]">
                  ({allReviews.length})
                </span>
              </h2>
              <div className="flex gap-1.5" role="tablist" aria-label={t("Filtrer les avis", "Filter reviews")}>
                {(
                  [
                    ["all", t("Tous", "All")],
                    ["positive", t("Positifs", "Positive")],
                    ["neutral", t("Neutres", "Neutral")],
                    ["dispute", t("Litiges", "Disputes")],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={reviewTab === id}
                    onClick={() => setReviewTab(id)}
                    className={classNames("chip", reviewTab === id && "chip-active")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {reviews.length === 0 ? (
              <EmptyState
                title={t("Aucun avis dans cette catégorie.", "No reviews in this category.")}
              />
            ) : (
              <ul className="mt-3 divide-y divide-line dark:divide-night-line">
                {reviews.map((r) => (
                  <ReviewItem key={r.id} review={r} />
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* right: trust panel */}
        <div className="space-y-4">
          <Card className="card-pad">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-bold">
              <BadgeCheck className="h-4 w-4 text-brand-500" aria-hidden />
              {t("Vérification", "Verification")}
            </h2>
            <ul className="mt-3 space-y-2">
              {verifChecks.map((c) => (
                <li key={c.label} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-ink-secondary dark:text-[#B7C9C0]">{c.label}</span>
                  {c.ok ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" aria-label={t("vérifié", "verified")} />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-ink-faint" aria-label={t("non vérifié", "not verified")} />
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-lg bg-surface-sunken px-3 py-2 text-2xs text-ink-muted dark:bg-night-raised dark:text-[#8FA79C]">
              {t("Dernière revue :", "Last reviewed:")}{" "}
              <span className="font-semibold text-ink dark:text-white">
                {new Date(v.lastReviewedAt).toLocaleDateString(
                  lang === "fr" ? "fr-FR" : "en-GB",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </span>
            </p>
            <Link
              href="/verification"
              className="mt-2 inline-block text-2xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
            >
              {t("Comment Nimba vérifie les partenaires →", "How Nimba verifies providers →")}
            </Link>
          </Card>

          <Card className="card-pad">
            <h2 className="text-sm font-bold">{t("Chiffres clés", "Key numbers")}</h2>
            <dl className="mt-3 space-y-2.5 text-xs">
              {[
                [t("Liquidité disponible", "Available liquidity"), formatGnfCompact(p.liquidity.totalAvailableGnf, lang)],
                [t("Limites", "Limits"), `${formatGnfCompact(p.limits.minGnf, lang)} – ${formatGnfCompact(p.limits.maxGnf, lang)}`],
                [t("Temps de réponse", "Response time"), `~${p.responseMinutes} min`],
                [t("Taux de réussite", "Success rate"), `${p.successRate}%`],
                [t("Mise à jour liquidité", "Liquidity updated"), p.liquidity.updatedAt],
              ].map(([k, val]) => (
                <div key={k as string} className="flex items-center justify-between gap-2">
                  <dt className="text-ink-muted dark:text-[#8FA79C]">{k}</dt>
                  <dd className="font-bold tabular-nums">{val}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      {offer && (
        <CreateRequestModal
          offer={offer}
          amountGnf={Math.min(10_000_000, offer.service.maxGnf)}
          onClose={() => setService(null)}
        />
      )}
    </div>
  );
}

function ReviewItem({ review: r }: { review: Review }) {
  const { t } = useI18n();
  return (
    <li className="py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Rating value={r.rating} compact />
          <span className="text-xs font-semibold">{r.author}</span>
        </div>
        <span className="text-2xs text-ink-muted dark:text-[#8FA79C]">{r.date}</span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed">{r.text}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-2xs text-ink-muted dark:text-[#8FA79C]">
        <span>
          {r.dealSummary} · {formatGnf(r.amountGnf)}
        </span>
        {r.verifiedDeal && (
          <Pill tone="green">{t("Transaction vérifiée", "Verified deal")}</Pill>
        )}
        {r.sentiment === "dispute" && (
          <Pill tone="red">{t("Litige", "Dispute")}</Pill>
        )}
      </div>
    </li>
  );
}
