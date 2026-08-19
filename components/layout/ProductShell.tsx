"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X, ArrowRight, type LucideIcon } from "lucide-react";
import {
  BrandBlock,
  SidebarNav,
  type NavSection,
  type SidebarTone,
} from "@/components/layout/Sidebar";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/Button";
import { classNames } from "@/lib/format";

export interface MobileTab {
  href: string;
  fr: string;
  en: string;
  icon: LucideIcon;
  exact?: boolean;
}

/**
 * Shared shell for the two Nimba products.
 * tone "green"  → P2P Exchange (dark forest sidebar, green accents)
 * tone "blue"   → Verified Marketplace (deep navy sidebar, blue accents)
 * Same company, same design system — different product identity.
 */
export function ProductShell({
  tone,
  subtitle,
  productLabel,
  sections,
  mobileTabs,
  sidebarCard,
  switcher,
  children,
}: {
  tone: SidebarTone;
  subtitle: string;
  productLabel: string;
  sections: NavSection[];
  mobileTabs: MobileTab[];
  sidebarCard?: React.ReactNode;
  /** Cross-product CTA rendered in the top bar. */
  switcher: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  const sidebarBg =
    tone === "green"
      ? "bg-gradient-to-b from-brand-900 to-brand-950"
      : "bg-gradient-to-b from-navy-900 to-navy-950";

  const sidebar = (
    <div className={classNames("flex h-full w-64 flex-col", sidebarBg)}>
      <div className={tone === "green" ? "rounded-br-[28px] bg-brand-950/40" : "rounded-br-[28px] bg-navy-950/50"}>
        <BrandBlock subtitle={subtitle} />
      </div>
      {sidebarCard && <div className="mx-3 mb-1 mt-3">{sidebarCard}</div>}
      <div className="mt-2 flex flex-1 flex-col overflow-hidden">
        <SidebarNav sections={sections} tone={tone} />
      </div>
    </div>
  );

  const activeTint =
    tone === "green"
      ? "text-brand-600 dark:text-brand-300"
      : "text-mkt-600 dark:text-mkt-300";

  return (
    <div className="mx-auto flex min-h-screen max-w-shell">
      <aside className="sticky top-0 hidden h-screen shrink-0 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-brand-950/60"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex">
            {sidebar}
            <button
              className="m-2 h-8 w-8 self-start rounded-full bg-white/10 p-1.5 text-white"
              onClick={() => setOpen(false)}
              aria-label={t("Fermer le menu", "Close menu")}
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

          <span
            className={classNames(
              "hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex",
              tone === "green"
                ? "bg-brand-50 text-brand-800 dark:bg-brand-900/60 dark:text-brand-200"
                : "bg-mkt-50 text-mkt-700 dark:bg-navy-800 dark:text-mkt-200"
            )}
          >
            {productLabel}
          </span>

          {switcher}

          <div className="ml-auto flex items-center gap-1.5">
            <span
              className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-2xs font-bold text-amber-800 sm:hidden dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
              title="Investor demo"
            >
              {t("Démo", "Demo")}
            </span>
            <span
              className="hidden items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-semibold md:inline-flex dark:border-night-lineStrong"
              title={t("Devise : franc guinéen", "Currency: Guinean franc")}
            >
              <span className="flex h-3 w-4 overflow-hidden rounded-[2px]" aria-hidden>
                <span className="w-1/3 bg-gn-red" />
                <span className="w-1/3 bg-gn-yellow" />
                <span className="w-1/3 bg-gn-green" />
              </span>
              GNF
            </span>
            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="rounded-lg px-2 py-1.5 text-xs font-bold text-ink-secondary hover:bg-surface-sunken dark:text-[#B7C9C0] dark:hover:bg-night-raised"
              aria-label={t("Changer de langue", "Switch language")}
            >
              {lang.toUpperCase()}
            </button>
            <button
              onClick={toggle}
              className="rounded-lg p-2 text-ink-secondary hover:bg-surface-sunken dark:text-[#B7C9C0] dark:hover:bg-night-raised"
              aria-label={t("Basculer le thème", "Toggle theme")}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <Link
              href="/account/profile"
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 hover:bg-surface-sunken dark:hover:bg-night-raised"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-900 text-2xs font-bold text-brand-100">
                MO
              </span>
              <span className="hidden text-xs font-semibold sm:block">
                Mohamed
                <span className={classNames("block text-2xs font-medium", activeTint)}>
                  {t("Vérifié · Démo", "Verified · Demo")}
                </span>
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-8">{children}</main>

        {/* mobile bottom navigation */}
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden dark:border-night-line dark:bg-night-card/95"
          aria-label={t("Navigation mobile", "Mobile navigation")}
        >
          <div
            className={classNames(
              "grid",
              mobileTabs.length <= 4 ? "grid-cols-4" : "grid-cols-5"
            )}
          >
            {mobileTabs.map((tab) => {
              const active = tab.exact
                ? pathname === tab.href
                : pathname === tab.href || pathname.startsWith(tab.href + "/");
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href + tab.fr}
                  href={tab.href}
                  className={classNames(
                    "flex min-w-0 flex-col items-center gap-0.5 px-1 py-2 text-2xs font-semibold",
                    active ? activeTint : "text-ink-muted dark:text-[#8FA79C]"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  <span className="max-w-full truncate">{lang === "fr" ? tab.fr : tab.en}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

/** Compact cross-product switch — the single switch control on product pages. */
export function ProductSwitcher({ current }: { current: "p2p" | "marketplace" }) {
  const { t } = useI18n();
  if (current === "p2p") {
    return (
      <Link href="/marketplace" title={t("Besoin d'un échangeur vérifié ?", "Need a verified exchanger?")}>
        <Button variant="blueSecondary" size="sm">
          Marketplace
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Button>
      </Link>
    );
  }
  return (
    <Link href="/p2p" title={t("Préférez l'échange direct ?", "Prefer direct peer trading?")}>
      <Button
        variant="secondary"
        size="sm"
        className="!text-brand-700 dark:!text-brand-300"
      >
        P2P
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Button>
    </Link>
  );
}
