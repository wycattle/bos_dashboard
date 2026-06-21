"use client";
import React, { useEffect, useState } from "react";

interface HalfdayRow {
  WY_id: string;
  am: string;
  pm: string;
}

const th: React.CSSProperties = {
  textAlign: "center",
  fontSize: "0.72rem",
  padding: "2px 4px",
};
const td: React.CSSProperties = {
  textAlign: "right",
  fontSize: "0.72rem",
  padding: "1px 4px",
};
const tdc: React.CSSProperties = {
  textAlign: "center",
  fontSize: "0.72rem",
  padding: "1px 4px",
};

export default function HalfdayTable() {
  const [rows, setRows] = useState<HalfdayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/halfday")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setRows(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p style={{ padding: "0.5rem", fontSize: "0.8rem" }}>Loading…</p>;
  if (error)
    return (
      <p
        style={{
          padding: "0.5rem",
          color: "var(--danger)",
          fontSize: "0.8rem",
        }}
      >
        Error: {error}
      </p>
    );

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", height: "100%" }}>
      <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "0.85rem" }}>
        Half-Day Summary
      </h2>
      <table className="data-table">
        <thead>
          <tr>
            <th style={th}>WY ID</th>
            <th style={th}>AM</th>
            <th style={th}>PM</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={tdc}>{row.WY_id}</td>
              <td style={td}>{row.am || "—"}</td>
              <td style={td}>{row.pm || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
