"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  RefreshCw,
  SlidersHorizontal,
  Search,
  Zap,
  Star,
  Check,
  MessageCircle,
  ShieldCheck,
  BadgeCheck,
  Award,
  Info,
  Scale,
  X,
} from "lucide-react";
import { Card, Avatar, EmptyState, SkeletonRows, BarRow } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Modal";
import { Pill, VerificationBadge, TierBadge, FeaturedBadge, StatusBadge, Rating } from "@/components/ui/Badge";
import { SwitchBanner } from "@/components/layout/SwitchBanner";
import { CreateRequestModal } from "@/components/requests/CreateRequestModal";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { providers } from "@/data/mock/providers";
import {
  classNames,
  formatAmountInput,
  formatGnfCompact,
  parseAmount,
} from "@/lib/format";
import { districts, paymentRails, supportWhatsApp, type RailId } from "@/config/product";
import type { Provider } from "@/types";
import type { Offer } from "@/lib/marketplace";

type QF = "all" | "top_rated" | "high_liquidity" | "fast_response" | "open_now" | "verified_pro";

/** Transparent composite ranking (weights shown in the right panel). */
function rank(p: Provider): number {
  return (
    (p.rating - 4) * 40 +
    Math.min(1, p.liquidity.totalAvailableGnf / 400_000_000) * 25 +
    Math.max(0, 1 - p.responseMinutes / 30) * 20 +
    (p.verification.level === "enhanced" ? 15 : p.verification.level === "location" ? 10 : 6)
  );
}

function liquidityTier(gnf: number, t: (a: string, b: string) => string) {
  if (gnf >= 300_000_000) return { label: t("Très élevée", "Very High"), bars: 5 };
  if (gnf >= 150_000_000) return { label: t("Élevée", "High"), bars: 4 };
  if (gnf >= 60_000_000) return { label: t("Moyenne+", "Medium-High"), bars: 3 };
  return { label: t("Moyenne", "Medium"), bars: 2 };
}

