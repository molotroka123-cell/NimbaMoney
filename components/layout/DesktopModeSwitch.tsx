"use client";

import React, { useEffect, useState } from "react";
import { Monitor, Smartphone, X } from "lucide-react";
import { classNames } from "@/lib/format";

type ViewMode = "mobile" | "desktop";

const MODE_KEY = "nimba.viewMode";
const GUIDE_KEY = "nimba.deskGuideDismissed";

function applyMode(mode: ViewMode) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) return;
  meta.content =
    mode === "desktop"
      ? "width=1440"
      : "width=device-width, initial-scale=1";
}

/**
 * Tiny, unobtrusive mobile-only control that lets an investor preview the
 * full desktop interface from a phone (and switch back). Works by swapping
 * the viewport meta so all desktop breakpoints kick in; pinch-zoom stays
 * available. Rendered globally, but only on small touch devices.
 */
export function DesktopModeSwitch() {
  const [device, setDevice] = useState(false); // physically small touch device
  const [mode, setMode] = useState<ViewMode>("mobile");
  const [guide, setGuide] = useState(false);

  useEffect(() => {
    const small =
      Math.min(window.screen.width, window.screen.height) < 800 &&
      (navigator.maxTouchPoints > 0 || "ontouchstart" in window);
    if (!small) return;
    setDevice(true);
    const saved = (window.localStorage.getItem(MODE_KEY) as ViewMode) || "mobile";
    setMode(saved);
    applyMode(saved);
    if (!window.localStorage.getItem(GUIDE_KEY)) setGuide(true);
  }, []);

  if (!device) return null;

  const toggle = () => {
    const next: ViewMode = mode === "mobile" ? "desktop" : "mobile";
    setMode(next);
    window.localStorage.setItem(MODE_KEY, next);
    applyMode(next);
    dismissGuide();
    window.scrollTo({ top: 0 });
  };

  const dismissGuide = () => {
    setGuide(false);
    window.localStorage.setItem(GUIDE_KEY, "1");
  };

  return (
    <>
      {/* one-time mini guide — English, easy to close */}
      {guide && (
        <div
          className="fixed inset-x-3 z-[60] rounded-xl bg-brand-950/95 p-3 pr-9 text-white shadow-overlay backdrop-blur"
          style={{ bottom: mode === "mobile" ? "6.5rem" : "3.5rem" }}
          role="status"
        >
          <button
            onClick={dismissGuide}
            aria-label="Close"
            className="absolute right-2 top-2 rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-xs font-bold">💡 Investor tip</p>
          <p className="mt-0.5 text-xs leading-relaxed text-white/80">
            Tap <span className="font-semibold text-brand-300">“Desktop”</span> below to
            preview the full desktop interface on this phone — and switch back to the
            mobile view anytime.
          </p>
        </div>
      )}

      {/* the switch itself — small, bottom corner */}
      <button
        onClick={toggle}
        className={classNames(
          "fixed right-3 z-[60] inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1.5 text-2xs font-semibold text-white shadow-raised backdrop-blur transition-opacity hover:opacity-100",
          guide ? "opacity-100" : "opacity-70"
        )}
        style={{ bottom: mode === "mobile" ? "4.25rem" : "0.75rem" }}
        aria-label={mode === "mobile" ? "Switch to desktop version" : "Switch to mobile version"}
      >
        {mode === "mobile" ? (
          <>
            <Monitor className="h-3.5 w-3.5" aria-hidden />
            Desktop
          </>
        ) : (
          <>
            <Smartphone className="h-3.5 w-3.5" aria-hidden />
            Mobile
          </>
        )}
      </button>
    </>
  );
}
