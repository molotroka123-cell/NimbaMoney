# Nimba Money — Verified Liquidity & Exchange Marketplace (Guinée)

Clickable, production-grade **frontend prototype** for Nimba Money: the trusted
marketplace where Guinea finds liquidity.

> Tell us what money you have and what you need.
> Nimba finds the best verified provider.

**This is a prototype.** All numbers are mock/illustrative development data
(see `/data/mock`). No regulatory claims are made anywhere in the UI.

## Product model (two tracks)

- **Track A — Verified liquidity marketplace.** Verified providers with
  cash/liquidity meet customers with digital money. Nimba is the matching
  layer; settlement happens **directly** between customer and provider over
  approved rails (bank, cash, Orange Money, MTN MoMo). Nimba bills providers
  a commission on matched deals — Booking-style, non-custodial.
- **Track B — Provider listings / paid placement.** Free listing, Pro
  subscription (priority matching, lead analytics, extra districts) and
  Featured slots — always labeled **Sponsorisé**, never disguised as organic
  ranking. **PRO ≠ VERIFIED**: subscription never raises verification level.
- **Tier 2 — gated P2P** (future): vetted individuals with full KYC, deposit
  and strict limits. Behind `enableTier2P2P` and visually distinct
  (« P2P vérifié » ≠ « Entreprise vérifiée »).

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build (31 routes)
```

## Configuration

`config/product.ts`

- `productMode: "pilot" | "full"` — pilot = GNF only, bank/cash/mobile-money
  rails, verified businesses only, no open P2P. Full unlocks the future
  multi-currency architecture.
- `enableTier2P2P` — gates the `/p2p` marketplace (false at launch).

Primary language is **French**; English is built in. Every string goes
through `t(fr, en)` (`lib/i18n.tsx`), so the codebase is localization-ready.
Light mode + dark-green sidebar by default; full dark mode (deep green/slate,
not black) via the theme toggle.

## Routes

| Area | Routes |
| --- | --- |
| Marketplace | `/` (search + best offers + market overview), `/find`, `/providers`, `/providers/[slug]` |
| Deals | request drawer → `/requests`, `/requests/[id]` (timeline, receipt, dispute), `/messages` |
| Trust | `/verification` (levels + checks) |
| Business | `/business`, `/business/apply` (10-step wizard, save & resume) |
| Account | `/account`, `/account/{deals,saved,profile,security,support}` |
| Provider dashboard | `/partner`, `/partner/{leads,services,analytics,subscription}` (+stubs) |
| Operations | `/ops` (manual dispatch for the pilot) |
| Admin | `/admin`, `/admin/{providers,disputes,risk,reconciliation}` (+stubs) |
| Future | `/p2p` (gated) |

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Lucide icons ·
React Hook Form + Zod (provider application). No other runtime dependencies.

## Structure

```
app/            routes (route-group (app) = consumer shell; partner/admin/ops have own shells)
components/     ui, layout, marketplace, providers, requests, dashboard
config/         product mode, rails, districts
data/mock/      ALL mock data (providers, requests, reviews, messages, market, admin)
lib/            i18n, theme, formatting, marketplace ranking
types/          core data models
```

Ranking (`lib/marketplace.ts`) is transparent: fee, rating, response time,
liquidity and history. Paid placement never alters the trust score.
