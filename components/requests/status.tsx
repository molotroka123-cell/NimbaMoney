"use client";

import React from "react";
import { Pill } from "@/components/ui/Badge";
import type { RequestStatus } from "@/types";

export function statusPill(
  status: RequestStatus,
  t: (fr: string, en: string) => string
) {
  const map: Record<
    RequestStatus,
    { label: string; tone: "green" | "amber" | "blue" | "red" | "neutral" }
  > = {
    created: { label: t("Créée", "Created"), tone: "blue" },
    accepted: { label: t("Acceptée", "Accepted"), tone: "blue" },
    instructions: { label: t("Instructions envoyées", "Instructions sent"), tone: "amber" },
    transfer_confirmed: { label: t("Transfert confirmé", "Transfer confirmed"), tone: "amber" },
    released: { label: t("Fonds remis", "Funds handed over"), tone: "green" },
    completed: { label: t("Terminée", "Completed"), tone: "green" },
    cancelled: { label: t("Annulée", "Cancelled"), tone: "neutral" },
    disputed: { label: t("En litige", "Disputed"), tone: "red" },
  };
  const { label, tone } = map[status];
  return <Pill tone={tone}>{label}</Pill>;
}
