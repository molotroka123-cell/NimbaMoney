"use client";

import React from "react";
import { SearchX } from "lucide-react";
import { classNames } from "@/lib/format";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={classNames("card", className)}>{children}</div>;
}

export function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-base font-bold leading-tight">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        "animate-pulse rounded-md bg-line/70 dark:bg-night-lineStrong/50",
        className
      )}
      aria-hidden
    />
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  hints,
  action,
}: {
  title: string;
  hints?: string[];
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/50">
        <SearchX className="h-6 w-6 text-brand-500" aria-hidden />
      </div>
      <p className="text-sm font-semibold">{title}</p>
      {hints && hints.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
          {hints.map((h) => (
            <li key={h}>• {h}</li>
          ))}
        </ul>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Avatar({
  initials,
  hue,
  size = "md",
}: {
  initials: string;
  hue: number;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "h-7 w-7 text-2xs",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
    xl: "h-16 w-16 text-lg",
  };
  return (
    <div
      className={classNames(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        sizes[size]
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 45% 32%), hsl(${hue} 55% 22%))`,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

export function Sparkline({
  data,
  className,
  stroke = "#008A58",
}: {
  data: number[];
  className?: string;
  stroke?: string;
}) {
  const w = 120;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={classNames("h-8 w-full", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        points={pts}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BarRow({
  label,
  pct,
  value,
}: {
  label: string;
  pct: number;
  value?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-ink-muted dark:text-[#8FA79C]">
          {value ?? `${pct}%`}
        </span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-line dark:bg-night-lineStrong">
        <div
          className="h-1.5 rounded-full bg-brand-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function StatsCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="card-pad">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted dark:text-[#8FA79C]">
            {label}
          </p>
          <p className="mt-1 truncate text-lg font-bold tabular-nums">{value}</p>
          {sub && (
            <p className="mt-0.5 text-2xs text-ink-muted dark:text-[#8FA79C]">
              {sub}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

/** Simple tooltip (title-based fallback kept for touch). */
export function Tooltip({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group relative inline-flex" title={text}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 hidden w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-brand-950 px-2.5 py-1.5 text-2xs font-medium text-white shadow-overlay group-hover:block">
        {text}
      </span>
    </span>
  );
}
