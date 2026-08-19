"use client";

import React from "react";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";

export default function ProfilePage() {
  const { t } = useI18n();
  const { toast } = useToast();
  return (
    <div className="max-w-2xl space-y-4">
      <Card className="card-pad">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-lg font-bold text-brand-100">
            TD
          </div>
          <div>
            <p className="text-sm font-bold">Timur Darwaish</p>
            <p className="text-xs text-ink-muted dark:text-[#8FA79C]">
              timurdarwaish228@gmail.com · +224 6•• •• •• 28
            </p>
            <p className="mt-1">
              <Pill tone="amber">
                {t("Vérification basique", "Basic verification")}
              </Pill>
            </p>
          </div>
        </div>
      </Card>

      <Card className="card-pad space-y-3.5">
        <div>
          <label className="label-xs" htmlFor="pf-name">
            {t("Nom complet", "Full name")}
          </label>
          <input id="pf-name" className="input-base" defaultValue="Timur Darwaish" />
        </div>
        <div>
          <label className="label-xs" htmlFor="pf-phone">
            {t("Téléphone", "Phone")}
          </label>
          <input id="pf-phone" className="input-base" defaultValue="+224 620 12 34 28" />
        </div>
        <div>
          <label className="label-xs" htmlFor="pf-district">
            {t("Quartier habituel", "Usual district")}
          </label>
          <select id="pf-district" className="input-base" defaultValue="Kaloum">
            <option>Kaloum</option>
            <option>Dixinn</option>
            <option>Ratoma</option>
            <option>Matam</option>
            <option>Matoto</option>
          </select>
        </div>
        <div>
          <label className="label-xs" htmlFor="pf-lang">
            {t("Langue préférée", "Preferred language")}
          </label>
          <select id="pf-lang" className="input-base" defaultValue="fr">
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
        <Button onClick={() => toast(t("Profil mis à jour", "Profile updated"))}>
          {t("Enregistrer", "Save changes")}
        </Button>
      </Card>
    </div>
  );
}
