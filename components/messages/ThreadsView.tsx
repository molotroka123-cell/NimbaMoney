"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Paperclip,
  Image as ImageIcon,
  FileText,
  Send,
  ShieldAlert,
  ChevronLeft,
} from "lucide-react";
import { Card, Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/Toast";
import { classNames } from "@/lib/format";
import type { Message } from "@/types";

export interface ThreadView {
  id: string;
  name: string;
  initials: string;
  hue: number;
  /** Optional link shown next to the name (profile / order / request). */
  contextHref?: string;
  contextLabel?: string;
  unread: number;
  lastAt: string;
  messages: Message[];
}

/** Shared messenger UI for consumer, P2P and Marketplace message pages. */
export function ThreadsView({
  threads,
  tone = "green",
}: {
  threads: ThreadView[];
  tone?: "green" | "blue";
}) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [activeId, setActiveId] = useState(threads[0]?.id);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [extra, setExtra] = useState<Record<string, Message[]>>({});
  const [mobileList, setMobileList] = useState(true);

  const active = threads.find((th) => th.id === activeId) ?? threads[0];
  const messages = useMemo(
    () => (active ? [...active.messages, ...(extra[active.id] ?? [])] : []),
    [active, extra]
  );

  const accentBubble = tone === "green" ? "bg-brand-500" : "bg-mkt-500";
  const accentText =
    tone === "green"
      ? "text-brand-600 dark:text-brand-300"
      : "text-mkt-600 dark:text-mkt-300";
  const activeBg =
    tone === "green"
      ? "bg-brand-50 dark:bg-brand-900/40"
      : "bg-mkt-50 dark:bg-navy-800/60";

  if (!active) return null;

  const send = () => {
    const text = (drafts[active.id] ?? "").trim();
    if (!text) return;
    const msg: Message = {
      id: `new-${Date.now()}`,
      threadId: active.id,
      from: "customer",
      text,
      at: t("à l'instant", "just now"),
    };
    setExtra((x) => ({ ...x, [active.id]: [...(x[active.id] ?? []), msg] }));
    setDrafts((d) => ({ ...d, [active.id]: "" }));
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid min-h-[560px] lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* list */}
        <div
          className={classNames(
            "border-line lg:border-r dark:border-night-line",
            mobileList ? "block" : "hidden lg:block"
          )}
        >
          <ul className="divide-y divide-line dark:divide-night-line">
            {threads.map((th) => {
              const last = th.messages[th.messages.length - 1];
              return (
                <li key={th.id}>
                  <button
                    className={classNames(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                      th.id === active.id
                        ? activeBg
                        : "hover:bg-surface-sunken dark:hover:bg-night-raised"
                    )}
                    onClick={() => {
                      setActiveId(th.id);
                      setMobileList(false);
                    }}
                  >
                    <Avatar initials={th.initials} hue={th.hue} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] font-bold">{th.name}</p>
                        <span className="text-2xs text-ink-muted dark:text-[#8FA79C]">
                          {th.lastAt}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-ink-muted dark:text-[#8FA79C]">
                        {last?.text}
                      </p>
                      {th.contextLabel && (
                        <p className={classNames("mt-0.5 text-2xs font-semibold", accentText)}>
                          {th.contextLabel}
                        </p>
                      )}
                    </div>
                    {th.unread > 0 && (
                      <span
                        className={classNames(
                          "mt-1 rounded-full px-1.5 text-2xs font-bold text-white",
                          accentBubble
                        )}
                      >
                        {th.unread}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* conversation */}
        <div className={classNames("flex flex-col", mobileList ? "hidden lg:flex" : "flex")}>
          <div className="flex items-center gap-3 border-b border-line px-4 py-3 dark:border-night-line">
            <button
              className="rounded-md p-1 text-ink-muted hover:bg-surface-sunken lg:hidden dark:hover:bg-night-raised"
              onClick={() => setMobileList(true)}
              aria-label={t("Retour à la liste", "Back to list")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <Avatar initials={active.initials} hue={active.hue} size="sm" />
            <div className="min-w-0 flex-1">
              <span className="text-[13px] font-bold">{active.name}</span>
              {active.contextHref && (
                <Link
                  href={active.contextHref}
                  className={classNames("ml-2 text-2xs font-semibold hover:underline", accentText)}
                >
                  {active.contextLabel} →
                </Link>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-surface p-4 dark:bg-night-bg">
            {messages.map((m) =>
              m.from === "system" ? (
                <div key={m.id} className="flex justify-center">
                  <p className="inline-flex max-w-md items-start gap-1.5 rounded-lg bg-brand-100/70 px-3 py-1.5 text-center text-2xs font-medium text-brand-900 dark:bg-brand-900/50 dark:text-brand-200">
                    <ShieldAlert className="mt-px h-3 w-3 shrink-0" aria-hidden />
                    {m.text}
                  </p>
                </div>
              ) : (
                <div
                  key={m.id}
                  className={classNames(
                    "flex",
                    m.from === "customer" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={classNames(
                      "max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-card",
                      m.from === "customer"
                        ? classNames("rounded-br-md text-white", accentBubble)
                        : "rounded-bl-md bg-white text-ink dark:bg-night-card dark:text-[#E6EFEA]"
                    )}
                  >
                    <p>{m.text}</p>
                    <p
                      className={classNames(
                        "mt-1 text-right text-2xs",
                        m.from === "customer" ? "text-white/70" : "text-ink-faint"
                      )}
                    >
                      {m.at}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="border-t border-line p-3 dark:border-night-line">
            <div className="flex items-end gap-2">
              <div className="flex gap-1">
                {[
                  { Icon: ImageIcon, label: t("Image", "Image") },
                  { Icon: Paperclip, label: t("Reçu", "Receipt") },
                  { Icon: FileText, label: t("Document", "Document") },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    className="rounded-lg p-2 text-ink-muted hover:bg-surface-sunken hover:text-ink dark:hover:bg-night-raised"
                    aria-label={label}
                    onClick={() =>
                      toast(t(`${label} téléversé(e) (démo)`, `${label} uploaded (demo)`), "info")
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <textarea
                rows={1}
                className="input-base resize-none"
                placeholder={t("Écrire un message…", "Write a message…")}
                value={drafts[active.id] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [active.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <Button
                size="md"
                variant={tone === "blue" ? "blue" : "primary"}
                onClick={send}
                aria-label={t("Envoyer", "Send")}
              >
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </div>
            <p className="mt-1.5 text-2xs text-ink-faint">
              {t(
                "N'envoyez jamais d'argent vers un compte hors de cette transaction.",
                "Never send money to an account outside this deal."
              )}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
