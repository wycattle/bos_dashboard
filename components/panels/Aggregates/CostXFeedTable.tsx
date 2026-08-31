/** components/panels/Aggregates/CostXFeedTable.tsx */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { sortRows } from "@/utils/sortRows";
import { SortableTh } from "@/utils/SortableTh";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";
import * as formatters from "../../shared/formatters";

interface CostXFeedRow {
  datex: string;
  electricity: number;
  equipment: number;
  fuel: number;
  interest: number;
  labor: number;
  maintenance: number;
  materials: number;
  medical: number;
  milk_truck: number;
  misc: number;
  repair: number;
  supplies: number;
  unknown: number;
}

const COST_COLS: { key: keyof CostXFeedRow; label: string }[] = [
  { key: "electricity", label: "Electricity" },
  { key: "equipment", label: "Equipment" },
  { key: "fuel", label: "Fuel" },
  { key: "interest", label: "Interest" },
  { key: "labor", label: "Labor" },
  { key: "maintenance", label: "Maintenance" },
  { key: "materials", label: "Materials" },
  { key: "medical", label: "Medical" },
  { key: "milk_truck", label: "Milk Truck" },
  { key: "misc", label: "Misc" },
  { key: "repair", label: "Repair" },
  { key: "supplies", label: "Supplies" },
  { key: "unknown", label: "Unknown" },
];

type SortKey = keyof CostXFeedRow;
type SortDir = "asc" | "desc";

const formatMonth = (v: unknown) => (v ? String(v).slice(0, 7) : "—");

export default function CostXFeedTable() {
  const [rows, setRows] = useState<CostXFeedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("datex");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetch("/api/aggregates/cost_x_feed")
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

  const rowSum = (row: CostXFeedRow) =>
    COST_COLS.reduce((acc, { key }) => acc + (Number(row[key]) || 0), 0);

  const columnTotal = (key: keyof CostXFeedRow) =>
    rows.reduce((acc, row) => acc + (Number(row[key]) || 0), 0);

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
    <td style={{ textAlign: "center" }}>
      {formatters.formatNum(val as number | undefined)}
    </td>
  );

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error)
    return (
      <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>
    );

  const grandTotal = rows.reduce((acc, row) => acc + rowSum(row), 0);

  return (
    <div style={styles.tableContainer}>
      <PanelHeader title="Cost X Feed table">
        <DownloadXlsxButton rows={rows} filename="cost_x_feed.xlsx" sheetName="costxfeed" />
      </PanelHeader>
      <table className="data-table">
        <thead>
          <tr>
            <SortableTh
              colKey="datex"
              label="Date"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            {COST_COLS.map(({ key, label }) => (
              <SortableTh
                key={key}
                colKey={key}
                label={label}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            ))}
            <th>Sum</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ textAlign: "center" }}>{formatMonth(row.datex)}</td>
              {COST_COLS.map(({ key }) => (
                <React.Fragment key={key}>{cell(row[key])}</React.Fragment>
              ))}
              <td style={{ textAlign: "center", fontWeight: 600 }}>
                {formatters.formatNum(rowSum(row))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: 600, borderTop: "2px solid var(--border)" }}>
            <td style={{ textAlign: "center" }}>Sum</td>
            {COST_COLS.map(({ key }) => (
              <td key={key} style={{ textAlign: "center" }}>
                {formatters.formatNum(columnTotal(key))}
              </td>
            ))}
            <td style={{ textAlign: "center" }}>{formatters.formatNum(grandTotal)}</td>
          </tr>
          <tr style={{ fontWeight: 600 }}>
            <td style={{ textAlign: "center" }}>% of total</td>
            {COST_COLS.map(({ key }) => (
              <td key={key} style={{ textAlign: "center" }}>
                {formatters.formatPct(
                  grandTotal ? columnTotal(key) / grandTotal : undefined,
                )}
              </td>
            ))}
            <td style={{ textAlign: "center" }}>100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}