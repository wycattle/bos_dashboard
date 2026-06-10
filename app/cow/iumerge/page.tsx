"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWyId } from "../../../components/panels/Cow/WyIdContext";

type IuMergeRow = {
  id: number;
  wy_id: string;
  datex: string | null;
  typex: string | null;
  i_calf_num: string | null;
  u_calf_num: string | null;
  stop_num: string | null;
  readex: string | null;
  try_num: string | null;
};

const COLUMNS: { key: keyof IuMergeRow; label: string }[] = [
  { key: "datex", label: "Date" },
  { key: "typex", label: "Type" },
  { key: "i_calf_num", label: "I Calf #" },
  { key: "u_calf_num", label: "U Calf #" },
  { key: "stop_num", label: "Stop #" },
  { key: "readex", label: "Read" },
  { key: "try_num", label: "Try #" },
];

export default function IuMergePage() {
  const { wyId } = useWyId();
  const [rows, setRows] = useState<IuMergeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedId = useRef("");

  useEffect(() => {
    if (!wyId || wyId === lastFetchedId.current) return;
    lastFetchedId.current = wyId;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setRows([]);
      try {
        const res = await fetch(
          `/api/cow/iumerge?wy_id=${encodeURIComponent(wyId)}`,
        );
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.error ?? "Failed to fetch data");
        }
        const data: IuMergeRow[] = await res.json();
        setRows(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [wyId]);

  return (
    <main className="app-main">
      <h1 className="page-title">IU Merge</h1>

      {!wyId && (
        <p className="page-meta">
          Enter a WY_id in the bar above to load records.
        </p>
      )}

      {wyId && (
        <p className="page-meta">
          Showing <b>iu_merge</b> records for WY_id: <b>{wyId}</b>
        </p>
      )}

      {loading && <p className="page-meta">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {rows.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {COLUMNS.map((col) => (
                    <td key={col.key}>{row[col.key] ?? ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && wyId && rows.length === 0 && (
        <p className="page-meta">
          No records found for WY_id: <b>{wyId}</b>
        </p>
      )}
    </main>
  );
}
