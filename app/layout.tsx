import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "Nimba Money — Marché de liquidité vérifié en Guinée",
  description:
    "Dites-nous quel argent vous avez et ce dont vous avez besoin. Nimba trouve le meilleur partenaire vérifié — frais affichés avant confirmation, règlement direct.",
};

export const viewport: Viewport = {
  themeColor: "#063F35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
