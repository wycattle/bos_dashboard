/** components/panels/Aggregates/FulldayTable.tsx */
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { SortableTh } from "@/utils/SortableTh";
import { PanelHeader } from "../../shared/PanelHeader";
import { DownloadXlsxButton } from "../../shared/DownloadXlsxButton";
import * as styles from "../../shared/tableStyles";

interface FulldayRow {
  date: string;
  data: Record<string, number>;
}

type SortDir = "asc" | "desc";

export default function FulldayTable() {
  const [rows, setRows] = useState<FulldayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    fetch("/api/aggregates/fullday")
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
    (key: string) => {
      if (key === sortKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey],
  );

  const wy_ids = useMemo(() => {
    const idSet = new Set<string>();
    rows.forEach((row) => {
      if (row.data) Object.keys(row.data).forEach((id) => idSet.add(id));
    });
    return Array.from(idSet).sort((a, b) => Number(a) - Number(b));
  }, [rows]);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === "date") {
        av = a.date ?? "";
        bv = b.date ?? "";
      } else {
        av = a.data?.[sortKey] ?? 0;
        bv = b.data?.[sortKey] ?? 0;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortKey, sortDir]);

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error)
    return (
      <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>
    );

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <PanelHeader title="Full-Day Milk Records">
        <DownloadXlsxButton
          rows={rows}
          filename="fullday_records.xlsx"
          sheetName="fullday"
        />
      </PanelHeader>
      <table className="data-table">
        <thead>
          <tr>
            <SortableTh
              label="Date"
              colKey="date"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            {wy_ids.map((id) => (
              <SortableTh
                key={id}
                label={`WY ${id}`}
                colKey={id}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              <td style={{ textAlign: "center" }}>
                {String(row.date).slice(0, 10)}
              </td>
              {wy_ids.map((id) => (
                <td key={id} style={{ textAlign: "right" }}>
                  {row.data?.[id] != null
                    ? Number(row.data[id]).toFixed(1)
                    : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}