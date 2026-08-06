"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { navButtonStyle } from "@/components/shared/tableStyles";
import InputBox from "@/components/shared/InputBox";
import Tables from "@/components/panels/Cow/tables";

function CowTablesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wy_id = searchParams.get("wy_id") ?? "";

  const handleSubmit = (id: string) => {
    router.push(`/cow/tables?wy_id=${encodeURIComponent(id)}`);
  };

  return (
    <div style={{ height: "100%", overflow: "hidden", padding: "2.5rem 0.5rem 0.5rem 0.5rem", position: "relative" }}>
      <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", zIndex: 10, display: "flex", gap: "0.5rem" }}>
        <button onClick={() => router.push("/cow")} style={navButtonStyle}>← Cow</button>
        <button onClick={() => router.push("/")} style={navButtonStyle}>⌂ Home</button>
      </div>

      <div style={{ overflow: "auto", height: "100%" }}>
        <InputBox key={wy_id} onSubmit={handleSubmit} initialValue={wy_id} placeholder="Enter WY ID" />
        {wy_id && <Tables wy_id={wy_id} embedded />}
      </div>
    </div>
  );
}

export default function CowTablesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CowTablesContent />
    </Suspense>
  );
}