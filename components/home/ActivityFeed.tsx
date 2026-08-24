"use client";

import React, { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { Card } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n";
import { classNames } from "@/lib/format";
import { liveActivity } from "@/data/mock/notifications";

/** Rotating "live" ecosystem activity strip for the home page (demo data). */
export function ActivityFeed() {
  const { lang, t } = useI18n();
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % liveActivity.length);
        setFade(true);
      }, 250);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // current + the two previous items, newest first
  const visible = [0, 1, 2].map(
    (off) => liveActivity[(idx - off + liveActivity.length * 2) % liveActivity.length]
  );

  return (
    <Card className="card-pad">
      <p className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
        </span>
        <Radio className="h-3.5 w-3.5" aria-hidden />
        {t("Activité en direct (démo)", "Live activity (demo)")}
      </p>
      <ul className="mt-2.5 space-y-2">
        {visible.map((a, i) => (
          <li
            key={`${a.fr}-${i}`}
            className={classNames(
              "flex items-start gap-2 text-xs transition-opacity duration-300",
              i === 0 ? (fade ? "opacity-100" : "opacity-0") : "opacity-60"
            )}
          >
            <span
              className={classNames(
                "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                a.tone === "green" ? "bg-brand-500" : "bg-mkt-500"
              )}
              aria-hidden
            />
            <span className={i === 0 ? "font-semibold" : undefined}>
              {lang === "fr" ? a.fr : a.en}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
