/** MOCK DATA — development only. */
import type { MessageThread } from "@/types";

export const threads: MessageThread[] = [
  {
    id: "th1",
    providerId: "p1",
    requestId: "REQ-2418",
    unread: 2,
    lastAt: "10:31",
    messages: [
      {
        id: "m1",
        threadId: "th1",
        from: "system",
        text: "Nimba a enregistré cette demande (REQ-2418). Les fonds sont réglés directement avec le partenaire.",
        at: "10:24",
      },
      {
        id: "m2",
        threadId: "th1",
        from: "system",
        text: "N'envoyez jamais d'argent vers un compte qui ne figure pas dans cette transaction.",
        at: "10:24",
      },
      {
        id: "m3",
        threadId: "th1",
        from: "provider",
        text: "Bonjour ! Votre demande de 10 000 000 GNF est acceptée. Les espèces seront prêtes au guichet de Kaloum.",
        at: "10:26",
      },
      {
        id: "m4",
        threadId: "th1",
        from: "system",
        text: "Le partenaire a accepté votre demande. Instructions de règlement envoyées.",
        at: "10:27",
      },
      {
        id: "m5",
        threadId: "th1",
        from: "provider",
        text: "Coordonnées bancaires : Banque Démo GN · Kaba Trade SARL · GN012 3456 7890. Référence à indiquer : REQ-2418.",
        at: "10:27",
      },
      {
        id: "m6",
        threadId: "th1",
        from: "customer",
        text: "Merci, je fais le virement maintenant.",
        at: "10:31",
      },
    ],
  },
  {
    id: "th2",
    providerId: "p3",
    requestId: "REQ-2395",
    unread: 0,
    lastAt: "17 août",
    messages: [
      {
        id: "m1",
        threadId: "th2",
        from: "system",
        text: "Nimba a enregistré cette demande (REQ-2395).",
        at: "15:02",
      },
      {
        id: "m2",
        threadId: "th2",
        from: "provider",
        text: "Espèces remises. Merci pour votre confiance 🙏",
        at: "15:15",
      },
      {
        id: "m3",
        threadId: "th2",
        from: "system",
        text: "Transaction terminée. Reçu RCP-2026-1187 disponible.",
        at: "15:15",
      },
    ],
  },
  {
    id: "th3",
    providerId: "p9",
    unread: 1,
    lastAt: "Hier",
    messages: [
      {
        id: "m1",
        threadId: "th3",
        from: "provider",
        text: "Bonjour, pour les montants > 30M GNF nous réservons un créneau dédié. Souhaitez-vous mardi 9h ?",
        at: "16:40",
      },
    ],
  },
];
