"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface TendayRow {
  wy_id: string;
  run_date: string;
  dates: Record<string, number>;
  average: number | null;
  dev_from_avg: number | null;
}

type SortKey = keyof Omit<TendayRow, "dates">;
type SortDir = "asc" | "desc";

export default function TendayPage() {
  const [rows, setRows] = useState<TendayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("run_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetch("/api/tenday")
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
    <div style={{ padding: "1.5rem" }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: "1rem", fontSize: "0.9em" }}>← Back to Homepage</Link>
      <h1 style={{ marginBottom: "1rem" }}>Ten-Day Milk Records</h1>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              {(
                [
                  ["wy_id", "WY ID"],
                  ["run_date", "Run Date"],
                  ["average", "Average"],
                  ["dev_from_avg", "Dev from Avg"],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  {label}
                  {arrow(key)}
                </th>
              ))}
              <th>Dates (date → liters)</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i}>
                <td>{row.wy_id}</td>
                <td>{row.run_date ? new Date(row.run_date).toLocaleDateString() : "—"}</td>
                <td>{row.average != null ? Number(row.average).toFixed(2) : "—"}</td>
                <td>{row.dev_from_avg != null ? Number(row.dev_from_avg).toFixed(2) : "—"}</td>
                <td>
                  <details>
                    <summary style={{ cursor: "pointer" }}>
                      {row.dates ? Object.keys(row.dates).length : 0} entries
                    </summary>
                    <ul style={{ margin: "0.25rem 0", paddingLeft: "1.2rem", fontSize: "0.85em" }}>
                      {row.dates &&
                        Object.entries(row.dates).map(([date, liters]) => (
                          <li key={date}>
                            {date}: {liters}
                          </li>
                        ))}
                    </ul>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
