"use client";

import React from "react";
import { MessageCircle, Mail, AlertTriangle, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { AnnouncementsCard } from "@/components/marketplace/RightPanel";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { supportWhatsApp } from "@/config/product";

export default function SupportPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  return (
    <div className="grid max-w-4xl gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <Card className="card-pad">
          <h2 className="text-sm font-bold">{t("Contacter le support", "Contact support")}</h2>
          <p className="mt-1 text-xs text-ink-muted dark:text-[#8FA79C]">
            {t(
              "Disponible 7j/7 · réponse médiane < 5 min pendant les heures d'ouverture.",
              "Available 7 days a week · median reply < 5 min during opening hours."
            )}
          </p>
          <div className="mt-3 space-y-2">
            <Button
              full
              onClick={() =>
                toast(
                  t(
                    `Ouverture de WhatsApp — ${supportWhatsApp}`,
                    `Opening WhatsApp — ${supportWhatsApp}`
                  ),
                  "info"
                )
              }
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {t("Support WhatsApp", "WhatsApp Support")}
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </Button>
            <Button
              variant="secondary"
              full
              onClick={() => toast(t("E-mail : support@nimbamoney.gn (prototype)", "Email: support@nimbamoney.gn (prototype)"), "info")}
            >
              <Mail className="h-4 w-4" aria-hidden />
              {t("Écrire un e-mail", "Send an email")}
            </Button>
            <Button
              variant="secondary"
              full
              onClick={() =>
                toast(
                  t(
                    "Pour un litige, ouvrez-le depuis la page de la demande concernée.",
                    "To dispute a deal, open it from that request's page."
                  ),
                  "warn"
                )
              }
            >
              <AlertTriangle className="h-4 w-4 text-warn" aria-hidden />
              {t("Signaler un problème sur une transaction", "Report a deal issue")}
            </Button>
          </div>
        </Card>

        <Card className="card-pad">
          <h2 className="text-sm font-bold">{t("Mes tickets", "My tickets")}</h2>
          <ul className="mt-2 space-y-2 text-xs">
            <li className="flex items-center justify-between gap-2">
              <span>
                TCK-118 · {t("Question sur les frais", "Question about fees")}
              </span>
              <Pill tone="green">{t("Résolu", "Resolved")}</Pill>
            </li>
          </ul>
        </Card>
      </div>

      <AnnouncementsCard />
    </div>
  );
}
