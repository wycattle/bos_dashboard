/** app/(pages)/cow/max_days_per_period/page.tsx */
import Max_days_per_periodTable from "@/components/panels/Cow/tables/max_days_per_period";

export default async function CowMax_days_per_periodPage({
  searchParams,
}: {
  searchParams: Promise<{ wy_id?: string }>;
}) {
  const { wy_id } = await searchParams;
  return <Max_days_per_periodTable wy_id={wy_id ?? ""} embedded />;
}