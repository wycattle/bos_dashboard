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
  wy: number;
  cp: number;
  sick_am: number;
  sick_pm: number;
  heifers_am: number;
  heifers_pm: number;
  heldback_total: number;
  wy_x_heldback: number;
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
            {th("wy", "WY")}
            {th("sick_am", "Sick AM")}
            {th("sick_pm", "Sick PM")}
            {th("heifers_am", "Heifers AM")}
            {th("heifers_pm", "Heifers PM")}
            {th("heldback_total", "Heldback Total")}
            {th("wy_x_heldback", "WY-heldback")}
            {th("cp", "CP")}
            {th("wy_minus_cp", "WY-CP")}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ ...styles.tdDateWide, textAlign: "center" }}>{formatDate(row.datex)}</td>
              <td style={{ ...styles.tdc }}>{formatNum(row.wy)}</td>
              <td style={{ ...styles.tdc }}>{formatNum(row.sick_am)}</td>
              <td style={{ ...styles.tdc }}>{formatNum(row.sick_pm)}</td>
              <td style={{ ...styles.tdc }}>{formatNum(row.heifers_am)}</td>
              <td style={{ ...styles.tdc }}>{formatNum(row.heifers_pm)}</td>
              <td style={{ ...styles.tdc }}>{formatNum(row.heldback_total)}</td>
              <td style={{ ...styles.tdc }}>{formatNum(row.wy_x_heldback)}</td>
              <td style={{ ...styles.tdc }}>{formatNum(row.cp)}</td>
              <td style={{ ...styles.tdc }}>{formatNum(row.wy_minus_cp)}</td>


            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}