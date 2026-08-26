"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  Euro,
  Landmark,
  Loader2,
  Plane,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";
import { classNames, formatGnf, formatNumber, parseAmount } from "@/lib/format";
import { corridorOperators, payoutMethods } from "@/data/mock/diaspora";

// ── Deterministic demo constants (démo — not live quotes) ─────────────
// Route: EUR → USDT → GNF. 1 EUR ≈ 1.082 USDT (on-ramp),
// 1 USDT ≈ 9 300 GNF (payout rate), 1.4% all-in fee.
// For 500 €: fee 7 €, ≈ 541 USDT converted, recipient ≈ 4 961 000 GNF (≈ 4.96M).
const EUR_TO_USDT = 1.082;
const USDT_TO_GNF = 9300;
const FEE_PCT = 1.4;
const TRACKING_REF = "TRF-2026-0917";
const TRACKING_URL = `https://nimba.money/suivi/${TRACKING_REF}`;

type Phase = "form" | "tracking";

export default function DiasporaPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();

  // Form state
  const [amountRaw, setAmountRaw] = useState("500");
  const [recipientName, setRecipientName] = useState("Aïssatou Diallo");
  const [payoutId, setPayoutId] = useState("orange");
  const [phone, setPhone] = useState("+224 620 00 00 00");

  // Tracking state — stage 3: Kaba Trade payout in progress,
  // stage 4: recipient credit in progress, stage 5: done.
  const [phase, setPhase] = useState<Phase>("form");
  const [stage, setStage] = useState(3);

  useEffect(() => {
    if (phase !== "tracking") return;
    setStage(3);
    // Auto-advance so the demo completes itself.
    const t1 = setTimeout(() => setStage(4), 4000);
    const t2 = setTimeout(() => setStage(5), 6500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  const fmtEur = (n: number) =>
    `${new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", {
      maximumFractionDigits: 2,
    }).format(n)} €`;

  const amountEur = parseAmount(amountRaw);
  const feeEur = Math.round(amountEur * FEE_PCT) / 100; // 1.4% → 7 € for 500 €
  const netEur = Math.max(0, amountEur - feeEur);
  // net of fees, so the timeline reconciles with the payout amount
  const usdtGross = Math.round(netEur * EUR_TO_USDT); // ≈ 533 USDT for 500 €
  const recipientGnf =
    Math.round((netEur * EUR_TO_USDT * USDT_TO_GNF) / 1000) * 1000;

  const payout = payoutMethods.find((m) => m.id === payoutId) ?? payoutMethods[0];
  const payoutLabel = lang === "fr" ? payout.labelFr : payout.labelEn;

  const copyTrackingLink = () => {
    navigator.clipboard
      .writeText(TRACKING_URL)
      .then(() => toast(t("Lien de suivi copié (démo)", "Tracking link copied (demo)")))
      .catch(() => toast(t("Impossible de copier le lien", "Could not copy the link"), "warn"));
  };

  const resetTransfer = () => {
    setPhase("form");
    setStage(3);
  };

  const steps: {
    label: string;
    sub: React.ReactNode;
    Icon: typeof Euro;
  }[] = [
    {
      label: t("Paiement EUR reçu", "EUR payment received"),
      sub: fmtEur(amountEur),
      Icon: Euro,
    },
    {
      label: t("Conversion en USDT", "Converted to USDT"),
      sub: `≈ ${formatNumber(usdtGross)} USDT`,
      Icon: Coins,
    },
    {
      label: t(
        "Le partenaire Kaba Trade verse en GNF",
        "Partner Kaba Trade pays out in GNF"
      ),
      sub: (
        <Link
          href="/marketplace/providers/kaba-trade"
          className="font-semibold text-mkt-600 hover:text-mkt-700 dark:text-mkt-300"
        >
          {t("Voir le partenaire vérifié", "View the verified partner")}
        </Link>
      ),
      Icon: Landmark,
    },
    {
      label: t(
        `${recipientName} reçoit ${formatGnf(recipientGnf)}`,
        `${recipientName} receives ${formatGnf(recipientGnf)}`
      ),
      sub: `${payoutLabel} · ${phone}`,
      Icon: Smartphone,
    },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      {/* ── Header ── */}
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
            <Plane className="h-5 w-5 text-mkt-500" aria-hidden />
            {t("Envoyer en Guinée", "Send to Guinea")}
          </h1>
          <Pill tone="blue">
            {t("Corridor démo · France → Guinée", "Demo corridor · France → Guinea")}
          </Pill>
        </div>
        <p className="mt-0.5 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Corridor France → Guinée : versement mobile money en quelques minutes, ~1,4 % tout compris (démo).",
            "France → Guinea corridor: mobile money payout in minutes, ~1.4% all-in (demo)."
          )}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* ── Left: send form / tracking ── */}
        {phase === "form" ? (
          <Card className="card-pad self-start">
            <SectionTitle
              title={t("Nouveau transfert", "New transfer")}
              subtitle={t("Montant en euros, versé en GNF (démo)", "Amount in euros, paid out in GNF (demo)")}
            />
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (amountEur > 0) setPhase("tracking");
              }}
            >
              <div>
                <label htmlFor="dia-amount" className="label-xs">
                  {t("Montant à envoyer (EUR)", "Amount to send (EUR)")}
                </label>
                <div className="relative">
                  <input
                    id="dia-amount"
                    className="input-base pr-8 font-semibold tabular-nums"
                    inputMode="numeric"
                    value={amountEur ? formatNumber(amountEur) : ""}
                    onChange={(e) => setAmountRaw(e.target.value)}
                    placeholder="500"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-muted dark:text-[#8FA79C]">
                    €
                  </span>
                </div>
              </div>

              {/* Route chain EUR → USDT → GNF */}
              <div className="rounded-xl border border-line bg-surface-sunken/60 p-3 dark:border-night-line dark:bg-night-raised/60">
                <div className="flex items-center justify-between gap-1">
                  {[
                    { Icon: Euro, label: "EUR" },
                    { Icon: Coins, label: "USDT" },
                    { Icon: Smartphone, label: "GNF" },
                  ].map((s, i) => (
                    <React.Fragment key={s.label}>
                      {i > 0 && (
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 text-ink-faint"
                          aria-hidden
                        />
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mkt-50 text-mkt-600 dark:bg-navy-800 dark:text-mkt-300">
                          <s.Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <span className="text-xs font-bold">{s.label}</span>
                      </span>
                    </React.Fragment>
                  ))}
                </div>
                <p className="mt-2 text-2xs text-ink-muted dark:text-[#8FA79C]">
                  {t(
                    "1 € ≈ 1,082 USDT · 1 USDT ≈ 9 300 GNF (taux démo)",
                    "1 € ≈ 1.082 USDT · 1 USDT ≈ 9,300 GNF (demo rates)"
                  )}
                </p>
                <dl className="mt-2 space-y-1 border-t border-line pt-2 text-xs dark:border-night-line">
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-muted dark:text-[#8FA79C]">
                      {t("Frais tout compris (1,4 %)", "All-in fee (1.4%)")}
                    </dt>
                    <dd className="font-semibold tabular-nums">{fmtEur(feeEur)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-muted dark:text-[#8FA79C]">
                      {t("Montant converti", "Converted amount")}
                    </dt>
                    <dd className="font-semibold tabular-nums">{fmtEur(netEur)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="font-semibold">
                      {t("Le destinataire reçoit", "Recipient gets")}
                    </dt>
                    <dd className="text-sm font-extrabold tabular-nums text-mkt-600 dark:text-mkt-300">
                      ≈ {formatGnf(recipientGnf)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <label htmlFor="dia-name" className="label-xs">
                  {t("Nom du destinataire", "Recipient name")}
                </label>
                <input
                  id="dia-name"
                  className="input-base"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="dia-method" className="label-xs">
                  {t("Méthode de versement", "Payout method")}
                </label>
                <select
                  id="dia-method"
                  className="input-base"
                  value={payoutId}
                  onChange={(e) => setPayoutId(e.target.value)}
                >
                  {payoutMethods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {lang === "fr" ? m.labelFr : m.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dia-phone" className="label-xs">
                  {t("Téléphone du destinataire", "Recipient phone")}
                </label>
                <input
                  id="dia-phone"
                  className="input-base tabular-nums"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <Button type="submit" variant="blue" size="lg" full disabled={amountEur <= 0}>
                <Send className="h-4 w-4" aria-hidden />
                {t("Envoyer maintenant", "Send now")}
              </Button>
              <p className="text-center text-2xs text-ink-muted dark:text-[#8FA79C]">
                {t(
                  "Parcours de démonstration — aucun fonds réel n'est déplacé (démo).",
                  "Demo flow — no real funds are moved (demo)."
                )}
              </p>
            </form>
          </Card>
        ) : (
          <Card className="card-pad self-start">
            <SectionTitle
              title={t("Suivi du transfert", "Transfer tracking")}
              subtitle={t("Mise à jour en temps réel (démo)", "Live updates (demo)")}
              right={<Pill tone="blue">{t("Réf.", "Ref.")} {TRACKING_REF}</Pill>}
            />

            <ol className="space-y-0">
              {steps.map((s, i) => {
                const done = stage >= 5 || i < stage - 1;
                const active = !done && i === stage - 1;
                return (
                  <li key={s.label} className="relative flex gap-3 pb-5 last:pb-0">
                    {i < steps.length - 1 && (
                      <span
                        className="absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-px bg-line dark:bg-night-lineStrong"
                        aria-hidden
                      />
                    )}
                    <span
                      className={classNames(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        done && "bg-brand-500 text-white",
                        active && "bg-mkt-500 text-white",
                        !done &&
                          !active &&
                          "bg-gray-100 text-ink-muted ring-1 ring-line dark:bg-night-raised dark:text-[#8FA79C] dark:ring-night-lineStrong"
                      )}
                    >
                      {done ? (
                        <Check className="h-4 w-4" aria-hidden />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : (
                        <s.Icon className="h-4 w-4" aria-hidden />
                      )}
                    </span>
                    <div className="min-w-0 pt-1">
                      <p className="text-sm font-semibold leading-tight">
                        {s.label}{" "}
                        {active && (
                          <span className="ml-1 align-middle">
                            <Pill tone="blue">{t("En cours", "In progress")}</Pill>
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                        {s.sub}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {stage >= 5 && (
              <div className="mt-4 space-y-3 rounded-xl bg-brand-50 p-3 ring-1 ring-brand-200 dark:bg-brand-900/50 dark:ring-brand-700">
                <p className="flex items-start gap-2 text-sm font-semibold text-brand-800 dark:text-brand-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {t(
                    `Transfert terminé — ${recipientName} a reçu ${formatGnf(recipientGnf)} (démo).`,
                    `Transfer complete — ${recipientName} received ${formatGnf(recipientGnf)} (demo).`
                  )}
                </p>
                <p className="text-xs text-brand-800/90 dark:text-brand-200/90">
                  {t(
                    "Lien de suivi envoyé par SMS au destinataire (démo).",
                    "Tracking link sent by SMS to the recipient (demo)."
                  )}
                </p>
                <button
                  type="button"
                  onClick={copyTrackingLink}
                  className="chip max-w-full"
                  title={t("Copier le lien de suivi", "Copy tracking link")}
                >
                  <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="truncate tabular-nums">{TRACKING_URL}</span>
                </button>
              </div>
            )}

            <div className="mt-4">
              <Button variant="blueSecondary" full onClick={resetTransfer}>
                <RefreshCw className="h-4 w-4" aria-hidden />
                {t("Nouveau transfert", "New transfer")}
              </Button>
            </div>
          </Card>
        )}

        {/* ── Right: comparison ── */}
        <Card className="card-pad self-start">
          <SectionTitle
            title={t("Le même transfert ailleurs", "The same transfer elsewhere")}
            subtitle={t(
              "Coût tout compris pour envoyer 500 € vers la Guinée (démo)",
              "All-in cost to send €500 to Guinea (demo)"
            )}
          />
          <p className="mb-3 text-xs text-ink-muted dark:text-[#8FA79C]">
            {t(
              "≈ 55 000 Guinéens vivent en France. Les opérateurs classiques prélèvent 8–12 % tout compris — l'Afrique subsaharienne reste le corridor d'envoi le plus cher au monde.",
              "≈ 55,000 Guineans live in France. Classic operators charge 8–12% all-in — Sub-Saharan Africa remains the world's most expensive remittance corridor."
            )}
          </p>
          <div className="scroll-x">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-line dark:border-night-line">
                  <th className="th-cell">{t("Opérateur", "Operator")}</th>
                  <th className="th-cell">{t("Frais (500 €)", "Fees (€500)")}</th>
                  <th className="th-cell">{t("Coût", "Cost")}</th>
                  <th className="th-cell">{t("Délai", "Delivery")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-night-line">
                {corridorOperators.map((op) => {
                  const highlight = Boolean(op.isNimba);
                  return (
                    <tr
                      key={op.id}
                      className={classNames(
                        highlight && "bg-mkt-50/60 dark:bg-navy-800/40"
                      )}
                    >
                      <td className="td-cell">
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          {lang === "fr" ? op.nameFr : op.nameEn}
                          {highlight && (
                            <Check
                              className="h-3.5 w-3.5 text-mkt-500"
                              aria-label={t("meilleur", "best")}
                            />
                          )}
                        </span>
                      </td>
                      <td
                        className={classNames(
                          "td-cell font-bold tabular-nums",
                          highlight && "text-mkt-600 dark:text-mkt-300"
                        )}
                      >
                        {fmtEur(op.feeEur)}
                      </td>
                      <td className="td-cell tabular-nums">
                        {lang === "fr"
                          ? `${String(op.feePct).replace(".", ",")} %`
                          : `${op.feePct}%`}
                      </td>
                      <td className="td-cell text-xs">
                        {highlight ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-mkt-600 dark:text-mkt-300">
                            <Zap className="h-3 w-3" aria-hidden />
                            {lang === "fr" ? op.etaFr : op.etaEn}
                          </span>
                        ) : lang === "fr" ? (
                          op.etaFr
                        ) : (
                          op.etaEn
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-2xs text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Coûts indicatifs (démo), moyenne Afrique subsaharienne ~8,8 % (Banque mondiale).",
              "Indicative costs (demo); Sub-Saharan Africa average ~8.8% (World Bank)."
            )}
          </p>
        </Card>
      </div>

      {/* ── Trust strip ── */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            Icon: Zap,
            title: t("~1,4 % tout compris", "~1.4% all-in"),
            sub: t("vs ~8–12 % ailleurs (démo)", "vs ~8–12% elsewhere (demo)"),
          },
          {
            Icon: Clock,
            title: t("Versement en minutes", "Payout in minutes"),
            sub: t("pas en jours", "not in days"),
          },
          {
            Icon: ShieldCheck,
            title: t("Partenaires vérifiés KYC/KYB", "KYC/KYB-verified partners"),
            sub: t("règlement direct", "direct settlement"),
          },
        ].map((item) => (
          <Card key={item.title} className="card-pad">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mkt-50 text-mkt-600 dark:bg-navy-800 dark:text-mkt-300">
                <item.Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold leading-tight">{item.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                  {item.sub}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
