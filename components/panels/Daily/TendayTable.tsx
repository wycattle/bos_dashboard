"use client";
import React, { useEffect, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import * as styles from "../../shared/tableStyles";

interface TendayRow {
  wy_id: string;
  avg: string;
  "pct chg from avg": string;
  "days milking": string;
  u_read: string;
  "expected bdate": string;
  [key: string]: string; // date columns e.g. "06-07"
}

const isDateCol = (k: string) => /^\d{2}-\d{2}$/.test(k);

const formatPct = (v: string | undefined) => {
  if (v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  const pct = (n * 100).toFixed(1) + "%";
  return pct;
};

const formatDate = (v: string | undefined) => {
  if (!v) return "—";
  return String(v).slice(0, 10);
};


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


  const downloadXlsx = useCallback(() => {
    if(!rows.length)return;
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tenday");
    XLSX.writeFile(wb, "tenday_summary.xlsx");
  },[rows]);

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
    <div style={styles.tableContainer}>
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      marginBottom: "0.25rem" }}>
      <h2 style={{ margin: 0, fontSize: "0.75rem", lineHeight: 1.2 }}>
        10‑Day Summary
      </h2>

      <button
          onClick={downloadXlsx}
          style={{
            padding: "0.2rem 0.5rem",
            fontSize: "0.7rem",
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #69474c",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ⬇ XLSX
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th style={styles.th}>wy_id</th>
            {dateCols.map((d) => (
              <th key={d} style={styles.thDate}>
                {d}
              </th>
            ))}
            <th style={styles.th}>avg</th>
            <th style={styles.th}>pct chg</th>
            <th style={styles.th}>days</th>
            <th style={styles.th}>u_read</th>
            <th style={styles.tdDateWide}>exp bdate</th>
          </tr>
        </thead>
        <tbody>

          {dataRows.map((row, i) => (
            <tr key={i}>
              <td style={styles.td}>{row.wy_id}</td>
              {dateCols.map((d) => (
                <td key={d} style={styles.tdDate}>
                  {row[d] || "—"}
                </td>
              ))}
              <td style={styles.td}>{row.avg || "—"}</td>
              <td style={styles.td}>{formatPct(row["pct chg from avg"])}</td>
              <td style={styles.td}>{row["days milking"] || "—"}</td>
              <td style={styles.td}>{row.u_read || "—"}</td>
              <td style={styles.tdDate}>{formatDate(row["expected bdate"])}</td>
            </tr>
          ))}
          <tr
            style={{ fontWeight: "bold", borderTop: "2px solid var(--surface-border)" }}
          >
            <td style={styles.td}>—</td>
            {dateCols.map((d) => (
              <td key={d} style={styles.tdDate}>
                {totalRow[d] || "—"}
              </td>
            ))}
              <td colSpan={4} style={styles.tdF}>
                {formatPct(totalRow["pct chg from avg"])}
              </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
