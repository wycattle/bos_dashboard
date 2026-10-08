/** components/panels/Aggregates/CostXFeedTable.tsx */
"use client";
import { useEffect, useState, useCallback } from "react";
import { sortRows } from "@/utils/sortRows";
import { SortableTh } from "@/utils/SortableTh";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import { FrozenTable } from "../../shared/FrozenTable";
import * as styles from "../../shared/tableStyles";
import { DateCell } from "../../shared/DateCell";
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

const COST_COLS = [
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
] as const satisfies ReadonlyArray<{ key: keyof CostXFeedRow; label: string }>;

type CostKey = (typeof COST_COLS)[number]["key"];

type SortKey = keyof CostXFeedRow;
type SortDir = "asc" | "desc";

const cellStyle = { textAlign: "center" } as const;

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

  const columnTotal = (key: CostKey) =>
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

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error)
    return (
      <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>
    );

  const grandTotal = rows.reduce((acc, row) => acc + rowSum(row), 0);
  const n = rows.length || 1;                       // guard: empty table → no NaN
  const columnAvg = (key: CostKey) => columnTotal(key) / n;
  const pctOfTotal = (key: CostKey) =>
    grandTotal ? columnAvg(key) / (grandTotal / n) : undefined;

  return (
    <div style={styles.tableContainer}>
      <PanelHeader title="Cost X Feed table">
        <DownloadXlsxButton rows={rows} filename="cost_x_feed.xlsx" sheetName="costxfeed" />
      </PanelHeader>

      <FrozenTable>
        <thead>
          <tr>
            {[
              <SortableTh
                key="datex"
                colKey="datex"
                label="Date"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />,
              ...COST_COLS.map(({ key, label }) => (
                <SortableTh
                  key={key}
                  colKey={key}
                  label={label}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
              )),
              <th key="sum">Sum</th>,
            ]}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {[
                <DateCell key="datex" value={row.datex} style={cellStyle} />,
                ...COST_COLS.map(({ key }) => (
                  <td key={key} style={cellStyle}>
                    {formatters.formatNum(row[key])}
                  </td>
                )),
                <td key="sum" style={{ ...cellStyle, fontWeight: 600 }}>
                  {formatters.formatNum(rowSum(row))}
                </td>,
              ]}
            </tr>
          ))}
        </tbody>

        <tfoot>
          {/* Average row — mean of each column across all rows */}
          <tr style={{ fontWeight: 600, borderTop: "2px solid var(--border)" }}>
            {[
              <td key="label" style={cellStyle}>Average</td>,
              ...COST_COLS.map(({ key }) => (
                <td key={key} style={cellStyle}>
                  {formatters.formatNum(columnAvg(key))}
                </td>
              )),
              <td key="avg" style={cellStyle}>
                {formatters.formatNum(grandTotal / n)}
              </td>,
            ]}
          </tr>

          {/* % of total row — each average as a share of the total average */}
          <tr style={{ fontWeight: 600 }}>
            {[
              <td key="label" style={cellStyle}>% of total</td>,
              ...COST_COLS.map(({ key }) => (
                <td key={key} style={cellStyle}>
                  {formatters.formatPct(pctOfTotal(key))}
                </td>
              )),
              <td key="total" style={cellStyle}>100%</td>,
            ]}
          </tr>
        </tfoot>
      </FrozenTable>
    </div>
  );
}