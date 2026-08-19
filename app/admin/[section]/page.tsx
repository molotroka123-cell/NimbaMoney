"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Hammer } from "lucide-react";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

const titles: Record<string, [string, string]> = {
  kyc: ["KYC / KYB", "KYC / KYB"],
  requests: ["Demandes", "Requests"],
  deals: ["Transactions", "Deals"],
  reviews: ["Avis", "Reviews"],
  listings: ["Fiches", "Listings"],
  featured: ["Emplacements payants", "Featured placement"],
  subscriptions: ["Abonnements", "Subscriptions"],
  users: ["Utilisateurs", "Users"],
  audit: ["Journal d'audit", "Audit log"],
  settings: ["Paramètres", "Settings"],
};

export default function AdminSectionPage() {
  const { section } = useParams<{ section: string }>();
  const { lang, t } = useI18n();
  const title = titles[section]
    ? lang === "fr"
      ? titles[section][0]
      : titles[section][1]
    : section;

  return (
    <Card className="mx-auto mt-10 max-w-md p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/60">
        <Hammer className="h-6 w-6 text-brand-500" aria-hidden />
      </div>
      <h1 className="mt-3 text-base font-extrabold">{title}</h1>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
        {t(
          "Module en construction pour le prototype. Les candidatures, litiges, risques et la réconciliation sont déjà fonctionnels.",
          "Module under construction in the prototype. Applications, disputes, risk and reconciliation are already functional."
        )}
      </p>
      <Link href="/admin" className="mt-5 inline-block">
        <Button variant="secondary" size="sm">
          {t("← Tableau de bord", "← Dashboard")}
        </Button>
      </Link>
    </Card>
  );
}
