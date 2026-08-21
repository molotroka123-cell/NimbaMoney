"use client";

import React from "react";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { ToastProvider } from "@/components/ui/Toast";
import { DesktopModeSwitch } from "@/components/layout/DesktopModeSwitch";
import { AccessGate } from "@/components/layout/AccessGate";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          {children}
          <DesktopModeSwitch />
          <AccessGate />
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
