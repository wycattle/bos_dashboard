"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface IuMergeRow {
  id: number;
  wy_id: string;
  datex: string;
  typex: string;
  i_calf_num: string;
  u_calf_num: string;
  stop_num: string;
  readex: string;
  try_num: string;
}

interface IuMergePanelProps {
  wy_id?: string;
  embedded?: boolean;
}

export default function IuMergePanel({ wy_id, embedded = false }: IuMergePanelProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activewy_id = wy_id ?? searchParams.get("wy_id");

  const [rows, setRows] = useState<IuMergeRow[]>([]);
  const [loading, setLoading] = useState(!!activewy_id);
  const [error, setError] = useState<string | null>(
    activewy_id ? null : "Missing WY ID"
  );

  useEffect(() => {
    if (!activewy_id) return;


    fetch(`/api/cow/iu_merge?wy_id=${encodeURIComponent(activewy_id)}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, [activewy_id]);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div style={{ padding: embedded ? "0.5rem" : "1rem" }}>
        <p style={{ color: "red" }}>Error: {error}</p>
        {!embedded && (
          <button
            onClick={() => router.push("/cow")}
            style={{
              marginTop: "1rem",
              padding: "0.4rem 0.9rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              background: "#1e293b",
              color: "#f8fafc",
              border: "1px solid #475569",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ← Back to Cow Panel
          </button>
        )}
      </div>
    );
  }

  if (rows.length === 0) return <p>No records found for WY ID: {activewy_id}</p>;

  return (
    <div style={{ padding: embedded ? "0.5rem" : "1rem" }}>
      {!embedded && <h2>I/U Merge Records for {activewy_id}</h2>}
      <table style={{ width: embedded ? "100%" : "30%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1e293b", color: "#f8fafc" }}>
            <th style={{ textAlign: "right" }}>ID</th>
            <th style={{ textAlign: "right" }}>Date</th>
            <th style={{ textAlign: "right" }}>Type</th>
            <th style={{ textAlign: "right" }}>I Calf</th>
            <th style={{ textAlign: "right" }}>U Calf</th>
            <th style={{ textAlign: "right" }}>Stop</th>
            <th style={{ textAlign: "right" }}>Read</th>
            <th style={{ textAlign: "right" }}>Try</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={{ borderBottom: "1px solid #475569" }}>
              <td style={{ textAlign: "right" }}>{row.id}</td>
              <td style={{ textAlign: "right" }}>{row.datex?.split("T")[0]}</td>
              <td style={{ textAlign: "right" }}>{row.typex}</td>
              <td style={{ textAlign: "right" }}>{row.i_calf_num}</td>
              <td style={{ textAlign: "right" }}>{row.u_calf_num}</td>
              <td style={{ textAlign: "right" }}>{row.stop_num}</td>
              <td style={{ textAlign: "right" }}>{row.readex}</td>
              <td style={{ textAlign: "right" }}>{row.try_num}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}