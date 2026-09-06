/** app/api/aggregates/wy_cp_diff/route.ts */
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT
        datex::text AS datex,
        wy, cp, sick_am, sick_pm, heifers_am, heifers_pm,
        heldback_total, wy_x_heldback, wy_minus_cp
      FROM daily_milk_vs_fullday_formatted
      ORDER BY datex ASC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/aggregates/wy_cp_diff error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}