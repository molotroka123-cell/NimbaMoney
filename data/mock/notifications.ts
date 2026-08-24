/** MOCK DATA — development only. Notification center fixtures. */

export interface DemoNotification {
  id: string;
  fr: string;
  en: string;
  when: string;
  whenEn: string;
  href: string;
  kind: "p2p" | "market" | "system";
}

export const notifications: DemoNotification[] = [
  {
    id: "n1",
    fr: "Kaba Trade a accepté votre ordre ORD-7305 — paiement en attente.",
    en: "Kaba Trade accepted your order ORD-7305 — payment pending.",
    when: "il y a 4 min",
    whenEn: "4 min ago",
    href: "/p2p/order/ORD-7305",
    kind: "p2p",
  },
  {
    id: "n2",
    fr: "Instructions de règlement reçues pour la demande REQ-2418.",
    en: "Settlement instructions received for request REQ-2418.",
    when: "il y a 18 min",
    whenEn: "18 min ago",
    href: "/marketplace/request/REQ-2418",
    kind: "market",
  },
  {
    id: "n3",
    fr: "Tymur MrSwap : nouvelle offre MTN MoMo à 8 625 GNF/USDT.",
    en: "Tymur MrSwap: new MTN MoMo offer at 8,625 GNF/USDT.",
    when: "il y a 1 h",
    whenEn: "1 h ago",
    href: "/p2p",
    kind: "p2p",
  },
  {
    id: "n4",
    fr: "Votre avis sur ORD-7298 a été publié. Merci !",
    en: "Your review of ORD-7298 was published. Thank you!",
    when: "hier",
    whenEn: "yesterday",
    href: "/p2p/orders",
    kind: "system",
  },
];

/** Rotating "live" marketplace activity for the home feed. */
export const liveActivity: { fr: string; en: string; tone: "green" | "blue" }[] = [
  { fr: "Kaba Trade a complété un ordre de 4,2 M GNF", en: "Kaba Trade completed a 4.2M GNF order", tone: "green" },
  { fr: "Nouvelle demande acceptée par Tymur MrSwap à Matoto", en: "New request accepted by Tymur MrSwap in Matoto", tone: "blue" },
  { fr: "Fatoumata D. a publié une offre Wave à 8 605 GNF", en: "Fatoumata D. posted a Wave offer at 8,605 GNF", tone: "green" },
  { fr: "Binta Express a rejoint le niveau « Lieu vérifié »", en: "Binta Express reached “Location verified”", tone: "blue" },
  { fr: "Ordre de 1 157 USDT réglé en 6 minutes", en: "1,157 USDT order settled in 6 minutes", tone: "green" },
  { fr: "Conakry Cash Point : liquidité mise à jour (180 M GNF)", en: "Conakry Cash Point: liquidity updated (180M GNF)", tone: "blue" },
];
