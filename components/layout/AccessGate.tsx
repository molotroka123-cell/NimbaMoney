"use client";

import React, { useEffect, useState } from "react";
import { KeyRound, ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/layout/Sidebar";
import { demoAccessCode } from "@/config/product";
import { classNames } from "@/lib/format";

const KEY = "nimba.access";

/**
 * Investor access gate — a branded lock screen shown on first open.
 * Client-side by design: this is an investor prototype, the goal is a
 * controlled first impression, not cryptographic secrecy.
 */
export function AccessGate() {
  const [locked, setLocked] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(KEY) === "1") setLocked(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);

  if (!locked) return null;

  const submit = () => {
    if (code.trim().toLowerCase() === demoAccessCode) {
      window.localStorage.setItem(KEY, "1");
      setLocked(false);
    } else {
      setError(true);
      setCode("");
      setTimeout(() => setError(false), 1600);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-brand-900 to-brand-950 p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Accès investisseur"
    >
      <div className="w-full max-w-sm text-center">
        <LogoMark className="mx-auto h-9 w-14 text-brand-300" />
        <h1 className="mt-4 text-xl font-extrabold tracking-tight text-white">
          NIMBA <span className="text-brand-300">MONEY</span>
        </h1>
        <p className="mt-1 text-sm font-medium text-brand-100/80">
          Accès investisseur privé · Private investor access
        </p>

        <div className="mt-7 rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/15 backdrop-blur">
          <label
            htmlFor="access-code"
            className="mb-2 flex items-center justify-center gap-1.5 text-2xs font-bold uppercase tracking-widest text-brand-200/70"
          >
            <KeyRound className="h-3.5 w-3.5" aria-hidden />
            Code d'accès · Access code
          </label>
          <div className="flex gap-2">
            <input
              id="access-code"
              type="password"
              autoFocus
              autoComplete="off"
              className={classNames(
                "min-h-[46px] w-full rounded-xl border bg-white/10 px-4 text-center text-base font-bold tracking-[0.25em] text-white placeholder:tracking-normal placeholder:text-white/40 focus:outline-none focus:ring-2",
                error
                  ? "border-red-400 focus:ring-red-400/40"
                  : "border-white/20 focus:border-brand-300 focus:ring-brand-300/40"
              )}
              placeholder="••••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <button
              onClick={submit}
              className="min-h-[46px] shrink-0 rounded-xl bg-brand-500 px-4 font-bold text-white transition-colors hover:bg-brand-400"
              aria-label="Entrer · Enter"
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <p
            className={classNames(
              "mt-2.5 text-xs font-semibold",
              error ? "text-red-300" : "text-transparent"
            )}
            aria-live="polite"
          >
            Code incorrect · Wrong code
          </p>
        </div>

        <p className="mt-6 text-2xs leading-relaxed text-brand-100/50">
          Prototype de démonstration — données fictives · Demo prototype — mock data
          <br />© 2026 Nimba Money
        </p>
      </div>
    </div>
  );
}
