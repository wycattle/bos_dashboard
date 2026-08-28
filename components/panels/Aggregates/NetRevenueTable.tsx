/** components/panels/Aggregates/NetRevenueTable.tsx  */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";
import { sortRows } from "@/utils/sortRows";
import { SortableTh } from "@/utils/SortableTh";

interface NetRevenueRow {
  datex: string; // TIMESTAMP from API
  avg_liters: number;
  income: number;
  cost: number;
  net_revenue: number;
}

type SortKey = keyof NetRevenueRow;
type SortDir = "asc" | "desc";

export default function NetRevenueTable() {
  const [rows,    setRows]    = useState<NetRevenueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("datex");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetch("/api/aggregates/net_revenue")
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
    const d = new Date(val as string);
    return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString(); // date only, no time
  };

  const formatNumber = (val: unknown) => {
    if (val == null) return "—";
    const raw = String(val).replace(/,/g, "");   // remove existing thousands separators
    const n = Number(raw);
    if (isNaN(n)) return String(val);
    return n.toLocaleString("en-US", { maximumFractionDigits: 0 }); // no decimals + commas
  };

  const handleSort = useCallback(
    (key: SortKey) => {
      const newDir: SortDir =
        sortKey === key ? (sortDir === "asc" ? "desc" : "asc") : "desc";
      setRows((prev) => sortRows(prev, key, newDir)); //uses the sortRows utility
      setSortKey(key);
      setSortDir(newDir);
    },
    [sortKey, sortDir],
  );

  const th = (colKey: SortKey, label: string) => (
    <SortableTh
      colKey={colKey}
      label={label}
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={handleSort}
    />
  );

  const cell = (val: unknown) => (
    <td style={{ textAlign: "center" }}>{val != null ? String(val) : "—"}</td>
  );

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error)
    return (
      <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>
    );

  
  return (
    <div style={styles.tableContainer}>
      <PanelHeader title="Net Revenue Table">
        <DownloadXlsxButton rows={rows} filename="net_revenue_table.xlsx" sheetName="sheet_1" />
      </PanelHeader>

      <table className="data-table">
        <thead>
          <tr>
            {th("datex", "Date")}
            {th("avg_liters", "Avg Liters")}
            {th("income", "Income")}
            {th("cost", "Cost")}
            {th("net_revenue", "Net Revenue")}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ ...styles.td, textAlign: "center" }}>{formatDate(row.datex)}</td>
              <td style={{ ...styles.td, textAlign: "center" }}>{formatNumber(row.avg_liters)}</td>
              <td style={{ ...styles.td, textAlign: "center" }}>{formatNumber(row.income)}</td>
              <td style={{ ...styles.td, textAlign: "center" }}>{formatNumber(row.cost)}</td>
              <td style={{ ...styles.td, textAlign: "center" }}>{formatNumber(row.net_revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
