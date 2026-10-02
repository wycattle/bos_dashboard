/** app/api/cow/max_days_per_period/route.ts */
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
      FROM max_days_per_period_formatted
      WHERE wy_id = ${wy_id}
    `;

    console.log("[api maxdays] raw rows:", JSON.stringify(rows));

    const transposed = (rows as Record<string, unknown>[]).flatMap((record) =>
      Object.entries(record).map(([field, value]) => ({ field, value }))
    );

    console.log("[api maxdays] transposed:", JSON.stringify(transposed));

    return NextResponse.json(transposed, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("API /api/max_days_per_period error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}