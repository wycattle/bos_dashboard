"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
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
          fontSize: "2.5rem",
          margin: 0,
          color: "#abd5e8",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        }}
      >
        WY Cattle
      </h1>
      <div style={{ position: "relative", width: "280px", height: "280px" }}>
        <Image
          src="/images/LeiWithMushrooms.jpeg"
          alt="Cattle"
          width={280}
          height={280}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            border: "8px solid #174457",
          }}
        />
      </div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <button className="btn" onClick={() => router.push("/daily")}>
          Daily Data
        </button>
        <button className="btn" onClick={() => router.push("/aggregates")}>
          Aggregates
        </button>
        <button className="btn" onClick={() => router.push("/cow")}>
          Individual Cow
        </button>
      </div>
    </div>
  );
}