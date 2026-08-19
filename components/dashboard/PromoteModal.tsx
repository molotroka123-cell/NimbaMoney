"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FeaturedBadge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { districts } from "@/config/product";

export function PromoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [district, setDistrict] = useState("Kaloum");
  const [duration, setDuration] = useState("7");
  const [service, setService] = useState("Virement → Espèces");
  const [budget, setBudget] = useState("2 000 000");

  return (
    <Modal open={open} onClose={onClose} title={t("Promouvoir ma fiche", "Promote listing")} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3.5">
          <div>
            <label className="label-xs">{t("Quartier", "District")}</label>
            <select className="input-base" value={district} onChange={(e) => setDistrict(e.target.value)}>
              {districts.filter((d) => d !== "Tous les quartiers").map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-xs">{t("Durée", "Duration")}</label>
            <select className="input-base" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="7">7 {t("jours", "days")}</option>
              <option value="14">14 {t("jours", "days")}</option>
              <option value="30">30 {t("jours", "days")}</option>
            </select>
          </div>
          <div>
            <label className="label-xs">{t("Service", "Service")}</label>
            <select className="input-base" value={service} onChange={(e) => setService(e.target.value)}>
              <option>Virement → Espèces</option>
              <option>Orange Money → Espèces</option>
              <option>Espèces → Virement</option>
            </select>
          </div>
          <div>
            <label className="label-xs">{t("Budget (GNF) — illustratif", "Budget (GNF) — illustrative")}</label>
            <input className="input-base tabular-nums" value={budget} onChange={(e) => setBudget(e.target.value)} inputMode="numeric" />
          </div>
        </div>
        {/* preview */}
        <div>
          <p className="label-xs">{t("Aperçu dans les résultats", "Preview in results")}</p>
          <div className="rounded-xl border border-amber-200 bg-white p-3 shadow-card dark:border-amber-800 dark:bg-night-card">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-2xs font-bold text-white">KT</div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold">
                  Kaba Trade <FeaturedBadge />
                </p>
                <p className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                  {service} · {district}
                </p>
              </div>
            </div>
            <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 text-2xs text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              {t(
                "Toujours affiché avec l'étiquette « Sponsorisé » — jamais présenté comme meilleur prix.",
                "Always shown with the “Sponsored” label — never presented as the best rate."
              )}
            </p>
          </div>
          <Button
            full
            className="mt-4"
            onClick={() => {
              onClose();
              toast(
                t(
                  `Campagne créée : ${district}, ${duration} j (prototype)`,
                  `Campaign created: ${district}, ${duration} d (prototype)`
                )
              );
            }}
          >
            {t("Lancer la campagne", "Start campaign")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
