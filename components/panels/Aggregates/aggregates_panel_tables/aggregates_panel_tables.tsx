/** components/panels/Aggregates/aggregates_panel_tables/aggregates_panel_tables.tsx */

"use client";
import { usePathname } from "next/navigation";
import AllxTable       from "../AllxTable";
import IpivTable       from "../IpivTable";
import UltrasoundTable from "../UltrasoundTable";
import FulldayTable    from "../FulldayTable";
import NetRevenueTable from "../NetRevenueTable";

export default function AggregatesTables() {
  const pathname = usePathname();

  switch (pathname) {
    case "/aggregates/allx":        return <AllxTable />;
    case "/aggregates/ipiv":        return <IpivTable />;
    case "/aggregates/ultrasound":  return <UltrasoundTable />;
    case "/aggregates/fullday":     return <FulldayTable />;
    case "/aggregates/net-revenue": return <NetRevenueTable />;
    default:                        return null; // Tables landing page: show only tab buttons
  }
}