/** app/(pages)/aggregates/page.tsx */
"use client";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";

export default function AggregatesPage() {
  const router = useRouter();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      </div>
    </div>
  );
}

const navButtonStyle: CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  fontWeight: 600,
  background: "#1e293b",
  color: "#f8fafc",
  border: "1px solid #475569",
  borderRadius: "6px",
  cursor: "pointer",
};