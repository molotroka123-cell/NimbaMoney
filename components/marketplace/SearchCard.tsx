"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowDownUp, MapPin, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n";
import { paymentRails, districts, type RailId } from "@/config/product";
import {
  formatAmountInput,
  formatGnf,
  parseAmount,
} from "@/lib/format";
import type { SearchParams } from "@/lib/marketplace";
import { classNames } from "@/lib/format";

export function SearchCard({
  initial,
  onSearch,
  sticky,
}: {
  initial: SearchParams;
  /** When provided, search updates in place (find page); otherwise navigates to /find. */
  onSearch?: (p: SearchParams) => void;
  sticky?: boolean;
}) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const [mode, setMode] = useState<"need_cash" | "have_cash">(
    initial.need === "cash" ? "need_cash" : "have_cash"
  );
  const [have, setHave] = useState<RailId>(initial.have);
  const [need, setNeed] = useState<RailId>(initial.need);
  const [amount, setAmount] = useState(formatAmountInput(String(initial.amountGnf)));
  const [district, setDistrict] = useState(initial.district);

  const amountGnf = parseAmount(amount);
  const valid = amountGnf >= 100_000 && have !== need;

  const submit = () => {
    if (!valid) return;
    const p: SearchParams = { have, need, amountGnf, district };
    if (onSearch) {
      onSearch(p);
    } else {
      const q = new URLSearchParams({
        have,
        need,
        amount: String(amountGnf),
        district,
      });
      router.push(`/find?${q.toString()}`);
    }
  };

  const switchMode = (m: "need_cash" | "have_cash") => {
    setMode(m);
    if (m === "need_cash") {
      setHave(have === "cash" ? "bank" : have);
      setNeed("cash");
    } else {
      setHave("cash");
      setNeed(need === "cash" ? "bank" : need);
    }
  };

  const railOptions = (exclude: RailId) =>
    paymentRails
      .filter((r) => r.id !== exclude)
      .map((r) => (
        <option key={r.id} value={r.id}>
          {lang === "fr" ? r.labelFr : r.labelEn}
        </option>
      ));

  return (
    <Card className={classNames("card-pad", sticky && "lg:sticky lg:top-[72px]")}>
      {/* mode tabs */}
      <div
        className="mb-4 grid grid-cols-2 rounded-control bg-surface-sunken p-1 dark:bg-night-raised"
        role="tablist"
        aria-label={t("Type de besoin", "Need type")}
      >
        {(
          [
            ["need_cash", t("J'ai besoin d'espèces", "I need cash")],
            ["have_cash", t("J'ai des espèces", "I have cash")],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={classNames(
              "rounded-[7px] px-2 py-1.5 text-xs font-semibold transition-colors",
              mode === m
                ? "bg-white text-brand-800 shadow-sm dark:bg-night-card dark:text-brand-200"
                : "text-ink-muted hover:text-ink dark:text-[#8FA79C]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="label-xs" htmlFor="have">
            {t("J'ai", "I have")}
          </label>
          <select
            id="have"
            className="input-base"
            value={have}
            onChange={(e) => setHave(e.target.value as RailId)}
            disabled={mode === "have_cash"}
          >
            {mode === "have_cash" ? (
              <option value="cash">{t("Espèces", "Cash")}</option>
            ) : (
              railOptions("cash")
            )}
          </select>
        </div>

        <div>
          <label className="label-xs" htmlFor="amount">
            {t("Montant", "Amount")}
          </label>
          <div className="relative">
            <input
              id="amount"
              inputMode="numeric"
              className="input-base pr-14 font-semibold tabular-nums"
              value={amount}
              placeholder="10 000 000"
              onChange={(e) => setAmount(formatAmountInput(e.target.value))}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-bold text-ink-muted">
              GNF
            </span>
          </div>
          <p className="mt-1 text-2xs text-ink-muted dark:text-[#8FA79C]">
            {t("Min. 100 000 GNF — Max. 50 000 000 GNF", "Min. 100,000 GNF — Max. 50,000,000 GNF")}
          </p>
        </div>

        <div className="flex items-center justify-center" aria-hidden>
          <ArrowDownUp className="h-4 w-4 text-ink-faint" />
        </div>

        <div>
          <label className="label-xs" htmlFor="need">
            {t("J'ai besoin de", "I need")}
          </label>
          <select
            id="need"
            className="input-base"
            value={need}
            onChange={(e) => setNeed(e.target.value as RailId)}
            disabled={mode === "need_cash"}
          >
            {mode === "need_cash" ? (
              <option value="cash">{t("Espèces", "Cash")}</option>
            ) : (
              railOptions("cash")
            )}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label-xs" htmlFor="city">
              {t("Ville", "City")}
            </label>
            <select id="city" className="input-base" defaultValue="Conakry">
              <option>Conakry</option>
            </select>
          </div>
          <div>
            <label className="label-xs" htmlFor="district">
              {t("Quartier", "District")}
            </label>
            <select
              id="district"
              className="input-base"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === "Tous les quartiers" && lang === "en"
                    ? "All districts"
                    : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button full size="lg" onClick={submit} disabled={!valid}>
          {t("Trouver un partenaire vérifié", "Find verified providers")}
        </Button>

        <div className="flex items-center justify-center gap-1.5">
          <PlayCircle className="h-3.5 w-3.5 text-brand-500" aria-hidden />
          <Link
            href="/verification"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
          >
            {t("Comment ça marche ?", "How does it work?")}
          </Link>
        </div>
      </div>

      {amountGnf > 0 && (
        <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-2xs text-brand-800 dark:bg-brand-900/50 dark:text-brand-200">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
          {t(
            `Recherche : ${formatGnf(amountGnf)} · règlement direct avec le partenaire, frais affichés avant confirmation.`,
            `Searching: ${formatGnf(amountGnf)} · direct settlement with the provider, fees shown before you confirm.`
          )}
        </p>
      )}
    </Card>
  );
}
