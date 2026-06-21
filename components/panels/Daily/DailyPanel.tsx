"use client";
import React from "react";
import { useRouter } from "next/navigation";
import TendayTable from "./TendayTable";
import HalfdayTable from "./HalfdayTable";
import GroupsTable from "./GroupsTable";

export default function DailyPanel() {
  const router = useRouter();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        gap: "1.5rem",
        height: "100%",
        overflow: "hidden",
        padding: "2.5rem 1rem 1rem 1rem",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0.5rem",
          left: "0.5rem",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            padding: "0.3rem 0.7rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #475569",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ⌂ Home
        </button>
      </div>
      <div style={{ overflow: "auto", minHeight: 0 }}>
        <TendayTable />
      </div>
      <div style={{ overflow: "auto", minHeight: 0, width: "160px" }}>
        <HalfdayTable />
      </div>
      <div style={{ overflow: "auto", minHeight: 0, width: "280px" }}>
        <GroupsTable />
      </div>
    </div>
  );
}
