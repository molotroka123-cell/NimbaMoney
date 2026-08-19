"use client";

import React from "react";
import Link from "next/link";
import { Printer } from "lucide-react";
import { Card, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { completedDeals } from "@/data/mock/requests";
import { getProviderById } from "@/data/mock/providers";
import { formatGnf } from "@/lib/format";

export default function CompletedDealsPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  return (
    <div className="space-y-3">
      {completedDeals.map((d) => {
        const p = getProviderById(d.providerId)!;
        return (
          <Card key={d.id} className="card-pad">
            <div className="flex flex-wrap items-center gap-3">
              <Avatar initials={p.logoInitials} hue={p.logoHue} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-bold">{d.id}</span>
                  <Pill tone="green">{t("Terminée", "Completed")}</Pill>
                </div>
                <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                  {p.name} · {d.method} · {d.completedAt}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                  {t("Montant final", "Final amount")}
                </p>
                <p className="text-sm font-extrabold tabular-nums text-brand-700 dark:text-brand-300">
                  {formatGnf(d.finalGnf)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    toast(t(`Reçu ${d.receiptId} (prototype)`, `Receipt ${d.receiptId} (prototype)`), "info")
                  }
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden />
                  {t("Reçu", "Receipt")}
                </Button>
                <Link href={`/marketplace/request/${d.requestId}`}>
                  <Button variant="ghost" size="sm">
                    {t("Détails", "Details")}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