function MarketplaceInner() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const sp = useSearchParams();

  const [amount, setAmount] = useState("10 000 000");
  const [receive, setReceive] = useState<RailId>("cash");
  const [district, setDistrict] = useState("Tous les quartiers");
  const [ptype, setPtype] = useState<"all" | "business">("all");
  const [qf, setQf] = useState<QF>((sp.get("filter") as QF) || "all");
  const [loading, setLoading] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState<Offer | null>(null);
  const [visible, setVisible] = useState(8);
  const [cmp, setCmp] = useState<string[]>([]);

  // the sidebar quick filters navigate to /marketplace?filter=… — keep state
  // in sync when only the query string changes (the component doesn't remount)
  useEffect(() => {
    const f = sp.get("filter") as QF | null;
    if (f) setQf(f);
  }, [sp]);

  const amountGnf = parseAmount(amount) || 10_000_000;

  const toggleCmp = (id: string) => {
    if (!cmp.includes(id) && cmp.length >= 3) {
      toast(t("Maximum 3 partenaires à comparer.", "Compare up to 3 providers."), "info");
      return;
    }
    setCmp((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const rows = useMemo(() => {
    let xs = providers.filter((p) => {
      const isBusiness = p.type === "business";
      const hasService = p.services.some((s) => s.to === receive);
      const inDistrict =
        district === "Tous les quartiers" || p.locations.some((l) => l.district === district);
      const typeOk = ptype === "all" || p.type === ptype;
      const inLimits = amountGnf >= p.limits.minGnf && amountGnf <= p.limits.maxGnf;
      return isBusiness && hasService && inDistrict && typeOk && inLimits;
    });
    switch (qf) {
      case "top_rated":
        xs = [...xs].sort((a, b) => b.rating - a.rating);
        break;
      case "high_liquidity":
        xs = [...xs].sort((a, b) => b.liquidity.totalAvailableGnf - a.liquidity.totalAvailableGnf);
        break;
      case "fast_response":
        xs = [...xs].sort((a, b) => a.responseMinutes - b.responseMinutes);
        break;
      case "open_now":
        xs = xs.filter((p) => p.status === "open");
        break;
      case "verified_pro":
        xs = xs.filter((p) => p.verification.level === "enhanced");
        break;
      default:
        // transparent composite ranking (see right panel weights)
        xs = [...xs].sort((a, b) => rank(b) - rank(a));
    }
    // Sponsored rows appear first ONLY in the default view, clearly labeled;
    // explicit sorts (top rated, liquidity, response) are never altered.
    if (qf === "all")
      return [...xs.filter((p) => p.isFeatured), ...xs.filter((p) => !p.isFeatured)];
    return xs;
  }, [receive, district, ptype, amountGnf, qf]);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast(t("Résultats actualisés", "Results refreshed"), "info");
    }, 600);
  };

  const requestDeal = (p: Provider) => {
    const s = p.services.find((x) => x.to === receive) ?? p.services[0];
    setSelected({
      provider: p,
      service: s,
      feeGnf: 0,
      receiveGnf: 0,
      score: 0,
    });
  };

  const featured = providers.filter((p) => p.isFeatured).slice(0, 3);

  const quickFilters: { id: QF; fr: string; en: string }[] = [
    { id: "all", fr: "Tous", en: "All" },
    { id: "top_rated", fr: "Mieux notés", en: "Top rated" },
    { id: "high_liquidity", fr: "Forte liquidité", en: "High liquidity" },
    { id: "fast_response", fr: "Réponse rapide", en: "Fast response" },
    { id: "open_now", fr: "Ouvert maintenant", en: "Open now" },
    { id: "verified_pro", fr: "Vérification renforcée", en: "Enhanced verification" },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <SwitchBanner current="marketplace" />

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold">Marketplace</h1>
          <p className="mt-0.5 text-sm text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Comparez des échangeurs, fournisseurs et bureaux de change vérifiés.",
              "Compare verified exchangers, providers and exchange businesses."
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setDrawer(true)}>
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            {t("Filtres", "Filters")}
          </Button>
          <Button variant="secondary" size="sm" onClick={refresh}>
            <RefreshCw className={classNames("h-3.5 w-3.5", loading && "animate-spin")} aria-hidden />
            {t("Actualiser", "Refresh")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 min-[1420px]:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0 space-y-4">
          {/* search */}
          <Card className="card-pad">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <label className="label-xs" htmlFor="mk-amount">
                  {t("Vous donnez", "You give")}
                </label>
                <div className="relative">
                  <input
                    id="mk-amount"
                    inputMode="numeric"
                    className="input-base pr-12 font-semibold tabular-nums"
                    value={amount}
                    onChange={(e) => setAmount(formatAmountInput(e.target.value))}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-2xs font-bold text-ink-muted">
                    GNF
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {([1_000_000, 5_000_000, 10_000_000, 25_000_000] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(formatAmountInput(String(v)))}
                      className={classNames(
                        "rounded-md border px-2 py-1 text-2xs font-bold tabular-nums transition-colors",
                        amountGnf === v
                          ? "border-mkt-500 bg-mkt-50 text-mkt-700 dark:bg-navy-800 dark:text-mkt-300"
                          : "border-line text-ink-muted hover:border-mkt-400 hover:text-ink dark:border-night-lineStrong dark:text-[#8FA79C]"
                      )}
                    >
                      {v / 1_000_000}M
                    </button>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="label-xs" htmlFor="mk-receive">
                  {t("Vous recevez", "You receive")}
                </label>
                <select
                  id="mk-receive"
                  className="input-base"
                  value={receive}
                  onChange={(e) => setReceive(e.target.value as RailId)}
                >
                  {paymentRails.map((r) => (
                    <option key={r.id} value={r.id}>
                      {lang === "fr" ? r.labelFr : r.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-3">
                <label className="label-xs" htmlFor="mk-district">
                  {t("Lieu", "Location")}
                </label>
                <select
                  id="mk-district"
                  className="input-base"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d === "Tous les quartiers"
                        ? lang === "en"
                          ? "All districts"
                          : "Tous quartiers"
                        : d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="label-xs" htmlFor="mk-type">
                  {t("Type", "Provider type")}
                </label>
                <select
                  id="mk-type"
                  className="input-base"
                  value={ptype}
                  onChange={(e) => setPtype(e.target.value as "all" | "business")}
                >
                  <option value="all">{t("Tous les types", "All types")}</option>
                  <option value="business">{t("Entreprise vérifiée", "Verified Business")}</option>
                </select>
              </div>
              <div className="flex items-end lg:col-span-2">
                <Button variant="blue" full onClick={refresh}>
                  <Search className="h-4 w-4" aria-hidden />
                  {t("Rechercher", "Search")}
                </Button>
              </div>
            </div>
          </Card>

          {/* quick filters */}
          <div className="scroll-x flex gap-2 pb-1" role="tablist">
            {quickFilters.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={qf === f.id}
                onClick={() => setQf(f.id)}
                className={classNames("chip shrink-0", qf === f.id && "chip-active-blue")}
              >
                {lang === "fr" ? f.fr : f.en}
              </button>
            ))}
          </div>

          {/* providers table */}
          <Card>
            {loading ? (
              <SkeletonRows rows={6} />
            ) : rows.length === 0 ? (
              <EmptyState
                title={t("Aucun partenaire ne correspond.", "No providers match.")}
                hints={[
                  t("Changez de quartier ou de montant", "Change district or amount"),
                  t("Essayez un autre service", "Try another service"),
                ]}
                action={
                  <Button
                    variant="blueSecondary"
                    onClick={() =>
                      toast(
                        t("L'équipe Nimba cherche un partenaire pour vous (démo).", "The Nimba team is finding a provider for you (demo)."),
                        "info"
                      )
                    }
                  >
                    {t("Demander un matching manuel", "Ask Nimba to find a provider")}
                  </Button>
                }
              />
            ) : (
              <>
                <div className="scroll-x hidden lg:block">
                  <table className="w-full min-w-[700px] min-[1700px]:min-w-[820px] text-sm">
                    <thead className="border-b border-line dark:border-night-line">
                      <tr>
                        <th className="th-cell">{t("Partenaire", "Provider")}</th>
                        <th className="th-cell">{t("Note", "Rating")}</th>
                        <th className="th-cell">{t("Vérification", "Verification")}</th>
                        <th className="th-cell">{t("Liquidité", "Liquidity")}</th>
                        <th className="th-cell hidden min-[1700px]:table-cell">{t("Limites (GNF)", "Limits (GNF)")}</th>
                        <th className="th-cell">{t("Réponse", "Response")}</th>
                        <th className="th-cell">{t("Actions", "Actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line dark:divide-night-line">
                      {rows.slice(0, visible).map((p) => (
                        <ProviderRow key={p.id} p={p} onRequest={() => requestDeal(p)} cmp={cmp.includes(p.id)} onCmp={() => toggleCmp(p.id)} />
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* mobile cards */}
                <ul className="divide-y divide-line lg:hidden dark:divide-night-line">
                  {rows.slice(0, visible).map((p) => (
                    <ProviderCardMobile key={p.id} p={p} onRequest={() => requestDeal(p)} cmp={cmp.includes(p.id)} onCmp={() => toggleCmp(p.id)} />
                  ))}
                </ul>
                {visible < rows.length && (
                  <div className="border-t border-line p-3 dark:border-night-line">
                    <Button variant="blueSecondary" size="sm" full onClick={() => setVisible((v) => v + 8)}>
                      {t("Charger plus de partenaires", "Load more providers")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>

          {/* trust strip — direct settlement wording, no escrow claims */}
          <Card className="card-pad">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  Icon: BadgeCheck,
                  title: t("Partenaires vérifiés", "Verified providers"),
                  text: t("Identité et business examinés (KYC & KYB).", "Identity and business reviewed (KYC & KYB)."),
                },
                {
                  Icon: Star,
                  title: t("Meilleurs taux", "Best rates"),
                  text: t("Comparez les frais avant de choisir.", "Compare fees before you choose."),
                },
                {
                  Icon: ShieldCheck,
                  title: t("Règlement direct", "Direct settlement"),
                  text: t(
                    "Les fonds circulent directement entre vous et le partenaire ; chaque demande est enregistrée.",
                    "Funds move directly between you and the provider; every request is logged."
                  ),
                },
                {
                  Icon: MessageCircle,
                  title: t("Support 24/7", "24/7 support"),
                  text: t("Litiges examinés par l'équipe Nimba.", "Disputes reviewed by the Nimba team."),
                },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mkt-50 text-mkt-600 dark:bg-navy-800 dark:text-mkt-300">
                    <Icon className="h-4.5 w-4.5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* right panel */}
        <div className="hidden space-y-4 min-[1420px]:block">
          <Card className="card-pad">
            <h3 className="inline-flex items-center gap-1.5 text-sm font-bold">
              <Award className="h-4 w-4 text-mkt-500" aria-hidden />
              {t("Comment les partenaires sont classés", "How providers are ranked")}
            </h3>
            <p className="mt-1 text-2xs text-ink-muted dark:text-[#8FA79C]">
              {t("Notre algorithme de classement considère :", "Our ranking algorithm considers:")}
            </p>
            <div className="mt-3 space-y-3">
              <BarRow barClass="bg-mkt-500" label={t("Notes & avis", "Ratings & feedback")} pct={40} />
              <BarRow barClass="bg-mkt-500" label={t("Liquidité & limites", "Liquidity & limits")} pct={25} />
              <BarRow barClass="bg-mkt-500" label={t("Temps de réponse", "Response time")} pct={20} />
              <BarRow barClass="bg-mkt-500" label={t("Vérification & historique", "Verification & history")} pct={15} />
            </div>
            <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-surface-sunken p-2.5 text-2xs text-ink-muted dark:bg-night-raised dark:text-[#8FA79C]">
              <Info className="mt-px h-3 w-3 shrink-0" aria-hidden />
              {t(
                "Les partenaires sponsorisés apparaissent en premier dans la vue par défaut, toujours étiquetés. Les tris explicites et le score organique ne sont jamais modifiés.",
                "Sponsored providers appear first in the default view, always labeled. Explicit sorts and the organic score are never altered."
              )}
            </p>
          </Card>

          <Card className="card-pad">
            <div className="flex items-center justify-between">
              <h3 className="inline-flex items-center gap-1.5 text-sm font-bold">
                <Star className="h-4 w-4 text-mkt-500" aria-hidden />
                {t("Partenaires en vedette", "Featured providers")}
              </h3>
              <Link
                href="/marketplace/providers"
                className="text-2xs font-semibold text-mkt-600 hover:text-mkt-700 dark:text-mkt-300"
              >
                {t("Tout voir", "View all")}
              </Link>
            </div>
            <ul className="mt-2.5 space-y-2.5">
              {featured.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/marketplace/providers/${p.slug}`}
                    className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-mkt-50/60 dark:hover:bg-navy-800/60"
                  >
                    <Avatar initials={p.logoInitials} hue={p.logoHue} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-xs font-bold">
                        <span className="truncate">{p.name}</span>
                        <span className="shrink-0"><FeaturedBadge /></span>
                      </p>
                      <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                        {p.successRate}% · {formatGnfCompact(p.liquidity.totalAvailableGnf, lang)}
                      </p>
                    </div>
                    <Rating value={p.rating} compact />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="card-pad">
            <h3 className="text-sm font-bold">{t("Besoin d'aide ?", "Need help?")}</h3>
            <p className="mt-1 text-xs text-ink-muted dark:text-[#8FA79C]">
              {t("Nous sommes en ligne 24/7.", "We're online 24/7.")}
            </p>
            <Button
              variant="blueSecondary"
              full
              size="sm"
              className="mt-3"
              onClick={() => toast(`WhatsApp — ${supportWhatsApp}`, "info")}
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {t("Chat WhatsApp", "Chat on WhatsApp")}
            </Button>
          </Card>

          <Card className="card-pad">
            <h3 className="inline-flex items-center gap-1.5 text-sm font-bold">
              <ShieldCheck className="h-4 w-4 text-mkt-500" aria-hidden />
              {t("Échangez en confiance", "Trade safely on Nimba")}
            </h3>
            <ul className="mt-2.5 space-y-2">
              {[
                t("Tous les partenaires sont vérifiés KYC/KYB", "All providers are KYC/KYB verified"),
                t("Prix et frais affichés avant confirmation", "Pricing and fees shown before you confirm"),
                t("Chaque demande est enregistrée", "Every request is logged"),
                t("Résolution des litiges & support 24/7", "Dispute resolution & 24/7 support"),
              ].map((x) => (
                <li key={x} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mkt-500" aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* filters drawer */}
      <Drawer open={drawer} onClose={() => setDrawer(false)} title={t("Filtres Marketplace", "Marketplace filters")}>
        <div className="space-y-4">
          <fieldset>
            <legend className="label-xs">{t("Affichage", "Show")}</legend>
            <div className="space-y-1.5">
              {(
                [
                  ["all", t("Tous les partenaires", "All providers")],
                  ["top_rated", t("Mieux notés", "Top rated")],
                  ["high_liquidity", t("Forte liquidité", "High liquidity")],
                  ["fast_response", t("Réponse rapide", "Fast response")],
                  ["open_now", t("Ouvert maintenant", "Open now")],
                  ["verified_pro", t("Vérification renforcée", "Enhanced verification")],
                ] as const
              ).map(([id, label]) => (
                <label
                  key={id}
                  className={classNames(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-medium",
                    qf === id ? "border-mkt-500 bg-mkt-50 dark:bg-navy-800" : "border-line dark:border-night-line"
                  )}
                >
                  <input
                    type="radio"
                    name="qf"
                    className="accent-mkt-500"
                    checked={qf === id}
                    onChange={() => setQf(id)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <Button variant="blue" full onClick={() => setDrawer(false)}>
            {t("Appliquer", "Apply")}
          </Button>
        </div>
      </Drawer>

      {selected && (
        <CreateRequestModal offer={selected} amountGnf={amountGnf} onClose={() => setSelected(null)} />
      )}

      {/* sticky compare bar */}
      {cmp.length > 0 && (
        <div className="fixed inset-x-3 bottom-20 z-[66] mx-auto flex max-w-xl items-center gap-3 rounded-2xl bg-navy-900/95 px-4 py-3 text-white shadow-overlay backdrop-blur lg:bottom-6">
          <Scale className="h-4 w-4 shrink-0 text-mkt-300" aria-hidden />
          <p className="min-w-0 flex-1 truncate text-xs">
            <span className="font-bold">{cmp.length}/3</span>{" "}
            {t("sélectionné(s) :", "selected:")}{" "}
            {cmp
              .map((id) => providers.find((p) => p.id === id)?.name)
              .filter(Boolean)
              .join(" · ")}
          </p>
          {cmp.length >= 2 ? (
            <Link href={`/marketplace/compare?ids=${cmp.join(",")}`}>
              <Button variant="blue" size="sm" className="whitespace-nowrap">
                {t("Comparer", "Compare")}
              </Button>
            </Link>
          ) : (
            <Button variant="blue" size="sm" className="whitespace-nowrap" disabled>
              {t("Comparer", "Compare")}
            </Button>
          )}
          <button
            onClick={() => setCmp([])}
            aria-label={t("Vider la sélection", "Clear selection")}
            className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function LiquidityBars({ gnf }: { gnf: number }) {
  const { t } = useI18n();
  const tier = liquidityTier(gnf, t);
  return (
    <div>
      <p className="text-xs font-semibold">{tier.label}</p>
      <div className="mt-1 flex items-end gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={classNames(
              "w-1.5 rounded-sm",
              i < tier.bars ? "bg-mkt-500" : "bg-line dark:bg-night-lineStrong"
            )}
            style={{ height: `${6 + i * 2}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function ProviderRow({ p, onRequest, cmp, onCmp }: { p: Provider; onRequest: () => void; cmp: boolean; onCmp: () => void }) {
  const { lang, t } = useI18n();
  return (
    <tr
      className={classNames(
        "transition-colors hover:bg-mkt-50/50 dark:hover:bg-navy-800/40",
        p.isFeatured && "bg-mkt-50/40 ring-1 ring-inset ring-mkt-200 dark:bg-navy-800/30 dark:ring-navy-700"
      )}
    >
      <td className="td-cell">
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            className="h-4 w-4 shrink-0 cursor-pointer rounded accent-mkt-500"
            checked={cmp}
            onChange={onCmp}
            aria-label={t(`Comparer ${p.name}`, `Compare ${p.name}`)}
          />
          <Avatar initials={p.logoInitials} hue={p.logoHue} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/marketplace/providers/${p.slug}`}
                className="truncate text-[13px] font-bold hover:text-mkt-600"
              >
                {p.name}
              </Link>
              <TierBadge tier={p.subscriptionTier} />
              {p.isFeatured && <FeaturedBadge />}
            </div>
            <p className="mt-0.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
              {p.completedDeals.toLocaleString("fr-FR")} {t("transactions", "deals")} ·{" "}
              {p.locations[0].district}
            </p>
          </div>
        </div>
      </td>
      <td className="td-cell">
        <Rating value={p.rating} count={p.reviewCount} compact />
      </td>
      <td className="td-cell">
        <VerificationBadge type={p.type} level={p.verification.level} compact />
      </td>
      <td className="td-cell">
        <LiquidityBars gnf={p.liquidity.totalAvailableGnf} />
      </td>
      <td className="td-cell hidden whitespace-nowrap text-xs tabular-nums text-ink-secondary min-[1700px]:table-cell dark:text-[#B7C9C0]">
        {formatGnfCompact(p.limits.minGnf, lang).replace(" GNF", "")} –{" "}
        {formatGnfCompact(p.limits.maxGnf, lang).replace(" GNF", "")}
      </td>
      <td className="td-cell">
        <span className="inline-flex items-center gap-1 text-xs">
          <Zap className="h-3 w-3 text-mkt-500" aria-hidden />
          {p.responseMinutes} min
        </span>
      </td>
      <td className="td-cell">
        <div className="flex w-[92px] flex-col gap-1.5">
          <Link href={`/marketplace/providers/${p.slug}`}>
            <Button variant="blueSecondary" size="xs" full className="whitespace-nowrap">
              {t("Profil", "Profile")}
            </Button>
          </Link>
          <Button
            variant="blue"
            size="xs"
            full
            className="whitespace-nowrap"
            onClick={onRequest}
            disabled={p.status === "offline"}
          >
            {t("Demander", "Request")}
          </Button>
        </div>
      </td>
    </tr>
  );
}

function ProviderCardMobile({ p, onRequest, cmp, onCmp }: { p: Provider; onRequest: () => void; cmp: boolean; onCmp: () => void }) {
  const { lang, t } = useI18n();
  return (
    <li className="p-4">
      <div className="flex items-start gap-3">
        <Avatar initials={p.logoInitials} hue={p.logoHue} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Link href={`/marketplace/providers/${p.slug}`} className="text-[13px] font-bold">
              {p.name}
            </Link>
            <TierBadge tier={p.subscriptionTier} />
            {p.isFeatured && <FeaturedBadge />}
            <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5 p-1 text-2xs font-semibold text-ink-muted dark:text-[#8FA79C]">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer rounded accent-mkt-500"
                checked={cmp}
                onChange={onCmp}
                aria-label={t(`Comparer ${p.name}`, `Compare ${p.name}`)}
              />
              {t("Comparer", "Compare")}
            </label>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <VerificationBadge type={p.type} level={p.verification.level} compact />
            <Rating value={p.rating} compact />
            <StatusBadge status={p.status} />
          </div>
          <p className="mt-1.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
            {p.locations[0].district} · {formatGnfCompact(p.liquidity.totalAvailableGnf, lang)} ·{" "}
            {p.responseMinutes} min
          </p>
          <div className="mt-2 flex gap-2">
            <Link href={`/marketplace/providers/${p.slug}`} className="flex-1">
              <Button variant="blueSecondary" size="sm" full>
                {t("Profil", "Profile")}
              </Button>
            </Link>
            <Button variant="blue" size="sm" className="flex-1" onClick={onRequest} disabled={p.status === "offline"}>
              {t("Demander", "Request")}
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense>
      <MarketplaceInner />
    </Suspense>
  );
}
