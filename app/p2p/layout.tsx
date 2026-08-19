import type { Metadata } from "next";
import { P2PShellNav } from "@/components/layout/P2PShellNav";

export const metadata: Metadata = {
  title: "P2P Exchange — Nimba Money",
  description:
    "Achetez et vendez des USDT directement avec des pairs vérifiés en Guinée. GNF ↔ USDT via Orange Money, MTN MoMo, Wave, banque et espèces.",
};

export default function P2PLayout({ children }: { children: React.ReactNode }) {
  return <P2PShellNav>{children}</P2PShellNav>;
}
