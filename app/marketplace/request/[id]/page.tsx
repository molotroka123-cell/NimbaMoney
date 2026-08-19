"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import {
  MessageSquare,
  Upload,
  Send,
  Navigation,
  LifeBuoy,
  AlertTriangle,
  XCircle,
  Check,
  Printer,
} from "lucide-react";
import { Card, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { statusPill } from "@/components/requests/status";
import { FeeBreakdown } from "@/components/requests/CreateRequestModal";
import { VerificationBadge, Rating } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { getRequest } from "@/data/mock/requests";
import { getProviderById } from "@/data/mock/providers";
import { classNames, formatGnf } from "@/lib/format";
import { railLabel } from "@/lib/rails";
import type { DealRequest, DisputeReason, RequestStatus } from "@/types";

const stepLabels: Record<RequestStatus, [string, string]> = {
  created: ["Demande créée", "Request created"],
  accepted: ["Partenaire a accepté", "Provider accepted"],
  instructions: ["Instructions de règlement", "Settlement instructions"],
  transfer_confirmed: ["Transfert client confirmé", "Customer transfer confirmed"],
  released: ["Espèces / paiement remis", "Cash / payment released"],
  completed: ["Terminée", "Completed"],
  cancelled: ["Annulée", "Cancelled"],
  disputed: ["En litige", "Disputed"],
};

function RequestStatusInner() {
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();
  const { lang, t } = useI18n();
  const { toast } = useToast();

  // A known mock request, or a synthetic one created live from the
  // provider/service the user actually selected in the modal.
  const request: DealRequest | undefined = useMemo(() => {
    const existing = getRequest(id);
    if (existing) return existing;
    if (id !== "new") return undefined;
    const provider = getProviderById(sp.get("provider") ?? "");
    if (!provider) return undefined;
    const service =
      provider.services.find((s) => s.id === sp.get("service")) ?? provider.services[0];
    const amountGnf = Math.min(
      Math.max(Number(sp.get("amount")) || service.minGnf, service.minGnf),
      service.maxGnf
    );
    const feeGnf = Math.round((amountGnf * service.feePct) / 100);
    return {
      id: `REQ-${2500 + ((provider.id.length * 53 + service.id.length * 17) % 90)}`,
      providerId: provider.id,
      from: service.from,
      to: service.to,
      amountGnf,
      feePct: service.feePct,
      feeGnf,
      receiveGnf: amountGnf - feeGnf,
      district: provider.locations[0].district,
      status: "created",
      createdAt: t("à l'instant", "just now"),
      etaMinutes: service.estimatedMinutes[1],
      timeline: [
        { step: "created", at: t("à l'instant", "just now"), done: true },
        { step: "accepted", done: false },
        { step: "instructions", done: false },
        { step: "transfer_confirmed", done: false },
        { step: "released", done: false },
        { step: "completed", done: false },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sp]);

  const isSynthetic = id === "new";
  const [overrides, setOverrides] = useState<Partial<Record<RequestStatus, boolean>>>({});
  const [cancelled, setCancelled] = useState(false);
  const [transferSent, setTransferSent] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Simulated provider acceptance for freshly created requests.
  useEffect(() => {
    if (!isSynthetic || !request) return;
    const t1 = setTimeout(() => {
      setOverrides((o) => ({ ...o, accepted: true }));
      toast(t("Le partenaire a accepté votre demande ✓", "The provider accepted your request ✓"));
    }, 2200);
    const t2 = setTimeout(() => {
      setOverrides((o) => ({ ...o, instructions: true }));
      toast(t("Instructions de règlement reçues", "Settlement instructions received"), "info");
    }, 4200);
    timers.current.push(t1, t2);
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSynthetic, request?.id]);

  if (!request) return notFound();
  const r = request;
  const p = getProviderById(r.providerId)!;

  const stepDone = (step: RequestStatus, mockDone: boolean) =>
    mockDone ||
    !!overrides[step] ||
    (transferSent && step === "transfer_confirmed");

  const currentStatus: RequestStatus = cancelled
    ? "cancelled"
    : overrides.completed
      ? "completed"
      : overrides.released
        ? "released"
        : transferSent
          ? "transfer_confirmed"
          : overrides.instructions
            ? "instructions"
            : overrides.accepted
              ? "accepted"
              : r.status;

  const completedNow = currentStatus === "completed";
  const active = !["completed", "cancelled"].includes(currentStatus);
  const canMarkSent = ["instructions"].includes(currentStatus);

  const markTransferSent = () => {
    setTransferSent(true);
    toast(
      t(
        "Transfert marqué comme envoyé. Le partenaire vérifie.",
        "Transfer marked as sent. The provider is verifying."
      )
    );
    const t1 = setTimeout(() => {
      setOverrides((o) => ({ ...o, released: true }));
      toast(t("Le partenaire a remis les fonds ✓", "The provider released the funds ✓"));
    }, 2600);
    const t2 = setTimeout(() => {
      setOverrides((o) => ({ ...o, completed: true }));
      toast(t("Transaction terminée — reçu disponible 🎉", "Deal completed — receipt available 🎉"));
    }, 4200);
    timers.current.push(t1, t2);
  };

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <nav className="text-2xs text-ink-muted dark:text-[#8FA79C]" aria-label="Breadcrumb">
        <Link href="/marketplace/requests" className="hover:text-mkt-600">
          {t("Demandes", "Requests")}
        </Link>{" "}
        / <span className="font-semibold text-ink dark:text-white">{r.id}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold">{r.id}</h1>
          {statusPill(currentStatus, t)}
        </div>
        <p className="text-xs text-ink-muted dark:text-[#8FA79C]">
          {t("Créée le", "Created")} {r.createdAt} ·{" "}
          {t("délai estimé", "estimated")} ~{r.etaMinutes} min
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {/* timeline */}
          <Card className="card-pad">
            <h2 className="text-sm font-bold">{t("Suivi de la transaction", "Deal timeline")}</h2>
            <ol className="mt-4 space-y-0">
              {r.timeline.map((s, i) => {
                const done = stepDone(s.step, s.done);
                const isNext =
                  !done &&
                  r.timeline.findIndex((x) => !stepDone(x.step, x.done)) === i;
                return (
                  <li key={s.step} className="relative flex gap-3 pb-5 last:pb-0">
                    {i < r.timeline.length - 1 && (
                      <span
                        className={classNames(
                          "absolute left-[11px] top-6 h-full w-0.5",
                          done ? "bg-mkt-500" : "bg-line dark:bg-night-lineStrong"
                        )}
                        aria-hidden
                      />
                    )}
                    <span
                      className={classNames(
                        "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-2xs font-bold",
                        done
                          ? "bg-mkt-500 text-white"
                          : isNext
                            ? "bg-white ring-2 ring-mkt-500 text-mkt-600 dark:bg-night-card"
                            : "bg-surface-sunken text-ink-faint dark:bg-night-raised"
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p
                        className={classNames(
                          "text-[13px] font-semibold",
                          !done && !isNext && "text-ink-muted dark:text-[#8FA79C]"
                        )}
                      >
                        {lang === "fr" ? stepLabels[s.step][0] : stepLabels[s.step][1]}
                      </p>
                      {(s.at || done) && (
                        <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                          {s.at ?? t("à l'instant", "just now")}
                        </p>
                      )}
                      {isNext && s.step === "transfer_confirmed" && (
                        <p className="mt-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-2xs text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                          {t(
                            `Effectuez le virement avec la référence ${r.id}, puis marquez-le comme envoyé.`,
                            `Send the transfer with reference ${r.id}, then mark it as sent.`
                          )}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          {/* actions */}
          {active && (
            <Card className="card-pad">
              <h2 className="text-sm font-bold">{t("Actions", "Actions")}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/marketplace/messages">
                  <Button variant="secondary" size="sm">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                    {t("Contacter le partenaire", "Message provider")}
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    toast(t("Reçu téléversé (prototype)", "Receipt uploaded (prototype)"))
                  }
                >
                  <Upload className="h-3.5 w-3.5" aria-hidden />
                  {t("Téléverser un reçu", "Upload receipt")}
                </Button>
                <Button
                  size="sm"
                  variant="blue"
                  disabled={transferSent || !canMarkSent}
                  onClick={markTransferSent}
                >
                  <Send className="h-3.5 w-3.5" aria-hidden />
                  {transferSent
                    ? t("Transfert envoyé ✓", "Transfer sent ✓")
                    : t("Marquer le transfert envoyé", "Mark transfer sent")}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    toast(t("Ouverture de l'itinéraire (prototype)", "Opening directions (prototype)"), "info")
                  }
                >
                  <Navigation className="h-3.5 w-3.5" aria-hidden />
                  {t("Itinéraire", "Get directions")}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    toast(t("Support contacté — réponse < 5 min", "Support contacted — reply < 5 min"), "info")
                  }
                >
                  <LifeBuoy className="h-3.5 w-3.5" aria-hidden />
                  {t("Contacter le support", "Contact support")}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setDisputeOpen(true)}>
                  <AlertTriangle className="h-3.5 w-3.5 text-warn" aria-hidden />
                  {t("Ouvrir un litige", "Open dispute")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (currentStatus === "created") {
                      setCancelled(true);
                      toast(t("Demande annulée.", "Request cancelled."), "warn");
                    } else {
                      toast(
                        t(
                          "Annulation impossible : le partenaire a déjà accepté. Contactez le support.",
                          "Cannot cancel: the provider already accepted. Contact support."
                        ),
                        "warn"
                      );
                    }
                  }}
                >
                  <XCircle className="h-3.5 w-3.5" aria-hidden />
                  {t("Annuler si éligible", "Cancel if eligible")}
                </Button>
              </div>
            </Card>
          )}

          {completedNow && (
            <Card className="card-pad">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold">{t("Reçu", "Receipt")}</h2>
                  <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                    {r.id === "REQ-2395" ? "RCP-2026-1187" : r.id.replace("REQ", "RCP")} ·{" "}
                    {t("archivé et vérifiable", "archived and verifiable")}
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setReceiptOpen(true)}>
                  <Printer className="h-3.5 w-3.5" aria-hidden />
                  {t("Voir / imprimer le reçu", "View / print receipt")}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* right column */}
        <div className="space-y-4">
          <Card className="card-pad">
            <h2 className="text-sm font-bold">{t("Partenaire", "Provider")}</h2>
            <div className="mt-3 flex items-center gap-3">
              <Avatar initials={p.logoInitials} hue={p.logoHue} size="lg" />
              <div>
                <Link
                  href={`/marketplace/providers/${p.slug}`}
                  className="text-[13px] font-bold hover:text-mkt-600"
                >
                  {p.name}
                </Link>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <VerificationBadge type={p.type} level={p.verification.level} compact />
                  <Rating value={p.rating} compact />
                </div>
              </div>
            </div>
            <dl className="mt-3 space-y-2 border-t border-line pt-3 text-xs dark:border-night-line">
              {[
                [t("Méthode", "Method"), `${railLabel(r.from, lang)} → ${railLabel(r.to, lang)}`],
                [t("Lieu", "Location"), `${r.district}, Conakry`],
              ].map(([k, val]) => (
                <div key={k} className="flex justify-between gap-2">
                  <dt className="text-ink-muted dark:text-[#8FA79C]">{k}</dt>
                  <dd className="text-right font-semibold">{val}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="card-pad">
            <h2 className="mb-3 text-sm font-bold">{t("Montants", "Amounts")}</h2>
            <FeeBreakdown
              amountGnf={r.amountGnf}
              feePct={r.feePct}
              feeGnf={r.feeGnf}
              receiveGnf={r.receiveGnf}
            />
          </Card>
        </div>
      </div>

      {/* dispute modal */}
      <DisputeModal open={disputeOpen} onClose={() => setDisputeOpen(false)} requestId={r.id} />

      {/* receipt modal */}
      <Modal
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        title={t("Reçu de transaction", "Deal receipt")}
      >
        <div className="rounded-xl border border-dashed border-line p-4 text-xs dark:border-night-lineStrong">
          <p className="text-center text-sm font-extrabold tracking-tight">
            NIMBA MONEY
          </p>
          <p className="text-center text-2xs text-ink-muted dark:text-[#8FA79C]">
            {t("Reçu de transaction enregistrée", "Logged deal receipt")} ·{" "}
            {r.id === "REQ-2395" ? "RCP-2026-1187" : r.id.replace("REQ", "RCP")}
          </p>
          <dl className="mt-4 space-y-1.5">
            {[
              [t("Client", "Customer"), "Mohamed D."],
              [t("Partenaire", "Provider"), p.name],
              [t("Méthode", "Method"), `${railLabel(r.from, lang)} → ${railLabel(r.to, lang)}`],
              [t("Montant", "Amount"), formatGnf(r.amountGnf)],
              [t("Frais", "Fee"), formatGnf(r.feeGnf)],
              [t("Montant final", "Final amount"), formatGnf(r.receiveGnf)],
              [t("Date", "Time"), r.createdAt],
              [t("Statut", "Status"), t("Terminée", "Completed")],
            ].map(([k, val]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-ink-muted dark:text-[#8FA79C]">{k}</dt>
                <dd className="font-semibold tabular-nums">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Button
          full
          className="mt-4"
          onClick={() => toast(t("Impression lancée (prototype)", "Printing (prototype)"), "info")}
        >
          <Printer className="h-4 w-4" aria-hidden />
          {t("Imprimer / Télécharger PDF", "Print / Download PDF")}
        </Button>
      </Modal>
    </div>
  );
}

export default function RequestStatusPage() {
  return (
    <Suspense>
      <RequestStatusInner />
    </Suspense>
  );
}

function DisputeModal({
  open,
  onClose,
  requestId,
}: {
  open: boolean;
  onClose: () => void;
  requestId: string;
}) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [reason, setReason] = useState<DisputeReason | null>(null);
  const [text, setText] = useState("");

  const reasons: { id: DisputeReason; fr: string; en: string }[] = [
    { id: "no_response", fr: "Le partenaire ne répond pas", en: "Provider did not respond" },
    { id: "payment_not_received", fr: "Paiement non reçu", en: "Payment not received" },
    { id: "wrong_amount", fr: "Montant incorrect", en: "Wrong amount" },
    { id: "different_terms", fr: "Conditions différentes", en: "Different terms" },
    { id: "other", fr: "Autre", en: "Other" },
  ];

  return (
    <Modal open={open} onClose={onClose} title={t("Ouvrir un litige", "Open a dispute")}>
      <div className="space-y-4">
        <p className="text-xs text-ink-muted dark:text-[#8FA79C]">
          {t(
            `Litige sur ${requestId}. Notre équipe examine chaque litige sous 24 h ouvrées.`,
            `Dispute on ${requestId}. Our team reviews every dispute within 24 business hours.`
          )}
        </p>
        <fieldset>
          <legend className="label-xs">{t("Motif", "Reason")}</legend>
          <div className="space-y-1.5">
            {reasons.map((rn) => (
              <label
                key={rn.id}
                className={classNames(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-medium",
                  reason === rn.id
                    ? "border-mkt-500 bg-mkt-50 dark:bg-navy-800"
                    : "border-line dark:border-night-line"
                )}
              >
                <input
                  type="radio"
                  name="dispute-reason"
                  className="accent-mkt-500"
                  checked={reason === rn.id}
                  onChange={() => setReason(rn.id)}
                />
                {t(rn.fr, rn.en)}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label className="label-xs" htmlFor="dispute-text">
            {t("Décrivez le problème", "Describe the issue")}
          </label>
          <textarea
            id="dispute-text"
            rows={3}
            className="input-base resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t(
              "Ce qui s'est passé, montants, heures…",
              "What happened, amounts, times…"
            )}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => toast(t("Pièce jointe ajoutée (prototype)", "Attachment added (prototype)"), "info")}
        >
          <Upload className="h-3.5 w-3.5" aria-hidden />
          {t("Joindre une preuve", "Attach evidence")}
        </Button>
        <Button
          full
          disabled={!reason}
          onClick={() => {
            onClose();
            toast(
              t(
                "Litige ouvert. Référence DSP-045 — le support vous contacte.",
                "Dispute opened. Reference DSP-045 — support will contact you."
              ),
              "warn"
            );
          }}
        >
          {t("Soumettre le litige", "Submit dispute")}
        </Button>
      </div>
    </Modal>
  );
}
