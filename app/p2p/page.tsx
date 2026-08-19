"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  RefreshCw,
  SlidersHorizontal,
  Zap,
  PlayCircle,
  ShieldCheck,
  Scale,
  Lock,
  Headphones,
  Check,
  MessageCircle,
  Megaphone,
} from "lucide-react";
import { Card, Avatar, EmptyState, SkeletonRows, Sparkline, Tooltip } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Modal";
import { Pill } from "@/components/ui/Badge";
import { SwitchBanner } from "@/components/layout/SwitchBanner";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { offers, p2pOverview, getTrader, wallets } from "@/data/mock/p2p";
import { announcements } from "@/data/mock/market";
import {
  classNames,
  formatAmountInput,
  formatGnf,
  formatGnfCompact,
  formatNumber,
  parseAmount,
} from "@/lib/format";
import { railLabel, RailChip } from "@/lib/rails";
import { supportWhatsApp, type P2PMethodId } from "@/config/product";
import type { P2POffer } from "@/types";
import { Info } from "lucide-react";

type Side = "buy" | "sell";
type QF = "best_match" | "best_price" | "low_fees" | "fast_response" | "high_completion";

const methods: (P2PMethodId | "all")[] = ["all", "orange", "mtn", "wave", "bank", "cash"];

function P2PInner() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const sp = useSearchParams();

  const [side, setSide] = useState<Side>((sp.get("side") as Side) || "buy");
  const [amount, setAmount] = useState("10 000 000");
  const [method, setMethod] = useState<P2PMethodId | "all">("all");
  const [qf, setQf] = useState<QF>("best_match");
  const [loading, setLoading] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const amountGnf = parseAmount(amount) || 10_000_000;

  const rows = useMemo(() => {
    let xs = offers.filter((o) => o.side === side);
    if (method !== "all") xs = xs.filter((o) => o.method === method);
    xs = xs.filter((o) => amountGnf >= o.minGnf && amountGnf <= o.maxGnf);
    const tr = (o: P2POffer) => getTrader(o.traderId)!;
    switch (qf) {
      case "best_price":
        xs.sort((a, b) => (side === "buy" ? a.priceGnf - b.priceGnf : b.priceGnf - a.priceGnf));
        break;
      case "fast_response":
        xs.sort((a, b) => tr(a).responseMinutes - tr(b).responseMinutes);
        break;
      case "high_completion":
        xs.sort((a, b) => tr(b).completionPct - tr(a).completionPct);
        break;
      default: {
        // transparent composite: completion, price and response
        const score = (o: P2POffer) => {
          const trd = tr(o);
          const price =
            side === "buy" ? 1 - (o.priceGnf - 8_500) / 250 : (o.priceGnf - 8_450) / 250;
          return trd.completionPct * 0.5 + price * 40 + (30 - trd.responseMinutes) * 0.8 + trd.trades / 400;
        };
        xs.sort((a, b) => score(b) - score(a));
        // one offer per trader in the default view — keeps the top list diverse
        const seen = new Set<string>();
        xs = xs.filter((o) => (seen.has(o.traderId) ? false : (seen.add(o.traderId), true)));
      }
    }
    return xs.slice(0, 12);
  }, [side, method, amountGnf, qf]);

  const bestPrice = rows[0]?.priceGnf ?? 8_640;
  const receiveUsdt = amountGnf / bestPrice;

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast(t("Offres actualisées", "Offers refreshed"), "info");
    }, 600);
  };

  const openOrder = (o: P2POffer) => {
    router.push(
      `/p2p/order/new?offer=${o.id}&amount=${Math.min(Math.max(amountGnf, o.minGnf), o.maxGnf)}`
    );
  };

  const quickFilters: { id: QF; fr: string; en: string }[] = [
    { id: "best_match", fr: "Meilleure correspondance", en: "Best match" },
    { id: "best_price", fr: "Meilleur prix", en: "Best price" },
    { id: "fast_response", fr: "Réponse rapide", en: "Fast response" },
    { id: "high_completion", fr: "Taux d’exécution élevé", en: "High completion" },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <SwitchBanner current="p2p" />

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold">P2P Exchange</h1>
          <p className="mt-0.5 text-sm text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Achetez et vendez des USDT directement avec des pairs vérifiés, aux meilleurs taux.",
              "Buy and sell USDT directly with verified peers at the best rates."
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

      <div className="grid gap-4 lg:grid-cols-[290px_minmax(0,1fr)] min-[1760px]:grid-cols-[290px_minmax(0,1fr)_300px]">
        {/* search card */}
        <div>
          <Card className="card-pad lg:sticky lg:top-[72px]">
            <div className="grid grid-cols-2 rounded-control bg-surface-sunken p-1 dark:bg-night-raised" role="tablist">
              {(
                [
                  ["buy", t("Acheter", "Buy")],
                  ["sell", t("Vendre", "Sell")],
                ] as const
              ).map(([s, label]) => (
                <button
                  key={s}
                  role="tab"
                  aria-selected={side === s}
                  onClick={() => setSide(s)}
                  className={classNames(
                    "rounded-[7px] px-2 py-1.5 text-xs font-bold transition-colors",
                    side === s
                      ? s === "buy"
                        ? "bg-white text-brand-700 shadow-sm dark:bg-night-card dark:text-brand-200"
                        : "bg-white text-danger shadow-sm dark:bg-night-card"
                      : "text-ink-muted hover:text-ink dark:text-[#8FA79C]"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="label-xs" htmlFor="p2p-pay">
                  {side === "buy" ? t("Vous payez", "You pay") : t("Vous recevez", "You receive")}
                </label>
                <div className="relative">
                  <input
                    id="p2p-pay"
                    inputMode="numeric"
                    className="input-base pr-14 font-semibold tabular-nums"
                    value={amount}
                    onChange={(e) => setAmount(formatAmountInput(e.target.value))}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-bold text-ink-muted">
                    GNF
                  </span>
                </div>
                <p className="mt-1 text-2xs text-ink-muted dark:text-[#8FA79C]">
                  {t("Solde :", "Balance:")} {formatGnf(wallets[0].balance)}
                </p>
              </div>

              <div>
                <label className="label-xs">
                  {side === "buy"
                    ? t("Vous recevez (approx.)", "You receive (approx.)")
                    : t("Vous envoyez (approx.)", "You send (approx.)")}
                </label>
                <div className="flex items-center justify-between rounded-control border border-line bg-surface px-3 py-2 dark:border-night-lineStrong dark:bg-night-raised">
                  <span className="text-sm font-extrabold tabular-nums text-brand-700 dark:text-brand-300">
                    {receiveUsdt.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-bold text-ink-muted">USDT</span>
                </div>
                <p className="mt-1 text-2xs text-ink-muted dark:text-[#8FA79C]">
                  {t("Taux", "Rate")} : 1 USDT ≈ {formatNumber(bestPrice)} GNF
                </p>
              </div>

              <div>
                <label className="label-xs" htmlFor="p2p-method">
                  {t("Moyen de paiement", "Payment method")}
                </label>
                <select
                  id="p2p-method"
                  className="input-base"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as P2PMethodId | "all")}
                >
                  <option value="all">{t("Tous les moyens", "All payment methods")}</option>
                  {methods.slice(1).map((m) => (
                    <option key={m} value={m}>
                      {railLabel(m as P2PMethodId, lang)}
                    </option>
                  ))}
                </select>
              </div>

              <Button full size="lg" onClick={refresh}>
                {t("Trouver les meilleures offres", "Find best offers")}
              </Button>
              <button
                className="mx-auto flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
                onClick={() =>
                  toast(
                    t(
                      "1) Choisissez une offre · 2) Payez le trader · 3) Les USDT sont libérés après confirmation (protection démo).",
                      "1) Pick an offer · 2) Pay the trader · 3) USDT is released after confirmation (demo protection)."
                    ),
                    "info"
                  )
                }
              >
                <PlayCircle className="h-3.5 w-3.5" aria-hidden />
                {t("Comment fonctionne le P2P ?", "How P2P trading works")}
              </button>
            </div>
          </Card>
        </div>

        {/* offers */}
        <div className="min-w-0">
          <div className="scroll-x mb-3 flex gap-2 pb-1" role="tablist">
            {quickFilters.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={qf === f.id}
                onClick={() => setQf(f.id)}
                className={classNames("chip shrink-0", qf === f.id && "chip-active")}
              >
                {f.id === "best_match" && <Check className="h-3 w-3" aria-hidden />}
                {lang === "fr" ? f.fr : f.en}
              </button>
            ))}
          </div>

          <Card>
            {loading ? (
              <SkeletonRows rows={6} />
            ) : rows.length === 0 ? (
              <EmptyState
                title={t("Aucune offre pour ces critères.", "No offers match these filters.")}
                hints={[
                  t("Modifiez le montant", "Change the amount"),
                  t("Essayez un autre moyen de paiement", "Try another payment method"),
                ]}
              />
            ) : (
              <>
                {/* desktop */}
                <div className="scroll-x hidden md:block">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="border-b border-line dark:border-night-line">
                      <tr>
                        <th className="th-cell">{t("Trader", "Trader")}</th>
                        <th className="th-cell">{t("Méthode", "Payment method")}</th>
                        <th className="th-cell">{t("Prix (GNF)", "Price (GNF)")}</th>
                        <th className="th-cell">
                          {side === "buy" ? t("Vous recevez", "You get") : t("Vous envoyez (USDT)", "You send (USDT)")}
                        </th>
                        <th className="th-cell">{t("Limites (GNF)", "Limits (GNF)")}</th>
                        <th className="th-cell">{t("Exécution", "Completion")}</th>
                        <th className="th-cell">{t("Réponse", "Response")}</th>
                        <th className="th-cell" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line dark:divide-night-line">
                      {rows.map((o, i) => (
                        <OfferRow key={o.id} offer={o} amountGnf={amountGnf} highlight={i === 0 && qf === "best_match"} onOpen={() => openOrder(o)} side={side} />
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* mobile */}
                <ul className="divide-y divide-line md:hidden dark:divide-night-line">
                  {rows.map((o) => (
                    <OfferCardMobile key={o.id} offer={o} amountGnf={amountGnf} onOpen={() => openOrder(o)} side={side} />
                  ))}
                </ul>
                <div className="border-t border-line p-3 dark:border-night-line">
                  <Button
                    variant="secondary"
                    size="sm"
                    full
                    onClick={() => toast(t("Plus d'offres chargées (démo)", "More offers loaded (demo)"), "info")}
                  >
                    {t("Charger plus d'offres", "Load more offers")}
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* trust strip */}
          <Card className="card-pad mt-4 min-[1760px]:hidden">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  Icon: ShieldCheck,
                  title: t("Communauté vérifiée", "Verified community"),
                  text: t("Chaque trader passe un KYC complet.", "Every trader is KYC verified."),
                },
                {
                  Icon: Scale,
                  title: t("Juste & transparent", "Fair & transparent"),
                  text: t("Meilleurs taux en direct, sans frais cachés.", "Best live rates with no hidden fees."),
                },
                {
                  Icon: Lock,
                  title: t("Protection Nimba (démo)", "Nimba protection (demo)"),
                  text: t(
                    "Dans ce prototype, les USDT sont bloqués pendant l'ordre.",
                    "In this prototype, USDT is locked during the order."
                  ),
                },
                {
                  Icon: Headphones,
                  title: t("Support 24/7", "24/7 support"),
                  text: t("Nous sommes là, où que vous soyez.", "We're here to help, anywhere."),
                },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
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

        {/* right column */}
        <div className="hidden space-y-4 min-[1760px]:block">
          <Card className="card-pad">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold">{t("Aperçu du marché P2P", "P2P market overview")}</h3>
              <Tooltip text={t("Données de démonstration", "Mock data")}>
                <Info className="h-3.5 w-3.5 text-ink-faint" />
              </Tooltip>
              <span className="ml-auto text-2xs text-ink-muted dark:text-[#8FA79C]">24h</span>
            </div>
            <p className="mt-3 text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
              {t("Volume total (24h)", "Total volume (24h)")}
            </p>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xl font-extrabold tabular-nums">
                  {formatGnfCompact(p2pOverview.volume24hGnf, lang)}
                </p>
                <p className="text-2xs font-semibold text-brand-600 dark:text-brand-300">
                  +{p2pOverview.volumeChangePct}% {t("vs hier", "from yesterday")}
                </p>
              </div>
              <div className="w-28">
                <Sparkline data={p2pOverview.trend} />
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center dark:border-night-line">
              {[
                [t("Traders actifs", "Active traders"), `${formatNumber(p2pOverview.activeTraders)}+`],
                [t("Offres actives", "Active offers"), `${formatNumber(p2pOverview.activeOffers)}+`],
                [t("Taux de réussite", "Success rate"), `${p2pOverview.successRate}%`],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-2xs text-ink-muted dark:text-[#8FA79C]">{k}</dt>
                  <dd className="text-sm font-bold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="card-pad">
            <h3 className="inline-flex items-center gap-1.5 text-sm font-bold">
              <ShieldCheck className="h-4 w-4 text-brand-500" aria-hidden />
              {t("Tradez en sécurité sur Nimba", "Trade safely on Nimba")}
            </h3>
            <ul className="mt-2.5 space-y-2">
              {[
                t("Tous les traders sont vérifiés KYC", "All traders are KYC verified"),
                t("Protection Nimba pendant l'ordre (démo)", "Nimba protection during the order (demo)"),
                t("Aucuns frais cachés", "No hidden fees"),
                t("Résolution des litiges & support 24/7", "Dispute resolution & 24/7 support"),
              ].map((x) => (
                <li key={x} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                  {x}
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
              variant="secondary"
              full
              size="sm"
              className="mt-3 !text-brand-700 dark:!text-brand-300"
              onClick={() => toast(`WhatsApp — ${supportWhatsApp}`, "info")}
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {t("Chat WhatsApp", "Chat on WhatsApp")}
            </Button>
          </Card>

          <Card className="card-pad">
            <h3 className="inline-flex items-center gap-1.5 text-sm font-bold">
              <Megaphone className="h-4 w-4 text-brand-500" aria-hidden />
              {t("Annonces", "Announcements")}
            </h3>
            <ul className="mt-2.5 space-y-2.5">
              {announcements.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-start gap-2 text-xs">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" aria-hidden />
                  <div>
                    <p className="font-medium">{lang === "fr" ? a.fr : a.en}</p>
                    <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                      {lang === "fr" ? a.when : a.whenEn}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* filter drawer */}
      <Drawer open={drawer} onClose={() => setDrawer(false)} title={t("Filtres P2P", "P2P filters")}>
        <div className="space-y-4">
          <fieldset>
            <legend className="label-xs">{t("Moyen de paiement", "Payment method")}</legend>
            <div className="space-y-1.5">
              {methods.map((m) => (
                <label
                  key={m}
                  className={classNames(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-medium",
                    method === m
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/50"
                      : "border-line dark:border-night-line"
                  )}
                >
                  <input
                    type="radio"
                    name="m"
                    className="accent-brand-500"
                    checked={method === m}
                    onChange={() => setMethod(m)}
                  />
                  {m === "all" ? t("Tous", "All") : railLabel(m as P2PMethodId, lang)}
                </label>
              ))}
            </div>
          </fieldset>
          <Button full onClick={() => setDrawer(false)}>
            {t("Appliquer", "Apply")}
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

function OfferRow({
  offer: o,
  amountGnf,
  highlight,
  onOpen,
  side,
}: {
  offer: P2POffer;
  amountGnf: number;
  highlight: boolean;
  onOpen: () => void;
  side: Side;
}) {
  const { lang, t } = useI18n();
  const tr = getTrader(o.traderId)!;
  const usdt = amountGnf / o.priceGnf;
  return (
    <tr
      className={classNames(
        "table-row-hover",
        highlight && "bg-brand-50/50 ring-1 ring-inset ring-brand-300 dark:bg-brand-900/20 dark:ring-brand-700"
      )}
    >
      <td className="td-cell">
        <div className="flex items-center gap-2.5">
          <Avatar initials={tr.initials} hue={tr.hue} />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[13px] font-bold">
              {tr.name}
              {tr.verified && (
                <ShieldCheck className="h-3.5 w-3.5 text-brand-500" aria-label={t("vérifié", "verified")} />
              )}
              {highlight && <Pill tone="green">{t("Meilleur choix", "Best match")}</Pill>}
            </p>
            <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
              {tr.trades.toLocaleString("fr-FR")} {t("trades", "trades")} · {tr.completionPct}%
            </p>
          </div>
        </div>
      </td>
      <td className="td-cell">
        <RailChip id={o.method} lang={lang} compact />
      </td>
      <td className="td-cell">
        <span className="text-[13px] font-extrabold tabular-nums text-brand-700 dark:text-brand-300">
          {formatNumber(o.priceGnf)}
        </span>
        <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">{t("par USDT", "per USDT")}</p>
      </td>
      <td className="td-cell font-semibold tabular-nums">
        {usdt.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} USDT
      </td>
      <td className="td-cell text-xs tabular-nums text-ink-secondary dark:text-[#B7C9C0]">
        {formatGnfCompact(o.minGnf, lang)} – {formatGnfCompact(o.maxGnf, lang)}
      </td>
      <td className="td-cell">
        <div className="min-w-[70px]">
          <p className="text-xs font-semibold tabular-nums">{tr.completionPct}%</p>
          <div className="mt-1 h-1 w-full rounded-full bg-line dark:bg-night-lineStrong">
            <div className="h-1 rounded-full bg-brand-500" style={{ width: `${tr.completionPct}%` }} />
          </div>
        </div>
      </td>
      <td className="td-cell">
        <span className="inline-flex items-center gap-1 text-xs">
          <Zap className="h-3 w-3 text-brand-500" aria-hidden />
          {tr.responseMinutes} min
        </span>
      </td>
      <td className="td-cell text-right">
        <Button size="sm" variant={side === "buy" ? "primary" : "danger"} className="whitespace-nowrap" onClick={onOpen}>
          {side === "buy" ? t("Acheter", "Buy USDT") : t("Vendre", "Sell USDT")}
        </Button>
      </td>
    </tr>
  );
}

function OfferCardMobile({
  offer: o,
  amountGnf,
  onOpen,
  side,
}: {
  offer: P2POffer;
  amountGnf: number;
  onOpen: () => void;
  side: Side;
}) {
  const { lang, t } = useI18n();
  const tr = getTrader(o.traderId)!;
  const usdt = amountGnf / o.priceGnf;
  return (
    <li className="p-4">
      <div className="flex items-start gap-3">
        <Avatar initials={tr.initials} hue={tr.hue} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[13px] font-bold">
            {tr.name}
            {tr.verified && <ShieldCheck className="h-3.5 w-3.5 text-brand-500" aria-hidden />}
          </p>
          <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
            {tr.trades.toLocaleString("fr-FR")} trades · {tr.completionPct}% ·{" "}
            <RailChip id={o.method} lang={lang} compact />
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-extrabold tabular-nums text-brand-700 dark:text-brand-300">
                {formatNumber(o.priceGnf)} <span className="text-2xs font-medium">GNF/USDT</span>
              </p>
              <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                {side === "buy"
                  ? `≈ ${usdt.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} USDT`
                  : formatGnf(amountGnf)}{" "}
                · {tr.responseMinutes} min
              </p>
            </div>
            <Button size="sm" variant={side === "buy" ? "primary" : "danger"} onClick={onOpen}>
              {side === "buy" ? t("Acheter", "Buy") : t("Vendre", "Sell")}
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function P2PPage() {
  return (
    <Suspense>
      <P2PInner />
    </Suspense>
  );
}
