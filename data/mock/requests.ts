/** MOCK DATA — development only. */
import type { DealRequest, Deal } from "@/types";

export const requests: DealRequest[] = [
  {
    id: "REQ-2418",
    providerId: "p1",
    from: "bank",
    to: "cash",
    amountGnf: 10_000_000,
    feePct: 2.0,
    feeGnf: 200_000,
    receiveGnf: 9_800_000,
    district: "Kaloum",
    status: "instructions",
    createdAt: "2026-08-19 10:24",
    etaMinutes: 15,
    timeline: [
      { step: "created", at: "10:24", done: true },
      { step: "accepted", at: "10:26", done: true },
      { step: "instructions", at: "10:27", done: true },
      { step: "transfer_confirmed", done: false },
      { step: "released", done: false },
      { step: "completed", done: false },
    ],
  },
  {
    id: "REQ-2395",
    providerId: "p3",
    from: "orange",
    to: "cash",
    amountGnf: 2_500_000,
    feePct: 2.1,
    feeGnf: 52_500,
    receiveGnf: 2_447_500,
    district: "Ratoma",
    status: "completed",
    createdAt: "2026-08-17 15:02",
    etaMinutes: 12,
    timeline: [
      { step: "created", at: "15:02", done: true },
      { step: "accepted", at: "15:03", done: true },
      { step: "instructions", at: "15:04", done: true },
      { step: "transfer_confirmed", at: "15:09", done: true },
      { step: "released", at: "15:14", done: true },
      { step: "completed", at: "15:15", done: true },
    ],
  },
  {
    id: "REQ-2361",
    providerId: "p9",
    from: "bank",
    to: "cash",
    amountGnf: 28_000_000,
    feePct: 1.9,
    feeGnf: 532_000,
    receiveGnf: 27_468_000,
    district: "Kaloum",
    status: "cancelled",
    createdAt: "2026-08-14 09:41",
    etaMinutes: 30,
    timeline: [
      { step: "created", at: "09:41", done: true },
      { step: "accepted", done: false },
      { step: "instructions", done: false },
      { step: "transfer_confirmed", done: false },
      { step: "released", done: false },
      { step: "completed", done: false },
    ],
  },
];

export const completedDeals: Deal[] = [
  {
    id: "DEAL-1187",
    requestId: "REQ-2395",
    providerId: "p3",
    customerId: "u1",
    amountGnf: 2_500_000,
    feeGnf: 52_500,
    finalGnf: 2_447_500,
    method: "Orange Money → Espèces",
    completedAt: "2026-08-17 15:15",
    status: "completed",
    receiptId: "RCP-2026-1187",
  },
  {
    id: "DEAL-1102",
    requestId: "REQ-2290",
    providerId: "p1",
    customerId: "u1",
    amountGnf: 8_000_000,
    feeGnf: 160_000,
    finalGnf: 7_840_000,
    method: "Virement bancaire → Espèces",
    completedAt: "2026-08-05 11:48",
    status: "completed",
    receiptId: "RCP-2026-1102",
  },
];

export const req2290: DealRequest = {
  id: "REQ-2290",
  providerId: "p1",
  from: "bank",
  to: "cash",
  amountGnf: 8_000_000,
  feePct: 2.0,
  feeGnf: 160_000,
  receiveGnf: 7_840_000,
  district: "Kaloum",
  status: "completed",
  createdAt: "2026-08-05 11:20",
  etaMinutes: 15,
  timeline: [
    { step: "created", at: "11:20", done: true },
    { step: "accepted", at: "11:22", done: true },
    { step: "instructions", at: "11:23", done: true },
    { step: "transfer_confirmed", at: "11:31", done: true },
    { step: "released", at: "11:45", done: true },
    { step: "completed", at: "11:48", done: true },
  ],
};
requests.push(req2290);

export function getRequest(id: string): DealRequest | undefined {
  return requests.find((r) => r.id.toLowerCase() === id.toLowerCase());
}
