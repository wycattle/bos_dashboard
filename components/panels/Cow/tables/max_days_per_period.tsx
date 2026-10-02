/** components/panels/Cow/tables/max_days_per_period.tsx */
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  tableWrap,
  tableBase,
  thead,
  colCell,
  colHead,
  navButtonStyle,
} from "@/components/shared/tableStyles";

interface TransposedRow {
  field: string;
  value: string | number | null;
}

interface MaxDaysPerPeriodPanelProps {
  wy_id?: string;
  embedded?: boolean;
}

const FIELD_COL = 0;

export default function MaxDaysPerPeriodPanel({
  wy_id,
  embedded = false,
}: MaxDaysPerPeriodPanelProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activewy_id = wy_id ?? searchParams.get("wy_id");

  const [rows, setRows] = useState<TransposedRow[]>([]);
  const [loading, setLoading] = useState(!!activewy_id);
  const [error, setError] = useState<string | null>(
    activewy_id ? null : "Missing WY ID"
  );
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (!activewy_id) return;

    setLoading(true);
    setError(null);

    fetch(
      `/api/cow/max_days_per_period?wy_id=${encodeURIComponent(activewy_id)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error(
            "Unexpected response shape from /api/cow/max_days_per_period"
          );
        }
        setRows(data);
      })
      .catch((err) => {
        setError(String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activewy_id]);

  if (loading) return <p id="max-days-per-period-panel">Loading...</p>;

  if (error) {
    return (
      <div
        id="max-days-per-period-panel"
        style={{ padding: embedded ? "0.5rem" : "1rem" }}
      >
        <p className="error-text">Error: {error}</p>
        {!embedded && (
          <button onClick={() => router.push("tables")} style={navButtonStyle}>
            ← Back to Cow Panel
          </button>
        )}
      </div>
    );
  }

  if (rows.length === 0)
    return <p>No records found for WY ID: {activewy_id}</p>;

  return (
    <div
      id="max-days-per-period-panel"
      style={{ padding: embedded ? "0.5rem" : "1rem" }}
    >
      {!embedded && <h2>Max Days Per Period for {activewy_id}</h2>}
      <h3 style={{ margin: "0 0 0.5rem" }}>Wet-Dry Days</h3>
      <div style={tableWrap}>
        <table style={tableBase}>
          <thead>
            <tr style={thead}>
              <th style={{ ...colHead(FIELD_COL), textAlign: "left" }}>
                Period
              </th>
              <th style={colHead(1)}>Days</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const hover = hovered === i;
              return (
                <tr
                  key={`${row.field}-${i}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <td style={{ ...colCell(FIELD_COL, hover), textAlign: "left" }}>
                    {row.field}
                  </td>
                  <td style={colCell(1, hover)}>{row.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}