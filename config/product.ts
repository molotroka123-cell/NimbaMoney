/**
 * Product configuration — single source of truth for what the frontend exposes.
 *
 * "pilot"  — verified-liquidity pilot: GNF only, bank / cash / Orange Money /
 *            MTN MoMo rails, verified businesses only, no open P2P.
 * "full"   — future architecture: multi-currency (GNF/USD/EUR/USDT/BTC),
 *            verified P2P tier unlocked behind its own flag.
 */
export type ProductMode = "pilot" | "full";

export const productMode = "pilot" as ProductMode;

/** Tier-2 gated P2P marketplace. Stays false for launch. */
export const enableTier2P2P: boolean = productMode === "full";

export const pilotCurrencies = ["GNF"] as const;
export const fullCurrencies = ["GNF", "USD", "EUR", "USDT", "BTC"] as const;

export const currencies: readonly string[] =
  productMode === "pilot" ? pilotCurrencies : fullCurrencies;

/** Payment rails approved for the pilot. */
export const paymentRails = [
  { id: "cash", labelFr: "Espèces", labelEn: "Cash" },
  { id: "bank", labelFr: "Virement bancaire", labelEn: "Bank transfer" },
  { id: "orange", labelFr: "Orange Money", labelEn: "Orange Money" },
  { id: "mtn", labelFr: "MTN MoMo", labelEn: "MTN MoMo" },
] as const;

export type RailId = (typeof paymentRails)[number]["id"];

/**
 * P2P exchange payment methods — the P2P demo product additionally
 * supports Wave. Marketplace pilot rails stay unchanged.
 */
export type P2PMethodId = RailId | "wave";

/** Demo FX reference used by the P2P prototype (GNF per 1 USDT). */
export const demoUsdtRateGnf = 8_640;

export const cities = ["Conakry"] as const;

export const districts = [
  "Tous les quartiers",
  "Kaloum",
  "Dixinn",
  "Ratoma",
  "Matam",
  "Matoto",
] as const;

/** Ops / support contact used by the WhatsApp operational bridge. */
export const supportWhatsApp = "+224 620 00 00 00";
