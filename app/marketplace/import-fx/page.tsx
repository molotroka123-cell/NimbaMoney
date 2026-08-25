"use client";

/**
 * Import FX — Entreprises (B2B, blue Marketplace product).
 *
 * Guinean banks cannot reliably supply USD to importers (FX reserves cover
 * ~2.2 months of imports). Nimba matches businesses with verified liquidity
 * providers; settlement is direct between the parties (non-custodial).
 * Everything simulated here is labeled "(démo)".
 */

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  Coins,
  FileText,
  Landmark,
  Layers,
  Paperclip,
  ReceiptText,
  ShieldCheck,
  X,
} from "lucide-react";
import { Card, Avatar, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";
import { providers } from "@/data/mock/providers";
import {
  classNames,
  formatAmountInput,
  formatGnf,
  formatNumber,
  parseAmount,
} from "@/lib/format";

/* ── Demo data (inline mock — no shared files touched) ─────────────── */

const DEMO_RATE_GNF_PER_USD = 8_560; // base rate (démo) → effective ≈ 8 700 GNF/USD with fees
const DAILY_LIMIT_GNF = 500_000_000;
const DEFAULT_AMOUNT_USD = 35_000;
const INVOICE_REF = "INV-2026-0812";
const REQUEST_REF = "IMP-2026-0455";

const company = {
  name: "SODIAG Import SARL",
  rccm: "GN.TCC.2024.B.01187",
  nif: "402-115-873-0021",
};

interface Tranche {
  providerId: string;
  name: string;
  initials: string;
  hue: number;
  amountUsd: number;
  feePct: number;
}

function buildSplit(amountUsd: number): Tranche[] {
  const kaba = providers.find((p) => p.id === "p1");
  const tymur = providers.find((p) => p.id === "p9");
  const t1: Tranche = {
    providerId: "p1",
    name: kaba?.name ?? "Kaba Trade",
    initials: kaba?.logoInitials ?? "KT",
    hue: kaba?.logoHue ?? 152,
    amountUsd: Math.min(amountUsd, 20_000),
    feePct: 1.6,
  };
  const rest = amountUsd - t1.amountUsd;
  if (rest <= 0) return [t1];
  const t2: Tranche = {
    providerId: "p9",
    name: tymur?.name ?? "Tymur MrSwap",
    initials: tymur?.logoInitials ?? "TM",
    hue: tymur?.logoHue ?? 200,
    amountUsd: rest,
    feePct: 1.7,
  };
  return [t1, t2];
}

type Purpose = "electronics" | "raw" | "auto" | "other";
type Rail = "usdt" | "bank" | "cash";

/* ── Small helpers ─────────────────────────────────────────────────── */

function formatUsd(n: number): string {
  return `${formatNumber(n)} USD`;
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function ImportFxPage() {
  const { t } = useI18n();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amountRaw, setAmountRaw] = useState(formatNumber(DEFAULT_AMOUNT_USD));
  const [purpose, setPurpose] = useState<Purpose>("electronics");
  const [invoiceAttached, setInvoiceAttached] = useState(false);
  const [rail, setRail] = useState<Rail>("usdt");
  const [ack, setAck] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const amountUsd = parseAmount(amountRaw);

  const purposes: { id: Purpose; label: string }[] = [
    { id: "electronics", label: t("Conteneur électronique", "Electronics container") },
    { id: "raw", label: t("Matières premières", "Raw materials") },
    { id: "auto", label: t("Pièces auto", "Auto parts") },
    { id: "other", label: t("Autre", "Other") },
  ];

  const rails: { id: Rail; label: string; Icon: typeof Coins }[] = [
    { id: "usdt", label: "USDT TRC20", Icon: Coins },
    { id: "bank", label: t("Virement bancaire", "Bank transfer"), Icon: Landmark },
    { id: "cash", label: t("Espèces", "Cash"), Icon: Banknote },
  ];

  const split = useMemo(() => buildSplit(amountUsd), [amountUsd]);
  const feeGnf = (tr: Tranche) =>
    Math.round(tr.amountUsd * DEMO_RATE_GNF_PER_USD * (tr.feePct / 100));
  const totalFeesGnf = split.reduce((s, tr) => s + feeGnf(tr), 0);
  const baseGnf = amountUsd * DEMO_RATE_GNF_PER_USD;
  const totalCostGnf = baseGnf + totalFeesGnf;
  const effectiveRate = amountUsd > 0 ? Math.round(totalCostGnf / amountUsd) : 0;

  const purposeLabel = purposes.find((p) => p.id === purpose)?.label ?? "";
  const railLabel = rails.find((r) => r.id === rail)?.label ?? "";

  const reset = () => {
    setStep(1);
    setAmountRaw(formatNumber(DEFAULT_AMOUNT_USD));
    setPurpose("electronics");
    setInvoiceAttached(false);
    setRail("usdt");
    setAck(false);
    setSubmitted(false);
  };

  const steps = [
    t("Besoin", "Need"),
    t("Répartition", "Allocation"),
    t("Confirmation", "Confirmation"),
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
            <Building2 className="h-5 w-5 text-mkt-500" aria-hidden />
            {t("Import FX — Entreprises", "Import FX — Businesses")}
          </h1>
          <span className="inline-flex items-center rounded-full bg-mkt-500 px-2.5 py-0.5 text-2xs font-bold tracking-wide text-white">
            {t("PRO / Entreprise", "PRO / Business")}
          </span>
        </div>
        <p className="mt-0.5 max-w-3xl text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Les banques guinéennes ne peuvent pas fournir assez de dollars aux importateurs (réserves de change ≈ 2,2 mois d'imports). Nimba vous connecte en quelques minutes à des partenaires de liquidité vérifiés — règlement direct, non-custodial.",
            "Guinean banks cannot supply enough dollars to importers (FX reserves ≈ 2.2 months of imports). Nimba connects you in minutes to verified liquidity providers — direct settlement, non-custodial."
          )}
        </p>
      </div>

      {/* ── KYB company card ── */}
      <Card className="card-pad">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mkt-500/10 text-mkt-600 dark:text-mkt-300">
            <Building2 className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold">{company.name}</h2>
              <Pill tone="green">
                <Check className="h-3 w-3" aria-hidden />
                {t("KYB vérifié (démo)", "KYB verified (demo)")}
              </Pill>
            </div>
            <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 text-xs sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                  RCCM
                </dt>
                <dd className="font-semibold tabular-nums">{company.rccm}</dd>
              </div>
              <div>
                <dt className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                  NIF
                </dt>
                <dd className="font-semibold tabular-nums">{company.nif}</dd>
              </div>
              <div>
                <dt className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                  {t("Secteur", "Sector")}
                </dt>
                <dd className="font-semibold">
                  {t("Électronique / import", "Electronics / import")}
                </dd>
              </div>
              <div>
                <dt className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                  {t("Limite journalière", "Daily limit")}
                </dt>
                <dd className="font-semibold tabular-nums">
                  {formatGnf(DAILY_LIMIT_GNF)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>

      {/* ── Wizard / success ── */}
      {submitted ? (
        <SuccessCard onReset={reset} split={split} />
      ) : (
        <Card className="card-pad">
          {/* Stepper */}
          <ol className="mb-5 flex items-center gap-2" aria-label={t("Étapes", "Steps")}>
            {steps.map((label, i) => {
              const n = (i + 1) as 1 | 2 | 3;
              const done = step > n;
              const current = step === n;
              return (
                <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
                  <span className="flex items-center gap-2">
                    <span
                      className={classNames(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-2xs font-bold",
                        done && "bg-mkt-500 text-white",
                        current && "bg-mkt-500/15 text-mkt-600 ring-2 ring-mkt-500 dark:text-mkt-300",
                        !done &&
                          !current &&
                          "bg-line text-ink-muted dark:bg-night-lineStrong dark:text-[#8FA79C]"
                      )}
                      aria-current={current ? "step" : undefined}
                    >
                      {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : n}
                    </span>
                    <span
                      className={classNames(
                        "text-xs font-semibold max-sm:hidden",
                        current
                          ? "text-mkt-600 dark:text-mkt-300"
                          : "text-ink-muted dark:text-[#8FA79C]"
                      )}
                    >
                      {label}
                    </span>
                  </span>
                  {i < steps.length - 1 && (
                    <span
                      className={classNames(
                        "h-px flex-1",
                        done ? "bg-mkt-500" : "bg-line dark:bg-night-lineStrong"
                      )}
                      aria-hidden
                    />
                  )}
                </li>
              );
            })}
          </ol>

          {/* ── Step 1: Besoin ── */}
          {step === 1 && (
            <div className="space-y-4">
              <SectionTitle
                title={t("Votre besoin en devises", "Your FX need")}
                subtitle={t(
                  "Montant en dollars, objet de l'import et mode de règlement souhaité.",
                  "Dollar amount, import purpose and desired settlement rail."
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold">
                    {t("Montant (USD)", "Amount (USD)")}
                  </span>
                  <div className="relative">
                    <input
                      inputMode="numeric"
                      className="input-base pr-14 font-semibold tabular-nums"
                      value={amountRaw}
                      onChange={(e) => setAmountRaw(formatAmountInput(e.target.value))}
                      placeholder="35 000"
                      aria-label={t("Montant en USD", "Amount in USD")}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-bold text-ink-muted dark:text-[#8FA79C]">
                      USD
                    </span>
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold">
                    {t("Objet de l'import", "Import purpose")}
                  </span>
                  <select
                    className="input-base"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as Purpose)}
                  >
                    {purposes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Invoice upload (mock) */}
              <div>
                <span className="mb-1 block text-xs font-semibold">
                  {t("Facture commerciale", "Commercial invoice")}
                </span>
                {invoiceAttached ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-mkt-500/10 px-3 py-1.5 text-xs font-semibold text-mkt-700 ring-1 ring-mkt-500/30 dark:text-mkt-300">
                    <FileText className="h-3.5 w-3.5" aria-hidden />
                    {INVOICE_REF}.pdf
                    <button
                      type="button"
                      onClick={() => setInvoiceAttached(false)}
                      aria-label={t("Retirer la facture", "Remove invoice")}
                      className="rounded-full p-0.5 hover:bg-mkt-500/15"
                    >
                      <X className="h-3 w-3" aria-hidden />
                    </button>
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="blueSecondary"
                    size="sm"
                    onClick={() => {
                      setInvoiceAttached(true);
                      toast(
                        t(
                          `Facture ${INVOICE_REF} jointe (démo)`,
                          `Invoice ${INVOICE_REF} attached (demo)`
                        )
                      );
                    }}
                  >
                    <Paperclip className="h-3.5 w-3.5" aria-hidden />
                    {t("Joindre la facture (démo)", "Attach invoice (demo)")}
                  </Button>
                )}
              </div>

              {/* Settlement rail */}
              <div>
                <span className="mb-1 block text-xs font-semibold">
                  {t("Règlement souhaité", "Desired settlement rail")}
                </span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {rails.map(({ id, label, Icon }) => {
                    const active = rail === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setRail(id)}
                        aria-pressed={active}
                        className={classNames(
                          "flex items-center gap-2 rounded-control border px-3 py-2.5 text-left text-xs font-semibold transition-colors",
                          active
                            ? "border-mkt-500 bg-mkt-500/10 text-mkt-700 dark:text-mkt-300"
                            : "border-line text-ink-secondary hover:border-mkt-400 dark:border-night-lineStrong dark:text-[#CBDDD4]"
                        )}
                      >
                        <Icon
                          className={classNames(
                            "h-4 w-4",
                            active ? "text-mkt-500" : "text-ink-faint"
                          )}
                          aria-hidden
                        />
                        {label}
                        {active && (
                          <Check className="ml-auto h-3.5 w-3.5 text-mkt-500" aria-hidden />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="blue" disabled={amountUsd <= 0} onClick={() => setStep(2)}>
                  {t("Continuer", "Continue")}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2: Répartition ── */}
          {step === 2 && (
            <div className="space-y-4">
              <SectionTitle
                title={t("Répartition proposée", "Proposed allocation")}
                subtitle={
                  split.length > 1
                    ? t(
                        "Le montant dépasse la liquidité d'un seul partenaire — nous proposons une exécution par tranches sur 2 partenaires vérifiés.",
                        "The amount exceeds a single provider's liquidity — we propose a tranche execution across 2 verified providers."
                      )
                    : t(
                        "Un seul partenaire vérifié couvre l'intégralité du montant.",
                        "A single verified provider covers the full amount."
                      )
                }
              />

              <div className="grid gap-3 sm:grid-cols-2">
                {split.map((tr, i) => (
                  <Card key={tr.providerId} className="card-pad !shadow-none">
                    <div className="flex items-center gap-3">
                      <Avatar initials={tr.initials} hue={tr.hue} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold">{tr.name}</p>
                        <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                          {t("Tranche", "Tranche")} {i + 1} ·{" "}
                          {t("frais", "fee")} {tr.feePct.toFixed(1).replace(".", ",")}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold tabular-nums text-mkt-600 dark:text-mkt-300">
                          {formatUsd(tr.amountUsd)}
                        </p>
                        <p className="text-2xs tabular-nums text-ink-muted dark:text-[#8FA79C]">
                          {t("frais", "fees")} {formatGnf(feeGnf(tr))}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Cost summary */}
              <div className="rounded-card border border-mkt-500/25 bg-mkt-500/5 p-4">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-xs text-ink-muted dark:text-[#8FA79C]">
                      {t("Taux de base (démo)", "Base rate (demo)")}
                    </dt>
                    <dd className="font-semibold tabular-nums">
                      {formatNumber(DEMO_RATE_GNF_PER_USD)} GNF/USD
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-xs text-ink-muted dark:text-[#8FA79C]">
                      {t("Frais totaux", "Total fees")}
                    </dt>
                    <dd className="font-semibold tabular-nums">{formatGnf(totalFeesGnf)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-xs text-ink-muted dark:text-[#8FA79C]">
                      {t("Taux effectif", "Effective rate")}
                    </dt>
                    <dd className="font-semibold tabular-nums">
                      ≈ {formatNumber(effectiveRate)} GNF/USD
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-mkt-500/20 pt-1.5">
                    <dt className="text-xs font-bold">
                      {t("Coût total estimé", "Estimated total cost")}
                    </dt>
                    <dd className="text-base font-extrabold tabular-nums text-mkt-600 dark:text-mkt-300">
                      {formatGnf(totalCostGnf)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex justify-between">
                <Button variant="blueSecondary" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  {t("Retour", "Back")}
                </Button>
                <Button variant="blue" onClick={() => setStep(3)}>
                  {t("Continuer", "Continue")}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 3 && (
            <div className="space-y-4">
              <SectionTitle
                title={t("Confirmation", "Confirmation")}
                subtitle={t(
                  "Vérifiez le récapitulatif avant de créer la demande.",
                  "Review the summary before creating the request."
                )}
              />

              <div className="scroll-x">
                <table className="w-full min-w-[420px] text-sm">
                  <tbody className="divide-y divide-line dark:divide-night-line">
                    {[
                      { label: t("Entreprise", "Business"), value: company.name },
                      { label: t("Montant", "Amount"), value: formatUsd(amountUsd) },
                      { label: t("Objet", "Purpose"), value: purposeLabel },
                      {
                        label: t("Facture", "Invoice"),
                        value: invoiceAttached
                          ? `${INVOICE_REF}.pdf`
                          : t("Non jointe", "Not attached"),
                      },
                      { label: t("Règlement", "Settlement"), value: railLabel },
                      {
                        label: t("Répartition", "Allocation"),
                        value: split
                          .map((tr) => `${tr.name} — ${formatUsd(tr.amountUsd)}`)
                          .join(" · "),
                      },
                      {
                        label: t("Frais totaux", "Total fees"),
                        value: formatGnf(totalFeesGnf),
                      },
                      {
                        label: t("Taux effectif", "Effective rate"),
                        value: `≈ ${formatNumber(effectiveRate)} GNF/USD`,
                      },
                      {
                        label: t("Coût total estimé", "Estimated total cost"),
                        value: formatGnf(totalCostGnf),
                      },
                    ].map((row) => (
                      <tr key={row.label}>
                        <td className="td-cell w-44 text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                          {row.label}
                        </td>
                        <td className="td-cell font-semibold tabular-nums">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <label className="flex items-start gap-2.5 rounded-card border border-line p-3 text-xs dark:border-night-lineStrong">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-mkt-500"
                />
                <span>
                  {t(
                    "Je comprends que le règlement est direct entre mon entreprise et les partenaires (non-custodial). Nimba n'est pas une banque et ne détient pas les fonds.",
                    "I understand that settlement is direct between my business and the providers (non-custodial). Nimba is not a bank and does not hold the funds."
                  )}
                </span>
              </label>

              <div className="flex flex-wrap justify-between gap-2">
                <Button variant="blueSecondary" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  {t("Retour", "Back")}
                </Button>
                <Button
                  variant="blue"
                  disabled={!ack}
                  onClick={() => {
                    setSubmitted(true);
                    toast(
                      t(
                        `Demande ${REQUEST_REF} créée (démo)`,
                        `Request ${REQUEST_REF} created (demo)`
                      )
                    );
                  }}
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  {t("Créer la demande Import FX", "Create the Import FX request")}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── Bottom info strip ── */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            Icon: Building2,
            title: t("Limites entreprise", "Business limits"),
            body: t(
              "Jusqu'à 500M GNF par jour après vérification KYB de votre entreprise.",
              "Up to 500M GNF per day after your business passes KYB verification."
            ),
          },
          {
            Icon: Layers,
            title: t("Exécution par tranches", "Tranche execution"),
            body: t(
              "Les gros montants sont répartis sur plusieurs partenaires vérifiés pour être servis plus vite.",
              "Large amounts are split across several verified providers to be served faster."
            ),
          },
          {
            Icon: ReceiptText,
            title: t("Traçabilité", "Traceability"),
            body: t(
              "Chaque tranche est enregistrée, avec reçus imprimables pour votre comptabilité.",
              "Every tranche is logged, with printable receipts for your bookkeeping."
            ),
          },
        ].map(({ Icon, title, body }) => (
          <Card key={title} className="card-pad">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mkt-500/10 text-mkt-600 dark:text-mkt-300">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <div>
                <p className="text-[13px] font-bold">{title}</p>
                <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">{body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Success state ─────────────────────────────────────────────────── */

function SuccessCard({ onReset, split }: { onReset: () => void; split: Tranche[] }) {
  const { t } = useI18n();
  const { toast } = useToast();

  const t1 = split[0];
  const stages: { label: string; state: "done" | "current" | "pending" }[] = [
    { label: t("Demande créée", "Request created"), state: "done" },
    {
      label: t("Kaba Trade a accepté (2 min)", "Kaba Trade accepted (2 min)"),
      state: "done",
    },
    {
      label: t(
        `Tranche 1 réglée — ${formatNumber(t1?.amountUsd ?? 20_000)} USD`,
        `Tranche 1 settled — ${formatNumber(t1?.amountUsd ?? 20_000)} USD`
      ),
      state: "done",
    },
    {
      label: t("Tymur MrSwap a accepté", "Tymur MrSwap accepted"),
      state: "current",
    },
    { label: t("Tranche 2 en cours…", "Tranche 2 in progress…"), state: "pending" },
  ];

  return (
    <Card className="card-pad">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mkt-500/10">
          <CheckCircle2 className="h-6 w-6 text-mkt-500" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold">
            {t("Demande Import FX créée (démo)", "Import FX request created (demo)")}
          </h2>
          <p className="text-xs text-ink-muted dark:text-[#8FA79C]">
            {t("Référence", "Reference")}{" "}
            <span className="font-bold tabular-nums text-ink dark:text-white">
              {REQUEST_REF}
            </span>{" "}
            ·{" "}
            {t(
              "exécution par tranches en cours — règlement direct avec les partenaires.",
              "tranche execution underway — settling directly with the providers."
            )}
          </p>
        </div>
      </div>

      {/* Staged execution timeline */}
      <ol className="mt-5 space-y-0" aria-label={t("Chronologie d'exécution", "Execution timeline")}>
        {stages.map((s, i) => (
          <li key={s.label} className="relative flex gap-3 pb-5 last:pb-0">
            {i < stages.length - 1 && (
              <span
                className={classNames(
                  "absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px",
                  s.state === "done" ? "bg-mkt-500" : "bg-line dark:bg-night-lineStrong"
                )}
                aria-hidden
              />
            )}
            <span
              className={classNames(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                s.state === "done" && "bg-mkt-500 text-white",
                s.state === "current" &&
                  "bg-mkt-500/15 text-mkt-600 ring-2 ring-mkt-500 dark:text-mkt-300",
                s.state === "pending" &&
                  "bg-line text-ink-muted dark:bg-night-lineStrong dark:text-[#8FA79C]"
              )}
              aria-hidden
            >
              {s.state === "done" ? (
                <Check className="h-3.5 w-3.5" />
              ) : s.state === "current" ? (
                <span className="h-2 w-2 animate-pulse rounded-full bg-mkt-500" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </span>
            <div className="pt-0.5">
              <p
                className={classNames(
                  "text-sm font-semibold tabular-nums",
                  s.state === "pending" && "text-ink-muted dark:text-[#8FA79C]"
                )}
              >
                {s.label}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          variant="blue"
          onClick={() =>
            toast(
              t(
                `Suivi activé pour ${REQUEST_REF} (démo)`,
                `Tracking enabled for ${REQUEST_REF} (demo)`
              ),
              "info"
            )
          }
        >
          {t("Suivre la demande", "Track the request")}
        </Button>
        <Button variant="blueSecondary" onClick={onReset}>
          {t("Nouvelle demande", "New request")}
        </Button>
      </div>
    </Card>
  );
}
