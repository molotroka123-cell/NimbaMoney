"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ShieldCheck,
  FileText,
  Paperclip,
  Scale,
  Clock,
  Check,
  ChevronDown,
  Landmark,
} from "lucide-react";
import { Card, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { orders, getTrader } from "@/data/mock/p2p";
import { classNames, formatGnf } from "@/lib/format";

export default function P2PDisputesPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();
  const disputed = orders.filter((o) => o.status === "disputed");
  const [openId, setOpenId] = useState<string | null>(disputed[0]?.id ?? null);
  const [extraEvidence, setExtraEvidence] = useState<string[]>([]);

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold">
            <Scale className="h-5 w-5 text-brand-500" aria-hidden />
            {t("Centre d'arbitrage", "Arbitration center")}
          </h1>
          <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Un litige gèle l'ordre (démo). Preuves, arbitre dédié et décision motivée sous 24 h ouvrées.",
              "A dispute freezes the order (demo). Evidence, a dedicated arbiter and a reasoned ruling within 24 business hours."
            )}
          </p>
        </div>
        <Pill tone="green">{t("SLA 24 h", "24 h SLA")}</Pill>
      </div>

      {/* active disputes */}
      {disputed.map((o) => {
        const tr = getTrader(o.traderId)!;
        const open = openId === o.id;
        const evidence = [
          t("reçu-orange-money.pdf", "orange-money-receipt.pdf"),
          t("capture-virement.png", "transfer-screenshot.png"),
          ...extraEvidence,
        ];
        return (
          <Card key={o.id} className="overflow-hidden">
            <button
              onClick={() => setOpenId(open ? null : o.id)}
              className="flex w-full flex-wrap items-center gap-3 p-4 text-left hover:bg-surface-sunken/60 dark:hover:bg-night-raised/60"
              aria-expanded={open}
            >
              <Avatar initials={tr.initials} hue={tr.hue} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-bold">{o.id}</span>
                  <Pill tone="red">{t("En examen", "Under review")}</Pill>
                </div>
                <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                  {tr.name} · {formatGnf(o.amountGnf)} · {t("motif : paiement non reçu", "reason: payment not received")}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-2xs font-semibold text-warn">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {t("Réponse sous 9 h 14", "Ruling due in 9 h 14 m")}
              </span>
              <ChevronDown
                className={classNames("h-4 w-4 shrink-0 text-ink-faint transition-transform", open && "rotate-180")}
                aria-hidden
              />
            </button>

            {open && (
              <div className="border-t border-line p-4 dark:border-night-line">
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* case timeline with SLA */}
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                      {t("Chronologie du dossier", "Case timeline")}
                    </p>
                    <ol className="mt-2 space-y-0">
                      {[
                        { fr: "Litige ouvert par l'acheteur", en: "Dispute opened by the buyer", when: "14:02", done: true },
                        { fr: "USDT gelés par la protection Nimba (démo)", en: "USDT frozen by Nimba protection (demo)", when: "14:02", done: true },
                        { fr: "Preuves des deux parties reçues", en: "Evidence received from both sides", when: "15:37", done: true },
                        { fr: "Arbitre assigné : équipe Conformité N2", en: "Arbiter assigned: Compliance team L2", when: "16:10", done: true },
                        { fr: "Décision motivée (SLA 24 h ouvrées)", en: "Reasoned ruling (24 business-hour SLA)", when: t("en cours", "in progress"), done: false },
                      ].map((s, i, arr) => (
                        <li key={s.fr} className="relative flex gap-3 pb-4 last:pb-0">
                          {i < arr.length - 1 && (
                            <span className="absolute left-[9px] top-5 h-full w-px bg-line dark:bg-night-lineStrong" aria-hidden />
                          )}
                          <span
                            className={classNames(
                              "relative z-[1] mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full",
                              s.done
                                ? "bg-brand-500 text-white"
                                : "border-2 border-warn bg-white dark:bg-night-card"
                            )}
                          >
                            {s.done && <Check className="h-3 w-3" aria-hidden />}
                          </span>
                          <div className="min-w-0">
                            <p className={classNames("text-xs", s.done ? "font-semibold" : "font-semibold text-warn")}>
                              {lang === "fr" ? s.fr : s.en}
                            </p>
                            <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">{s.when}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* evidence + parties */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                        {t("Pièces du dossier", "Case evidence")}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {evidence.map((e) => (
                          <span
                            key={e}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-sunken px-2.5 py-1.5 text-2xs font-semibold dark:border-night-lineStrong dark:bg-night-raised"
                          >
                            <FileText className="h-3 w-3 text-brand-500" aria-hidden />
                            {e}
                          </span>
                        ))}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const name = t(
                            `preuve-${extraEvidence.length + 3}.jpg`,
                            `evidence-${extraEvidence.length + 3}.jpg`
                          );
                          setExtraEvidence((xs) => [...xs, name]);
                          toast(t("Preuve ajoutée au dossier (démo)", "Evidence added to the case (demo)"), "info");
                        }}
                      >
                        <Paperclip className="h-3.5 w-3.5" aria-hidden />
                        {t("Ajouter une preuve", "Add evidence")}
                      </Button>
                    </div>

                    <div>
                      <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
                        {t("Fiabilité des parties", "Party reliability")}
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {[
                          { name: "Mohamed D. (vous)", fr: "0 litige perdu · 34 ordres", en: "0 disputes lost · 34 orders", pct: 100 },
                          { name: tr.name, fr: `1 litige perdu · ${tr.trades.toLocaleString("fr-FR")} trades`, en: `1 dispute lost · ${tr.trades.toLocaleString("en-US")} trades`, pct: 98 },
                        ].map((p) => (
                          <li key={p.name} className="flex items-center justify-between gap-3 text-xs">
                            <span className="min-w-0 truncate font-semibold">{p.name}</span>
                            <span className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                              {lang === "fr" ? p.fr : p.en}
                            </span>
                            <span className="shrink-0 font-bold tabular-nums text-brand-600 dark:text-brand-300">
                              {p.pct}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/p2p/order/${o.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
                    >
                      {t("Ouvrir la salle d'ordre", "Open the trade room")} →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* resolved example — shows what a ruling looks like */}
      <Card className="card-pad">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-bold">ORD-7241</p>
          <Pill tone="green">{t("Résolu — décision rendue", "Resolved — ruling issued")}</Pill>
          <span className="ml-auto text-2xs text-ink-muted dark:text-[#8FA79C]">
            {t("il y a 12 jours · traité en 7 h 40", "12 days ago · handled in 7 h 40 m")}
          </span>
        </div>
        <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3.5 dark:border-brand-800 dark:bg-brand-900/20">
          <p className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide text-brand-700 dark:text-brand-300">
            <Scale className="h-3.5 w-3.5" aria-hidden />
            {t("Décision de l'arbitre", "Arbiter's ruling")}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed">
            {t(
              "Le reçu Orange Money fourni par l'acheteur (réf. OM-88213) correspond au montant et au compte du vendeur ; l'horodatage précède l'expiration du délai. Les 578 USDT gelés sont libérés vers l'acheteur. Le vendeur reçoit un avertissement (1/3) pour confirmation tardive.",
              "The Orange Money receipt provided by the buyer (ref. OM-88213) matches the seller's account and amount; the timestamp precedes the payment deadline. The 578 frozen USDT are released to the buyer. The seller receives a warning (1/3) for late confirmation."
            )}
          </p>
        </div>
      </Card>

      {/* insurance fund + how it works */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="card-pad">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
              <Landmark className="h-4.5 w-4.5" aria-hidden />
            </div>
            <div>
              <p className="text-[13px] font-bold">{t("Fonds de garantie (démo)", "Guarantee fund (demo)")}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
                {t(
                  "0,1% de chaque ordre alimente un fonds qui couvre l'utilisateur lésé si la contrepartie est insolvable après décision. Solde du fonds : 184 500 000 GNF.",
                  "0.1% of every order feeds a fund that covers the wronged user if the counterparty is insolvent after a ruling. Fund balance: 184,500,000 GNF."
                )}
              </p>
            </div>
          </div>
        </Card>
        <Card className="card-pad">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
              <ShieldCheck className="h-4.5 w-4.5" aria-hidden />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold">{t("Comment ça marche", "How it works")}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
                {t(
                  "1) Ouvrez le litige depuis la salle d'ordre · 2) Joignez vos preuves · 3) Un arbitre tranche sous 24 h ouvrées avec une décision motivée. Pendant l'examen, les USDT restent gelés (démo).",
                  "1) Open the dispute from the trade room · 2) Attach your evidence · 3) An arbiter rules within 24 business hours with a reasoned decision. During review, USDT stays frozen (demo)."
                )}
              </p>
            </div>
            <AlertTriangle className="h-4 w-4 shrink-0 text-warn" aria-hidden />
          </div>
        </Card>
      </div>
    </div>
  );
}
