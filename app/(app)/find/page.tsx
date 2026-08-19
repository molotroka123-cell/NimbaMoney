"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchCard } from "@/components/marketplace/SearchCard";
import { OffersTable } from "@/components/marketplace/OffersTable";
import { TrustStrip } from "@/components/marketplace/TrustStrip";
import { defaultSearch, type SearchParams } from "@/lib/marketplace";
import type { RailId } from "@/config/product";
import { useI18n } from "@/lib/i18n";

function FindInner() {
  const { t } = useI18n();
  const sp = useSearchParams();
  const initial: SearchParams = {
    have: (sp.get("have") as RailId) || defaultSearch.have,
    need: (sp.get("need") as RailId) || defaultSearch.need,
    amountGnf: Number(sp.get("amount")) || defaultSearch.amountGnf,
    district: sp.get("district") || defaultSearch.district,
  };
  const [params, setParams] = useState<SearchParams>(initial);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div>
          <SearchCard initial={params} onSearch={setParams} sticky />
        </div>
        <div className="min-w-0">
          <OffersTable
            params={params}
            title={t("Résultats de recherche", "Search results")}
            subtitle={t(
              "Partenaires vérifiés correspondant à votre demande.",
              "Verified providers matching your request."
            )}
          />
        </div>
      </div>
      <TrustStrip />
    </div>
  );
}

export default function FindPage() {
  return (
    <Suspense>
      <FindInner />
    </Suspense>
  );
}
