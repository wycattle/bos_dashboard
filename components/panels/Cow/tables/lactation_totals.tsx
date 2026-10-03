/** components/panels/Cow/tables/lactation_totals.tsx */
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

function formatValue(value: string | number | null): string {
  if (value === null || value === undefined) return "";
  const n = typeof value === "number" ? value : Number(value);
  if (!isNaN(n)) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return String(value);
}

interface TransposedRow {
  field: string;
  value: string | number | null;
}

interface LactationTotalsPanelProps {
  id?: string;
  wy_id?: string;
  embedded?: boolean;
}

const FIELD_COL = 0;

export default function LactationTotalsPanel({
  id,
  wy_id,
  embedded = false,
}: LactationTotalsPanelProps) {
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

    fetch(`/api/cow/lactation_totals?wy_id=${encodeURIComponent(activewy_id)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error(
            "Unexpected response shape from /api/cow/lactation_totals"
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

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div style={{ padding: embedded ? "0.5rem" : "1rem" }}>
        <p className="error-text">Error: {error}</p>
        {!embedded && (
          <button onClick={() => router.push("tables")} style={navButtonStyle}>
            ← Back to Cow Panel
          </button>
        )}
      </div>
    );
  }

  if (rows.length === 0) return <p>No records found for WY ID: {activewy_id}</p>;

  return (
    <div id="lactation_totals" style={{ padding: embedded ? "0.5rem" : "1rem" }}>
      {!embedded && <h2>Lactation Totals Records for {activewy_id}</h2>}
      <h3 style={{margin:"0 0 0.5rem"}}>Lactation Days</h3>
      <div style={tableWrap}>
        <table style={tableBase}>
          <thead>
            <tr style={thead}>
              <th style={{ ...colHead(FIELD_COL), textAlign: "left" }}>Lacts</th>
              <th style={colHead(1)}>liters</th>
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
                  <td style={{ ...colCell(FIELD_COL, hover), textAlign: "left", width:'100px' }}>
                    {row.field}
                  </td>
                  <td style={colCell(1, hover)}>{formatValue(row.value)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}