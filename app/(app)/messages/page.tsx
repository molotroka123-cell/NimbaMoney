"use client";

import React from "react";
import { ThreadsView, type ThreadView } from "@/components/messages/ThreadsView";
import { useI18n } from "@/lib/i18n";
import { threads } from "@/data/mock/messages";
import { p2pThreads, getTrader } from "@/data/mock/p2p";
import { getProviderById } from "@/data/mock/providers";

/** Shared inbox: Marketplace requests and P2P orders in one place. */
export default function MessagesPage() {
  const { t } = useI18n();

  const view: ThreadView[] = [
    ...threads.map((th) => {
      const p = getProviderById(th.providerId)!;
      return {
        id: th.id,
        name: p.name,
        initials: p.logoInitials,
        hue: p.logoHue,
        contextHref: th.requestId
          ? `/marketplace/request/${th.requestId}`
          : `/marketplace/providers/${p.slug}`,
        contextLabel: th.requestId
          ? `Marketplace · ${th.requestId}`
          : t("Marketplace · profil", "Marketplace · profile"),
        unread: th.unread,
        lastAt: th.lastAt,
        messages: th.messages,
      };
    }),
    ...p2pThreads.map((th) => {
      const tr = getTrader(th.traderId)!;
      return {
        id: th.id,
        name: tr.name,
        initials: tr.initials,
        hue: tr.hue,
        contextHref: th.orderId ? `/p2p/order/${th.orderId}` : "/p2p",
        contextLabel: th.orderId ? `P2P · ${th.orderId}` : "P2P",
        unread: th.unread,
        lastAt: th.lastAt,
        messages: th.messages,
      };
    }),
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-extrabold">Messages</h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-[#8FA79C]">
          {t(
            "Boîte partagée — vos conversations P2P et Marketplace au même endroit.",
            "Shared inbox — your P2P and Marketplace conversations in one place."
          )}
        </p>
      </div>
      <ThreadsView threads={view} tone="green" />
    </div>
  );
}
