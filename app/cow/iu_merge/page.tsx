"use client";
import { Suspense } from "react";
import IuMergePanel from "@/components/panels/Cow/iu_merge";

export default function IuMergePage() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Suspense fallback={<p>Loading...</p>}>
        <IuMergePanel />
      </Suspense>
    </div>
  );
}