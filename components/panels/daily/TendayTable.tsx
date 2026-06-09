"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { sortRows } from "@/utils/sortRows";

interface TendayRow {
  wy_id: string;
  run_date: string;
  dates: Record<string, number>;
  average: number | null;
  dev_from_avg: number | null;
}

type SortKey = keyof Omit<TendayRow, "dates">;
type SortDir = "asc" | "desc";

export default function TendayTable() {
  const [rows, setRows]       = useState<TendayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
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

  const sorted = sortRows(rows, sortKey, sortDir);

  const allDates = useMemo(() => {
    const dateSet = new Set<string>();
    rows.forEach((row) => {
      if (row.dates) {
        Object.keys(row.dates).forEach((date) => {
          const parsed = new Date(date);
          let formatted = date;
          if (!isNaN(parsed.getTime())) {
            formatted = parsed.toISOString().slice(0, 10);
          }
          dateSet.add(formatted);
        });
      }
    });
    return Array.from(dateSet).sort();
  }, [rows]);

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error) return <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>;

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", height: "100%" }}>
      <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>Ten-Day Milk Records</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("wy_id")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
              WY ID{arrow("wy_id")}
            </th>
            <th onClick={() => handleSort("run_date")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
              Run Date{arrow("run_date")}
            </th>
            {allDates.length > 0 && (
              <th colSpan={allDates.length} style={{ textAlign: "center" }}>Dates (date → liters)</th>
            )}
            <th onClick={() => handleSort("average")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
              Average{arrow("average")}
            </th>
            <th onClick={() => handleSort("dev_from_avg")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
              Dev from Avg{arrow("dev_from_avg")}
            </th>
          </tr>
          {allDates.length > 0 && (
            <tr>
              <th></th>
              <th></th>
              {allDates.map((date, idx) => {
                let mmdd = date;
                if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                  mmdd = date.slice(5, 10);
                } else {
                  const parsed = new Date(date);
                  if (!isNaN(parsed.getTime())) {
                    mmdd =
                      (parsed.getMonth() + 1).toString().padStart(2, "0") +
                      "-" +
                      parsed.getDate().toString().padStart(2, "0");
                  }
                }
                return (
                  <th key={"alldate-" + idx} style={{ textAlign: "right" }}>
                    {mmdd}
                  </th>
                );
              })}
              <th></th>
              <th></th>
            </tr>
          )}
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              <td style={{ textAlign: "center" }}>{row.wy_id}</td>
              <td style={{ textAlign: "center" }}>
                {row.run_date ? new Date(row.run_date).toLocaleDateString() : "—"}
              </td>
              {allDates.map((date, idx) => {
                let liters = "";
                if (row.dates) {
                  if (row.dates[date] !== undefined) {
                    liters = String(row.dates[date]);
                  } else {
                    for (const [k, v] of Object.entries(row.dates)) {
                      const parsed = new Date(k);
                      let formatted = k;
                      if (!isNaN(parsed.getTime())) {
                        formatted = parsed.toISOString().slice(0, 10);
                      }
                      if (formatted === date) {
                        liters = String(v);
                        break;
                      }
                    }
                  }
                }
                return (
                  <td key={"liters-" + idx} style={{ textAlign: "right" }}>
                    {liters || "—"}
                  </td>
                );
              })}
              <td style={{ textAlign: "center" }}>
                {row.average != null ? Number(row.average).toFixed(1) : "—"}
              </td>
              <td style={{ textAlign: "center" }}>
                {row.dev_from_avg != null ? Number(row.dev_from_avg).toFixed(2) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
