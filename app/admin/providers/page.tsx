"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  MailQuestion,
  XCircle,
  PauseCircle,
  FileText,
  MapPin,
  Landmark,
  Fingerprint,
} from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Modal";
import { Pill } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { applications as initial } from "@/data/mock/admin";
import type { ProviderApplication } from "@/types";

/**
 * Admin — provider application review. Every action writes to the audit
 * history (simulated in the prototype with an in-page log).
 */
export default function AdminProvidersPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [apps, setApps] = useState<ProviderApplication[]>(initial);
  const [openApp, setOpenApp] = useState<ProviderApplication | null>(null);
  const [audit, setAudit] = useState<string[]>([]);

  const act = (
    id: string,
    status: ProviderApplication["status"],
    label: string
  ) => {
    setApps((xs) => xs.map((a) => (a.id === id ? { ...a, status } : a)));
    setAudit((xs) => [
      `${label} · ${id} · admin.fode · ${t("à l'instant", "just now")}`,
      ...xs,
    ]);
    setOpenApp(null);
    toast(`${label} — ${id}`);
  };

  const pill = (s: ProviderApplication["status"]) =>
    s === "new" ? (
      <Pill tone="blue">{t("Nouvelle", "New")}</Pill>
    ) : s === "in_review" ? (
      <Pill tone="amber">{t("En revue", "In review")}</Pill>
    ) : s === "needs_info" ? (
      <Pill tone="amber">{t("Infos requises", "Needs info")}</Pill>
    ) : s === "approved" ? (
      <Pill tone="green">{t("Approuvée", "Approved")}</Pill>
    ) : (
      <Pill tone="red">{t("Rejetée", "Rejected")}</Pill>
    );

  return (
    <div className="space-y-4">
      <SectionTitle
        title={t("Candidatures partenaires", "Provider applications")}
        subtitle={t(
          "KYB complet avant toute mise en ligne. Chaque action est auditée.",
          "Full KYB before any listing goes live. Every action is audited."
        )}
      />

      <Card>
        <ul className="divide-y divide-line dark:divide-night-line">
          {apps.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="text-[13px] font-bold hover:text-brand-600"
                    onClick={() => setOpenApp(a)}
                  >
                    {a.businessName}
                  </button>
                  {pill(a.status)}
                </div>
                <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                  {a.id} · {a.ownerName} · {a.district} · {a.services.join(", ")} · {a.submittedAt}
                </p>
                {a.riskNote && (
                  <p className="mt-1 text-2xs font-medium text-warn">⚠ {a.riskNote}</p>
                )}
              </div>
              <Button variant="secondary" size="sm" onClick={() => setOpenApp(a)}>
                {t("Examiner", "Review")}
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {audit.length > 0 && (
        <Card className="card-pad">
          <h3 className="text-sm font-bold">{t("Actions de cette session", "This session's actions")}</h3>
          <ul className="mt-2 space-y-1 text-2xs text-ink-muted dark:text-[#8FA79C]">
            {audit.map((l, i) => (
              <li key={i}>• {l}</li>
            ))}
          </ul>
        </Card>
      )}

      <Drawer
        open={!!openApp}
        onClose={() => setOpenApp(null)}
        title={openApp ? `${openApp.id} — ${openApp.businessName}` : ""}
      >
        {openApp && (
          <div className="space-y-4">
            <div className="space-y-2 text-xs">
              {(
                [
                  [t("Propriétaire", "Owner"), openApp.ownerName],
                  [t("Quartier", "District"), openApp.district],
                  [t("Services", "Services"), openApp.services.join(", ")],
                  [t("Soumise le", "Submitted"), openApp.submittedAt],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-line pb-1.5 dark:border-night-line">
                  <span className="text-ink-muted dark:text-[#8FA79C]">{k}</span>
                  <span className="text-right font-semibold">{v}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="label-xs">{t("Dossier", "File")}</p>
              <ul className="space-y-1.5">
                {[
                  { Icon: Fingerprint, label: t("Pièce d'identité + selfie", "ID document + selfie") },
                  { Icon: FileText, label: t("Registre de commerce (RCCM)", "Business registration (RCCM)") },
                  { Icon: MapPin, label: t("Preuve d'adresse d'exploitation", "Operating address proof") },
                  { Icon: Landmark, label: t("Compte de règlement", "Settlement account") },
                ].map(({ Icon, label }) => (
                  <li key={label}>
                    <button
                      className="flex w-full items-center gap-2.5 rounded-lg border border-line px-3 py-2 text-xs font-medium hover:border-brand-400 dark:border-night-line"
                      onClick={() => toast(t("Document ouvert (prototype)", "Document opened (prototype)"), "info")}
                    >
                      <Icon className="h-3.5 w-3.5 text-brand-500" aria-hidden />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {openApp.riskNote && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-2xs font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                {t("Note de risque :", "Risk note:")} {openApp.riskNote}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 border-t border-line pt-4 dark:border-night-line">
              <Button size="sm" onClick={() => act(openApp.id, "approved", t("APPROUVÉE", "APPROVED"))}>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                {t("Approuver", "Approve")}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => act(openApp.id, "needs_info", t("INFOS DEMANDÉES", "INFO REQUESTED"))}>
                <MailQuestion className="h-3.5 w-3.5" aria-hidden />
                {t("Demander des infos", "Request info")}
              </Button>
              <Button size="sm" variant="secondary" className="!text-danger" onClick={() => act(openApp.id, "rejected", t("REJETÉE", "REJECTED"))}>
                <XCircle className="h-3.5 w-3.5" aria-hidden />
                {t("Rejeter", "Reject")}
              </Button>
              <Button size="sm" variant="ghost" className="!text-warn" onClick={() => act(openApp.id, "in_review", t("SUSPENDUE", "SUSPENDED"))}>
                <PauseCircle className="h-3.5 w-3.5" aria-hidden />
                {t("Suspendre", "Suspend")}
              </Button>
            </div>
            <p className="text-2xs text-ink-faint">
              {t(
                "Chaque action crée une entrée d'audit horodatée.",
                "Every action creates a timestamped audit entry."
              )}
            </p>
          </div>
        )}
      </Drawer>
    </div>
  );
}
