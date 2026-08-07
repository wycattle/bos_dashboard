"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NetRevenuePlotPanel from "./plot_net_revenue";

function LactationPlotsPanel({
  wy_id,
  embedded = false,
}: {
  wy_id?: string;
  embedded?: boolean;
}) {
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

    fetch(`/api/cow/plots/plot_lactations?wy_id=${encodeURIComponent(activewy_id)}`)
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
      ← Back
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
      {!embedded && <h2 style={{ color: "#f8fafc" }}>Lactation Plot for {activewy_id}</h2>}
      <img
        src={imgUrl}
        alt={`Lactation plot for WY ${activewy_id}`}
        style={{ maxWidth: "100%", border: "1px solid #475569" }}
      />
    </div>
  );
}

export default function PlotTable({
  wy_id,
  embedded,
}: {
  wy_id: string;
  embedded?: boolean;
}) {
  const [activePlot, setActivePlot] = useState<"net_revenue" | "lactation" | null>(null);

  const buttonStyle = {
    padding: "0.4rem 0.8rem",
    marginRight: "0.5rem",
    marginBottom: "1rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    background: "#1e293b",
    color: "#f8fafc",
    border: "1px solid #475569",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const selectedStyle = { ...buttonStyle, background: "#3b82f6" };

  return (
    <div style={{ flex: "1 1 620px", maxWidth: "700px" }}>
      <div>
        <button
          onClick={() => setActivePlot("net_revenue")}
          style={activePlot === "net_revenue" ? selectedStyle : buttonStyle}
        >
          Net Revenue Plot
        </button>
        <button
          onClick={() => setActivePlot("lactation")}
          style={activePlot === "lactation" ? selectedStyle : buttonStyle}
        >
          Lactation Plot
        </button>
      </div>

      {activePlot === "net_revenue" && (
        <Suspense fallback={<p>Loading...</p>}>
          <NetRevenuePlotPanel wy_id={wy_id} embedded={embedded} />
        </Suspense>
      )}

      {activePlot === "lactation" && (
        <Suspense fallback={<p>Loading...</p>}>
          <LactationPlotsPanel wy_id={wy_id} embedded={embedded} />
        </Suspense>
      )}
    </div>
  );
}