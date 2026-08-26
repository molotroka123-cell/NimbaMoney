"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ArrowLeftRight, Store, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { classNames } from "@/lib/format";
import { notifications } from "@/data/mock/notifications";

/** Header bell with a dropdown of demo notifications; read state persists locally. */
export function Notifications() {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setRead(JSON.parse(window.localStorage.getItem("nimba.notifs.read") ?? "[]"));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const unread = notifications.filter((n) => !read.includes(n.id)).length;

  const markAll = () => {
    const ids = notifications.map((n) => n.id);
    setRead(ids);
    try {
      window.localStorage.setItem("nimba.notifs.read", JSON.stringify(ids));
    } catch { /* ignore */ }
  };
  const markOne = (id: string) => {
    const next = Array.from(new Set([...read, id]));
    setRead(next);
    try {
      window.localStorage.setItem("nimba.notifs.read", JSON.stringify(next));
    } catch { /* ignore */ }
  };

  const kindIcon = { p2p: ArrowLeftRight, market: Store, system: Info } as const;
  const kindTint = {
    p2p: "bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300",
    market: "bg-mkt-50 text-mkt-600 dark:bg-navy-800 dark:text-mkt-300",
    system: "bg-surface-sunken text-ink-secondary dark:bg-night-raised dark:text-[#B7C9C0]",
  } as const;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg p-2 text-ink-secondary hover:bg-surface-sunken dark:text-[#B7C9C0] dark:hover:bg-night-raised"
        aria-label={t(`Notifications (${unread} non lues)`, `Notifications (${unread} unread)`)}
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-[60] w-[340px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-line bg-white shadow-overlay dark:border-night-line dark:bg-night-card">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5 dark:border-night-line">
            <p className="text-sm font-bold">Notifications</p>
            <button
              onClick={markAll}
              className="inline-flex items-center gap-1 text-2xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden />
              {t("Tout marquer lu", "Mark all read")}
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = kindIcon[n.kind];
              const isRead = read.includes(n.id);
              return (
                <li key={n.id}>
                  <Link
                    href={n.href}
                    onClick={() => {
                      markOne(n.id);
                      setOpen(false);
                    }}
                    className={classNames(
                      "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-sunken dark:hover:bg-night-raised",
                      !isRead && "bg-brand-50/50 dark:bg-brand-900/20"
                    )}
                  >
                    <span className={classNames("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", kindTint[n.kind])}>
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className={classNames("block text-xs leading-snug", !isRead && "font-semibold")}>
                        {lang === "fr" ? n.fr : n.en}
                      </span>
                      <span className="mt-0.5 block text-2xs text-ink-muted dark:text-[#8FA79C]">
                        {lang === "fr" ? n.when : n.whenEn}
                      </span>
                    </span>
                    {!isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
