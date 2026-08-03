"use client";
import React, { Suspense } from "react";
import PlotPanel from "./plot";

export default function PlotTable({ wy_id, embedded }: { wy_id: string; embedded?: boolean }) {
  return (
    <div style={{ flex: "1 1 620px", maxWidth: "700px" }}>
      <Suspense fallback={<p>Loading...</p>}>
        <PlotPanel wy_id={wy_id} embedded={embedded} />
      </Suspense>
    </div>
  );
}