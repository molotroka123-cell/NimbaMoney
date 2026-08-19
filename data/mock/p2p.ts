/**
 * MOCK DATA — development only. P2P Exchange (green product) fixtures.
 * Traders, offers, orders and the live investor-demo trade room.
 */
import type {
  P2PTrader,
  P2POffer,
  P2POrder,
  Message,
} from "@/types";
import type { P2PMethodId } from "@/config/product";

/* ── Traders (21) ──────────────────────────────────────────────────── */

const T = (
  id: string,
  slug: string,
  name: string,
  hue: number,
  trades: number,
  completionPct: number,
  responseMinutes: number,
  online = true,
  providerId?: string
): P2PTrader => ({
  id,
  slug,
  name,
  initials: name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
  hue,
  verified: true,
  trades,
  completionPct,
  responseMinutes,
  online,
  providerId,
});

export const traders: P2PTrader[] = [
  // Businesses that also trade on P2P (separate P2P Trader status)
  T("t1", "kaba-trade", "Kaba Trade", 152, 2845, 99, 2, true, "p1"),
  T("t2", "tymur-mrswap", "Tymur MrSwap", 200, 3512, 98, 1, true, "p9"),
  T("t3", "binta-express", "Binta Express", 45, 1982, 97, 3, true, "p6"),
  T("t4", "mamadou-change", "Mamadou Change", 330, 2210, 99, 2, true, "p5"),
  T("t5", "conakry-cash-point", "Conakry Cash Point", 205, 1562, 96, 4, true, "p2"),
  T("t6", "alpha-change", "Alpha Change", 268, 1347, 95, 5, true, "p3"),
  // Individual verified traders
  T("t7", "ibrahima-k", "Ibrahima K.", 10, 842, 97, 3),
  T("t8", "fatoumata-d", "Fatoumata D.", 300, 1154, 99, 2),
  T("t9", "aissatou-b", "Aïssatou B.", 120, 618, 96, 5),
  T("t10", "ousmane-s", "Ousmane S.", 60, 733, 95, 6),
  T("t11", "moussa-c", "Moussa C.", 240, 421, 94, 8),
  T("t12", "mariama-t", "Mariama T.", 280, 987, 98, 3),
  T("t13", "abdoulaye-d", "Abdoulaye D.", 30, 356, 93, 9, false),
  T("t14", "kadiatou-s", "Kadiatou S.", 90, 512, 96, 4),
  T("t15", "lansana-f", "Lansana F.", 180, 289, 92, 10),
  T("t16", "hawa-b", "Hawa B.", 210, 664, 97, 4),
  T("t17", "amara-k", "Amara K.", 340, 478, 95, 6),
  T("t18", "djenab-s", "Djenab S.", 70, 803, 98, 3),
  T("t19", "fode-c", "Fodé C.", 150, 231, 91, 12, false),
  T("t20", "nene-d", "Nènè D.", 255, 545, 96, 5),
  T("t21", "saliou-b", "Saliou B.", 20, 390, 94, 7),
];

/* ── Offers (60+, deterministic) ───────────────────────────────────── */

const buyMethods: P2PMethodId[] = ["orange", "mtn", "wave", "bank", "cash"];

function offersFor(trader: P2PTrader, ti: number): P2POffer[] {
  const out: P2POffer[] = [];
  const nBuy = 2 + (ti % 2); // 2-3 buy offers
  const nSell = 1 + ((ti + 1) % 2); // 1-2 sell offers
  for (let k = 0; k < nBuy; k++) {
    const method = buyMethods[(ti + k) % buyMethods.length];
    out.push({
      id: `of-${trader.id}-b${k}`,
      traderId: trader.id,
      side: "buy",
      priceGnf: 8_590 + ((ti * 7 + k * 11) % 12) * 10, // 8 590 – 8 700
      minGnf: 100_000 * (1 + (ti % 3)),
      maxGnf: [3_000_000, 5_000_000, 10_000_000, 20_000_000][(ti + k) % 4],
      availableUsdt: 400 + ((ti * 13 + k * 29) % 40) * 60,
      method,
    });
  }
  for (let k = 0; k < nSell; k++) {
    const method = buyMethods[(ti + k + 2) % buyMethods.length];
    out.push({
      id: `of-${trader.id}-s${k}`,
      traderId: trader.id,
      side: "sell",
      priceGnf: 8_500 + ((ti * 5 + k * 13) % 10) * 10, // 8 500 – 8 590
      minGnf: 100_000 * (1 + ((ti + 1) % 3)),
      maxGnf: [2_000_000, 5_000_000, 10_000_000][(ti + k) % 3],
      availableUsdt: 300 + ((ti * 17 + k * 23) % 35) * 50,
      method,
    });
  }
  return out;
}

