/** components/panels/Cow/plots/cow_panel_plots.tsx */
"use client";
import React, { Suspense } from "react";
import NetRevenuePlotPanel from "./plot_net_revenue";
import LactationPlotsPanel from "./plot_lactations";

export default function Plots({ wy_id, embedded }: { wy_id: string; embedded?: boolean }) {
  return (
    <div style={{ flex: "1 1 620px", maxWidth: "700px" }}>
      <Suspense fallback={<p>Loading...</p>}>
        <NetRevenuePlotPanel wy_id={wy_id} embedded={embedded} />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <LactationPlotsPanel wy_id={wy_id} embedded={embedded} />
      </Suspense>
    </div>
  );
}