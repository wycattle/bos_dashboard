"use client";
import React, { useEffect, useState, useCallback } from "react";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";
import { sortRows } from "@/utils/sortRows";
import { SortableTh } from "@/utils/SortableTh";

interface AllxRow {
  wy_id: number;
  status?: string | null;
  last_stop_date?: string | null; // DATE
  stop_calf_num?: number | null;
  last_calf_bdate?: string | null; // DATE
  last_calf_num?: number | null;
  days_milking?: number | null;
  i_calf_num?: number | null;
  i_date?: string | null; // DATE
  age_insem?: number | null;
  u_calf_num?: number | null;
  u_date?: string | null; // DATE
  u_read?: string | null;
  age_ultra?: number | null;
  expected_bdate?: string | null; // DATE
  exp_drydate?: string | null; // DATE
  i_check?: number | null;
  u_check1?: number | null;
  u_check2?: number | null;
  updated?: string | null;  // DATE
  // index signature for any additional columns
  [key: string]: unknown;
}

type SortKey = keyof AllxRow;
type SortDir = "asc" | "desc";

export default function AllxTable() {
  const [rows, setRows] = useState<AllxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("wy_id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetch("/api/aggregates/allx")
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
        <PanelHeader title="Allx Table">
          <DownloadXlsxButton rows={rows} filename="allx_table.xlsx" sheetName="sheet_1" />
        </PanelHeader>
        <table className="data-table">
        <thead>
          <tr>
            {th("wy_id", "wy ID")}
            {th("status", "Status")}
            {th("last_stop_date", "Last Stop Date")}
            {th("stop_calf_num", "Stop Calf #")}
            {th("last_calf_bdate", "Last Calf BDate")}
            {th("last_calf_num", "Last Calf #")}
            {th("days_milking", "Days Milking")}
            {th("i_calf_num", "I Calf #")}
            {th("i_date", "I Date")}
            {th("age_insem", "Age Insem")}
            {th("u_calf_num", "U Calf #")}
            {th("u_date", "U Date")}
            {th("u_read", "U Read")}
            {th("age_ultra", "Age Ultra")}
            {th("expected_bdate", "Exp BDate")}
            {th("exp_drydate", "Exp Dry Date")}
            {th("i_check", "I Check")}
            {th("u_check1", "U Check 1")}
            {th("u_check2", "U Check 2")}
            {th("updated", "updated")}            
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {cell(row.wy_id)}
              {cell(row.status)}
              {cell(row.last_stop_date)}
              {cell(row.stop_calf_num)}
              {cell(row.last_calf_bdate)}
              {cell(row.last_calf_num)}
              {cell(row.days_milking)}
              {cell(row.i_calf_num)}
              {cell(row.i_date)}
              {cell(row.age_insem)}
              {cell(row.u_calf_num)}
              {cell(row.u_date)}
              {cell(row.u_read)}
              {cell(row.age_ultra)}
              {cell(row.expected_bdate)}
              {cell(row.exp_drydate)}
              {cell(row.i_check)}
              {cell(row.u_check1)}
              {cell(row.u_check2)}
              {cell(row.updated)}              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
