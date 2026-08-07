/** app/(pages)/cow/page.tsx */
"use client";
import { Suspense } from "react";
import CowPanel from "@/components/panels/Cow/CowPanel";

export default function CowPage() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Suspense fallback={<p>Loading...</p>}>
        <CowPanel />
      </Suspense>
    </div>
  );
}