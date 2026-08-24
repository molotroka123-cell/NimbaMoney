"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Store,
  Users,
  FileText,
  ArrowLeftRight,
  CornerDownLeft,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { classNames } from "@/lib/format";
import { providers } from "@/data/mock/providers";
import { traders, orders } from "@/data/mock/p2p";
import { requests } from "@/data/mock/requests";

interface Hit {
  id: string;
  label: string;
  sub: string;
  href: string;
  kind: "provider" | "trader" | "order" | "request" | "page";
}

/** ⌘K / Ctrl-K global search across providers, traders, orders, requests and pages. */
export function GlobalSearch() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const pages: Hit[] = useMemo(
    () => [
      { id: "pg1", label: t("Échange P2P", "P2P Exchange"), sub: "/p2p", href: "/p2p", kind: "page" },
      { id: "pg2", label: t("Marketplace vérifié", "Verified Marketplace"), sub: "/marketplace", href: "/marketplace", kind: "page" },
      { id: "pg3", label: t("Portefeuilles", "Wallets"), sub: "/p2p/wallets", href: "/p2p/wallets", kind: "page" },
      { id: "pg4", label: t("Tableau de bord partenaire", "Provider dashboard"), sub: "/partner", href: "/partner", kind: "page" },
      { id: "pg5", label: t("Console admin", "Admin console"), sub: "/admin", href: "/admin", kind: "page" },
      { id: "pg6", label: "Ops / Dispatch", sub: "/ops", href: "/ops", kind: "page" },
    ],
    [t]
  );

  const hits: Hit[] = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) {
      // sensible defaults: primary demo entities
      return [
        { id: "d1", label: "Kaba Trade", sub: t("Partenaire vérifié · PRO", "Verified provider · PRO"), href: "/marketplace/providers/kaba-trade", kind: "provider" },
        { id: "d2", label: "Tymur MrSwap", sub: t("Partenaire vérifié · PRO", "Verified provider · PRO"), href: "/marketplace/providers/tymur-mrswap", kind: "provider" },
        { id: "d3", label: "ORD-7305", sub: t("Ordre P2P en cours", "Active P2P order"), href: "/p2p/order/ORD-7305", kind: "order" },
        { id: "d4", label: "REQ-2418", sub: t("Demande Marketplace", "Marketplace request"), href: "/marketplace/request/REQ-2418", kind: "request" },
        ...pages.slice(0, 2),
      ];
    }
    const out: Hit[] = [];
    providers.forEach((p) => {
      if (p.name.toLowerCase().includes(needle))
        out.push({ id: `p-${p.id}`, label: p.name, sub: `${t("Partenaire", "Provider")} · ${p.locations[0].district}`, href: `/marketplace/providers/${p.slug}`, kind: "provider" });
    });
    traders.forEach((tr) => {
      if (tr.name.toLowerCase().includes(needle))
        out.push({ id: `t-${tr.id}`, label: tr.name, sub: `${t("Trader P2P", "P2P trader")} · ${tr.trades.toLocaleString("fr-FR")} trades`, href: "/p2p", kind: "trader" });
    });
    orders.forEach((o) => {
      if (o.id.toLowerCase().includes(needle))
        out.push({ id: `o-${o.id}`, label: o.id, sub: t("Ordre P2P", "P2P order"), href: `/p2p/order/${o.id}`, kind: "order" });
    });
    requests.forEach((r) => {
      if (r.id.toLowerCase().includes(needle))
        out.push({ id: `r-${r.id}`, label: r.id, sub: t("Demande Marketplace", "Marketplace request"), href: `/marketplace/request/${r.id}`, kind: "request" });
    });
    pages.forEach((pg) => {
      if (pg.label.toLowerCase().includes(needle)) out.push(pg);
    });
    return out.slice(0, 8);
  }, [q, pages, t]);

  const go = (h: Hit) => {
    setOpen(false);
    router.push(h.href);
  };

  const icons = {
    provider: Store,
    trader: Users,
    order: ArrowLeftRight,
    request: FileText,
    page: Search,
  } as const;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink-muted transition-colors hover:border-brand-400 hover:text-ink md:inline-flex dark:border-night-lineStrong dark:text-[#8FA79C] dark:hover:text-white"
        aria-label={t("Recherche globale", "Global search")}
      >
        <Search className="h-3.5 w-3.5" aria-hidden />
        <span className="max-lg:hidden">{t("Rechercher…", "Search…")}</span>
        <kbd className="rounded border border-line bg-surface-sunken px-1 text-2xs font-semibold dark:border-night-lineStrong dark:bg-night-raised">
          ⌘K
        </kbd>
      </button>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-ink-secondary hover:bg-surface-sunken md:hidden dark:text-[#B7C9C0] dark:hover:bg-night-raised"
        aria-label={t("Rechercher", "Search")}
      >
        <Search className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-brand-950/50 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute inset-x-3 top-16 mx-auto max-w-lg overflow-hidden rounded-2xl bg-white shadow-overlay sm:top-24 dark:bg-night-card">
            <div className="flex items-center gap-2.5 border-b border-line px-4 dark:border-night-line">
              <Search className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden />
              <input
                ref={inputRef}
                className="min-h-[48px] w-full bg-transparent text-sm outline-none placeholder:text-ink-faint"
                placeholder={t("Partenaire, trader, ORD-…, REQ-…, page", "Provider, trader, ORD-…, REQ-…, page")}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                  if (e.key === "Enter" && hits[active]) go(hits[active]);
                }}
              />
            </div>
            <ul className="max-h-80 overflow-y-auto p-1.5">
              {hits.length === 0 ? (
                <li className="px-3 py-6 text-center text-xs text-ink-muted dark:text-[#8FA79C]">
                  {t("Aucun résultat.", "No results.")}
                </li>
              ) : (
                hits.map((h, i) => {
                  const Icon = icons[h.kind];
                  return (
                    <li key={h.id}>
                      <button
                        className={classNames(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                          i === active
                            ? "bg-brand-50 dark:bg-brand-900/40"
                            : "hover:bg-surface-sunken dark:hover:bg-night-raised"
                        )}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(h)}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-ink-secondary dark:bg-night-raised dark:text-[#B7C9C0]">
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-bold">{h.label}</span>
                          <span className="block truncate text-2xs text-ink-muted dark:text-[#8FA79C]">{h.sub}</span>
                        </span>
                        {i === active && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden />}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
