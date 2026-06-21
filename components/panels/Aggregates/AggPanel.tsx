"use client";
import React from "react";
import { useRouter } from "next/navigation";
import AllxTable from "./AllxTable";

export default function AggPanel() {
  const router = useRouter();
  return (
    <div
      style={{
        height: "100%",
        overflow: "hidden",
        padding: "2.5rem 0.5rem 0.5rem 0.5rem",
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
      <div style={{ overflow: "auto", height: "100%" }}>
        <AllxTable />
      </div>
    </div>
  );
}
