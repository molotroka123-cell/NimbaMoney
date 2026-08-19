"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, MapPin } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/misc";
import { VerificationBadge, Rating } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { formatGnf, formatPct } from "@/lib/format";
import { railLabel } from "@/lib/rails";
import type { Offer } from "@/lib/marketplace";

/** Fee breakdown — pricing always visible before confirmation. */
export function FeeBreakdown({
  amountGnf,
  feePct,
  feeGnf,
  receiveGnf,
}: {
  amountGnf: number;
  feePct: number;
  feeGnf: number;
  receiveGnf: number;
}) {
  const { t } = useI18n();
  return (
    <dl className="space-y-2 rounded-xl border border-line bg-surface p-4 text-sm dark:border-night-line dark:bg-night-raised">
      <div className="flex justify-between">
        <dt className="text-ink-muted dark:text-[#8FA79C]">
          {t("Montant demandé", "Requested amount")}
        </dt>
        <dd className="font-semibold tabular-nums">{formatGnf(amountGnf)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-muted dark:text-[#8FA79C]">
          {t("Frais du partenaire", "Provider service fee")} ({formatPct(feePct)})
        </dt>
        <dd className="font-semibold tabular-nums">− {formatGnf(feeGnf)}</dd>
      </div>
      <div className="border-t border-line pt-2 dark:border-night-lineStrong">
        <div className="flex justify-between">
          <dt className="font-bold">{t("Vous recevez", "You receive")}</dt>
          <dd className="text-base font-extrabold tabular-nums text-mkt-600 dark:text-mkt-300">
            {formatGnf(receiveGnf)}
          </dd>
        </div>
      </div>
    </dl>
  );
}

export function CreateRequestModal({
  offer,
  amountGnf,
  onClose,
}: {
  offer: Offer | null;
  amountGnf: number;
  onClose: () => void;
}) {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!offer) return null;
  const { provider, service } = offer;
  const feeGnf = Math.round((amountGnf * service.feePct) / 100);
  const receiveGnf = amountGnf - feeGnf;
  const loc = provider.locations[0];

  const submit = () => {
    setSubmitting(true);
    // A synthetic request is created live for the provider/service selected.
    setTimeout(() => {
      toast(
        t(
          "Demande créée. Le partenaire a été notifié.",
          "Request created. The provider has been notified."
        )
      );
      router.push(
        `/marketplace/request/new?provider=${provider.id}&service=${service.id}&amount=${amountGnf}`
      );
    }, 600);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={t("Demander de la liquidité", "Request liquidity")}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar initials={provider.logoInitials} hue={provider.logoHue} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{provider.name}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <VerificationBadge
                type={provider.type}
                level={provider.verification.level}
                compact
              />
              <Rating value={provider.rating} compact />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-line p-2.5 dark:border-night-line">
            <p className="text-2xs font-semibold uppercase text-ink-muted dark:text-[#8FA79C]">
              {t("Vous avez", "You have")}
            </p>
            <p className="mt-0.5 font-semibold">
              {railLabel(service.from, lang)}
            </p>
          </div>
          <div className="rounded-lg border border-line p-2.5 dark:border-night-line">
            <p className="text-2xs font-semibold uppercase text-ink-muted dark:text-[#8FA79C]">
              {t("Vous recevez en", "You receive in")}
            </p>
            <p className="mt-0.5 font-semibold">{railLabel(service.to, lang)}</p>
          </div>
        </div>

        <FeeBreakdown
          amountGnf={amountGnf}
          feePct={service.feePct}
          feeGnf={feeGnf}
          receiveGnf={receiveGnf}
        />

        <div className="flex items-center justify-between text-xs text-ink-secondary dark:text-[#B7C9C0]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-mkt-500" aria-hidden />
            {loc.district}, {loc.city}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-mkt-500" aria-hidden />
            {t(
              `Disponible sous ~${service.estimatedMinutes[1]} min`,
              `Available in ~${service.estimatedMinutes[1]} min`
            )}
          </span>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line p-3 text-xs leading-relaxed dark:border-night-line">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-mkt-500"
          />
          <span>
            {t(
              "Je comprends que les fonds sont réglés directement avec le partenaire. Nimba enregistre la transaction et le support peut intervenir en cas de problème.",
              "I understand funds are settled directly with the provider. Nimba logs the deal and support can step in if something goes wrong."
            )}
          </span>
        </label>

        <Button full size="lg" variant="blue" disabled={!accepted || submitting} onClick={submit}>
          {submitting
            ? t("Création…", "Creating…")
            : t("Créer la demande", "Create request")}
        </Button>
      </div>
    </Modal>
  );
}
