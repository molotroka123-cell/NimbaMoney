/** Number / currency formatting helpers (GNF-first). */

export function formatGnf(n: number): string {
  // 10 000 000 GNF — French-style thin grouping
  return `${formatNumber(n)} GNF`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)).replace(/ /g, " ");
}

/** Compact: 480M GNF, 1.2Md GNF */
export function formatGnfCompact(n: number, lang: "fr" | "en" = "fr"): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000)
    return `${trim(n / 1_000_000_000)}${lang === "fr" ? "Md" : "B"} GNF`;
  if (abs >= 1_000_000) return `${trim(n / 1_000_000)}M GNF`;
  if (abs >= 1_000) return `${trim(n / 1_000)}K GNF`;
  return `${n} GNF`;
}

function trim(x: number): string {
  const r = Math.round(x * 10) / 10;
  return r % 1 === 0 ? String(Math.round(r)) : r.toFixed(1);
}

export function formatPct(n: number): string {
  return `${n % 1 === 0 ? n : n.toFixed(1)}%`;
}

export function parseAmount(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function formatAmountInput(raw: string): string {
  const n = parseAmount(raw);
  return n ? formatNumber(n) : "";
}

export function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}
