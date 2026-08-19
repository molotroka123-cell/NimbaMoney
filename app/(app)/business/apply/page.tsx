"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Save, Upload } from "lucide-react";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { districts } from "@/config/product";
import { classNames } from "@/lib/format";

/**
 * Provider application wizard — 10 steps, save & continue later.
 * Validation via zod + react-hook-form; state persisted to localStorage.
 */
const schema = z.object({
  // 1. account
  email: z.string().email(),
  phone: z.string().min(8),
  // 2. owner identity
  ownerName: z.string().min(3),
  idNumber: z.string().min(4),
  // 3. business
  businessName: z.string().min(2),
  registrationNumber: z.string().min(3),
  // 4. location
  district: z.string().min(2),
  address: z.string().min(5),
  // 5. services
  services: z.array(z.string()).min(1),
  // 6. limits
  minLimit: z.string().min(1),
  maxLimit: z.string().min(1),
  // 7. settlement
  settlement: z.array(z.string()).min(1),
  // 9. compliance
  compliance: z.literal(true),
});

type FormData = z.infer<typeof schema>;

const stepFields: (keyof FormData)[][] = [
  ["email", "phone"],
  ["ownerName", "idNumber"],
  ["businessName", "registrationNumber"],
  ["district", "address"],
  ["services"],
  ["minLimit", "maxLimit"],
  ["settlement"],
  [], // documents (optional in prototype)
  ["compliance"],
  [], // review
];

const STORAGE_KEY = "nimba.apply.draft";

