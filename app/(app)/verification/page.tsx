"use client";

import React from "react";
import Link from "next/link";
import {
  UserCheck,
  Building2,
  MapPin,
  ShieldCheck,
  Check,
  Fingerprint,
  Smartphone,
  Mail,
  FileText,
  Users,
  Landmark,
  History,
  Scale,
  Lock,
} from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { HowItWorks, Footer } from "@/components/marketplace/BelowFold";
import { TrustStrip } from "@/components/marketplace/TrustStrip";
import { useI18n } from "@/lib/i18n";

export default function VerificationPage() {
  const { t } = useI18n();

  const levels = [
    {
      Icon: UserCheck,
      title: t("Identité vérifiée", "Identity Verified"),
      text: t(
        "Pièce d'identité, selfie de vivacité, téléphone et e-mail confirmés.",
        "ID document, liveness selfie, phone and email confirmed."
      ),
    },
    {
      Icon: Building2,
      title: t("Business vérifié", "Business Verified"),
      text: t(
        "Registre de commerce, propriétaire réel et informations business examinés.",
        "Business registration, beneficial owner and company details reviewed."
      ),
    },
    {
      Icon: MapPin,
      title: t("Lieu vérifié", "Location Verified"),
      text: t(
        "Adresse physique d'exploitation visitée et confirmée par l'équipe Nimba.",
        "Physical operating address visited and confirmed by the Nimba team."
      ),
    },
    {
      Icon: ShieldCheck,
      title: t("Vérification renforcée", "Enhanced Verification"),
      text: t(
        "Revue conformité, compte de règlement, historique d'exploitation — et dépôt de garantie lorsque requis.",
        "Compliance review, settlement account, operating history — and security deposit where required."
      ),
    },
  ];

  const checks = [
    { Icon: Fingerprint, label: t("Pièce d'identité", "ID document") },
    { Icon: UserCheck, label: t("Selfie / vivacité", "Selfie / liveness") },
    { Icon: Smartphone, label: t("Téléphone", "Phone") },
    { Icon: Mail, label: t("E-mail", "Email") },
    { Icon: FileText, label: t("Registre de commerce", "Business registration") },
    { Icon: Users, label: t("Propriétaire / bénéficiaire effectif", "Owner / beneficial owner") },
    { Icon: MapPin, label: t("Adresse physique d'exploitation", "Physical operating address") },
    { Icon: Landmark, label: t("Compte de règlement", "Settlement account") },
    { Icon: History, label: t("Historique d'exploitation", "Operating history") },
    { Icon: Scale, label: t("Revue conformité", "Compliance review") },
    { Icon: Lock, label: t("Dépôt de garantie (si requis)", "Security deposit (where required)") },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="max-w-2xl">
        <h1 className="text-xl font-extrabold">
          {t("Comment Nimba vérifie les partenaires", "How Nimba verifies providers")}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted dark:text-[#8FA79C]">
          {t(
            "La confiance vient des données, pas des slogans. Chaque partenaire passe une revue documentée avant d'apparaître sur le marché — et le niveau atteint est affiché sur son profil.",
            "Trust comes from data, not slogans. Every provider passes a documented review before appearing on the marketplace — and the level reached is shown on their profile."
          )}
        </p>
      </div>

      <section>
        <SectionTitle title={t("Niveaux de vérification", "Verification levels")} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {levels.map(({ Icon, title, text }, i) => (
            <Card key={title} className="card-pad">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
                  <Icon className="h-4.5 w-4.5" aria-hidden />
                </div>
                <span className="text-2xs font-bold text-ink-muted dark:text-[#8FA79C]">
                  {t("Niveau", "Level")} {i + 1}
                </span>
              </div>
              <p className="mt-2.5 text-[13px] font-bold">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
                {text}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title={t("Contrôles possibles", "Potential checks")}
          subtitle={t(
            "Selon le type de partenaire et le niveau demandé.",
            "Depending on provider type and requested level."
          )}
        />
        <Card className="card-pad">
          <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {checks.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-xs">
                <Icon className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                {label}
                <Check className="ml-auto h-3.5 w-3.5 text-brand-400" aria-hidden />
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-surface-sunken p-3 text-2xs leading-relaxed text-ink-muted dark:bg-night-raised dark:text-[#8FA79C]">
            {t(
              "Important : la vérification et l'abonnement sont deux choses distinctes. Le badge PRO est commercial ; il n'augmente jamais le niveau de vérification. Un partenaire doit d'abord passer la vérification.",
              "Important: verification and subscription are separate concepts. The PRO badge is commercial; it never increases the verification level. A provider must first pass verification."
            )}
          </p>
        </Card>
      </section>

      <HowItWorks />
      <TrustStrip />

      <Card className="card-pad flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold">
            {t("Vous êtes un business de liquidité ?", "Are you a liquidity business?")}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Faites-vous vérifier et rejoignez le réseau.",
              "Get verified and join the network."
            )}
          </p>
        </div>
        <Link href="/business/apply">
          <Button>{t("Démarrer la vérification", "Start verification")}</Button>
        </Link>
      </Card>

      <Footer />
    </div>
  );
}
