"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Store,
  FileText,
  Handshake,
  MessageSquare,
  Bookmark,
  User,
  LifeBuoy,
  Briefcase,
  LayoutDashboard,
  X,
  Users,
} from "lucide-react";
import {
  BrandBlock,
  SidebarNav,
  TrustFooter,
  type NavSection,
} from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { useI18n } from "@/lib/i18n";
import { threads } from "@/data/mock/messages";
import { enableTier2P2P } from "@/config/product";
import { classNames } from "@/lib/format";

const unread = threads.reduce((n, th) => n + th.unread, 0);

const sections: NavSection[] = [
  {
    items: [
      { href: "/", labelFr: "Accueil", labelEn: "Home", icon: Home, exact: true },
      { href: "/find", labelFr: "Trouver de la liquidité", labelEn: "Find liquidity", icon: Search },
      { href: "/providers", labelFr: "Partenaires d'échange", labelEn: "Exchange providers", icon: Store },
      ...(enableTier2P2P
        ? [{ href: "/p2p", labelFr: "P2P vérifié", labelEn: "Verified P2P", icon: Users }]
        : []),
      { href: "/requests", labelFr: "Demandes", labelEn: "Requests", icon: FileText },
      { href: "/account", labelFr: "Mes transactions", labelEn: "My deals", icon: Handshake },
      { href: "/messages", labelFr: "Messages", labelEn: "Messages", icon: MessageSquare, badge: unread },
      { href: "/account/saved", labelFr: "Partenaires enregistrés", labelEn: "Saved providers", icon: Bookmark },
      { href: "/account/profile", labelFr: "Profil", labelEn: "Profile", icon: User },
      { href: "/account/support", labelFr: "Support", labelEn: "Support", icon: LifeBuoy },
    ],
  },
  {
    titleFr: "Espace business",
    titleEn: "Business",
    items: [
      { href: "/business", labelFr: "Devenir partenaire", labelEn: "Become a provider", icon: Briefcase },
      { href: "/partner", labelFr: "Tableau de bord partenaire", labelEn: "Provider dashboard", icon: LayoutDashboard },
    ],
  },
];

const mobileTabs = [
  { href: "/", fr: "Accueil", en: "Home", icon: Home, exact: true },
  { href: "/find", fr: "Trouver", en: "Find", icon: Search },
  { href: "/requests", fr: "Demandes", en: "Requests", icon: FileText },
  { href: "/messages", fr: "Messages", en: "Messages", icon: MessageSquare },
  { href: "/account", fr: "Compte", en: "Account", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { lang, t } = useI18n();
  const pathname = usePathname();

  const sidebar = (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-brand-900 to-brand-950">
      <div className="rounded-br-[28px] bg-brand-950/40">
        <BrandBlock
          subtitle={t(
            "Marché de liquidité vérifié — Guinée",
            "Verified Liquidity Marketplace — Guinée"
          )}
        />
      </div>
      <div className="mt-3 flex flex-1 flex-col overflow-hidden">
        <SidebarNav sections={sections} footer={<TrustFooter />} />
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-shell">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen shrink-0 lg:block">
        {sidebar}
      </aside>

      {/* mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-brand-950/60"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex">
            {sidebar}
            <button
              className="m-2 h-8 w-8 self-start rounded-full bg-white/10 p-1.5 text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label={t("Fermer le menu", "Close menu")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 pb-20 lg:pb-8">{children}</main>

        {/* mobile bottom navigation */}
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden dark:border-night-line dark:bg-night-card/95"
          aria-label={t("Navigation mobile", "Mobile navigation")}
        >
          <div className="grid grid-cols-5">
            {mobileTabs.map((tab) => {
              const active = tab.exact
                ? pathname === tab.href
                : pathname === tab.href || pathname.startsWith(tab.href + "/");
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={classNames(
                    "flex flex-col items-center gap-0.5 py-2 text-2xs font-semibold",
                    active
                      ? "text-brand-600 dark:text-brand-300"
                      : "text-ink-muted dark:text-[#8FA79C]"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  {lang === "fr" ? tab.fr : tab.en}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
