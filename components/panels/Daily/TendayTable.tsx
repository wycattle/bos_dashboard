"use client";
import React, { useEffect, useState } from "react";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";
import { getPctChgStyle } from "@/components/shared/formatters";

interface TendayRow {
  wy_id: string;
  avg: string;
  "pct chg from avg": string;
  "days milking": string;
  u_read: string;
  "expected bdate": string;
  [key: string]: string; // date columns e.g. "06-07"
}

type SortDirection = "asc" | "desc";

const formatAvg = (v: string | undefined) => {
  if (v === undefined || v === "") return "—";
  const avg = Number(v);
  if (Number.isNaN(avg)) return "—";
  return avg.toFixed(1);
};

const isDateCol = (k: string) => /^\d{2}-\d{2}$/.test(k);

const formatPct = (v: string | undefined) => {
  if (v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  const pct = (n * 100).toFixed(0) + "%";
  return pct;
};

export default function TendayTable() {
  const [rows, setRows] = useState<TendayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<string>("wy_id");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

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

  // Separate last row (totals) from data rows — totals never sorts with the rest
  const dataRows = rows.slice(0, -1);
  const totalRow = rows[rows.length - 1];

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir(col === "wy_id" ? "asc" : "desc");
    }
  };

  const sortedRows = [...dataRows].sort((a, b) => {
    const av = parseFloat(a[sortCol]);
    const bv = parseFloat(b[sortCol]);
    const aVal = Number.isNaN(av) ? -Infinity : av;
    const bVal = Number.isNaN(bv) ? -Infinity : bv;
    const cmp = aVal - bVal;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const arrow = (col: string) =>
    sortCol === col ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  return (
    <div style={styles.tableContainer}>
      <PanelHeader title="10‑Day Summary">
        <DownloadXlsxButton rows={rows} filename="tenday_summary.xlsx" sheetName="Tenday" />
      </PanelHeader>
      <table className="data-table">
        <thead>
          <tr>
            <th
              style={{ ...styles.th, cursor: "pointer" }}
              onClick={() => handleSort("wy_id")}
            >
              wy_id{arrow("wy_id")}
            </th>
            {dateCols.map((d) => (
              <th
                key={d}
                style={{ ...styles.thDate, cursor: "pointer" }}
                onClick={() => handleSort(d)}
              >
                {d}
                {arrow(d)}
              </th>
            ))}
            <th
              style={{ ...styles.thSeparator, cursor: "pointer" }}
              onClick={() => handleSort("avg")}
            >
              avg{arrow("avg")}
            </th>
            <th
              style={{ ...styles.thSeparator, cursor: "pointer" }}
              onClick={() => handleSort("pct chg from avg")}
            >
              <div style={{ maxWidth: "50px", whiteSpace: "normal", margin: "0 auto" }}>
                pct chg from avg{arrow("pct chg from avg")}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => (
            <tr key={i}>
              <td style={styles.td}>{row.wy_id}</td>
              {dateCols.map((d) => (
                <td key={d} style={styles.tdDate}>
                  {row[d] || "—"}
                </td>
              ))}
              <td style={styles.tdSeparator}>{formatAvg(row["avg"])}</td>
              <td style={{ ...styles.td, ...getPctChgStyle(row["pct chg from avg"]) }}>
  {formatPct(row["pct chg from avg"])}
</td>
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