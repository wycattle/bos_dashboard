// components/panels/Cow/CowPanel.tsx
"use client";
import React, { Suspense, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import InputBox from "@/components/shared/InputBox";
import CowPanelTables from "./tables/cow_panel_tables";
import CowPanelPlots from "./plots/cow_panel_plots";

export default function CowPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wy_id = searchParams.get("wy_id") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("wy_id", id);
    else params.delete("wy_id");
    router.push(`${pathname}?${params.toString()}`);
    inputRef.current?.focus();
  };

  return (
    <div>
      {/* Home button */}
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
            background: "#470332",
            color: "#f8fafc",
            border: "1px solid #475569",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ⌂ Home
        </button>
      </div>

      {/* Centered input, to the right of the home button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <InputBox onSubmit={handleSubmit} initialValue={wy_id} />
      </div>

      {wy_id && (
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "1.5rem",
            alignItems: "flex-start",
          }}
        >
          <Suspense fallback={<p>Loading tables...</p>}>
            <CowPanelTables wy_id={wy_id} embedded />
          </Suspense>
          <Suspense fallback={<p>Loading plots...</p>}>
            <CowPanelPlots wy_id={wy_id} embedded />
          </Suspense>
        </div>
      )}
    </div>
  );
}