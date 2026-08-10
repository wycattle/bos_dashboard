/** app/(pages)/cow/plots/page.tsx */
"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { navButtonStyle } from "@/components/shared/tableStyles";
import Plots from "@/components/panels/Cow/plots/cow_panel_plots";

function CowPlotsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wy_id = searchParams.get("wy_id") ?? "";

  const handleSubmit = (id: string) => {
    router.push(`/cow/plots?wy_id=${encodeURIComponent(id)}`);
  };

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      {wy_id && <Plots wy_id={wy_id} embedded />}
    </div>
  );
}

export default function CowPlotsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CowPlotsContent />
    </Suspense>
  );
}