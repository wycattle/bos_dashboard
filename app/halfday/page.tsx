/**
 * app/halfday/page.tsx
 * Half-Day Milk Records page for BOS Dashboard
 */
"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { sortRows } from "@/utils/sortRows";


interface HalfdayRow {
  wy_id: number;
  am: number | null;
  pm: number | null;
}

type SortKey = keyof HalfdayRow;
type SortDir = "asc" | "desc";

export default function HalfdayPage() {
  const [rows, setRows] = useState<HalfdayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("wy_id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    fetch("/api/halfday")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSort = useCallback(
    (key: SortKey) => {
      if (key === sortKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error) return <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>;

  return (
      <div style={{ 
        padding: "1.5rem", 
        maxWidth: "400px",        // Limits width (adjust as needed: 600px, 900px, etc.)
        margin: "0 auto",         // Centers the container horizontally
        width: "100%",             // Ensures it fills available space on small screens
      }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: "1rem", fontSize: "0.9em", marginRight: "1em" }}>← Back to Homepage</Link>
      <Link href="/dailydata" style={{ display: "inline-block", marginBottom: "1rem", fontSize: "0.9em" }}>← Back to Daily Data</Link>

      <h1 style={{ marginBottom: "1rem" }}>Half-Day Milk Records</h1>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("wy_id")}
                style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}
              >
                WY ID{arrow("wy_id")}
              </th>
              <th
                onClick={() => handleSort("am")}
                style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}
              >
                AM (liters){arrow("am")}
              </th>
              <th
                onClick={() => handleSort("pm")}
                style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}
              >
                PM (liters){arrow("pm")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i}>
                <td style={{ textAlign: "center" }}>{row.wy_id}</td>
                <td style={{ textAlign: "right" }}>{row.am != null ? Number(row.am).toFixed(1) : "—"}</td>
                <td style={{ textAlign: "right" }}>{row.pm != null ? Number(row.pm).toFixed(1) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
