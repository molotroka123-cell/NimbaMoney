"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { trustScore } from "@/lib/trust";
import { classNames } from "@/lib/format";
import type { Provider } from "@/types";

const tone = (score: number) =>
  score >= 90 ? "text-emerald-500" : score >= 75 ? "text-mkt-500" : "text-amber-500";

/** Animated ring; the arc draws itself on mount. */
export function TrustRing({ score, size = 96 }: { score: number; size?: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(score));
    return () => cancelAnimationFrame(id);
  }, [score]);
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Trust score ${score} / 100`}>
      <svg viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-line dark:stroke-night-lineStrong" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          className={classNames("stroke-current transition-[stroke-dashoffset] duration-[1200ms] ease-out", tone(score))}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold tabular-nums leading-none">{score}</span>
        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-muted dark:text-[#8FA79C]">/100</span>
      </div>
    </div>
  );
}

/** Compact inline badge for lists. */
export function TrustBadge({ provider }: { provider: Provider }) {
  const { t } = useI18n();
  const { score } = trustScore(provider);
  return (
    <span
      title={t("Score de confiance Nimba (démo)", "Nimba Trust Score (demo)")}
      className={classNames(
        "inline-flex items-center gap-1 rounded-full bg-surface-sunken px-2 py-0.5 text-2xs font-bold dark:bg-night-raised",
        tone(score)
      )}
    >
      <ShieldCheck className="h-3 w-3" aria-hidden />
      {score}
    </span>
  );
}

/** Full card with breakdown bars — provider profile. */
export function TrustScoreCard({ provider }: { provider: Provider }) {
  const { lang, t } = useI18n();
  const tr = trustScore(provider);
  const label = { excellent: t("Excellent", "Excellent"), strong: t("Solide", "Strong"), fair: t("Correct", "Fair") }[tr.tier];
  return (
    <div className="card-pad rounded-card border border-line bg-white dark:border-night-line dark:bg-night-card">
      <div className="flex items-center gap-4">
        <TrustRing score={tr.score} />
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 text-sm font-bold">
            <ShieldCheck className={classNames("h-4 w-4", tone(tr.score))} aria-hidden />
            {t("Score de confiance", "Trust Score")}
          </h2>
          <p className={classNames("text-xs font-bold", tone(tr.score))}>{label}</p>
          <p className="mt-1 text-2xs leading-snug text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Calculé en direct : vérification, fiabilité, rapidité, expérience, avis (démo).",
              "Live-computed from verification, reliability, speed, track record and reviews (demo)."
            )}
          </p>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {tr.parts.map((x) => (
          <li key={x.id} className="text-2xs">
            <div className="flex justify-between font-semibold">
              <span>{lang === "fr" ? x.fr : x.en}</span>
              <span className="tabular-nums text-ink-muted dark:text-[#8FA79C]">{x.value}</span>
            </div>
            <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-surface-sunken dark:bg-night-raised">
              <div className={classNames("h-full rounded-full bg-current transition-[width] duration-1000", tone(x.value))} style={{ width: `${x.value}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
