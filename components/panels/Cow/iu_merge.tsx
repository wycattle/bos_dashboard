"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface IuMergeRow {
  wy_id: number;
  typex: string;
  datex: string;
  readex: string | null;
  try_num: number | null;
  i_calf_num: number | null;
  u_calf_num: number | null;
  calf_num: number | null;
  stop_date: string | null;
  stop_num: number | null;
}

export default function IuMergePanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const wyIdFromUrl = searchParams.get("wy_id");

  const [rows, setRows] = useState<IuMergeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (wyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/iu_merge?wy_id=${encodeURIComponent(wyId)}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data: IuMergeRow[] = await res.json();
      setRows(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wyIdFromUrl) {
      fetchData(wyIdFromUrl);
    }
  }, [wyIdFromUrl]);

  return (
    <div style={{ padding: "1rem" }}>
      {/* Back button */}
      <button
         onClick={() => router.push(`/cow?wy_id=${encodeURIComponent(wyIdFromUrl || "")}`)}
        style={{
          padding: "0.3rem 0.7rem",
          fontSize: "0.8rem",
          fontWeight: 600,
          background: "#1e293b",
          color: "#f8fafc",
          border: "1px solid #475569",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        ← Back to Cow Panel
      </button>

      <h2>IU Merge Panel</h2>
      {!wyIdFromUrl && (
        <p>No WY ID provided. Please go back and enter a WY ID first.</p>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {rows.length > 0 && (
        <table border={1} cellPadding={6} style={{ marginTop: "1rem", borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>WY ID</th>
              <th>Type</th>
              <th>Date</th>
              <th>Read</th>
              <th>Try#</th>
              <th>I Calf#</th>
              <th>U Calf#</th>
              <th>Calf#</th>
              <th>Stop Date</th>
              <th>Stop#</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>{row.wy_id}</td>
                <td>{row.typex}</td>
                <td>{row.datex ? new Date(row.datex).toLocaleDateString() : ""}</td>
                <td>{row.readex ?? ""}</td>
                <td>{row.try_num ?? ""}</td>
                <td>{row.i_calf_num ?? ""}</td>
                <td>{row.u_calf_num ?? ""}</td>
                <td>{row.calf_num ?? ""}</td>
                <td>{row.stop_date ? new Date(row.stop_date).toLocaleDateString() : ""}</td>
                <td>{row.stop_num ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {rows.length === 0 && wyIdFromUrl && !loading && !error && (
        <p>No records found for WY ID: {wyIdFromUrl}</p>
      )}
    </div>
  );
}