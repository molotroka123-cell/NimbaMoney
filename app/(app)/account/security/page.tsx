"use client";

import React, { useState } from "react";
import { KeyRound, Smartphone, ShieldCheck, LogOut } from "lucide-react";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { classNames } from "@/lib/format";

export default function SecurityPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="card-pad">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <KeyRound className="mt-0.5 h-4 w-4 text-brand-500" aria-hidden />
            <div>
              <p className="text-[13px] font-bold">{t("Mot de passe", "Password")}</p>
              <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                {t("Dernière modification il y a 3 mois", "Last changed 3 months ago")}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast(t("Lien de réinitialisation envoyé par SMS", "Reset link sent by SMS"), "info")}
          >
            {t("Modifier", "Change")}
          </Button>
        </div>
      </Card>

      <Card className="card-pad">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Smartphone className="mt-0.5 h-4 w-4 text-brand-500" aria-hidden />
            <div>
              <p className="text-[13px] font-bold">
                {t("Vérification en deux étapes", "Two-step verification")}{" "}
                {twoFa && <Pill tone="green">{t("Activée", "On")}</Pill>}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                {t("Code SMS au +224 •• •• •• 28", "SMS code to +224 •• •• •• 28")}
              </p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={twoFa}
            onClick={() => {
              setTwoFa(!twoFa);
              toast(
                twoFa
                  ? t("Vérification en deux étapes désactivée", "Two-step verification disabled")
                  : t("Vérification en deux étapes activée", "Two-step verification enabled"),
                twoFa ? "warn" : "success"
              );
            }}
            className={classNames(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              twoFa ? "bg-brand-500" : "bg-line dark:bg-night-lineStrong"
            )}
          >
            <span
              className={classNames(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                twoFa ? "left-[22px]" : "left-0.5"
              )}
            />
          </button>
        </div>
      </Card>

      <Card className="card-pad">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-500" aria-hidden />
          <div className="flex-1">
            <p className="text-[13px] font-bold">{t("Sessions actives", "Active sessions")}</p>
            <ul className="mt-2 space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span>Chrome · Conakry, GN</span>
                <Pill tone="green">{t("Cette session", "This session")}</Pill>
              </li>
              <li className="flex items-center justify-between">
                <span>Android App · Conakry, GN</span>
                <span className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                  {t("il y a 2 h", "2 h ago")}
                </span>
              </li>
            </ul>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 !text-danger"
              onClick={() => toast(t("Toutes les autres sessions déconnectées", "All other sessions signed out"), "warn")}
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              {t("Déconnecter les autres sessions", "Sign out other sessions")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
