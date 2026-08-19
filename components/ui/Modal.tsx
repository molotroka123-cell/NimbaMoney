"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { classNames } from "@/lib/format";

/** Modal + Drawer share an overlay. */
function Overlay({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-brand-950/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      {children}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <div className="absolute inset-0 flex items-end justify-center p-0 sm:items-center sm:p-6">
        <div
          className={classNames(
            "relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-overlay dark:bg-night-card sm:rounded-2xl",
            wide ? "sm:max-w-2xl" : "sm:max-w-md"
          )}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white/95 px-5 py-3.5 backdrop-blur dark:border-night-line dark:bg-night-card/95">
            <h2 className="text-sm font-bold">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="rounded-md p-1 text-ink-muted hover:bg-surface-sunken hover:text-ink dark:hover:bg-night-raised"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </Overlay>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md">
        <div className="flex h-full w-full flex-col bg-white shadow-overlay dark:bg-night-card">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5 dark:border-night-line">
            <h2 className="text-sm font-bold">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="rounded-md p-1 text-ink-muted hover:bg-surface-sunken hover:text-ink dark:hover:bg-night-raised"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </Overlay>
  );
}
