"use client";

import React, { useState } from "react";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Loader2,
  Printer,
  QrCode,
  ScanLine,
  Store,
  Wallet,
  Zap,
} from "lucide-react";
import { Card, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { classNames, formatGnf, formatNumber } from "@/lib/format";
import { demoUsdtRateGnf } from "@/config/product";

type Step = "scan" | "confirm" | "success";

/** Deterministic fake QR pattern (15×15) — finder squares + fixed data fill. */
const QR_PATTERN = [
  "111111101111111",
  "100000101000001",
  "101110101011101",
  "101110101011101",
  "101110101011101",
  "100000101000001",
  "111111101111111",
  "001101010110100",
  "111111100101101",
  "100000101010010",
  "101110100110101",
  "101110101001011",
  "101110100101100",
  "100000101010011",
  "111111100110101",
];

function FakeQr() {
  return (
    <div className="rounded-lg bg-white p-2 shadow-sm" aria-hidden>
      <svg viewBox="0 0 15 15" className="h-24 w-24 lg:h-28 lg:w-28">
        {QR_PATTERN.map((row, y) =>
          row.split("").map((cell, x) =>
            cell === "1" ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill="#03301F"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

const AMOUNT_GNF = 2_450_000;
const WALLET_USDT = 1_250;
const FEE_PCT = 0.4;

const usdtAmount = Math.round((AMOUNT_GNF / demoUsdtRateGnf) * 100) / 100; // 283.56
const feeUsdt = Math.round(usdtAmount * FEE_PCT) / 100; // 1.13
const totalUsdt = Math.round((usdtAmount + feeUsdt) * 100) / 100; // 284.69

const fmtUsdt = (n: number) =>
  n.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function P2PPayPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("scan");
  const [paying, setPaying] = useState(false);

  const pay = () => {
    if (paying) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setStep("success");
    }, 1200);
  };

  const miniSteps = [
    { icon: ScanLine, label: t("Scanner", "Scan") },
    { icon: Check, label: t("Confirmer", "Confirm") },
    { icon: Zap, label: t("Payé en secondes", "Paid in seconds") },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      {/* local keyframes for the scanner line */}
      <style>{`
        @keyframes nimba-scanline {
          0% { top: 10%; }
          50% { top: 86%; }
          100% { top: 10%; }
        }
      `}</style>

      <div>
        <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <QrCode className="h-5 w-5 text-brand-500" aria-hidden />
          {t("Payer un commerçant (QR)", "Pay a merchant (QR)")}
        </h1>
        <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Payez en USDT — le commerçant reçoit des GNF instantanément (démo).",
            "Pay in USDT — the merchant receives GNF instantly (demo)."
          )}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* ————— main column ————— */}
        <div className="space-y-4">
          {step === "scan" && (
            <Card className="card-pad">
              <div className="mx-auto flex max-w-sm flex-col items-center py-4 text-center">
                {/* scanner viewport */}
                <div className="relative flex h-56 w-56 items-center justify-center overflow-hidden rounded-2xl bg-brand-950 lg:h-64 lg:w-64">
                  {/* corner brackets */}
                  <span className="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-white" aria-hidden />
                  <span className="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-white" aria-hidden />
                  <span className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-white" aria-hidden />
                  <span className="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-white" aria-hidden />
                  <FakeQr />
                  {/* animated scan line */}
                  <span
                    className="absolute left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-brand-400 to-transparent"
                    style={{ animation: "nimba-scanline 2.4s ease-in-out infinite" }}
                    aria-hidden
                  />
                </div>

                <p className="mt-4 text-sm font-semibold">
                  {t("Scannez le code du commerçant", "Scan the merchant's code")}
                </p>
                <p className="mt-1 text-xs text-ink-muted dark:text-[#8FA79C]">
                  {t(
                    "Caméra simulée — prototype investisseur.",
                    "Simulated camera — investor prototype."
                  )}
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setStep("confirm")}
                >
                  {t("Utiliser une facture démo", "Use a demo invoice")}
                </Button>

                {/* mini steps */}
                <div className="mt-6 flex w-full items-center justify-center gap-2">
                  {miniSteps.map((s, i) => (
                    <React.Fragment key={s.label}>
                      {i > 0 && (
                        <span className="h-px w-4 bg-line dark:bg-night-lineStrong" aria-hidden />
                      )}
                      <span className="inline-flex items-center gap-1.5 text-2xs font-semibold text-ink-secondary dark:text-[#B7C9C0]">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
                          <s.icon className="h-3 w-3" aria-hidden />
                        </span>
                        {s.label}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {step === "confirm" && (
            <Card className="card-pad">
              {/* merchant */}
              <div className="flex items-start gap-3">
                <Avatar initials="FE" hue={152} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold">Boutique Fatim Électronique</p>
                    <Pill tone="green">
                      <BadgeCheck className="h-3 w-3" aria-hidden />
                      {t("Commerçant vérifié", "Verified merchant")}
                    </Pill>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                    {t("Marché Madina · Matam", "Madina Market · Matam")}
                  </p>
                </div>
              </div>

              {/* invoice */}
              <div className="mt-4 rounded-xl border border-line bg-surface-sunken/60 p-3 text-xs dark:border-night-lineStrong dark:bg-night-raised">
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted dark:text-[#8FA79C]">
                    {t("Réf", "Ref")} FACT-0342
                  </span>
                  <span className="font-semibold tabular-nums">{formatGnf(AMOUNT_GNF)}</span>
                </div>
                <p className="mt-1.5 font-medium">
                  {t(
                    "Téléviseur Samsung 55” + installation",
                    "Samsung 55” TV + installation"
                  )}
                </p>
              </div>

              {/* conversion */}
              <dl className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted dark:text-[#8FA79C]">{t("Taux", "Rate")}</dt>
                  <dd className="font-semibold tabular-nums">
                    1 USDT = {formatNumber(demoUsdtRateGnf)} GNF
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted dark:text-[#8FA79C]">
                    {t("Vous payez", "You pay")}
                  </dt>
                  <dd className="font-semibold tabular-nums">≈ {fmtUsdt(usdtAmount)} USDT</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted dark:text-[#8FA79C]">
                    {t("Frais Nimba (0,4 %)", "Nimba fee (0.4%)")}
                  </dt>
                  <dd className="font-semibold tabular-nums">≈ {fmtUsdt(feeUsdt)} USDT</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-2 dark:border-night-lineStrong">
                  <dt className="font-semibold">{t("Total débité", "Total debited")}</dt>
                  <dd className="text-sm font-bold tabular-nums">
                    ≈ {fmtUsdt(totalUsdt)} USDT
                  </dd>
                </div>
              </dl>

              {/* wallet balance */}
              <div className="mt-3 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-xs dark:bg-brand-900/40">
                <span className="inline-flex items-center gap-1.5 text-brand-800 dark:text-brand-200">
                  <Wallet className="h-3.5 w-3.5" aria-hidden />
                  {t("Solde du portefeuille", "Wallet balance")}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold tabular-nums text-brand-800 dark:text-brand-200">
                  {formatNumber(WALLET_USDT)} USDT
                  <Check className="h-3.5 w-3.5 text-brand-600 dark:text-brand-300" aria-hidden />
                  <span className="font-medium">{t("suffisant", "sufficient")}</span>
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button size="lg" full onClick={pay} disabled={paying}>
                  {paying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      {t("Traitement…", "Processing…")}
                    </>
                  ) : (
                    <>{t(`Payer ${fmtUsdt(totalUsdt)} USDT`, `Pay ${fmtUsdt(totalUsdt)} USDT`)}</>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setStep("scan")}
                  disabled={paying}
                >
                  {t("Annuler", "Cancel")}
                </Button>
              </div>
            </Card>
          )}

          {step === "success" && (
            <Card className="card-pad">
              <div className="flex flex-col items-center py-2 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/60">
                  <CheckCircle2 className="h-8 w-8 text-brand-500" aria-hidden />
                </div>
                <p className="mt-3 text-base font-bold">
                  {t("Paiement effectué", "Payment complete")}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                  {t(
                    "Le commerçant reçoit 2 450 000 GNF sur Orange Money instantanément (démo).",
                    "The merchant receives 2,450,000 GNF on Orange Money instantly (demo)."
                  )}
                </p>
              </div>

              {/* receipt */}
              <div className="print-area mt-4 rounded-xl border border-dashed border-line p-4 text-xs dark:border-night-lineStrong">
                <p className="text-center text-sm font-extrabold tracking-tight">
                  NIMBA PAY {t("(démo)", "(demo)")}
                </p>
                <p className="text-center text-2xs text-ink-muted dark:text-[#8FA79C]">
                  NP-2026-1204
                </p>
                <dl className="mt-4 space-y-1.5">
                  {[
                    [t("Marchand", "Merchant"), "Boutique Fatim Électronique"],
                    [t("Montant", "Amount"), formatGnf(AMOUNT_GNF)],
                    ["USDT", `${fmtUsdt(usdtAmount)} USDT`],
                    [t("Taux", "Rate"), `1 USDT = ${formatNumber(demoUsdtRateGnf)} GNF`],
                    [t("Frais (0,4 %)", "Fee (0.4%)"), `${fmtUsdt(feeUsdt)} USDT`],
                    [t("Date", "Date"), t("24 août 2026, 14:32", "August 24, 2026, 2:32 PM")],
                    [t("Statut", "Status"), t("Réglé", "Settled")],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-ink-muted dark:text-[#8FA79C]">{k}</dt>
                      <dd className="text-right font-semibold tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button size="lg" full onClick={() => window.print()}>
                  <Printer className="h-4 w-4" aria-hidden />
                  {t("Imprimer le reçu", "Print receipt")}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  full
                  onClick={() => setStep("scan")}
                >
                  {t("Nouveau paiement", "New payment")}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* ————— right column ————— */}
        <div className="space-y-4">
          <Card className="card-pad">
            <h2 className="text-sm font-bold">
              {t("Pourquoi payer en USDT ?", "Why pay in USDT?")}
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-ink-secondary dark:text-[#B7C9C0]">
              {[
                t(
                  "Le commerçant reçoit des GNF instantanément.",
                  "The merchant receives GNF instantly."
                ),
                t("Pas de monnaie à rendre.", "No change to give back."),
                t(
                  "Reçu numérique pour les deux parties.",
                  "Digital receipt for both parties."
                ),
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="card-pad">
            <h2 className="flex items-center gap-1.5 text-sm font-bold">
              <Store className="h-4 w-4 text-brand-500" aria-hidden />
              {t("Pour les commerçants", "For merchants")}
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-ink-secondary dark:text-[#B7C9C0]">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                <span>{t("0,4 % par transaction.", "0.4% per transaction.")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden />
                <span>
                  {t(
                    "Versement Orange Money / MTN / Wave.",
                    "Payout via Orange Money / MTN / Wave."
                  )}
                </span>
              </li>
            </ul>
            <Button
              variant="blueSecondary"
              size="sm"
              full
              className="mt-4"
              onClick={() =>
                toast(
                  t(
                    "Inscription commerçant bientôt (démo)",
                    "Merchant sign-up coming soon (demo)"
                  ),
                  "info"
                )
              }
            >
              {t("Devenir commerçant partenaire", "Become a partner merchant")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
