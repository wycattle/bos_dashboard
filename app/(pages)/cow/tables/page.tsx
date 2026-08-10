/** app/(pages)/cow/tables/page.tsx */
"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { navButtonStyle } from "@/components/shared/tableStyles";
import Tables from "@/components/panels/Cow/tables/cow_panel_tables";

function CowTablesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wy_id = searchParams.get("wy_id") ?? "";

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      {wy_id && <Tables wy_id={wy_id} embedded />}
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