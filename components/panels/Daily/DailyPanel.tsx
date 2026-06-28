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
        gridTemplateColumns: "2fr auto 1.2fr",   // ← control proportion here
        // 2fr – first column takes 2 fractions of the available space (after auto column is accounted for). "fr" stands for "fractional unit" and divides remaining space proportionally among fr columns.
        //auto – second column sizes itself to its content width (no stretch). So the Halfday table will be as wide as its data.
        //1.5fr – third column takes 1.5 fractions.
        gap: "1rem",
        height: "100%",
        overflow: "hidden",
        padding: "2.5rem 1rem 1rem 1rem",
        position: "relative",
      }}
    >
      {/* Home button */}
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
            background: "#470332",
            color: "#f8fafc",
            border: "1px solid #475569",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ⌂ Home
        </button>
      </div>

      {/* Tenday – left column */}
      <div style={{ overflow: "hidden", minHeight: 0 }}>
        <TendayTable />
      </div>

      {/* Halfday – middle column (auto width, shrinks to content) */}
      <div
        style={{
          overflow: "hidden",
          minHeight: 0,
          display: "flex",
          justifyContent: "center",
          margin: "0 0.75rem",   // ← outside the border
        }}
      >
        <HalfdayTable />
      </div>

      {/* Groups – right column */}
      <div style={{ overflow: "hidden", minHeight: 0 }}>
        <GroupsTable />
      </div>
    </div>
  );
}