"use client";
import React, { useEffect, useState, useCallback } from "react";
import { sortRows } from "@/utils/sortRows";

interface GroupRow {
  wy_id:      number;
  group_name: string | null;
  average:    number | null;
  u_read:     string | null;
}

type SortKey = keyof GroupRow;
type SortDir = "asc" | "desc";

export default function GroupsTable() {
  const [rows, setRows]       = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("average");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetch("/api/groups")
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
    (key: SortKey) => {
      if (key === sortKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("desc");
      }
    },
    [sortKey]
  );

  const sorted = sortRows(rows, sortKey, sortDir);

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  if (loading) return <p style={{ padding: "1rem" }}>Loading…</p>;
  if (error) return <p style={{ padding: "1rem", color: "var(--danger)" }}>Error: {error}</p>;

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", height: "100%" }}>
      <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>Groups Data</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("wy_id")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
              WY ID{arrow("wy_id")}
            </th>
            <th onClick={() => handleSort("group_name")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
              Group Name{arrow("group_name")}
            </th>
            <th onClick={() => handleSort("average")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
              Average{arrow("average")}
            </th>
            <th onClick={() => handleSort("u_read")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}>
              U Read{arrow("u_read")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              <td style={{ textAlign: "center" }}>{row.wy_id}</td>
              <td style={{ textAlign: "center" }}>{row.group_name ?? "—"}</td>
              <td style={{ textAlign: "center" }}>{row.average != null ? Number(row.average).toFixed(1) : "—"}</td>
              <td style={{ textAlign: "center" }}>{row.u_read != null ? row.u_read : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
