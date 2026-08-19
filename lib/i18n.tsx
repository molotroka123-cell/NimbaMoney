"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "@/types";

/**
 * Lightweight localization: French is the primary launch language,
 * English is secondary. Every user-visible string goes through t(fr, en)
 * so the codebase stays localization-ready.
 */
interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (fr: string, en: string) => string;
}

const Ctx = createContext<I18nCtx>({
  lang: "fr",
  setLang: () => {},
  t: (fr) => fr,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = window.localStorage.getItem("nimba.lang") as Lang | null;
    if (saved === "fr" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("nimba.lang", l);
    document.documentElement.lang = l;
  };

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
