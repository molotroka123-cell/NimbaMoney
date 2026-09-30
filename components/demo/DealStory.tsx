"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Sparkles, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { classNames } from "@/lib/format";

/**
 * 20-second animated replay of a large import deal on Nimba: request →
 * verified matching → staged execution across 3 providers → direct
 * settlement → receipt. Fully time-driven (scrubbable), no external assets.
 */
const DURATION = 20;
const OPEN_EVENT = "nimba:open-deal";
const HIDE_KEY = "nimba.dealstory.hidden";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
/** progress of the window [a,b] at time t, eased */
const seg = (t: number, a: number, b: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const IMPORTER = { x: 78, y: 180 };
const HUB = { x: 320, y: 180 };
const PROVIDERS = [
  { name: "Kaba Trade", amount: 20000, score: 96, x: 560, y: 66, start: 8, end: 12.5 },
  { name: "Tymur MrSwap", amount: 20000, score: 94, x: 560, y: 180, start: 9, end: 13.5 },
  { name: "Binta Express", amount: 10000, score: 91, x: 560, y: 294, start: 10, end: 14.5 },
];

const STEPS = [
  { at: 0, fr: "Demande d'import", en: "Import request" },
  { at: 2.5, fr: "Matching vérifié", en: "Verified matching" },
  { at: 5.5, fr: "Répartition en tranches", en: "Split in tranches" },
  { at: 8, fr: "Exécution", en: "Execution" },
  { at: 14.5, fr: "Règlement direct", en: "Direct settlement" },
  { at: 17.5, fr: "Reçu", en: "Receipt" },
];

const CAPTIONS: { until: number; fr: string; en: string }[] = [
  { until: 2.5, fr: "Un importateur demande 50 000 $ — sa banque ne peut pas fournir de dollars.", en: "An importer needs $50,000 — their bank can't supply dollars." },
  { until: 5.5, fr: "Nimba cherche uniquement des partenaires vérifiés avec la liquidité disponible.", en: "Nimba looks only at verified providers with the liquidity available." },
  { until: 8, fr: "La demande est répartie en tranches selon score de confiance et liquidité.", en: "The request is split by trust score and available liquidity." },
  { until: 14.5, fr: "Chaque partenaire accepte, envoie ses instructions et confirme — en parallèle.", en: "Each provider accepts, sends instructions and confirms — in parallel." },
  { until: 17.5, fr: "Règlement direct entre les parties : Nimba ne détient jamais les fonds.", en: "Direct settlement between parties: Nimba never holds the funds." },
  { until: 21, fr: "Terminé. Reçu généré, traçable, 3 partenaires vérifiés.", en: "Done. Receipt generated, fully traceable, 3 verified providers." },
];

function Line({ x1, y1, x2, y2, k, on }: { x1: number; y1: number; x2: number; y2: number; k: number; on?: boolean }) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,.09)" strokeWidth="2" />
      <line
        x1={x1}
        y1={y1}
        x2={lerp(x1, x2, k)}
        y2={lerp(y1, y2, k)}
        stroke={on ? "#34d399" : "#5eead4"}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </>
  );
}

/** dots travelling along a line, phase-shifted */
function Flow({ x1, y1, x2, y2, t, active, color = "#fbbf24" }: { x1: number; y1: number; x2: number; y2: number; t: number; active: boolean; color?: string }) {
  if (!active) return null;
  return (
    <>
      {[0, 0.33, 0.66].map((o) => {
        const k = (t * 0.55 + o) % 1;
        return <circle key={o} cx={lerp(x1, x2, k)} cy={lerp(y1, y2, k)} r={3.2} fill={color} opacity={0.35 + 0.65 * Math.sin(k * Math.PI)} />;
      })}
    </>
  );
}

