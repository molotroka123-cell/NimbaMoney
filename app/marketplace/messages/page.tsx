"use client";

import React from "react";
import { ThreadsView, type ThreadView } from "@/components/messages/ThreadsView";
import { useI18n } from "@/lib/i18n";
import { threads } from "@/data/mock/messages";
import { getProviderById } from "@/data/mock/providers";

export default function MarketplaceMessagesPage() {
  const { t } = useI18n();
  const view: ThreadView[] = threads.map((th) => {
    const p = getProviderById(th.providerId)!;
    return {
      id: th.id,
      name: p.name,
      initials: p.logoInitials,
      hue: p.logoHue,
      contextHref: th.requestId ? `/marketplace/request/${th.requestId}` : `/marketplace/providers/${p.slug}`,
      contextLabel: th.requestId ?? t("Voir le profil", "View profile"),
      unread: th.unread,
      lastAt: th.lastAt,
      messages: th.messages,
    };
  });
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <h1 className="text-xl font-extrabold">{t("Messages Marketplace", "Marketplace messages")}</h1>
      <ThreadsView threads={view} tone="blue" />
    </div>
  );
}
