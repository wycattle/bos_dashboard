/** app/(pages)/cow/iu_merge/page.tsx */
import IuMergeTable from "@/components/panels/Cow/tables/iu_merge";

export default async function CowIuMergePage({
  searchParams,
}: {
  searchParams: Promise<{ wy_id?: string }>;
}) {
  const { wy_id } = await searchParams;
  return <IuMergeTable wy_id={wy_id ?? ""} embedded />;
}