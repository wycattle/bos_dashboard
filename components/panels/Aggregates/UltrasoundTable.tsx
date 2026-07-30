"use client";
import React, { useEffect, useState, useCallback } from "react";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";
import { sortRows } from "@/utils/sortRows";
import { SortableTh } from "@/utils/SortableTh";

interface UltrasoundRow {
  wy_id: number;
  i_date?: string | null; // TEXT
  age_insem?: number | null;
  next_ultra_check_date?: string | null; // TEXT
  [key: string]: unknown;
}

type SortKey = keyof UltrasoundRow;
type SortDir = "asc" | "desc";

export default function UltrasoundTable() {
  const [rows, setRows] = useState<UltrasoundRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("next_ultra_check_date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    fetch("/api/aggregates/ultrasound")
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
        <PanelHeader title="Ultrasound table">
          <DownloadXlsxButton rows={rows} filename="ultrasound_table.xlsx" sheetName="ultrasound" />
        </PanelHeader>
        <table className="data-table">
        <thead>
          <tr>
            <th>wy ID</th>
            <th>I Date</th>
            <th>Age Insem</th>
            <SortableTh
              colKey="next_ultra_check_date"
              label="Next Ultra Check Date"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {cell(row.wy_id)}
              {cell(row.i_date)}
              {cell(row.age_insem)}
              {cell(row.next_ultra_check_date)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}