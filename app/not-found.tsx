"use client";

import Link from "next/link";
import { ArrowLeftRight, Store, Home } from "lucide-react";
import { LogoMark } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6 dark:bg-night">
      <div className="w-full max-w-md text-center">
        <LogoMark className="mx-auto h-9 w-14 text-brand-500" />
        <p className="mt-6 text-6xl font-extrabold tracking-tight text-brand-500">404</p>
        <h1 className="mt-2 text-lg font-extrabold">
          {t("Page introuvable", "Page not found")}
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Cette page n'existe pas dans le prototype. Reprenez la démo depuis l'un des deux produits.",
            "This page doesn't exist in the prototype. Pick the demo back up from either product."
          )}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="secondary" full className="sm:w-auto">
              <Home className="h-4 w-4" aria-hidden />
              {t("Accueil", "Home")}
            </Button>
          </Link>
          <Link href="/p2p">
            <Button full className="sm:w-auto">
              <ArrowLeftRight className="h-4 w-4" aria-hidden />
              P2P Exchange
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="blue" full className="sm:w-auto">
              <Store className="h-4 w-4" aria-hidden />
              Marketplace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
