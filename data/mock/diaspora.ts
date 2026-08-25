/**
 * Diaspora remittance corridor demo data — France → Guinée (démo).
 * All figures are illustrative and deterministic; nothing is a live quote.
 */

export interface PayoutMethod {
  id: string;
  labelFr: string;
  labelEn: string;
}

export const payoutMethods: PayoutMethod[] = [
  { id: "orange", labelFr: "Orange Money", labelEn: "Orange Money" },
  { id: "mtn", labelFr: "MTN MoMo", labelEn: "MTN MoMo" },
  { id: "wave", labelFr: "Wave", labelEn: "Wave" },
  {
    id: "cash",
    labelFr: "Retrait espèces chez un partenaire",
    labelEn: "Cash pickup at a partner",
  },
];

export interface CorridorOperator {
  id: string;
  nameFr: string;
  nameEn: string;
  /** Illustrative all-in fee for a 500 € transfer (démo). */
  feeEur: number;
  feePct: number;
  etaFr: string;
  etaEn: string;
  isNimba?: boolean;
}

/** "Le même transfert ailleurs" — illustrative all-in costs for 500 € (démo). */
export const corridorOperators: CorridorOperator[] = [
  {
    id: "wu",
    nameFr: "Western Union",
    nameEn: "Western Union",
    feeEur: 41,
    feePct: 8.2,
    etaFr: "1–2 jours",
    etaEn: "1–2 days",
  },
  {
    id: "mg",
    nameFr: "MoneyGram",
    nameEn: "MoneyGram",
    feeEur: 38,
    feePct: 7.6,
    etaFr: "1–2 jours",
    etaEn: "1–2 days",
  },
  {
    id: "bank",
    nameFr: "Banque traditionnelle",
    nameEn: "Traditional bank",
    feeEur: 55,
    feePct: 11,
    etaFr: "2–5 jours",
    etaEn: "2–5 days",
  },
  {
    id: "nimba",
    nameFr: "Nimba",
    nameEn: "Nimba",
    feeEur: 7,
    feePct: 1.4,
    etaFr: "Minutes",
    etaEn: "Minutes",
    isNimba: true,
  },
];
