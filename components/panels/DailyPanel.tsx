"use client";
import React from "react";
import TendayTable from "./daily/TendayTable";
import HalfdayTable from "./daily/HalfdayTable";
import GroupsTable from "./daily/GroupsTable";

export default function DailyPanel() {
  return (
    <div
      style={{
        // gap on a grid container controls space between its direct children.
        // Outer grid gap = vertical split.
        // Inner grid gap = horizontal split. They're independent.
        display: "grid",
        gridTemplateRows: "3fr 2fr",
        height: "100%",
        gap: "1.5rem", //<- vertical gap betw top-bottom
        overflow: "hidden",
        padding: "1rem", // <- pad from screen edges
      }}
    >
      {/* Top half: TendayTable full width */}
      <div style={{ overflow: "auto", minHeight: 0 }}>
        <TendayTable />
      </div>

      {/* Bottom half: three columns side by side */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 320px",
          gap: "5rem", //<-horiz gap betw panels
          justifyContent: "start", // ← anchor to left
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <div style={{ overflow: "auto", minHeight: 0 }}>
          <HalfdayTable />
        </div>
        <div style={{ overflow: "auto", minHeight: 0 }}>
          <GroupsTable />
        </div>
      </div>
    </div>
  );
}
