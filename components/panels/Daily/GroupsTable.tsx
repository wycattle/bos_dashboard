"use client";
import React, { useEffect, useState } from "react";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";
import { formatAvg, formatDate } from "../../shared/formatters";

interface DynamicRow {
  [key: string]: string;
}

type SortDirection = "asc" | "desc";

const numericColumns = new Set(["wy_id", "avg", "days_milking"]);
const AVG_THRESHOLD = 15.0;

export default function GroupsTable() {
  const [rows, setRows] = useState<DynamicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<string>("avg");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  useEffect(() => {
    fetch("/api/daily/groups")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: DynamicRow[]) => {
        setRows(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir(col === "avg" ? "desc" : "asc");
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    const isNumeric = numericColumns.has(sortCol);
    let cmp: number;
    if (isNumeric) {
      const av = parseFloat(a[sortCol]);
      const bv = parseFloat(b[sortCol]);
      const aVal = Number.isNaN(av) ? -Infinity : av;
      const bVal = Number.isNaN(bv) ? -Infinity : bv;
      cmp = aVal - bVal;
    } else {
      cmp = (a[sortCol] || "").localeCompare(b[sortCol] || "");
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (loading)
    return <p style={{ padding: "0.5rem", fontSize: "0.8rem" }}>Loading…</p>;
  if (error)
    return (
      <p style={{ padding: "0.5rem", color: "var(--danger)", fontSize: "0.8rem" }}>
        Error: {error}
      </p>
    );

  const GROUP_LABELS: Record<string, string> = {
    sick: "ฉิทยา",
  };

  function displayGroupName(name: string): string {
  return GROUP_LABELS[name] ?? name;
  }

  const columns: { key: string; label: string; style: React.CSSProperties }[] = [
    { key: "group_name", label: "group", style: styles.th },
    { key: "wy_id", label: "wy_id", style: styles.th },
    { key: "avg", label: "avg", style: styles.th },
    { key: "days_milking", label: "days", style: styles.th },
    { key: "u_read", label: "u_read", style: styles.th },
    { key: "expected_bdate", label: "exp bdate", style: styles.th },
  ];

  return (
    <div style={styles.tableContainer}>
      <PanelHeader title="Groups Summary">
        <DownloadXlsxButton rows={sortedRows} filename="groups_summary.xlsx" sheetName="groups" />
      </PanelHeader>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ ...col.style, cursor: "pointer" }}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortCol === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => {
            const avgVal = parseFloat(row.avg);
            const avgColor = Number.isNaN(avgVal)
              ? undefined
              : avgVal >= AVG_THRESHOLD
              ? "#4ade80"
              : "#f87171";
            return (
              <tr key={i}>
                <td style={styles.td}>{displayGroupName(row.group_name) || "—"}</td>
                <td style={styles.td}>{row.wy_id || "—"}</td>
                <td style={{ ...styles.tdSeparator, color: avgColor }}>
                  {formatAvg(row.avg)}
                </td>
                <td style={styles.td}>{row.days_milking || "—"}</td>
                <td style={styles.td}>{row.u_read || "—"}</td>
                <td style={styles.tdDateWide}>{formatDate(row.expected_bdate)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}