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

  const thDate: React.CSSProperties = {
    textAlign: "right",
    fontSize: "0.7rem",
    padding: "2px 3px",
    whiteSpace: "nowrap",
  };
  const thFocus: React.CSSProperties = {
    textAlign: "center",
    fontSize: "0.75rem",
    padding: "2px 4px",
    fontWeight: 700,
  };
  const thNorm: React.CSSProperties = {
    textAlign: "center",
    fontSize: "0.7rem",
    padding: "2px 4px",
  };
  const tdDate: React.CSSProperties = {
    textAlign: "right",
    fontSize: "0.72rem",
    padding: "1px 3px",
  };
  const tdFocus: React.CSSProperties = {
    textAlign: "center",
    fontSize: "0.75rem",
    padding: "1px 4px",
    fontWeight: 600,
  };
  const tdNorm: React.CSSProperties = {
    textAlign: "center",
    fontSize: "0.7rem",
    padding: "1px 4px",
  };

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", height: "100%" }}>
      <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "0.85rem" }}>
        10-Day Summary
      </h2>
      <table className="data-table">
        <thead>
          <tr>
            <th style={thNorm}>WY ID</th>
            {dateCols.map((d) => (
              <th key={d} style={thDate}>
                {d}
              </th>
            ))}
            <th style={thFocus}>avg</th>
            <th style={thFocus}>pct chg</th>
            <th style={thNorm}>days</th>
            <th style={thNorm}>u_read</th>
            <th style={thNorm}>exp bdate</th>
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, i) => (
            <tr key={i}>
              <td style={tdNorm}>{row.WY_id}</td>
              {dateCols.map((d) => (
                <td key={d} style={tdDate}>
                  {row[d] || "—"}
                </td>
              ))}
              <td style={tdFocus}>{row.avg || "—"}</td>
              <td style={tdFocus}>{row["pct chg from avg"] || "—"}</td>
              <td style={tdNorm}>{row["days milking"] || "—"}</td>
              <td style={tdNorm}>{row.u_read || "—"}</td>
              <td style={tdNorm}>{row["expected bdate"] || "—"}</td>
            </tr>
          ))}
          <tr
            style={{ fontWeight: "bold", borderTop: "2px solid var(--border)" }}
          >
            <td style={tdNorm}>—</td>
            {dateCols.map((d) => (
              <td key={d} style={tdDate}>
                {totalRow[d] || "—"}
              </td>
            ))}
            <td colSpan={4} style={tdFocus}>
              {totalRow["pct chg from avg"] || ""}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
