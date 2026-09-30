"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BadgeCheck, CheckCircle2, Loader2, Lock } from "lucide-react";
import { LogoMark } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { assetInfo } from "@/config/product";
import { useI18n } from "@/lib/i18n";
import { classNames } from "@/lib/format";

const methods = ["Orange Money", "MTN MoMo", "Wave", "Card / bank"] as const;

/** Public payer page for a Nimba payment link — no account or app required (demo). */
function PayInner() {
  const sp = useSearchParams();
  const { t } = useI18n();
  const amount = Number(sp.get("a")) || 0;
  const cur = assetInfo(sp.get("c") ?? "USD");
  const desc = sp.get("d") || t("Paiement", "Payment");
  const merchant = sp.get("m") || "Kaba Trade";
  const [method, setMethod] = useState<(typeof methods)[number]>("Orange Money");
  const [state, setState] = useState<"idle" | "paying" | "paid">("idle");

  const pay = () => {
    setState("paying");
    setTimeout(() => setState("paid"), 1600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-900 to-brand-950 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white text-ink shadow-2xl dark:bg-night-card dark:text-white">
        <div className="flex items-center justify-between bg-brand-50 px-5 py-3 dark:bg-brand-900/60">
          <LogoMark className="h-6 w-9 text-brand-500" />
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-brand-700 dark:text-brand-300">
            <Lock className="h-3 w-3" aria-hidden /> {t("Paiement sécurisé (démo)", "Secure payment (demo)")}
          </span>
        </div>
        <div className="p-5">
          {state === "paid" ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" aria-hidden />
              <p className="mt-3 text-lg font-extrabold">{t("Paiement reçu", "Payment received")}</p>
              <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
                {cur.symbol}
                {amount.toLocaleString("fr-FR")} {cur.id} → {merchant}
              </p>
            </div>
          ) : (
            <>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted dark:text-[#8FA79C]">
                <BadgeCheck className="h-4 w-4 text-brand-500" aria-hidden /> {merchant}
              </p>
              <p className="mt-1 text-sm">{desc}</p>
              <p className="mt-3 text-4xl font-extrabold tabular-nums">
                {cur.symbol}
                {amount.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}
                <span className="ml-1.5 text-base font-bold text-ink-muted">{cur.id}</span>
              </p>
              <p className="mt-4 text-2xs font-bold uppercase tracking-wide text-ink-muted">{t("Payer avec", "Pay with")}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {methods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    aria-pressed={method === m}
                    className={classNames(
                      "rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors",
                      method === m ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/60 dark:text-brand-200" : "border-line dark:border-night-lineStrong"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <Button full className="mt-5" onClick={pay} disabled={state === "paying" || amount <= 0}>
                {state === "paying" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                {state === "paying" ? t("Traitement…", "Processing…") : t("Payer maintenant", "Pay now")}
              </Button>
              <p className="mt-3 text-center text-2xs text-ink-muted">{t("Prototype — aucun argent réel", "Prototype — no real money")}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={null}>
      <PayInner />
    </Suspense>
  );
}
