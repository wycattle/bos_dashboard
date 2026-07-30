"use client";
import React, { useEffect, useState } from "react";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";

interface DynamicRow {
  [key: string]: string;
}

export default function HalfdayTable() {
  const [rows, setRows] = useState<DynamicRow[]>([]);  //DynamicRow is set in 4
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/halfday")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setRows(d);
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

    const dateColumnKey = rows.length > 0 
      ? Object.keys(rows[0]).find(k => k !== "AM" && k !== "PM") 
      : null;

    const formatFloat1 = (v: string | undefined) => {
      if (v === undefined || v === "") return "—";
      const n = Number(v);
      if (Number.isNaN(n)) return "—";
      return n.toFixed(1);
    };

    return (
      <div style={styles.tableContainer}>
        <PanelHeader title="Half-day Summary">
          <DownloadXlsxButton rows={rows} filename="halfday_summary.xlsx" sheetName="halfday" />
        </PanelHeader>
        <table className="data-table">
        <thead>
          <tr>
            <th style={styles.th}>{dateColumnKey || "Date"}</th> 
            <th style={styles.th}>AM</th>
            <th style={styles.th}>PM</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={styles.tdc}>{dateColumnKey ? row[dateColumnKey] : "—"}</td> 
              <td style={styles.td}>{formatFloat1(row.AM) || "—"}</td>
              <td style={styles.td}>{formatFloat1(row.PM) || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
