"use client";

import React, { useState } from "react";
import { SearchCard } from "@/components/marketplace/SearchCard";
import { OffersTable } from "@/components/marketplace/OffersTable";
import { RightPanel } from "@/components/marketplace/RightPanel";
import { TrustStrip } from "@/components/marketplace/TrustStrip";
import {
  HowItWorks,
  TopProviders,
  BecomeProviderCTA,
  Footer,
} from "@/components/marketplace/BelowFold";
import { defaultSearch, type SearchParams } from "@/lib/marketplace";
import { useI18n } from "@/lib/i18n";

/**
 * Marketplace homepage — the product itself is the hero.
 * Above the fold: search, best offers, trust.
 */
export default function HomePage() {
  const { t } = useI18n();
  const [params, setParams] = useState<SearchParams>(defaultSearch);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(0,1fr)_300px]">
        <div>
          <SearchCard initial={params} onSearch={setParams} sticky />
        </div>
        <div className="min-w-0">
          <OffersTable
            compact
            params={params}
            title={t("Meilleurs partenaires pour vous", "Best providers for you")}
            subtitle={t(
              "Comparez des partenaires de liquidité vérifiés.",
              "Compare verified liquidity partners."
            )}
          />
        </div>
        <div className="hidden 2xl:block">
          <RightPanel />
        </div>
      </div>

      <TrustStrip />
      <HowItWorks />
      <TopProviders />
      <BecomeProviderCTA />
      <Footer />
    </div>
  );
}
