"use client";

import React from "react";
import {
  ArrowLeftRight,
  BadgeCheck,
  ReceiptText,
  LifeBuoy,
} from "lucide-react";
import { Card } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n";

/**
 * Trust cards — wording matches the actual non-custodial operating model.
 * No escrow claims, no regulatory claims.
 */
export function TrustStrip() {
  const { t } = useI18n();
  const items = [
    {
      Icon: ArrowLeftRight,
      title: t("Règlement direct", "Direct settlement"),
      text: t(
        "Les fonds circulent directement entre vous et le partenaire vérifié.",
        "Funds move directly between you and the verified provider."
      ),
    },
    {
      Icon: BadgeCheck,
      title: t("Partenaires vérifiés", "Verified providers"),
      text: t(
        "Identité, informations business et détails d'exploitation examinés.",
        "Identity, business information and operating details reviewed."
      ),
    },
    {
      Icon: ReceiptText,
      title: t("Prix transparent", "Transparent pricing"),
      text: t(
        "Frais et montant final affichés avant votre confirmation.",
        "Fees and final amount shown before you confirm."
      ),
    },
    {
      Icon: LifeBuoy,
      title: t("Support & litiges", "Support & disputes"),
      text: t(
        "Chaque transaction est enregistrée et le support peut examiner tout problème.",
        "Every matched deal is logged and support can review issues."
      ),
    },
  ];
  return (
    <Card className="card-pad">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
              <Icon className="h-4.5 w-4.5" aria-hidden />
            </div>
            <div>
              <p className="text-[13px] font-bold">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
