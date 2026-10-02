/** components/panels/Cow/tables/cow_panel_tables.tsx*/
"use client";
import React, { Suspense } from "react";
import IuMergePanel from "./iu_merge";
import MaxDaysPerPeriodPanel from "./max_days_per_period";
import LactationTotalsPanel  from "./lactation_totals";

export default function Tables({ wy_id, embedded }: 
  { wy_id: string; embedded?: boolean }) 
  {
    
  return (
    <div
      style={{
        flex: "1 1 620px",
        maxWidth: "1200px",
        maxHeight: "700px",
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        padding: "0.5rem",
        overflowY: "auto",
        overflowX: "auto"
      }}
    >
      <Suspense fallback={<p>Loading...</p>}>
        <IuMergePanel           wy_id={wy_id} embedded={embedded} />
        <MaxDaysPerPeriodPanel  wy_id={wy_id} embedded={embedded}/>
        <LactationTotalsPanel   wy_id={wy_id} embedded={embedded}/>        
      </Suspense>
    </div>
  );
}