"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, type LucideIcon } from "lucide-react";
import { classNames } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export interface NavItem {
  href: string;
  labelFr: string;
  labelEn: string;
  icon: LucideIcon;
  badge?: number;
  exact?: boolean;
}

export interface NavSection {
  titleFr?: string;
  titleEn?: string;
  items: NavItem[];
}

/** Logo mark: three mountain peaks (Mont Nimba). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden fill="none">
      <path d="M2 22L11 6l6 10 3-5 4 7 5-12 7 16H2z" fill="currentColor" />
      <path
        d="M11 6l6 10 3-5"
        stroke="#0B1512"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
    </svg>
  );
}

export function BrandBlock({ subtitle }: { subtitle: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-4 py-5">
      <LogoMark className="h-6 w-10 text-brand-300" />
      <div className="leading-tight">
        <div className="text-[15px] font-extrabold tracking-tight text-white">
          NIMBA <span className="text-brand-300">MONEY</span>
        </div>
        <div className="mt-0.5 text-2xs font-medium text-brand-200/70">
          {subtitle}
        </div>
      </div>
    </Link>
  );
}

export function SidebarNav({
  sections,
  footer,
}: {
  sections: NavSection[];
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { lang, t } = useI18n();

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4" aria-label="Navigation">
      {sections.map((section, si) => (
        <div key={si} className={si > 0 ? "mt-4" : ""}>
          {section.titleFr && (
            <p className="mb-1.5 px-3 text-2xs font-bold uppercase tracking-wider text-brand-200/50">
              {lang === "fr" ? section.titleFr : section.titleEn}
            </p>
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href + "/")) ||
                  (item.href !== "/" && pathname === item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={classNames(
                      "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                      active
                        ? "bg-brand-500 text-white shadow-sm"
                        : "text-brand-100/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon
                      className={classNames(
                        "h-4 w-4 shrink-0",
                        active ? "text-white" : "text-brand-300/80 group-hover:text-brand-200"
                      )}
                      aria-hidden
                    />
                    <span className="flex-1 truncate">
                      {lang === "fr" ? item.labelFr : item.labelEn}
                    </span>
                    {item.badge ? (
                      <span className="rounded-full bg-brand-300 px-1.5 text-2xs font-bold text-brand-950">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="mt-auto pt-4">{footer}</div>
    </nav>
  );
}

export function TrustFooter() {
  const { t } = useI18n();
  return (
    <div className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-brand-300" aria-hidden />
        <p className="text-2xs font-bold text-white">
          {t("Confiance & sécurité", "Trust & safety")}
        </p>
      </div>
      <p className="mt-1.5 text-2xs leading-relaxed text-brand-100/60">
        {t(
          "Partenaires vérifiés · Règlement direct · Chaque transaction est enregistrée",
          "Verified providers · Direct settlement · Every deal is logged"
        )}
      </p>
      <Link
        href="/verification"
        className="mt-2 inline-block text-2xs font-semibold text-brand-300 hover:text-brand-200"
      >
        {t("Statut de vérification →", "Verification status →")}
      </Link>
    </div>
  );
}
