"use client";
import React, { useEffect, useState } from "react";
import * as styles from "../../shared/tableStyles";

interface DynamicRow {
  [key: string]: string;
}

const knownFixedColumns = new Set([
  "wy_id",
  "avg",
  "pct chg from avg",
  "days milking",
  "u_read",
  "expected bdate",
]);

const formatPct = (v: string | undefined) => {
  if (v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  return (n * 100).toFixed(1) + "%";
};

const formatDate = (v: string | undefined) => {
  if (!v) return "—";
  return String(v).slice(0, 10);
};

export default function GroupsTable() {
  const [rows, setRows] = useState<DynamicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/groups")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: DynamicRow[]) => {
        const sorted = [...d].sort(
          (a, b) => (parseFloat(b.avg) || -Infinity) - (parseFloat(a.avg) || -Infinity)
        );
        setRows(sorted);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p style={{ padding: "0.5rem", fontSize: "0.8rem" }}>Loading…</p>;
  if (error)
    return (
      <p
        style={{
          padding: "0.5rem",
          color: "var(--danger)",
          fontSize: "0.8rem",
        }}
      >
        Error: {error}
      </p>
    );

  const dateColumnKey =
    rows.length > 0
      ? Object.keys(rows[0]).find((k) => !knownFixedColumns.has(k))
      : null;

  return (
    <div style={ styles.tableContainer }>
      <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "0.85rem" }}>Groups</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th style={styles.th}>{dateColumnKey || "Date"}</th>
            <th style={styles.th}>WYid</th>
            <th style={styles.thF}>avg</th>
            <th style={styles.thF}>pct chg</th>
            <th style={styles.th}>days</th>
            <th style={styles.th}>u_read</th>
            <th style={styles.th}>exp bdate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={styles.td}>{dateColumnKey ? row[dateColumnKey] : "—"}</td>
              <td style={styles.td}>{row.wy_id || "—"}</td>
              <td style={styles.tdF}>{row.avg || "—"}</td>
              <td style={styles.tdF}>{formatPct(row["pct chg from avg"]) }</td>
              <td style={styles.td}>{row["days milking"] || "—"}</td>
              <td style={styles.td}>{row.u_read || "—"}</td>
              <td style={styles.tdDateWide}>{formatDate(row["expected bdate"] )}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
