"use client";

import React, { useEffect, useRef } from "react";
import { demoAssets } from "@/config/product";
import { classNames } from "@/lib/format";

type Props = {
  value: string;
  onChange: (id: string) => void;
  /** restrict to a subset of ids (defaults to every demo currency) */
  options?: readonly string[];
  label?: string;
  className?: string;
};

/**
 * Swipeable currency chooser: fiat (USD, EUR, GBP) first, crypto as one option
 * among the rest. Horizontal scroll-snap on touch, arrow keys on desktop.
 */
export function CurrencySwipe({ value, onChange, options, label, className }: Props) {
  const list = demoAssets.filter((a) => !options || options.includes(a.id));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[aria-checked="true"]');
    const box = ref.current;
    if (!el || !box) return;
    // scroll only the strip itself — never the page
    box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [value]);

  const onKey = (e: React.KeyboardEvent) => {
    const i = list.findIndex((a) => a.id === value);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(list[Math.min(list.length - 1, i + 1)].id);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(list[Math.max(0, i - 1)].id);
    }
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKey}
      className={classNames(
        "flex w-0 min-w-full snap-x snap-mandatory gap-1.5 overflow-x-auto px-0.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {list.map((a) => {
        const on = a.id === value;
        return (
          <button
            key={a.id}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(a.id)}
            className={classNames(
              "inline-flex shrink-0 snap-center items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
              on
                ? "border-brand-500 bg-brand-500 text-white shadow-sm"
                : "border-line bg-white text-ink hover:border-brand-300 dark:border-night-lineStrong dark:bg-night-card dark:text-white/80"
            )}
          >
            <span aria-hidden>{a.flag || a.symbol}</span>
            {a.id}
            {a.kind === "crypto" && (
              <span className={classNames("text-[9px] font-semibold uppercase", on ? "text-white/70" : "text-ink-muted")}>
                crypto
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
