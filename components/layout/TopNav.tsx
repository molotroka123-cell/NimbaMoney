"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { classNames } from "@/lib/format";

const links = [
  { href: "/p2p", fr: "P2P", en: "P2P" },
  { href: "/marketplace", fr: "Marketplace", en: "Marketplace" },
  { href: "/verification", fr: "Comment ça marche", en: "How it works" },
  { href: "/business", fr: "Business", en: "Business" },
  { href: "/partner/subscription", fr: "Tarifs", en: "Pricing" },
];

export function TopNav({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();
  const { toast } = useToast();
  const pathname = usePathname();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur dark:border-night-line dark:bg-night-card/90">
      <div className="flex h-14 items-center gap-2 px-4 lg:px-6">
        {/* mobile: open sidebar */}
        <button
          className="rounded-md p-2 text-ink-muted hover:bg-surface-sunken lg:hidden dark:hover:bg-night-raised"
          onClick={onOpenSidebar}
          aria-label={t("Ouvrir le menu", "Open menu")}
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Principale">
          {links.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={classNames(
                  "rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors",
                  active
                    ? "bg-brand-50 text-brand-800 dark:bg-brand-900/60 dark:text-brand-200"
                    : "text-ink-secondary hover:bg-surface-sunken hover:text-ink dark:text-[#B7C9C0] dark:hover:bg-night-raised dark:hover:text-white"
                )}
              >
                {lang === "fr" ? l.fr : l.en}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setHelpOpen(!helpOpen);
              toast(
                t(
                  "Centre d'aide — bientôt disponible. Support WhatsApp actif.",
                  "Help center — coming soon. WhatsApp support is live."
                ),
                "info"
              );
            }}
            className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-ink-secondary hover:bg-surface-sunken hover:text-ink dark:text-[#B7C9C0] dark:hover:bg-night-raised dark:hover:text-white"
          >
            {t("Aide", "Help")}
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* currency context — pilot is GNF-only */}
          <span
            className="hidden items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-semibold sm:inline-flex dark:border-night-lineStrong"
            title={t("Devise du pilote : franc guinéen", "Pilot currency: Guinean franc")}
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
            {lang === "fr" ? "FR" : "EN"}
            <ChevronDown className="ml-0.5 inline h-3 w-3" aria-hidden />
          </button>

          <button
            onClick={toggle}
            className="rounded-lg p-2 text-ink-secondary hover:bg-surface-sunken dark:text-[#B7C9C0] dark:hover:bg-night-raised"
            aria-label={t("Basculer le thème", "Toggle theme")}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          <Link
            href="/account"
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 hover:bg-surface-sunken dark:hover:bg-night-raised"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-900 text-2xs font-bold text-brand-100">
              MO
            </span>
            <span className="hidden text-xs font-semibold sm:block">
              Mohamed
              <span className="block text-2xs font-medium text-brand-600 dark:text-brand-300">
                {t("Vérifié", "Verified")}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
