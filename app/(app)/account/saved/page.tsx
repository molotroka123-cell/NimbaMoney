"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";
import { Card, Avatar, EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { VerificationBadge, Rating, StatusBadge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { providers } from "@/data/mock/providers";

export default function SavedProvidersPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [saved, setSaved] = useState(providers.slice(0, 3).map((p) => p.id));
  const list = providers.filter((p) => saved.includes(p.id));

  if (list.length === 0) {
    return (
      <Card>
        <EmptyState
          title={t("Aucun partenaire enregistré.", "No saved providers yet.")}
          hints={[
            t(
              "Enregistrez un partenaire depuis son profil pour le retrouver ici.",
              "Save a provider from their profile to find them here."
            ),
          ]}
          action={
            <Link href="/providers">
              <Button variant="secondary">{t("Parcourir l'annuaire", "Browse the directory")}</Button>
            </Link>
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {list.map((p) => (
        <Card key={p.id} className="card-pad">
          <div className="flex flex-wrap items-center gap-3">
            <Avatar initials={p.logoInitials} hue={p.logoHue} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <Link href={`/providers/${p.slug}`} className="text-[13px] font-bold hover:text-brand-600">
                  {p.name}
                </Link>
                <VerificationBadge type={p.type} level={p.verification.level} compact />
                <StatusBadge status={p.status} />
              </div>
              <p className="mt-0.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
                <Rating value={p.rating} compact /> · {p.locations[0].district} · ~
                {p.responseMinutes} min
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSaved((xs) => xs.filter((id) => id !== p.id));
                toast(t("Retiré des favoris", "Removed from saved"));
              }}
            >
              <Bookmark className="h-3.5 w-3.5 fill-brand-500 text-brand-500" aria-hidden />
              {t("Retirer", "Remove")}
            </Button>
            <Link href={`/providers/${p.slug}`}>
              <Button variant="secondary" size="sm">
                {t("Profil", "Profile")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
