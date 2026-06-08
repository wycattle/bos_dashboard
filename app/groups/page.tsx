/**
 * app/groups/page.tsx
 * Groups Data page for BOS Dashboard
 */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { sortRows } from "@/utils/sortRows";

interface GroupRow {
  wy_id:      number;
  group_name: string | null;
  average:    number | null;
  u_read:     string | null;
}

type SortKey = keyof GroupRow;
type SortDir = "asc" | "desc";

export default function GroupsPage() {
  const [rows, setRows]       = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("average");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetch("/api/groups")
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
        setSortDir("desc");
      }
    },
    [sortKey]
  );

  const sorted = sortRows(rows, sortKey, sortDir);

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error) return <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>;

  return (
    <div style={{ 
        padding: "1.5rem", 
        maxWidth: "400px",        // Limits width (adjust as needed: 600px, 900px, etc.)
        margin: "0 auto",         // Centers the container horizontally
        width: "100%"             // Ensures it fills available space on small screens
      }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: "1rem", fontSize: "0.9em", marginRight: "1em" }}>← Back to Homepage</Link>
      <Link href="/dailydata" style={{ display: "inline-block", marginBottom: "1rem", fontSize: "0.9em" }}>← Back to Daily Data</Link>

      <h1 style={{ marginBottom: "1rem" }}>Groups Data</h1>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("wy_id")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
                WY ID{arrow("wy_id")}
              </th>
              <th onClick={() => handleSort("group_name")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
                Group Name{arrow("group_name")}
              </th>
              <th onClick={() => handleSort("average")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
                Average{arrow("average")}
              </th>
              <th onClick={() => handleSort("u_read")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
                U Read{arrow("u_read")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i}>
                <td style={{ textAlign: "center" }}>{row.wy_id}</td>
                <td style={{ textAlign: "center" }}>{row.group_name ?? "—"}</td>
                <td style={{ textAlign: "center" }}>{row.average != null ? Number(row.average).toFixed(1) : "—"}</td>
                <td style={{ textAlign: "center" }}>{row.u_read != null ? row.u_read : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
