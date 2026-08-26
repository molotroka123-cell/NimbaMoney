"use client";

import React, { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Wallet, Vault, CalendarClock, Check } from "lucide-react";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { wallets, walletHistory } from "@/data/mock/p2p";
import { classNames, formatNumber } from "@/lib/format";

/** Weekly auto-buy amounts offered for the USD vault, in GNF. */
const coffreAmounts = [50_000, 100_000, 250_000, 500_000] as const;

export default function WalletsPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [coffreOn, setCoffreOn] = useState(true);
  const [coffreAmount, setCoffreAmount] = useState<number>(100_000);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("nimba.coffre") ?? "null");
      if (saved) {
        setCoffreOn(Boolean(saved.on));
        if (coffreAmounts.includes(saved.amount)) setCoffreAmount(saved.amount);
      }
    } catch { /* ignore */ }
  }, []);

  const saveCoffre = (on: boolean, amount: number) => {
    setCoffreOn(on);
    setCoffreAmount(amount);
    try {
      window.localStorage.setItem("nimba.coffre", JSON.stringify({ on, amount }));
    } catch { /* ignore */ }
  };

  const coffreBalance = 318.4; // USDT saved so far (demo)
  const coffreGoal = 1_000;
  const coffrePct = Math.round((coffreBalance / coffreGoal) * 100);

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-extrabold">{t("Portefeuilles", "Wallets")}</h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t("Soldes de démonstration du prototype P2P.", "Demo balances of the P2P prototype.")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {wallets.map((w) => (
          <Card key={w.asset} className="card-pad">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
                <Wallet className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                  {t("Solde", "Balance")} {w.asset}
                </p>
                <p className="text-lg font-extrabold tabular-nums">
                  {w.asset === "GNF"
                    ? `${formatNumber(w.balance)} GNF`
                    : `${w.balance.toLocaleString("fr-FR")} USDT`}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 border-t border-line pt-3 dark:border-night-line">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toast(t("Dépôt (démo)", "Deposit (demo)"), "info")}
              >
                <ArrowDownToLine className="h-3.5 w-3.5" aria-hidden />
                {t("Déposer", "Deposit")}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toast(t("Retrait (démo)", "Withdraw (demo)"), "info")}
              >
                <ArrowUpFromLine className="h-3.5 w-3.5" aria-hidden />
                {t("Retirer", "Withdraw")}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Coffre USD — recurring auto-buy savings vault */}
      <Card className="card-pad overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-brand-200">
              <Vault className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold">
                {t("Coffre USD", "USD Vault")}
                <Pill tone="green">{t("Épargne auto", "Auto-save")}</Pill>
              </h2>
              <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                {t(
                  "Achat automatique d'USDT chaque semaine depuis Orange Money (démo).",
                  "Automatic USDT purchase every week from Orange Money (demo)."
                )}
              </p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={coffreOn}
            aria-label={t("Activer le coffre", "Enable vault")}
            onClick={() => {
              saveCoffre(!coffreOn, coffreAmount);
              toast(
                !coffreOn
                  ? t("Coffre USD activé (démo)", "USD vault enabled (demo)")
                  : t("Coffre USD en pause", "USD vault paused"),
                "info"
              );
            }}
            className={classNames(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              coffreOn ? "bg-brand-500" : "bg-line dark:bg-night-lineStrong"
            )}
          >
            <span
              className={classNames(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all",
                coffreOn ? "left-[22px]" : "left-0.5"
              )}
            />
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-end justify-between">
              <p className="text-lg font-extrabold tabular-nums">
                {coffreBalance.toLocaleString("fr-FR")} USDT
              </p>
              <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                {t("Objectif", "Goal")} : {formatNumber(coffreGoal)} USDT · {coffrePct}%
              </p>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-sunken dark:bg-night-raised" aria-hidden>
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${coffrePct}%` }} />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden />
              {coffreOn
                ? t(
                    `Prochain achat : lundi 31 août — ${formatNumber(coffreAmount)} GNF`,
                    `Next purchase: Monday, Aug 31 — ${formatNumber(coffreAmount)} GNF`
                  )
                : t("Achats automatiques en pause.", "Auto-purchases paused.")}
            </p>
          </div>
          <div>
            <p className="label-xs">{t("Montant hebdomadaire", "Weekly amount")}</p>
            <div className="flex flex-wrap gap-1.5">
              {coffreAmounts.map((v) => (
                <button
                  key={v}
                  onClick={() => saveCoffre(coffreOn, v)}
                  className={classNames(
                    "rounded-lg border px-3 py-1.5 text-xs font-bold tabular-nums transition-colors max-sm:min-h-[40px]",
                    coffreAmount === v
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200"
                      : "border-line text-ink-muted hover:border-brand-400 dark:border-night-lineStrong dark:text-[#8FA79C]"
                  )}
                >
                  {formatNumber(v)}
                </button>
              ))}
            </div>
            <ul className="mt-3 space-y-1">
              {[
                t("Se règle via vos ordres P2P au meilleur taux", "Settled through your P2P orders at the best rate"),
                t("Modifiable ou stoppable à tout moment", "Change or stop anytime"),
              ].map((x) => (
                <li key={x} className="flex items-start gap-1.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
                  <Check className="mt-px h-3 w-3 shrink-0 text-brand-500" aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 border-t border-line pt-3 dark:border-night-line">
          <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
            {t("Derniers achats automatiques", "Recent auto-purchases")}
          </p>
          <ul className="mt-1.5 divide-y divide-line dark:divide-night-line">
            {[
              { d: t("lun. 24 août", "Mon, Aug 24"), gnf: 100_000, usdt: 11.57 },
              { d: t("lun. 17 août", "Mon, Aug 17"), gnf: 100_000, usdt: 11.6 },
              { d: t("lun. 10 août", "Mon, Aug 10"), gnf: 100_000, usdt: 11.55 },
            ].map((r) => (
              <li key={r.d} className="flex items-center justify-between py-2 text-xs">
                <span className="text-ink-secondary dark:text-[#B7C9C0]">
                  {r.d} · {formatNumber(r.gnf)} GNF
                </span>
                <span className="font-bold tabular-nums text-brand-600 dark:text-brand-300">
                  +{r.usdt.toLocaleString("fr-FR")} USDT
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="card-pad">
        <h2 className="text-sm font-bold">{t("Historique", "History")}</h2>
        <ul className="mt-2 divide-y divide-line dark:divide-night-line">
          {walletHistory.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-3 py-2.5">
              <div>
                <p className="text-xs font-semibold">{t(h.label, h.labelEn)}</p>
                <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">{t(h.when, h.whenEn)}</p>
              </div>
              <span
                className={
                  h.delta.startsWith("+")
                    ? "text-xs font-bold tabular-nums text-brand-600 dark:text-brand-300"
                    : "text-xs font-bold tabular-nums text-danger"
                }
              >
                {h.delta}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