export const offers: P2POffer[] = traders.flatMap((tr, i) => offersFor(tr, i));

// Pin the investor-demo offers to friendly values.
const kabaBest = offers.find((o) => o.traderId === "t1" && o.side === "buy")!;
kabaBest.priceGnf = 8_640;
kabaBest.method = "orange";
kabaBest.minGnf = 200_000;
kabaBest.maxGnf = 20_000_000;
kabaBest.availableUsdt = 2_450;
const tymurBest = offers.find((o) => o.traderId === "t2" && o.side === "buy")!;
tymurBest.priceGnf = 8_625;
tymurBest.method = "mtn";
tymurBest.minGnf = 500_000;
tymurBest.maxGnf = 10_000_000;
tymurBest.availableUsdt = 3_100;

export function getTrader(id: string): P2PTrader | undefined {
  return traders.find((t) => t.id === id);
}

export function getOffer(id: string): P2POffer | undefined {
  return offers.find((o) => o.id === id);
}

/* ── Orders (12, incl. the live demo order) ────────────────────────── */

export const orders: P2POrder[] = [
  {
    id: "ORD-7305",
    offerId: kabaBest.id,
    traderId: "t1",
    side: "buy",
    amountGnf: 10_000_000,
    priceGnf: 8_640,
    amountUsdt: 1_157.41,
    method: "orange",
    status: "payment_pending",
    createdAt: "2026-08-19 10:42",
    deadlineMinutes: 15,
  },
  {
    id: "ORD-7298",
    offerId: tymurBest.id,
    traderId: "t2",
    side: "buy",
    amountGnf: 5_000_000,
    priceGnf: 8_625,
    amountUsdt: 579.71,
    method: "mtn",
    status: "completed",
    createdAt: "2026-08-18 16:20",
    deadlineMinutes: 15,
  },
  {
    id: "ORD-7291",
    offerId: "of-t8-b0",
    traderId: "t8",
    side: "buy",
    amountGnf: 1_800_000,
    priceGnf: 8_610,
    amountUsdt: 209.06,
    method: "wave",
    status: "completed",
    createdAt: "2026-08-17 12:05",
    deadlineMinutes: 15,
  },
  {
    id: "ORD-7284",
    offerId: "of-t4-s0",
    traderId: "t4",
    side: "sell",
    amountGnf: 2_580_000,
    priceGnf: 8_560,
    amountUsdt: 301.4,
    method: "cash",
    status: "completed",
    createdAt: "2026-08-16 09:48",
    deadlineMinutes: 30,
  },
  {
    id: "ORD-7277",
    offerId: "of-t3-b0",
    traderId: "t3",
    side: "buy",
    amountGnf: 900_000,
    priceGnf: 8_600,
    amountUsdt: 104.65,
    method: "orange",
    status: "cancelled",
    createdAt: "2026-08-15 18:31",
    deadlineMinutes: 15,
  },
  {
    id: "ORD-7266",
    offerId: "of-t12-b0",
    traderId: "t12",
    side: "buy",
    amountGnf: 3_200_000,
    priceGnf: 8_630,
    amountUsdt: 370.8,
    method: "mtn",
    status: "completed",
    createdAt: "2026-08-14 11:15",
    deadlineMinutes: 15,
  },
  {
    id: "ORD-7259",
    offerId: "of-t7-s0",
    traderId: "t7",
    side: "sell",
    amountGnf: 4_250_000,
    priceGnf: 8_540,
    amountUsdt: 497.66,
    method: "bank",
    status: "disputed",
    createdAt: "2026-08-13 15:02",
    deadlineMinutes: 30,
  },
  {
    id: "ORD-7248",
    offerId: "of-t2-b1",
    traderId: "t2",
    side: "buy",
    amountGnf: 7_500_000,
    priceGnf: 8_620,
    amountUsdt: 870.07,
    method: "bank",
    status: "completed",
    createdAt: "2026-08-12 10:22",
    deadlineMinutes: 15,
  },
  {
    id: "ORD-7240",
    offerId: "of-t16-b0",
    traderId: "t16",
    side: "buy",
    amountGnf: 1_200_000,
    priceGnf: 8_650,
    amountUsdt: 138.73,
    method: "orange",
    status: "completed",
    createdAt: "2026-08-11 14:44",
    deadlineMinutes: 15,
  },
  {
    id: "ORD-7233",
    offerId: "of-t1-s0",
    traderId: "t1",
    side: "sell",
    amountGnf: 6_048_000,
    priceGnf: 8_560,
    amountUsdt: 706.54,
    method: "bank",
    status: "completed",
    createdAt: "2026-08-10 09:12",
    deadlineMinutes: 30,
  },
  {
    id: "ORD-7221",
    offerId: "of-t10-b0",
    traderId: "t10",
    side: "buy",
    amountGnf: 650_000,
    priceGnf: 8_640,
    amountUsdt: 75.23,
    method: "wave",
    status: "completed",
    createdAt: "2026-08-09 17:35",
    deadlineMinutes: 15,
  },
  {
    id: "ORD-7215",
    offerId: "of-t20-b0",
    traderId: "t20",
    side: "buy",
    amountGnf: 2_000_000,
    priceGnf: 8_655,
    amountUsdt: 231.08,
    method: "mtn",
    status: "completed",
    createdAt: "2026-08-08 13:27",
    deadlineMinutes: 15,
  },
];

