"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import {
  Check,
  Clock,
  Copy,
  Send,
  Upload,
  ShieldCheck,
  AlertTriangle,
  Printer,
  Lock,
  XCircle,
} from "lucide-react";
import { Card, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { getOrder, getOffer, getTrader, orderChat } from "@/data/mock/p2p";
import { classNames, formatGnf, formatGnfCompact, formatNumber } from "@/lib/format";
import { assetInfo } from "@/config/product";
import { railLabel } from "@/lib/rails";
import type { Message, P2POrder, P2POrderStatus } from "@/types";

/**
 * P2P trade room — fully simulated, deterministic demo:
 * pay → mark sent → (simulated) trader confirmation → release → completed.
 * The "Nimba protection" here is DEMO functionality of the P2P prototype,
 * separate from Marketplace direct-settlement logic.
 */

const steps: { id: P2POrderStatus; fr: string; en: string }[] = [
  { id: "created", fr: "Ordre créé", en: "Order created" },
  { id: "payment_pending", fr: "Paiement en attente", en: "Payment pending" },
  { id: "payment_sent", fr: "Paiement envoyé", en: "Payment sent" },
  { id: "confirming", fr: "Confirmation du trader", en: "Trader confirmation" },
  { id: "released", fr: "Cryptos libérées", en: "Asset release" },
  { id: "completed", fr: "Terminé", en: "Completed" },
];

const stepIndex: Record<P2POrderStatus, number> = {
  created: 0,
  payment_pending: 1,
  payment_sent: 2,
  confirming: 3,
  released: 4,
  completed: 5,
  cancelled: 1,
  disputed: 2,
};

function OrderInner() {
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();
  const { lang, t } = useI18n();
  const { toast } = useToast();

  // Resolve the order: a known mock order, or a synthetic one created
  // from an offer id when the user clicks Buy/Sell in the table.
  const asset = assetInfo(sp.get("asset") ?? "USDT");
  const base: P2POrder | undefined = useMemo(() => {
    const existing = getOrder(id);
    if (existing) return existing;
    if (id === "new") {
      const offer = getOffer(sp.get("offer") ?? "");
      if (!offer) return undefined;
      const amountGnf = Number(sp.get("amount")) || offer.minGnf;
      const priceGnf = Math.round(offer.priceGnf * asset.mul * 100) / 100;
      const q = 10 ** asset.decimals;
      return {
        id: `ORD-${7300 + (offer.id.length * 37) % 90}`,
        offerId: offer.id,
        traderId: offer.traderId,
        side: offer.side,
        amountGnf,
        priceGnf,
        amountUsdt: Math.round((amountGnf / priceGnf) * q) / q,
        method: offer.method,
        status: "payment_pending",
        createdAt: t("à l'instant", "just now"),
        deadlineMinutes: 15,
      };
    }
    return undefined;
  }, [id, sp, t, asset]);

  const [status, setStatus] = useState<P2POrderStatus>(base?.status ?? "payment_pending");
  const [chat, setChat] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState((base?.deadlineMinutes ?? 15) * 60);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const chatBox = useRef<HTMLDivElement>(null);

  const trader = base ? getTrader(base.traderId) : undefined;

  // seed chat
  useEffect(() => {
    if (!base) return;
    if (base.id === "ORD-7305") setChat(orderChat);
    else
      setChat([
        {
          id: "s1",
          threadId: base.id,
          from: "system",
          text: t(
            `Ordre ${base.id} créé. Protection Nimba (démo) : les ${asset.id} du trader sont bloqués jusqu'à la confirmation du paiement.`,
            `Order ${base.id} created. Nimba protection (demo): the trader's ${asset.id} is locked until payment is confirmed.`
          ),
          at: t("à l'instant", "just now"),
        },
        {
          id: "s2",
          threadId: base.id,
          from: "provider",
          text: t(
            `Bonjour 👋 Envoyez ${formatGnf(base.amountGnf)} via ${railLabel(base.method, "fr")}, référence ${base.id}.`,
            `Hello 👋 Send ${formatGnf(base.amountGnf)} via ${railLabel(base.method, "en")}, reference ${base.id}.`
          ),
          at: t("à l'instant", "just now"),
        },
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base?.id]);

  // countdown
  useEffect(() => {
    if (status !== "payment_pending" && status !== "created") return;
    const iv = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(iv);
  }, [status]);

  useEffect(() => {
    const el = chatBox.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (!base || !trader) return notFound();
  const active = !["completed", "cancelled", "disputed"].includes(status);
  const idx = stepIndex[status];

  const pushSystem = (fr: string, en: string, delay = 0) => {
    const tm = setTimeout(() => {
      setChat((c) => [
        ...c,
        {
          id: `sys-${Date.now()}-${Math.random()}`,
          threadId: base.id,
          from: "system",
          text: t(fr, en),
          at: t("à l'instant", "just now"),
        },
      ]);
    }, delay);
    timers.current.push(tm);
  };
  const pushTrader = (fr: string, en: string, delay = 0) => {
    const tm = setTimeout(() => {
      setChat((c) => [
        ...c,
        {
          id: `tr-${Date.now()}-${Math.random()}`,
          threadId: base.id,
          from: "provider",
          text: t(fr, en),
          at: t("à l'instant", "just now"),
        },
      ]);
    }, delay);
    timers.current.push(tm);
  };

  /** The simulated happy path after the customer marks the payment sent. */
  const markSent = () => {
    setStatus("payment_sent");
    pushSystem("Vous avez marqué le paiement comme envoyé. Le trader vérifie.", "You marked the payment as sent. The trader is verifying.");
    const t1 = setTimeout(() => {
      setStatus("confirming");
      pushTrader("Paiement reçu, je vérifie le montant… ✅", "Payment received, checking the amount… ✅", 0);
    }, 2500);
    const t2 = setTimeout(() => {
      setStatus("released");
      pushSystem(`Le trader a confirmé. ${asset.id} libérés vers votre portefeuille Nimba (démo).`, `Trader confirmed. ${asset.id} released to your Nimba wallet (demo).`);
    }, 5000);
    const t3 = setTimeout(() => {
      setStatus("completed");
      pushSystem("Ordre terminé. Merci d'évaluer votre trader.", "Order completed. Please rate your trader.");
      toast(
        t(
          `Ordre ${base.id} terminé — ${base.amountUsdt.toLocaleString("fr-FR")} ${asset.id} reçus ✅`,
          `Order ${base.id} completed — received ${base.amountUsdt.toLocaleString("fr-FR")} ${asset.id} ✅`
        )
      );
    }, 6500);
    timers.current.push(t1, t2, t3);
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setChat((c) => [
      ...c,
      {
        id: `me-${Date.now()}`,
        threadId: base.id,
        from: "customer",
        text,
        at: t("à l'instant", "just now"),
      },
    ]);
    setDraft("");
    pushTrader("Bien reçu 👍", "Got it 👍", 1800);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const isBuy = base.side === "buy";

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <nav className="text-2xs text-ink-muted dark:text-[#8FA79C]" aria-label="Breadcrumb">
        <Link href="/p2p" className="hover:text-brand-600">P2P</Link> /{" "}
        <Link href="/p2p/orders" className="hover:text-brand-600">{t("Ordres", "Orders")}</Link> /{" "}
        <span className="font-semibold text-ink dark:text-white">{base.id}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl font-extrabold">
            {isBuy ? `${t("Achat", "Buy")} ${asset.id}` : `${t("Vente", "Sell")} ${asset.id}`} · {base.id}
          </h1>
          {status === "completed" ? (
            <Pill tone="green">{t("Terminé", "Completed")}</Pill>
          ) : status === "cancelled" ? (
            <Pill tone="neutral">{t("Annulé", "Cancelled")}</Pill>
          ) : status === "disputed" ? (
            <Pill tone="red">{t("En litige", "Disputed")}</Pill>
          ) : (
            <Pill tone="amber">{lang === "fr" ? steps[idx].fr : steps[idx].en}</Pill>
          )}
        </div>
        {(status === "payment_pending" || status === "created") && (
          <p
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-bold tabular-nums text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
            role="timer"
            aria-label={t("Temps restant pour payer", "Time left to pay")}
          >
            <Clock className="h-4 w-4" aria-hidden />
            {mm}:{ss}
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {/* amounts */}
          <Card className="card-pad">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="label-xs">{isBuy ? t("Vous payez", "You pay") : t("Vous recevez", "You receive")}</p>
                <p className="text-base font-extrabold tabular-nums">{formatGnf(base.amountGnf)}</p>
                <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                  {t("via", "via")} {railLabel(base.method, lang)}
                </p>
              </div>
              <div>
                <p className="label-xs">{t("Prix", "Price")}</p>
                <p className="text-base font-extrabold tabular-nums">
                  {base.priceGnf >= 1_000_000
                    ? formatGnfCompact(base.priceGnf, lang)
                    : `${formatNumber(base.priceGnf)} GNF`}
                </p>
                <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                  {t("par", "per")} {asset.id}
                </p>
              </div>
              <div>
                <p className="label-xs">{isBuy ? t("Vous recevez", "You receive") : t("Vous envoyez", "You send")}</p>
                <p className="text-base font-extrabold tabular-nums text-brand-700 dark:text-brand-300">
                  {base.amountUsdt.toLocaleString("fr-FR", { maximumFractionDigits: asset.decimals })} {asset.id}
                </p>
                <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">{asset.network}</p>
              </div>
            </div>
            <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-2xs text-brand-800 dark:bg-brand-900/50 dark:text-brand-200">
              <Lock className="mt-px h-3 w-3 shrink-0" aria-hidden />
              {t(
                `Protection Nimba (démo) : les ${asset.id} du trader sont bloqués jusqu'à la confirmation du paiement. Fonctionnalité de démonstration du prototype P2P.`,
                `Nimba protection (demo): the trader's ${asset.id} is locked until payment is confirmed. Demo functionality of the P2P prototype.`
              )}
            </p>
          </Card>

          {/* payment instructions */}
          {active && (
            <Card className="card-pad">
              <h2 className="text-sm font-bold">
                {isBuy
                  ? t("Instructions de paiement", "Payment instructions")
                  : t("Réception du paiement", "Receiving the payment")}
              </h2>
              <dl className="mt-3 space-y-2 rounded-xl border border-line bg-surface p-3.5 text-sm dark:border-night-line dark:bg-night-raised">
                {[
                  [t("Moyen", "Method"), railLabel(base.method, lang)],
                  [
                    t("Compte", "Account"),
                    base.method === "bank" ? "Banque Démo GN · GN012 3456 7890" : "+224 620 88 44 22",
                  ],
                  [t("Titulaire", "Account name"), trader.name],
                  [t("Référence obligatoire", "Required reference"), base.id],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-2">
                    <dt className="text-xs text-ink-muted dark:text-[#8FA79C]">{k}</dt>
                    <dd className="flex items-center gap-1.5 text-xs font-bold">
                      {v}
                      <button
                        className="rounded p-1 text-ink-muted hover:bg-surface-sunken hover:text-brand-600 dark:hover:bg-night-card"
                        aria-label={t("Copier", "Copy")}
                        onClick={() => {
                          navigator.clipboard?.writeText(String(v)).catch(() => {});
                          toast(t("Copié", "Copied"), "info");
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast(t("Reçu téléversé (démo)", "Receipt uploaded (demo)"))}
                >
                  <Upload className="h-3.5 w-3.5" aria-hidden />
                  {t("Téléverser le reçu", "Upload receipt")}
                </Button>
                <Button
                  size="sm"
                  disabled={status !== "payment_pending" && status !== "created"}
                  onClick={markSent}
                >
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  {status === "payment_pending" || status === "created"
                    ? t("J'ai payé — marquer comme envoyé", "I've paid — mark as sent")
                    : t("Paiement marqué envoyé ✓", "Payment marked sent ✓")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatus("cancelled");
                    pushSystem("Ordre annulé par le client.", "Order cancelled by the customer.");
                    toast(t("Ordre annulé", "Order cancelled"), "warn");
                  }}
                  disabled={status !== "payment_pending" && status !== "created"}
                >
                  <XCircle className="h-3.5 w-3.5" aria-hidden />
                  {t("Annuler", "Cancel")}
                </Button>
                <Link href="/p2p/disputes">
                  <Button variant="ghost" size="sm">
                    <AlertTriangle className="h-3.5 w-3.5 text-warn" aria-hidden />
                    {t("Ouvrir un litige", "Open dispute")}
                  </Button>
                </Link>
              </div>
              <p className="mt-2 text-2xs text-ink-faint">
                {t(
                  "Ne marquez jamais « envoyé » avant d'avoir réellement payé.",
                  "Never mark as sent before you have actually paid."
                )}
              </p>
            </Card>
          )}

          {/* timeline */}
          <Card className="card-pad">
            <h2 className="text-sm font-bold">{t("Statut de l'ordre", "Order status")}</h2>
            <ol className="mt-4">
              {steps.map((s, i) => {
                const done =
                  status !== "cancelled" &&
                  (i < idx || (status === "completed" && i <= idx));
                const isNext = status !== "cancelled" && !done && i === idx;
                return (
                  <li key={s.id} className="relative flex gap-3 pb-5 last:pb-0">
                    {i < steps.length - 1 && (
                      <span
                        className={classNames(
                          "absolute left-[11px] top-6 h-full w-0.5",
                          done && i < idx ? "bg-brand-500" : "bg-line dark:bg-night-lineStrong"
                        )}
                        aria-hidden
                      />
                    )}
                    <span
                      className={classNames(
                        "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-2xs font-bold",
                        done
                          ? "bg-brand-500 text-white"
                          : isNext
                            ? "bg-white ring-2 ring-brand-500 text-brand-600 dark:bg-night-card"
                            : "bg-surface-sunken text-ink-faint dark:bg-night-raised"
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                    </span>
                    <p
                      className={classNames(
                        "pt-0.5 text-[13px] font-semibold",
                        !done && "text-ink-muted dark:text-[#8FA79C]"
                      )}
                    >
                      {lang === "fr" ? s.fr : s.en}
                    </p>
                  </li>
                );
              })}
            </ol>
            {status === "completed" && (
              <div className="mt-2 flex flex-wrap gap-2 border-t border-line pt-3 dark:border-night-line">
                <Button variant="secondary" size="sm" onClick={() => setReceiptOpen(true)}>
                  <Printer className="h-3.5 w-3.5" aria-hidden />
                  {t("Voir le reçu", "View receipt")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => toast(t("Merci pour votre évaluation ⭐⭐⭐⭐⭐", "Thanks for your rating ⭐⭐⭐⭐⭐"))}
                >
                  {t("Évaluer le trader", "Rate the trader")}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* right: trader + chat */}
        <div className="space-y-4">
          <Card className="card-pad">
            <div className="flex items-center gap-3">
              <Avatar initials={trader.initials} hue={trader.hue} size="lg" />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-bold">
                  {trader.name}
                  {trader.verified && <ShieldCheck className="h-4 w-4 text-brand-500" aria-hidden />}
                </p>
                <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                  {trader.trades.toLocaleString("fr-FR")} trades · {trader.completionPct}% ·{" "}
                  {t("répond en", "responds in")} ~{trader.responseMinutes} min
                </p>
              </div>
              <span
                className={classNames(
                  "ml-auto h-2.5 w-2.5 rounded-full",
                  trader.online ? "bg-brand-500" : "bg-ink-faint"
                )}
                title={trader.online ? t("En ligne", "Online") : t("Hors ligne", "Offline")}
              />
            </div>
          </Card>

          <Card className="flex h-[420px] flex-col overflow-hidden">
            <div className="border-b border-line px-4 py-2.5 text-xs font-bold dark:border-night-line">
              {t("Chat de l'ordre", "Order chat")}
            </div>
            <div ref={chatBox} className="flex-1 space-y-3 overflow-y-auto bg-surface p-3.5 dark:bg-night-bg">
              {chat.map((m) =>
                m.from === "system" ? (
                  <div key={m.id} className="flex justify-center">
                    <p className="inline-flex max-w-[90%] items-start gap-1.5 rounded-lg bg-brand-100/70 px-3 py-1.5 text-2xs font-medium text-brand-900 dark:bg-brand-900/50 dark:text-brand-200">
                      <ShieldCheck className="mt-px h-3 w-3 shrink-0" aria-hidden />
                      {m.text}
                    </p>
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className={classNames("flex", m.from === "customer" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={classNames(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-card",
                        m.from === "customer"
                          ? "rounded-br-md bg-brand-500 text-white"
                          : "rounded-bl-md bg-white dark:bg-night-card dark:text-[#E6EFEA]"
                      )}
                    >
                      {m.text}
                      <p
                        className={classNames(
                          "mt-0.5 text-right text-2xs",
                          m.from === "customer" ? "text-brand-100/80" : "text-ink-faint"
                        )}
                      >
                        {m.at}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex items-end gap-2 border-t border-line p-2.5 dark:border-night-line">
              <button
                className="rounded-lg p-2 text-ink-muted hover:bg-surface-sunken hover:text-brand-600 dark:hover:bg-night-raised"
                aria-label={t("Joindre un reçu", "Attach receipt")}
                onClick={() => toast(t("Reçu joint (démo)", "Receipt attached (demo)"), "info")}
              >
                <Upload className="h-4 w-4" />
              </button>
              <textarea
                rows={1}
                className="input-base resize-none"
                placeholder={t("Écrire au trader…", "Message the trader…")}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <Button size="md" onClick={send} aria-label={t("Envoyer", "Send")}>
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* receipt */}
      <Modal open={receiptOpen} onClose={() => setReceiptOpen(false)} title={t("Reçu d'ordre P2P", "P2P order receipt")}>
        <div className="print-area rounded-xl border border-dashed border-line p-4 text-xs dark:border-night-lineStrong">
          <p className="text-center text-sm font-extrabold tracking-tight">NIMBA MONEY · P2P</p>
          <p className="text-center text-2xs text-ink-muted dark:text-[#8FA79C]">{base.id}</p>
          <dl className="mt-4 space-y-1.5">
            {[
              [t("Trader", "Trader"), trader.name],
              [t("Sens", "Side"), isBuy ? `${t("Achat", "Buy")} ${asset.id}` : `${t("Vente", "Sell")} ${asset.id}`],
              [t("Montant", "Amount"), formatGnf(base.amountGnf)],
              [t("Prix", "Price"), `${base.priceGnf >= 1_000_000 ? formatGnfCompact(base.priceGnf, lang) : formatNumber(base.priceGnf) + " GNF"}/${asset.id}`],
              [asset.id, `${base.amountUsdt.toLocaleString("fr-FR")} ${asset.id}`],
              [t("Moyen", "Method"), railLabel(base.method, lang)],
              [t("Statut", "Status"), t("Terminé", "Completed")],
            ].map(([k, v]) => (
              <div key={k as string} className="flex justify-between gap-4">
                <dt className="text-ink-muted dark:text-[#8FA79C]">{k}</dt>
                <dd className="font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Button full className="mt-4" onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden />
          {t("Imprimer / PDF", "Print / PDF")}
        </Button>
      </Modal>
    </div>
  );
}

export default function P2POrderPage() {
  return (
    <Suspense>
      <OrderInner />
    </Suspense>
  );
}
