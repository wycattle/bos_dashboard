/** app/api/aggregates/net_income/route.ts */
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT *
      FROM net_income_table_formatted
      WHERE datex >= '2026-01-01'
      ORDER BY datex ASC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/aggregates/net_income error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}