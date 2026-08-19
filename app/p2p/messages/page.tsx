"use client";

import React from "react";
import { ThreadsView, type ThreadView } from "@/components/messages/ThreadsView";
import { useI18n } from "@/lib/i18n";
import { p2pThreads, getTrader } from "@/data/mock/p2p";

export default function P2PMessagesPage() {
  const { t } = useI18n();
  const threads: ThreadView[] = p2pThreads.map((th) => {
    const tr = getTrader(th.traderId)!;
    return {
      id: th.id,
      name: tr.name,
      initials: tr.initials,
      hue: tr.hue,
      contextHref: th.orderId ? `/p2p/order/${th.orderId}` : undefined,
      contextLabel: th.orderId,
      unread: th.unread,
      lastAt: th.lastAt,
      messages: th.messages,
    };
  });
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <h1 className="text-xl font-extrabold">{t("Messages P2P", "P2P messages")}</h1>
      <ThreadsView threads={threads} tone="green" />
    </div>
  );
}
