// shared/formatters.ts

import type { CSSProperties } from "react";

export const getPctChgStyle = (v: string | number | undefined): CSSProperties => {
  if (v === undefined || v === "") return {};
  const n = Number(v);
  if (Number.isNaN(n)) return {};
  const pct = n * 100; // matches formatPct's convention: input is a decimal fraction
  if (pct >= 15) return { color: "#ff69b4" };   // pink
  if (pct <= -15) return { color: "#ffa500" };  // orange
  return {};
};

export const formatAvg = (v: string | number | undefined): string => {
  if (v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  return n.toFixed(1);
};

export const formatPct = (v: string | number | undefined): string => {
  if (v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  return (n * 100).toFixed(0) + "%";
};

export const formatDate = (v: string | undefined): string => {
  if (!v) return "—";
  return String(v).slice(0, 10);
};