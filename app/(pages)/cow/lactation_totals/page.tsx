/**app/(pages)/cow/lactation_totals/page.tsx*/
import LactationTotalsTable from "@/components/panels/Cow/tables/lactation_totals";

export default async function CowLactationTotalsPage({
  searchParams,
}: {
  searchParams: Promise<{ wy_id?: string }>;
}) {
  const { wy_id } = await searchParams;
    return <LactationTotalsTable id="lactation-totals-panel" wy_id={wy_id ?? ""} embedded />;
}