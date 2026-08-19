"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { orders, getTrader } from "@/data/mock/p2p";
import { formatGnf } from "@/lib/format";

export default function P2PDisputesPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const disputed = orders.filter((o) => o.status === "disputed");

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-extrabold">{t("Litiges P2P", "P2P disputes")}</h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Un litige gèle l'ordre (démo) et fait intervenir l'équipe Nimba sous 24 h.",
            "A dispute freezes the order (demo) and brings in the Nimba team within 24 h."
          )}
        </p>
      </div>

      {disputed.map((o) => {
        const tr = getTrader(o.traderId)!;
        return (
          <Card key={o.id} className="card-pad">
            <div className="flex flex-wrap items-center gap-3">
              <Avatar initials={tr.initials} hue={tr.hue} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/p2p/order/${o.id}`} className="text-[13px] font-bold hover:text-brand-600">
                    {o.id}
                  </Link>
                  <Pill tone="red">{t("En examen", "Under review")}</Pill>
                </div>
                <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                  {tr.name} · {formatGnf(o.amountGnf)} · {o.createdAt} ·{" "}
                  {t("motif : paiement non reçu", "reason: payment not received")}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  toast(t("Preuve ajoutée au dossier (démo)", "Evidence added to the case (demo)"), "info")
                }
              >
                {t("Ajouter une preuve", "Add evidence")}
              </Button>
            </div>
          </Card>
        );
      })}

      <Card className="card-pad">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
            <ShieldCheck className="h-4.5 w-4.5" aria-hidden />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold">
              {t("Comment fonctionnent les litiges", "How disputes work")}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
              {t(
                "1) Ouvrez le litige depuis la salle d'ordre · 2) Joignez vos preuves (reçu, capture) · 3) L'équipe tranche sous 24 h ouvrées. Pendant l'examen, les USDT restent bloqués (démo).",
                "1) Open the dispute from the trade room · 2) Attach evidence (receipt, screenshot) · 3) The team rules within 24 business hours. During review, USDT stays locked (demo)."
              )}
            </p>
          </div>
          <AlertTriangle className="h-4 w-4 shrink-0 text-warn" aria-hidden />
        </div>
      </Card>
    </div>
  );
}
