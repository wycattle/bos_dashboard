/** app/(pages)/aggregates/tables/page.tsx */
"use client";
import { usePathname, useRouter } from "next/navigation";
import Tables from "@/components/panels/Aggregates/aggregates_panel_tables/aggregates_panel_tables";

export default function AggregatesTablesPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <div style={{ display: "flex", gap: "0.5rem" }}>

        <button
          className={`tab-button${pathname === "/aggregates/allx" ? " active" : ""}`}
          onClick={() => router.push("/aggregates/allx")}
        >
          Allx
        </button>

        <button
          className={`tab-button${pathname === "/aggregates/ultrasound" ? " active" : ""}`}
          onClick={() => router.push("/aggregates/ultrasound")}
        >
          Ultrasound
        </button>

        <button
          className={`tab-button${pathname === "/aggregates/ipiv" ? " active" : ""}`}
          onClick={() => router.push("/aggregates/ipiv")}
        >
          Ipiv
        </button>

        <button
          className={`tab-button${pathname === "/aggregates/fullday" ? " active" : ""}`}
          onClick={() => router.push("/aggregates/fullday")}
        >
          Fullday
        </button>

        <button
          className={`tab-button${pathname === "/aggregates/net_revenue" ? " active" : ""}`}
          onClick={() => router.push("/aggregates/net_revenue")}
        >
          Net Revenue
        </button>

        <button
          className={`tab-button${pathname === "/aggregates/cost_x_feed" ? " active" : ""}`}
          onClick={() => router.push("/aggregates/cost_x_feed")}
        >
          Cost X Feed
        </button>

        <button
          className={`tab-button${pathname === "/aggregates/wy_cp_diff" ? " active" : ""}`}
          onClick={() => router.push("/aggregates/wy_cp_diff")}
        >
          WY-CP diff
        </button>        



      </div>

      <Tables />
    </>
  );
}
