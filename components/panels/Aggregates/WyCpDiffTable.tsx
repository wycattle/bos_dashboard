/** components/panels/Aggregates/WyCpDiffTable.tsx */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";
import { sortRows } from "@/utils/sortRows";
import { SortableTh} from "@/utils/SortableTh";
import { formatDate, formatNum} from "@/components/shared/formatters";

interface WyCpDiffRow {
  datex: string;
  milkings: number;
  wy: number;
  heldback: number;
  wy_heldback: number;
  cp_adj: number;
  cp_actual: number;
  wy_minus_cp: number;
}

type SortKey = keyof WyCpDiffRow;
type SortDir = "asc" | "desc";

export default function WyCpDiffTable() {
  const [rows, setRows] = useState<WyCpDiffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("datex");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

    useEffect(() => {
      fetch("/api/aggregates/wy_cp_diff")
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


    const th = (colKey: SortKey, label: string) => (
      <SortableTh
        colKey={colKey}
        label={label}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        style={styles.th}
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
      <PanelHeader title="WyCpDiff">
        <DownloadXlsxButton rows={rows} filename="wy_cp_diff.xlsx" sheetName="sheet_1" />
      </PanelHeader>

      <table className="data-table">
        <thead>
          <tr>
            {th("datex", "Date")}
            {th("milkings", "Milkings")}
            {th("wy", "WY")}
            {th("heldback", "Heldback")}
            {th("wy_heldback", "WY-heldback")}
            {th("cp_adj", "CP adj")}
            {th("cp_actual", "CP actual")}
            {th("wy_minus_cp", "WY-CP")}
          </tr>
          </thead>
        <tbody>
          {rows.map((row, i) => (
          <tr key={i}>
            <td style={{ ...styles.tdDateWide, textAlign: "center" }}>{formatDate(row.datex)}</td>
            <td style={{ ...styles.tdc }}>{formatNum(row.milkings)}</td>
            <td style={{ ...styles.tdc }}>{formatNum(row.wy)}</td>
            <td style={{ ...styles.tdc }}>{formatNum(row.heldback)}</td>
            <td style={{ ...styles.tdc }}>{formatNum(row.wy_heldback)}</td>
            <td style={{ ...styles.tdc }}>{formatNum(row.cp_adj)}</td>
            <td style={{ ...styles.tdc }}>{formatNum(row.cp_actual)}</td>            <td style={{ ...styles.tdc }}>{formatNum(row.wy_minus_cp)}</td>
          </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}