/** app/api/cow/app/api/cow/lactation_totals/route.ts */
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const wy_id = searchParams.get("wy_id");

    if (!wy_id) {
      return NextResponse.json(
        { error: "Missing wy_id parameter" },
        { status: 400 }
      );
    }

    const rows = await sql`
      SELECT *
      FROM lactation_totals_formatted
      WHERE wy_id = ${wy_id}
    `;


    const transposed = rows.flatMap((row) =>
      Object.entries(row).map(([field, value]) => ({ field, value }))
    );

    console.log("[api lactation_totals] raw rows:", JSON.stringify(rows));
    console.log("[api lactation_totals] transposed:", JSON.stringify(transposed));


    return NextResponse.json(transposed, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("API /api/lactation_totals error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}