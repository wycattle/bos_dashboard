
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT wy_id, run_date, dates, average, dev_from_avg
      FROM tenday
      ORDER BY run_date DESC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/tenday error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
