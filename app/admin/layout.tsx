"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  Fingerprint,
  FileText,
  Handshake,
  AlertTriangle,
  Flag,
  Star,
  Store,
  Megaphone,
  CreditCard,
  Users,
  ScrollText,
  Settings,
  Scale,
  Menu,
  X,
} from "lucide-react";
import {
  BrandBlock,
  SidebarNav,
  type NavSection,
} from "@/components/layout/Sidebar";
import { useI18n } from "@/lib/i18n";
import { Pill } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const sections: NavSection[] = [
  {
    items: [
      { href: "/admin", labelFr: "Tableau de bord", labelEn: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/providers", labelFr: "Candidatures partenaires", labelEn: "Provider applications", icon: Inbox },
      { href: "/admin/kyc", labelFr: "KYC / KYB", labelEn: "KYC / KYB", icon: Fingerprint },
      { href: "/admin/requests", labelFr: "Demandes", labelEn: "Requests", icon: FileText },
      { href: "/admin/deals", labelFr: "Transactions", labelEn: "Deals", icon: Handshake },
      { href: "/admin/disputes", labelFr: "Litiges", labelEn: "Disputes", icon: AlertTriangle },
      { href: "/admin/risk", labelFr: "Signaux de risque", labelEn: "Risk flags", icon: Flag },
      { href: "/admin/reconciliation", labelFr: "Réconciliation", labelEn: "Reconciliation", icon: Scale },
    ],
  },
  {
    titleFr: "Marché",
    titleEn: "Marketplace",
    items: [
      { href: "/admin/reviews", labelFr: "Avis", labelEn: "Reviews", icon: Star },
      { href: "/admin/listings", labelFr: "Fiches", labelEn: "Listings", icon: Store },
      { href: "/admin/featured", labelFr: "Emplacements payants", labelEn: "Featured placement", icon: Megaphone },
      { href: "/admin/subscriptions", labelFr: "Abonnements", labelEn: "Subscriptions", icon: CreditCard },
      { href: "/admin/users", labelFr: "Utilisateurs", labelEn: "Users", icon: Users },
      { href: "/admin/audit", labelFr: "Journal d'audit", labelEn: "Audit log", icon: ScrollText },
      { href: "/admin/settings", labelFr: "Paramètres", labelEn: "Settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-[#0B2B26] to-brand-950">
      <div className="rounded-br-[28px] bg-brand-950/40">
        <BrandBlock subtitle={t("Console d'administration", "Admin console")} />
      </div>
      <div className="mx-3 mb-1 mt-3">
        <Pill tone="amber">{t("Accès restreint", "Restricted access")}</Pill>
      </div>
      <SidebarNav sections={sections} />
    </div>
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-shell">
      <aside className="sticky top-0 hidden h-screen shrink-0 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-brand-950/60" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex">
            {sidebar}
            <button
              className="m-2 h-8 w-8 self-start rounded-full bg-white/10 p-1.5 text-white"
              onClick={() => setOpen(false)}
              aria-label={t("Fermer", "Close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-line bg-white/90 px-4 backdrop-blur dark:border-night-line dark:bg-night-card/90 lg:px-6">
          <button
            className="rounded-md p-2 text-ink-muted hover:bg-surface-sunken lg:hidden dark:hover:bg-night-raised"
            onClick={() => setOpen(true)}
            aria-label={t("Ouvrir le menu", "Open menu")}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-bold">{t("Administration", "Admin")}</h1>
          <span className="text-2xs text-ink-muted dark:text-[#8FA79C]">admin.fode</span>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/ops">
              <Button variant="secondary" size="sm">{t("Ops / Dispatch", "Ops / Dispatch")}</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">{t("← Marché", "← Marketplace")}</Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
