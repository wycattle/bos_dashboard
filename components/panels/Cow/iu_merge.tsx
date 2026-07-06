"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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

export default function IuMergePanel() {
  const searchParams = useSearchParams();
  const wyId = searchParams.get("wy_id");
  const [rows, setRows] = useState<IuMergeRow[]>([]);
  const [loading, setLoading] = useState(!wyId);
    const [error, setError] = useState<string | null>(
    wyId ? null : "Missing WY ID"
  );

  useEffect(() => {
    if (!wyId) 
      return;
    

    fetch(`/api/iu_merge?wy_id=${encodeURIComponent(wyId)}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, [wyId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (rows.length === 0) return <p>No records found for WY ID: {wyId}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>I/U Merge Records for {wyId}</h2>
      <table style={{ width: "30%", borderCollapse: "collapse" }}>
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
              <td style={{ textAlign: "right" }} >{row.id}</td>
              <td style={{ textAlign: "right" }} >{row.datex?.split("T")[0]}</td> 
              <td style={{ textAlign: "right" }} >{row.typex}</td>
              <td style={{ textAlign: "right" }} >{row.i_calf_num}</td>
              <td style={{ textAlign: "right" }} >{row.u_calf_num}</td>
              <td style={{ textAlign: "right" }} >{row.stop_num}</td>
              <td style={{ textAlign: "right" }} >{row.readex}</td>
              <td style={{ textAlign: "right" }} >{row.try_num}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}