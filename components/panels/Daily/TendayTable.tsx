"use client";
import React, { useEffect, useState } from "react";

interface TendayRow {
  WY_id: string;
  avg: string;
  "pct chg from avg": string;
  "days milking": string;
  u_read: string;
  "expected bdate": string;
  [key: string]: string; // date columns e.g. "06-07"
}

const isDateCol = (k: string) => /^\d{2}-\d{2}$/.test(k);

const SUMMARY_COLS = [
  "WY_id",
  "avg",
  "pct chg from avg",
  "days milking",
  "u_read",
  "expected bdate",
];

export default function TendayTable() {
  const [rows, setRows] = useState<TendayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error)
    return (
      <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>
    );
  if (!rows.length) return <p style={{ padding: "1rem" }}>No data.</p>;

  // Extract date cols from first row, sorted
  const dateCols = Object.keys(rows[0]).filter(isDateCol).sort();

  // Separate last row (totals) from data rows
  const dataRows = rows.slice(0, -1);
  const totalRow = rows[rows.length - 1];

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", height: "100%" }}>
      <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>
        Ten-Day Milk Records
      </h2>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>WY ID</th>
            {dateCols.map((d) => (
              <th key={d} style={{ textAlign: "right" }}>
                {d}
              </th>
            ))}
            <th style={{ textAlign: "center" }}>avg</th>
            <th style={{ textAlign: "center" }}>pct chg</th>
            <th style={{ textAlign: "center" }}>days milking</th>
            <th style={{ textAlign: "center" }}>u_read</th>
            <th style={{ textAlign: "center" }}>exp bdate</th>
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, i) => (
            <tr key={i}>
              <td style={{ textAlign: "center" }}>{row.WY_id}</td>
              {dateCols.map((d) => (
                <td key={d} style={{ textAlign: "right" }}>
                  {row[d] || "—"}
                </td>
              ))}
              <td style={{ textAlign: "center" }}>{row.avg || "—"}</td>
              <td style={{ textAlign: "center" }}>
                {row["pct chg from avg"] || "—"}
              </td>
              <td style={{ textAlign: "center" }}>
                {row["days milking"] || "—"}
              </td>
              <td style={{ textAlign: "center" }}>{row.u_read || "—"}</td>
              <td style={{ textAlign: "center" }}>
                {row["expected bdate"] || "—"}
              </td>
            </tr>
          ))}
          {/* Totals row */}
          <tr
            style={{ fontWeight: "bold", borderTop: "2px solid var(--border)" }}
          >
            <td style={{ textAlign: "center" }}>—</td>
            {dateCols.map((d) => (
              <td key={d} style={{ textAlign: "right" }}>
                {totalRow[d] || "—"}
              </td>
            ))}
            <td colSpan={4} style={{ textAlign: "center" }}>
              {totalRow["pct chg from avg"] || ""}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
