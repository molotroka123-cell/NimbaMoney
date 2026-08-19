"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";

type ToastKind = "success" | "info" | "warn";
interface ToastItem {
  id: number;
  kind: ToastKind;
  text: string;
}

const Ctx = createContext<{ toast: (text: string, kind?: ToastKind) => void }>({
  toast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((text: string, kind: ToastKind = "success") => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, kind, text }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3500);
  }, []);

  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-brand-400" />,
    info: <Info className="h-4 w-4 text-blue-300" />,
    warn: <AlertTriangle className="h-4 w-4 text-amber-300" />,
  };

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-20 left-1/2 z-[70] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 lg:bottom-6"
        aria-live="polite"
      >
        {items.map((it) => (
          <div
            key={it.id}
            className="pointer-events-auto flex items-center gap-2.5 rounded-xl bg-brand-950 px-4 py-3 text-xs font-medium text-white shadow-overlay"
          >
            {icons[it.kind]}
            <span>{it.text}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}
