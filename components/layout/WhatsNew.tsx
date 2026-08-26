"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Briefcase,
  Send,
  MapPin,
  BadgeCheck,
  Vault,
  Scale,
  Gift,
  QrCode,
} from "lucide-react";
import { classNames } from "@/lib/format";

const KEY = "nimba.whatsnew.v3";

/** English-only, per user request: the swipeable release-notes popup. */
const slides = [
  {
    Icon: Briefcase,
    title: "Import FX for Business",
    text: "Banks can't supply USD? Request large amounts with staged execution across verified liquidity providers.",
    href: "/marketplace/import-fx",
  },
  {
    Icon: Send,
    title: "Send to Guinea",
    text: "Diaspora transfers France → Guinea for ~1.4% all-in, paid out to Orange Money in minutes — not 8-12% like legacy operators.",
    href: "/marketplace/diaspora",
  },
  {
    Icon: MapPin,
    title: "Cash Points Map",
    text: "Find verified partners across Conakry: districts, opening hours, USD cash availability.",
    href: "/marketplace/map",
  },
  {
    Icon: BadgeCheck,
    title: "KYC Levels",
    text: "Verify with Guinea's biometric national ID (demo) and unlock higher daily limits — up to business-grade.",
    href: "/kyc",
  },
  {
    Icon: Vault,
    title: "USD Vault",
    text: "Auto-buy USDT every week from Orange Money. Set a goal, watch your dollar savings grow.",
    href: "/p2p/wallets",
  },
  {
    Icon: Scale,
    title: "Arbitration Center 2.0",
    text: "Evidence files, a 24h SLA and reasoned rulings — plus a guarantee fund backing every order.",
    href: "/p2p/disputes",
  },
  {
    Icon: Gift,
    title: "Referral & Trader Tiers",
    text: "Invite friends — you both earn 20,000 GNF. Traders now carry Bronze, Silver and Gold medals.",
    href: "/referral",
  },
  {
    Icon: QrCode,
    title: "QR Merchant Pay",
    text: "Pay any verified merchant in USDT — they instantly receive GNF on mobile money.",
    href: "/p2p/pay",
  },
];

export function WhatsNew() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    // never fight the guided tour for the same corner: don't auto-open while a
    // tour is active, and close if one starts
    const onTour = () => setOpen(false);
    window.addEventListener("nimba:start-tour", onTour);
    let id: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!window.localStorage.getItem(KEY) && window.localStorage.getItem("nimba.tour") === null) {
        id = setTimeout(() => setOpen(true), 1200);
      }
    } catch { /* ignore */ }
    return () => {
      window.removeEventListener("nimba:start-tour", onTour);
      if (id) clearTimeout(id);
    };
  }, []);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    try {
      window.localStorage.setItem(KEY, "1");
    } catch { /* ignore */ }
  };
  const prev = () => setI((n) => Math.max(0, n - 1));
  const next = () => (i === slides.length - 1 ? close() : setI((n) => n + 1));
  const s = slides[i];
  const Icon = s.Icon;

  return (
    <div
      className="fixed z-[65] max-sm:inset-x-3 max-sm:bottom-20 sm:bottom-6 sm:right-6 sm:w-[340px]"
      role="dialog"
      aria-label="What's new"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (dx < -40 && i < slides.length - 1) setI((n) => n + 1);
        if (dx > 40) prev();
      }}
    >
      <div className="overflow-hidden rounded-2xl bg-brand-950/95 text-white shadow-overlay ring-1 ring-white/10 backdrop-blur">
        <div className="flex items-center justify-between px-4 pt-3">
          <p className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-brand-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            What&apos;s new · {i + 1}/{slides.length}
          </p>
          <button
            onClick={close}
            aria-label="Close"
            className="-mr-1.5 rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 pb-1 pt-2.5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/25 text-brand-300">
              <Icon className="h-4.5 w-4.5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/75">{s.text}</p>
              <Link
                href={s.href}
                onClick={close}
                className="mt-1.5 inline-block text-xs font-bold text-brand-300 hover:text-brand-200"
              >
                Try it →
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-2">
          <div className="flex items-center gap-1.5">
            {slides.map((_, d) => (
              <button
                key={d}
                onClick={() => setI(d)}
                className={classNames(
                  "h-1.5 rounded-full transition-all",
                  d === i ? "w-4 bg-brand-300" : "w-1.5 bg-white/25 hover:bg-white/40"
                )}
                aria-label={`Slide ${d + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              disabled={i === 0}
              aria-label="Previous"
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-600"
            >
              {i === slides.length - 1 ? "Done" : "Next"}
              {i < slides.length - 1 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
