/** components/panels/Cow/tables/iu_merge.tsx */
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  tableWrap,
  tableBase,
  thead,
  colCell,
  colHead,
  thDate,
  th,
  tdDate,
  tdF,
  navButtonStyle,
} from "@/components/shared/tableStyles";

interface IuMergeRow {
  wy_id: string;
  datex: string;
  typex: string;
  i_calf_num: string;
  "u-calf_num": string;
  calf_num: string;
  stop_date: string;
  stop_num: string;
  readex: string;
  try_num: string;
}

interface IuMergePanelProps {
  wy_id?: string;
  embedded?: boolean;
}

function formatDate(value: string | Date | null | undefined): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().split("T")[0];
  return String(value).split(/[T ]/)[0];
}

const COLUMNS = [
  "WY ID",
  "Date",
  "Type",
  "I Calf",
  "U Calf",
  "Stop",
  "Read",
  "Try",
] as const;

const DATE_COL = 1;
const TYPE_COL = 2;
const TYPE_COL_WIDTH = "90px";

export default function IuMergePanel({ wy_id, embedded = false }: IuMergePanelProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activewy_id = wy_id ?? searchParams.get("wy_id");

  const [rows, setRows] = useState<IuMergeRow[]>([]);
  const [loading, setLoading] = useState(!!activewy_id);
  const [error, setError] = useState<string | null>(
    activewy_id ? null : "Missing WY ID"
  );
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (!activewy_id) return;

    setLoading(true);
    setError(null);

    fetch(`/api/cow/iu_merge?wy_id=${encodeURIComponent(activewy_id)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response shape from /api/cow/iu_merge");
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
    <div id="iu-merge-panel" style={{ padding: embedded ? "0.5rem" : "1rem" }}>
      {!embedded && <h2>I/U Merge Records for {activewy_id}</h2>}
      <h3 style={{ margin: "0 0 0.5rem" }}>Events</h3> 
      <div style={tableWrap}>
        <table style={tableBase}>
        <thead>
          <tr style={thead}>
            {COLUMNS.map((label, c) => (
              <th
                key={label}
                style={
                   c === DATE_COL
                    ? { ...colHead(c), ...thDate }
                    : c === TYPE_COL
                    ? { ...colHead(c), ...th, width: TYPE_COL_WIDTH }
                    : colHead(c)
                }
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
          <tbody>
            {rows.map((row, i) => {
              const hover = hovered === i;
              const cells: [number, string][] = [
                [0, row.wy_id],
                [DATE_COL, formatDate(row.datex)],
                [TYPE_COL, row.typex],
                [3, row.i_calf_num],
                [4, row["u-calf_num"]],
                [5, row.stop_num],
                [6, row.readex],
                [7, row.try_num],
              ];
              return (
                <tr
                  key={`${row.wy_id}-${row.datex}-${row.typex}-${i}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {cells.map(([c, value]) => (
                    <td
                      key={c}
                      style={
                        c === DATE_COL
                          ? { ...colCell(c, hover), ...tdDate }
                          : c === TYPE_COL
                          ? { ...colCell(c, hover), textAlign: "left" }
                          : c >= 3
                          ? { ...colCell(c, hover), ...tdF }
                          : colCell(c, hover)
                      }
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}