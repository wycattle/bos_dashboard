"use client";
import React, { Suspense } from "react";
import IuMergePanel from "./iu_merge";

export default function Tables({ wy_id, embedded }: { wy_id: string; embedded?: boolean }) {
  return (
    <div
      style={{
        flex: "1 1 620px",
        maxWidth: "700px",
        maxHeight: "400px",
        overflowY: "auto",
        overflowX: "auto",
        border: "1px solid #475569",
        borderRadius: "8px",
      }}
    >
      <Suspense fallback={<p>Loading...</p>}>
        <IuMergePanel wy_id={wy_id} embedded={embedded} />
      </Suspense>
    </div>
  );
}