function Scene({ t }: { t: number }) {
  const { t: tr } = useI18n();
  const amount = Math.round(50000 * seg(t, 0.3, 2.2));
  const appear = seg(t, 0, 0.8);
  const toHub = seg(t, 2.5, 4);
  const hubPulse = 1 + 0.06 * Math.sin(t * 5);
  const settled = seg(t, 14.5, 16);
  const receipt = seg(t, 17.5, 18.5);
  const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

  return (
    <svg viewBox="0 0 640 360" className="h-auto w-full" role="img" aria-label={tr("Animation d'une transaction Nimba en 20 secondes", "20-second animation of a Nimba deal")}>
      <defs>
        <radialGradient id="ds-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34d399" stopOpacity=".55" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* hub glow + rings */}
      <circle cx={HUB.x} cy={HUB.y} r={95 * hubPulse * toHub} fill="url(#ds-glow)" />
      {[0, 1, 2].map((i) => {
        const k = (t * 0.5 + i / 3) % 1;
        return (
          <circle key={i} cx={HUB.x} cy={HUB.y} r={34 + k * 60} fill="none" stroke="#34d399" strokeOpacity={(1 - k) * 0.35 * toHub} strokeWidth="1.5" />
        );
      })}

      {/* importer → hub */}
      <Line x1={IMPORTER.x + 52} y1={IMPORTER.y} x2={HUB.x - 36} y2={HUB.y} k={toHub} />
      <Flow x1={IMPORTER.x + 52} y1={IMPORTER.y} x2={HUB.x - 36} y2={HUB.y} t={t} active={t > 3.5 && t < 8} color="#5eead4" />

      {/* hub → providers */}
      {PROVIDERS.map((p, i) => {
        const k = seg(t, 5.5 + i * 0.7, 7 + i * 0.7);
        const done = t > p.end;
        return (
          <g key={p.name}>
            <Line x1={HUB.x + 36} y1={HUB.y} x2={p.x - 58} y2={p.y} k={k} on={done} />
            {/* execution flow: provider → hub → importer while running */}
            <Flow x1={p.x - 58} y1={p.y} x2={HUB.x + 36} y2={HUB.y} t={t + i} active={t > p.start + 1.5 && t < p.end + 1.5} />
          </g>
        );
      })}
      <Flow x1={HUB.x - 36} y1={HUB.y} x2={IMPORTER.x + 52} y2={IMPORTER.y} t={t} active={t > 11.5 && t < 16.5} />

      {/* importer card */}
      <g opacity={appear} transform={`translate(${IMPORTER.x - 60} ${IMPORTER.y - 46 + (1 - appear) * 14})`}>
        <rect width="112" height="92" rx="14" fill="#0b2b24" stroke={settled > 0.5 ? "#34d399" : "rgba(255,255,255,.18)"} strokeWidth="1.5" />
        <text x="12" y="22" fill="#94a3b8" fontSize="9.5" fontWeight="700" letterSpacing="1">
          {tr("IMPORTATEUR", "IMPORTER")}
        </text>
        <text x="12" y="52" fill="#fff" fontSize="21" fontWeight="800">
          {fmt(settled > 0.5 ? 50000 : amount)}
        </text>
        <text x="12" y="72" fill={settled > 0.5 ? "#34d399" : "#94a3b8"} fontSize="10" fontWeight="700">
          {settled > 0.5 ? tr("✓ Reçu", "✓ Received") : tr("Demande USD", "USD request")}
        </text>
      </g>

      {/* hub */}
      <g transform={`translate(${HUB.x} ${HUB.y}) scale(${(0.6 + 0.4 * appear) * hubPulse * 0.96})`}>
        <circle r="36" fill="#063F35" stroke="#34d399" strokeWidth="2.5" />
        <path d="M-17 12 L-6 -14 L2 2 L8 -8 L17 12 Z" fill="none" stroke="#34d399" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
        <text y="27" textAnchor="middle" fill="#a7f3d0" fontSize="8.5" fontWeight="800" letterSpacing="1.2">NIMBA</text>
      </g>
      <text x={HUB.x} y={HUB.y + 62} textAnchor="middle" fill="#94a3b8" fontSize="9.5" opacity={seg(t, 14.5, 15.5) * (1 - receipt)}>
        {tr("Non-custodial · règlement direct", "Non-custodial · direct settlement")}
      </text>

      {/* providers */}
      {PROVIDERS.map((p, i) => {
        const pop = seg(t, 6.3 + i * 0.7, 7.3 + i * 0.7);
        const run = clamp01((t - p.start) / (p.end - p.start));
        const stage = run <= 0 ? 0 : run < 0.34 ? 1 : run < 0.7 ? 2 : run < 1 ? 3 : 4;
        const labels = ["", tr("Accepté", "Accepted"), tr("Instructions", "Instructions"), tr("Virement…", "Transferring…"), tr("✓ Confirmé", "✓ Confirmed")];
        return (
          <g key={p.name} opacity={pop} transform={`translate(${p.x - 64} ${p.y - 34 + (1 - pop) * 12})`}>
            <rect width="132" height="68" rx="12" fill="#0b2b24" stroke={stage === 4 ? "#34d399" : "rgba(255,255,255,.18)"} strokeWidth="1.5" />
            <text x="10" y="18" fill="#fff" fontSize="11" fontWeight="800">{p.name}</text>
            <g transform="translate(96 6)">
              <rect width="28" height="16" rx="8" fill="rgba(52,211,153,.18)" />
              <text x="14" y="11.5" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="800">{p.score}</text>
            </g>
            <text x="10" y="36" fill="#a7f3d0" fontSize="13" fontWeight="800">{fmt(p.amount)}</text>
            <rect x="10" y="46" width="112" height="5" rx="2.5" fill="rgba(255,255,255,.1)" />
            <rect x="10" y="46" width={112 * run} height="5" rx="2.5" fill={stage === 4 ? "#34d399" : "#fbbf24"} />
            <text x="10" y="63" fill={stage === 4 ? "#34d399" : "#94a3b8"} fontSize="9" fontWeight="700">{labels[stage] || tr("Vérifié ✓", "Verified ✓")}</text>
          </g>
        );
      })}

      {/* receipt */}
      <g opacity={receipt} transform={`translate(${320 - 118} ${58 + (1 - receipt) * 22})`} style={{ pointerEvents: "none" }}>
        <rect width="236" height="170" rx="16" fill="#052e26" stroke="#34d399" strokeWidth="2" />
        <circle cx="30" cy="30" r="14" fill="#34d399" />
        <path d="M23 30 L28 35 L38 24" fill="none" stroke="#052e26" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="54" y="28" fill="#fff" fontSize="14" fontWeight="800">{tr("Transaction terminée", "Deal completed")}</text>
        <text x="54" y="43" fill="#94a3b8" fontSize="9.5">REQ-2418 · {tr("démo", "demo")}</text>
        {[
          [tr("Montant", "Amount"), "$50,000"],
          [tr("Partenaires", "Providers"), "3 verified"],
          [tr("Coût effectif", "Effective cost"), "≈ 1.6%"],
          [tr("Durée (démo)", "Duration (demo)"), "20 s"],
        ].map(([k, v], i) => (
          <g key={k as string} transform={`translate(16 ${72 + i * 24})`}>
            <text fill="#94a3b8" fontSize="10.5">{k}</text>
            <text x="204" textAnchor="end" fill="#fff" fontSize="11.5" fontWeight="800">{v}</text>
            <line x1="0" y1="8" x2="204" y2="8" stroke="rgba(255,255,255,.08)" />
          </g>
        ))}
      </g>

      {/* sparkles on completion */}
      {receipt > 0.4 &&
        Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const k = clamp01((t - 18) / 2);
          const r = 40 + k * 130 + (i % 3) * 14;
          return <circle key={i} cx={320 + Math.cos(a) * r * 1.5} cy={143 + Math.sin(a) * r * 0.9} r={2.6 * (1 - k) + 0.6} fill={i % 2 ? "#fbbf24" : "#34d399"} opacity={1 - k} />;
        })}
    </svg>
  );
}

