"use client";
import { useRouter } from "next/navigation";

export default function CowPanel() {
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
      <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", zIndex: 10, display: "flex", gap: "0.5rem" }}>
        <button onClick={() => router.back()} style={navButtonStyle}>← Back</button>
        <button onClick={() => router.push("/")} style={navButtonStyle}>⌂ Home</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button onClick={() => router.push("/cow/tables")} style={navButtonStyle}>Tables</button>
          <button onClick={() => router.push("/cow/plots")} style={navButtonStyle}>Plots</button>
        </div>
      </div>
    </div>
  );
}

const navButtonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  fontWeight: 600,
  background: "#1e293b",
  color: "#f8fafc",
  border: "1px solid #475569",
  borderRadius: "6px",
  cursor: "pointer",
};