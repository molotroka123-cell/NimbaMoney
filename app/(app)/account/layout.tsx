"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { classNames } from "@/lib/format";

const tabs = [
  { href: "/account", fr: "Aperçu", en: "Overview", exact: true },
  { href: "/marketplace/requests", fr: "Mes demandes", en: "My requests" },
  { href: "/account/deals", fr: "Transactions", en: "Completed deals" },
  { href: "/messages", fr: "Messages", en: "Messages" },
  { href: "/account/saved", fr: "Partenaires enregistrés", en: "Saved providers" },
  { href: "/account/profile", fr: "Profil", en: "Profile" },
  { href: "/account/security", fr: "Sécurité", en: "Security" },
  { href: "/account/support", fr: "Support", en: "Support" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-xl font-extrabold">{t("Mon compte", "My account")}</h1>
      <div className="scroll-x mt-3 flex gap-2 border-b border-line pb-px dark:border-night-line">
        {tabs.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={classNames(
                "shrink-0 border-b-2 px-2.5 pb-2 text-xs font-semibold transition-colors",
                active
                  ? "border-brand-500 text-brand-700 dark:text-brand-300"
                  : "border-transparent text-ink-muted hover:text-ink dark:text-[#8FA79C] dark:hover:text-white"
              )}
            >
              {lang === "fr" ? tab.fr : tab.en}
            </Link>
          );
        })}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
