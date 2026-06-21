"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const btn: React.CSSProperties = {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    fontWeight: 600,
    background: "#1e293b",
    color: "#f8fafc",
    border: "1px solid #475569",
    borderRadius: "8px",
    cursor: "pointer",
    width: "220px",
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "1.5rem",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🐄 WY Cattle</h1>
      <button style={btn} onClick={() => router.push("/daily")}>
        📊 Daily Data
      </button>
      <button style={btn} onClick={() => router.push("/aggregates")}>
        🔬 Aggregates
      </button>
      <button style={btn} onClick={() => router.push("/cow")}>
        🐮 Individual Cow
      </button>
    </div>
  );
}
