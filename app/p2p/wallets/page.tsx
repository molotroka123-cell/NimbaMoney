"use client";

import React from "react";
import { ArrowDownToLine, ArrowUpFromLine, Wallet } from "lucide-react";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { wallets, walletHistory } from "@/data/mock/p2p";
import { formatNumber } from "@/lib/format";

export default function WalletsPage() {
  const { t } = useI18n();
  const { toast } = useToast();

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

      <Card className="card-pad">
        <h2 className="text-sm font-bold">{t("Historique", "History")}</h2>
        <ul className="mt-2 divide-y divide-line dark:divide-night-line">
          {walletHistory.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-3 py-2.5">
              <div>
                <p className="text-xs font-semibold">{h.label}</p>
                <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">{h.when}</p>
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
