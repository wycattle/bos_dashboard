"use client";
import { Suspense } from "react";
import PlotPanel from "@/components/panels/Cow/plot";

export default function PlotPage() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Suspense fallback={<p>Loading...</p>}>
        <PlotPanel />
      </Suspense>
    </div>
  );
}