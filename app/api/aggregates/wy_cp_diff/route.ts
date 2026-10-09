/** app/api/aggregates/wy_cp_diff/route.ts */
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT *
      FROM daily_milk_vs_fullday_formatted
      ORDER BY datex ASC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/aggregates/wy_cp_diff error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}