export default function ApplyPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const stepTitles = [
    t("Compte", "Account"),
    t("Identité du propriétaire", "Owner identity"),
    t("Informations business", "Business information"),
    t("Lieu", "Location"),
    t("Services", "Services"),
    t("Limites", "Limits"),
    t("Moyens de règlement", "Settlement methods"),
    t("Documents", "Documents"),
    t("Conformité", "Compliance"),
    t("Revue", "Review"),
  ];

  const {
    register,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      services: [],
      settlement: [],
      district: "Kaloum",
    },
  });

  // restore draft
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        Object.entries(draft.values ?? {}).forEach(([k, v]) =>
          setValue(k as keyof FormData, v as never)
        );
        if (typeof draft.step === "number") setStep(draft.step);
      } catch {
        /* ignore corrupt draft */
      }
    }
  }, [setValue]);

  const saveDraft = () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, values: getValues() })
    );
    toast(t("Brouillon enregistré — reprenez quand vous voulez.", "Draft saved — continue anytime."));
  };

  const next = async () => {
    const fields = stepFields[step];
    const ok = fields.length === 0 || (await trigger(fields));
    if (!ok) return;
    if (step === stepTitles.length - 1) {
      window.localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const services = watch("services") ?? [];
  const settlement = watch("settlement") ?? [];

  const serviceOptions = [
    "Virement → Espèces",
    "Espèces → Virement",
    "Orange Money → Espèces",
    "MTN MoMo → Espèces",
    "Espèces → Mobile Money",
    lang === "fr" ? "Paiement marchand" : "Merchant payment",
  ];
  const settlementOptions = [
    t("Compte bancaire (banque locale)", "Bank account (local bank)"),
    "Orange Money Business",
    "MTN MoMo Business",
    t("Espèces au guichet", "Cash at counter"),
  ];

  const toggle = (field: "services" | "settlement", value: string) => {
    const xs = field === "services" ? services : settlement;
    setValue(
      field,
      xs.includes(value) ? xs.filter((x) => x !== value) : [...xs, value],
      { shouldValidate: true }
    );
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg p-4 py-16 text-center lg:p-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/60">
          <Check className="h-7 w-7 text-brand-600 dark:text-brand-300" aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-extrabold">
          {t("Candidature envoyée", "Application submitted")}
        </h1>
        <p className="mt-2 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Référence APP-092. Notre équipe examine votre dossier sous 3 jours ouvrés. Vous serez contacté pour la visite du lieu d'exploitation.",
            "Reference APP-092. Our team reviews your file within 3 business days. You will be contacted for the operating-location visit."
          )}
        </p>
        <Link href="/partner" className="mt-6 inline-block">
          <Button>{t("Voir le tableau de bord partenaire", "See the provider dashboard")}</Button>
        </Link>
      </div>
    );
  }

  const err = (k: keyof FormData) =>
    errors[k] && (
      <p className="mt-1 text-2xs font-medium text-danger">
        {t("Champ requis ou invalide", "Required or invalid field")}
      </p>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-extrabold">
          {t("Candidature partenaire", "Provider application")}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t("Étape", "Step")} {step + 1}/{stepTitles.length} — {stepTitles[step]}
        </p>
      </div>

      {/* progress */}
      <div className="flex gap-1" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={10}>
        {stepTitles.map((_, i) => (
          <div
            key={i}
            className={classNames(
              "h-1.5 flex-1 rounded-full",
              i <= step ? "bg-brand-500" : "bg-line dark:bg-night-lineStrong"
            )}
          />
        ))}
      </div>

      <Card className="card-pad space-y-4">
        {step === 0 && (
          <>
            <Field label={t("E-mail professionnel", "Business email")}>
              <input className="input-base" type="email" {...register("email")} placeholder="contact@business.gn" />
              {err("email")}
            </Field>
            <Field label={t("Téléphone", "Phone")}>
              <input className="input-base" {...register("phone")} placeholder="+224 6XX XX XX XX" />
              {err("phone")}
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label={t("Nom complet du propriétaire", "Owner full name")}>
              <input className="input-base" {...register("ownerName")} />
              {err("ownerName")}
            </Field>
            <Field label={t("Numéro de pièce d'identité", "ID number")}>
              <input className="input-base" {...register("idNumber")} />
              {err("idNumber")}
            </Field>
            <UploadStub label={t("Pièce d'identité + selfie", "ID document + selfie")} />
          </>
        )}

        {step === 2 && (
          <>
            <Field label={t("Nom du business", "Business name")}>
              <input className="input-base" {...register("businessName")} />
              {err("businessName")}
            </Field>
            <Field label={t("Registre de commerce (RCCM)", "Business registration (RCCM)")}>
              <input className="input-base" {...register("registrationNumber")} />
              {err("registrationNumber")}
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field label={t("Quartier", "District")}>
              <select className="input-base" {...register("district")}>
                {districts.filter((d) => d !== "Tous les quartiers").map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              {err("district")}
            </Field>
            <Field label={t("Adresse du point de service", "Service point address")}>
              <input className="input-base" {...register("address")} />
              {err("address")}
            </Field>
          </>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="label-xs">{t("Services proposés", "Offered services")}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {serviceOptions.map((s) => (
                <CheckRow key={s} checked={services.includes(s)} onChange={() => toggle("services", s)} label={s} />
              ))}
            </div>
            {err("services")}
          </fieldset>
        )}

        {step === 5 && (
          <>
            <Field label={t("Limite minimum par transaction (GNF)", "Minimum per deal (GNF)")}>
              <input className="input-base tabular-nums" inputMode="numeric" {...register("minLimit")} placeholder="500 000" />
              {err("minLimit")}
            </Field>
            <Field label={t("Limite maximum par transaction (GNF)", "Maximum per deal (GNF)")}>
              <input className="input-base tabular-nums" inputMode="numeric" {...register("maxLimit")} placeholder="25 000 000" />
              {err("maxLimit")}
            </Field>
          </>
        )}

        {step === 6 && (
          <fieldset>
            <legend className="label-xs">{t("Comptes de règlement", "Settlement accounts")}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {settlementOptions.map((s) => (
                <CheckRow key={s} checked={settlement.includes(s)} onChange={() => toggle("settlement", s)} label={s} />
              ))}
            </div>
            {err("settlement")}
            <p className="mt-2 text-2xs text-ink-muted dark:text-[#8FA79C]">
              {t(
                "La propriété de chaque compte sera vérifiée avant activation.",
                "Ownership of each account is verified before activation."
              )}
            </p>
          </fieldset>
        )}

        {step === 7 && (
          <div className="space-y-3">
            <UploadStub label={t("Registre de commerce (PDF/photo)", "Business registration (PDF/photo)")} />
            <UploadStub label={t("Preuve d'adresse", "Address proof")} />
            <UploadStub label={t("Photo du point de service", "Service point photo")} />
          </div>
        )}

        {step === 8 && (
          <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line p-3 text-xs leading-relaxed dark:border-night-line">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-500" {...register("compliance")} />
            <span>
              {t(
                "Je certifie l'exactitude des informations fournies. J'accepte la revue KYC/KYB, les limites par transaction, la journalisation de chaque deal et la facturation mensuelle des commissions. Je comprends qu'un dépôt de garantie peut être requis.",
                "I certify the information provided is accurate. I accept KYC/KYB review, per-deal limits, logging of every deal and monthly commission billing. I understand a security deposit may be required."
              )}
            </span>
          </label>
        )}
        {step === 8 && err("compliance")}

        {step === 9 && (
          <div className="space-y-2 text-xs">
            <p className="text-sm font-bold">{t("Vérifiez votre dossier", "Review your file")}</p>
            {(
              [
                [t("E-mail", "Email"), getValues("email")],
                [t("Téléphone", "Phone"), getValues("phone")],
                [t("Propriétaire", "Owner"), getValues("ownerName")],
                [t("Business", "Business"), getValues("businessName")],
                [t("RCCM", "Registration"), getValues("registrationNumber")],
                [t("Quartier", "District"), getValues("district")],
                [t("Adresse", "Address"), getValues("address")],
                [t("Services", "Services"), (getValues("services") ?? []).join(", ")],
                [t("Limites", "Limits"), `${getValues("minLimit")} – ${getValues("maxLimit")} GNF`],
                [t("Règlement", "Settlement"), (getValues("settlement") ?? []).join(", ")],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line py-1.5 last:border-0 dark:border-night-line">
                <span className="text-ink-muted dark:text-[#8FA79C]">{k}</span>
                <span className="text-right font-semibold">{v || "—"}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-line pt-4 dark:border-night-line">
          <Button variant="ghost" size="sm" onClick={saveDraft}>
            <Save className="h-3.5 w-3.5" aria-hidden />
            {t("Enregistrer et continuer plus tard", "Save and continue later")}
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft className="h-4 w-4" aria-hidden />
                {t("Retour", "Back")}
              </Button>
            )}
            <Button onClick={next}>
              {step === stepTitles.length - 1
                ? t("Soumettre la candidature", "Submit application")
                : t("Continuer", "Continue")}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-xs">{label}</label>
      {children}
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      className={classNames(
        "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs font-medium",
        checked
          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/50"
          : "border-line dark:border-night-line"
      )}
    >
      <input type="checkbox" className="h-4 w-4 accent-brand-500" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function UploadStub({ label }: { label: string }) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [uploaded, setUploaded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        setUploaded(true);
        toast(t("Document ajouté (prototype)", "Document added (prototype)"));
      }}
      className={classNames(
        "flex w-full items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-3 text-xs font-medium",
        uploaded
          ? "border-brand-400 bg-brand-50 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200"
          : "border-line-strong text-ink-muted hover:border-brand-400 hover:text-brand-700 dark:border-night-lineStrong dark:text-[#8FA79C]"
      )}
    >
      <span>{label}</span>
      {uploaded ? (
        <Check className="h-4 w-4 text-brand-500" aria-hidden />
      ) : (
        <Upload className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
