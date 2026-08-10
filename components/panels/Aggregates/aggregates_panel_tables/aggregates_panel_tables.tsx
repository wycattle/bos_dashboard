/** components/panels/Aggregates/aggregates_panel_tables/aggregates_panel_tables.tsx */
import AllxTable from "../AllxTable";
import IpivTable from "../IpivTable";
import UltrasoundTable from "../UltrasoundTable";

export default function AggregatesTables() {
  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      <AllxTable />
      <IpivTable />
      <UltrasoundTable />
    </div>
  );
}