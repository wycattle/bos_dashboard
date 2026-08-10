/** app/(pages)/aggregates/ultrasound/page.tsx */

"use client";
import { Suspense } from "react";
import UltrasoundTable from "@/components/panels/Aggregates/UltrasoundTable";

export default function UltrasoundTablePage() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Suspense fallback={<p>Loading...</p>}>
        <UltrasoundTable />
      </Suspense>
    </div>
  );
}
