/** app/(pages)/aggregates/wy_cp_diff/page.tsx */
"use client";
import { Suspense } from "react";
import WyCpDiffTable from "@/components/panels/Aggregates/WyCpDiffTable";

export default function WyCpDiffTablePage() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Suspense fallback={<p>Loading...</p>}>
        <WyCpDiffTable />
      </Suspense>
    </div>
  );
}
