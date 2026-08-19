"use client";

import React from "react";
import {
  Home,
  Store,
  Building2,
  Star,
  Droplets,
  Zap,
  Clock,
  FileText,
  Bookmark,
  MessageSquare,
  LifeBuoy,
} from "lucide-react";
import { ProductShell, ProductSwitcher } from "@/components/layout/ProductShell";
import type { NavSection } from "@/components/layout/Sidebar";
import { useI18n } from "@/lib/i18n";
import { threads } from "@/data/mock/messages";

const unread = threads.reduce((n, th) => n + th.unread, 0);

const sections: NavSection[] = [
  {
    items: [
      { href: "/", labelFr: "Accueil", labelEn: "Home", icon: Home, exact: true },
      { href: "/marketplace", labelFr: "Marketplace", labelEn: "Marketplace", icon: Store, exact: true },
      { href: "/marketplace/providers", labelFr: "Partenaires", labelEn: "Providers", icon: Building2 },
      { href: "/marketplace/requests", labelFr: "Mes demandes", labelEn: "My requests", icon: FileText },
      { href: "/marketplace/saved", labelFr: "Enregistrés", labelEn: "Saved", icon: Bookmark },
      { href: "/marketplace/messages", labelFr: "Messages", labelEn: "Messages", icon: MessageSquare, badge: unread },
      { href: "/account/support", labelFr: "Support", labelEn: "Support", icon: LifeBuoy },
    ],
  },
  {
    titleFr: "Filtres rapides",
    titleEn: "Quick filters",
    items: [
      { href: "/marketplace?filter=top_rated", labelFr: "Mieux notés", labelEn: "Top rated", icon: Star },
      { href: "/marketplace?filter=high_liquidity", labelFr: "Forte liquidité", labelEn: "High liquidity", icon: Droplets },
      { href: "/marketplace?filter=fast_response", labelFr: "Réponse rapide", labelEn: "Fast response", icon: Zap },
      { href: "/marketplace?filter=open_now", labelFr: "Ouvert maintenant", labelEn: "Open now", icon: Clock },
    ],
  },
];

const mobileTabs = [
  { href: "/", fr: "Accueil", en: "Home", icon: Home, exact: true },
  { href: "/marketplace", fr: "Comparer", en: "Compare", icon: Store, exact: true },
  { href: "/marketplace/requests", fr: "Demandes", en: "Requests", icon: FileText },
  { href: "/marketplace/saved", fr: "Favoris", en: "Saved", icon: Bookmark },
  { href: "/marketplace/messages", fr: "Messages", en: "Messages", icon: MessageSquare },
];

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <ProductShell
      tone="blue"
      subtitle={t("Marketplace vérifié — Guinée", "Verified Marketplace — Guinea")}
      productLabel={t("Marketplace · Actif", "Marketplace · Active")}
      sections={sections}
      mobileTabs={mobileTabs}
      switcher={<ProductSwitcher current="marketplace" />}
      sidebarCard={
        <div className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
          <p className="text-2xs font-bold uppercase tracking-wider text-mkt-200/60">
            {t("Règlement direct", "Direct settlement")}
          </p>
          <p className="mt-1 text-2xs leading-relaxed text-mkt-100/70">
            {t(
              "Les fonds circulent directement entre vous et le partenaire vérifié. Nimba est la couche de matching et de confiance.",
              "Funds move directly between you and the verified provider. Nimba is the matching and trust layer."
            )}
          </p>
        </div>
      }
    >
      {children}
    </ProductShell>
  );
}
