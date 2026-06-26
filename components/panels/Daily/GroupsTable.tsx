"use client";
import React, { useEffect, useState } from "react";

interface DynamicRow {
  [key: string]: string;
}

const th: React.CSSProperties = {
  textAlign: "center",
  fontSize: "0.72rem",
  padding: "2px 4px",
  whiteSpace: "normal",
  lineHeight: "1.2",
};
const thF: React.CSSProperties = {
  textAlign: "center",
  fontSize: "0.72rem",
  padding: "2px 4px",
  fontWeight: 700,
};
const td: React.CSSProperties = {
  textAlign: "center",
  fontSize: "0.72rem",
  padding: "1px 4px",
};
const tdF: React.CSSProperties = {
  textAlign: "center",
  fontSize: "0.72rem",
  padding: "1px 4px",
  fontWeight: 600,
};

const knownFixedColumns = new Set([
  "WY_id",
  "avg",
  "pct chg from avg",
  "days milking",
  "u_read",
  "expected bdate",
]);

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
    <div style={{ overflowX: "auto", overflowY: "auto", height: "100%" }}>
      <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "0.85rem" }}>Groups</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th style={th}>{dateColumnKey || "Date"}</th>
            <th style={th}>WY ID</th>
            <th style={thF}>avg</th>
            <th style={thF}>pct chg</th>
            <th style={th}>days</th>
            <th style={th}>u_read</th>
            <th style={th}>exp bdate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={td}>{dateColumnKey ? row[dateColumnKey] : "—"}</td>
              <td style={td}>{row.WY_id || "—"}</td>
              <td style={tdF}>{row.avg || "—"}</td>
              <td style={tdF}>{row["pct chg from avg"] || "—"}</td>
              <td style={td}>{row["days milking"] || "—"}</td>
              <td style={td}>{row.u_read || "—"}</td>
              <td style={td}>{row["expected bdate"] || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
