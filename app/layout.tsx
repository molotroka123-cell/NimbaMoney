import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://nimba-money.vercel.app"),
  title: {
    default: "Nimba Money — P2P Exchange & Marketplace vérifié en Guinée",
    template: "%s · Nimba Money",
  },
  description:
    "Un compte, deux façons d'échanger : le P2P Exchange pour trader directement avec des pairs vérifiés, et le Marketplace pour comparer des échangeurs professionnels et fournisseurs de liquidité vérifiés en Guinée.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nimba",
  },
  icons: { apple: "/apple-touch-icon.png" },
  openGraph: {
    title: "Nimba Money — P2P Exchange & Marketplace vérifié en Guinée",
    description:
      "Tradez en direct avec des pairs vérifiés ou comparez des échangeurs professionnels. Un compte, deux produits — prototype investisseur.",
    url: "/",
    siteName: "Nimba Money",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Nimba Money" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nimba Money — P2P Exchange & Marketplace vérifié en Guinée",
    description:
      "Tradez en direct avec des pairs vérifiés ou comparez des échangeurs professionnels. Un compte, deux produits — prototype investisseur.",
    images: ["/og.png"],
  },
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
