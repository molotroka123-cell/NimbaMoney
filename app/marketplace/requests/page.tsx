"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Card, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { statusPill } from "@/components/requests/status";
import { useI18n } from "@/lib/i18n";
import { requests } from "@/data/mock/requests";
import { getProviderById } from "@/data/mock/providers";
import { formatGnf } from "@/lib/format";
import { railLabel } from "@/lib/rails";

export default function RequestsPage() {
  const { lang, t } = useI18n();
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold">{t("Mes demandes", "My requests")}</h1>
          <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Chaque demande est enregistrée par Nimba, du matching au reçu.",
              "Every request is logged by Nimba, from matching to receipt."
            )}
          </p>
        </div>
        <Link href="/marketplace">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            {t("Nouvelle demande", "New request")}
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {requests.map((r) => {
          const p = getProviderById(r.providerId);
          return (
            <Link key={r.id} href={`/marketplace/request/${r.id}`} className="block">
              <Card className="card-pad transition-shadow hover:shadow-raised">
                <div className="flex flex-wrap items-center gap-3">
                  {p && <Avatar initials={p.logoInitials} hue={p.logoHue} />}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-bold">{r.id}</span>
                      {statusPill(r.status, t)}
                    </div>
                    <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                      {p?.name} · {railLabel(r.from, lang)} → {railLabel(r.to, lang)} ·{" "}
                      {r.district} · {r.createdAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                      {t("Vous recevez", "You receive")}
                    </p>
                    <p className="text-sm font-extrabold tabular-nums text-mkt-600 dark:text-mkt-300">
                      {formatGnf(r.receiveGnf)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink-faint" aria-hidden />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
