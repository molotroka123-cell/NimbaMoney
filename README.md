# Nimba Money — P2P & Verified Marketplace (Guinée)

Clickable investor prototype (frontend only, deterministic mock state).
One Nimba ecosystem, **two distinct products**:

| | NIMBA P2P | NIMBA MARKETPLACE |
| --- | --- | --- |
| Color | **Green** (dark forest sidebar) | **Blue** (deep navy sidebar) |
| Route | `/p2p` | `/marketplace` |
| Model | Direct peer-to-peer exchange: pick another trader's offer (GNF ↔ USDT, Orange Money / MTN / Wave / Bank / Cash), order room with chat, countdown and simulated "Nimba protection" (**demo functionality only**) | Compare professional verified exchangers & liquidity providers: reputation, verification, liquidity, locations, limits. Request → provider accepts → **direct settlement** (non-custodial). Nimba is the matching & trust layer |
| Records | P2P **orders** (`/p2p/orders`) | Marketplace **requests** (`/marketplace/requests`) |

The shared entry point `/` shows both products; account, KYC, messages and
support are shared. **All data is illustrative mock data** (`/data/mock`) —
no regulatory claims anywhere.

## Primary demo providers

- **Kaba Trade** — main verified business (PRO, enhanced verification, Kaloum,
  4.98, 2 841 deals) and top P2P trader. Investor journey #1 & #2 anchor.
- **Tymur MrSwap** — second key provider (PRO + Featured, Matoto, 4.9,
  3 812 deals, largest liquidity) and very fast P2P trader.

Around them: Binta Express, Mamadou Change, Conakry Cash Point, Alpha Change,
Guinée Market, Nimba Finance, Kankan Liquidity, Ratoma Exchange, Kaloum Cash
Hub, Matoto Money Point + a generated long tail (22 providers, 21 traders,
60+ offers, 12 orders).

## Investor demo flows (fully clickable)

1. **P2P**: `/` → Ouvrir le P2P → 10M GNF → choose Kaba Trade → order room →
   pay → « J'ai payé » → simulated confirmation → USDT released → receipt.
2. **Marketplace**: `/` → Ouvrir le Marketplace → compare Kaba Trade vs
   Tymur MrSwap → open profile → verification/liquidity/reviews →
   Demander une liquidité → a new request with a live timeline
   (`/marketplace/request/new?...`; sample history at `/marketplace/request/REQ-2418`).

## Getting started

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 41 routes, production build
```

Deployable to Vercel as-is (no backend, no env vars needed).

## Structure

```
app/(app)/       shared shell: entry home, messages, verification, business, account
app/p2p/         GREEN product: trade table, order room, orders, wallets, disputes
app/marketplace/ BLUE product: provider comparison, profiles, requests, saved
app/partner/     provider dashboard (Kaba Trade demo)
app/ops/         manual dispatch (pilot operations)
app/admin/       admin console: applications, disputes, risk, reconciliation
components/      ui / layout (ProductShell, tone-aware sidebar) / marketplace / requests / messages
data/mock/       ALL mock data — providers, p2p traders/offers/orders, requests, reviews, admin
config/          product mode, rails (+ Wave for P2P), demo FX rate
```

Legacy single-marketplace routes (`/find`, `/providers`, `/requests`)
redirect to the new Marketplace routes.

## Guardrails kept from the master plan

- PRO (subscription) ≠ VERIFIED (verification level) — stated in UI.
- Sponsored placement is always labeled and never alters ranking
  (weights shown in the Marketplace right panel).
- Marketplace wording is non-custodial: direct settlement, logged deals,
  no escrow claims. The P2P "Protection Nimba" is explicitly marked
  **(démo)** and exists only inside the P2P prototype.
- French-first UI with full English via `t(fr, en)`; light + dark themes.
