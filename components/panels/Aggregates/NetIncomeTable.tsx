/** components/panels/Aggregates/NetIncomeTable.tsx  */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";
import { DateCell } from "../../shared/DateCell";
import { formatNumber } from "../../shared/dateFormat";
import { sortRows } from "@/utils/sortRows";
import { SortableTh } from "@/utils/SortableTh";


interface NetIncomeRow {
  datex: string; // DATE from API
  avg_liters: number;
  income: number;
  feed_cost: number;
  net_revenue: number;
  total_xfeed_cost: number;
  net_income: number;
  liters_shortfall: number;
  liters_for_bkeven: number;
}

type SortKey = keyof NetIncomeRow;
type SortDir = "asc" | "desc";

export default function NetIncomeTable() {
  const [rows,    setRows]    = useState<NetIncomeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("datex");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetch("/api/aggregates/net_income")
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
      setRows((prev) => sortRows(prev, key, newDir)); // uses the sortRows utility
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

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error)
    return (
      <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>
    );

  const tdc = { ...styles.td, textAlign: "center" as const };

  return (
    <div style={styles.tableContainer}>
      <PanelHeader title="Net Income Table">
        <DownloadXlsxButton rows={rows} filename="net_income_table.xlsx" sheetName="sheet_1" />
      </PanelHeader>

      <table className="data-table">
        <thead>
          <tr>
            {th("datex", "Date")}
            {th("avg_liters", "Avg Liters")}
            {th("income", "Income")}
            {th("feed_cost", "Feed Cost")}
            {th("net_revenue", "Net Revenue")}
            {th("total_xfeed_cost", "Total xFeed Cost")}
            {th("net_income", "Net Income")}
            {th("liters_shortfall", "Liters Shortfall")}
            {th("liters_for_bkeven", "Liters for B/E")}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
               <DateCell value={row.datex} style={tdc} />
              <td style={tdc}>{formatNumber(row.avg_liters)}</td>
              <td style={tdc}>{formatNumber(row.income)}</td>
              <td style={tdc}>{formatNumber(row.feed_cost)}</td>
              <td style={tdc}>{formatNumber(row.net_revenue)}</td>
              <td style={tdc}>{formatNumber(row.total_xfeed_cost)}</td>
              <td style={tdc}>{formatNumber(row.net_income)}</td>
              <td style={tdc}>{formatNumber(row.liters_shortfall)}</td>
              <td style={tdc}>{formatNumber(row.liters_for_bkeven)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}