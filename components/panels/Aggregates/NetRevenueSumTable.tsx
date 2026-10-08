/** components/panels/Aggregates/NetRevenueSumTable.tsx */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import { FrozenTable }        from "../../shared/FrozenTable";
import * as styles from "../../shared/tableStyles";
import { sortRows } from "@/utils/sortRows";
import { SortableTh } from "@/utils/SortableTh";

interface NetRevenueSumRow {
  wy_id: number;
  net_revenue: number;
  status: string | null;      // 'dry' | 'milking' | null
  lact_num_x: number | null;
  price: number;
  adj_net_rev: number;
  lact_num_y: number;
}

type SortKey = keyof NetRevenueSumRow;
type SortDir = "asc" | "desc";

export default function NetRevenueSumTable() {
  const [rows,    setRows]    = useState<NetRevenueSumRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("net_revenue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetch("/api/aggregates/net_revenue_sum")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRows(sortRows(data, "net_revenue", "desc"));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatNumber = (val: unknown) => {
    if (val == null) return "—";
    const n = Number(String(val).replace(/,/g, ""));
    if (isNaN(n)) return String(val);
    return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // IDs / small counts: no thousands separators
  const formatPlain = (val: unknown) => (val == null ? "—" : String(val));

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
      <PanelHeader title="Net Revenue Sum Table">
        <DownloadXlsxButton
          rows={rows}
          filename="net_revenue_sum_table.xlsx"
          sheetName="sheet_1"
        />
      </PanelHeader>

      <FrozenTable>
        <thead>
          <tr>
            {th("wy_id", "WY ID")}
            {th("net_revenue", "Net Revenue")}
            {th("status", "Status")}
            {th("lact_num_x", "Lact # (x)")}
            {th("price", "Price")}
            {th("adj_net_rev", "Adj Net Rev")}
            {th("lact_num_y", "Lact # (y)")}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.wy_id}>
              <td style={tdc}>{formatPlain(row.wy_id)}</td>
              <td style={tdc}>{formatNumber(row.net_revenue)}</td>
              <td style={tdc}>{formatPlain(row.status)}</td>
              <td style={tdc}>{formatPlain(row.lact_num_x)}</td>
              <td style={tdc}>{formatNumber(row.price)}</td>
              <td style={tdc}>{formatNumber(row.adj_net_rev)}</td>
              <td style={tdc}>{formatPlain(row.lact_num_y)}</td>
            </tr>
          ))}
        </tbody>
      </FrozenTable>
    </div>
  );
}