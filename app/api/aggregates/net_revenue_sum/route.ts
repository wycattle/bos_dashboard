/** app/api/aggregates/net_revenue_sum/route.ts */
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT *
      FROM net_revenue_sum_table_formatted
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/aggregates/net_revenue_sum error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}