/** app/api/aggregates/cost_x_feed/route.ts */
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT *
      FROM cost_x_feed_formatted
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/aggregates/costxfeed error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}