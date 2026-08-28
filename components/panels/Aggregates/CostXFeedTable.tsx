/** components/panels/Aggregates/CostXFeedTable.tsx */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { sortRows } from "@/utils/sortRows";
import { SortableTh } from "@/utils/SortableTh";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";

interface CostXFeedRow {
  wy_id: number;
  u_read?: string | null;
  days_milking?: number | null;
  [key: string]: unknown; // lact_num columns: "1", "2", "3"... (timestamp/date values)
}

const isLactCol = (k: string) => /^\d+$/.test(k);

type SortKey = keyof CostXFeedRow;
type SortDir = "asc" | "desc";

export default function IpivTable() {
  const [rows, setRows] = useState<CostXFeedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("wy_id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

useEffect(() => {
    fetch("/api/aggregates/ipiv")
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

  const formatDate = (val: unknown) => {
  if (val == null) return "—";
  return String(val).slice(0, 10);
  };

  const handleSort = useCallback(
    (key: SortKey) => {
      const newDir: SortDir =
        sortKey === key ? (sortDir === "asc" ? "desc" : "asc") : "desc";
      setRows((prev) => sortRows(prev, key, newDir));
      setSortKey(key);
      setSortDir(newDir);
    },
    [sortKey, sortDir],
  );

  const cell = (val: unknown) => (
    <td style={{ textAlign: "center" }}>{val != null ? String(val) : "—"}</td>
  );

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error)
    return (
      <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>
    );

  const lactCols = rows.length
    ? Object.keys(rows[0]).filter(isLactCol).sort((a, b) => Number(a) - Number(b))
    : [];

    return (
      <div style={styles.tableContainer}>
        <PanelHeader title="Insem pivot table">
          <DownloadXlsxButton rows={rows} filename="insem_pivot.xlsx" sheetName="ipiv" />
        </PanelHeader>
        <table className="data-table">
        <thead>
          <tr>
            <SortableTh
              colKey="wy_id"
              label="wy ID"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <SortableTh
              colKey="u_read"
              label="U Read"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <SortableTh
              colKey="days_milking"
              label="Days Milking"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            {lactCols.map((col) => (
              <th key={col}>Try {col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {cell(row.wy_id)}
              {cell(row.u_read)}
              {cell(row.days_milking)}
              {lactCols.map((col) => (
                <td key={col} style={{ textAlign: "center" }}>{formatDate(row[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}