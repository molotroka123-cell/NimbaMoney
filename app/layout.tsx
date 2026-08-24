import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
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
