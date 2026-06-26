"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const btn: React.CSSProperties = {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    fontWeight: 600,
    background: "#032737",
    color: "#abd5e8",
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
        background: "radial-gradient(ellipse at center, #1c4b5f, #0f2027)",
      }}
    >
      <h1
        style={{
          fontSize: "1.5rem",
          margin: 0,
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        }}
      >
        WY Cattle
      </h1>
      <div style={{ position: "relative", width: "180px", height: "180px" }}>
        <img
          src="/images/LeiWithMushrooms.jpeg"
          alt="Cattle"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #475569",
          }}
        />
      </div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <button style={btn} onClick={() => router.push("/daily")}>
          Daily Data
        </button>
        <button style={btn} onClick={() => router.push("/aggregates")}>
          Aggregates
        </button>
        <button style={btn} onClick={() => router.push("/cow")}>
          Individual Cow
        </button>
      </div>
    </div>
  );
}