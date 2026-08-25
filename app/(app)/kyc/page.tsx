"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Smartphone,
  IdCard,
  Building2,
  Check,
  X,
  ShieldCheck,
  Lock,
  Fingerprint,
  ScanLine,
  MapPin,
  Upload,
  FileCheck2,
  ChevronRight,
  BadgeCheck,
  Send,
} from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";
import { classNames } from "@/lib/format";

const STEP_KEY = "nimba.kyc.step";

type DocType = "cni" | "passport" | "rccm";
type WizardStep = 0 | 1 | 2 | 3; // 0 = wizard closed

function readStoredStep(): WizardStep {
  try {
    const raw = window.localStorage.getItem(STEP_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    return n === 1 || n === 2 || n === 3 ? (n as WizardStep) : 0;
  } catch {
    return 0;
  }
}

function storeStep(step: WizardStep) {
  try {
    if (step === 0) window.localStorage.removeItem(STEP_KEY);
    else window.localStorage.setItem(STEP_KEY, String(step));
  } catch {
    /* storage unavailable — demo continues in memory */
  }
}

export default function KycPage() {
  const { t } = useI18n();
  const { toast } = useToast();

  // ---- wizard state -------------------------------------------------------
  const [step, setStep] = useState<WizardStep>(0);
  // step 1 — document
  const [docType, setDocType] = useState<DocType>("cni");
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  // step 2 — address
  const [quartier, setQuartier] = useState("Kaloum");
  const [commune, setCommune] = useState("");
  const [proofUploaded, setProofUploaded] = useState(false);
  // step 3 — review
  const [submitted, setSubmitted] = useState(false);

  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wizardRef = useRef<HTMLDivElement>(null);

  // restore persisted step on mount
  useEffect(() => {
    setStep(readStoredStep());
    return () => {
      if (scanTimer.current) clearTimeout(scanTimer.current);
    };
  }, []);

  const goToStep = (s: WizardStep) => {
    setStep(s);
    storeStep(s);
  };

  const openWizard = () => {
    goToStep(step === 0 ? 1 : step);
    // let the wizard render, then bring it into view
    setTimeout(() => {
      wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const resetWizard = () => {
    goToStep(0);
    setDocType("cni");
    setScanning(false);
    setScanned(false);
    setQuartier("Kaloum");
    setCommune("");
    setProofUploaded(false);
    setSubmitted(false);
  };

  const startScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanned(false);
    scanTimer.current = setTimeout(() => {
      setScanning(false);
      setScanned(true);
      toast(
        t("Document vérifié via PN-RAVEC (démo)", "Document verified via PN-RAVEC (demo)")
      );
    }, 1500);
  };

  const uploadProof = () => {
    setProofUploaded(true);
    toast(
      t("Justificatif ajouté — facture_edg.pdf (démo)", "Proof added — facture_edg.pdf (demo)")
    );
  };

  const submitApplication = () => {
    setSubmitted(true);
    toast(
      t("Demande envoyée — examen sous 24 h (démo)", "Application sent — review within 24 h (demo)")
    );
  };

  // ---- static content -----------------------------------------------------
  const docOptions: { id: DocType; label: string; hint: string }[] = [
    {
      id: "cni",
      label: t("Carte nationale biométrique", "Biometric national ID card"),
      hint: t("PN-RAVEC · recommandé", "PN-RAVEC · recommended"),
    },
    {
      id: "passport",
      label: t("Passeport", "Passport"),
      hint: t("Vérification standard", "Standard verification"),
    },
    {
      id: "rccm",
      label: t("Registre de commerce (entreprise)", "Business registry (company)"),
      hint: t("Requis pour le KYB", "Required for KYB"),
    },
  ];

  const quartiers = ["Kaloum", "Dixinn", "Matam", "Ratoma", "Matoto"];

  const steps = [
    { n: 1 as const, label: t("Document", "Document") },
    { n: 2 as const, label: t("Adresse", "Address") },
    { n: 3 as const, label: t("Examen", "Review") },
  ];

  const levels: {
    n: 0 | 1 | 2;
    name: string;
    Icon: typeof Smartphone;
    limit: string;
    access: string;
    reqs: { text: string; done: boolean }[];
    pro?: boolean;
  }[] = [
    {
      n: 0,
      name: t("Départ", "Starter"),
      Icon: Smartphone,
      limit: t("500 000 GNF / jour", "500,000 GNF / day"),
      access: t("P2P uniquement", "P2P only"),
      reqs: [{ text: t("Téléphone vérifié", "Phone verified"), done: true }],
    },
    {
      n: 1,
      name: t("Identité", "Identity"),
      Icon: IdCard,
      limit: t("10 000 000 GNF / jour", "10,000,000 GNF / day"),
      access: "P2P + Marketplace",
      reqs: [
        {
          text: t(
            "Carte nationale biométrique (PN-RAVEC)",
            "Biometric national ID card (PN-RAVEC)"
          ),
          done: true,
        },
        { text: t("Selfie de vérification", "Verification selfie"), done: true },
      ],
    },
    {
      n: 2,
      name: t("Entreprise / Illimité", "Business / Unlimited"),
      Icon: Building2,
      limit: t("500M GNF / jour — limites étendues", "500M GNF / day — extended limits"),
      access: t("P2P + Marketplace + Import FX", "P2P + Marketplace + Import FX"),
      reqs: [
        { text: t("Justificatif d'adresse", "Proof of address"), done: false },
        { text: t("KYB entreprise", "Business KYB"), done: false },
      ],
      pro: true,
    },
  ];

  const CURRENT_LEVEL = 1;
  const NEXT_LEVEL = 2;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* scanner animation (scoped, demo-only) */}
      <style>{`
        @keyframes kyc-scan {
          0% { top: 8%; opacity: 0.2; }
          50% { opacity: 1; }
          100% { top: 88%; opacity: 0.2; }
        }
        .kyc-scan-line {
          animation: kyc-scan 1.4s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .kyc-scan-line { animation: none; top: 50%; }
        }
      `}</style>

      {/* 1 — header + current status */}
      <div>
        <h1 className="text-xl font-extrabold">
          {t("Vérification d'identité (KYC)", "Identity verification (KYC)")}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "La confiance est le cœur de Nimba : votre niveau de vérification définit vos limites et vos accès.",
            "Trust is the core of Nimba: your verification level defines your limits and access."
          )}
        </p>
      </div>

      <Card className="card-pad">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white">
              <ShieldCheck className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-extrabold">Mohamed Diallo</p>
              <p className="mt-1">
                <Pill tone="green">
                  <BadgeCheck className="h-3 w-3" aria-hidden />
                  {t("Niveau 1 · Vérifié", "Level 1 · Verified")}
                </Pill>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
              {t("Limite quotidienne", "Daily limit")}
            </p>
            <p className="mt-0.5 text-lg font-bold tabular-nums">
              {t("10 000 000 GNF / jour", "10,000,000 GNF / day")}
            </p>
          </div>
        </div>
        {/* progress dots */}
        <div className="mt-4 flex items-center gap-2 border-t border-line pt-3.5 dark:border-night-line">
          {[0, 1, 2].map((n) => (
            <React.Fragment key={n}>
              <div
                className={classNames(
                  "flex h-7 w-7 items-center justify-center rounded-full text-2xs font-bold",
                  n <= CURRENT_LEVEL
                    ? "bg-brand-500 text-white"
                    : "border border-dashed border-line text-ink-muted dark:border-night-lineStrong dark:text-[#8FA79C]"
                )}
                aria-label={t(`Niveau ${n}`, `Level ${n}`)}
              >
                {n < CURRENT_LEVEL ? <Check className="h-3.5 w-3.5" aria-hidden /> : n}
              </div>
              {n < 2 && (
                <div
                  className={classNames(
                    "h-0.5 flex-1 rounded-full",
                    n < CURRENT_LEVEL
                      ? "bg-brand-500"
                      : "bg-line dark:bg-night-lineStrong"
                  )}
                  aria-hidden
                />
              )}
            </React.Fragment>
          ))}
          <span className="ml-2 text-2xs text-ink-muted dark:text-[#8FA79C]">
            {t("Niveau 1 sur 2", "Level 1 of 2")}
          </span>
        </div>
      </Card>

      {/* 2 — levels comparison */}
      <section>
        <SectionTitle
          title={t("Niveaux de vérification", "Verification levels")}
          subtitle={t(
            "Plus votre niveau est élevé, plus vos limites et vos accès sont larges.",
            "The higher your level, the wider your limits and access."
          )}
        />
        <div className="grid gap-3 md:grid-cols-3">
          {levels.map(({ n, name, Icon, limit, access, reqs, pro }) => {
            const isCurrent = n === CURRENT_LEVEL;
            const isNext = n === NEXT_LEVEL;
            return (
              <Card
                key={n}
                className={classNames(
                  "card-pad flex flex-col",
                  isCurrent &&
                    "!border-brand-300 ring-2 ring-brand-300 dark:!border-brand-700 dark:ring-brand-700",
                  isNext &&
                    "border-dashed !border-brand-400 ring-1 ring-brand-200 dark:!border-brand-600 dark:ring-brand-800"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
                    <Icon className="h-4.5 w-4.5" aria-hidden />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {pro && (
                      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-2xs font-bold tracking-wide bg-brand-900 text-brand-100 dark:bg-brand-200 dark:text-brand-950">
                        PRO
                      </span>
                    )}
                    {isCurrent && (
                      <Pill tone="green">{t("Actuel", "Current")}</Pill>
                    )}
                    {isNext && (
                      <Pill tone="amber">{t("Suivant", "Next")}</Pill>
                    )}
                  </div>
                </div>

                <p className="mt-2.5 text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                  {t(`Niveau ${n}`, `Level ${n}`)}
                </p>
                <p className="text-sm font-extrabold">{name}</p>

                <ul className="mt-3 space-y-1.5">
                  {reqs.map((r) => (
                    <li key={r.text} className="flex items-start gap-2 text-xs">
                      <span
                        className={classNames(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          r.done
                            ? "bg-brand-500 text-white"
                            : "border border-dashed border-line text-ink-faint dark:border-night-lineStrong"
                        )}
                        aria-hidden
                      >
                        {r.done && <Check className="h-2.5 w-2.5" />}
                      </span>
                      <span
                        className={
                          r.done
                            ? ""
                            : "text-ink-muted dark:text-[#8FA79C]"
                        }
                      >
                        {r.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex-1 border-t border-line pt-3 dark:border-night-line">
                  <p className="text-xs font-bold tabular-nums">{limit}</p>
                  <p className="mt-0.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
                    {access}
                  </p>
                </div>

                {isNext && (
                  <div className="mt-3">
                    <Button size="sm" full onClick={openWizard}>
                      {t("Passer au niveau 2", "Upgrade to level 2")}
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3 — upgrade wizard */}
      {step > 0 && (
        <section ref={wizardRef}>
          <SectionTitle
            title={t("Passage au niveau 2 (démo)", "Upgrade to level 2 (demo)")}
            subtitle={t(
              "3 étapes — environ 2 minutes.",
              "3 steps — about 2 minutes."
            )}
            right={
              <Button variant="ghost" size="xs" onClick={resetWizard}>
                <X className="h-3.5 w-3.5" aria-hidden />
                {t("Fermer", "Close")}
              </Button>
            }
          />
          <Card className="card-pad">
            {/* stepper */}
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <React.Fragment key={s.n}>
                  <div className="flex items-center gap-2">
                    <span
                      className={classNames(
                        "flex h-7 w-7 items-center justify-center rounded-full text-2xs font-bold",
                        step > s.n
                          ? "bg-brand-500 text-white"
                          : step === s.n
                            ? "bg-brand-900 text-white dark:bg-brand-200 dark:text-brand-950"
                            : "border border-line text-ink-muted dark:border-night-lineStrong dark:text-[#8FA79C]"
                      )}
                    >
                      {step > s.n ? <Check className="h-3.5 w-3.5" aria-hidden /> : s.n}
                    </span>
                    <span
                      className={classNames(
                        "text-xs font-semibold max-sm:hidden",
                        step === s.n
                          ? ""
                          : "text-ink-muted dark:text-[#8FA79C]"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={classNames(
                        "h-0.5 flex-1 rounded-full",
                        step > s.n ? "bg-brand-500" : "bg-line dark:bg-night-lineStrong"
                      )}
                      aria-hidden
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* STEP 1 — document */}
            {step === 1 && (
              <div className="mt-5 space-y-4">
                <div>
                  <p className="label-xs">
                    {t("Type de document", "Document type")}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {docOptions.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setDocType(d.id);
                          setScanned(false);
                        }}
                        className={classNames(
                          "rounded-control border px-3 py-2.5 text-left transition-colors",
                          docType === d.id
                            ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/60"
                            : "border-line bg-white hover:border-brand-300 dark:border-night-lineStrong dark:bg-night-raised"
                        )}
                      >
                        <p className="text-xs font-bold">{d.label}</p>
                        <p className="mt-0.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
                          {d.hint}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* stylized scanner frame */}
                <div className="mx-auto w-full max-w-sm">
                  <div className="relative aspect-[8/5] overflow-hidden rounded-2xl border border-line bg-brand-950/95 dark:border-night-lineStrong">
                    {/* corner brackets */}
                    <div className="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-brand-400" aria-hidden />
                    <div className="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-brand-400" aria-hidden />
                    <div className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-brand-400" aria-hidden />
                    <div className="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-brand-400" aria-hidden />
                    {/* animated scan line */}
                    {scanning && (
                      <div
                        className="kyc-scan-line absolute left-[8%] right-[8%] h-0.5 rounded-full bg-brand-400 shadow-[0_0_12px_2px_rgba(0,200,120,0.55)]"
                        aria-hidden
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                      {scanned ? (
                        <>
                          <FileCheck2 className="h-8 w-8 text-brand-300" aria-hidden />
                          <p className="text-xs font-semibold text-brand-100">
                            {t("Document capturé (démo)", "Document captured (demo)")}
                          </p>
                        </>
                      ) : scanning ? (
                        <>
                          <ScanLine className="h-8 w-8 animate-pulse text-brand-300" aria-hidden />
                          <p className="animate-pulse text-xs font-semibold text-brand-100">
                            {t("Analyse en cours…", "Scanning…")}
                          </p>
                        </>
                      ) : (
                        <>
                          <Fingerprint className="h-8 w-8 text-brand-300/70" aria-hidden />
                          <p className="px-6 text-xs text-brand-100/80">
                            {t(
                              "Placez le document dans le cadre",
                              "Place the document inside the frame"
                            )}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button full onClick={startScan} disabled={scanning}>
                      <ScanLine className="h-4 w-4" aria-hidden />
                      {scanning
                        ? t("Analyse…", "Scanning…")
                        : t("Scanner le document (démo)", "Scan document (demo)")}
                    </Button>
                  </div>
                </div>

                {/* extracted fields */}
                {scanned && (
                  <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-700 dark:bg-brand-900/40">
                    <p className="flex items-center gap-1.5 text-xs font-bold text-brand-800 dark:text-brand-200">
                      <BadgeCheck className="h-4 w-4" aria-hidden />
                      {t("Vérifié via PN-RAVEC (démo)", "Verified via PN-RAVEC (demo)")}
                    </p>
                    <dl className="mt-3 grid gap-x-4 gap-y-2 text-xs sm:grid-cols-2">
                      {[
                        { k: t("Nom", "Name"), v: "DIALLO Mohamed" },
                        { k: t("N° NIN", "NIN no."), v: "1987-XXXX-XXXX" },
                        { k: t("Née", "Born"), v: "12/04/1992" },
                        { k: t("Expire", "Expires"), v: "2033" },
                      ].map(({ k, v }) => (
                        <div key={k} className="flex items-baseline justify-between gap-2 sm:block">
                          <dt className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                            {k}
                          </dt>
                          <dd className="font-bold tabular-nums">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="flex justify-end border-t border-line pt-3.5 dark:border-night-line">
                  <Button onClick={() => goToStep(2)} disabled={!scanned}>
                    {t("Continuer", "Continue")}
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2 — address */}
            {step === 2 && (
              <div className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="kyc-quartier" className="label-xs">
                      {t("Quartier", "District")}
                    </label>
                    <select
                      id="kyc-quartier"
                      className="input-base"
                      value={quartier}
                      onChange={(e) => setQuartier(e.target.value)}
                    >
                      {quartiers.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="kyc-commune" className="label-xs">
                      {t("Commune", "Commune")}
                    </label>
                    <input
                      id="kyc-commune"
                      className="input-base"
                      placeholder={t("ex. Conakry", "e.g. Conakry")}
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <p className="label-xs">
                    {t("Justificatif d'adresse", "Proof of address")}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={uploadProof}>
                      <Upload className="h-4 w-4" aria-hidden />
                      {t(
                        "Facture EDG ou attestation (démo)",
                        "EDG bill or certificate (demo)"
                      )}
                    </Button>
                    {proofUploaded && (
                      <span className="chip chip-active">
                        <FileCheck2 className="h-3.5 w-3.5" aria-hidden />
                        facture_edg.pdf
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-line pt-3.5 dark:border-night-line">
                  <Button variant="ghost" onClick={() => goToStep(1)}>
                    {t("Retour", "Back")}
                  </Button>
                  <Button
                    onClick={() => goToStep(3)}
                    disabled={!proofUploaded || commune.trim() === ""}
                  >
                    {t("Continuer", "Continue")}
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3 — review */}
            {step === 3 &&
              (submitted ? (
                <div className="mt-5 flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/50">
                    <Send className="h-7 w-7 text-brand-500" aria-hidden />
                  </div>
                  <p className="text-sm font-extrabold">
                    {t(
                      "Demande envoyée — examen sous 24 h (démo)",
                      "Application sent — review within 24 h (demo)"
                    )}
                  </p>
                  <Pill tone="amber">{t("En examen", "Under review")}</Pill>
                  <p className="max-w-sm text-xs text-ink-muted dark:text-[#8FA79C]">
                    {t(
                      "Notre équipe de conformité vérifie vos documents. Vous recevrez une notification dès la validation.",
                      "Our compliance team is reviewing your documents. You will be notified as soon as it is approved."
                    )}
                  </p>
                  <div className="mt-2">
                    <Button variant="secondary" onClick={resetWizard}>
                      {t("Retour", "Back")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <p className="text-xs text-ink-muted dark:text-[#8FA79C]">
                    {t(
                      "Vérifiez le résumé avant l'envoi. L'examen prend au maximum 24 h (démo).",
                      "Check the summary before submitting. Review takes at most 24 h (demo)."
                    )}
                  </p>
                  <div className="divide-y divide-line rounded-xl border border-line dark:divide-night-line dark:border-night-line">
                    {[
                      {
                        Icon: IdCard,
                        k: t("Document", "Document"),
                        v: docOptions.find((d) => d.id === docType)?.label ?? "",
                        sub: t("Vérifié via PN-RAVEC (démo)", "Verified via PN-RAVEC (demo)"),
                      },
                      {
                        Icon: MapPin,
                        k: t("Adresse", "Address"),
                        v: `${quartier} · ${commune || "—"}`,
                        sub: proofUploaded
                          ? t("Justificatif : facture_edg.pdf", "Proof: facture_edg.pdf")
                          : t("Aucun justificatif", "No proof"),
                      },
                      {
                        Icon: Building2,
                        k: t("Niveau demandé", "Requested level"),
                        v: t("Niveau 2 · Entreprise / Illimité", "Level 2 · Business / Unlimited"),
                        sub: t("500M GNF / jour · Import FX", "500M GNF / day · Import FX"),
                      },
                    ].map(({ Icon, k, v, sub }) => (
                      <div key={k} className="flex items-start gap-3 p-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
                          <Icon className="h-4 w-4" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                            {k}
                          </p>
                          <p className="text-sm font-bold">{v}</p>
                          <p className="mt-0.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
                            {sub}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-line pt-3.5 dark:border-night-line">
                    <Button variant="ghost" onClick={() => goToStep(2)}>
                      {t("Retour", "Back")}
                    </Button>
                    <Button onClick={submitApplication}>
                      <Send className="h-4 w-4" aria-hidden />
                      {t("Envoyer la demande (démo)", "Submit application (demo)")}
                    </Button>
                  </div>
                </div>
              ))}
          </Card>
        </section>
      )}

      {/* 4 — bottom strip */}
      <section>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              Icon: ShieldCheck,
              title: t("Pourquoi le KYC ?", "Why KYC?"),
              text: t(
                "Chez Nimba, la confiance est le produit : chaque compte vérifié protège tout l'écosystème.",
                "At Nimba, trust is the product: every verified account protects the whole ecosystem."
              ),
            },
            {
              Icon: Lock,
              title: t("Vos données", "Your data"),
              text: t(
                "Vos documents sont chiffrés et jamais revendus — utilisés uniquement pour la vérification (démo).",
                "Your documents are encrypted and never resold — used only for verification (demo)."
              ),
            },
            {
              Icon: Fingerprint,
              title: "PN-RAVEC",
              text: t(
                "Vérification instantanée via l'identité biométrique nationale déployée en Guinée (démo).",
                "Instant verification via Guinea's national biometric identity system (demo)."
              ),
            },
          ].map(({ Icon, title, text }) => (
            <Card key={title} className="card-pad">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
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
    </div>
  );
}
