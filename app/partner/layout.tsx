"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  Droplets,
  MapPin,
  Star,
  MessageSquare,
  BarChart3,
  BadgeCheck,
  CreditCard,
  UserPlus,
  Settings,
  Menu,
  X,
  ExternalLink,
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
      { href: "/partner", labelFr: "Aperçu", labelEn: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/partner/leads", labelFr: "Leads", labelEn: "Leads", icon: Users },
      { href: "/partner/requests", labelFr: "Demandes", labelEn: "Requests", icon: FileText },
      { href: "/partner/services", labelFr: "Services", labelEn: "Services", icon: Wrench },
      { href: "/partner/liquidity", labelFr: "Liquidité", labelEn: "Liquidity", icon: Droplets },
      { href: "/partner/locations", labelFr: "Lieux", labelEn: "Locations", icon: MapPin },
      { href: "/partner/reviews", labelFr: "Avis", labelEn: "Reviews", icon: Star },
      { href: "/partner/messages", labelFr: "Messages", labelEn: "Messages", icon: MessageSquare },
      { href: "/partner/analytics", labelFr: "Analytique", labelEn: "Analytics", icon: BarChart3 },
    ],
  },
  {
    titleFr: "Compte",
    titleEn: "Account",
    items: [
      { href: "/partner/verification", labelFr: "Vérification", labelEn: "Verification", icon: BadgeCheck },
      { href: "/partner/subscription", labelFr: "Abonnement", labelEn: "Subscription", icon: CreditCard },
      { href: "/partner/team", labelFr: "Équipe", labelEn: "Team", icon: UserPlus },
      { href: "/partner/settings", labelFr: "Paramètres", labelEn: "Settings", icon: Settings },
    ],
  },
];

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-brand-900 to-brand-950">
      <div className="rounded-br-[28px] bg-brand-950/40">
        <BrandBlock subtitle={t("Espace partenaire", "Provider dashboard")} />
      </div>
      <div className="mx-3 mb-2 mt-3 rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
        <p className="text-xs font-bold text-white">Kaba Trade</p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="rounded bg-brand-300 px-1 text-2xs font-bold text-brand-950">PRO</span>
          <span className="text-2xs text-brand-200/70">
            {t("Vérification renforcée", "Enhanced verification")}
          </span>
        </div>
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
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold">{t("Espace partenaire", "Provider dashboard")}</h1>
            <Pill tone="green">{t("En ligne", "Online")}</Pill>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/marketplace/providers/kaba-trade">
              <Button variant="secondary" size="sm">
                {t("Voir mon profil public", "View public profile")}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Button>
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
