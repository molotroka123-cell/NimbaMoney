"use client";

import React from "react";
import {
  Home,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  FileText,
  Wallet,
  MessageSquare,
  AlertTriangle,
  User,
  LifeBuoy,
  QrCode,
  Gift,
} from "lucide-react";
import { ProductShell, ProductSwitcher } from "@/components/layout/ProductShell";
import type { NavSection } from "@/components/layout/Sidebar";
import { useI18n } from "@/lib/i18n";
import { p2pThreads } from "@/data/mock/p2p";

const unread = p2pThreads.reduce((n, th) => n + th.unread, 0);

const sections: NavSection[] = [
  {
    items: [
      { href: "/", labelFr: "Accueil", labelEn: "Home", icon: Home, exact: true },
      { href: "/p2p", labelFr: "Trading P2P", labelEn: "P2P Trade", icon: ArrowLeftRight, exact: true },
      { href: "/p2p/buy", labelFr: "Acheter", labelEn: "Buy", icon: TrendingUp },
      { href: "/p2p/sell", labelFr: "Vendre", labelEn: "Sell", icon: TrendingDown },
      { href: "/p2p/orders", labelFr: "Ordres", labelEn: "Orders", icon: FileText },
      { href: "/p2p/wallets", labelFr: "Portefeuilles", labelEn: "Wallets", icon: Wallet },
      { href: "/p2p/pay", labelFr: "Payer (QR)", labelEn: "Pay (QR)", icon: QrCode },
      { href: "/p2p/messages", labelFr: "Messages", labelEn: "Messages", icon: MessageSquare, badge: unread },
      { href: "/p2p/disputes", labelFr: "Arbitrage", labelEn: "Arbitration", icon: AlertTriangle },
      { href: "/referral", labelFr: "Parrainage", labelEn: "Referral", icon: Gift },
      { href: "/account/profile", labelFr: "Profil", labelEn: "Profile", icon: User },
      { href: "/account/support", labelFr: "Support", labelEn: "Support", icon: LifeBuoy },
    ],
  },
];

const mobileTabs = [
  { href: "/", fr: "Accueil", en: "Home", icon: Home, exact: true },
  { href: "/p2p", fr: "Trading", en: "Trade", icon: ArrowLeftRight, exact: true },
  { href: "/p2p/orders", fr: "Ordres", en: "Orders", icon: FileText },
  { href: "/p2p/wallets", fr: "Solde", en: "Wallet", icon: Wallet },
  { href: "/p2p/messages", fr: "Messages", en: "Messages", icon: MessageSquare },
];

export function P2PShellNav({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <ProductShell
      tone="green"
      subtitle={t("Échange P2P — Guinée", "P2P Exchange — Guinea")}
      productLabel={t("P2P Exchange · Actif", "P2P Exchange · Active")}
      sections={sections}
      mobileTabs={mobileTabs}
      switcher={<ProductSwitcher current="p2p" />}
      sidebarCard={
        <div className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
          <p className="text-2xs font-bold uppercase tracking-wider text-brand-200/60">
            {t("Votre sécurité d'abord", "Your security is our priority")}
          </p>
          <p className="mt-1 text-2xs leading-relaxed text-brand-100/70">
            {t(
              "Traders vérifiés KYC · Protection Nimba (démo) · Support 24/7",
              "KYC-verified traders · Nimba protection (demo) · 24/7 support"
            )}
          </p>
        </div>
      }
    >
      {children}
    </ProductShell>
  );
}
