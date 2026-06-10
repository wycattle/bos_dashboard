"use client";
import React from "react";
import { useRouter } from "next/navigation";
import AllxTable from "./AllxTable";

export default function DailyPanel() {
  const router = useRouter();
  return (
    <div
      style={{
        // gap on a grid container controls space between its direct children.
        // Outer grid gap = vertical split.
        // Inner grid gap = horizontal split. They're independent.
        display: "grid",
        gridTemplateRows: "3fr 2fr",
        height: "100%",
        gap: "2rem", //vertical gap betw panels
        overflow: "hidden",
        padding: "1rem",
        position: "relative",
      }}
    >
      {/* Home button top-left */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            padding: "0.4rem 0.9rem ",
            fontSize: "0.85rem",
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

      {/* Top half: TendayTable full width */}
      <div
        style={{
          overflow: "auto",
          minHeight: 0,
          paddingTop: "4.0rem", //vert space from Home button
        }}
      >
        <AllxTable />
      </div>

      {/* Bottom half: two columns side by side */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "900px",
          gap: "5rem", //<-horiz gap betw panels
          justifyContent: "start", // ← anchor to left
          overflow: "hidden",
          minHeight: 0,
        }}
      ></div>
    </div>
  );
}
