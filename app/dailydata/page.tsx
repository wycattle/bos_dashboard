/**
 * app/dailydata/page.tsx
 * Daily Data wrapper page for BOS Dashboard
 */
"use client";
import React from "react";
import DailyPanel from "@/components/panels/DailyPanel";

export default function DailyDataPage() {
  return (
    <div style={{ height: "100vh", padding: "1rem" }}>
      <DailyPanel />
    </div>
  );
}
