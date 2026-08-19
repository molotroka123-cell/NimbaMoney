import type { Metadata } from "next";
import { MarketShellNav } from "@/components/layout/MarketShellNav";

export const metadata: Metadata = {
  title: "Marketplace vérifié — Nimba Money",
  description:
    "Comparez des échangeurs professionnels, fournisseurs de liquidité et bureaux de change vérifiés en Guinée. Règlement direct, chaque demande enregistrée.",
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <MarketShellNav>{children}</MarketShellNav>;
}