export function DealStoryPlayer({ onClose }: { onClose: () => void }) {
  const { lang, t: tr } = useI18n();
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const last = useRef<number | null>(null);

  useEffect(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTime(DURATION - 0.5);
        setPlaying(false);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!playing) {
      last.current = null;
      return;
    }
    let raf = 0;
    const loop = (now: number) => {
      if (last.current !== null) {
        const dt = (now - last.current) / 1000;
        setTime((tm) => {
          const n = tm + dt;
          if (n >= DURATION) {
            setPlaying(false);
            return DURATION;
          }
          return n;
        });
      }
      last.current = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cap = CAPTIONS.find((c) => time < c.until) ?? CAPTIONS[CAPTIONS.length - 1];
  const stepIdx = STEPS.reduce((acc, s, i) => (time >= s.at ? i : acc), 0);
  const replay = () => {
    setTime(0);
    setPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={tr("Transaction en 20 secondes", "A deal in 20 seconds")}>
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#062f28] via-[#04231e] to-[#021712] text-white shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between px-4 pt-3 sm:px-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Sparkles className="h-4 w-4" aria-hidden />
            {tr("Une transaction en 20 secondes", "A deal in 20 seconds")}
          </p>
          <button onClick={onClose} aria-label={tr("Fermer", "Close")} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-2 sm:px-4">
          <Scene t={time} />
        </div>

        <div className="px-4 pb-4 sm:px-5">
          <p className="min-h-[2.6em] text-sm font-medium leading-snug text-white/90" aria-live="polite">
            {lang === "fr" ? cap.fr : cap.en}
          </p>

          <div className="mt-3 flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={s.en}
                type="button"
                onClick={() => setTime(s.at + 0.01)}
                className={classNames("min-w-0 flex-1 text-left", i > stepIdx && "opacity-45")}
                aria-label={lang === "fr" ? s.fr : s.en}
              >
                <span className="block h-1 overflow-hidden rounded-full bg-white/15">
                  <span
                    className="block h-full rounded-full bg-emerald-400"
                    style={{ width: `${i < stepIdx ? 100 : i === stepIdx ? clamp01((time - s.at) / ((STEPS[i + 1]?.at ?? DURATION) - s.at)) * 100 : 0}%` }}
                  />
                </span>
                <span className="mt-1 hidden truncate text-[10px] font-bold uppercase tracking-wide text-white/70 sm:block">{lang === "fr" ? s.fr : s.en}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => (time >= DURATION ? replay() : setPlaying((p) => !p))}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-emerald-950 hover:bg-emerald-400"
            >
              {time >= DURATION ? <RotateCcw className="h-4 w-4" aria-hidden /> : playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              {time >= DURATION ? tr("Rejouer", "Replay") : playing ? tr("Pause", "Pause") : tr("Lecture", "Play")}
            </button>
            <input
              type="range"
              min={0}
              max={DURATION}
              step={0.05}
              value={time}
              onChange={(e) => {
                setPlaying(false);
                setTime(Number(e.target.value));
              }}
              aria-label={tr("Position", "Timeline")}
              className="h-1.5 flex-1 cursor-pointer accent-emerald-400"
            />
            <span className="w-10 text-right text-xs font-bold tabular-nums text-white/70">{Math.min(DURATION, Math.floor(time))}s</span>
            <button onClick={onClose} className="rounded-xl px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10">
              {tr("Masquer", "Hide")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Floating invitation: open the 20s replay, or dismiss it (comes back as a small dot). */
export function DealStory() {
  const { t: tr } = useI18n();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tourOn, setTourOn] = useState(false);

  useEffect(() => {
    try {
      setHidden(window.sessionStorage.getItem(HIDE_KEY) === "1");
    } catch { /* ignore */ }
    const id = setTimeout(() => setReady(true), 2500);
    const onOpen = () => setOpen(true);
    const onTour = () => setTourOn(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("nimba:start-tour", onTour);
    return () => {
      clearTimeout(id);
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("nimba:start-tour", onTour);
    };
  }, []);

  const setHide = useCallback((v: boolean) => {
    setHidden(v);
    try {
      window.sessionStorage.setItem(HIDE_KEY, v ? "1" : "0");
    } catch { /* ignore */ }
  }, []);

  return (
    <>
      {open && <DealStoryPlayer onClose={() => setOpen(false)} />}
      {ready && !tourOn && !open && (
        <div className="fixed bottom-24 left-3 z-[55] sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 lg:left-[58%]">
          {hidden ? (
            <button
              onClick={() => setHide(false)}
              aria-label={tr("Afficher la démo en 20 s", "Show the 20s deal demo")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-emerald-300 shadow-lg ring-1 ring-white/15 hover:bg-brand-800"
            >
              <Play className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-brand-950/95 py-1 pl-1 pr-1 text-white shadow-overlay ring-1 ring-white/15 backdrop-blur">
              <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-xs font-bold hover:bg-white/10">
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-emerald-950">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" aria-hidden />
                  <Play className="relative h-3 w-3" aria-hidden />
                </span>
                {tr("Voir une transaction · 20 s", "Watch a deal · 20s")}
              </button>
              <button onClick={() => setHide(true)} aria-label={tr("Masquer", "Hide")} className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