export function getOrder(id: string): P2POrder | undefined {
  return orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
}

/* ── Live demo trade-room chat (ORD-7305) ──────────────────────────── */

export const orderChat: Message[] = [
  {
    id: "pm1",
    threadId: "ORD-7305",
    from: "system",
    text: "Ordre ORD-7305 créé. Protection Nimba (démo) : les USDT du trader sont bloqués jusqu'à la confirmation du paiement.",
    at: "10:42",
  },
  {
    id: "pm2",
    threadId: "ORD-7305",
    from: "system",
    text: "N'envoyez jamais d'argent vers un compte qui ne figure pas dans cet ordre. Ne validez jamais avant d'avoir réellement payé.",
    at: "10:42",
  },
  {
    id: "pm3",
    threadId: "ORD-7305",
    from: "provider",
    text: "Bonjour 👋 Merci pour votre ordre. Envoyez 10 000 000 GNF via Orange Money au numéro indiqué, référence ORD-7305.",
    at: "10:43",
  },
];

/* ── P2P messages page threads ─────────────────────────────────────── */

export const p2pThreads: {
  id: string;
  traderId: string;
  orderId?: string;
  unread: number;
  lastAt: string;
  messages: Message[];
}[] = [
  {
    id: "pth1",
    traderId: "t1",
    orderId: "ORD-7305",
    unread: 1,
    lastAt: "10:43",
    messages: orderChat,
  },
  {
    id: "pth2",
    traderId: "t2",
    orderId: "ORD-7298",
    unread: 0,
    lastAt: "18 août",
    messages: [
      {
        id: "pm21",
        threadId: "pth2",
        from: "provider",
        text: "USDT libérés. Merci pour l'échange, à la prochaine ! 🤝",
        at: "16:34",
      },
      {
        id: "pm22",
        threadId: "pth2",
        from: "system",
        text: "Ordre ORD-7298 terminé. Reçu disponible.",
        at: "16:34",
      },
    ],
  },
  {
    id: "pth3",
    traderId: "t8",
    unread: 2,
    lastAt: "Hier",
    messages: [
      {
        id: "pm31",
        threadId: "pth3",
        from: "provider",
        text: "Je peux faire 8 605 GNF/USDT si vous prenez plus de 500 USDT via Wave.",
        at: "19:12",
      },
    ],
  },
];

/* ── P2P market overview (illustrative) ────────────────────────────── */

export const p2pOverview = {
  volume24hGnf: 12_450_000_000,
  volumeChangePct: 14.6,
  activeTraders: 1_240,
  activeOffers: 268,
  successRate: 98.9,
  trend: [58, 66, 61, 74, 71, 82, 78, 90, 86, 95, 92, 104, 99, 112],
};

/* ── Wallets (demo) ────────────────────────────────────────────────── */

export const wallets = [
  { asset: "GNF", balance: 12_450_000, pending: 0 },
  { asset: "USDT", balance: 1_284.52, pending: 0 },
];

export const walletHistory = [
  { id: "wt1", label: "Achat USDT — ORD-7298", delta: "+579,71 USDT", when: "18 août 16:34" },
  { id: "wt3", label: "Achat USDT — ORD-7291", delta: "+209,06 USDT", when: "17 août 12:12" },
  { id: "wt2", label: "Retrait USDT (TRC20)", delta: "−400,00 USDT", when: "17 août 09:20" },
  { id: "wt4", label: "Dépôt GNF — Orange Money", delta: "+5 000 000 GNF", when: "16 août 08:05" },
];
