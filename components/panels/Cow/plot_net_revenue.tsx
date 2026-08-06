"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface NetRevenuePlotPanelProps {
  wy_id?: string;
  embedded?: boolean;
}

export default function NetRevenuePlotPanel({
  wy_id,
  embedded = false,
}: NetRevenuePlotPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activewy_id = wy_id ?? searchParams.get("wy_id");

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!activewy_id);
  const [error, setError] = useState<string | null>(
    activewy_id ? null : "Missing WY ID"
  );

  useEffect(() => {
    if (!activewy_id) return; 

    fetch(`/api/cow/plots/net_revenue_plot?wy_id=${encodeURIComponent(activewy_id)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setImgUrl(data.url);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, [activewy_id]);

  const backButton = !embedded && (
    <button
      onClick={() => router.push(`/cow?wy_id=${encodeURIComponent(activewy_id ?? "")}`)}
      style={{
        padding: "0.3rem 0.7rem",
        fontSize: "0.8rem",
        fontWeight: 600,
        background: "#1e293b",
        color: "#f8fafc",
        border: "1px solid #475569",
        borderRadius: "6px",
        cursor: "pointer",
        marginBottom: "1rem",
      }}
    >
      ← Back to Cow Panel
    </button>
  );

  const wrapperStyle = { padding: embedded ? "0.5rem" : "1rem" };

  if (loading)
    return (
      <div style={wrapperStyle}>
        {backButton}
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div style={wrapperStyle}>
        {backButton}
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );

  if (!imgUrl)
    return (
      <div style={wrapperStyle}>
        {backButton}
        <p>No plot found for WY ID: {activewy_id}</p>
      </div>
    );

  return (
    <div style={wrapperStyle}>
      {backButton}
      {!embedded && <h2 style={{ color: "#f8fafc" }}>Net Revenue Plot for {activewy_id}</h2>}
      <img
        src={imgUrl}
        alt={`Net revenue plot for WY ${activewy_id}`}
        style={{ maxWidth: "100%", border: "1px solid #475569" }}
      />
    </div>
  );
}