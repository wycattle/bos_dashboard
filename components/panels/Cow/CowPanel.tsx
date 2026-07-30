"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputBox from "./InputBox";
import IuMergePanel from "./iu_merge";
import PlotPanel from "./plot";

export default function CowPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentwy_id, setCurrentwy_id] = useState("");

  useEffect(() => {
    const wy_idFromUrl = searchParams.get("wy_id");
    if (wy_idFromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentwy_id(wy_idFromUrl);
    }
  }, [searchParams]);

  const handlewy_idSubmit = (wy_id: string) => {
    setCurrentwy_id(wy_id);
    router.push(`/cow?wy_id=${encodeURIComponent(wy_id)}`);
  };

  return (
    <div
      style={{
        height: "100%",
        overflow: "hidden",
        padding: "2.5rem 0.5rem 0.5rem 0.5rem",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", zIndex: 10 }}>
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
        <InputBox onSubmit={handlewy_idSubmit} initialValue={currentwy_id} />

        {currentwy_id && (
          <p style={{ marginTop: "0.5rem", color: "var(--muted-foreground)" }}>
            Current WY ID: {currentwy_id}
          </p>
        )}

    {currentwy_id && (
      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          flexDirection: "row",
          gap: "1.5rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 620px",
            maxWidth: "700px",
            maxHeight: "400px",
            overflowY: "auto",
            overflowX: "auto",
            border: "1px solid #475569",
            borderRadius: "8px",
          }}
        >
          <Suspense fallback={<p>Loading...</p>}>
            <IuMergePanel wy_id={currentwy_id} embedded />
          </Suspense>
        </div>

        <div style={{ flex: "1 1 620px", maxWidth: "700px" }}>
          <Suspense fallback={<p>Loading...</p>}>
            <PlotPanel wy_id={currentwy_id} embedded />
          </Suspense>
        </div>
      </div>
    )}
      </div>
    </div>
  );
}