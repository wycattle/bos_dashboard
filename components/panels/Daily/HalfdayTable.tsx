"use client";
import React, { useEffect, useState, useCallback } from "react";
import { sortRows } from "@/utils/sortRows";

interface HalfdayRow {
  WY_id: number;
  AM: number | null;
  PM: number | null;
}

type SortKey = keyof HalfdayRow;
type SortDir = "asc" | "desc";

export default function HalfdayTable() {
  const [rows, setRows] = useState<HalfdayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("WY_id");
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
    [sortKey],
  );

  const sorted = sortRows(rows, sortKey, sortDir);

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error)
    return (
      <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>
    );

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", height: "100%" }}>
      <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>
        Half-Day Milk Records
      </h2>
      <table className="data-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("WY_id")}
              style={{
                cursor: "pointer",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              WY ID{arrow("WY_id")}
            </th>
            <th
              onClick={() => handleSort("am")}
              style={{
                cursor: "pointer",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              AM (liters){arrow("am")}
            </th>
            <th
              onClick={() => handleSort("pm")}
              style={{
                cursor: "pointer",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              PM (liters){arrow("pm")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              <td style={{ textAlign: "center" }}>{row.WY_id}</td>
              <td style={{ textAlign: "right" }}>
                {row.am != null ? Number(row.am).toFixed(1) : "—"}
              </td>
              <td style={{ textAlign: "right" }}>
                {row.pm != null ? Number(row.pm).toFixed(1) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
