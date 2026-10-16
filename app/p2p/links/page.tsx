"use client";

import React, { useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Link2, MessageCircle, Plus } from "lucide-react";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { CurrencySwipe } from "@/components/ui/CurrencySwipe";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { assetInfo } from "@/config/product";
import { classNames } from "@/lib/format";

type Link = { id: string; amount: number; cur: string; desc: string; paid: boolean };

const seed: Link[] = [
  { id: "NL-4821", amount: 250, cur: "EUR", desc: "Invoice #2041 · electronics", paid: true },
  { id: "NL-4819", amount: 1200, cur: "USD", desc: "Wholesale order", paid: false },
];

function payUrl(l: Pick<Link, "amount" | "cur" | "desc">, origin: string) {
  const q = new URLSearchParams({ a: String(l.amount), c: l.cur, d: l.desc, m: "Kaba Trade" });
  return `${origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/pay?${q.toString()}`;
}

export default function PaymentLinksPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [amount, setAmount] = useState("250");
  const [cur, setCur] = useState("EUR");
  const [desc, setDesc] = useState("Invoice #2042");
  const [links, setLinks] = useState<Link[]>(seed);
  const [copied, setCopied] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const num = Number(amount.replace(/[^\d.]/g, "")) || 0;
  const a = assetInfo(cur);
  const draft = useMemo(() => ({ amount: num, cur, desc: desc || "Payment" }), [num, cur, desc]);

  const create = () => {
    if (num <= 0) return;
    const id = `NL-${4822 + links.length}`;
    setLinks((ls) => [{ id, ...draft, paid: false }, ...ls]);
    toast(t("Lien de paiement créé", "Payment link created"), "success");
  };

  const copy = (l: Link) => {
    navigator.clipboard
      .writeText(payUrl(l, origin))
      .then(() => {
        setCopied(l.id);
        setTimeout(() => setCopied((c) => (c === l.id ? null : c)), 1600);
      })
      .catch(() => toast(t("Impossible de copier", "Could not copy"), "warn"));
  };

  const wa = (l: Link) =>
    `https://wa.me/?text=${encodeURIComponent(`${l.desc} — ${a.symbol}${l.amount} ${l.cur}\n${payUrl(l, origin)}`)}`;

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-extrabold">
          <Link2 className="h-5 w-5 text-brand-500" aria-hidden />
          {t("Liens de paiement", "Payment links")}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Créez un lien, envoyez-le sur WhatsApp — votre client paie en USD, EUR, GBP ou mobile money, sans application.",
            "Create a link, send it on WhatsApp — your customer pays in USD, EUR, GBP or mobile money, no app needed."
          )}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card className="card-pad space-y-3">
            <div>
              <label htmlFor="pl-amount" className="label-xs">{t("Montant", "Amount")}</label>
              <div className="relative">
                <input
                  id="pl-amount"
                  inputMode="decimal"
                  className="input-base pr-14 font-semibold tabular-nums"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-muted">{a.symbol} {a.id}</span>
              </div>
              <CurrencySwipe className="mt-2" value={cur} onChange={setCur} label={t("Devise", "Currency")} />
            </div>
            <div>
              <label htmlFor="pl-desc" className="label-xs">{t("Description", "Description")}</label>
              <input id="pl-desc" className="input-base" value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={60} />
            </div>
            <Button onClick={create} disabled={num <= 0}>
              <Plus className="h-4 w-4" aria-hidden />
              {t("Créer le lien", "Create link")}
            </Button>
          </Card>

          <Card className="card-pad">
            <h2 className="text-sm font-bold">{t("Vos liens", "Your links")}</h2>
            <ul className="mt-3 divide-y divide-line dark:divide-night-line">
              {links.map((l) => {
                const x = assetInfo(l.cur);
                return (
                  <li key={l.id} className="flex flex-wrap items-center gap-2 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{l.desc}</p>
                      <p className="text-2xs text-ink-muted">{l.id} · {x.symbol}{l.amount.toLocaleString("fr-FR")} {l.cur}</p>
                    </div>
                    <Pill tone={l.paid ? "green" : "amber"}>{l.paid ? t("Payé", "Paid") : t("En attente", "Pending")}</Pill>
                    <div className="flex gap-1">
                      <Button size="xs" variant="secondary" onClick={() => copy(l)} aria-label={t("Copier le lien", "Copy link")}>
                        {copied === l.id ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                      </Button>
                      <a href={wa(l)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line bg-white text-ink-secondary hover:border-line-strong dark:border-night-lineStrong dark:bg-night-raised dark:text-[#CBDDD4]"><MessageCircle className="h-3.5 w-3.5" aria-hidden /></a>
                      <a href={payUrl(l, origin)} target="_blank" rel="noreferrer" aria-label={t("Ouvrir", "Open")} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line bg-white text-ink-secondary hover:border-line-strong dark:border-night-lineStrong dark:bg-night-raised dark:text-[#CBDDD4]"><ExternalLink className="h-3.5 w-3.5" aria-hidden /></a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <Card className="card-pad">
          <p className="text-2xs font-bold uppercase tracking-wide text-ink-muted">{t("Aperçu client", "Customer preview")}</p>
          <div className="mx-auto mt-3 w-[230px] rounded-[26px] border-4 border-brand-900 bg-white p-3 shadow-lg dark:bg-night-card">
            <p className="text-2xs font-bold text-brand-600">Kaba Trade ✓</p>
            <p className="mt-0.5 truncate text-2xs text-ink-muted">{draft.desc}</p>
            <p className="mt-2 text-2xl font-extrabold tabular-nums">{a.symbol}{num.toLocaleString("fr-FR")}</p>
            <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] font-bold">
              {["Orange Money", "MTN MoMo", "Wave", "Card"].map((m, i) => (
                <span key={m} className={classNames("rounded-lg border px-2 py-1.5 text-center", i === 0 ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line")}>{m}</span>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-brand-500 py-2 text-center text-xs font-bold text-white">{t("Payer maintenant", "Pay now")}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
